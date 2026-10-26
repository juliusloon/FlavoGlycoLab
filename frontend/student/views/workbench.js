import { escapeHTML as e, icon, sourceDetails, STAGE_ICONS } from '../ui.js';
import { STAGES, MATERIALS, RECIPES, canVisit, canEnterOpen, routeRules, ACTIVITY_FIELDS } from '../lab-state.js';
import { learningRecords } from './learning.js';
import { questProgress } from '../quest-state.js';
import { comparePlanToRecord, CALC_WHITELIST, compute, GAP_OPTIONS } from '../analysis-engine.js';
import {pageHeader,button as sharedButton,field as sharedField} from '../components.js';
export const heading=(title,description)=>pageHeader({title,description});
const button=(label,action,primary=true)=>sharedButton({label,action,variant:primary?'primary':'secondary',iconName:primary?'arrow':''});
const field=(label,name,value,unit='',type='number',attributes='')=>sharedField({label,name,value,unit,type,attributes});
export function routeEvidence(run,c){
  const route=c.routes.find(r=>r.id===run.route), evidence=route?.evidence;
  if(!evidence)return '';
  const source=c.sources.find(s=>s.source_id===route.source_id);
  return `<details class="source-details route-evidence"><summary>文献与条件依据 · ${e(route.name)}</summary><dl class="source-meta">${[['反应方向',evidence.direction],['催化体系',evidence.catalyst],['供体要求',evidence.donor],['论文证据',evidence.reported_evidence],['分析材料',evidence.analysis_evidence],['适用边界',evidence.boundary]].map(([label,text])=>`<div><dt>${e(label)}</dt><dd>${e(text)}</dd></div>`).join('')}<div><dt>仍缺证据</dt><dd>${evidence.gaps.map(e).join('<br>')}</dd></div><div><dt>定位</dt><dd>${e(source.label)} · ${e(source.source_locator)}</dd></div></dl><p class="fine-print">案例仍待教师审定。</p></details>`;
}
export function workflow(run){return `<div class="workflow-heading"><h2>实验历程</h2></div><nav class="sidebar-content" id="workflow-content" aria-label="实验阶段">${STAGES.map((name,i)=>`<button class="stage ${run.stage===i?'selected':''}" data-stage="${i}" ${!canVisit(run,i)?'disabled':''} ${run.stage===i?'aria-current="step"':''}><span class="stage-icon">${icon(STAGE_ICONS[i])}</span><span>${name}</span></button>`).join('')}</nav>`;}
export function bench(run,operation=false){
  const labels={idle:'等待检查',checked:'方案已核对',mixed:'已完成混合演练',running:'流程演练进行中',ready:'可以建立取样记录',sampled:'取样记录已建立'};
  return `<section class="bench ${run.operation==='running'?'is-running':''}" aria-label="虚拟反应台"><div class="bench-label"><strong>${operation?'反应与取样':'我的反应体系'}</strong><span>${operation?labels[run.operation]:'按路线逐项装配'}</span></div><div class="bench-scene"><img src="./assets/lab-bench.png" alt="反应瓶、搅拌装置、移液器与样品瓶的操作示意" width="1792" height="896"><div class="bench-feedback" aria-live="polite">${operation?(run.operation==='running'?'正在演示操作流程…':''):`${Object.keys(run.materials).length} / 3 项已加入`}</div></div><div class="material-strip"><span>已加入</span>${Object.entries(run.materials).map(([k,id])=>`<span class="material-tag">${e(MATERIALS[k]?.find(m=>m.id===id)?.label??'')}${!operation?`<button type="button" data-remove="${k}" aria-label="移除${e(MATERIALS[k]?.find(m=>m.id===id)?.label??'')}">×</button>`:''}</span>`).join('')||'<span class="muted">选择下方材料，开始装配</span>'}</div></section>`;
}
export function assemblyView(run,c){
  return `${heading('配置反应体系')}${bench(run)}<div class="material-shelf">${Object.entries(MATERIALS).map(([kind,items],i)=>`<form class="material-form ${run.materials[kind]?'added':''}" data-kind="${kind}"><label for="${kind}">${['底物','催化体系','供体方案'][i]}</label><div class="material-picker"><select id="${kind}" name="material"><option value="">选择${['底物','催化体系','供体方案'][i]}</option>${items.map(m=>`<option value="${m.id}" ${run.materials[kind]===m.id?'selected':''}>${e(m.label)}</option>`).join('')}</select><button type="submit" class="button secondary" ${run.materials[kind]?'':'disabled'}>${run.materials[kind]?'✓ 已加入':'加入体系'}</button></div><p class="material-status" role="status">${run.materials[kind]?'已加入体系，可继续选择下一项':'请选择材料，再点击加入体系'}</p></form>`).join('')}</div><p class="fine-print">操作示意，非实验结果。</p><div class="actions">${button('返回路线','back',false)}${button('完成装配，设定条件','assembly')}</div>`;
}
// TASK-027 L02 参照练习锁定：有明确文献定位的关键条件只读并按参照预填；缺失参照显示待补（unknown），不填默认值。
function lockedField(run,c,name,label,unit,type,extra){
  const rule=(routeRules(c,run.route,'guided').find(r=>r.rule_kind==='locked_condition'&&r.parameter===name))??null;
  if((run.stageMode??'guided')!=='guided'||!rule)return null;
  const unknown=rule.reference?.value===undefined||rule.reference?.value===null||rule.reference?.value==='unknown';
  if(name==='control'){
    const text=unknown?'待补 · 缺少文献参照':`${rule.reference.text??rule.reference.value}（文献参照）`;
    return `<label class="field locked"><span>${e(label)}<small>${e(text)}</small></span><input name="control" type="text" value="${unknown?'':e(String(rule.reference.value))}" readonly required tabindex="-1" class="locked-input"></label>`;
  }
  const value=unknown?'':String(rule.reference.value);
  return `<label class="field locked"><span>${e(label)}${unit?` <small>${e(unit)}</small>`:''}<small>${unknown?'待补 · 缺少文献参照':'文献参照 · 只读'}</small></span><input name="${name}" type="${type}" value="${e(value)}" step="any" readonly required tabindex="-1" class="locked-input" ${extra}></label>`;
}
export function planView(run,c){
  const p=run.plan;
  const lock=(name,label,unit,type,extra,render)=>lockedField(run,c,name,label,unit,type,extra)??render(); // L06-fix: 回退必须渲染真实字段，不能把箭头函数源码插进 DOM。
  // L06-fix: 参照锁定的已知参照值参与投料量预览（只读输入的值尚未写回 run.plan）。
  const previewPlan={...p};
  if((run.stageMode??'guided')==='guided')for(const rule of routeRules(c,run.route,'guided')){
    if(rule.rule_kind==='locked_condition'&&rule.reference?.value!=null&&rule.reference.value!=='unknown'&&typeof previewPlan[rule.parameter]==='string')previewPlan[rule.parameter]=String(rule.reference.value);
  }
  const controlField=(run.stageMode??'guided')==='guided'&&routeRules(c,run.route,'guided').some(r=>r.rule_kind==='locked_condition'&&r.parameter==='control')
    ?lockedField(run,c,'control','对照方案','','text','')
    :`<label class="field"><span>对照方案</span><select name="control" required><option value="">选择对照</option>${[['negative',RECIPES[run.route].control],['blank','无底物空白'],['both',`${RECIPES[run.route].control} + 无底物空白`]].map(([v,t])=>`<option value="${v}" ${p.control===v?'selected':''}>${t}</option>`).join('')}</select></label>`;
  const activityKeys=run.route==='R1'?['ugtActivity','susActivity']:run.route==='R2'?['enzymeActivity']:[];
  const activityFields=activityKeys.length?`<fieldset class="form-section"><legend>加酶量（可选 · 学生设计值）</legend><div class="form-grid">${activityKeys.map(key=>field(`${ACTIVITY_FIELDS[key]}酶活性浓度`,key,p[key]||'','mU/mL','number','min="0.000001" max="1000000000" step="any"')).join('')}</div><p class="fine-print">按各酶的活性测定定义填写；1 U = 1000 mU。酶活性不能直接换算为蛋白质量，也不能把两种酶的活性相加。未确定可留空。</p></fieldset>`:'<p class="inline-note">全细胞路线应另行记录细胞投料与测定依据，本表不将细胞量换算为游离酶活性。</p>';
  return `${heading('设定实验方案')}<div class="inline-note">条件记录为学生方案，参照练习中的文献条件为只读。</div><form id="plan-form"><fieldset class="form-section"><legend>投料与反应条件</legend><div class="form-grid">${lock('volume','反应体积','mL','number','min="0.001" max="10000" required',()=>field('反应体积','volume',p.volume,'mL','number','min="0.001" max="10000" required'))}${lock('concentration','底物浓度','mmol/L','number','min="0.001" max="100000" required',()=>field('底物浓度','concentration',p.concentration,'mmol/L','number','min="0.001" max="100000" required'))}${lock('temperature','计划温度','°C','number','min="-20" max="150" required',()=>field('计划温度','temperature',p.temperature,'°C','number','min="-20" max="150" required'))}${lock('ph','计划 pH','','number','min="0" max="14" required',()=>field('计划 pH','ph',p.ph,'','number','min="0" max="14" required'))}${lock('duration','计划时长','min','number','min="0.001" max="10080" required',()=>field('计划时长','duration',p.duration,'min','number','min="0.001" max="10080" required'))}${field('取样时点','samples',p.samples,'min','text','placeholder="递增时点，用逗号分隔" required')}</div>${activityFields}<output id="amount-preview" class="calculation">${amountPreview(previewPlan)}</output><p class="fine-print">范围仅作格式校验；取样最多8个时点。</p></fieldset><fieldset class="form-section"><legend>对照与假设</legend>${controlField}<label class="field"><span>我想检验的假设</span><textarea name="hypothesis" rows="3" maxlength="2000" minlength="8" required placeholder="你准备比较什么，什么观察会让你改变判断？">${e(p.hypothesis)}</textarea></label></fieldset><div class="actions">${button('返回装配','back',false)}<button type="submit" class="button primary">保存方案，开始操作 ${icon('arrow')}</button></div></form>`;
}
export function amountPreview(p){
  const v=Number(p.volume),c=Number(p.concentration),valid=v>0&&Number.isFinite(v);
  const amount=valid&&c>0&&Number.isFinite(v*c)?`按输入换算的底物物质的量：${Number((v*c).toPrecision(6))} μmol（mmol/L × mL = μmol）`:'填写体积和浓度后显示投料量。';
  const enzymes=Object.entries(ACTIVITY_FIELDS).flatMap(([key,label])=>{const a=Number(p[key]);return valid&&a>0&&Number.isFinite(a*v)?[`${label}：${a} mU/mL × ${v} mL = ${Number((a*v).toPrecision(6))} mU`]:[];});
  return [amount,...enzymes,enzymes.length?'以上均为学生设计值，非实测酶活性。':''].filter(Boolean).join('；');
}
export function operationView(run){
  const seq=[['check','01','检查方案','核对条件与样品标签','idle'],['mix','02','混合体系','演练混合操作','checked'],['start','03','启动演练','演示流程，不预测反应','mixed'],['sample','04','按计划取样','建立样品和对照记录','ready']];
  const order=['idle','checked','mixed','running','ready','sampled'];
  return `${heading('操作与取样')}<div class="plan-summary"><span>计划 ${e(run.plan.temperature)} °C</span><span>pH ${e(run.plan.ph)}</span><span>${e(run.plan.duration)} min</span><button class="text-button" data-stage="2">修改方案</button></div>${bench(run,true)}<div class="operation-controls">${seq.map(([a,n,t,d,s])=>`<button data-operate="${a}" class="operation-button ${run.operation===s?'next':''}" ${run.operation!==s?'disabled':''}><span>${n}</span><strong>${t}</strong><small>${order.indexOf(run.operation)>order.indexOf(s)?'已执行':d}</small></button>`).join('')}</div><p class="fine-print">操作动画为流程演示；取样记录尚无测量数据。</p>${run.operation==='sampled'?`<div class="success-note">已建立 ${run.samples.length} 条实验组与对照样品记录。</div><div class="actions end">${button('查看样品与分析结果','analysis')}</div>`:''}`;
}
const STATUS_ICONS = { '✔': 'match', '△': 'differ', '？': 'unknown', '—': 'na' };
function refRecordCards(records, analysis) {
  const selected = new Set(analysis.refRecords.map(r => r.recordId));
  return records.map(record => {
    const chosen = analysis.refRecords.find(r => r.recordId === record.id);
    return `<article class="ref-record ${chosen ? 'selected' : ''}" data-ref-record="${e(record.id)}">
      <header><span class="record-id">${e(record.id)}</span><span class="badge neutral">${e(record.category)}</span></header>
      <h4>${e(record.title)}</h4>
      <p class="record-value">${e(record.value)}</p>
      <dl class="record-meta">
        <div><dt>原指标</dt><dd>${e(record.metric)}</dd></div>
        <div><dt>原文条件</dt><dd>${e(record.conditions)}</dd></div>
        <div><dt>原文定位</dt><dd>${e(record.location)}</dd></div>
      </dl>
      <a class="text-button" href="./data.html?route=${e(record.route)}&q=${e(record.id)}" target="_blank" rel="noopener noreferrer">到数据查询页核对 ${e(record.id)} ↗</a>
      ${chosen ? `<p class="ref-reason"><strong>选为参照的理由</strong>　${e(chosen.reason)}</p>` : `
      <label class="field ref-reason-input"><span>选作参照的理由<small>至少8字 · 只可从本路线 ${records.length} 条记录中选，最多 3 张</small></span>
        <textarea rows="2" maxlength="500" minlength="8" placeholder="为什么这条记录能作为你方案的参照？"></textarea></label>
      <button type="button" class="button secondary" data-action="analysis-select-ref" data-record-id="${e(record.id)}">选为参照</button>`}
    </article>`;
  }).join('');
}
function compareRounds(run, records, analysis) {
  if (!analysis.refRecords.length) return '<p class="bench-hint">先在回合 1 选择 1–3 张参照记录，再逐项对照方案条件。</p>';
  return analysis.refRecords.map(ref => {
    const record = records.find(r => r.id === ref.recordId);
    if (!record) return '';
    const cmp = comparePlanToRecord(run.plan, record);
    return `<article class="compare-card" data-compare-record="${e(record.id)}">
      <h4>${e(record.id)} · ${e(record.title)}</h4>
      <p class="plan-note">方案条件为<strong>学生设计值 · 非实测</strong>。</p>
      <table class="compare-table"><thead><tr><th scope="col">条件</th><th scope="col">你的方案（设计值）</th><th scope="col">原文记录</th><th scope="col">判定</th></tr></thead>
      <tbody>${cmp.fields.map(f => `<tr><th scope="row">${e(f.label)}</th><td>${f.planValue ?? '—'}</td><td>${f.refValue ?? '本条未登记'}</td><td><span class="cmp-status cmp-${STATUS_ICONS[f.status]}">${f.status}</span>${f.status === '△' ? `<small>两边值不同，只作参照</small>` : f.status === '？' ? '<small>本条记录未登记此条件，需回原文核对</small>' : f.status === '—' ? '<small>方案未填此项</small>' : '<small>一致</small>'}</td></tr>`).join('')}</tbody></table>
      <p class="cmp-summary">${e(cmp.summary)}</p>
    </article>`;
  }).join('');
}
function calcRound(run, analysis) {
  const options = CALC_WHITELIST.filter(item => item.route === run.route);
  const done = new Set(analysis.calculations.map(c => c.id));
  return `<div class="calc-picker">
    <label class="field"><span>文献计算项<small>只提供文献报告值的固定组合，不接受自定义数值</small></span>
      <select id="calc-select"><option value="">选择一项计算</option>${options.map(item => `<option value="${e(item.id)}" ${done.has(item.id) ? 'disabled' : ''}>${e(item.expression)}</option>`).join('')}</select></label>
    <button type="button" class="button secondary" data-action="analysis-calc">计算并记录</button>
  </div>
  ${analysis.calculations.length ? `<div class="calc-results">${analysis.calculations.map(c => `<article class="calc-card">
    <h4>${e(c.title)}</h4>
    <p class="calc-expression">${e(c.expression)}</p>
    <p class="calc-substituted">代入：${e(c.substituted)}</p>
    <p class="calc-result">结果：<strong>${c.result === null ? '—' : e(c.result)} ${e(c.unit)}</strong></p>
    <ul class="calc-labels">${c.labels.map(l => `<li>${e(l)}</li>`).join('')}</ul>
    <p class="calc-note">${e(c.note)}</p>
  </article>`).join('')}</div>` : '<p class="bench-hint">完成至少 1 项计算后，本回合达成。</p>'}`;
}
function gapRound(analysis) {
  const chosen = new Set(analysis.gaps);
  return `<div class="gap-options">${GAP_OPTIONS.map(gap => `<label class="check-line"><input type="checkbox" data-action="analysis-add-gap" data-gap="${e(gap)}" ${chosen.has(gap) ? 'checked' : ''}>${e(gap)}</label>`).join('')}</div>
  ${analysis.boundaryDone ? `<p class="boundary-done">边界说明已记录：${e(analysis.boundaryNote)}</p>` : `
  <label class="field boundary-input"><span>边界与缺口说明<small>至少15字 · 说明哪些数值只是文献参照、你的方案还缺什么</small></span>
    <textarea id="boundary-note" rows="3" maxlength="1000" minlength="15" placeholder="例如：以上摩尔收率均为 Zhang 2015 原文报告值，非本次观测；本方案尚无实测数据，缺标准曲线与重复测量。"></textarea></label>
  <button type="button" class="button secondary" data-action="analysis-boundary">记录边界说明</button>`}`;
}
export function analysisView(run,selected,c){
  const sample=run.samples.find(s=>s.id===selected)||run.samples[0];
  const analysis=run.analysis??{refRecords:[],comparisons:null,calculations:[],gaps:[],boundaryNote:'',boundaryDone:false};
  const records=c.data_query.records.filter(r=>r.route===run.route);
  const complete=analysis.calculations.length>=1&&analysis.gaps.length>=1&&analysis.boundaryDone;
  return `${heading('查看分析结果')}<div class="analysis-honesty" role="note">样品尚无真实测量。以下为<strong>文献报告值/计算值 · 非本次观测</strong>。</div>
  <details class="analysis-samples"><summary>取样记录 · ${run.samples.length} 个样品 · 尚无测量</summary><div class="analysis-layout"><section class="sample-list"><h2>取样记录</h2>${run.samples.map(s=>`<button class="sample-row ${s.id===sample?.id?'selected':''}" data-sample="${s.id}"><strong>${s.id}</strong><span>${e(s.group)}</span><small>计划 ${e(s.plannedTime)} min</small></button>`).join('')}</section><section class="analysis-detail"><div class="analysis-id">${e(sample?.id)} · ${e(sample?.group)}</div><h2>无对应实验数据</h2><p>尚无真实测量，不能由操作动画推断产物生成。</p><dl class="evidence-list"><div><dt>原始色谱与峰归属</dt><dd>尚未提供</dd></div><div><dt>标准曲线与稀释记录</dt><dd>尚未提供</dd></div><div><dt>产物浓度与产率</dt><dd>无法计算</dd></div></dl><p class="fine-print">“没有数据”不等于产率为零。<a href="./data.html?route=${e(run.route)}">到数据查询页核对本路线文献报告值 →</a></p></section></div></details>
  <section class="analysis-bench" data-analysis-bench>
    <h2>结果分析台 · 文献参考分析</h2>
    <div class="analysis-tabs" role="tablist" aria-label="文献参考分析回合">${['选择参照','条件对照','数据计算','边界与缺口'].map((title,i)=>`<button type="button" role="tab" id="analysis-tab-${i+1}" data-analysis-tab="${i+1}" aria-controls="analysis-round-${i+1}" aria-selected="${i===0}">${i+1} · ${title}${[analysis.refRecords.length>0,!!analysis.comparisons?.length,analysis.calculations.length>0,analysis.gaps.length>0&&analysis.boundaryDone][i]?' ✓':''}</button>`).join('')}</div>
    <div class="bench-round" role="tabpanel" id="analysis-round-1" aria-labelledby="analysis-tab-1" data-bench-round="1"><h3>回合 1 · 选择文献参照</h3><p class="round-note">从本路线 ${records.length} 条已登记记录中选 1–3 张作为参照；每条须写理由（至少8字）。</p><div class="ref-records">${refRecordCards(records,analysis)}</div></div>
    <div class="bench-round" role="tabpanel" id="analysis-round-2" aria-labelledby="analysis-tab-2" data-bench-round="2" hidden><h3>回合 2 · 条件对照</h3>${compareRounds(run,records,analysis)}${analysis.refRecords.length?'<button type="button" class="button secondary" data-action="analysis-compare">确认条件对照</button>':''}</div>
    <div class="bench-round" role="tabpanel" id="analysis-round-3" aria-labelledby="analysis-tab-3" data-bench-round="3" hidden><h3>回合 3 · 文献数据计算</h3>${calcRound(run,analysis)}</div>
    <div class="bench-round" role="tabpanel" id="analysis-round-4" aria-labelledby="analysis-tab-4" data-bench-round="4" hidden><h3>回合 4 · 边界与缺口</h3>${gapRound(analysis)}</div>
    <div class="bench-round bench-blacklist"><h3>尚不能计算的指标</h3><p>本方案尚无实测值，产率与转化率<strong>不可计算</strong>。</p></div>
    ${complete?`<div class="bench-round bench-complete" role="status"><strong>已完成文献参考分析 ✓</strong><p>关键结论可带入任务 20/24 的结论与反思；所有数值仍为文献参照，非本次观测。</p></div>`:''}
  </section>
  ${routeEvidence(run,c)}<div class="analyze-entry"><button type="button" class="button secondary" data-action="analyze-results">让 AI 解析我的现象与结果</button><p class="fine-print">AI 按文献事实、学生自述、机制假设和未知项整理结果，机器解析待教师审定。</p></div><form id="analysis-form"><label class="check-line"><input type="checkbox" name="reviewed" required ${run.analysisReviewed?'checked':''}>我已区分操作记录和实验观测，不以演练过程推断产率。</label><div class="actions">${button('返回实验台','back',false)}<button class="button primary" type="submit">整理结论与反思 ${icon('arrow')}</button></div></form>`;
}
export function reflectionView(run){
  return `${heading('结论与反思')}<div class="inline-note">已记录 ${run.events.length} 次操作、${run.samples.length} 个样品标签；尚无真实观测。</div><form id="reflection-form">${[['conclusion','我的结论','哪些是操作事实，哪些仍然只是假设？'],['limitation','证据与局限','还缺哪些数据，当前不能得出哪些结论？'],['next','下一步实验','准备改变哪个变量，保留哪些对照？']].map(([key,title,placeholder])=>`<label class="field reflection-field"><span>${title}</span><textarea name="${key}" rows="3" maxlength="2000" minlength="8" required placeholder="${placeholder}">${e(run.reflection[key])}</textarea></label>`).join('')}<div class="actions">${button('返回分析','back',false)}<button class="button primary" type="submit">保存练习记录 ${icon('arrow')}</button></div></form><p class="fine-print">保存在当前浏览器。</p>`;
}
// TASK-027 L02 两阶段标识与切换：参照练习（guided）/ 开放探究（open）。
export function stageModeBadge(run){
  const mode=run.stageMode??'guided',open=canEnterOpen(run);
  return `<div class="stage-mode-badge ${mode}" role="status"><span class="mode-chip">${mode==='guided'?'参照练习 · 关键条件只读':'开放探究 · 条件可调整'}</span>${mode==='guided'
    ?(open?`<button type="button" class="button secondary" data-action="enter-open">进入开放探究</button>`:`<span class="muted">完成参照流程后解锁开放探究</span>`)
    :`<button type="button" class="button secondary" data-action="enter-guided">返回参照练习</button><button type="button" class="text-button" data-action="redo">重来本阶段</button>`}</div>`;
}
export function renderWorkbench(run,c,sample){
  const view=[()=>{throw Error('案例场景由inquiry视图负责');},()=>assemblyView(run,c),()=>planView(run,c),()=>operationView(run),()=>analysisView(run,sample,c),()=>reflectionView(run)][run.stage]();
  if(run.stage===0)return view;
  const progress=questProgress(run,c);
  return `<div class="bench-shell"><aside class="bench-rail"><div class="stage-task-reminder"><p>${progress.completed} / ${progress.total} 项主线已核对 · ${progress.allComplete?'可以继续下一阶段':'完成本阶段探究，再继续实验'}</p><button class="button secondary" data-action="begin-quest">${progress.allComplete?'回看主线任务':'继续主线任务'}</button></div></aside><div class="bench-main">${view}</div></div>`;
}
export function recordsView(state,compareId,c){
  const run=state.current,other=state.records.find(r=>r.id===compareId&&r.id!==run.id);
  const routeName=id=>c.routes.find(r=>r.id===id)?.name??id;
  return `${heading('实验记录')}<div class="record-toolbar">${button('开始新实验','new',false)}${button('导出 JSON','export-json',false)}${button('导出 Markdown','export-md',false)}${button('返回当前实验','workbench')}</div><div class="record-status"><strong>${routeName(run.route)}</strong><span>${run.completed?'练习记录已保存':'当前实验进行中'} · ${run.samples.length} 个计划样品</span></div><h2 class="section-title">当前方案与历史记录</h2><label class="field"><span>选择要比较的已保存记录</span><select id="compare-record"><option value="">选择历史记录</option>${state.records.filter(r=>r.id!==run.id).map(r=>`<option value="${r.id}" ${r.id===compareId?'selected':''}>${e(routeName(r.route))} · ${e(new Date(r.savedAt).toLocaleString('zh-CN'))}</option>`).join('')}</select></label><div class="table-scroll"><table class="comparison"><thead><tr><th>项目</th><th>当前实验</th><th>历史记录</th></tr></thead><tbody>${[['路线',routeName(run.route),other?routeName(other.route):'—'],['选择依据',run.reason,other?.reason],['温度 / pH',`${run.plan.temperature||'未填'} / ${run.plan.ph||'未填'}`,other?`${other.plan.temperature} / ${other.plan.ph}`:'—'],['计划时长',run.plan.duration?`${run.plan.duration} min`:'未填',other?`${other.plan.duration} min`:'—'],['假设',run.plan.hypothesis,other?.plan.hypothesis],['加酶量（学生设计）',Object.entries(ACTIVITY_FIELDS).filter(([key])=>run.plan[key]).map(([key,label])=>`${label} ${run.plan[key]} mU/mL`).join('；'),other?Object.entries(ACTIVITY_FIELDS).filter(([key])=>other.plan[key]).map(([key,label])=>`${label} ${other.plan[key]} mU/mL`).join('；'):'—'],['学生结论',run.reflection.conclusion,other?.reflection.conclusion],['学习任务',`${Object.keys(run.learning?.entries??{}).length} 项自述`,other?`${Object.keys(other.learning?.entries??{}).length} 项自述`:'—'],['真实观测','未提供',other?'未提供':'—']].map(row=>`<tr>${row.map((cell,i)=>`<${i?'td':'th'}>${e(cell||'—')}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>${learningRecords(run,c)}<details class="log-details" open><summary>操作时间线 · ${run.events.length} 项</summary><ol class="event-log">${run.events.map(ev=>`<li><time>${e(new Date(ev.at).toLocaleTimeString('zh-CN'))}</time><div><strong>${e(ev.action)}</strong><p>${e(ev.detail)}</p></div></li>`).join('')||'<li>尚无操作记录。</li>'}</ol></details><p class="fine-print">记录保存在当前浏览器，最多12份。导出 JSON 包含历史记录与 AI 对话；请勿输入个人敏感信息。</p>`;
}
