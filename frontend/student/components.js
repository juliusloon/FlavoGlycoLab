import {escapeHTML as e,icon} from './ui.js';

// Text and attributes are escaped. `body` and `actions` accept trusted component markup only.
export function button({label,href,action,variant='primary',disabled=false,type='button',iconName=''}={}) {
  const style=['primary','secondary','quiet'].includes(variant)?variant:'primary';
  const attrs=`class="button ${style}"${action?` data-action="${e(action)}"`:''}`;
  const text=e(label)+(iconName?` ${icon(iconName)}`:'');
  return href&&!disabled?`<a ${attrs} href="${e(href)}">${text}</a>`
    :`<button ${attrs} type="${e(type)}"${disabled?' disabled':''}>${text}</button>`;
}
export function field({label,name,value='',unit='',type='text',attributes=''}={}) {
  return `<label class="field"><span>${e(label)}${unit?` <small>${e(unit)}</small>`:''}</span><input name="${e(name)}" type="${e(type)}" value="${e(value)}" ${type==='number'?'step="any"':''} ${attributes}></label>`;
}
export function statusBadge(label,tone='neutral') {
  return `<span class="fg-status ${['neutral','success','warning','danger'].includes(tone)?tone:'neutral'}">${e(label)}</span>`;
}
export function pageHeader({title,description='',actions=''}={}) {
  return `<header class="fg-page-header"><div><h1>${e(title)}</h1>${description?`<p>${e(description)}</p>`:''}</div>${actions?`<div class="actions">${actions}</div>`:''}</header>`;
}
export function panel({title,body='',id=''}={}) {
  return `<section class="fg-panel"${id?` id="${e(id)}"`:''}>${title?`<h2>${e(title)}</h2>`:''}${body}</section>`;
}
export function emptyState({title,description='',actions='',tone='neutral'}={}) {
  return `<section class="fg-empty ${tone==='warning'?'warning':''}"><h1>${e(title)}</h1>${description?`<p>${e(description)}</p>`:''}<div class="actions">${actions}</div></section>`;
}
// Kept as a compatibility export for the page entry points; the surface is a bottom control bar.
export function siteHeader(active,{workbench=false}={}) {
  return `<a class="brand workspace-brand" id="nav-home" data-site-page="home" href="./index.html#/home" aria-label="FlavoGlycoLab 实验总览"${active==='home'?' aria-current="page"':''}><svg viewBox="0 0 36 36" aria-hidden="true"><path d="m18 3 13 7v16l-13 7L5 26V10Z"/><path d="m18 10 7 4v8l-7 4-7-4v-8Z"/></svg><span class="brand-name">Flavo<b>Glyco</b>Lab</span></a><button type="button" id="workspace-more" class="workspace-more" popovertarget="workspace-menu" aria-label="更多" aria-haspopup="menu" aria-expanded="false" aria-controls="workspace-menu"><span class="more-label">更多</span><svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg></button>`;
}
function workspaceMenu(active,{workbench=false}={}) {
  return `<div id="workspace-menu" class="workspace-menu" popover="auto" role="menu" aria-label="实验空间操作">${workbench?`<button type="button" role="menuitem" data-action="new">${icon('plus')}开启新实验</button>`:`<a role="menuitem" href="./index.html#new">${icon('plus')}开启新实验</a>`}<a role="menuitem" id="nav-records" data-site-page="records" href="./index.html#/records"${active==='records'?' aria-current="page"':''}>${icon('history')}实验记录</a><button type="button" role="menuitem" id="settings-button" aria-haspopup="dialog" aria-controls="settings-dialog">${icon('sliders')}设置</button>${workbench?'<p id="save-status" role="status">准备实验空间…</p>':''}</div>`;
}
export function settingsDialog({workbench=false}={}) {
  const pages=[['papers','论文对照',workbench?'#/papers':'./index.html#/papers'],['case','案例页','./case.html'],['data','数据查询','./data.html'],['components','界面规范','./components.html']];
  return `<dialog id="settings-dialog" aria-labelledby="settings-title"><header class="dialog-heading"><div><h2 id="settings-title">实验空间设置</h2></div><button class="close-button" type="button" data-close-dialog aria-label="关闭设置">×</button></header>${workbench?'<label class="setting-row" for="reduce-motion"><span><strong>减少动态效果</strong></span><input type="checkbox" id="reduce-motion"></label><div class="setting-row"><span><strong>回看案例导入</strong></span><button class="button secondary" data-action="replay-intro">回到分子</button></div>':''}<details><summary>开发者模式</summary><nav class="fg-developer-links" aria-label="开发者模式页面">${pages.map(([key,label,href])=>`<a id="nav-${key}" data-site-page="${key}" href="${href}" data-close-dialog>${label}</a>`).join('')}</nav>${workbench?'<button class="text-button" id="retro-import-button" aria-haspopup="dialog" data-close-dialog>逆合成导入</button>':''}</details><details class="fg-evidence-info"><summary>资料与审定状态</summary><p>案例与教学内容待教师审定。机器检查和学习自查不代表教师批准。</p><div class="actions"><a href="./case.html#references">参考文献与许可</a><a href="./data.html#source-details">数据来源登记</a></div></details></dialog>`;
}
function closeSettingsForNavigation(event) {
  if(event.target.closest('[data-close-dialog]'))event.currentTarget.close();
}
export function mountSiteHeader(active,options={}) {
  const controls=document.querySelector('[data-site-controls]');
  if(controls){controls.className='fg-site-controls';controls.setAttribute('aria-label','实验空间');controls.innerHTML=siteHeader(active,options);}
  let menu=document.querySelector('#workspace-menu');
  if(!menu){document.body.insertAdjacentHTML('beforeend',workspaceMenu(active,options));menu=document.querySelector('#workspace-menu');}
  let dialog=document.querySelector('#settings-dialog');
  if(!dialog){document.body.insertAdjacentHTML('beforeend',settingsDialog(options));dialog=document.querySelector('#settings-dialog');}
  const opener=document.querySelector('#settings-button');
  const more=document.querySelector('#workspace-more');
  const closeMenu=(restoreFocus=false)=>{if(menu.matches(':popover-open'))menu.hidePopover();if(restoreFocus)more.focus();};
  // Close before an action opens a dialog: its return target must remain visible.
  menu.addEventListener('click',event=>{if(event.target.closest('[role="menuitem"]'))closeMenu(true);},true);
  if(opener&&dialog)opener.onclick=()=>{if(!dialog.open)dialog.showModal();};
  menu.addEventListener('toggle',()=>more.setAttribute('aria-expanded',String(menu.matches(':popover-open'))));
  more.addEventListener('keydown',event=>{
    if(!['ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();if(!menu.matches(':popover-open'))menu.showPopover();
    const items=menu.querySelectorAll('[role="menuitem"]');items[event.key==='ArrowUp'?items.length-1:0]?.focus();
  });
  menu.addEventListener('keydown',event=>{
    const items=[...menu.querySelectorAll('[role="menuitem"]')],index=items.indexOf(document.activeElement);
    if(['ArrowUp','ArrowDown','Home','End'].includes(event.key)){
      event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?items.length-1:(index+(event.key==='ArrowDown'?1:-1)+items.length)%items.length;items[next].focus();
    }else if(event.key==='Escape'){event.preventDefault();closeMenu(true);}
    else if(event.key==='Tab'){closeMenu(true);}
  });
  window.addEventListener('hashchange',()=>closeMenu());
  document.addEventListener('click',event=>{
    const toggle=event.target.closest('[data-toggle-sidebar]');if(!toggle)return;
    const name=toggle.dataset.toggleSidebar;
    if(!['quests','workflow'].includes(name))return;
    const preferences=sidebarPreferences();preferences[name]=!preferences[name];
    try{localStorage.setItem(SIDEBAR_PREFERENCES_KEY,JSON.stringify(preferences));}catch{}
    syncSidebarPanels();
    if(innerWidth<=760){
      if(document.querySelector('.workspace')?.classList.contains('sidebar-collapsed'))window.scrollTo({top:0,behavior:'instant'});
      else toggle.scrollIntoView({block:'nearest',behavior:'instant'});
    }
  });
  // Close settings before a child control opens another modal, preserving native focus restoration.
  if(dialog){dialog.removeEventListener('click',closeSettingsForNavigation,true);dialog.addEventListener('click',closeSettingsForNavigation,true);}
  updateSiteNavigation(active);
}
export function updateSiteNavigation(active) {
  document.body.classList.toggle('fg-learning-page',active==='bench');
  document.querySelectorAll('[data-site-page]').forEach(link=>{
    if(link.dataset.sitePage===active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  });
}
const SIDEBAR_PREFERENCES_KEY='flavoglycolab.sidebar.v1';
let sidebarState;
function sidebarPreferences(){
  if(!sidebarState){
    sidebarState={quests:false,workflow:false};
    try{const saved=JSON.parse(localStorage.getItem(SIDEBAR_PREFERENCES_KEY)||'{}');for(const key of Object.keys(sidebarState))if(typeof saved?.[key]==='boolean')sidebarState[key]=saved[key];}catch{}
  }
  return sidebarState;
}
export function sidebarToggle(name,label,iconName){
  const id=name==='quests'?'quest-panel-content':'workflow-content';
  return `<button type="button" class="sidebar-toggle" data-toggle-sidebar="${e(name)}" aria-expanded="true" aria-controls="${id}" aria-label="收起${e(label)}" title="收起${e(label)}"><span class="sidebar-toggle-arrow">${icon('down')}</span><span class="sidebar-rail-icon">${icon(iconName)}</span></button>`;
}
export function syncSidebarPanels(){
  const preferences=sidebarPreferences(),compact=preferences.quests&&preferences.workflow;
  const workspace=document.querySelector('.workspace'),wasCompact=workspace?.classList.contains('sidebar-collapsed');
  workspace?.classList.toggle('sidebar-collapsed',compact);
  document.body.classList.toggle('fg-sidebar-collapsed',compact);
  for(const [key,id,label] of [['quests','quest-panel','主线任务'],['workflow','workflow','实验历程']]){
    const panel=document.getElementById(id);if(!panel)continue;
    const collapsed=preferences[key],toggle=panel.querySelector('[data-toggle-sidebar]'),body=panel.querySelector('.sidebar-content');
    panel.classList.toggle('is-collapsed',collapsed);if(body)body.hidden=collapsed;
    if(toggle){toggle.setAttribute('aria-expanded',String(!collapsed));toggle.setAttribute('aria-label',`${collapsed?'展开':'收起'}${label}`);toggle.title=`${collapsed?'展开':'收起'}${label}`;}
  }
  if(workspace&&wasCompact!==compact)window.dispatchEvent(new Event('resize'));
}
export function returnControl(fallback='./index.html#/home') {
  return `<div class="fg-return-row"><button class="text-button" type="button" data-page-back data-fallback="${e(fallback)}">← 返回上一页</button><a href="./index.html#/resume">继续当前练习 ${icon('arrow')}</a></div>`;
}
export function bindReturnNavigation() {
  document.addEventListener('click',event=>{
    const back=event.target.closest('[data-page-back]');if(!back)return;
    const internal=history.state?.fgNavigation===true || (()=>{try{return new URL(document.referrer).origin===location.origin;}catch{return false;}})();
    if(internal&&history.length>1)history.back();else location.href=back.dataset.fallback||'./index.html#/home';
  });
}
