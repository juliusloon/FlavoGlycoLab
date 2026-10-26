import {escapeHTML as e} from './ui.js';
import {caseComparison} from './views/inquiry.js';
import {mountPaperPDF} from './paper-pdf-reader.js';

const tabPaths={
 compare:'<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/><path d="M6 8h1m-1 4h1m10-4h1m-1 4h1"/>',
 Pei2019:'<circle cx="6" cy="12" r="3"/><circle cx="18" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 10 6-3M9 14l6 3"/>',
 Zhang2015:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m8.5 7.5 12 12m-12-3 12-12M12 12l-2 2"/>',
 Niu2024:'<rect x="4" y="7" width="16" height="10" rx="5" transform="rotate(-35 12 12)"/><path d="m7 17-3 4m13-14 3-3M9 11l1 1m4-1 1 1m-4 2 1 1"/>',
};
function tabIcon(id){return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${tabPaths[id]}</svg>`;}

// Reading UI only. Notes live in the current run; opening a paper never completes a task.
export function mountPaperNotebook({dialog,launcher,content,getRun,onNote,onRead}){
 const papers=content.routes.map(route=>({route,...content.learning.paper_digests.papers[route.source_id],id:route.source_id}));
 let selected='compare',runId=null,comparison='all';
 const pending=new Map(),readers=new Map();
 function cancelLoads(){for(const cancel of [...pending.values()])cancel();pending.clear();}
 function comparisonHTML(){return caseComparison(getRun(),content,comparison==='analysis'?'analysis':null,{standalone:true,notebook:true});}
 function paperEvidence(routeId){
  const card=content.case_page.route_cards.find(row=>row.id===routeId);
  return `<details class="notebook-research-evidence"><summary>研究结果与证据边界</summary><dl><dt>反应方向</dt><dd>${e(card.direction)}</dd><dt>催化体系</dt><dd>${e(card.system)}</dd><dt>原文报告结果</dt><dd><ul>${card.key_results.map(result=>`<li>${e(result)}</li>`).join('')}</ul></dd><dt>对照</dt><dd>${e(card.controls)}</dd><dt>仍缺证据</dt><dd>${e(card.gaps)}</dd></dl></details>`;
 }
 function build(){
  cancelLoads();for(const reader of readers.values())reader.destroy();readers.clear();
  const tabs=[{id:'compare',label:'三篇论文对比'},...papers.map(p=>({id:p.id,label:p.label}))];
  dialog.innerHTML=`<button type="button" class="close-button notebook-close" data-notebook-close aria-label="关闭论文笔记本" autofocus>×</button>
   <div class="notebook-layout"><div class="notebook-tabs" role="tablist" aria-label="论文笔记本便签" aria-orientation="vertical">${tabs.map(t=>`<button type="button" role="tab" aria-label="${e(t.label)}" title="${e(t.label)}" id="notebook-tab-${t.id}" aria-controls="notebook-page-${t.id}" data-notebook-tab="${t.id}" aria-selected="false" tabindex="-1">${tabIcon(t.id)}</button>`).join('')}</div>
   <div class="notebook-pages"><section role="tabpanel" id="notebook-page-compare" aria-labelledby="notebook-tab-compare" tabindex="0" hidden></section>
   ${papers.map(p=>`<section class="notebook-paper" role="tabpanel" id="notebook-page-${p.id}" aria-labelledby="notebook-tab-${p.id}" hidden>
    <div class="notebook-reader"><div class="notebook-pdf"><p class="notebook-pdf-status" role="status" hidden></p><div class="notebook-pdf-recovery" hidden><button type="button" class="text-button" data-notebook-retry="${p.id}">重新加载 PDF</button><a href="./api/paper/${p.id}" target="_blank" rel="noopener noreferrer">新标签页打开 ↗</a></div><div class="notebook-pdf-content" role="document" aria-label="${e(p.label)} 论文 PDF" tabindex="0"></div></div></div>
    <div class="notebook-writing"><div class="notebook-reading-guide"><h3>${e(p.route.name)}</h3><p>${e(p.one_line)}</p><div class="notebook-paper-digest" data-paper-digest="${p.id}"><h4>论文解读</h4><p>${e(p.reading_guide)}</p><ul>${p.key_points.map(point=>`<li>${e(point)}</li>`).join('')}</ul><a href="./data.html?source=${p.id}" target="_blank" rel="noopener noreferrer">查看文献数据 ↗</a></div>${paperEvidence(p.route.id)}</div>
    <label class="notebook-note"><span>我的阅读笔记</span><textarea data-paper-note="${p.id}" rows="8" maxlength="8000" placeholder="记下研究思路、关键证据，以及想进一步核对的问题…">${e(getRun().paperNotes?.[p.id]||'')}</textarea></label><p class="notebook-save error" data-note-status="${p.id}" role="status" hidden></p></div>
   </section>`).join('')}</div></div>`;
  runId=getRun().id;
 }
 async function loadPDF(id){
  const panel=dialog.querySelector(`#notebook-page-${id}`),body=panel?.querySelector('.notebook-pdf-content');
  if(!body||pending.has(id))return;
  if(readers.has(id)){readers.get(id).refresh();return;}
  const status=panel.querySelector('.notebook-pdf-status'),recovery=panel.querySelector('.notebook-pdf-recovery');
  const controller=new AbortController();let timer,reader;
  const done=()=>{clearTimeout(timer);pending.delete(id);};
  const cancel=()=>{controller.abort();done();reader?.destroy();readers.delete(id);};
  const failed=()=>{cancel();status.hidden=false;status.textContent='论文 PDF 暂不可用，请重试或在新标签页打开。';recovery.hidden=false;};
  pending.set(id,cancel);status.hidden=false;recovery.hidden=true;status.textContent='正在加载论文 PDF…';
  timer=setTimeout(()=>{status.hidden=false;status.textContent='加载较慢，可在新标签页打开，或重新加载。';recovery.hidden=false;},8000);
  try{
   const response=await fetch(`./api/paper/${id}`,{method:'HEAD',signal:controller.signal});
   if(!response.ok||!response.headers.get('Content-Type')?.includes('application/pdf'))throw Error('PDF unavailable');
   if(controller.signal.aborted)return;
   reader=mountPaperPDF(body,{sourceId:id,onError:failed});readers.set(id,reader);
   await reader.ready;if(controller.signal.aborted)return;
   done();status.hidden=true;recovery.hidden=true;
  }catch(error){if(!controller.signal.aborted&&error.name!=='AbortError')failed();}
 }
 function select(id,focus=false){
  if(!['compare',...papers.map(p=>p.id)].includes(id))id='compare';
  selected=id;
  for(const tab of dialog.querySelectorAll('[data-notebook-tab]')){
   const active=tab.dataset.notebookTab===id;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;
   dialog.querySelector(`#${tab.getAttribute('aria-controls')}`).hidden=!active;
   if(active&&focus)tab.focus();
  }
  if(id==='compare')dialog.querySelector('#notebook-page-compare').innerHTML=comparisonHTML();
  else{onRead(id);loadPDF(id);}
 }
 function open(id){
  if(runId!==getRun().id||!dialog.children.length){selected='compare';comparison='all';build();}
  if(!dialog.open)dialog.showModal();
  select(id||selected);launcher.setAttribute('aria-expanded','true');
 }
 dialog.addEventListener('close',()=>{launcher.setAttribute('aria-expanded','false');cancelLoads();});
 dialog.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-notebook-close'))dialog.close();
  else if(button.dataset.notebookTab)select(button.dataset.notebookTab);
  else if(button.dataset.notebook)select(button.dataset.notebook);
  else if(button.dataset.notebookRetry){const id=button.dataset.notebookRetry;pending.get(id)?.();readers.get(id)?.destroy();readers.delete(id);loadPDF(id);}
  else if(button.dataset.compareRoute){comparison=button.dataset.compareRoute;select('compare');}
  event.stopPropagation();
 });
 dialog.addEventListener('keydown',event=>{
  const tab=event.target.closest('[role="tab"]');if(!tab)return;
  const tabs=[...dialog.querySelectorAll('[role="tab"]')],index=tabs.indexOf(tab);
  const target={ArrowDown:(index+1)%tabs.length,ArrowUp:(index+tabs.length-1)%tabs.length,Home:0,End:tabs.length-1}[event.key];
  if(target!==undefined){event.preventDefault();select(tabs[target].dataset.notebookTab,true);}
 });
 dialog.addEventListener('input',event=>{
  const id=event.target.dataset.paperNote;if(!papers.some(p=>p.id===id))return;
  const saved=onNote(id,event.target.value),status=dialog.querySelector(`[data-note-status="${id}"]`);
  status.hidden=saved;status.textContent=saved?'':'笔记暂未保存，请导出实验记录备份';
 });
 launcher.addEventListener('click',()=>open());
 return {open};
}
