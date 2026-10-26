import {escapeHTML as e,icon,STAGE_ICONS} from '../ui.js';
import {STAGES,introProgress} from '../lab-state.js';
import {questProgress,taskPassed} from '../quest-state.js';
import {stageAccessible} from '../navigation.js';
import {pageHeader,panel,button,emptyState} from '../components.js';

export function overviewPage(run,content,resume) {
  const done=content.learning.steps.filter(t=>taskPassed(run,t)).length;
  const progress=introProgress(run);
  const resumeTitle=resume.startsWith('/task/')?`继续任务 ${resume.split('/').pop()}`
    :resume.startsWith('/intro/')?'从案例导入继续':STAGES[Number(resume.split('/').pop())-1]||STAGES[run.stage];
  const resumePanel=panel({title:resumeTitle,body:`<p>${e(content.routes.find(r=>r.id===run.route)?.name||'规划路线尚未选择')} · ${done} / 24 项任务已记录</p><div class="actions">${button({label:'继续当前练习',href:`#${resume}`})}${button({label:'查看实验记录',href:'#/records',variant:'secondary'})}</div>`}).replace('fg-panel','fg-panel fg-resume');
  const flow=panel({title:'实验阶段',body:`<ol class="fg-list">${STAGES.map((title,i)=>{
    const available=stageAccessible(run,content,i),p=questProgress(run,content,i);
    return `<li>${available?`<a href="#${i===0&&!progress.complete?`/intro/${Math.min(progress.step,3)}`:`/stage/${i+1}`}"`:'<div class="fg-locked-stage"'}><span class="stage-icon">${icon(STAGE_ICONS[i])}</span><span><strong>${e(title)}</strong><small>${p.completed} / ${p.total} 项${available?'':' · 完成前序步骤后解锁'}</small></span>${available?icon('arrow'):'<span aria-label="未解锁">○</span>'}${available?'</a>':'</div>'}</li>`;
  }).join('')}</ol>`});
  return `${pageHeader({title:'实验总览'})}<div class="fg-split"><div>${resumePanel}<div class="actions fg-section">${button({label:'回看案例导入',href:'#/intro/1',variant:'secondary'})}</div></div>${flow}</div>`;
}
export function unavailablePage(reason,resume,unknown=false) {
  return emptyState({title:unknown?'页面未找到':'这一页尚未解锁',description:reason,tone:'warning',actions:button({label:'继续当前练习',href:`#${resume}`})+button({label:'返回实验总览',href:'#/home',variant:'secondary'})});
}
