import {escapeHTML as e} from './ui.js';
import {STORAGE_KEY,STAGES,freshState,freshRun,hydrate,log,clearDownstream,selectRoute,confirmRoute,addMaterial,confirmAssembly,confirmPlan,operate,canVisit,completeRun,exportPayload,markdownRecord,introProgress,answerIntroAct,recordIntroPaper,enterGuided,enterOpen,completeGuided,openWarnings,guidedPlanIssues,redoStageMode,copy} from './lab-state.js';
import {workflow,renderWorkbench,recordsView,amountPreview} from './views/workbench.js';
import {draftLearning,checkLearning} from './learning-state.js';
import {questProgress,canOpenTask,taskPassed} from './quest-state.js';
import {explorationScene,questPanel,taskView,routeConfirmation,stageEvidenceBanner,caseComparison,bindTaskNarrative} from './views/inquiry.js';
import {compute,comparePlanToRecord} from './analysis-engine.js';
import {bindInquiryTools} from './views/inquiry-tools.js';
import {mountMolecule} from './molecule-viewer.js';

const main=document.querySelector('#main-content'),rail=document.querySelector('#workflow'),quests=document.querySelector('#quest-panel'),feedback=document.querySelector('#feedback');
const chat=document.querySelector('#chat'),question=document.querySelector('#question'),aiError=document.querySelector('#ai-error');
const evidenceDialog=document.querySelector('#evidence-dialog'),tutor=document.querySelector('#tutor-panel'),tutorLauncher=document.querySelector('#tutor-launcher');
const openWarningDialog=document.querySelector('#open-warning-dialog'),redoDialog=document.querySelector('#redo-dialog'); // TASK-027 L02
let state=freshState(),content,view='workbench',activeTask=null,selectedSample='',compareId='',toastTimer,runTimer,busy=false,modelConfigured=false,saveError=false,loadWarning='',pendingRoute=null;
let molecule=null,renderVersion=0,highlighted=false,composing=false,replayIntro=false,activeRequest=null,openPaper=null,introRetry={};
let pendingEval=null; // TASK-026: 内存态评价在途信息 {evalId,taskId,sentRoute,sentRevision,noteHash,checkedAtSnapshot}。
let pendingOpenPlan=null; // TASK-027 L02: 开放探究提交前存在偏差警告时暂存的表单内容。
let pendingPlanBefore=null; // L06-fix: 打开警告对话框前的 plan 快照，放弃时回滚。
let planBaseline=null; // L06-fix: 最近一次确认方案的基线；首次编辑时惰性捕获，continue 成功后重置。
let analyzeMode=false; // TASK-027 L03: 下一轮提问以 kind=analyze 发送（结果解析角色，服务端白名单）。
const PREFERENCES_KEY='flavoglycolab.experience.v1';
let reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
try{const stored=localStorage.getItem(STORAGE_KEY);if(stored)state=hydrate(stored);}catch{loadWarning='本机记录无法读取，已打开新的草稿；原存储未覆盖。请先导出备份或确认开始新实验。';saveError=true;}
try{const prefs=JSON.parse(localStorage.getItem(PREFERENCES_KEY)||'{}');if(typeof prefs.reducedMotion==='boolean')reducedMotion=prefs.reducedMotion;}catch{}
document.documentElement.classList.toggle('reduce-motion',reducedMotion);document.querySelector('#reduce-motion').checked=reducedMotion;
const suggestions=['读这三篇论文时，我先关注哪些内容？','帮我检查当前路线需要哪些材料？','我的假设和对照设计是否清楚？','取样前我还应该核对什么？','缺少哪些证据会影响定量分析？','如何区分操作事实和未验证的结论？'];
function save(){
 if(activeRequest&&(activeRequest.run!==state.current||activeRequest.revision!==(state.current.contextRevision??0)))activeRequest.controller.abort();
 // TASK-026: 方案/路线变化时，在途评价一并作废（响应落地校验会丢弃并清除 evaluating 标记）。
 if(pendingEval&&(pendingEval.sentRoute!==state.current.route||pendingEval.sentRevision!==(state.current.contextRevision??0)))pendingEval=null;
 state.updatedAt=new Date().toISOString();
 if(loadWarning){document.querySelector('#save-status').textContent='原记录需处理';return;}
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));saveError=false;document.querySelector('#save-status').textContent='已保存于本机';}
 catch{saveError=true;document.querySelector('#save-status').textContent='保存失败，请导出记录';}
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
 const reminder=main.querySelector('.stage-task-reminder p');
 if(reminder){const p=questProgress(state.current,content);reminder.textContent=`${p.completed} / ${p.total} 项主线已核对 · ${p.allComplete?'可以继续下一阶段':'完成本阶段探究，再继续实验'}`;}
}
async function attachMolecule(version){
 const element=main.querySelector('#molecule-viewer');if(!element)return;
 try{const next=await mountMolecule(element,{reducedMotion});if(version!==renderVersion||!element.isConnected){next.destroy();return;}molecule=next;
  const details=document.createElement('details');details.className='structure-source';
  const summary=document.createElement('summary');summary.textContent='结构来源与 SMILES';details.append(summary);
  if(next.data){const link=document.createElement('a');link.href=next.data.source_url||'https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:68352';link.target='_blank';link.rel='noopener noreferrer';link.textContent='ChEBI:68352 · PubChem:5280804';details.append(link);const code=document.createElement('code');code.textContent=next.data.smiles;details.append(code);}
  element.closest('.molecule-stage').append(details);
 }catch{toast('三维结构暂不可用，可继续查看案例与身份说明。',true);}
}
function render(moveFocus=false){
 if(!content)return;
 const run=state.current;
 if(activeTask&&(!canOpenTask(run,content,activeTask)||!content.learning.steps.some(t=>t.id===activeTask&&t.stage===run.stage)))activeTask=null;
 molecule?.destroy();molecule=null;highlighted=false;const version=++renderVersion;
 refreshDocks();
 if(view==='records')main.innerHTML=recordsView(state,compareId,content);
 else if(activeTask)main.innerHTML=taskView(run,content,activeTask,run.learning.entries[activeTask]?.eval??null); // TASK-026: 第4参 evalInfo，旧渲染函数忽略不影响兼容。
 else if(run.stage===0)main.innerHTML=!replayIntro&&questProgress(run,content).allComplete?routeConfirmation(run,content):explorationScene(run,content,introRetry);
 else{main.innerHTML=stageEvidenceBanner(run,content)+renderWorkbench(run,content,selectedSample);}
 // TASK-026: 评价在途时禁用该任务提交按钮，防止双击重复评价。
 if(pendingEval&&pendingEval.taskId===activeTask){const submit=main.querySelector('.learning-form button[type="submit"]');if(submit)submit.disabled=true;}
 document.querySelector('#nav-bench').setAttribute('aria-current',view==='workbench'?'page':'false');
 const recordLink=document.querySelector('#nav-records');if(view==='records')recordLink.setAttribute('aria-current','page');else recordLink.removeAttribute('aria-current');
 document.title=`FlavoGlycoLab · ${view==='records'?'实验记录':STAGES[run.stage]}`;
 renderTutor();attachMolecule(version);
 bindInquiryTools(main,{onDraftNote(note){
  if(!activeTask)return;
  invalidateAfterTaskEdit();draftLearning(run,activeTask,'note',note);
  const input=main.querySelector('.learning-form textarea[name=note]');if(input)input.value=note;
  main.querySelector('.learning-feedback')?.remove();
  main.querySelector('.task-actions button[data-task],.task-actions button[data-action="stage-workspace"]')?.remove();
  save();refreshDocks();toast('假设已带入，可继续编辑，然后提交自查。');
 }});
 bindTaskNarrative(main,activeTask); // TASK-026: 叙事区分页纯 DOM 绑定，不参与 render()。
 localizeValidation();
 if(moveFocus){main.scrollTo(0,0);main.focus({preventScroll:true});if(innerWidth<=620)window.scrollTo({top:0,behavior:'instant'});}
}
function localizeValidation(){
 for(const el of main.querySelectorAll('[required]')){
  const message=el.type==='radio'?'请先选择一个选项。':el.type==='checkbox'?'请先勾选确认项。':'请先完成这一空项。';
  el.addEventListener('invalid',()=>{if(el.validity.valueMissing)el.setCustomValidity(message);});
  const clear=()=>el.setCustomValidity('');
  el.addEventListener('input',clear);el.addEventListener('change',clear);
 }
}
// TASK-027 L03: 解析结果分区渲染（文献事实／学生自述／机制假设／尚不可判断）。
function analysisBlocks(a){
 if(!a||!a.sections)return '';
 const s=a.sections,sec=(title,items,note)=>items&&items.length?`<div class="analysis-sec"><strong>${e(title)}</strong>${note?` <small>${e(note)}</small>`:''}<ul>${items.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>`:'';
 const facts=(s.literature_facts||[]).map(f=>`${f.parameter} · ${f.rule_kind} · 参照 ${f.reference&&f.reference.text?f.reference.text:'unknown'} · ${f.source_id?`[${f.source_id} · ${f.source_locator}]`:'[无来源]'}`);
 const reported=(s.student_report?.reported_statuses||[]).map(h=>`${h.rule_id}: ${h.status}`);
 const selfReport=s.student_report&&s.student_report.text?[`学生自述（不可信资料）：${s.student_report.text}`,...(reported.length?[`规则命中：${reported.join('；')}`]:[])]:['（未提供学生现象自述）'];
 const steps=(a.next_steps||[]).map((t,i)=>`${i+1}. ${t}`);
 return `<div class="analysis-blocks">${sec('文献事实',facts,'含 rule_id/source_id 可核定位')}${sec('学生自述',selfReport)}${sec('机制假设',s.mechanism_hypotheses,'待检验，非已验证因果')}${sec('尚不可判断',s.undetermined)}${sec('下一步建议（对照设计）',steps)}<p class="fine-print">机器解析 · agent_checked_candidate · 待教师审定 · 不构成成绩</p></div>`;
}
function renderTutor(){
 const run=state.current,paperLabel=openPaper?content.sources.find(s=>s.source_id===openPaper)?.label||openPaper:'';
 document.querySelector('#tutor-context').innerHTML=`<strong>当前：${e(STAGES[run.stage])}${activeTask?` · 主线 ${activeTask}`:''}${openPaper?` · 阅读 ${e(paperLabel)}`:''}</strong>`;
 document.querySelector('#suggest-question').textContent=analyzeMode?'描述你观察到的现象或结果，AI 将按四分区解析…':suggestions[run.stage];
 chat.innerHTML=run.chat.map(m=>`<div class="chat-message ${m.role==='user'?'user':'assistant'}"><span class="message-label">${m.role==='user'?'你':m.mode==='model'?'Qwen · 实时回复':'证据检查 · 系统提示'}${m.contextStage!=null&&m.role!=='user'?` · ${e(STAGES[m.contextStage])}`:''}${m.analysis?' · 结果解析':''}</span><div class="message-text">${e(m.content).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')}</div>${analysisBlocks(m.analysis)}</div>`).join('')||'<p class="chat-empty">从你的想法开始。</p>';
 chat.scrollTop=chat.scrollHeight;
}
function route(moveFocus=true){
 const path=location.hash.slice(1)||'/';
 if(path==='/records'){view='records';activeTask=null;render(moveFocus);return;}
 if(['/', '/case','/steps','/ai','/data','/about'].includes(path)){view='workbench';render(moveFocus);return;}
 view='unknown';main.innerHTML='<div class="load-error"><h1>页面未找到</h1><p>返回实验台继续当前操作。</p><a class="button primary" href="#/">返回实验台</a></div>';
}
function goStage(stage){
 if(!canVisit(state.current,stage))throw Error('请先完成前面的必要操作。');
 if(stage>state.current.stage&&Array.from({length:stage},(_,i)=>i).some(i=>!questProgress(state.current,content,i).allComplete))throw Error('请先完成前面阶段的主线探究。');
 if(stage<3&&state.current.operation==='running'){clearTimeout(runTimer);state.current.operation='mixed';log(state.current,'中断流程演练','返回上游步骤');}
 state.current.stage=stage;replayIntro=false;activeTask=null;view='workbench';if(location.hash==='#/records')location.hash='/';save();render(true);
}
function openTask(id){if(state.current.stage===0&&!introProgress(state.current).complete)throw Error('先完成导入三步，再开始主线探究。');if(!canOpenTask(state.current,content,id))throw Error('先完成当前任务，再继续下一项。');activeTask=id;view='workbench';if(location.hash==='#/records')location.hash='/';render(true);}
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
main.addEventListener('submit',event=>{
 event.preventDefault();const form=event.target,run=state.current;
 if(form.classList.contains('learning-form')){
  const id=form.dataset.learningId;
  try{
   if(!canOpenTask(run,content,id))throw Error('请先核对前面的任务。');
   if(id==='04'&&!run.exploration?.routeChosen)throw Error('先打开一个案例，明确选择你的规划路线，再保存理由。');
   const task=content.learning.steps.find(t=>t.id===id),fields=collect(form);
   draftLearning(run,id,'note',fields.note||'');if(task.choices.length)draftLearning(run,id,'choice',fields.choice||'');
   checkLearning(run,task);
   if(id==='04')run.reason=run.learning.entries[id].note;
   log(run,'核对主线任务',`${id} ${task.title}；${taskPassed(run,task)?task.choices.length?'自查通过':'思考已记录，待复核':'需重新核对'}`);
   save();render();const result=main.querySelector('.learning-feedback');if(result){result.tabIndex=-1;result.focus({preventScroll:true});result.scrollIntoView({block:'nearest',behavior:reducedMotion?'instant':'smooth'});}
   maybeEvaluate(run,id,task); // TASK-026: 提交成功后自动发起一次评价。
  }catch(err){toast(err.message,true);}return;
 }
 if(['route-form','plan-form','analysis-form','reflection-form'].includes(form.id)&&!requireQuests())return;
 if(form.id==='plan-form'&&(run.stageMode??'guided')==='open'){
  // TASK-027 L02 开放探究：与文献参照不同的条件先给警告，由学生选择 继续/放弃/重来。
  const fields=collect(form),warnings=openWarnings(run,fields,content);
  if(warnings.length){pendingOpenPlan=fields;pendingPlanBefore=copy(run.plan);openWarningDialog.querySelector('.warning-list').innerHTML=`<ul>${warnings.map(w=>`<li>「${e(w.parameter)}」与本篇报告条件不同（参照：${e(String(w.reference))}；${e(w.rule.source_id)} ${e(w.rule.source_locator)}）<br>${e(w.text)}</li>`).join('')}</ul>`;openWarningDialog.showModal();return;}
 }
 guard(()=>{
  if(form.id==='route-form'){const reason=run.learning.entries['04']?.note||run.reason;confirmRoute(run,reason);}
  if(form.classList.contains('material-form'))addMaterial(run,form.dataset.kind,form.elements.material.value);
  if(form.id==='plan-form')confirmPlan(run,collect(form),content);
  if(form.id==='analysis-form'){if(!form.elements.reviewed.checked)throw Error('请确认已区分操作记录和实验观测。');run.analysisReviewed=true;run.stage=5;log(run,'核对分析证据','没有对应观测，定量结果保持未知。');if((run.stageMode??'guided')==='guided')completeGuided(run);} // L02: 走完参照流程即解锁开放探究。
  if(form.id==='reflection-form'){completeRun(state,collect(form));view='records';location.hash='/records';toast('练习记录已保存，可导出或开始新实验。');}
 });
});
main.addEventListener('change',event=>{if(event.target.id==='compare-record'){compareId=event.target.value;render();}});
main.addEventListener('input',event=>{
 const el=event.target,run=state.current,form=el.closest('.learning-form');
 if(form){try{
  invalidateAfterTaskEdit();draftLearning(run,form.dataset.learningId,el.name,el.value);save();refreshDocks();
  main.querySelector('.learning-status').textContent='草稿已保存';main.querySelector('.learning-feedback')?.remove();
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
 if(!panel){toast('此入口暂未提供论文 PDF 在线阅读，可尝试新标签页链接。',true);return;}
 if(!panel.hidden){panel.hidden=true;button.setAttribute('aria-expanded','false');button.textContent='在线阅读论文 PDF';openPaper=null;renderTutor();return;}
 panel.hidden=false;button.setAttribute('aria-expanded','true');button.textContent='收起论文 PDF';openPaper=sourceId;renderTutor();
 const status=panel.querySelector('.paper-status'),frame=panel.querySelector('iframe');
 if(frame.src)return;
 status.hidden=false;status.className='paper-status';status.textContent='正在加载论文 PDF…';
 const slowTimer=setTimeout(()=>{status.hidden=false;status.className='paper-status';status.textContent='加载较慢；若持续无显示，请用新标签页打开 PDF。';},8000);
 try{
  const head=await fetch(`./api/paper/${sourceId}`,{method:'HEAD'});
  if(!head.ok||!(head.headers.get('Content-Type')||'').includes('application/pdf'))throw Error('unavailable');
  frame.addEventListener('load',()=>{clearTimeout(slowTimer);status.hidden=true;},{once:true});
  frame.src=`./api/paper/${sourceId}`;
 }catch{
  clearTimeout(slowTimer);status.className='paper-status error';status.textContent='此入口暂未提供论文 PDF 在线阅读，可尝试上方新标签页链接。';
 }
}
function applyRoute(id){clearTimeout(runTimer);selectRoute(state.current,id);state.current.exploration={...(state.current.exploration||{}),revealed:true,routeChosen:true};activeTask=null;view='workbench';evidenceDialog.close();save();render(true);toast('已选择新的规划路线，请重新核对主线判断。');}
function chooseRoute(id){
 if(id===state.current.route){state.current.exploration={...(state.current.exploration||{}),revealed:true,routeChosen:true};evidenceDialog.close();save();render();toast('已确认这条规划路线。');return;}
 if(Object.keys(state.current.learning.entries).length||state.current.routeConfirmed){pendingRoute=id;evidenceDialog.close();document.querySelector('#route-change-dialog').showModal();}
 else applyRoute(id);
}
function toggleTutor(open){tutor.hidden=!open;tutorLauncher.setAttribute('aria-expanded',String(open));if(open){renderTutor();question.focus();}else tutorLauncher.focus();}
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
   if(el.dataset.choice===q.answer){answerIntroAct(state.current,step,el.dataset.choice,true);delete introRetry[step];}
   else introRetry[step]=true;
   save();render();
  }catch(error){toast(error.message,true);}
  return;
 }
 if(el.dataset.task){try{openTask(el.dataset.task);}catch(error){toast(error.message,true);}return;}
 if(el.dataset.case){if(state.current.stage===0&&!activeTask){recordIntroPaper(state.current,el.dataset.case);save();}showEvidence(el.dataset.case);return;}
 if(el.dataset.openPaper){togglePaper(el);return;}
 if(el.dataset.paperAsk){ // TASK-026 P3：带论文上下文问文献导师。
  openPaper=el.dataset.paperAsk;tutorRole='literature_analyst';
  question.value='请结合这篇论文解读本步任务';
  toggleTutor(true);renderTutor();return;
 }
 if(el.dataset.compareRoute){showEvidence(el.dataset.compareRoute==='all'?null:el.dataset.compareRoute);return;}
 if(el.dataset.chooseRoute){chooseRoute(el.dataset.chooseRoute);return;}
 if(el.dataset.molecule){if(!molecule)return;if(el.dataset.molecule==='reset'){molecule.reset();highlighted=false;}else{highlighted=!highlighted;molecule.highlight(highlighted?'sugar':null);}main.querySelector('[data-molecule="highlight"]')?.setAttribute('aria-pressed',String(highlighted));return;}
 if(el.dataset.identity!=null){const i=Number(el.dataset.identity);main.querySelectorAll('[data-identity]').forEach(b=>{b.classList.toggle('active',b===el);b.setAttribute('aria-pressed',String(b===el));});document.querySelector('#identity-detail').textContent=content.learning.identities[i].detail;return;}
 if(el.dataset.stage!=null){guard(()=>goStage(Number(el.dataset.stage)));return;}
 if(el.dataset.remove){guard(()=>{clearDownstream(state.current,1);delete state.current.materials[el.dataset.remove];log(state.current,'移除材料',el.dataset.remove);});return;}
 if(el.dataset.operate){guard(()=>{const run=state.current;operate(run,el.dataset.operate);if(el.dataset.operate==='start'){clearTimeout(runTimer);runTimer=setTimeout(()=>{if(state.current===run&&run.operation==='running'){operate(run,'finish');save();render();toast('流程演练就绪，可以建立取样记录。');}},2200);}});return;}
 if(el.dataset.sample){selectedSample=el.dataset.sample;render();return;}
 const action=el.dataset.action;if(!action)return;
 if(action==='new'){document.querySelector('#confirm-dialog').showModal();return;}
 if(action==='tutor'){evidenceDialog.close();toggleTutor(true);return;}
 if(action==='intro-tutor'){question.value=content.intro.papers_gate.tutor_prompt;toggleTutor(true);return;}
 if(action==='ask-task-tutor'){const id=el.dataset.taskId,task=content.learning.steps.find(t=>t.id===id);question.value=task?.coach_question||`我在做任务${id}「${task?.title||''}」：${task?.prompt||''}`;toggleTutor(true);return;}
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
   if(reason.length<8)throw Error('请写明选择理由（至少8字）。');
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
   if(note.length<15)throw Error('边界说明至少15字，请写清哪些数值只是文献参照。');
   state.current.analysis.boundaryNote=note;state.current.analysis.boundaryDone=true;
   log(state.current,'记录分析边界',note.slice(0,50));
   save();render();
  }catch(err){toast(err.message,true);}
  return;
 }
 if(action==='compare'){showEvidence();return;}
 if(action==='begin-quest'){try{beginQuest();}catch(error){toast(error.message,true);}return;}
 if(action==='stage-workspace'){replayIntro=false;activeTask=null;view='workbench';render(true);return;}
 if(action==='replay-intro'){
  document.querySelector('#settings-dialog').close();if(state.current.stage!==0){goStage(0);}state.current.exploration={step:1,papers:[]};introRetry={};replayIntro=true;activeTask=null;view='workbench';save();
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
  if(action==='workbench'){view='workbench';activeTask=null;location.hash='/';}
  if(action==='export-json'){const payload=exportPayload(state);if(loadWarning){try{payload.unreadableLocalBackup=localStorage.getItem(STORAGE_KEY);}catch{}}download('FlavoGlycoLab-实验记录.json',JSON.stringify(payload,null,2),'application/json');}
  if(action==='export-md')download('FlavoGlycoLab-实验记录.md',markdownRecord(state.current),'text/markdown;charset=utf-8');
  if(action==='reload')location.reload();
  if(action==='redo')redoDialog.showModal();
 });
}
document.addEventListener('click',click);
document.querySelector('#confirm-dialog').addEventListener('close',event=>{if(event.target.returnValue!=='confirm')return;clearTimeout(runTimer);loadWarning='';state.current=freshRun();selectedSample='';activeTask=null;openPaper=null;introRetry={};view='workbench';location.hash='/';aiError.textContent='';save();render(true);toast('新实验已就绪，历史练习仍保留。');});
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
document.querySelector('#settings-button').addEventListener('click',()=>document.querySelector('#settings-dialog').showModal());
document.querySelector('#settings-dialog a[data-close-dialog]').addEventListener('click',()=>document.querySelector('#settings-dialog').close());
document.querySelector('#reduce-motion').addEventListener('change',event=>{reducedMotion=event.target.checked;document.documentElement.classList.toggle('reduce-motion',reducedMotion);try{localStorage.setItem(PREFERENCES_KEY,JSON.stringify({reducedMotion}));}catch{toast('偏好未能保存，本次设置仍然有效。',true);}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!tutor.hidden&&!document.querySelector('dialog[open]')){toggleTutor(false);event.preventDefault();}});
document.querySelector('#suggest-question').addEventListener('click',()=>{question.value=suggestions[state.current.stage];question.focus();});
// TASK-026: 提交后的自动评价闭环。noteHash 用于检测提交内容与上次评价是否一致。
function noteHash(text){let h=2166136261;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}
async function maybeEvaluate(run,taskId,task){
 if(!modelConfigured||pendingEval)return; // 导师未配置（或未连接成功）时不发起评价，流程不卡死。
 const entry=run.learning.entries[taskId];
 if(!entry||entry.status!=='recorded')return;
 const sentHash=noteHash(entry.note);
 // 提交内容与上次判定完全相同且已有终态判定 → 复用旧判定，不重复请求。
 if((entry.eval?.state==='passed'||entry.eval?.state==='failed')&&entry.eval.noteHash===sentHash)return;
 const evalId=globalThis.crypto?.randomUUID?.()||`eval-${Date.now()}-${Math.random().toString(36).slice(2)}`;
 const sentRoute=run.route,sentRevision=run.contextRevision??0,sentCheckedAt=entry.checkedAt;
 pendingEval={evalId,taskId,sentRoute,sentRevision,sentHash,checkedAtSnapshot:sentCheckedAt};
 entry.eval={state:'evaluating',evalId,ts:new Date().toISOString()};
 save();render();
 const context={route:run.route,stage:run.stage,reason:run.reason||run.learning.entries['04']?.note||'',plan:JSON.stringify(run.plan),operation:run.operation,reflection:JSON.stringify(run.reflection),
  task:{id:taskId,title:task?.title||''}};
 const history=run.chat.map(m=>({role:m.role,content:m.content})).slice(-6);
 const aborter=new AbortController(),timeout=setTimeout(()=>aborter.abort(),55000);
 try{
  const response=await fetch('./api/tutor',{method:'POST',headers:{'Content-Type':'application/json'},signal:aborter.signal,body:JSON.stringify({kind:'evaluate',question:'',context,history,evaluation:{task_id:taskId,eval_id:evalId,submission:{choice:entry.choice??null,note:entry.note},context_revision:sentRevision}})});
  const data=await response.json();if(!response.ok)throw Error(data.error||'评价服务暂时不可用。');
  const current=state.current,curEntry=current.learning?.entries?.[taskId];
  // 全部校验通过才落地：evalId 匹配、路线/修订未变、条目未被重新编辑。
  const valid=pendingEval&&pendingEval.evalId===evalId&&
    data.evaluation&&data.evaluation.eval_id===evalId&&
    current===run&&run.route===sentRoute&&(run.contextRevision??0)===sentRevision&&
    curEntry&&curEntry.checkedAt===sentCheckedAt&&noteHash(curEntry.note)===sentHash;
  if(!valid){
    if(curEntry&&curEntry.eval?.evalId===evalId)curEntry.eval=undefined;
    save();render();toast('内容已更新，请重新提交后评价。',true);return;
  }
  const mode=data.mode,evaluation=data.evaluation;
  if(mode==='model'&&evaluation){
    curEntry.eval={state:evaluation.pass?'passed':'failed',pass:evaluation.pass===true,rubricHits:evaluation.rubric_hits??[],missing:evaluation.missing??[],guidance:evaluation.guidance??[],evidenceRefs:evaluation.evidence_refs??[],mode,evaluatedAt:new Date().toISOString(),noteHash:sentHash};
  }else if(mode==='eval_preflight'){
    curEntry.eval={state:'failed',pass:false,rubricHits:evaluation?.rubric_hits??[],missing:evaluation?.missing??[],guidance:evaluation?.guidance??[],evidenceRefs:evaluation?.evidence_refs??[],mode,evaluatedAt:new Date().toISOString(),noteHash:sentHash};
  }else{
    curEntry.eval={state:'degraded',reason:mode??'eval_unparsed',evaluatedAt:new Date().toISOString(),noteHash:sentHash};
  }
  save();render();
 }catch(error){
  // 请求失败/超时降级；若已被 save() 的 beforeChange 作废（pendingEval 清空），仅清除 evaluating 标记。
  const current=state.current,curEntry=current.learning?.entries?.[taskId];
  if(pendingEval&&pendingEval.evalId===evalId&&curEntry&&curEntry.eval?.evalId===evalId){
    curEntry.eval={state:'degraded',reason:error.name==='AbortError'?'timeout':'network',evaluatedAt:new Date().toISOString(),noteHash:sentHash};
    save();render();
  }
 }finally{clearTimeout(timeout);pendingEval=null;render();}
}
async function askTutor(event,role='coach'){
 event.preventDefault();if(busy)return;
 const text=question.value.trim();if(!text)return;
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
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY){toast('另一个标签页修改了记录。请导出当前草稿后刷新，避免覆盖。',true);loadWarning='检测到其他标签页更新，暂停自动保存。';document.querySelector('#save-status').textContent='其他标签页已更新';}});
async function init(){
 try{const response=await fetch('./content/demo-content.json');if(!response.ok)throw Error();content=await response.json();if(!Array.isArray(content.routes)||content.routes.length!==3)throw Error();route(false);save();if(loadWarning)toast(loadWarning,true);if(saveError&&!loadWarning)toast('浏览器未能保存记录，请使用导出功能保留本次操作。',true);}
 catch{main.innerHTML='<div class="load-error"><h1>实验内容暂时无法加载</h1><p>检查网络连接后重试，本机记录不会被清空。</p><button class="button primary" data-action="reload">重新加载</button></div>';return;}
 try{const response=await fetch('./api/health',{signal:AbortSignal.timeout(6000)});if(!response.ok)throw Error();const data=await response.json();modelConfigured=data.configured===true;document.querySelector('#ai-status').textContent=modelConfigured?'Qwen · 实时辅导（本机演示，未接入正式平台）':'模型尚未配置 · 本机练习可继续';}
 catch{document.querySelector('#ai-status').textContent='模型连接不可用 · 实验台可继续';aiError.textContent='辅导服务不可用，实验操作仍可继续。';}
}
init();
