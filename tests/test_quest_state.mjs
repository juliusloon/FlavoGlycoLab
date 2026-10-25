import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {freshRun, freshState, hydrate, copy, clearDownstream, selectRoute} from '../frontend/student/lab-state.js';
import {draftLearning, checkLearning, isAdminPass, validAnswer, learningMarkdown} from '../frontend/student/learning-state.js';
import {stageTasks, taskPassed, taskStatus, questProgress, canOpenTask, nextTaskId, routeLearningGate} from '../frontend/student/quest-state.js';

const content = JSON.parse(fs.readFileSync(new URL('../frontend/student/content/demo-content.json', import.meta.url), 'utf8'));
const firstStage = stageTasks(content, 0);
const task = id => content.learning.steps.find(item => item.id === id);
function record(run, id, choice) {
  const item = task(id);
  const oldStage = run.stage;
  run.stage = item.stage;
  if (item.choices.length) draftLearning(run, id, 'choice', choice ?? item.route_answers?.[run.route] ?? item.answer);
  draftLearning(run, id, 'note', `步骤${id}：核对路线、来源与证据范围，保留仍需验证的判断。`);
  checkLearning(run, item);
  run.stage = oldStage;
}

test('new run exposes one current mission and the next two without unlocking later tasks', () => {
  const run = freshRun();
  const progress = questProgress(run, content);
  assert.equal(progress.total, 4);
  assert.equal(progress.completed, 0);
  assert.equal(progress.currentId, '01');
  assert.deepEqual(progress.nextIds, ['02', '03']);
  assert.equal(progress.allComplete, false);
  assert.equal(canOpenTask(run, content, '01'), true);
  assert.equal(canOpenTask(run, content, '02'), false);
  assert.equal(canOpenTask(run, content, '05'), false);
  assert.equal(taskStatus(run, task('01')), 'pending');
});

test('a recorded wrong answer stays on the current mission; correction unlocks exactly the next mission', () => {
  const run = freshRun();
  record(run, '01');
  record(run, '02', 'c1');
  assert.equal(run.learning.entries['02'].status, 'recorded');
  assert.equal(taskPassed(run, task('02')), false);
  assert.equal(taskStatus(run, task('02')), 'retry');
  assert.equal(questProgress(run, content).currentId, '02');
  assert.equal(canOpenTask(run, content, '03'), false);
  assert.equal(nextTaskId(run, content, '02'), null);
  record(run, '02', 'c2');
  assert.equal(taskStatus(run, task('02')), 'passed');
  assert.equal(nextTaskId(run, content, '02'), '03');
  assert.equal(canOpenTask(run, content, '03'), true);
  assert.equal(canOpenTask(run, content, '04'), false);
  assert.equal(canOpenTask(run, content, '02'), true);
});

test('drafting a revision withdraws its gate until it is checked again', () => {
  const run = freshRun();
  record(run, '01');
  record(run, '02');
  assert.equal(questProgress(run, content).currentId, '03');
  draftLearning(run, '01', 'note', '修改目标连接说明后，应当重新完成自查。');
  assert.equal(taskStatus(run, task('01')), 'draft');
  assert.equal(questProgress(run, content).currentId, '01');
  assert.equal(canOpenTask(run, content, '02'), false);
  checkLearning(run, task('01'));
  assert.equal(questProgress(run, content).currentId, '03');
});

test('self-reflections advance practice only after recording a reason and have a distinct submitted status', () => {
  const run = freshRun();
  for (const item of firstStage.slice(0, 3)) record(run, item.id);
  draftLearning(run, '04', 'note', '我先独立比较原料和催化体系，再考虑对应文献证据。');
  assert.equal(taskPassed(run, task('04')), false);
  assert.equal(nextTaskId(run, content, '04'), null);
  checkLearning(run, task('04'));
  assert.equal(taskPassed(run, task('04')), true);
  assert.equal(taskStatus(run, task('04')), 'submitted');
  assert.equal(nextTaskId(run, content, '04'), null);
  assert.equal(run.learning.entries['04'].matches, null);
  assert.equal(run.learning.entries['04'].grade, undefined);
  assert.equal(run.teacher_approved, undefined);
  assert.ok(run.learning.independent['04']);
  run.learning.entries['04'].note = '很短';
  assert.equal(taskPassed(run, task('04')), false);
});

test('route-specific answers are checked against the current route as well as recorded flags', () => {
  const run = freshRun();
  record(run, '03');
  assert.equal(taskPassed(run, task('03')), true);
  run.route = 'R2'; // Simulate an old or inconsistent record that escaped normal invalidation.
  assert.equal(taskPassed(run, task('03')), false);
  assert.equal(taskStatus(run, task('03')), 'stale');
  run.learning.entries['03'].route = 'R2';
  assert.equal(taskPassed(run, task('03')), false);
  assert.equal(taskStatus(run, task('03')), 'retry');
  record(run, '03');
  assert.equal(taskPassed(run, task('03')), true);
});

test('legacy out-of-order and wrong recorded answers cannot bypass sequence after reload', () => {
  const state = freshState();
  record(state.current, '01');
  record(state.current, '04');
  const run = hydrate(JSON.stringify(state)).current;
  assert.equal(questProgress(run, content).currentId, '02');
  assert.equal(questProgress(run, content).completed, 2);
  assert.equal(canOpenTask(run, content, '04'), false);
  assert.equal(nextTaskId(run, content, '04'), null);
  delete state.current.learning;
  assert.equal(questProgress(hydrate(JSON.stringify(state)).current, content).completed, 0);
});

test('all four responses finish the stage, remain revisitable and survive hydration without extra progress storage', () => {
  const state = freshState();
  for (const item of firstStage) record(state.current, item.id);
  const before = JSON.stringify(state.current);
  const progress = questProgress(state.current, content);
  assert.equal(progress.completed, 4);
  assert.equal(progress.allComplete, true);
  assert.equal(progress.currentId, null);
  assert.deepEqual(progress.nextIds, []);
  for (const item of firstStage) assert.equal(canOpenTask(state.current, content, item.id), true);
  assert.equal(nextTaskId(state.current, content, '04'), null);
  assert.equal(JSON.stringify(state.current), before);
  assert.equal(questProgress(hydrate(JSON.stringify(state)).current, content).allComplete, true);
});

test('upstream invalidation preserves early progress and historical records but clears affected quests', () => {
  const run = freshRun();
  for (const item of firstStage) record(run, item.id);
  record(run, '11');
  record(run, '18');
  const snapshot = copy(run);
  clearDownstream(run, 2);
  assert.equal(questProgress(run, content, 0).allComplete, true);
  assert.equal(questProgress(run, content, 2).completed, 0);
  assert.equal(questProgress(run, content, 4).completed, 0);
  assert.equal(taskPassed(snapshot, task('18')), true);
  selectRoute(run, 'R2');
  assert.equal(questProgress(run, content, 0).completed, 0);
  assert.equal(questProgress(snapshot, content, 0).allComplete, true);
});

test('unknown tasks, missing content and empty stages fail closed', () => {
  const run = freshRun();
  assert.equal(taskPassed(run, null), false);
  assert.equal(taskStatus(run, null), 'pending');
  assert.equal(canOpenTask(run, content, '99'), false);
  assert.equal(nextTaskId(run, content, '99'), null);
  for (const stage of [-1, 6, undefined, '0']) {
    assert.deepEqual(stageTasks(content, stage), []);
    assert.equal(questProgress(run, {}, stage).allComplete, false);
  }
  assert.equal(questProgress(run, null).allComplete, false);
});

test('actual LYW v5 matrix has 24 steps across six interfaces of four and no submitted rubric', () => {
  const steps = content.learning.steps;
  assert.equal(steps.length, 24);
  assert.deepEqual(content.learning.teaching_matrix.actual_stage_step_counts, [4, 4, 4, 4, 4, 4]);
  for (let stage = 0; stage < 6; stage += 1) assert.equal(stageTasks(content, stage).length, 4);
  for (const item of steps) {
    assert.ok(item.matrix_title && item.goal_requirement, `missing matrix title/goal for ${item.id}`);
    assert.ok(Number.isInteger(item.stage) && item.stage >= 0 && item.stage <= 5, `bad stage for ${item.id}`);
    assert.equal(item.review_status, 'pending_teacher_review');
    assert.equal(item.minutes, undefined, `unsubmitted minutes on ${item.id}`);
    assert.equal(item.points, undefined, `unsubmitted points on ${item.id}`);
    assert.equal(item.score_type, undefined, `unsubmitted score type on ${item.id}`);
  }
  const matrix = content.learning.teaching_matrix;
  assert.equal(matrix.actual_has_minutes_points, false);
  assert.equal(matrix.actual_source_path, 'docs/p10ns/261019/24step_teaching_matrix_LYW_v5.md');
  const digest = p => crypto.createHash('sha256').update(fs.readFileSync(new URL(p, import.meta.url))).digest('hex');
  assert.equal(matrix.actual_source_sha256, digest('../docs/p10ns/261019/24step_teaching_matrix_LYW_v5.md'));
  assert.deepEqual(matrix.science_matrix.stage_step_counts, [5, 5, 6, 1, 3, 4]);
  assert.equal(matrix.science_matrix.source_path, 'docs/p10ns/261019/24step_teaching_matrix_LYW_v2.md');
  assert.equal(matrix.science_matrix.source_sha256, digest('../docs/p10ns/261019/24step_teaching_matrix_LYW_v2.md'));
  assert.equal(matrix.science_matrix.status, 'design_only_no_browser_or_model_validation');
  assert.equal(matrix.science_matrix.human_reviewed, false);
  assert.equal(matrix.proxy_rubric.source_sha256, digest('../docs/p10ns/261019/24step_table_3-6.md'));
  assert.equal(content.learning.route_analysis.source_sha256, digest('../docs/p10ns/261019/three_route_analysis_LJX.md'));
  assert.equal(matrix.proxy_rubric.total_minutes, 180);
  assert.equal(matrix.proxy_rubric.total_points, 100);
  assert.equal(matrix.proxy_rubric.status, 'agent_proposal_not_teacher_approved');
  assert.equal(matrix.total_minutes, undefined);
  assert.equal(matrix.total_points, undefined);
  assert.equal(matrix.score_types, undefined);
  assert.equal(matrix.review_status, 'pending_teacher_review');
});

test('data-dependent missions are exactly 04, 09 and 13 through 22', () => {
  const flagged = content.learning.steps.filter(item => item.data_dependency).map(item => item.id);
  assert.deepEqual(flagged, ['04', '09', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22']);
  assert.deepEqual(content.learning.teaching_matrix.data_dependent_steps, flagged);
  for (const item of content.learning.steps) {
    if (!flagged.includes(item.id)) assert.equal(item.data_dependency, false, `unexpected flag on ${item.id}`);
  }
});

test('route analysis separates four literature-reported results from 14 fields and 21 candidate hits', () => {
  const analysis = content.learning.route_analysis;
  assert.equal(analysis.reported_results.length, 4);
  for (const row of analysis.reported_results) {
    assert.ok(['R1', 'R2', 'R3'].includes(row.route), `bad result route ${row.route}`);
    assert.ok(row.label && row.value && row.context && row.source && row.caveat, `incomplete reported result ${row.label}`);
    assert.match(row.caveat, /原文报告|非本次|不是纯度/);
  }
  assert.ok(analysis.reported_results.some(row => row.route === 'R1' && /3830/.test(row.value)));
  assert.ok(analysis.reported_results.some(row => row.route === 'R2' && /18\.25|19\.87/.test(row.value)));
  assert.ok(analysis.reported_results.some(row => row.route === 'R3' && /35\.6/.test(row.value)));
  assert.equal(analysis.field_comparison.length, 14);
  for (const row of analysis.field_comparison) {
    assert.ok(row.id.startsWith('C') && row.field && row.R1 && row.R2 && row.R3, `incomplete comparison row ${row.id}`);
  }
  assert.equal(analysis.history_hits.total, 21);
  assert.equal(analysis.history_hits.withheld_unlicensed, 11);
  assert.equal(analysis.history_hits.missing, 10);
  assert.equal(analysis.history_hits.independent_studies_verified, false);
  assert.equal(analysis.history_hits.dedup_completed, false);
  assert.equal(analysis.review_status, 'pending_teacher_review');
  assert.ok(analysis.can_support.length >= 3);
  assert.ok(analysis.cannot_conclude.length >= 3);
  assert.ok(analysis.next_steps.length >= 3);
  assert.deepEqual(content.observations, []);
  assert.equal(content.quantitative_result, null);
  assert.equal(content.teacher_approved, false);
});

// TASK-026: 模型评价门控 —— 评价只作增强，选择题锚定不可被模型翻转。
test('TASK-026: a passed evaluation still requires the deterministic anchor on choice tasks', () => {
  const run = freshRun();
  record(run, '02'); // 选择题，已按正确答案记录。
  assert.equal(taskPassed(run, task('02')), true);
  const entry = run.learning.entries['02'];
  entry.eval = { state: 'passed', pass: true };
  assert.equal(taskPassed(run, task('02')), true);
  entry.matches = false; // 锚定被翻转：模型判 passed 也不能放行。
  assert.equal(taskPassed(run, task('02')), false);
  entry.matches = true;
  entry.eval = { state: 'failed', pass: false };
  assert.equal(taskPassed(run, task('02')), false);
});

test('TASK-026: failed evaluation blocks open tasks while degraded paths keep recorded semantics', () => {
  const run = freshRun();
  record(run, '04'); // 开放题。
  assert.equal(taskPassed(run, task('04')), true);
  run.learning.entries['04'].eval = { state: 'failed', pass: false };
  assert.equal(taskPassed(run, task('04')), false);
  run.learning.entries['04'].eval = { state: 'passed', pass: true };
  assert.equal(taskPassed(run, task('04')), true);
  run.learning.entries['04'].eval = {state:'evaluating'};
  assert.equal(taskPassed(run,task('04')),false);
  for (const state of ['degraded']) {
    run.learning.entries['04'].eval = { state, reason: 'network' };
    assert.equal(taskPassed(run, task('04')), true);
  }
  delete run.learning.entries['04'].eval; // 无评价：保持"已记录"语义，AI 不可用不卡死。
  assert.equal(taskPassed(run, task('04')), true);
});

test('TASK-026: editing a submission clears its evaluation', () => {
  const run = freshRun();
  record(run, '01');
  run.learning.entries['01'].eval = { state: 'passed', pass: true };
  draftLearning(run, '01', 'note', '修改依据说明之后，需要重新提交并接受新的评价。');
  assert.equal(run.learning.entries['01'].eval, undefined);
  assert.equal(run.learning.entries['01'].status, 'draft');
  checkLearning(run, task('01')); // 重新提交同样清除旧评价。
  assert.equal(run.learning.entries['01'].eval, undefined);
  assert.equal(run.learning.entries['01'].status, 'recorded');
});

test('TASK-026: evaluation survives hydration only in valid shapes', () => {
  const state = freshState();
  record(state.current, '01');
  state.current.learning.entries['01'].eval = { state: 'passed', pass: true, guidance: ['补充对照说明'] };
  const kept = hydrate(JSON.stringify(state)).current.learning.entries['01'];
  assert.equal(kept.eval.state, 'passed');
  assert.deepEqual(kept.eval.guidance, ['补充对照说明']);
  state.current.learning.entries['01'].eval = { state: 'bogus' };
  assert.equal(hydrate(JSON.stringify(state)).current.learning.entries['01'].eval, undefined);
  state.current.learning.entries['01'].eval = 'nope';
  assert.equal(hydrate(JSON.stringify(state)).current.learning.entries['01'].eval, undefined);
  state.current.learning.entries['01'].eval = null;
  assert.equal(hydrate(JSON.stringify(state)).current.learning.entries['01'].eval, undefined);
  state.current.learning.entries['01'].eval = { state: 'degraded' };
  assert.equal(hydrate(JSON.stringify(state)).current.learning.entries['01'].eval.state, 'degraded');
});

// TASK-027 L02 先学后做：路线前置学习门禁 —— 首篇任选、逐路线独立、切换重判、缺失内容不放行。
test('L02: each route gate is independent and any route can be the first learned route', () => {
  const run = freshRun();
  for (const route of ['R1', 'R2', 'R3']) {
    const gate = routeLearningGate(run, content, route);
    assert.equal(gate.complete, false);
    assert.equal(gate.total, 4);
  }
  for (const item of firstStage) record(run, item.id); // 以默认 R1 为首篇完成前置学习。
  assert.equal(routeLearningGate(run, content, 'R1').complete, true);
  assert.equal(routeLearningGate(run, content, 'R2').complete, false);
  assert.equal(routeLearningGate(run, content, 'R3').complete, false);
});

test('L02: switching the judged route re-checks prerequisites without inheriting passes', () => {
  const run = freshRun();
  for (const item of firstStage) record(run, item.id);
  assert.equal(routeLearningGate(run, content, 'R2').complete, false); // 不继承 R1 的通过结论。
  run.route = 'R2';
  for (const item of firstStage) record(run, item.id); // 按目标路线重新作答并重新判断。
  assert.equal(routeLearningGate(run, content, 'R2').complete, true);
  assert.equal(routeLearningGate(run, content, 'R1').complete, false); // 当前答案只代表当前路线；旧路线结论经已存快照回看比较，不继承。
});

test('L02: the learning gate fails closed on missing content and never invents progress', () => {
  const run = freshRun();
  assert.equal(routeLearningGate(run, {}, 'R1').complete, false);
  assert.equal(routeLearningGate(run, null, 'R1').total, 0);
  assert.equal(routeLearningGate(run, content, 'R9').complete, false);
  assert.equal(routeLearningGate(run, content).route, run.route); // 默认判断当前路线。
});

test('L03: feedback_rules cover three routes and required kinds with full provenance and no fabricated thresholds', () => {
  const rules = content.feedback_rules;
  assert.deepEqual([...new Set(rules.map(r => r.route_id))].sort(), ['R1', 'R2', 'R3']);
  for (const kind of ['locked_condition', 'qualitative_deviation', 'unknown_condition', 'reference_conflict', 'invalid_input'])
    assert.ok(rules.some(r => r.rule_kind === kind), `缺少 rule_kind: ${kind}`);
  assert.ok(rules.some(r => r.stage_mode === 'guided') && rules.some(r => r.stage_mode === 'open'));
  const fields = ['rule_id', 'route_id', 'parameter', 'stage_mode', 'rule_kind', 'source_id', 'source_locator', 'source_sha256', 'source_status', 'trigger', 'feedback_text', 'review_status'];
  for (const rule of rules) {
    for (const field of fields) assert.ok(Object.hasOwn(rule, field), `${rule.rule_id} 缺字段 ${field}`);
    assert.equal(rule.review_status, 'agent_checked_candidate', rule.rule_id);
    assert.ok(!JSON.stringify(rule).includes('教师已审定'), rule.rule_id);
    if (rule.source_id === null) assert.equal(rule.source_sha256, null, `${rule.rule_id} 无来源不得造 SHA`);
    else assert.ok(typeof rule.source_sha256 === 'string' && rule.source_sha256.length === 64, rule.rule_id);
    if (rule.reference && rule.reference.value === 'unknown')
      assert.ok(!/\d+\s*%/.test(rule.feedback_text), `${rule.rule_id} unknown 参照不得携带数值阈值`);
  }
});

test('admin7 passes every task on each route without choosing or inventing a matching answer', () => {
  for(const route of ['R1','R2','R3']){
    const state=freshState(),run=state.current;run.route=route;
    for(const item of content.learning.steps){
      run.stage=item.stage;
      draftLearning(run,item.id,'note',' admin7 ');
      const entry=checkLearning(run,item);
      assert.equal(taskPassed(run,item),true,`${route}/${item.id}`);
      assert.equal(entry.eval.mode,'admin_override');
      assert.equal(entry.choice,'');
      if(item.choices.length)assert.equal(entry.matches,false);
    }
    assert.deepEqual(run.learning.independent,{});
    run.stage=0; // Model the learning records without fabricating operation prerequisites.
    const restored=hydrate(JSON.stringify(state)).current;
    for(const item of content.learning.steps)assert.equal(taskPassed(restored,item),true);
    assert.match(learningMarkdown(restored),/admin_override/);
  }
});

test('passphrase is exact, recorded, route-bound, and revoked by edits', () => {
  for(const text of ['Admin7','admin77','xadmin7','admin7x','请admin7','admin 7',''])assert.equal(isAdminPass(text),false);
  assert.equal(isAdminPass('\nadmin7  '),true);
  assert.equal(validAnswer('admin7',15),true);
  const run=freshRun();draftLearning(run,'01','note','admin7');
  assert.equal(taskPassed(run,task('01')),false);
  checkLearning(run,task('01'));assert.equal(nextTaskId(run,content,'01'),'02');
  assert.equal(routeLearningGate(run,content,'R2').completed,0);
  draftLearning(run,'01','note','普通的新草稿内容');
  assert.equal(taskPassed(run,task('01')),false);
  assert.equal(run.learning.entries['01'].eval,undefined);
  assert.equal(canOpenTask(run,content,'02'),false);
});

test('admin7 outranks failed model or choice verdicts but does not change ordinary answer rules', () => {
  const run=freshRun();draftLearning(run,'02','choice','c1');draftLearning(run,'02','note','admin7');
  checkLearning(run,task('02'));run.learning.entries['02'].eval={state:'failed',mode:'model',pass:false};
  assert.equal(taskPassed(run,task('02')),true);
  draftLearning(run,'02','note','admin77');assert.throws(()=>checkLearning(run,task('02')),/8/);
  draftLearning(run,'02','note','足够长但选择仍不正确的正常回答');checkLearning(run,task('02'));
  assert.equal(taskPassed(run,task('02')),false);
  assert.equal(run.learning.entries['02'].eval,undefined);
});

test('all five local structure assets preserve distinct identities and audited geometry metadata', () => {
  const ids=['isoquercitrin','rutin','quercetin','emiq-example','spiraeoside'],keys=new Set();
  for(const id of ids){
    const asset=JSON.parse(fs.readFileSync(new URL(`../frontend/student/assets/molecules/${id}.json`,import.meta.url),'utf8'));
    assert.equal(asset.geometry_kind,'computed_conformer_not_observed');
    assert.equal(asset.review_status,'pending_teacher_review');
    assert.equal(asset.human_reviewed,false);
    assert.match(asset.source_sha256,/^[a-f0-9]{64}$/);
    assert.ok(asset.source_id&&asset.source_locator&&asset.source_license);
    assert.ok(fs.existsSync(new URL(`../frontend/student/assets/molecules/${id}-2d.svg`,import.meta.url)));
    const atomCount=Number(asset.sdf.split('\n')[3].slice(0,3));
    assert.equal(asset.atom_groups.sugar.length+asset.atom_groups.aglycone.length,atomCount);
    keys.add(asset.inchi_key);
    if(id==='emiq-example'){
      assert.equal(asset.representation_kind,'representative_component_not_mixture');
      assert.equal(asset.formula,'C27H30O17');
      assert.match(asset.source_locator,/Q3M/);
    }
  }
  assert.equal(keys.size,5);
});
