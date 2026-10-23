import {escapeHTML as e, icon} from '../ui.js';
import {inquiryTool} from './inquiry-tools.js';
import {questProgress,taskPassed,taskStatus,canOpenTask,nextTaskId,routeLearningGate} from '../quest-state.js';
import {introProgress} from '../lab-state.js';
import {stageModeBadge} from './workbench.js';
import {learningGatePanel} from './learning.js';

const concepts={R1:['加一个糖','体外双酶协作'],R2:['去掉末端鼠李糖','保留目标葡萄糖基'],R3:['让细胞完成转化','外加底物 · 胞内供体']};
export function routeDiagram(id){
 const labels={R1:['槲皮素','异槲皮苷'],R2:['芦丁','异槲皮苷'],R3:['外加槲皮素','异槲皮苷']}[id];
 const scaffold=(x,sugars)=>`<g transform="translate(${x} 55)"><circle r="23" class="scaffold"/><text y="5" text-anchor="middle" class="scaffold-label">Q</text>${sugars?`<path d="M23 0h12" class="bond"/><circle cx="43" cy="0" r="10" class="sugar"/><text x="43" y="4" class="unit-label" text-anchor="middle">G</text>${sugars===2?'<path d="m48-9 10-12" class="bond"/><circle cx="64" cy="-26" r="9" class="terminal"/><text x="64" y="-23" class="unit-label" text-anchor="middle">R</text>':''}`:''}</g>`;
 return `<svg class="route-diagram ${id}" viewBox="0 0 320 130" role="img" aria-label="${labels.join('转化为')}；字母块图为机制类别示意，非原子结构"><path class="route-arrow" d="M117 55h69m-8-6 8 6-8 6"/>${scaffold(42,id==='R2'?2:0)}${id==='R1'?'<circle cx="150" cy="27" r="10" class="sugar"/><text x="150" y="31" text-anchor="middle" class="unit-label">G</text><path d="m150 38v10" class="bond"/>':''}${id==='R2'?'<circle cx="150" cy="27" r="9" class="terminal"/><text x="150" y="31" text-anchor="middle" class="unit-label">R</text><path d="m150 46v-9" class="bond"/>':''}${id==='R3'?'<ellipse cx="151" cy="27" rx="24" ry="13" class="cell"/><text x="151" y="30" text-anchor="middle" class="unit-label">细胞</text>':''}${scaffold(229,1)}<text x="50" y="102" text-anchor="middle">${labels[0]}</text><text x="251" y="102" text-anchor="middle">${labels[1]}</text><text x="160" y="125" text-anchor="middle" class="diagram-note">Q 苷元 · G 葡萄糖 · R 鼠李糖</text></svg>`;
}
export function caseCards(run,c,{compact=false}={}){
 return `<div class="case-cards ${compact?'compact':''}">${c.routes.map(r=>`<button class="case-card ${r.id} ${run.route===r.id&&run.exploration?.routeChosen?'selected':''}" data-case="${r.id}" aria-label="探索${r.name}，${c.sources.find(s=>s.source_id===r.source_id).label}"><div class="case-card-top"><span class="route-code">${r.id}</span><span>${e(c.sources.find(s=>s.source_id===r.source_id).label)}</span></div>${routeDiagram(r.id)}<h3>${e(r.name)}</h3><p>${concepts[r.id][0]}</p><span class="case-open">探索这项研究 ${icon('arrow')}</span></button>`).join('')}</div>`;
}
export function moleculeStage(){
 return `<div class="molecule-stage"><div id="molecule-viewer" aria-label="异槲皮苷分子查看器"><p class="molecule-loading">正在准备分子结构…</p></div><div class="molecule-toolbar"><button class="text-button" data-molecule="highlight" aria-pressed="false">聚焦糖基</button><button class="text-button" data-molecule="reset">复位</button></div></div>`;
}
function sourceTag(c,id){
 const s=c.sources.find(x=>x.source_id===id)||c.learning.identity_sources?.find(x=>x.source_id===id);
 return `<span class="point-source">${e(s?.label||id)}</span>`;
}
function actQuestion(c,act,block,progress,retry){
 const q=block.question;if(!q)return '';
 const done=progress[`act${act}`]===q.answer;
 return `<div class="act-question" data-act-question="${act}"><p class="act-question-prompt">${e(q.prompt)}</p><div class="act-choices">${q.choices.map((choice,i)=>`<button class="intro-choice ${done&&choice.id===q.answer?'correct':''}" data-act="${act}" data-choice="${choice.id}" ${done?'disabled':''}><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${e(choice.text)}</span></button>`).join('')}</div>${done?`<p class="intro-feedback success" role="status">${e(q.feedback)}</p>`:retry?`<p class="intro-feedback retry" role="status">${e(q.retry)}</p>`:''}<div class="point-sources">${(q.source_ids||[]).map(id=>sourceTag(c,id)).join('')}</div></div>`;
}
/* TASK-031：导入三幕单幕两区呈现——左侧当前幕叙事，右侧该幕问题/门禁；答对停在本幕显示反馈，由「进入下一幕」显式推进。 */
function introNarrative(c,block,act,extra=''){
  const refIds=[...new Set(block.points.flatMap(p=>p.source_ids))];
  return `<section class="intro-act" data-act="${act}"><p class="act-kicker">${e(block.kicker)}</p><h2>${e(block.title)}</h2><div class="act-prose">${block.points.map(p=>`<p>${e(p.text)}</p>`).join('')}</div><p class="para-refs"><span class="refs-label">来源</span>${refIds.map(id=>sourceTag(c,id)).join('')}</p><p class="act-review">导入内容 · 待教师审定</p>${extra}</section>`;
}
function introRail(run,c,act,block,progress,retry){
  if(act===3){
    const gate=routeLearningGate(run,c,run.route);
    return `<aside class="task-rail intro-rail"><div class="gate-row"><button class="text-button" data-action="intro-tutor">让导师带我读论文</button><p class="reading-note">${e(c.intro.reading_note.text)}</p><p class="gate-hint">${e(c.intro.papers_gate.text)}（已打开 ${progress.papers.length}/3）</p><p class="learning-gate-hint">当前路线 ${run.route} 前置学习：${gate.completed}/${gate.total} ${gate.complete?'· 已完成，可进入参照练习':'· 完成主线 01—04 后进入参照练习'}（机器判断 · agent_checked_candidate）</p><div class="scene-bottom"><button class="button secondary" data-action="begin-quest" ${progress.complete?'':'disabled'}>开始主线探究 ${icon('arrow')}</button></div></div></aside>`;
  }
  const advance=progress.step>act?`<button class="button primary intro-advance" data-action="intro-advance">进入第${act===1?'二':'三'}幕 ${icon('arrow')}</button>`:'';
  return `<aside class="task-rail intro-rail">${actQuestion(c,act,block,progress,retry)}${advance}</aside>`;
}
export function explorationScene(run,c,retry={},showAct=null){
  const progress=introProgress(run),intro=c.intro;
  const steps=[['01','认识分子'],['02','合成的难处'],['03','三篇论文']];
  const stepper=`<ol class="intro-steps" aria-label="导入进度">${steps.map(([n,label],i)=>{const s=i+1,state=progress.step>s?'done':progress.step===s?'current':'';return `<li${state?` class="${state}"`:''}><span class="intro-step-number">${progress.step>s?'✓':n}</span><span>${label}</span></li>`;}).join('')}</ol>`;
  const act=Math.min(Math.max(Number(showAct)||progress.step,1),progress.step,3);
  const block=act===1?intro.case:act===2?intro.chemical_limit:null;
  const narrative=act===3
    ?`<section class="intro-act" data-act="3"><p class="act-kicker">导入 · 第三幕</p><h2>三篇论文，三种思路</h2>${caseCards(run,c)}</section>`
    :introNarrative(c,block,act,act===1?moleculeStage():'');
  return `<section class="exploration-scene stepped"><div class="scene-title"><h1>异槲皮苷</h1><p>同一个目标，三种制备思路。<br class="mobile-only">你会如何设计这次实验？</p><p class="orientation">${e(intro.orientation)}</p></div>${stepper}<div class="task-view intro-view">${narrative}${introRail(run,c,act,block,progress,retry)}</div></section>`;
}
const shortTitles={'01':'明确实验任务','02':'认识底物和产物','03':'比较三条路线','04':'选择路线并说明理由','05':'选择底物','06':'选择催化剂','07':'选择供体方案','08':'确认体系是否合理'};
export function questPanel(run,c,activeId){
 const progress=questProgress(run,c),index=progress.tasks.findIndex(t=>t.id===(activeId||progress.currentId));
 const start=Math.max(0,Math.min(index<0?progress.tasks.length-3:index-1,progress.tasks.length-3));
 const visible=progress.tasks.slice(start,start+3);
 const current=progress.tasks.find(t=>t.id===activeId)||progress.tasks.find(t=>t.id===progress.currentId);
 return `<div class="quest-heading"><h2>主线任务</h2><span>${progress.completed}<small> / ${progress.total}</small></span></div><progress class="quest-progress" aria-label="本阶段自查进度" max="${progress.total||1}" value="${progress.completed}"></progress><div class="quest-list">${visible.map(t=>{const passed=taskPassed(run,t),active=t.id===(activeId||progress.currentId);return `<button class="quest-row ${active?'current':''} ${passed?'done':''}" data-task="${t.id}" ${canOpenTask(run,c,t.id)?'':'disabled'} ${active?'aria-current="step"':''}><span class="quest-number">${passed?'✓':t.id}</span><span><strong>${e(shortTitles[t.id]||t.title)}</strong><small>${passed?(t.choices.length?'自查通过':'思考已记录'):active?'当前任务':'下一任务'}</small></span>${active?icon('arrow'):''}</button>`;}).join('')}</div>${progress.allComplete?`<div class="quest-guidance"><strong>本阶段探究已完成</strong></div><button class="button primary quest-cta" data-action="stage-workspace">${run.stage===0?'确认路线':'返回操作台'} ${icon('arrow')}</button>`:`<div class="quest-guidance"><strong>${e(current?.title||'继续探究')}</strong><p>${e(current?.prompt||'从当前任务开始。')}</p></div><button class="button primary quest-cta" data-action="begin-quest">${activeId?'继续当前任务':'开始探究'} ${icon('arrow')}</button>`}<details class="quest-all"><summary>查看全部任务</summary>${progress.tasks.map(t=>`<button data-task="${t.id}" ${canOpenTask(run,c,t.id)?'':'disabled'}>${taskPassed(run,t)?'✓':t.id} ${e(shortTitles[t.id]||t.title)}</button>`).join('')}</details>`;
}
function identityComparison(c){
 return `<div class="identity-comparison">${c.learning.identities.map((x,i)=>`<button class="identity-tile ${i===0?'active':''}" data-identity="${i}" aria-pressed="${i===0}"><span class="identity-symbol">${['3-O','2 糖','苷元','组分','4′-O'][i]}</span><strong>${e(x.name)}</strong></button>`).join('')}</div><div id="identity-detail" class="identity-detail">${e(c.learning.identities[0].detail)}</div>`;
}
function taskVisual(run,c,task){
 if(['09','17','20'].includes(task.id))return inquiryTool(task.id,run.learning.entries[task.id]||{});
 if(task.id==='01')return `${task.guidance?`<div class="task-guidance"><strong>观察指引</strong><ol>${task.guidance.map(g=>`<li>${e(g)}</li>`).join('')}</ol><div class="point-sources">${(task.guidance_source_ids||[]).map(id=>sourceTag(c,id)).join('')}</div></div>`:''}<div class="angle-chips"><span>可比较的角度：</span>${c.routes.map(r=>`<span class="angle-chip">${r.id} ${{R1:'体外加糖',R2:'选择性去糖',R3:'全细胞转化'}[r.id]}</span>`).join('')}</div><div class="task-molecule">${moleculeStage()}<div class="structure-notes"><span>苷元 <strong>槲皮素</strong></span><span>糖种 <strong>葡萄糖</strong></span><span>连接 <strong>3-O · β-D</strong></span></div></div>`;
 if(task.id==='02')return identityComparison(c);
 if(task.id==='03')return `${caseCards(run,c,{compact:true})}<p class="selected-route">比较三张路线卡的底物、催化剂和加糖/去糖方向。</p>`;
 if(task.id==='04')return `${caseCards(run,c,{compact:true})}<p class="selected-route">${run.exploration?.routeChosen?'当前方案':'初始参考'} <strong>${e(c.routes.find(r=>r.id===run.route).name)}</strong></p>`;
 if(task.id==='08')return `<div class="evidence-ladder">${[['01','底物','与路线起始原料一致'],['02','催化剂','与加糖/去糖/全细胞对应'],['03','供体','按路线选择外加、再生或胞内供给'],['04','方向','能说清加糖或去糖过程']].map(([n,title,note])=>`<div><span>${n}</span><strong>${title}</strong><p>${note}</p></div>`).join('')}</div>`;
 const route=c.routes.find(r=>r.id===run.route),study=c.case_studies?.find(x=>x.route_id===run.route)?.stages.find(x=>x.stage===run.stage);
 return `<div class="task-route-context">${routeDiagram(run.route)}<div><strong>${e(route.name)} · ${e(study?.title||task.title)}</strong><p>${e(study?.solution||route.system)}</p><button class="text-button" data-action="compare">对照三篇论文 ${icon('arrow')}</button></div></div>`;
}
/* TASK-026 评价面板：entry.eval 四态渲染，全部标注“机器反馈 · 待教师审定”。 */
function evalPanel(evalInfo,task){
 if(!evalInfo||!evalInfo.state)return '';
 const badge='<span class="eval-badge">机器反馈 · 待教师审定</span>';
 if(evalInfo.state==='evaluating')return `<div class="eval-panel evaluating" role="status"><p>导师评价中…</p>${badge}</div>`;
 if(evalInfo.state==='passed')return `<div class="eval-panel passed"><p><strong>导师评价：达成目标 ✓</strong></p>${(evalInfo.rubricHits||[]).length?`<div class="eval-block"><span class="eval-label">命中要点</span><ul>${evalInfo.rubricHits.map(h=>`<li>${e(h.span||h.id)}</li>`).join('')}</ul></div>`:''}${badge}</div>`;
 if(evalInfo.state==='failed')return `<div class="eval-panel failed"><p><strong>导师评价：暂未达成</strong></p>${(evalInfo.missing||[]).length?`<div class="eval-block"><span class="eval-label">未命中要点</span><ul>${evalInfo.missing.map(m=>`<li>${e(m.point||m.id)}</li>`).join('')}</ul></div>`:''}${(evalInfo.guidance||[]).length?`<div class="eval-block"><span class="eval-label">改进建议</span><ul>${evalInfo.guidance.map(g=>`<li>${e(g)}</li>`).join('')}</ul></div>`:''}<button type="button" class="button secondary" data-action="ask-tutor-eval" data-task-id="${task.id}">带着这些问题问导师</button>${badge}</div>`;
 if(evalInfo.state==='degraded')return `<div class="eval-panel degraded" role="status"><p>AI 评价不可用，已按自查流程记录（机器反馈降级）</p>${badge}</div>`;
 return '';
}
function paperDigestCards(c,task){
 const papers=c.learning.paper_digests?.papers??{};
 const ids=task.source_ids.filter(id=>papers[id]);
 if(!ids.length)return '';
 return `<div class="paper-digests">${ids.map(id=>{const d=papers[id];return `<details class="paper-digest" data-paper-digest="${id}"><summary><strong>${e(d.label)}</strong></summary><div class="paper-digest-body"><p class="paper-one-line">${e(d.one_line)}</p><p class="reading-guide"><strong>阅读指引</strong>　${e(d.reading_guide)}</p><ul class="key-points">${d.key_points.map(k=>`<li>${e(k)}</li>`).join('')}</ul><p class="data-pointer">数值见数据查询 ${e(d.data_pointers[0])} 等 ${d.data_pointers.length} 条 DQ 记录</p><div class="paper-digest-actions"><button type="button" class="button secondary" data-open-paper="${id}" aria-expanded="false">在线阅读论文 PDF</button><a class="text-button" href="./api/paper/${id}" target="_blank" rel="noopener noreferrer">新标签页打开 ↗</a><button type="button" class="text-button" data-paper-ask="${id}">问导师解读此篇</button></div><div class="paper-panel" hidden><p class="paper-status" role="status"></p><iframe title="${e(d.label)} 论文 PDF"></iframe></div><p class="paper-scope">解读为导师机器整理 · 待教师审定；PDF 公开范围见 TASK-008 例外，请勿二次分发。</p></div></details>`;}).join('')}</div>`;
}
const NARR_KEY='flavoglycolab.narr-page';
function narrState(){try{return JSON.parse(sessionStorage.getItem(NARR_KEY)||'{}')}catch{return{}}}
/* TASK-026 叙事区分页：纯 DOM hidden 切换，绝不触发 render()，避免打断 3Dmol/焦点/评价请求。 */
export function bindTaskNarrative(root,taskId){
 const wrap=root.querySelector('.task-narrative');if(!wrap)return;
 for(const sup of wrap.querySelectorAll('.ref-sup')){
  sup.addEventListener('click',()=>{
   const details=wrap.querySelector('.task-sources');
   if(details){details.open=true;details.scrollIntoView({block:'nearest',behavior:'smooth'});}
  });
 }
 const pages=[...wrap.querySelectorAll('.narr-page')],pager=wrap.querySelector('.narr-pager');
 if(!pager||pages.length<=1)return;
 let index=Math.min(Math.max(Number(narrState()[taskId])||0,0),pages.length-1);
 const dots=[...pager.querySelectorAll('.pager-dot')],prev=pager.querySelector('.pager-prev'),next=pager.querySelector('.pager-next');
 const show=i=>{
  index=Math.min(Math.max(i,0),pages.length-1);
  pages.forEach((p,k)=>{p.hidden=k!==index;});
  dots.forEach((d,k)=>{if(k===index)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current');});
  if(prev)prev.disabled=index===0;
  if(next)next.disabled=index===pages.length-1;
  const s=narrState();s[taskId]=index;try{sessionStorage.setItem(NARR_KEY,JSON.stringify(s));}catch{}
  const page=pages[index];
  if(page.querySelector('#molecule-viewer'))window.dispatchEvent(new Event('resize')); // 隐藏页恢复显示时补一次 resize（viewer 自带 ResizeObserver 会接力完成实际重绘）。
  page.querySelector('.narr-page-title')?.focus({preventScroll:true});
 };
 prev?.addEventListener('click',()=>show(index-1));
 next?.addEventListener('click',()=>show(index+1));
 dots.forEach((d,k)=>d.addEventListener('click',()=>show(k)));
 show(index);
}
export function taskView(run,c,id,evalInfo=null){
 const task=c.learning.steps.find(t=>t.id===id),entry=run.learning.entries[id]||{},passed=taskPassed(run,task),next=nextTaskId(run,c,id);
 const sourceLabels=task.source_ids.map(id=>{const s=c.sources.find(x=>x.source_id===id)||c.learning.identity_sources?.find(x=>x.source_id===id);return s?`${s.label} · ${s.source_locator}`:id===c.planning_source.source_id?'课程设计依据 · 需由观测检验的学生假设':id;});
 const matrix=`<div class="task-matrix" data-matrix-step="${id}"><span>界面 ${task.stage+1} / 6 · 第 ${id} 步</span><span class="review-flag ${task.data_dependency?'strong':'soft'}">${task.data_dependency?'数据依赖 · 待教师审定':'教学判断 · 待教师审定'}</span></div><details class="task-goal"><summary>实际任务与来源</summary><p><strong>${e(task.matrix_title)}</strong>：${e(task.goal_requirement)}</p><p>来源：当前网页任务按 LYW v5 界面简明版（2026-10-21）执行；LYW v2 科学24步（2026-10-22）用于教学设计与状态映射，尚未逐项实现。</p></details>`;
 const supRefs=task.source_ids.map((sid,i)=>`<button type="button" class="ref-sup" data-ref-sup="${i+1}" aria-label="查看来源 ${i+1}">[${i+1}]</button>`).join('');
 const contextPage={title:'情境与指引',html:`<div class="narr-prose"><p>${e(task.prompt)}${supRefs}</p>${task.guidance?.length?`<ol class="narr-guidance">${task.guidance.map(g=>`<li>${e(g)}</li>`).join('')}</ol>`:''}</div>`};
 const visualPage={title:'视觉证据',html:taskVisual(run,c,task)};
 const papersPage=(()=>{const html=paperDigestCards(c,task);return html?{title:'论文与解读',html}:null;})();
 const pages=[contextPage,visualPage,papersPage].filter(Boolean);
 const pager=pages.length>1?`<nav class="narr-pager" aria-label="任务内容分页"><button type="button" class="pager-prev" data-narr="prev">‹ 上一页</button><span class="pager-dots">${pages.map((p,i)=>`<button type="button" class="pager-dot" data-narr="${i}" ${i===0?'aria-current="true"':''} aria-label="第 ${i+1} 页：${p.title}">${i+1}</button>`).join('')}</span><button type="button" class="pager-next" data-narr="next">下一页 ›</button></nav>`:'';
 return `<section class="task-workspace" data-learning-card="${id}"><div class="task-topline"><button class="text-button" data-action="stage-workspace">${icon('home')} ${run.stage===0?'返回案例场景':'返回操作台'}</button><span>主线 ${id} / 24</span><button class="text-button" data-action="ask-task-tutor" data-task-id="${id}">问导师</button><button class="text-button" data-action="compare">${icon('case')} 三篇论文对照</button></div><div class="task-title"><span class="task-index">${id}</span><div><h1>${e(task.title)}</h1></div></div>${matrix}<div class="task-view"><div class="task-narrative">${pages.map((p,i)=>`<section class="narr-page" data-narr-page="${i}"${i?' hidden':''}><h2 class="narr-page-title" tabindex="-1">${p.title}</h2>${p.html}</section>`).join('')}${pager}<details class="task-sources"><summary>来源与自查提示</summary><p>${e(task.hint)}</p>${sourceLabels.map((s,i)=>`<p><button type="button" class="ref-sup" data-ref-sup="${i+1}">[${i+1}]</button> ${e(s)}</p>`).join('')}</details></div><aside class="task-rail"><p class="rail-prompt">${e(task.goal_requirement||task.matrix_title||task.title)}</p><form class="learning-form" data-learning-id="${id}">${task.choices.length?`<fieldset class="answer-options"><legend>作出你的判断</legend>${task.choices.map((choice,i)=>`<label class="answer-option ${entry.choice===choice.id?'selected':''}"><input type="radio" name="choice" value="${choice.id}" ${entry.choice===choice.id?'checked':''} required><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${e(choice.text)}</span></label>`).join('')}</fieldset>`:''}<label class="field answer-reason"><span>${e(task.note_prompt||(['04','09'].includes(id)?'留下你的独立判断':'说说你的依据'))}${task.note_prompt?'':'<small>至少8字</small>'}</span><textarea name="note" rows="3" maxlength="2000" minlength="8" required placeholder="${e(task.hint||'用自己的话说明依据，以及还需要核对的证据。')}">${e(entry.note||'')}</textarea></label>${evalPanel(evalInfo,task)}${entry.status==='recorded'?`<div class="learning-feedback ${passed?'success':'retry'}" role="status"><span>${passed?'✓':'↻'}</span><div><strong>${passed?(task.choices.length?'自查通过':'思考已记录，内容待复核'):'再检查一下依据'}</strong><p>${e(entry.feedback)}</p>${['04','09'].includes(id)?`<small>${entry.aiUsedBefore?(run.learning.independent[id]?'本次提交在AI请求之后；先前独立判断另行保留。':'本次提交在AI请求之后，未记录AI前的独立判断。'):'已保留首次AI请求之前的独立判断。'}</small>`:''}</div></div>`:''}${entry.status==='recorded'&&task.example?`<details class="task-example"><summary>参考示例（非标准答案）</summary><p>${e(task.example)}</p></details>`:''}<div class="task-actions"><button class="button ${passed?'secondary':'primary'}" type="submit">${passed?'重新核对':'提交并自查'} ${icon('arrow')}</button>${passed?`<button type="button" class="button primary" ${next?`data-task="${next}"`:'data-action="stage-workspace"'}>${next?'下一项任务':run.stage===0?'完成探究，确认路线':'完成探究，返回操作'} ${icon('arrow')}</button>`:''}<span class="learning-status">${taskStatus(run,task)==='draft'?'草稿已保存':''}</span></div></form><div class="rail-foot"><button class="text-button" data-action="ask-task-tutor" data-task-id="${id}">问导师</button><button class="text-button" data-action="compare">对照三篇论文</button><span class="learning-status">${taskStatus(run,task)==='draft'?'草稿已保存':''}</span></div></aside></div></section>`;
}
export function routeConfirmation(run,c){
 return `<section class="route-complete"><div class="completion-mark">✓</div><h1>你的初始方案已成形</h1><p>4项任务已记录。</p>${caseCards(run,c,{compact:true})}<div class="initial-decision"><span>我的路线判断</span><h2>${e(c.routes.find(r=>r.id===run.route).name)}</h2><p>${e(run.learning.entries['04']?.note||run.reason)}</p><small>科学可行性待教师复核。</small></div>${learningGatePanel(run,c)}<form id="route-form"><button class="button primary" type="submit">确认路线，配置反应体系 ${icon('arrow')}</button><button type="button" class="button secondary" data-task="04">修改选择依据</button></form></section>`;
}
export function stageEvidenceBanner(run,c){
 return `${stageModeBadge(run)}<div class="stage-evidence-banner"><div>${c.routes.map(r=>`<button data-case="${r.id}" class="${r.id===run.route?'selected':''}">${r.id} ${e(r.name)}</button>`).join('')}</div><button class="text-button" data-action="compare">并排对照 ${icon('arrow')}</button></div>`;
}
function studyTabs(c,routeId){
 return `<div class="study-tabs" role="group" aria-label="选择研究"><button data-compare-route="all" class="${routeId?'':'active'}">并排对照</button><button data-compare-route="analysis" class="${routeId==='analysis'?'active':''}">结论与反思</button></div>`;
}
function analysisList(items){return `<ul>${items.map(item=>`<li>${e(item)}</li>`).join('')}</ul>`;}
function reportedResults(items=[]){
 return `<details class="analysis-reported" open><summary>文献报告值（原文报告，非本次观测）</summary><div class="analysis-table-wrap"><table class="analysis-table analysis-results-table"><thead><tr><th scope="col">路线</th><th scope="col">条目</th><th scope="col">报告值</th><th scope="col">原文条件</th><th scope="col">来源</th><th scope="col">边界</th></tr></thead><tbody>${items.map(x=>`<tr><td>${e(x.route)}</td><th scope="row">${e(x.label)}</th><td>${e(x.value)}</td><td>${e(x.context)}</td><td>${e(x.source)}</td><td>${e(x.caveat)}</td></tr>`).join('')}</tbody></table></div></details>`;
}
function routeAnalysis(c){
 const a=c.learning.route_analysis;
 const rows=a.field_comparison.map(r=>`<tr><th scope="row"><span>${r.id}</span>${e(r.field)}</th><td>${e(r.R1)}</td><td>${e(r.R2)}</td><td>${e(r.R3)}</td></tr>`).join('');
 const h=a.history_hits;
 return `<header class="dialog-heading"><div><h2 id="evidence-title">三路线分析与结论反思</h2></div><button class="close-button" data-close-dialog aria-label="关闭结论与反思">×</button></header>${studyTabs(c,'analysis')}<section class="route-analysis" data-route-analysis><div class="analysis-status"><span>原文报告值 · 非本次观测</span><span>22/22 案例待教师审定</span></div><div class="analysis-summary">${c.routes.map(r=>`<article class="${r.id}"><span>${r.id}</span><h3>${e(r.name)}</h3><p>${e(a.route_summary[r.id])}</p></article>`).join('')}</div>${reportedResults(a.reported_results)}<details class="analysis-fields" open><summary>14项路线字段对照（C01—C14）</summary><div class="analysis-table-wrap"><table class="analysis-table"><thead><tr><th scope="col">字段</th><th scope="col">R1 · Pei 2019</th><th scope="col">R2 · Zhang 2015</th><th scope="col">R3 · Niu 2024</th></tr></thead><tbody>${rows}</tbody></table></div></details><div class="analysis-history"><strong>21条历史命中的证据边界</strong><p>共 ${h.total} 条：${h.withheld_unlicensed} 条结果值未授权、${h.missing} 条元数据缺失；方向确认 ${h.direction_confirmed} 条、酶促性确认 ${h.enzyme_status_confirmed} 条，独立研究去重 ${h.dedup_completed?'已完成':'未完成'}。</p><p>${e(h.note)}</p></div><div class="analysis-columns"><section><h3>目前可以支持</h3>${analysisList(a.can_support)}</section><section><h3>仍不能得出</h3>${analysisList(a.cannot_conclude)}</section><section><h3>下一步与证据缺口</h3>${analysisList(a.next_steps)}</section></div></section>`;
}
function paperView(run,c,r,source){
 const summary=c.learning.route_analysis.route_summary[r.id];
 return `<section class="paper-view" data-paper-view="${source.source_id}"><div class="paper-points-wrap"><span class="review-flag soft">待教师审定</span><ul class="paper-points"><li><strong>方向</strong><p>${e(r.evidence.direction)}</p></li><li><strong>催化</strong><p>${e(r.evidence.catalyst)}</p></li><li><strong>供体</strong><p>${e(r.evidence.donor)}</p></li><li><strong>小结</strong><p>${e(summary)}</p></li></ul></div><div class="paper-actions"><button class="button secondary" data-open-paper="${source.source_id}" aria-expanded="false">在线阅读论文 PDF</button></div><div class="paper-panel" hidden><p class="paper-status" role="status"></p><iframe title="${e(source.label)} 论文 PDF"></iframe></div></section>`;
}
export function caseComparison(run,c,routeId){
 if(routeId==='analysis')return routeAnalysis(c);
 const stageOf=r=>c.case_studies?.find(x=>x.route_id===r.id)?.stages.find(x=>x.stage===run.stage);
 const studyOf=r=>c.case_studies?.find(x=>x.route_id===r.id);
 const sourceOf=r=>c.sources.find(x=>x.source_id===r.source_id);
 const fields=[['研究怎么做','solution',r=>stageOf(r)?.solution||r.system],['条件与对照','conditions',r=>stageOf(r)?.conditions||r.evidence.donor],['待检验假说','hypothesis',r=>stageOf(r)?.hypothesis||studyOf(r)?.hypothesis||'待提出'],['证据在哪里','evidence',r=>stageOf(r)?.evidence||r.evidence.reported_evidence],['仍需核对','boundary',r=>stageOf(r)?.limitation||r.evidence.boundary]];
 return `<header class="dialog-heading"><div><h2 id="evidence-title">三篇论文 · 当前阶段对照</h2></div><button class="close-button" data-close-dialog aria-label="关闭论文对照">×</button></header>${studyTabs(c,routeId)}<div class="study-matrix"><div class="matrix-inner"><div class="matrix-head"><div class="matrix-corner" aria-hidden="true"></div>${c.routes.map(r=>{const s=stageOf(r),study=studyOf(r),source=sourceOf(r);return `<article class="study ${r.id}"><div class="study-title"><span>${r.id}</span><div><h3>${e(r.name)}</h3><a href="https://doi.org/${e(source.doi)}" target="_blank" rel="noopener noreferrer">${e(source.label)} ${icon('arrow')}</a></div></div>${routeDiagram(r.id)}<h4>${e(s?.title||study?.title||r.name)}</h4></article>`;}).join('')}</div>${fields.map(([label,key,get])=>`<div class="matrix-row" data-field="${key}"><div class="matrix-label">${label}</div>${c.routes.map(r=>`<div class="matrix-cell">${e(get(r))}</div>`).join('')}</div>`).join('')}<div class="matrix-row" data-field="locator"><div class="matrix-label">原文位置</div>${c.routes.map(r=>`<div class="matrix-cell"><p class="study-locator">${e(stageOf(r)?.source_locator||sourceOf(r).source_locator)}</p></div>`).join('')}</div><div class="matrix-row matrix-paper"><div class="matrix-label">论文 PDF 与要点</div>${c.routes.map(r=>paperView(run,c,r,sourceOf(r))).join('')}</div>${run.stage===0?`<div class="matrix-row matrix-choose"><div class="matrix-label" aria-hidden="true"></div>${c.routes.map(r=>`<div class="matrix-cell"><button class="button ${run.route===r.id?'secondary':'primary'}" data-choose-route="${r.id}">${run.route===r.id&&run.exploration?.routeChosen?'当前规划路线':'选择这条路线'} ${run.route===r.id?'✓':icon('arrow')}</button></div>`).join('')}</div>`:''}</div></div>`;
}
