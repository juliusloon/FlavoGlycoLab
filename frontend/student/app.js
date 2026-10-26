import {mountPaperNotebook} from './paper-notebook.js';
import {mountRetroImport,importedSourceCard} from './retro-import.js';
import {escapeHTML as e} from './ui.js';
import {STORAGE_KEY,STAGES,freshState,freshRun,hydrate,log,clearDownstream,selectRoute,confirmRoute,addMaterial,confirmAssembly,confirmPlan,operate,canVisit,completeRun,exportPayload,markdownRecord,introProgress,answerIntroAct,recordIntroPaper,enterGuided,enterOpen,completeGuided,openWarnings,guidedPlanIssues,redoStageMode,copy} from './lab-state.js';
import {workflow,renderWorkbench,recordsView,amountPreview} from './views/workbench.js';
import {draftLearning,checkLearning,isAdminPass,validAnswer} from './learning-state.js';
import {questProgress,canOpenTask,taskPassed} from './quest-state.js';
import {explorationScene,questPanel,taskView,routeConfirmation,stageEvidenceBanner,caseComparison,bindTaskNarrative,IDENTITY_MODELS,identityDetail} from './views/inquiry.js';
import {compute,comparePlanToRecord} from './analysis-engine.js';
import {bindInquiryTools} from './views/inquiry-tools.js';
import {mountMolecule} from './molecule-viewer.js';
import {mountSiteHeader,updateSiteNavigation,syncSidebarPanels,returnControl,bindReturnNavigation,pageHeader} from './components.js';
import {parsePage,pageAccess,resumePage,LAST_PAGE_KEY} from './navigation.js';
import {overviewPage,unavailablePage} from './views/pages.js';

mountSiteHeader('home',{workbench:true});
bindReturnNavigation();

const main=document.querySelector('#main-content'),rail=document.querySelector('#workflow'),quests=document.querySelector('#quest-panel'),feedback=document.querySelector('#feedback');
const chat=document.querySelector('#chat'),question=document.querySelector('#question'),aiError=document.querySelector('#ai-error');
const evidenceDialog=document.querySelector('#evidence-dialog'),tutor=document.querySelector('#tutor-panel'),tutorLauncher=document.querySelector('#tutor-launcher');
// Follow the response edge even when native scrollbars consume layout width.
function alignTutorLauncher(){
 const response=main.querySelector('.task-rail');
 const right=response?Math.max(0,document.documentElement.clientWidth-response.getBoundingClientRect().right):16;
 tutorLauncher.style.right=`${right}px`;
 document.documentElement.style.setProperty('--notebook-right',`${right}px`);
}
const workspaceLayoutObserver=new ResizeObserver(alignTutorLauncher);
workspaceLayoutObserver.observe(main);
window.addEventListener('resize',alignTutorLauncher);
const openWarningDialog=document.querySelector('#open-warning-dialog'),redoDialog=document.querySelector('#redo-dialog'); // TASK-027 L02
let state=freshState(),content,view='workbench',activeTask=null,selectedSample='',compareId='',toastTimer,runTimer,busy=false,modelConfigured=false,saveError=false,loadWarning='',pendingRoute=null;
let molecule=null,renderVersion=0,highlighted=false,composing=false,replayIntro=false,activeRequest=null,openPaper=null,introRetry={},introShowAct=null; // TASK-031: 导入完成幕的视图记忆（答对停在本幕显示反馈），不入 localStorage。
let analysisTab=1,analysisSamplesOpen=false;
const analysisDrafts=new Map();
let pendingEval=null; // Request owner and immutable submission snapshot; never persisted.
let pendingOpenPlan=null; // TASK-027 L02: 开放探究提交前存在偏差警告时暂存的表单内容。
let pendingPlanBefore=null; // L06-fix: 打开警告对话框前的 plan 快照，放弃时回滚。
let planBaseline=null; // L06-fix: 最近一次确认方案的基线；首次编辑时惰性捕获，continue 成功后重置。
let analyzeMode=false; // TASK-027 L03: 下一轮提问以 kind=analyze 发送（结果解析角色，服务端白名单）。
let page= parsePage(location.hash),routing=false,blockedReason='';
let lastPage='';
try{lastPage=localStorage.getItem(LAST_PAGE_KEY)||'';}catch{}
const incomingRetro=location.hash.startsWith('#retro=')?location.hash.slice(7):null;
if(incomingRetro)history.replaceState(null,'',location.pathname+location.search+'#/');
const incomingNew=location.hash==='#new';
if(incomingNew)history.replaceState(null,'',location.pathname+location.search+'#/resume');
const PREFERENCES_KEY='flavoglycolab.experience.v1';
let reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
try{const stored=localStorage.getItem(STORAGE_KEY);if(stored)state=hydrate(stored);}catch{loadWarning='本机记录无法读取，已打开新的草稿；原存储未覆盖。请先导出备份或确认开始新实验。';saveError=true;}
try{const prefs=JSON.parse(localStorage.getItem(PREFERENCES_KEY)||'{}');if(typeof prefs.reducedMotion==='boolean')reducedMotion=prefs.reducedMotion;}catch{}
document.documentElement.classList.toggle('reduce-motion',reducedMotion);document.querySelector('#reduce-motion').checked=reducedMotion;
let notebook;
const suggestions=['读这三篇论文时，我先关注哪些内容？','帮我检查当前路线需要哪些材料？','我的假设和对照设计是否清楚？','取样前我还应该核对什么？','缺少哪些证据会影响定量分析？','如何区分操作事实和未验证的结论？'];
function setSaveStatus(message,warning=false){
 document.querySelector('#save-status').textContent=message;
 const more=document.querySelector('#workspace-more');more.classList.toggle('has-save-warning',warning);more.title=warning?`更多 · ${message}`:'更多';
}
function save(){
 if(activeRequest&&(activeRequest.run!==state.current||activeRequest.revision!==(state.current.contextRevision??0)))activeRequest.controller.abort();
 // TASK-026: 方案/路线变化时，在途评价一并作废（响应落地校验会丢弃并清除 evaluating 标记）。
 if(pendingEval&&(pendingEval.sentRoute!==state.current.route||pendingEval.sentRevision!==(state.current.contextRevision??0)))cancelEvaluation();
 state.updatedAt=new Date().toISOString();
 if(loadWarning){setSaveStatus('原记录需处理',true);return;}
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));saveError=false;setSaveStatus('已保存于本机');}
 catch{saveError=true;setSaveStatus('保存失败，请导出记录',true);}
}
function toast(message,error=false){feedback.textContent=message;feedback.hidden=false;feedback.classList.toggle('error',error);clearTimeout(toastTimer);toastTimer=setTimeout(()=>feedback.hidden=true,error?9000:4500);}
function guard(fn){const oldStage=state.current.stage;try{fn();if(oldStage!==state.current.stage)activeTask=null;save();render(oldStage!==state.current.stage);}catch(err){toast(err.message,true);}}
function refreshDocks(){
 rail.innerHTML=workflow(state.current);
 const active=content.learning.steps.find(t=>t.id===activeTask);
 quests.innerHTML=questPanel(state.current,content,active&&taskPassed(state.current,active)?null:activeTask);
 for(const button of rail.querySelectorAll('[data-stage]')){
  const stage=Number(button.dataset.stage);
  if(stage>state.current.stage&&Array.from({length:stage},(_,i)=>i).some(i=>!questProgress(state.current,content,i).allComplete))button.disabled=true;
 }
 syncSidebarPanels();
 const reminder=main.querySelector('.stage-task-reminder p');
 if(reminder){const p=questProgress(state.current,content);reminder.textContent=`${p.completed} / ${p.total} 项主线已核对 · ${p.allComplete?'可以继续下一阶段':'完成本阶段探究，再继续实验'}`;}
}
async function attachMolecule(version){
 const element=main.querySelector('#molecule-viewer');if(!element)return;
 const moleculeId=element.dataset.moleculeId||'isoquercitrin';
 try{const next=await mountMolecule(element,{reducedMotion,moleculeId});if(version!==renderVersion||!element.isConnected){next.destroy();return;}molecule=next;
  element.closest('.molecule-stage').querySelector('.structure-source')?.remove();
  const highlight=element.closest('.molecule-stage').querySelector('[data-molecule="highlight"]');
  if(highlight){highlight.disabled=next.data?.atom_groups.sugar.length===0;highlight.setAttribute('aria-pressed','false');}
  const details=document.createElement('details');details.className='structure-source';
  const summary=document.createElement('summary');summary.textContent='结构来源与 SMILES';details.append(summary);
  if(next.data){const link=document.createElement('a');link.href=next.data.source_url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=[next.data.source_id,next.data.crosscheck_id].filter(Boolean).join(' · ');details.append(link);const code=document.createElement('code');code.textContent=next.data.smiles;details.append(code);}
  const sourceHost=main.querySelector('#identity-detail [data-structure-source]')||main.querySelector('#identity-detail')||element.closest('.molecule-stage');
  sourceHost.append(details);
 }catch{toast('三维结构暂不可用，可继续查看案例与身份说明。',true);}
}
function render(moveFocus=false){
 if(!content)return;
 const draftKey=main.dataset.analysisDraftKey;
 if(draftKey){analysisSamplesOpen=main.querySelector('.analysis-samples')?.open??false;const drafts={};main.querySelectorAll('[data-ref-record] textarea,#boundary-note').forEach(el=>drafts[el.closest('[data-ref-record]')?.dataset.refRecord||'boundary']=el.value);analysisDrafts.set(draftKey,drafts);if(analysisDrafts.size>24)analysisDrafts.delete(analysisDrafts.keys().next().value);}

 const run=state.current;
 if(activeTask&&(!canOpenTask(run,content,activeTask)||!content.learning.steps.some(t=>t.id===activeTask&&t.stage===run.stage)))activeTask=null;
 molecule?.destroy();molecule=null;highlighted=false;const version=++renderVersion;
 refreshDocks();
 if(view==='home')main.innerHTML=overviewPage(run,content,resumePage(lastPage,run,content));
 else if(view==='locked'||view==='unknown')main.innerHTML=unavailablePage(blockedReason,resumePage(lastPage,run,content),view==='unknown');
 else if(view==='papers')main.innerHTML=pageHeader({title:'论文对照'})+`<nav class="fg-local-nav" aria-label="论文对照阶段">${STAGES.map((title,i)=>`<a href="#/papers?stage=${i}${page.tab==='analysis'?'&tab=analysis':''}"${page.stage===i?' aria-current="page"':''}>${i+1} ${e(title)}</a>`).join('')}</nav><div class="fg-paper-page">${caseComparison({...run,stage:page.stage},content,page.tab==='analysis'?'analysis':null,{standalone:true})}</div>`;
 else if(view==='records')main.innerHTML=recordsView(state,compareId,content);
 else if(activeTask)main.innerHTML=taskView(run,content,activeTask,run.learning.entries[activeTask]?.eval??null); // TASK-026: 第4参 evalInfo，旧渲染函数忽略不影响兼容。
 else if(run.stage===0)main.innerHTML=page.kind!=='intro'&&!replayIntro&&questProgress(run,content).allComplete?routeConfirmation(run,content):explorationScene(run,content,introRetry,introShowAct??(page.kind==='intro'?page.act:null));
 else{main.innerHTML=stageEvidenceBanner(run,content)+renderWorkbench(run,content,selectedSample);}
 if(view==='workbench'){
  const path=activeTask?`/task/${activeTask}`:run.stage===0&&main.querySelector('.exploration-scene')?`/intro/${introShowAct??(page.kind==='intro'?page.act:Math.min(introProgress(run).step,3))}`:`/stage/${run.stage+1}`;
  if(location.hash!==`#${path}`){
   if(routing)history.replaceState(history.state,'',`#${path}`);
   else history.pushState({fgNavigation:true},'',`#${path}`);
  }
  page=parsePage(`#${path}`);lastPage=path;
  try{localStorage.setItem(LAST_PAGE_KEY,path);}catch{}
 }
 const learning=view==='workbench',workspace=document.querySelector('.workspace');
 workspace.classList.toggle('fg-wide-page',!learning);
 workspace.classList.toggle('fg-reading-page',view==='home');
 document.querySelector('.left-dock').hidden=!learning;
 main.dataset.page=page.kind;
 if(['papers','records','locked','unknown'].includes(view))main.insertAdjacentHTML('afterbegin',returnControl('#/home'));
 if(run.retroImport&&learning)main.insertAdjacentHTML('afterbegin',importedSourceCard(run,content));
 // TASK-026: 评价在途时禁用该任务提交按钮，防止双击重复评价。
 if(pendingEval&&pendingEval.taskId===activeTask){const submit=main.querySelector('.learning-form button[type="submit"]');if(submit)submit.disabled=true;}
 updateSiteNavigation(view==='workbench'?'bench':view);
 document.title=`FlavoGlycoLab · ${{home:'实验总览',records:'实验记录',papers:'论文对照',locked:'尚未解锁',unknown:'页面未找到'}[view]||`${STAGES[run.stage]}${activeTask?` · 任务 ${activeTask}`:''}`}`;
 renderTutor();attachMolecule(version);
 bindInquiryTools(main,{onDraftNote(note){
  if(!activeTask)return;
  const input=main.querySelector('.learning-form textarea[name=note]');if(input){input.value=note;input.dispatchEvent(new Event('input',{bubbles:true}));}
  main.querySelector('.learning-feedback')?.remove();
  main.querySelector('.task-actions button[data-task],.task-actions button[data-action="stage-workspace"]')?.remove();
  save();refreshDocks();toast('假设已带入，可继续编辑，然后提交自查。');
 }});
 bindAnalysisPanels();
 bindTaskNarrative(main,activeTask); // TASK-026: 叙事区分页纯 DOM 绑定，不参与 render()。
 alignTutorLauncher();
 localizeValidation();
 if(moveFocus){main.scrollTo(0,0);main.focus({preventScroll:true});if(innerWidth<=620)window.scrollTo({top:0,behavior:'instant'});}
}
function bindAnalysisPanels(){
 delete main.dataset.analysisDraftKey;
 if(!main.querySelector('[data-analysis-bench]'))return;
 main.querySelector('.analysis-samples').open=analysisSamplesOpen;
 const key=`${state.current.id}:${state.current.contextRevision??0}`;main.dataset.analysisDraftKey=key;
 const drafts=analysisDrafts.get(key)||{};
 main.querySelectorAll('[data-ref-record] textarea,#boundary-note').forEach(el=>el.value=drafts[el.closest('[data-ref-record]')?.dataset.refRecord||'boundary']||el.value);
 const tabs=[...main.querySelectorAll('[data-analysis-tab]')];
 const select=(tab,focus=false)=>{analysisTab=Number(tab.dataset.analysisTab);tabs.forEach(el=>{const chosen=el===tab;el.setAttribute('aria-selected',String(chosen));el.tabIndex=chosen?0:-1;});main.querySelectorAll('[data-bench-round]').forEach(el=>el.hidden=Number(el.dataset.benchRound)!==analysisTab);if(focus)tab.focus();};
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',event=>{let index;if(event.key==='ArrowRight')index=(i+1)%4;else if(event.key==='ArrowLeft')index=(i+3)%4;else if(event.key==='Home')index=0;else if(event.key==='End')index=3;else return;event.preventDefault();select(tabs[index],true);});});
 select(tabs[analysisTab-1]||tabs[0]);
}
function localizeValidation(){
 for(const el of main.querySelectorAll('textarea[minlength]'))syncAnswerValidity(el);
 for(const el of main.querySelectorAll('[required]')){
  const message=el.type==='radio'?'请先选择一个选项。':el.type==='checkbox'?'请先勾选确认项。':'请先完成这一空项。';
  el.addEventListener('invalid',()=>{if(el.validity.valueMissing)el.setCustomValidity(message);});
  const clear=()=>el.setCustomValidity('');
  el.addEventListener('input',clear);el.addEventListener('change',clear);
 }
}
function syncAnswerValidity(el){
 if(!el.matches('textarea[minlength]'))return;
 if(el.name==='note'&&el.form?.classList.contains('learning-form'))el.form.noValidate=isAdminPass(el.value);
 el.dataset.answerMin??=el.getAttribute('minlength');
 el.minLength=isAdminPass(el.value)?0:Number(el.dataset.answerMin);
 el.setCustomValidity('');
}
// TASK-027 L03: 解析结果分区渲染（文献事实／学生自述／机制假设／尚不可判断）。
function analysisBlocks(a){
 if(!a||!a.sections)return '';
 const s=a.sections,sec=(title,items,note)=>items&&items.length?`<div class="analysis-sec"><strong>${e(title)}</strong>${note?` <small>${e(note)}</small>`:''}<ul>${items.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>`:'';
 const facts=(s.literature_facts||[]).map(f=>`${f.parameter} · 文献参照 ${f.reference&&f.reference.text?f.reference.text:'待补'} · ${f.source_id?`[${f.source_id} · ${f.source_locator}]`:'[无来源]'}`);
 const reported=(s.student_report?.reported_statuses||[]).map(h=>`${h.rule_id}: ${h.status}`);
 const selfReport=s.student_report&&s.student_report.text?[`学生自述：${s.student_report.text}`,...(reported.length?[`已核对 ${reported.length} 项参照条件`]:[])]:['（未提供学生现象自述）'];
 const steps=(a.next_steps||[]).map((t,i)=>`${i+1}. ${t}`);
 return `<div class="analysis-blocks">${sec('文献事实',facts)}${sec('学生自述',selfReport)}${sec('机制假设',s.mechanism_hypotheses,'待检验，非已验证因果')}${sec('尚不可判断',s.undetermined)}${sec('下一步建议（对照设计）',steps)}<p class="fine-print">机器解析 · 待教师审定</p></div>`;
}
function renderTutor(){
 const run=state.current,paperLabel=openPaper?content.sources.find(s=>s.source_id===openPaper)?.label||openPaper:'';
 document.querySelector('#tutor-context').innerHTML=`<button type="button" class="tutor-context-button" data-action="tutor-current" title="${activeTask?'返回当前主线任务':'返回当前实验阶段'}">当前：${e(STAGES[run.stage])}${activeTask?` · 主线 ${activeTask}`:''}</button>${openPaper?`<span class="tutor-reading-context">阅读：${e(paperLabel)}</span>`:''}`;
 document.querySelector('#independent-status').textContent=Object.keys(run.learning.independent).length?'你的首次独立判断已单独保留。':!run.aiRequested?'首次提问前，可先提交任务04/09，单独保留你的独立判断。':'本次提问前尚无已提交的独立判断。';
 document.querySelector('#suggest-question').textContent=analyzeMode?'描述你观察到的现象或结果，AI 将按四分区解析…':suggestions[run.stage];
 chat.innerHTML=run.chat.map(m=>`<div class="chat-message ${m.role==='user'?'user':'assistant'}"><span class="message-label">${m.role==='user'?'你':m.mode==='model'?'Qwen · 实时回复':'证据检查 · 系统提示'}${m.contextStage!=null&&m.role!=='user'?` · ${e(STAGES[m.contextStage])}`:''}${m.analysis?' · 结果解析':''}</span><div class="message-text">${e(m.content).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')}</div>${analysisBlocks(m.analysis)}</div>`).join('')||'<p class="chat-empty">从你的想法开始。</p>';
 chat.scrollTop=chat.scrollHeight;
}
function route(moveFocus=true){
 if(!content)return;
 for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close('cancel');
 page=parsePage(location.hash);
 if(page.kind==='redirect'){
  if(page.target.startsWith('./')){location.replace(page.target);return;}
  history.replaceState(history.state,'',`#${page.target}`);route(moveFocus);return;
 }
 if(page.kind==='resume'){history.replaceState(history.state,'',`#${resumePage(lastPage,state.current,content)}`);route(moveFocus);return;}
 const access=pageAccess(page,state.current,content);
 activeTask=null;introShowAct=null;replayIntro=false;
 if(!access.allowed){view=page.kind==='unknown'?'unknown':'locked';blockedReason=access.reason;}
 else if(['home','records','papers'].includes(page.kind))view=page.kind;
 else {
  view='workbench';
  const stage=page.kind==='intro'?0:access.stage;
  if(stage<3&&state.current.operation==='running'){clearTimeout(runTimer);state.current.operation='mixed';log(state.current,'中断流程演练','返回上游步骤');}
  const changed=state.current.stage!==stage;state.current.stage=stage;
  activeTask=page.kind==='task'?page.id:null;
  if(page.kind==='intro')introShowAct=page.act;
  if(changed)save();
 }
 routing=true;render(moveFocus);routing=false;
}
function goStage(stage){
 if(!canVisit(state.current,stage))throw Error('请先完成前面的必要操作。');
 if(stage>state.current.stage&&Array.from({length:stage},(_,i)=>i).some(i=>!questProgress(state.current,content,i).allComplete))throw Error('请先完成前面阶段的主线探究。');
 if(stage<3&&state.current.operation==='running'){clearTimeout(runTimer);state.current.operation='mixed';log(state.current,'中断流程演练','返回上游步骤');}
 state.current.stage=stage;replayIntro=false;activeTask=null;introShowAct=null;view='workbench';page={kind:'stage',stage};save();render(true);
}
function openTask(id){if(!introProgress(state.current).complete)throw Error('先完成导入三步，再开始主线探究。');if(!canOpenTask(state.current,content,id))throw Error('先完成当前任务，再继续下一项。');activeTask=id;view='workbench';introShowAct=null;page={kind:'task',id};render(true);}
function beginQuest(){replayIntro=false;const progress=questProgress(state.current,content),active=progress.tasks.find(t=>t.id===activeTask);openTask(active&&!taskPassed(state.current,active)?active.id:progress.currentId||progress.tasks[0]?.id);}
function requireQuests(){
 const current=state.current.stage;
 for(let stage=0;stage<=current;stage++){
  const progress=questProgress(state.current,content,stage);
  if(progress.allComplete)continue;
  if(stage!==current)goStage(stage);
  openTask(progress.currentId);toast(stage===current?'先完成本阶段主线探究，再继续实验。':'已恢复原有方案；先补齐前序主线，再继续推进。');return false;
 }
 return true;
}
function download(name,body,type){const url=URL.createObjectURL(new Blob([body],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const collect=form=>Object.fromEntries(new FormData(form));
function invalidateAfterTaskEdit(){
 const r=state.current,s=r.stage;
 r.contextRevision=(r.contextRevision??0)+1;
 if((s===0&&r.routeConfirmed)||(s===1&&r.assemblyConfirmed)||(s===2&&r.planConfirmed)||(s===3&&r.analysisReviewed)){
  clearDownstream(r,s,s+1);clearTimeout(runTimer);
 }
}
function passCurrentQuestion(){
 const run=state.current,progress=introProgress(run);
 if(!progress.complete){
  if(!window.confirm('确认跳过当前导入题？这会使用通行词放行，不代表完成了独立判断。'))return;
  const step=progress.step;
  answerIntroAct(run,step,'admin7',true);log(run,'通行词放行',`导入第${step}幕 · admin_override`);
  delete introRetry[step];activeTask=null;view='workbench';introShowAct=step;save();render();return;
 }
 const id=activeTask||questProgress(run,content).currentId;
 if(!id){toast('当前阶段问答已通过。');return;}
 if(activeTask!==id)openTask(id);
 const form=main.querySelector(`.learning-form[data-learning-id="${id}"]`);
 if(!form)return;
 form.elements.note.value='admin7';
 form.elements.note.dispatchEvent(new Event('input',{bubbles:true}));
 form.requestSubmit();
}
main.addEventListener('submit',event=>{
 event.preventDefault();const form=event.target,run=state.current;
 if(form.dataset.introPass){
  if(!isAdminPass(form.elements.passphrase.value)){toast('通行词无效，请继续选择答案。',true);return;}
  passCurrentQuestion();return;
 }
 if(form.classList.contains('learning-form')){
  const id=form.dataset.learningId;
  try{
   if(!canOpenTask(run,content,id))throw Error('请先核对前面的任务。');
   const task=content.learning.steps.find(t=>t.id===id),fields=collect(form);
   const override=isAdminPass(fields.note);
   if(pendingEval?.taskId===id)return;
   if(id==='04'&&!run.route){main.querySelector('[data-route-choice]')?.focus();throw Error('请先选择规划路线，再填写选择依据。');}
   draftLearning(run,id,'note',fields.note||'');if(task.choices.length)draftLearning(run,id,'choice',fields.choice||'');
   checkLearning(run,task);
   if(override)log(run,'通行词放行',`任务${id} · admin_override`);
   if(id==='04')run.reason=run.learning.entries[id].note;
   log(run,'核对主线任务',`${id} ${task.title}；${taskPassed(run,task)?task.choices.length?'自查通过':'思考已记录，待复核':'需重新核对'}`);
   save();
   if(!override)maybeEvaluate(run,id,task);else render();
   const result=main.querySelector('.eval-panel,.learning-feedback');if(result){result.tabIndex=-1;result.focus({preventScroll:true});result.scrollIntoView({block:'nearest',behavior:reducedMotion?'instant':'smooth'});} // 通行词在所有模型/评价状态下优先放行。
  }catch(err){toast(err.message,true);}return;
 }
 if(['route-form','plan-form','analysis-form','reflection-form'].includes(form.id)&&!requireQuests())return;
 if(form.id==='plan-form'&&(run.stageMode??'guided')==='open'){
  // TASK-027 L02 开放探究：与文献参照不同的条件先给警告，由学生选择 继续/放弃/重来。
  const fields=collect(form),warnings=openWarnings(run,fields,content);
  if(warnings.length){pendingOpenPlan=fields;pendingPlanBefore=copy(run.plan);openWarningDialog.querySelector('.warning-list').innerHTML=`<ul>${warnings.map(w=>`<li>「${e(w.parameter)}」与本篇报告条件不同（参照：${e(String(w.reference))}；${e(w.rule.source_id)} ${e(w.rule.source_locator)}）<br>${e(w.text)}</li>`).join('')}</ul>`;openWarningDialog.showModal();return;}
 }
 guard(()=>{
  if(['plan-form','reflection-form'].includes(form.id))for(const [field,value] of Object.entries(collect(form)))if(isAdminPass(value))log(run,'通行词放行',`${form.id}/${field} · admin_override`);
  if(form.id==='route-form'){const reason=run.learning.entries['04']?.note||run.reason;enterGuided(run,content);confirmRoute(run,reason);}
  if(form.classList.contains('material-form')){addMaterial(run,form.dataset.kind,form.elements.material.value);toast('✓ 已加入体系，可继续选择下一项。');}
  if(form.id==='plan-form')confirmPlan(run,collect(form),content);
  if(form.id==='analysis-form'){if(!form.elements.reviewed.checked)throw Error('请确认已区分操作记录和实验观测。');run.analysisReviewed=true;run.stage=5;log(run,'核对分析证据','没有对应观测，定量结果保持未知。');if((run.stageMode??'guided')==='guided')completeGuided(run);} // L02: 走完参照流程即解锁开放探究。
  if(form.id==='reflection-form'){completeRun(state,collect(form));view='records';page=parsePage('#/records');history.pushState({fgNavigation:true},'','#/records');toast('练习记录已保存，可导出或开始新实验。');}
 });
});
main.addEventListener('change',event=>{
 if(event.target.id==='compare-record'){compareId=event.target.value;render();}
 const form=event.target.closest('.material-form');
 if(form){form.classList.remove('added');form.querySelector('button').textContent='加入体系';form.querySelector('button').disabled=!event.target.value;form.querySelector('.material-status').textContent=event.target.value?'已选择，点击旁边按钮加入体系':'请选择材料';}
});
main.addEventListener('input',event=>{
 const el=event.target,run=state.current,form=el.closest('.learning-form');
 syncAnswerValidity(el);
 if(form){try{
  invalidateAfterTaskEdit();draftLearning(run,form.dataset.learningId,el.name,el.value);save();refreshDocks();
  const submit=form.querySelector('button[type="submit"]');submit.disabled=false;submit.removeAttribute('aria-busy');submit.textContent='提交并自查';
  form.setAttribute('aria-busy','false');
  main.querySelectorAll('.learning-status').forEach(el=>el.textContent=saveError?'保存失败，请导出记录':`任务 ${form.dataset.learningId} · 草稿已保存`);
  main.querySelector('.eval-panel')?.remove();main.querySelector('.learning-feedback')?.remove();
  // Editing a checked answer revokes the old forward affordance immediately.
  main.querySelector('.task-actions button[data-task],.task-actions button[data-action="stage-workspace"]')?.remove();
 }catch(err){toast(err.message,true);}return;}
 if(el.closest('#plan-form')){
  if(planBaseline===null)planBaseline=copy(run.plan); // L06-fix: 放弃本次修改时回滚到这次编辑会话前的已确认方案。
  // TASK-026: 方案编辑只失效下游阶段，永不清同阶段已完成记录；未确认时的正常编辑只刷新 AI 上下文。
  if(run.plan[el.name]!==el.value){
    if(run.planConfirmed){clearDownstream(run,3);clearTimeout(runTimer);} // 清 13 及以后并重置 analysis；clearDownstream 自带 revision+1。
    else run.contextRevision=(run.contextRevision??0)+1;
  }
  run.plan[el.name]=el.value;refreshDocks();const output=document.querySelector('#amount-preview'),planForm=el.closest('#plan-form');if(output&&planForm)output.textContent=amountPreview(Object.fromEntries([...planForm.elements].filter(x=>x.name).map(x=>[x.name,x.value]))); // L06-fix: 预览按表单实际值（含锁定参照）。
 }
 if(el.closest('#reflection-form')){run.reflection[el.name]=el.value;run.completed=false;}
 save();
});
function showEvidence(id=null){evidenceDialog.innerHTML=caseComparison(state.current,content,id);if(!evidenceDialog.open)evidenceDialog.showModal();}
async function togglePaper(button){
 const sourceId=button.dataset.openPaper,panel=button.closest('.paper-view, .paper-digest')?.querySelector('.paper-panel');
 if(!panel){toast('此入口暂未提供论文 PDF 在线阅读。',true);return;}
 if(!panel.hidden){panel.hidden=true;button.setAttribute('aria-expanded','false');button.textContent='在线阅读论文 PDF';openPaper=null;renderTutor();return;}
 panel.hidden=false;button.setAttribute('aria-expanded','true');button.textContent='收起论文 PDF';openPaper=sourceId;renderTutor();
 const status=panel.querySelector('.paper-status'),frame=panel.querySelector('iframe');
 if(frame.src)return;
 status.hidden=false;status.className='paper-status';status.textContent='正在加载论文 PDF…';
 const slowTimer=setTimeout(()=>{status.hidden=false;status.className='paper-status';status.textContent='加载较慢；若持续无显示，请稍后重试。';},8000);
 try{
  const head=await fetch(`./api/paper/${sourceId}`,{method:'HEAD'});
  if(!head.ok||!(head.headers.get('Content-Type')||'').includes('application/pdf'))throw Error('unavailable');
  frame.addEventListener('load',()=>{clearTimeout(slowTimer);status.hidden=true;},{once:true});
  frame.src=`./api/paper/${sourceId}`;
 }catch{
  clearTimeout(slowTimer);status.className='paper-status error';status.textContent='此入口暂未提供论文 PDF 在线阅读。';
 }
}
function applyRoute(id){cancelEvaluation();clearTimeout(runTimer);selectRoute(state.current,id);state.current.exploration={...(state.current.exploration||{}),revealed:true,routeChosen:true};activeTask='04';view='workbench';evidenceDialog.close();save();render();toast('规划路线已更新，前三步学习记录已保留。');}
function chooseRoute(id){
 if(id===state.current.route){state.current.exploration={...(state.current.exploration||{}),revealed:true,routeChosen:true};evidenceDialog.close();save();render();toast('已确认这条规划路线。');return;}
 if(state.current.routeConfirmed||state.current.stage>0){pendingRoute=id;evidenceDialog.close();document.querySelector('#route-change-dialog').showModal();}
 else applyRoute(id);
}
// Keep the fixed tutor in the top layer and inside the active modal's focus scope.
function syncTutorLayer(){
 const modal=[...document.querySelectorAll('dialog[open]')].findLast(dialog=>dialog.matches(':modal'));
 const parent=modal||document.body;
 for(const element of [tutorLauncher,tutor]){
  if(element.parentElement!==parent){element.hidePopover();parent.append(element);}
  if(!element.hidden&&!element.matches(':popover-open'))element.showPopover();
 }
}
const tutorLayerObserver=new MutationObserver(syncTutorLayer);
for(const dialog of document.querySelectorAll('dialog'))tutorLayerObserver.observe(dialog,{attributes:true,attributeFilter:['open']});
syncTutorLayer();
function toggleTutor(open){
 if(!open)tutor.hidePopover();
 tutor.hidden=!open;tutorLauncher.setAttribute('aria-expanded',String(open));
 syncTutorLayer();
 if(open){renderTutor();question.focus();}
 else tutorLauncher.focus();
}
tutor.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();toggleTutor(false);}});
function click(event){
 const gapInput=event.target.closest('input[data-action="analysis-add-gap"]');
 if(gapInput){ // TASK-026 回合4：勾选/取消证据缺口。
  const run=state.current,gap=gapInput.dataset.gap;
  if(gapInput.checked){if(!run.analysis.gaps.includes(gap)){run.analysis.gaps.push(gap);log(run,'记录证据缺口',gap);}}
  else run.analysis.gaps=run.analysis.gaps.filter(g=>g!==gap);
  save();render();return;
 }
 const el=event.target.closest('button');if(!el||el.disabled)return;
 if(el.hasAttribute('data-close-dialog')){el.closest('dialog')?.close();return;}
 if(el.dataset.act&&el.dataset.choice){
  const step=Number(el.dataset.act),block=step===1?content.intro.case:content.intro.chemical_limit,q=block?.question;
  if(!q)return;
  try{
   if(el.dataset.choice===q.answer){answerIntroAct(state.current,step,el.dataset.choice,true);delete introRetry[step];introShowAct=step;} // TASK-031: 停在本幕显示成功反馈，进入下一幕由 intro-advance 显式推进。
   else introRetry[step]=true;
   save();render();
  }catch(error){toast(error.message,true);}
  return;
 }
 if(el.dataset.task){try{openTask(el.dataset.task);}catch(error){toast(error.message,true);}return;}
 if(el.dataset.notebook){notebook?.open(el.dataset.notebook);return;}
 if(el.dataset.case){if(view==='workbench'&&state.current.stage===0&&!activeTask){recordIntroPaper(state.current,el.dataset.case);save();}showEvidence(el.dataset.case);return;}
 if(el.dataset.openPaper){togglePaper(el);return;}
 if(el.dataset.paperAsk){ // TASK-026 P3：带论文上下文问文献导师。
  openPaper=el.dataset.paperAsk;tutorRole='literature_analyst';
  question.value='请结合这篇论文解读本步任务';
  evidenceDialog.close();toggleTutor(true);renderTutor();return;
 }
 if(el.dataset.compareRoute){if(view==='papers'&&!el.closest('dialog')){history.pushState({fgNavigation:true},'',`#/papers?stage=${page.stage}${el.dataset.compareRoute==='analysis'?'&tab=analysis':''}`);route(true);}else showEvidence(el.dataset.compareRoute==='all'?null:el.dataset.compareRoute);return;}
 if(el.dataset.chooseRoute){chooseRoute(el.dataset.chooseRoute);return;}
 if(el.dataset.molecule){if(!molecule)return;if(el.dataset.molecule==='reset'){molecule.reset();highlighted=false;}else{highlighted=!highlighted;molecule.highlight(highlighted?'sugar':null);}const button=main.querySelector('[data-molecule="highlight"]');button?.setAttribute('aria-pressed',String(highlighted));if(button)button.textContent=highlighted?'糖基已高亮 · 取消':'聚焦糖基';return;}
 if(el.dataset.identity!=null){
  const i=Number(el.dataset.identity);if(!IDENTITY_MODELS[i])return;
  main.querySelectorAll('[data-identity]').forEach(b=>{b.classList.toggle('active',b===el);b.setAttribute('aria-pressed',String(b===el));});
  main.querySelector('#identity-detail').innerHTML=identityDetail(content,i);
  molecule?.destroy();molecule=null;highlighted=false;
  const viewer=main.querySelector('#molecule-viewer');viewer.dataset.moleculeId=IDENTITY_MODELS[i];
  viewer.closest('.molecule-stage').querySelector('.structure-source')?.remove();
  attachMolecule(++renderVersion);return;
 }
 if(el.dataset.stage!=null){guard(()=>goStage(Number(el.dataset.stage)));return;}
 if(el.dataset.remove){guard(()=>{clearDownstream(state.current,1);delete state.current.materials[el.dataset.remove];log(state.current,'移除材料',el.dataset.remove);});return;}
 if(el.dataset.operate){guard(()=>{const run=state.current;operate(run,el.dataset.operate);if(el.dataset.operate==='start'){clearTimeout(runTimer);runTimer=setTimeout(()=>{if(state.current===run&&run.operation==='running'){operate(run,'finish');save();render();toast('流程演练就绪，可以建立取样记录。');}},2200);}});return;}
 if(el.dataset.sample){selectedSample=el.dataset.sample;render();return;}
 const action=el.dataset.action;if(!action)return;
 if(action==='new'){document.querySelector('#confirm-dialog').showModal();return;}
 if(action==='tutor'){evidenceDialog.close();toggleTutor(true);return;}
 if(action==='tutor-current'){
  try{if(view!=='workbench')goStage(state.current.stage);toggleTutor(false);main.scrollTo({top:0,behavior:reducedMotion?'instant':'smooth'});main.focus({preventScroll:true});}
  catch(error){toast(error.message,true);}return;
 }
 if(action==='intro-tutor'){question.value=content.intro.papers_gate.tutor_prompt;toggleTutor(true);return;}
 if(action==='ask-task-tutor'){const id=el.dataset.taskId,task=content.learning.steps.find(t=>t.id===id);question.value=`我在做任务${id}「${task?.title||''}」（${state.current.route}）：${task?.coach_question||task?.prompt||''}\n我的当前想法：${state.current.learning.entries[id]?.note||'尚未填写'} `.slice(0,2000);toggleTutor(true);return;}
 if(action==='ask-tutor-eval'){ // TASK-026：评价未达标时带着问题问导师。
  const id=el.dataset.taskId,task=content.learning.steps.find(t=>t.id===id);
  question.value=task?.coach_question||`我在任务${id}的导师评价暂未达标，请结合评价面板中的未命中要点与改进建议帮我分析。`;
  toggleTutor(true);return;
 }
 if(action==='analyze-results'){ // TASK-027 L03：下一轮提问以结果解析协议发送。
  analyzeMode=true;question.value='';question.placeholder='描述你观察到的现象或结果（无观测也请如实说明）…';
  toggleTutor(true);renderTutor();return;
 }
 if(action==='analysis-select-ref'){ // TASK-026 回合1：选参照记录（限本路线、≤3 张、理由≥8字）。
  const run=state.current,recordId=el.dataset.recordId;
  try{
   const record=content.data_query.records.find(r=>r.id===recordId);
   if(!record||record.route!==run.route)throw Error('只能选择本路线的记录作为参照。');
   if(run.analysis.refRecords.some(r=>r.recordId===recordId))throw Error('该记录已选为参照。');
   if(run.analysis.refRecords.length>=3)throw Error('最多选择 3 张参照记录，请先完成对照再调整。');
   const reason=el.closest('.ref-record')?.querySelector('textarea')?.value.trim()||'';
   if(!validAnswer(reason))throw Error('请写明选择理由（至少8字）。');
   if(isAdminPass(reason))log(run,'通行词放行','参照理由 · admin_override');
   run.analysis.refRecords.push({recordId,reason,ts:new Date().toISOString()});
   run.analysis.comparisons=null;
   log(run,'选择文献参照',`${recordId}：${reason.slice(0,50)}`);
   save();render();
  }catch(err){toast(err.message,true);}
  return;
 }
 if(action==='analysis-compare'){ // TASK-026 回合2：重算当前参照集的条件对照并存档。
  const run=state.current;
  run.analysis.comparisons=run.analysis.refRecords.map(ref=>{
   const record=content.data_query.records.find(r=>r.id===ref.recordId);
   return record?{recordId:ref.recordId,...comparePlanToRecord(run.plan,record)}:null;
  }).filter(Boolean);
  save();render();return;
 }
 if(action==='analysis-calc'){ // TASK-026 回合3：白名单计算，去重记录。
  const select=main.querySelector('#calc-select'),id=select?.value;
  if(!id){toast('请先在下拉列表选择一项白名单计算。',true);return;}
  try{
   const result=compute(id,Object.fromEntries(content.data_query.records.map(r=>[r.id,r])));
   if(result.result===null)throw Error('该计算的原文记录缺失，无法计算。');
   if(!state.current.analysis.calculations.some(c=>c.id===id))state.current.analysis.calculations.push(result);
   log(state.current,'白名单计算',`${id} → ${result.result} ${result.unit}`);
   save();render();
  }catch(err){toast(err.message,true);}
  return;
 }
 if(action==='analysis-boundary'){ // TASK-026 回合4：边界说明（≥15字）。
  const note=main.querySelector('#boundary-note')?.value.trim()||'';
  try{
   if(!validAnswer(note,15))throw Error('边界说明至少15字，请写清哪些数值只是文献参照。');
   if(isAdminPass(note))log(state.current,'通行词放行','分析边界 · admin_override');
   state.current.analysis.boundaryNote=note;state.current.analysis.boundaryDone=true;
   log(state.current,'记录分析边界',note.slice(0,50));
   save();render();
  }catch(err){toast(err.message,true);}
  return;
 }
 if(action==='compare'){showEvidence();return;}
 if(action==='intro-advance'){introShowAct=Math.min(introProgress(state.current).step,3);page={kind:'intro',act:introShowAct};render(true);return;}
  if(action==='begin-quest'){try{beginQuest();}catch(error){toast(error.message,true);}return;}
 if(action==='stage-workspace'){replayIntro=false;activeTask=null;view='workbench';introShowAct=null;page={kind:'stage',stage:state.current.stage};render(true);return;}
 if(action==='replay-intro'){
  document.querySelector('#settings-dialog').close();if(state.current.stage!==0){goStage(0);}state.current.exploration={step:1,papers:[]};introRetry={};introShowAct=1;replayIntro=true;activeTask=null;view='workbench';page={kind:'intro',act:1};save();
  // Replay is a view preference and must not clear completed answers.
  render(true);return;
 }
 if((action==='assembly'||action==='analysis')&&!requireQuests())return;
 guard(()=>{
  if(action==='enter-guided'){enterGuided(state.current,content);toast('已进入参照练习：关键条件按文献定位锁定。');}
  if(action==='enter-open'){enterOpen(state.current);toast('已进入开放探究：调整参数仅作参照提示，不推断后果。');}
  if(action==='reveal'){state.current.exploration={...(state.current.exploration||{}),revealed:true};log(state.current,'展开三种思路','比较三项研究，不改变路线选择。');}
  if(action==='assembly')confirmAssembly(state.current);
  if(action==='back')goStage(Math.max(0,state.current.stage-1));
  if(action==='analysis'){goStage(4);selectedSample=state.current.samples[0]?.id??'';}
  if(action==='workbench'){view='workbench';activeTask=null;page={kind:'stage',stage:state.current.stage};}
  if(action==='export-json'){const payload=exportPayload(state);if(loadWarning){try{payload.unreadableLocalBackup=localStorage.getItem(STORAGE_KEY);}catch{}}download('FlavoGlycoLab-实验记录.json',JSON.stringify(payload,null,2),'application/json');}
  if(action==='export-md')download('FlavoGlycoLab-实验记录.md',markdownRecord(state.current),'text/markdown;charset=utf-8');
  if(action==='reload')location.reload();
  if(action==='redo')redoDialog.showModal();
 });
}
document.addEventListener('click',click);
document.querySelector('#confirm-dialog').addEventListener('close',event=>{if(event.target.returnValue!=='confirm')return;clearTimeout(runTimer);loadWarning='';state.current=freshRun();selectedSample='';activeTask=null;openPaper=null;introRetry={};introShowAct=1;view='workbench';page={kind:'intro',act:1};aiError.textContent='';save();render(true);toast('新实验已就绪，历史练习仍保留。');});
evidenceDialog.addEventListener('close',()=>{
 renderTutor();
 // Only the intro gate needs a refresh after closing a paper dialog; never rebuild forms mid-edit.
 if(!activeTask&&main.querySelector('.gate-row'))render(false);
});
document.querySelector('#route-change-dialog').addEventListener('close',event=>{if(event.target.returnValue==='confirm'&&pendingRoute)applyRoute(pendingRoute);pendingRoute=null;});
// TASK-027 L02/L06-fix 开放探究警告三选：三个按钮直接绑定动作（顶层一次注册，每次打开都有效）。
// abandon 回滚打开对话框前的 plan 草稿快照，与"原方案保持不变"提示一致。
for(const button of openWarningDialog.querySelectorAll('[data-open-decision]')){
 button.addEventListener('click',()=>{
  const decision=button.dataset.openDecision,fields=pendingOpenPlan,planBefore=pendingPlanBefore;
  pendingOpenPlan=null;pendingPlanBefore=null;
  if(decision==='continue'&&fields)guard(()=>{confirmPlan(state.current,fields,content);planBaseline=null;}); // 确认成功后旧基线作废。
  else if(decision==='abandon'){state.current.plan=copy(planBaseline??planBefore??state.current.plan);save();render();toast('已放弃本次修改，原方案与记录保持不变。');}
  else if(decision==='redo')redoDialog.showModal();
 });
}
redoDialog.addEventListener('close',()=>{ // 重来：已提示影响；保留快照、同阶段输入保留、下游按修订号失效。
 if(redoDialog.returnValue!=='confirm')return;
 guard(()=>{redoStageMode(state);toast('已重来本阶段：快照已保存，下游结果与旧 AI 回复已按修订号失效。');});
});
document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();main.focus();});
tutorLauncher.addEventListener('click',()=>toggleTutor(tutor.hidden));document.querySelector('#close-tutor').addEventListener('click',()=>toggleTutor(false));
document.querySelector('#reduce-motion').addEventListener('change',event=>{reducedMotion=event.target.checked;document.documentElement.classList.toggle('reduce-motion',reducedMotion);try{localStorage.setItem(PREFERENCES_KEY,JSON.stringify({reducedMotion}));}catch{toast('偏好未能保存，本次设置仍然有效。',true);}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!tutor.hidden&&!document.querySelector('dialog[open]')){toggleTutor(false);event.preventDefault();}});
document.querySelector('#suggest-question').addEventListener('click',()=>{question.value=suggestions[state.current.stage];question.focus();});
question.addEventListener('input',()=>{document.querySelector('#send-question').disabled=busy&&!isAdminPass(question.value);});
// One request owns one immutable submission; cancelling never renders another task.
function cancelEvaluation(){
 const pending=pendingEval;if(!pending)return;
 pendingEval=null;pending.controller.abort();
 const entry=pending.run.learning.entries[pending.taskId];
 if(entry?.eval?.evalId===pending.evalId)entry.eval={state:'degraded',reason:'interrupted'};
}
function evaluationIsCurrent(pending){
 const {run,taskId,entry,note,choice,checkedAt,sentRevision,sentRoute}=pending;
 return pendingEval===pending&&state.current===run&&run.route===sentRoute&&
  (run.contextRevision??0)===sentRevision&&run.learning.entries[taskId]===entry&&
  entry.status==='recorded'&&entry.checkedAt===checkedAt&&entry.note===note&&entry.choice===choice;
}
async function maybeEvaluate(run,taskId,task){
 const entry=run.learning.entries[taskId];
 if(!entry||entry.status!=='recorded'||isAdminPass(entry.note))return;
 cancelEvaluation();
 if(!modelConfigured){entry.eval={state:'degraded',reason:'unavailable'};save();render();return;}
 const evalId=globalThis.crypto?.randomUUID?.()||`eval-${Date.now()}-${Math.random().toString(36).slice(2)}`;
 const controller=new AbortController();
 const pending={evalId,taskId,run,entry,note:entry.note,choice:entry.choice,checkedAt:entry.checkedAt,
  sentRoute:run.route,sentRevision:run.contextRevision??0,controller};
 pendingEval=pending;entry.eval={state:'evaluating',evalId,ts:new Date().toISOString()};
 save();render();
 const context={route:run.route,stage:run.stage,reason:run.reason||run.learning.entries['04']?.note||'',plan:JSON.stringify(run.plan),operation:run.operation,reflection:JSON.stringify(run.reflection),task:{id:taskId,title:task?.title||''}};
 const history=run.chat.map(m=>({role:m.role,content:m.content})).slice(-6);
 const timeout=setTimeout(()=>controller.abort(),55000);
 try{
  const response=await fetch('./api/tutor',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,
   body:JSON.stringify({kind:'evaluate',question:'',context,history,evaluation:{task_id:taskId,eval_id:evalId,submission:{choice:pending.choice??null,note:pending.note},context_revision:pending.sentRevision}})});
  const data=await response.json();if(!response.ok)throw Error('评价服务暂时不可用。');
  if(!evaluationIsCurrent(pending))return;
  const evaluation=data.evaluation,mode=data.mode;
  if(evaluation?.eval_id!==evalId)throw Error('评价回复与提交不匹配。');
  if(mode==='model'||mode==='eval_preflight'){
   const passed=mode==='model'&&evaluation.pass===true;
   entry.eval={state:passed?'passed':'failed',pass:passed,rubricHits:evaluation.rubric_hits??[],missing:evaluation.missing??[],guidance:evaluation.guidance??[],evidenceRefs:evaluation.evidence_refs??[],mode,evaluatedAt:new Date().toISOString()};
  }else entry.eval={state:'degraded',reason:mode??'eval_unparsed'};
 }catch(error){
  if(evaluationIsCurrent(pending))entry.eval={state:'degraded',reason:error.name==='AbortError'?'timeout':'network'};
 }finally{
  clearTimeout(timeout);
  if(pendingEval===pending){
   pendingEval=null;save();
   if(view==='workbench'&&activeTask===taskId)render();else refreshDocks();
  }
 }
}
async function askTutor(event,role='coach'){
 event.preventDefault();
 const text=question.value.trim();if(!text)return;
 if(isAdminPass(text)){question.value='';analyzeMode=false;passCurrentQuestion();return;}
 if(busy)return;
 const analyze=analyzeMode;analyzeMode=false; // TASK-027 L03: 一次性解析模式，发送后即复位。
 if(!modelConfigured){aiError.textContent='模型服务尚未就绪，请稍后刷新重试。实验台仍可继续操作。';return;}
 busy=true;document.querySelector('#send-question').disabled=true;aiError.textContent=analyze?'解析员正在按四分区组织证据…':'导师正在结合当前方案思考…';
 const run=state.current,sentRoute=run.route,sentStage=run.stage,sentRevision=run.contextRevision??0;
 run.aiRequested=true;
 const context={route:run.route,stage:run.stage,reason:run.reason||run.learning.entries['04']?.note||'',plan:JSON.stringify(run.plan),operation:run.operation,reflection:JSON.stringify(run.reflection),
  task:activeTask?{id:activeTask,title:content.learning.steps.find(t=>t.id===activeTask)?.title||''}:null,
  paper:openPaper?{source_id:openPaper}:null};
 // TASK-027 L03：解析模式只传路线/阶段/学生自述/规则命中ID+状态；来源与观测由服务端按ID组装。
 let analysisPayload=null;
 if(analyze){
  const mode=run.stageMode??'guided',hits=[];
  if(mode==='guided'){for(const issue of guidedPlanIssues(run,run.plan,content))hits.push({rule_id:issue.rule.rule_id,status:issue.status});}
  else{for(const warning of openWarnings(run,run.plan,content))hits.push({rule_id:warning.rule.rule_id,status:'deviation'});}
  analysisPayload={route:run.route,stage_mode:mode,student_report:text,rule_hits:hits};
 }
 const history=run.chat.map(m=>({role:m.role,content:m.content})).slice(-6);
 run.chat.push({role:'user',content:text,at:new Date().toISOString(),contextStage:sentStage});run.chat=run.chat.slice(-30);save();renderTutor();question.value='';
 const aborter=new AbortController(),timeout=setTimeout(()=>aborter.abort(),55000);
 activeRequest={controller:aborter,run,revision:sentRevision};
 try{
  const body=analyze?{kind:'analyze',question:text,analysis:analysisPayload}:{question:text,role,context,history};
  const response=await fetch('./api/tutor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:aborter.signal});
  const data=await response.json();if(!response.ok)throw Error(data.error||'模型服务暂时不可用。');
  const validModes=analyze?['model','output_guard','evidence_guard','no_data']:['model','output_guard','evidence_guard'];
  if(typeof data.answer!=='string'||!validModes.includes(data.mode))throw Error('模型响应格式无效，请重试。');
  if(analyze&&!data.analysis)throw Error('解析响应缺少分区证据，请重试。');
  if(state.current!==run||run.route!==sentRoute||(run.contextRevision??0)!==sentRevision){aiError.textContent='实验上下文已改变，已舍弃上一方案的回复。';return;}
  run.chat.push({role:'assistant',content:data.answer,mode:data.mode,model:data.model??null,analysis:data.analysis??null,at:new Date().toISOString(),contextStage:sentStage,contextSnapshot:context});run.chat=run.chat.slice(-30);save();renderTutor();aiError.textContent='';
 }catch(error){
  if(state.current!==run||run.route!==sentRoute||(run.contextRevision??0)!==sentRevision){aiError.textContent='方案已改变，已取消上一方案的请求。';return;}
  aiError.textContent=error.name==='AbortError'?'模型响应超时，请稍后重试。':(error.message||'网络暂时不可用，请重试。');if(state.current===run&&!question.value)question.value=text;}
 finally{clearTimeout(timeout);activeRequest=null;busy=false;document.querySelector('#send-question').disabled=false;}
}
let tutorRole='coach'; // TASK-026: data-paper-ask 以文献分析师角色发起下一轮提问。
document.querySelector('#chat-form').addEventListener('submit',event=>{askTutor(event,tutorRole);tutorRole='coach';});
question.addEventListener('compositionstart',()=>composing=true);question.addEventListener('compositionend',()=>composing=false);
question.addEventListener('keydown',event=>{if(event.key!=='Enter'||event.shiftKey||event.isComposing||composing||event.keyCode===229)return;event.preventDefault();document.querySelector('#chat-form').requestSubmit();});
window.addEventListener('hashchange',()=>route(true));
document.addEventListener('click',event=>{
 const skip=event.target.closest('.skip-link');
 if(skip){event.preventDefault();main.focus();main.scrollTo(0,0);return;}
 const link=event.target.closest('a[href^="#/"]');
 if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 event.preventDefault();const hash=link.getAttribute('href');
 if(link.hasAttribute('data-close-dialog'))link.closest('dialog')?.close('cancel');
 if(hash!==location.hash)history.pushState({fgNavigation:true},'',hash);
 route(true);
});
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY){toast('另一个标签页修改了记录。请导出当前草稿后刷新，避免覆盖。',true);loadWarning='检测到其他标签页更新，暂停自动保存。';setSaveStatus('其他标签页已更新',true);}});
async function init(){
 try{const response=await fetch('./content/demo-content.json');if(!response.ok)throw Error();content=await response.json();if(!Array.isArray(content.routes)||content.routes.length!==3)throw Error();route(false);save();if(loadWarning)toast(loadWarning,true);if(saveError&&!loadWarning)toast('浏览器未能保存记录，请使用导出功能保留本次操作。',true);}
 catch{main.innerHTML='<div class="load-error"><h1>实验内容暂时无法加载</h1><p>检查网络连接后重试，本机记录不会被清空。</p><button class="button primary" data-action="reload">重新加载</button></div>';return;}
 notebook=mountPaperNotebook({dialog:document.querySelector('#paper-notebook'),launcher:document.querySelector('#notebook-launcher'),content,getRun:()=>state.current,
  onNote(id,note){state.current.paperNotes??={};state.current.paperNotes[id]=note.slice(0,8000);save();return !saveError&&!loadWarning;},
  onRead(id){openPaper=id;renderTutor();}
 });
 const retro=mountRetroImport({content,getRun:()=>state.current,attach(value){state.current.retroImport=value;log(state.current,'接收逆合成来源',value.packet.selection.source_id);save();render();toast('计算来源已附到当前练习。');},onPapers:()=>{showEvidence();if(!introProgress(state.current).complete)for(const button of evidenceDialog.querySelectorAll('[data-choose-route]')){button.disabled=true;button.textContent='完成分子导入后选择路线';}},onExport:packet=>download('FlavoRetro-handoff.json',JSON.stringify(packet,null,2),'application/json'),onError:message=>toast(message,true)});
 if(incomingNew){document.querySelector('#workspace-more').focus();document.querySelector('#confirm-dialog').showModal();}
 if(incomingRetro){try{if(incomingRetro.length>72000)throw Error();await retro.receive(JSON.parse(decodeURIComponent(incomingRetro)));}catch{toast('交接链接无效，请使用导出的 JSON 文件。',true);}}
 try{const response=await fetch('./api/health' ,{signal:AbortSignal.timeout(6000)});if(!response.ok)throw Error();const data=await response.json();modelConfigured=data.configured===true;document.querySelector('#ai-status').textContent=modelConfigured?'Qwen · 实时辅导':'模型尚未配置 · 本机练习可继续';}
 catch{document.querySelector('#ai-status').textContent='模型连接不可用 · 实验台可继续';aiError.textContent='辅导服务不可用，实验操作仍可继续。';}
}
init();
