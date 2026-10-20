import { escapeHTML as e } from './ui.js';
import { STORAGE_KEY, STAGES, freshState, freshRun, hydrate, log, copy, clearDownstream, selectRoute, confirmRoute, addMaterial, confirmAssembly, confirmPlan, operate, canVisit, completeRun, exportPayload, markdownRecord } from './lab-state.js';
import { workflow, renderWorkbench, recordsView, amountPreview } from './views/workbench.js';
const main=document.querySelector('#main-content'),rail=document.querySelector('#workflow'),feedback=document.querySelector('#feedback');
const chat=document.querySelector('#chat'),question=document.querySelector('#question'),aiError=document.querySelector('#ai-error');
let state=freshState(),content,view='workbench',selectedSample='',compareId='',toastTimer,runTimer,busy=false,modelConfigured=false,saveError=false,loadWarning='';
const suggestions=['这三条路线应该从哪些方面比较？','帮我检查当前路线需要哪些材料？','我的假设和对照设计是否清楚？','取样前我还应该核对什么？','缺少哪些证据会影响定量分析？','如何区分操作事实和未验证的结论？'];
const guidance=['先作出你的选择。我会根据你的方案提出问题，帮助你核对依据。','先独立挑选底物、催化体系与供体方案，再核对它们是否与路线一致。','说明你想改变什么，以及哪些条件保持不变。输入的条件都是待验证假设。','按顺序操作。过程演练只记录动作，不生成化学反应结果。','先问数据能支持什么。没有对应测量时，需要保留未知。','把事实、推断、缺口和下一步分别写清楚。结论由你自己作出。'];
try{const stored=localStorage.getItem(STORAGE_KEY);if(stored)state=hydrate(stored);}catch{loadWarning='本机记录无法读取，已打开新的草稿；原存储未覆盖。请先导出备份或确认开始新实验。';saveError=true;}
function save(){
  state.updatedAt=new Date().toISOString();
  if(loadWarning){document.querySelector('#save-status').textContent='原记录需处理';return;}
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));saveError=false;document.querySelector('#save-status').textContent='已保存于本机';}
  catch{saveError=true;document.querySelector('#save-status').textContent='保存失败，请导出记录';}
}
function toast(message,error=false){feedback.textContent=message;feedback.hidden=false;feedback.classList.toggle('error',error);clearTimeout(toastTimer);toastTimer=setTimeout(()=>feedback.hidden=true,error?9000:4500);}
function guard(fn){const oldStage=state.current.stage,oldView=view;try{fn();save();render(oldStage!==state.current.stage||oldView!==view);}catch(err){toast(err.message,true);}}
function render(moveFocus=false){
  if(!content)return;
  rail.innerHTML=workflow(state.current);
  if(innerWidth<=600)rail.querySelector('[aria-current="step"]')?.scrollIntoView({block:'nearest',inline:'center'});
  main.innerHTML=view==='records'?recordsView(state,compareId,content):renderWorkbench(state.current,content,selectedSample);
  for(const [id,active] of [['#nav-bench',view==='workbench'],['#nav-records',view==='records']]){const link=document.querySelector(id);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
  document.title=`FlavoGlycoLab · ${view==='records'?'实验记录':STAGES[state.current.stage]}`;
  renderTutor();
  if(moveFocus){main.scrollTo(0,0);main.focus({preventScroll:true});if(innerWidth<=600)window.scrollTo({top:0,behavior:'instant'});}
}
function renderTutor(){
  const run=state.current;
  document.querySelector('#tutor-context').innerHTML=`<strong>当前：${e(STAGES[run.stage])}</strong>${e(guidance[run.stage])}`;
  document.querySelector('#suggest-question').textContent=suggestions[run.stage];
  chat.innerHTML=run.chat.map(m=>`<div class="chat-message ${m.role==='user'?'user':'assistant'}"><span class="message-label">${m.role==='user'?'你':m.mode==='model'?'Qwen · 实时回复':'证据检查 · 系统提示'}${m.contextStage!=null&&m.role!=='user'?` · ${e(STAGES[m.contextStage])}`:''}</span><div class="message-text">${e(m.content).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')}</div></div>`).join('');
  chat.scrollTop=chat.scrollHeight;
}
function route(moveFocus=true){
  const path=location.hash.slice(1)||'/';
  if(path==='/records'){view='records';render(moveFocus);return;}
  if(['/', '/case','/steps','/ai','/data','/about'].includes(path)){view='workbench';render(moveFocus);return;}
  view='unknown';main.innerHTML='<div class="load-error"><h1>页面未找到</h1><p>返回实验台继续当前操作。</p><a class="button primary" href="#/">返回实验台</a></div>';
}
function goStage(stage){
  if(!canVisit(state.current,stage))throw Error('请先完成前面的必要操作。');
  if(stage<3&&state.current.operation==='running'){clearTimeout(runTimer);state.current.operation='mixed';log(state.current,'中断流程演练','返回上游步骤');}
  state.current.stage=stage;view='workbench';save();render(true);
}
function download(name,body,type){const url=URL.createObjectURL(new Blob([body],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function collect(form){return Object.fromEntries(new FormData(form));}
main.addEventListener('submit',event=>{
  event.preventDefault();const form=event.target;
  guard(()=>{
    const run=state.current;
    if(form.id==='route-form')confirmRoute(run,form.elements.reason.value);
    if(form.classList.contains('material-form'))addMaterial(run,form.dataset.kind,form.elements.material.value);
    if(form.id==='plan-form')confirmPlan(run,collect(form));
    if(form.id==='analysis-form'){
      if(!form.elements.reviewed.checked)throw Error('请确认已区分操作记录和实验观测。');
      run.analysisReviewed=true;run.stage=5;log(run,'核对分析证据','没有对应观测，定量结果保持未知。');
    }
    if(form.id==='reflection-form'){completeRun(state,collect(form));view='records';location.hash='/records';toast('练习记录已保存，可导出或开始新实验。');}
    if(!form.classList.contains('material-form')){main.scrollTo(0,0);main.focus({preventScroll:true});}
  });
});
main.addEventListener('change',event=>{
  const el=event.target;
  if(el.name==='route')guard(()=>{clearTimeout(runTimer);selectRoute(state.current,el.value);});
  if(el.id==='compare-record'){compareId=el.value;render();}
});
main.addEventListener('input',event=>{
  const el=event.target,run=state.current;
  if(el.name==='reason'){
    if(run.routeConfirmed&&el.value!==run.reason){clearDownstream(run,0);clearTimeout(runTimer);rail.innerHTML=workflow(run);}
    run.reason=el.value;
  }
  if(el.closest('#plan-form')){
    if(run.planConfirmed){clearDownstream(run,2);clearTimeout(runTimer);rail.innerHTML=workflow(run);}
    run.plan[el.name]=el.value;
    const output=document.querySelector('#amount-preview');if(output)output.textContent=amountPreview(run.plan);
  }
  if(el.closest('#reflection-form')){run.reflection[el.name]=el.value;run.completed=false;}
  save();
});
function click(event){
  const el=event.target.closest('button');if(!el||el.disabled)return;
  if(el.dataset.stage!=null){guard(()=>goStage(Number(el.dataset.stage)));return;}
  if(el.dataset.remove){guard(()=>{clearDownstream(state.current,1);delete state.current.materials[el.dataset.remove];log(state.current,'移除材料',el.dataset.remove);});return;}
  if(el.dataset.operate){
    guard(()=>{const run=state.current;operate(run,el.dataset.operate);
      if(el.dataset.operate==='start'){clearTimeout(runTimer);runTimer=setTimeout(()=>{if(state.current===run&&run.operation==='running'){operate(run,'finish');save();render();toast('流程演练就绪，可以建立取样记录。');}},2200);}
    });return;
  }
  if(el.dataset.sample){selectedSample=el.dataset.sample;render();return;}
  const action=el.dataset.action;
  if(!action)return;
  if(action==='new'){document.querySelector('#confirm-dialog').showModal();return;}
  guard(()=>{
    if(action==='assembly')confirmAssembly(state.current);
    if(action==='back')goStage(Math.max(0,state.current.stage-1));
    if(action==='analysis'){goStage(4);selectedSample=state.current.samples[0]?.id??'';}
    if(action==='workbench'){view='workbench';location.hash='/';}
    if(action==='export-json'){
      // Preserve corrupt stored bytes for recovery instead of silently erasing them.
      const payload=exportPayload(state);if(loadWarning){try{payload.unreadableLocalBackup=localStorage.getItem(STORAGE_KEY);}catch{}}
      download('FlavoGlycoLab-实验记录.json',JSON.stringify(payload,null,2),'application/json');
    }
    if(action==='export-md')download('FlavoGlycoLab-实验记录.md',markdownRecord(state.current),'text/markdown;charset=utf-8');
    if(action==='reload')location.reload();
  });
}
main.addEventListener('click',click);rail.addEventListener('click',click);
document.querySelector('#confirm-dialog').addEventListener('close',event=>{
  if(event.target.returnValue!=='confirm')return;
  clearTimeout(runTimer);loadWarning='';state.current=freshRun();selectedSample='';view='workbench';location.hash='/';aiError.textContent='';save();render(true);toast('新实验已就绪，已保存的历史记录仍保留。');
});
document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();main.focus();});
const mobileTutor=document.querySelector('.mobile-tutor');
function toggleTutor(open){document.querySelector('#tutor-panel').classList.toggle('open',open);mobileTutor.setAttribute('aria-expanded',String(open));mobileTutor.textContent=open?'关闭导师':'AI 导师';if(open)question.focus();else mobileTutor.focus();}
mobileTutor.addEventListener('click',()=>toggleTutor(mobileTutor.getAttribute('aria-expanded')!=='true'));
document.addEventListener('keydown',event=>{if(mobileTutor.getAttribute('aria-expanded')!=='true')return;if(event.key==='Escape')toggleTutor(false);if(event.key==='Tab'){const controls=[mobileTutor,...document.querySelectorAll('#tutor-panel button:not(:disabled),#tutor-panel textarea')];const i=controls.indexOf(document.activeElement);if(event.shiftKey&&(i<=0)){event.preventDefault();controls.at(-1).focus();}else if(!event.shiftKey&&(i===controls.length-1)){event.preventDefault();controls[0].focus();}}});
document.querySelector('#suggest-question').addEventListener('click',()=>{question.value=suggestions[state.current.stage];question.focus();});
async function askTutor(event){
  event.preventDefault();if(busy)return;
  const text=question.value.trim();if(!text)return;
  if(!modelConfigured){aiError.textContent='模型服务尚未就绪，请稍后刷新重试。实验台仍可继续操作。';return;}
  busy=true;document.querySelector('#send-question').disabled=true;aiError.textContent='导师正在结合当前方案思考…';
  const run=state.current,sentRoute=run.route,sentStage=run.stage;
  const context={route:run.route,stage:run.stage,reason:run.reason,plan:JSON.stringify(run.plan),operation:run.operation,reflection:JSON.stringify(run.reflection)};
  const history=run.chat.map(m=>({role:m.role,content:m.content})).slice(-6);
  run.chat.push({role:'user',content:text,at:new Date().toISOString(),contextStage:sentStage});run.chat=run.chat.slice(-30);save();renderTutor();question.value='';
  const aborter=new AbortController(),timeout=setTimeout(()=>aborter.abort(),55000);
  try{
    const response=await fetch('./api/tutor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:text,context,history}),signal:aborter.signal});
    const data=await response.json();if(!response.ok)throw Error(data.error||'模型服务暂时不可用。');
    if(typeof data.answer!=='string'||!['model','output_guard','evidence_guard'].includes(data.mode))throw Error('模型响应格式无效，请重试。');
    if(state.current!==run||run.route!==sentRoute){aiError.textContent='实验上下文已改变，已舍弃上一方案的回复。';return;}
    run.chat.push({role:'assistant',content:data.answer,mode:data.mode,model:data.model??null,at:new Date().toISOString(),contextStage:sentStage,contextSnapshot:context});run.chat=run.chat.slice(-30);save();renderTutor();aiError.textContent='';
  }catch(error){aiError.textContent=error.name==='AbortError'?'模型响应超时，请稍后重试。':(error.message||'网络暂时不可用，请重试。');if(state.current===run&&!question.value)question.value=text;}
  finally{clearTimeout(timeout);busy=false;document.querySelector('#send-question').disabled=false;}
}
document.querySelector('#chat-form').addEventListener('submit',askTutor);
question.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter')document.querySelector('#chat-form').requestSubmit();});
window.addEventListener('hashchange',()=>route(true));
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY){toast('另一个标签页修改了记录。请导出当前草稿后刷新，避免覆盖。',true);loadWarning='检测到其他标签页更新，暂停自动保存。';document.querySelector('#save-status').textContent='其他标签页已更新';}});
async function init(){
  try{const response=await fetch('./content/demo-content.json');if(!response.ok)throw Error();content=await response.json();if(!Array.isArray(content.routes)||content.routes.length!==3)throw Error();route(false);save();if(loadWarning)toast(loadWarning,true);if(saveError&&!loadWarning)toast('浏览器未能保存记录，请使用导出功能保留本次操作。',true);}
  catch{main.innerHTML='<div class="load-error"><h1>实验内容暂时无法加载</h1><p>检查网络连接后重试，本机记录不会被清空。</p><button class="button primary" data-action="reload">重新加载</button></div>';return;}
  try{const response=await fetch('./api/health',{signal:AbortSignal.timeout(6000)});if(!response.ok)throw Error();const data=await response.json();modelConfigured=data.configured===true;document.querySelector('#ai-status').textContent=modelConfigured?'Qwen · 实时辅导已配置':'模型尚未配置';}
  catch{document.querySelector('#ai-status').textContent='模型连接不可用';aiError.textContent='辅导服务不可用，实验操作仍可继续。';}
}
init();
