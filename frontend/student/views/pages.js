import {escapeHTML as e,icon} from '../ui.js';
import {STAGES,introProgress} from '../lab-state.js';
import {questProgress,taskPassed,canOpenTask} from '../quest-state.js';
import {stageAccessible} from '../navigation.js';
import {pageHeader,panel,button,statusBadge,emptyState} from '../components.js';

export function overviewPage(run,content,resume) {
  const done=content.learning.steps.filter(t=>taskPassed(run,t)).length;
  const progress=introProgress(run);
  const resumeTitle=resume.startsWith('/task/')?`继续任务 ${resume.split('/').pop()}`
    :resume.startsWith('/intro/')?'从案例导入继续':STAGES[Number(resume.split('/').pop())-1]||STAGES[run.stage];
  const resumePanel=panel({title:resumeTitle,body:`<p>${e(content.routes.find(r=>r.id===run.route)?.name||'异槲皮苷')} · ${done} / 24 项任务已记录</p><div class="actions">${button({label:'继续当前练习',href:`#${resume}`})}${button({label:'查看实验记录',href:'#/records',variant:'secondary'})}</div>`}).replace('fg-panel','fg-panel fg-resume');
  const flow=panel({title:'六个阶段，逐步推进',body:`<ol class="fg-list">${STAGES.map((title,i)=>{
    const available=stageAccessible(run,content,i),p=questProgress(run,content,i);
    return `<li>${available?`<a href="#${i===0&&!progress.complete?`/intro/${Math.min(progress.step,3)}`:`/stage/${i+1}`}"`:'<div class="fg-locked-stage"'}><span class="fg-step-index">${String(i+1).padStart(2,'0')}</span><span><strong>${e(title)}</strong><small>${p.completed} / ${p.total} 项${available?'':' · 完成前序步骤后解锁'}</small></span>${available?icon('arrow'):'<span aria-label="未解锁">○</span>'}${available?'</a>':'</div>'}</li>`;
  }).join('')}</ol>`});
  return `${pageHeader({title:'实验总览',description:'从异槲皮苷出发，观察分子、对照文献，逐步形成自己的实验方案。'})}<div class="fg-split"><div>${resumePanel}<section class="fg-section"><h2>资料与证据</h2><div class="fg-resource-grid">${[['论文对照','三篇论文的做法、条件与证据。','#/papers','case'],['案例页','目标分子与三条制备路线。','./case.html','steps'],['数据查询','查阅已登记的文献报告值。','./data.html','data']].map(([title,note,href,ic])=>`<a class="fg-resource" href="${href}">${icon(ic)}<h3>${title}</h3><p>${note}</p></a>`).join('')}</div></section><section class="fg-section">${panel({title:'开始前',body:`<p>案例导入分为认识分子、合成的难处、三篇论文。你可以随时回访已经打开的页面。</p><div class="actions">${button({label:'回看案例导入',href:'#/intro/1',variant:'secondary'})}${statusBadge('案例与教学内容待教师审定','warning')}</div>`})}</section></div>${flow}</div>`;
}
export function unavailablePage(reason,resume,unknown=false) {
  return emptyState({title:unknown?'页面未找到':'这一页尚未解锁',description:reason,tone:'warning',actions:button({label:'继续当前练习',href:`#${resume}`})+button({label:'返回实验总览',href:'#/home',variant:'secondary'})});
}
export function pageNavigation(page,run,content) {
  // The intro's own step navigation is reused; never render a duplicate strip.
  if(page.kind==='intro')return '';
  if(page.kind==='task') {
    const task=content.learning.steps.find(t=>t.id===page.id);
    return `<nav class="fg-local-nav" aria-label="当前阶段任务"><a href="#/stage/${task.stage+1}">阶段操作</a>${content.learning.steps.filter(t=>t.stage===task.stage).map(t=>
      canOpenTask(run,content,t.id,task.stage)?`<a href="#/task/${t.id}"${t.id===page.id?' aria-current="page"':''}>任务 ${t.id}</a>`:`<span aria-disabled="true">任务 ${t.id}</span>`).join('')}</nav>`;
  }
  return '';
}
