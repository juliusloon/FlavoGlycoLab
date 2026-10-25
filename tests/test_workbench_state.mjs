import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as L from '../frontend/student/lab-state.js';
import fs from 'node:fs';
import * as Learning from '../frontend/student/learning-state.js';
const content=JSON.parse(fs.readFileSync(new URL('../frontend/student/content/demo-content.json',import.meta.url),'utf8'));
const plan={volume:'2',concentration:'1.5',temperature:'30',ph:'7',duration:'60',samples:'0,30,60',control:'both',hypothesis:'比较催化体系与阴性对照是否有可测差异'};
function prepared(route='R1'){const r=L.freshRun();L.selectRoute(r,route);L.confirmRoute(r,'我选择此路线以比较体系组成和证据范围');for(const [k,v] of Object.entries(L.RECIPES[route]))if(k in L.MATERIALS)L.addMaterial(r,k,v);L.confirmAssembly(r);L.confirmPlan(r,plan);return r;}
function sampled(r){for(const a of ['check','mix','start','finish','sample'])L.operate(r,a);return r;}
test('fresh experiment gates later stages and has no results',()=>{const r=L.freshRun();assert.equal(L.canVisit(r,0),true);for(let n=1;n<6;n++)assert.equal(L.canVisit(r,n),false);assert.throws(()=>L.operate(r,'start'));assert.throws(()=>L.confirmAssembly(r));});
test('all three routes accept their own materials and reject crossed chemistry',()=>{for(const route of ['R1','R2','R3']){const r=L.freshRun();L.selectRoute(r,route);L.confirmRoute(r,'独立比较原料来源和体系要求');assert.throws(()=>L.addMaterial(r,'catalyst',route==='R1'?'cells':'ugt'));const p=prepared(route);assert.equal(p.stage,3);assert.equal(p.materials.catalyst,L.RECIPES[route].catalyst);}});
test('operation ordering rejects shortcuts and creates all planned groups only once',()=>{const r=prepared();assert.throws(()=>L.operate(r,'sample'));assert.throws(()=>L.operate(r,'mix'));sampled(r);assert.equal(r.samples.length,9);assert.throws(()=>L.operate(r,'sample'));assert.ok(r.samples.every(s=>s.observation===null&&s.quantitative_result===null));});
test('input validation rejects missing, NaN, impossible order and out of time samples',()=>{for(const p of [{...plan,volume:''},{...plan,concentration:'0'},{...plan,ph:'15'},{...plan,temperature:'NaN'},{...plan,samples:'30,10'},{...plan,samples:'0,70'},{...plan,samples:'0,0'},{...plan,control:''},{...plan,hypothesis:'a'}])assert.ok(L.validatePlan(p));assert.equal(L.validatePlan(plan),null);});
test('route change invalidates downstream snapshots and plans',()=>{const r=sampled(prepared());r.analysisReviewed=true;r.completed=true;L.selectRoute(r,'R2');assert.equal(r.routeConfirmed,false);assert.equal(r.planConfirmed,false);assert.deepEqual(r.materials,{});assert.equal(r.plan.volume,'');assert.equal(r.operation,'idle');assert.deepEqual(r.samples,[]);assert.equal(r.completed,false);assert.equal(r.analysisReviewed,false);});
test('condition edits invalidate sample and reflection while retaining assembly',()=>{const r=sampled(prepared());r.reflection.conclusion='旧结论';r.analysisReviewed=true;L.clearDownstream(r,2);assert.equal(r.assemblyConfirmed,true);assert.equal(r.routeConfirmed,true);assert.equal(r.planConfirmed,false);assert.deepEqual(r.samples,[]);assert.equal(r.reflection.conclusion,'');assert.equal(r.analysisReviewed,false);});
test('completed record is an isolated snapshot; new experiment preserves history',()=>{const s=L.freshState();s.current=sampled(prepared());s.current.analysisReviewed=true;s.current.stage=5;L.completeRun(s,{conclusion:'我只完成了流程演练，没有真实观测',limitation:'缺少标准曲线和真实色谱等分析证据',next:'补充教师审定资料并设置对应对照'});assert.equal(s.records.length,1);assert.equal(s.records[0].teacher_approved,false);s.current.plan.volume='3';assert.equal(s.records[0].plan.volume,'2');s.current=L.freshRun();assert.equal(s.records.length,1);assert.equal(s.current.events.length,0);});
test('reload restores safe state, interrupts in-flight practice, and rejects fake results',()=>{const s=L.freshState();s.current=prepared();for(const a of ['check','mix','start'])L.operate(s.current,a);const h=L.hydrate(JSON.stringify(s));assert.equal(h.current.operation,'mixed');s.current=sampled(prepared());s.current.samples[0].quantitative_result=0;assert.throws(()=>L.hydrate(JSON.stringify(s)));assert.throws(()=>L.hydrate('{bad'));});
test('export separates student input from absent measured outcomes and retains tutor trace',()=>{const s=L.freshState();s.current=sampled(prepared());s.current.chat.push({role:'assistant',mode:'model',content:'请检查对照'});const x=L.exportPayload(s);assert.equal(x.quantitative_result,null);assert.deepEqual(x.observations,[]);assert.equal(x.teacher_approved,false);assert.match(L.markdownRecord(s.current),/请检查对照/);assert.match(L.markdownRecord(s.current),/quantitative_result=null/);});
test('24 learning tasks have unique sequential IDs, source anchors and route-specific choices',()=>{
  const tasks=content.learning.steps;
  assert.deepEqual(tasks.map(x=>x.id),Array.from({length:24},(_,i)=>String(i+1).padStart(2,'0')));
  for(const t of tasks){
    assert.equal(t.stage,Learning.learningStage(t.id));assert.ok(t.feedback&&t.prompt);
    assert.ok(t.source_ids.every(id=>content.sources.some(s=>s.source_id===id)||content.learning.identity_sources.some(s=>s.source_id===id)||content.planning_source.source_id===id));
    if(t.choices.length)for(const route of ['R1','R2','R3'])assert.ok(t.choices.some(c=>c.id===(t.route_answers?.[route]??t.answer)));
  }
  assert.deepEqual(content.observations,[]);assert.equal(content.quantitative_result,null);assert.equal(content.teacher_approved,false);
});
test('learning requires a reason, preserves revisions as drafts, and never produces a grade',()=>{
  const run=L.freshRun(),t=content.learning.steps[2];
  assert.throws(()=>Learning.checkLearning(run,t));
  Learning.draftLearning(run,'03','choice','c2');Learning.draftLearning(run,'03','note','当前是体外加糖路线，需要核对方向');
  assert.equal(Learning.checkLearning(run,t).matches,false);
  Learning.draftLearning(run,'03','choice','c1');assert.equal(run.learning.entries['03'].status,'draft');assert.equal(run.learning.entries['03'].feedback,undefined);
  assert.equal(Learning.checkLearning(run,t).matches,true);
  assert.equal(run.quantitative_result,undefined);assert.equal(run.learning.entries['03'].grade,undefined);
  assert.throws(()=>Learning.draftLearning(run,'18','note','不能在未进入分析阶段时提交'));
});
test('first independent statement is preserved separately from later AI-assisted edits',()=>{
  const run=L.freshRun(),t=content.learning.steps[3],note='先独立比较原料和供体需求，选择体外双酶路线';
  Learning.draftLearning(run,'04','note',note);Learning.checkLearning(run,t);
  run.chat.push({role:'assistant',mode:'model',content:'请核对证据'});
  Learning.draftLearning(run,'04','note','参考模型建议后补充证据缺口，仍需核验');
  Learning.checkLearning(run,t);assert.equal(run.learning.independent['04'].note,note);
  assert.equal(run.learning.entries['04'].aiUsedBefore,true);assert.match(L.markdownRecord(run),/先独立比较/);
});
test('upstream changes invalidate affected learning while snapshots and early responses survive',()=>{
  const s=L.freshState();s.current=sampled(prepared());const run=s.current;
  run.stage=0;Learning.draftLearning(run,'01','choice','c1');Learning.draftLearning(run,'01','note','核对3-O葡萄糖连接与糖的构型');Learning.checkLearning(run,content.learning.steps[0]);
  run.stage=4;Learning.draftLearning(run,'18','choice','c2');Learning.draftLearning(run,'18','note','需要标准品和样品的原始色谱对应');Learning.checkLearning(run,content.learning.steps[17]);
  run.analysisReviewed=true;run.stage=5;L.completeRun(s,{conclusion:'当前只有方案和演练记录，无法定量',limitation:'尚无审定测量和定量材料可供使用',next:'继续补齐原始测量并设置适当对照'});
  L.clearDownstream(run,2);assert.ok(run.learning.entries['01']);assert.equal(run.learning.entries['18'],undefined);assert.ok(s.records[0].learning.entries['18']);
  L.selectRoute(run,'R2');assert.deepEqual(run.learning.entries,{});assert.equal(s.records[0].route,'R1');
});
test('old records migrate and unsupported learning fields fail closed on reload',()=>{
  const s=L.freshState();delete s.current.learning;
  assert.deepEqual(L.hydrate(JSON.stringify(s)).current.learning,Learning.freshLearning());
  s.current.learning=Learning.freshLearning();Learning.draftLearning(s.current,'01','note','保存草稿并在刷新时恢复原样内容');
  assert.equal(L.hydrate(JSON.stringify(s)).current.learning.entries['01'].status,'draft');
  s.current.learning.entries['01'].quantitative_result=0;assert.throws(()=>L.hydrate(JSON.stringify(s)));
  for(const corrupt of [{version:1,entries:1,independent:{}},{version:1,entries:{},independent:1},{...Learning.freshLearning(),grade:100},{...Learning.freshLearning(),observations:[1]}]){
    s.current.learning=corrupt;assert.throws(()=>L.hydrate(JSON.stringify(s)));
  }
});
test('intro narrative is fully sourced, non-quantitative and pending teacher review',()=>{
  const intro=content.intro;
  assert.equal(intro.review_status,'pending_teacher_review');
  const known=new Set([...content.sources.map(s=>s.source_id),...content.learning.identity_sources.map(s=>s.source_id),content.planning_source.source_id]);
  for(const block of [intro.case,intro.chemical_limit]){
    assert.ok(block.kicker&&block.title&&block.points.length>=2,block.title);
    for(const p of block.points){
      assert.ok(p.text&&p.source_ids.length>=1,p.text);
      for(const id of p.source_ids)assert.ok(known.has(id),id);
    }
    assert.ok(!/[%％]|产率|转化率|剂量|疗效/.test(JSON.stringify(block.points)),block.title);
  }
  assert.ok(intro.reading_note.text.includes('导师')&&intro.reading_note.kind);
  assert.deepEqual(intro.papers.map(p=>p.source_id).sort(),['Niu2024','Pei2019','Zhang2015']);
  for(const p of intro.papers){
    const s=content.sources.find(x=>x.source_id===p.source_id);
    assert.ok(s&&s.source_path&&s.source_sha256,p.source_id);
    assert.ok(content.routes.some(r=>r.id===p.route_id&&r.source_id===p.source_id),p.route_id);
  }
});
test('route A to B to A invalidates in-flight context and removes the previous route reason',()=>{
  const run=L.freshRun();
  L.confirmRoute(run,'原路线选择体外双酶，先核对供体来源');
  const sentRoute=run.route,sentRevision=run.contextRevision;
  L.selectRoute(run,'R2');
  assert.equal(run.reason,'');
  assert.equal(run.contextRevision,sentRevision+1);
  L.selectRoute(run,'R1');
  assert.equal(run.route,sentRoute);
  assert.notEqual(run.contextRevision,sentRevision);
  assert.equal(run.reason,'');
  const afterRoute=run.contextRevision;
  L.clearDownstream(run,2);
  assert.equal(run.contextRevision,afterRoute+1);
});
test('AI-request fact survives route resets and prevents a new claim of independent judgement',()=>{
  const run=L.freshRun(),task=content.learning.steps[3];
  // Even a request that later fails counts; the frontend sets this before fetching.
  run.aiRequested=true;run.chat.push({role:'user',content:'请比较三种制备路线'});
  L.selectRoute(run,'R2');
  assert.deepEqual(run.chat,[]);assert.equal(run.aiRequested,true);
  Learning.draftLearning(run,'04','note','已换为选择性水解，重新核对原料和催化体系');
  Learning.checkLearning(run,task);
  assert.equal(run.learning.entries['04'].aiUsedBefore,true);
  assert.equal(run.learning.independent['04'],undefined);
  const state=L.freshState();state.current=run;
  assert.equal(L.hydrate(JSON.stringify(state)).current.aiRequested,true);
  assert.equal(L.exportPayload(state).current.aiRequested,true);
  assert.equal(L.freshRun().aiRequested,false);
});
test('legacy AI and revision fields migrate only from retained evidence and reject corrupt types',()=>{
  for(const evidence of ['chat','learning','none']){
    const state=L.freshState(),run=state.current;
    delete run.aiRequested;delete run.contextRevision;
    if(evidence==='chat')run.chat.push({role:'user',content:'已请求建议，即使后来失败'});
    if(evidence==='learning'){
      Learning.draftLearning(run,'04','note','参考建议后重新核对候选路线和证据范围');
      run.aiRequested=true;Learning.checkLearning(run,content.learning.steps[3]);delete run.aiRequested;
    }
    const migrated=L.hydrate(JSON.stringify(state)).current;
    assert.equal(migrated.aiRequested,evidence!=='none');
    assert.equal(migrated.contextRevision,0);
  }
  for(const patch of [{aiRequested:'false'},{aiRequested:0},{contextRevision:-1},{contextRevision:1.5},{contextRevision:Number.MAX_SAFE_INTEGER}]){
    const state=L.freshState();Object.assign(state.current,patch);
    assert.throws(()=>L.hydrate(JSON.stringify(state)));
  }
});
test('reconfirming a legacy route retains current completed tasks and original independent statement',()=>{
  const run=L.freshRun();
  L.confirmRoute(run,'旧版主表单记录的初始路线依据');
  run.stage=0;
  for(const task of content.learning.steps.filter(t=>t.stage===0)){
    Learning.draftLearning(run,task.id,'note',`第${task.id}项已经核对原料、反应方向与来源证据`);
    if(task.choices.length)Learning.draftLearning(run,task.id,'choice',task.route_answers?.[run.route]??task.answer);
    Learning.checkLearning(run,task);
  }
  const independent=L.copy(run.learning.independent),entries=L.copy(run.learning.entries);
  L.confirmRoute(run,run.learning.entries['04'].note);
  assert.equal(run.stage,1);
  assert.deepEqual(run.learning.entries,entries);
  assert.deepEqual(run.learning.independent,independent);
  assert.equal(run.reason,entries['04'].note);
  assert.equal(run.assemblyConfirmed,false);
});
test('intro step questions and task 01 guidance are sourced, answerable and non-quantitative',()=>{
  const intro=content.intro;
  const known=new Set([...content.sources.map(s=>s.source_id),...content.learning.identity_sources.map(s=>s.source_id),content.planning_source.source_id]);
  assert.equal(typeof intro.orientation,'string');assert.ok(intro.orientation.trim().length>0);
  for(const block of [intro.case,intro.chemical_limit]){
    const q=block.question;
    assert.ok(q&&typeof q.prompt==='string'&&q.prompt.trim().length>0,block.title);
    const choices=Array.isArray(q.choices)?q.choices:[];
    assert.ok(choices.length>=2&&choices.every(c=>c&&typeof c.id==='string'&&typeof c.text==='string'&&c.text.trim().length>0),block.title);
    assert.ok(choices.some(c=>c.id===q.answer),block.title);
    assert.equal(q.review_status,'pending_teacher_review',block.title);
    assert.equal(typeof q.feedback,'string');assert.ok(q.feedback.trim().length>0,block.title);
    assert.equal(typeof q.retry,'string');assert.ok(q.retry.trim().length>0,block.title);
    assert.ok(Array.isArray(q.source_ids)&&q.source_ids.length>=1&&q.source_ids.every(id=>known.has(id)),block.title);
    assert.ok(!/[%％]|产率|转化率|剂量|疗效/.test(JSON.stringify(q)),block.title);
  }
  assert.equal(typeof intro.papers_gate?.text,'string');assert.ok(intro.papers_gate.text.trim().length>0);
  assert.equal(typeof intro.papers_gate?.tutor_prompt,'string');assert.ok(intro.papers_gate.tutor_prompt.trim().length>0);
  const first=content.learning.steps[0];
  assert.ok(Array.isArray(first.guidance)&&first.guidance.length===3&&first.guidance.every(g=>typeof g==='string'&&g.trim().length>0));
  assert.ok(Array.isArray(first.guidance_source_ids)&&first.guidance_source_ids.length>=1&&first.guidance_source_ids.every(id=>known.has(id)));
  assert.ok(typeof first.coach_question==='string'&&first.coach_question.includes('任务01'));
  assert.ok(typeof first.example==='string'&&first.example.trim().length>0);
  assert.ok(!/[%％]|产率|转化率|剂量|疗效/.test(JSON.stringify({guidance:first.guidance,coach_question:first.coach_question,example:first.example})));
});
test('fresh run starts the intro at step one and completes it only through ordered interactions',()=>{
  const r=L.freshRun();
  assert.equal(r.exploration,undefined);
  const start=L.introProgress(r);
  assert.equal(start.step,1);assert.equal(start.complete,false);assert.deepEqual(start.papers,[]);
  assert.throws(()=>L.answerIntroAct(r,2,'b',true));
  L.answerIntroAct(r,1,'c',false);
  let p=L.introProgress(r);
  assert.equal(p.step,1);assert.equal(p.act1,'c');assert.equal(p.complete,false);
  L.answerIntroAct(r,1,'a',true);
  p=L.introProgress(r);
  assert.equal(p.step,2);assert.equal(p.act1,'a');assert.equal(p.complete,false);
  assert.throws(()=>L.answerIntroAct(r,1,'a',true));
  L.answerIntroAct(r,2,'b',true);
  p=L.introProgress(r);
  assert.equal(p.step,3);assert.equal(p.act2,'b');assert.equal(p.complete,true);assert.deepEqual(p.papers,[]);
  assert.equal(r.exploration.revealed,true);
  L.recordIntroPaper(r,'R1');L.recordIntroPaper(r,'R1');
  p=L.introProgress(r);
  assert.deepEqual(p.papers,['R1']);assert.equal(p.complete,true);
  const late=L.freshRun();late.exploration={step:3,papers:[]};
  L.recordIntroPaper(late,'R2');
  assert.equal(late.exploration.revealed,true);
  assert.equal(L.introProgress(late).complete,true);
});
test('legacy exploration without a step field migrates to a completed intro',()=>{
  for(const legacy of [{revealed:true,routeChosen:true},{revealed:true},{routeChosen:true}]){
    const r=L.freshRun();r.exploration=legacy;
    const p=L.introProgress(r);
    assert.equal(p.step,3);assert.equal(p.act1,'legacy');assert.equal(p.act2,'legacy');
    assert.deepEqual(p.papers,['R1','R2','R3']);assert.equal(p.complete,true);
  }
  const r=L.freshRun();r.exploration={revealed:false,routeChosen:false};
  const p=L.introProgress(r);
  assert.equal(p.step,1);assert.equal(p.complete,false);
});
test('hydrate cleans malformed exploration fields without locking the save',()=>{
  const s=L.freshState();
  s.current.exploration='bogus';
  assert.equal(L.hydrate(JSON.stringify(s)).current.exploration,undefined);
  s.current.exploration={step:9,papers:['R1','bogus','R2'],act1:42,act2:'b',revealed:true,routeChosen:true};
  const cleaned=L.hydrate(JSON.stringify(s)).current;
  assert.deepEqual(cleaned.exploration,{papers:['R1','R2'],act2:'b',revealed:true,routeChosen:true});
  assert.equal(L.introProgress(cleaned).complete,true);
  s.current.exploration={step:2,act1:'a'};
  const kept=L.hydrate(JSON.stringify(s)).current;
  assert.deepEqual(kept.exploration,{step:2,act1:'a'});
  const p=L.introProgress(kept);
  assert.equal(p.step,2);assert.equal(p.complete,false);
});
// TASK-026: 同阶段静默重置修复 —— 装配/方案编辑只失效下游阶段，永不清同阶段已完成记录。
function recordStage(run,stage){
  run.stage=stage;
  for(const task of content.learning.steps.filter(t=>t.stage===stage)){
    Learning.draftLearning(run,task.id,'note',`阶段${stage}记录${task.id}：核对该步骤所需证据与依据的说明`);
    if(task.choices.length)Learning.draftLearning(run,task.id,'choice',task.route_answers?.[run.route]??task.answer);
    Learning.checkLearning(run,task);
  }
}
test('TASK-026: re-adding the same material keeps all records and only refreshes AI context',()=>{
  const r=L.freshRun();L.selectRoute(r,'R1');L.confirmRoute(r,'我选择此路线以比较体系组成和证据范围');
  for(const [k,v] of Object.entries(L.RECIPES.R1))if(k in L.MATERIALS)L.addMaterial(r,k,v);
  L.confirmAssembly(r);L.confirmPlan(r,plan);
  recordStage(r,1);recordStage(r,2);
  const rev=r.contextRevision;
  L.addMaterial(r,'catalyst','ugt'); // 同材料重复加入：不做任何清除。
  for(const id of ['05','06','07','08','09','10','11','12'])assert.ok(r.learning.entries[id],id);
  assert.equal(r.planConfirmed,true);
  assert.equal(r.contextRevision,rev+1);
  assert.ok(r.events.some(e=>e.action==='重复加入体系'));
});
test('TASK-026: an actual material change keeps this-stage records, clears downstream and resets analysis',()=>{
  const r=L.freshRun();L.selectRoute(r,'R1');L.confirmRoute(r,'我选择此路线以比较体系组成和证据范围');
  for(const [k,v] of Object.entries(L.RECIPES.R1))if(k in L.MATERIALS)L.addMaterial(r,k,v);
  L.confirmAssembly(r);L.confirmPlan(r,plan);
  recordStage(r,1);recordStage(r,2);
  r.analysis.calculations.push({id:'c1'});
  delete r.materials.catalyst; // 模拟移除后重新加入：材料实际变化。
  L.addMaterial(r,'catalyst','ugt');
  for(const id of ['05','06','07','08'])assert.ok(r.learning.entries[id],id);
  assert.equal(r.learning.entries['09'],undefined);
  assert.equal(r.planConfirmed,false);
  assert.deepEqual(r.analysis,L.freshAnalysis());
});
test('TASK-026: editing a confirmed plan keeps this-stage quest records and clears only downstream',()=>{
  const r=prepared();
  recordStage(r,2);recordStage(r,3);
  r.stage=3;
  L.confirmPlan(r,{...plan,volume:'3'});
  for(const id of ['09','10','11','12'])assert.ok(r.learning.entries[id],id);
  assert.equal(r.learning.entries['13'],undefined);
  assert.deepEqual(r.analysis,L.freshAnalysis());
  assert.equal(r.planConfirmed,true);
});
// app.js 的 plan-form 输入处理器无现成测试钩子（浏览器事件层），其行为由上面 confirmPlan/clearDownstream 用例覆盖状态层语义。
test('TASK-026: analysis resets with downstream invalidation and hydrates with a default shape',()=>{
  const r=L.freshRun();
  assert.deepEqual(r.analysis,L.freshAnalysis());
  r.analysis.calculations.push({id:'c1'});r.analysis.comparisons={a:1};
  L.clearDownstream(r,3);
  assert.deepEqual(r.analysis,L.freshAnalysis());
  r.analysis.gaps.push('缺标准曲线');
  L.clearDownstream(r,4); // n>3：分析状态不随操作/反思层失效。
  assert.deepEqual(r.analysis.gaps,['缺标准曲线']);
  const s=L.freshState();delete s.current.analysis;
  assert.deepEqual(L.hydrate(JSON.stringify(s)).current.analysis,L.freshAnalysis());
});

// TASK-027 L02 两阶段：学习门禁进入参照练习、参照锁定/开放警告、重来与旧存档迁移。
function lockedPlan(route){const p={...plan};if(route==='R1'||route==='R3')p.control='negative';if(route==='R2')p.concentration='20';return p;}
function preparedGuided(route='R1'){const r=L.freshRun();L.selectRoute(r,route);L.confirmRoute(r,'我选择此路线以比较体系组成和证据范围');for(const [k,v] of Object.entries(L.RECIPES[route]))if(k in L.MATERIALS)L.addMaterial(r,k,v);L.confirmAssembly(r);L.confirmPlan(r,lockedPlan(route),content);return r;}
test('L02: entering guided practice requires the route learning gate and locks reference conditions',()=>{
  const r=L.freshRun();
  assert.throws(()=>L.enterGuided(r,content)); // 未完成本路线前置学习不得进入参照练习。
  recordStage(r,0);
  L.enterGuided(r,content);assert.equal(r.stageMode,'guided');
  const g=L.freshRun();L.selectRoute(g,'R1');L.confirmRoute(g,'我选择此路线以比较体系组成和证据范围');
  for(const [k,v] of Object.entries(L.RECIPES.R1))if(k in L.MATERIALS)L.addMaterial(g,k,v);
  L.confirmAssembly(g);
  assert.throws(()=>L.confirmPlan(g,plan,content)); // 对照与文献定位冲突：阻断，不填默认值。
  L.confirmPlan(g,lockedPlan('R1'),content); // 与参照一致：通过。
  assert.equal(g.planConfirmed,true);
  const w=L.freshRun();L.selectRoute(w,'R2');L.confirmRoute(w,'我选择此路线以比较水解与供体差异');
  for(const [k,v] of Object.entries(L.RECIPES.R2))if(k in L.MATERIALS)L.addMaterial(w,k,v);
  L.confirmAssembly(w);
  assert.throws(()=>L.confirmPlan(w,plan,content)); // R2 锁定起始底物浓度 20 mM。
  L.confirmPlan(w,lockedPlan('R2'),content);assert.equal(w.plan.concentration,'20');
});
test('L02: guided completion unlocks open inquiry; warnings allow continue or abandon without silent edits',()=>{
  const r=preparedGuided('R1');recordStage(r,1);recordStage(r,2);
  sampled(r);r.analysisReviewed=true;
  assert.equal(L.canEnterOpen(r),false); // 未完成参照流程不得进入开放探究。
  L.completeGuided(r);
  assert.equal(r.guidedDone.R1,true);assert.equal(r.stageMode,'open');assert.equal(L.canEnterOpen(r),true);
  const openPlan={...lockedPlan('R1'),control:'blank'};
  const warnings=L.openWarnings(r,openPlan,content);
  assert.equal(warnings.length,1);assert.equal(warnings[0].parameter,'control');
  const before=JSON.stringify(r.plan);
  const abandoned=L.submitOpenPlan(r,openPlan,content,'abandon');
  assert.equal(abandoned.abandoned,true);assert.equal(JSON.stringify(r.plan),before); // 放弃本次：旧方案原样保留。
  assert.throws(()=>L.submitOpenPlan(r,openPlan,content,'undecided'));
  const done=L.submitOpenPlan(r,openPlan,content,'continue'); // 警告后继续。
  assert.equal(done.abandoned,false);assert.equal(r.plan.control,'blank');assert.equal(r.planConfirmed,true);
});
test('L02: redo keeps this-stage inputs, saves a snapshot and invalidates downstream by revision',()=>{
  const s=L.freshState();const r=preparedGuided('R1');s.current=r;recordStage(r,1);recordStage(r,2);
  const rev=r.contextRevision;
  const snap=L.redoStageMode(s);
  assert.equal(s.records.length,1);assert.equal(s.records[0].id,snap.id);assert.equal(s.records[0].planConfirmed,true); // 已存快照保留。
  assert.equal(r.contextRevision,rev+1); // 下游结果与旧 AI 回复按修订号失效（app.js 按 revision 丢弃）。
  assert.equal(r.planConfirmed,false);assert.equal(r.plan.volume,plan.volume); // 同阶段输入不清空。
  assert.ok(r.learning.entries['09']);assert.equal(r.learning.entries['13'],undefined); // 同阶段记录保留，下游主线失效。
  assert.equal(r.completed,false);
});
test('L02: legacy saves migrate to guided defaults and keep old answers, task IDs and sources',()=>{
  const s=L.freshState();const r=s.current;
  recordStage(r,0);
  delete r.stageMode;delete r.guidedDone;delete r.contextRevision; // 模拟旧存档：无 stage_mode/revision 字段。
  const h=L.hydrate(JSON.stringify(s)).current;
  assert.equal(h.stageMode,'guided');assert.deepEqual(h.guidedDone,{});assert.equal(h.contextRevision,0);
  assert.deepEqual(Object.keys(h.learning.entries).sort(),['01','02','03','04']); // 旧答案与题目 ID 不丢。
  for(const bad of [{stageMode:'bogus'},{stageMode:'OPEN'},{guidedDone:[]},{guidedDone:{R9:true}},{guidedDone:{R1:'yes'}}]){
    const s2=L.freshState();Object.assign(s2.current,bad);assert.throws(()=>L.hydrate(JSON.stringify(s2)));
  }
});

// L06-fix: planView 回退必须渲染真实输入框，不能把箭头函数源码插进 DOM。
import {planView} from '../frontend/student/views/workbench.js';
test('L06-fix: open mode renders real plan inputs and never leaks arrow-function source into the DOM',()=>{
  const openRun=preparedGuided('R1');openRun.stageMode='open';
  const html=planView(openRun,content);
  assert.ok(!html.includes('=>field'));
  assert.match(html,/<input name="volume" type="number"/);
  assert.match(html,/<input name="ph" type="number"/);
  assert.match(html,/<select name="control"/);
  const guided=preparedGuided('R2');
  const gh=planView(guided,content);
  assert.ok(!gh.includes('=>field'));
  assert.match(gh,/name="concentration"[^>]*readonly/); // 参照练习的锁定字段仍只读预填。
  assert.match(gh,/locked-input/);
});


test('TASK-035: imported computation survives export and reload without advancing learning or creating observations',()=>{
 const contract=JSON.parse(readFileSync(new URL('../metadata/retrosynthesis.json',import.meta.url),'utf8'));
 const r=contract.cases.Pei2019,hash='0'.repeat(64);
 const packet={schema:'flavoretro.lab-handoff.v1',run:{id:'20000101T000000-'+ '0'.repeat(32),execution_source:'live_aizynthfinder_mcts',result_sha256:hash,manifest_sha256:hash},route:{id:hash,tree_sha256:hash,steps:1,closure:'partial'},target:contract.target,selection:r,witness:{product_smiles:r.target_smiles,precursor_smiles:r.precursor_smiles},literature:[],packet_sha256:hash,teacher_approved:false,independent_chemical_validation:false,observations:[],quantitative_result:null};
 const state=L.freshState(),before=JSON.stringify(state.current.learning);
 state.current.retroImport={packet,validation:'local_identity_source_and_checksum_match',upstream_run_independently_verified:false,teacher_approved:false,observations:[],quantitative_result:null};
 const restored=L.hydrate(JSON.stringify(state));
 assert.equal(JSON.stringify(restored.current.learning),before);
 assert.equal(restored.current.routeConfirmed,false);assert.deepEqual(restored.current.samples,[]);
 assert.equal(restored.current.stage,0);assert.deepEqual(restored.current.guidedDone,{});
 assert.equal(L.exportPayload(restored).current.retroImport.packet.selection.source_id,'Pei2019');
 restored.current.retroImport.packet.teacher_approved=true;
 assert.throws(()=>L.hydrate(JSON.stringify(restored)),/逆合成来源记录无效/);
});

// TASK-047: reading is optional; notes are student input, never observations or task completion.
test('paper notes survive reload/export/history and stay isolated from task progress and new runs',()=>{
 const s=L.freshState(),note='比较底物与供体，继续核对原文证据。<script>不要执行</script>';
 s.current.paperNotes.Pei2019=note;
 const restored=L.hydrate(JSON.stringify(s));
 assert.equal(restored.current.paperNotes.Pei2019,note);assert.deepEqual(restored.current.learning,s.current.learning);
 assert.equal(restored.current.aiRequested,false);assert.equal(L.introProgress(restored.current).complete,false);
 assert.equal(L.exportPayload(restored).current.paperNotes.Pei2019,note);assert.match(L.markdownRecord(restored.current),/论文阅读笔记（学生自述）/);
 L.selectRoute(restored.current,'R2');assert.equal(restored.current.paperNotes.Pei2019,note);
 restored.current=sampled(prepared());restored.current.paperNotes.Niu2024=note;restored.current.analysisReviewed=true;restored.current.stage=5;
 L.completeRun(restored,{conclusion:'只有文献与流程记录，暂无实验观测',limitation:'缺少标准曲线和真实样品测量数据',next:'补齐对应来源与经过审核的测量资料'});
 restored.current.paperNotes.Niu2024='修改后的笔记';assert.equal(restored.records[0].paperNotes.Niu2024,note);
 restored.current=L.freshRun();assert.deepEqual(restored.current.paperNotes,{});assert.equal(L.hydrate(JSON.stringify(restored)).records[0].paperNotes.Niu2024,note);
});
test('paper note migration accepts old saves and rejects unknown, malformed or oversized inputs',()=>{
 const s=L.freshState();delete s.current.paperNotes;assert.deepEqual(L.hydrate(JSON.stringify(s)).current.paperNotes,{});
 for(const invalid of [null,[],{unknown:'伪来源'},{Pei2019:42},{Pei2019:'字'.repeat(8001)}]){s.current.paperNotes=invalid;assert.throws(()=>L.hydrate(JSON.stringify(s)),/论文笔记无效/);}
 s.current.paperNotes={Pei2019:'字'.repeat(8000)};assert.equal(L.hydrate(JSON.stringify(s)).current.paperNotes.Pei2019.length,8000);
});

test('optional named enzyme activities preserve units and migrate older records',()=>{
  assert.equal(L.validatePlan({...plan,ugtActivity:'70',susActivity:'120'}),null);
  for(const invalid of ['-1','NaN','Infinity','0','1000000001'])assert.ok(L.validatePlan({...plan,ugtActivity:invalid}));
  const old=L.freshState();for(const k of Object.keys(L.ACTIVITY_FIELDS))delete old.current.plan[k];
  const restored=L.hydrate(JSON.stringify(old));assert.equal(restored.current.plan.ugtActivity,'');
  restored.current.plan.ugtActivity='70';restored.current.plan.susActivity='120';
  assert.equal(L.hydrate(JSON.stringify(restored)).current.plan.susActivity,'120');
});

test('refresh during evaluation retains answer, removes stuck loading and permits retry',()=>{
  const s=L.freshState();Learning.draftLearning(s.current,'01','note','刷新仍应保留已提交回答与来源边界');
  Learning.checkLearning(s.current,content.learning.steps[0]);
  s.current.learning.entries['01'].eval={state:'evaluating',evalId:'interrupted'};
  const restored=L.hydrate(JSON.stringify(s));
  assert.equal(restored.current.learning.entries['01'].note,s.current.learning.entries['01'].note);
  assert.equal(restored.current.learning.entries['01'].eval.state,'degraded');
  assert.equal(restored.current.learning.entries['01'].eval.reason,'interrupted');
});
