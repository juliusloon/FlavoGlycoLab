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
const siteItems=[['home','实验总览','./index.html#/home'],['bench','探究实验','./index.html#/resume'],['papers','论文对照','./index.html#/papers'],['case','案例页','./case.html'],['data','数据查询','./data.html'],['records','实验记录','./index.html#/records']];
export function siteHeader(active,{workbench=false}={}) {
  return `<div class="fg-header-main"><a class="brand" href="./index.html#/home" aria-label="FlavoGlycoLab 实验总览"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="m18 3 13 7v16l-13 7L5 26V10Z"/><path d="m18 10 7 4v8l-7 4-7-4v-8Z"/></svg>Flavo<span>Glyco</span>Lab</a><span class="fg-product-name">黄酮糖苷虚拟实验室</span><div class="fg-header-tools">${workbench?'<span id="save-status" role="status">准备实验空间…</span><button class="text-button" id="retro-import-button" aria-haspopup="dialog">逆合成导入</button><button class="text-button" id="settings-button" aria-haspopup="dialog">设置</button><button class="tutor-launcher" id="tutor-launcher" aria-label="AI 实验导师" aria-expanded="false" aria-controls="tutor-panel">'+icon('ai')+'<span>AI 实验导师</span></button>':'<a class="fg-library-link" href="./components.html">界面规范</a>'}</div></div><nav class="fg-site-nav" aria-label="站点导航">${siteItems.map(([key,label,href])=>`<a id="nav-${key}" href="${href}"${key===active?' aria-current="page"':''}>${label}</a>`).join('')}<a class="fg-library-link" href="./components.html"${active==='components'?' aria-current="page"':''}>界面规范</a></nav>`;
}
export function mountSiteHeader(active,options={}) {
  const header=document.querySelector('[data-site-header]');
  if(header){header.className='fg-site-header';header.innerHTML=siteHeader(active,options);}
}
export function updateSiteNavigation(active) {
  document.querySelectorAll('.fg-site-nav a').forEach(a=>{
    if(a.id===`nav-${active}`)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
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
