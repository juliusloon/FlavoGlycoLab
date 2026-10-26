import { escapeHTML as e } from '../ui.js';
import { routeLearningGate } from '../quest-state.js';
export function learningRecords(run,content){
  const entries=Object.entries(run.learning?.entries??{});
  if(!entries.length)return '';
  const titles=new Map(content.learning?.steps.map(t=>[t.id,t.title])??[]);
  return `<details class="log-details learning-records" open><summary>学习任务记录 · ${entries.length} 项</summary>${entries.map(([id,x])=>`<article><h3>${id} · ${e(titles.get(id)??'学习任务')} <small>${x.status==='recorded'?'已记录':'草稿'}</small></h3><p>${e(x.note)}</p>${x.feedback?`<p class="muted">${e(x.feedback)}</p>`:''}</article>`).join('')}<h3>首次独立判断</h3>${Object.entries(run.learning?.independent??{}).map(([id,x])=>`<p>${id}${['05','06'].includes(id)?'（旧版编号）':''} · ${e(x.route)}：${e(x.note)}</p>`).join('')||'<p class="muted">尚无独立判断记录。</p>'}</details>`;
}
// TASK-027 L02 先学后做：学习区显示各路线前置学习进度与"进入参照练习"门禁状态。
// 三篇并列、先选任一篇；切换路线按目标路线重新判断，不继承另一路线的通过结论。
export function learningGatePanel(run,content){
  const gates=(content?.routes??[]).map(route=>({route,gate:routeLearningGate(run,content,route.id)}));
  const current=gates.find(x=>x.route.id===run.route)??gates[0];
  const mode=run.stageMode??'guided';
  const rows=gates.map(({route,gate})=>`<li class="${route.id===run.route?'current':''}"><span class="route-code">${route.id}</span><span>${e(route.name)}</span><span class="gate-progress">${gate.completed} / ${gate.total}</span><span class="gate-state">${gate.complete?'前置学习已完成':route.id===run.route?'当前路线 · 进行中':'可选路线 · 待确认依据'}</span></li>`).join('');
  const enterGuided=current?.gate.complete===true;
  const openDone=run.guidedDone?.[run.route]===true;
  return `<section class="learning-gate-panel" data-learning-gate><h2>路线学习进度</h2><p class="gate-guidance">01—03为共通学习；在04选择规划路线并提交依据后，进入对应路线的参照练习。更换路线保留前三步，只需重新确认选择依据。</p><ul class="gate-routes">${rows}</ul><div class="gate-actions">${mode==='open'
    ?`<span class="gate-chip open">当前：开放探究</span><button type="button" class="button secondary" data-action="enter-guided">返回参照练习</button>`
    :`<button type="button" class="button primary" data-action="enter-guided" ${enterGuided?'':'disabled'}>进入参照练习</button>${openDone?`<button type="button" class="button secondary" data-action="enter-open">进入开放探究</button>`:`<span class="gate-hint">${enterGuided?'参照练习中：按文献定位锁定关键条件，完成后解锁开放探究':'完成本路线主线 01—04 后解锁参照练习'}</span>`}`}</div></section>`;
}
