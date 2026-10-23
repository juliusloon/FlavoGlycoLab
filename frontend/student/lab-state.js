import {validImportRecord} from './retro-import.js';
import { freshLearning, resetLearning, hydrateLearning, learningMarkdown, hasTutorInteraction } from './learning-state.js';
import { routeLearningGate } from './quest-state.js';
export const STORAGE_KEY = 'flavoglycolab.workbench.v1';
export const STAGES = ['案例与路线','配置反应体系','设定实验方案','操作与取样','查看分析结果','结论与反思'];
export const MATERIALS = {
  substrate: [{id:'quercetin',label:'槲皮素'},{id:'rutin',label:'芦丁'}],
  catalyst: [{id:'ugt',label:'UGT 与蔗糖合酶'},{id:'rhamnosidase',label:'α-L-鼠李糖苷酶'},{id:'cells',label:'工程化枯草芽孢杆菌'}],
  donor: [{id:'regeneration',label:'供体与再生方案'},{id:'none',label:'不引入糖基化供体'},{id:'cellular',label:'细胞内供体供给方案'}],
};
export const RECIPES = {
  R1:{substrate:'quercetin',catalyst:'ugt',donor:'regeneration',hint:'核对底物、糖基转移体系和供体再生是否配套。',control:'无酶对照'},
  R2:{substrate:'rutin',catalyst:'rhamnosidase',donor:'none',hint:'这是选择性水解路线，需区分去糖和加糖。',control:'无酶对照'},
  R3:{substrate:'quercetin',catalyst:'cells',donor:'cellular',hint:'使用外加槲皮素进行全细胞转化；供体供给属于细胞体系方案。',control:'无细胞对照'},
};
export const copy = value => JSON.parse(JSON.stringify(value));
// TASK-027 L02 两阶段：参照练习（guided）与开放探究（open）。revision 复用既有 contextRevision。
export const STAGE_MODES = ['guided','open'];
export const PARAM_LABELS = {volume:'反应体积',concentration:'底物浓度',temperature:'计划温度',ph:'计划pH',duration:'计划时长',samples:'取样时点',control:'对照方案',hypothesis:'假设'};
// TASK-026: 结果分析台预留状态；分析结果依赖方案/材料，下游失效时一并重置。
export function freshAnalysis(){return {refRecords:[],comparisons:null,calculations:[],gaps:[],boundaryNote:'',boundaryDone:false};}
export function freshRun(){
  return {id:globalThis.crypto?.randomUUID?.() || `run-${Date.now()}-${Math.random().toString(36).slice(2)}`,stage:0,route:'R1',reason:'',routeConfirmed:false,materials:{},assemblyConfirmed:false,
    plan:{volume:'',concentration:'',temperature:'',ph:'',duration:'',samples:'',control:'',hypothesis:''},planConfirmed:false,
    operation:'idle',samples:[],analysis:freshAnalysis(),analysisReviewed:false,reflection:{conclusion:'',limitation:'',next:''},completed:false,events:[],chat:[],learning:freshLearning(),aiRequested:false,contextRevision:0,
    stageMode:'guided',guidedDone:{}};
}
export function freshState(){return {version:1,current:freshRun(),records:[],updatedAt:null};}
export function log(run,action,detail=''){run.events.push({at:new Date().toISOString(),action,detail});run.events=run.events.slice(-200);}
export function clearDownstream(run,from,learningFrom=from){
  run.aiRequested=hasTutorInteraction(run);
  run.contextRevision=(run.contextRevision??0)+1;
  resetLearning(run,learningFrom);
  if(from<=0){run.routeConfirmed=false;run.materials={};}
  if(from<=1){run.assemblyConfirmed=false;}
  if(from<=2){run.planConfirmed=false;run.operation='idle';run.samples=[];}
  if(from<=3){run.analysisReviewed=false;run.analysis=freshAnalysis();} // TASK-026: 分析依赖方案/材料，n<=3 时一并重置。
  run.reflection={conclusion:'',limitation:'',next:''};run.completed=false;
}
export function selectRoute(run,id){
  if(!RECIPES[id])throw Error('请选择已有路线。');
  if(id!==run.route){clearDownstream(run,0);run.plan=freshRun().plan;run.reason='';run.route=id;run.stage=0;run.chat=[];run.stageMode='guided';log(run,'更换路线',id);}
}
export function confirmRoute(run,reason){
  if(typeof reason!=='string'||reason.trim().length<8)throw Error('请至少用8个字说明你的路线选择依据。');
  if(run.routeConfirmed && run.reason!==reason.trim())clearDownstream(run,0,1);
  run.reason=reason.trim().slice(0,2000);run.routeConfirmed=true;run.stage=1;log(run,'确认路线',`${run.route}：${run.reason}`);
}
export function addMaterial(run,kind,id){
  if(!run.routeConfirmed)throw Error('请先确认路线。');
  if(RECIPES[run.route][kind]!==id)throw Error(`这项材料与当前路线摘要不匹配。${RECIPES[run.route].hint}请重新选择。`);
  // TASK-026: 装配编辑只失效下游阶段，永不清同阶段已完成记录。
  if(run.materials[kind]!==id){
    clearDownstream(run,2); // 材料实际变化：清 09 及以后，保留本阶段 05-08。
    run.materials[kind]=id;log(run,'加入体系',MATERIALS[kind].find(x=>x.id===id).label);
  }else{
    run.contextRevision=(run.contextRevision??0)+1; // 材料未变：不清除任何记录，仅刷新 AI 上下文。
    log(run,'重复加入体系',`${MATERIALS[kind].find(x=>x.id===id).label}（未变化）`);
  }
}
export function confirmAssembly(run){
  if(!run.routeConfirmed || !Object.keys(MATERIALS).every(k=>run.materials[k]===RECIPES[run.route][k]))throw Error('请先加入与当前路线匹配的底物、催化体系和供体方案。');
  run.assemblyConfirmed=true;run.stage=2;log(run,'确认装配');
}
export function sampleTimes(plan){return String(plan.samples).split(/[,，\s]+/).filter(Boolean).map(Number);}
export function validatePlan(plan){
  const fields=[['volume','反应体积',0,10000],['concentration','底物浓度',0,100000],['temperature','计划温度',-20,150],['ph','计划pH',0,14],['duration','计划时长',0,10080]];
  for(const [k,label,min,max] of fields){const n=Number(plan[k]);if(String(plan[k]).trim()===''||!Number.isFinite(n)||n<min||n>max||(['volume','concentration','duration'].includes(k)&&n===0))return `${label}输入无效。请填写合理格式的数值（仅检查输入，不判断化学适用性）。`;}
  const times=sampleTimes(plan);
  if(!times.length||times.length>8||times.some((t,i)=>!Number.isFinite(t)||t<0||t>Number(plan.duration)||(i>0&&t<=times[i-1])))return '请输入1—8个递增且不超过计划时长的取样时点，用逗号分隔。';
  if(!['negative','blank','both'].includes(plan.control))return '请选择对照方案。';
  if(typeof plan.hypothesis!=='string'||plan.hypothesis.trim().length<8)return '请至少用8个字写出可检验假设。';
  return null;
}
export function confirmPlan(run,plan,content=null){
  if(!run.assemblyConfirmed)throw Error('请先完成体系装配。');
  const error=validatePlan(plan);if(error)throw Error(error);
  // TASK-027 L02: 参照练习（guided）锁定有明确文献定位的关键条件；缺失/冲突参照不填默认值。
  const issue=(run.stageMode??'guided')==='guided'?guidedPlanIssues(run,plan,content)[0]:null;
  if(issue)throw Error(issue.message);
  // TASK-026: 方案变化只失效下游阶段（13 及以后），保留本阶段 09-12 的记录。
  if(JSON.stringify(run.plan)!==JSON.stringify(plan))clearDownstream(run,3);
  clearDownstream(run,2,3);run.plan=copy(plan);run.planConfirmed=true;run.stage=3;log(run,'保存实验方案','条件均为学生设计，未核验适用域。');
}
// TASK-027 L02 反馈规则取用：只读 demo-content.json 的 feedback_rules，不复制到运行配置。
export function routeRules(content,routeId,stageMode=null){
  return (Array.isArray(content?.feedback_rules)?content.feedback_rules:[]).filter(rule=>rule?.route_id===routeId&&(stageMode===null||rule.stage_mode===stageMode));
}
function referenceUnknown(rule){const v=rule?.reference?.value;return v===undefined||v===null||v==='unknown';}
// 参照练习提交前检查：返回 [{rule,parameter,status:'unknown'|'missing'|'conflict',message}]。
export function guidedPlanIssues(run,plan,content){
  if(!content)return [];
  const issues=[];
  for(const rule of routeRules(content,run.route,'guided')){
    if(rule.rule_kind!=='locked_condition')continue;
    const label=PARAM_LABELS[rule.parameter]??rule.parameter;
    if(referenceUnknown(rule)){issues.push({rule,parameter:rule.parameter,status:'unknown',message:`「${label}」缺少可核验的文献参照条件，显示待补；本切片不填默认值，请暂缓提交该项。`});continue;}
    const value=String(plan?.[rule.parameter]??'').trim();
    if(value===''){issues.push({rule,parameter:rule.parameter,status:'missing',message:`参照练习要求按文献定位填写「${label}」，该项不能为空。`});continue;}
    if(String(rule.reference.value)!==value)issues.push({rule,parameter:rule.parameter,status:'conflict',message:`「${label}」与本篇报告条件不同（${rule.feedback_text||'仅作参照提示，不推断后果'}）。参照练习请按文献定位条件填写。`});
  }
  return issues;
}
// 开放探究警告：只在 open 模式评估；参照值缺失的规则不触发数值警告（无证据不推断）。
export function openWarnings(run,plan,content){
  if((run.stageMode??'guided')!=='open'||!content)return [];
  const warnings=[];
  for(const rule of routeRules(content,run.route)){
    if(!['locked_condition','deviation_warning'].includes(rule.rule_kind))continue;
    if(referenceUnknown(rule))continue;
    const value=String(plan?.[rule.parameter]??'').trim();
    if(value!==''&&String(rule.reference.value)!==value)warnings.push({rule,parameter:rule.parameter,status:'deviation',reference:rule.reference.value,text:rule.feedback_text||'与本篇报告条件不同；影响尚无对应证据，可作为待检验假设。'});
  }
  return warnings;
}
// 开放探究提交三选：继续（照常提交）/ 放弃本次（不改动任何状态）/ 重来（走 redoStageMode，由 UI 先确认）。
export function submitOpenPlan(run,plan,content,decision){
  const warnings=openWarnings(run,plan,content);
  if(decision==='abandon')return {abandoned:true,warnings}; // 放弃本次：旧方案与全部记录原样保留。
  if(warnings.length&&decision!=='continue')throw Error('条件与文献参照不同：请选择"警告后继续 / 放弃本次 / 重来"。');
  confirmPlan(run,plan,content);
  return {abandoned:false,warnings};
}
// 重来：先由 UI 明确提示影响；此处保存当前快照、递增修订号、只失效下游，同阶段输入与已完成记录保留。
export function redoStageMode(state){
  const run=state.current,stage=run.stage??0,revision=run.contextRevision??0;
  const snapshot={...copy(run),id:`${run.id}-redo-${Date.now().toString(36)}`,runId:run.id,savedAt:new Date().toISOString(),quantitative_result:null,teacher_approved:false};
  state.records=[snapshot,...state.records].slice(0,12);
  clearDownstream(run,stage,stage+1); // revision+1：下游结果与旧 AI 回复按修订号失效；同阶段学习记录保留。
  log(run,'重来本阶段',`模式 ${run.stageMode??'guided'}；已保留快照 ${snapshot.id}；下游按修订号 ${revision}→${run.contextRevision} 失效。`);
  return snapshot;
}
// 学习门禁与两阶段切换。进入参照练习要求本路线前置学习完成；开放探究要求本路线参照流程完成。
export function enterGuided(run,content){
  const gate=routeLearningGate(run,content,run.route);
  if(!gate.complete)throw Error(`先完成本路线的前置学习（主线 01—04，${gate.completed}/${gate.total}），再进入参照练习。`);
  run.stageMode='guided';log(run,'进入参照练习','关键条件按文献定位锁定。');
}
export function canEnterOpen(run){return run.guidedDone?.[run.route]===true;}
export function enterOpen(run){
  if(!canEnterOpen(run))throw Error('先完成本路线的参照流程，再进入开放探究。');
  run.stageMode='open';log(run,'进入开放探究','允许调整参数；偏差只作参照提示，不推断后果。');
}
export function completeGuided(run){
  if((run.stageMode??'guided')!=='guided')throw Error('当前不在参照练习模式。');
  if(!run.analysisReviewed)throw Error('参照流程尚未走完：请先完成操作、取样与分析核对。');
  run.guidedDone??={};run.guidedDone[run.route]=true;run.stageMode='open';
  log(run,'完成参照练习',`解锁 ${run.route} 的开放探究。`);
}
export function operate(run,action){
  if(!run.planConfirmed)throw Error('请先保存完整的实验方案。');
  const rules={check:['idle','checked','核对方案与样品标签'],mix:['checked','mixed','混合操作演练'],start:['mixed','running','启动流程演练'],finish:['running','ready','流程演练就绪'],sample:['ready','sampled','建立取样记录']};
  const rule=rules[action];if(!rule||run.operation!==rule[0])throw Error('请按检查、混合、启动、取样的顺序操作。');
  run.operation=rule[1];
  if(action==='sample')run.samples=sampleTimes(run.plan).flatMap((at,i)=>['实验组',...(run.plan.control==='both'?['阴性对照','空白对照']:[run.plan.control==='blank'?'空白对照':'阴性对照'])].map((group,j)=>({id:`S${String(i+1).padStart(2,'0')}-${j+1}`,group,plannedTime:at,observation:null,quantitative_result:null,status:'awaiting_evidence'})));
  log(run,rule[2]);
}
export function canVisit(run,stage){return stage===0||(stage===1&&run.routeConfirmed)||(stage===2&&run.assemblyConfirmed)||(stage===3&&run.planConfirmed)||(stage===4&&run.operation==='sampled')||(stage===5&&run.analysisReviewed);}
export function introProgress(run){
 const ex=run?.exploration;
 if(!ex||typeof ex!=='object'||Array.isArray(ex))return{step:1,act1:null,act2:null,papers:[],complete:false};
 if(ex.step===undefined){
  if(ex.revealed||ex.routeChosen)return{step:3,act1:'legacy',act2:'legacy',papers:['R1','R2','R3'],complete:true};
  return{step:1,act1:null,act2:null,papers:[],complete:false};
 }
 const papers=Array.isArray(ex.papers)?ex.papers.filter(id=>RECIPES[id]):[];
 return{step:ex.step,act1:ex.act1??null,act2:ex.act2??null,papers,complete:ex.step===3&&papers.length>=1};
}
export function answerIntroAct(run,step,choiceId,correct){
 const progress=introProgress(run);
 if(step!==progress.step)throw Error('请按顺序完成导入步骤。');
 const ex=run.exploration&&typeof run.exploration==='object'&&!Array.isArray(run.exploration)?run.exploration:(run.exploration={});
 ex[`act${step}`]=choiceId;
 ex.step=correct?Math.min(3,step+1):step;
 if(ex.step===3)ex.revealed=true;
}
export function recordIntroPaper(run,routeId){
 if(!RECIPES[routeId])return;
 const ex=run.exploration&&typeof run.exploration==='object'&&!Array.isArray(run.exploration)?run.exploration:(run.exploration={});
 if(!Array.isArray(ex.papers))ex.papers=[];
 if(!ex.papers.includes(routeId))ex.papers.push(routeId);
 ex.revealed=true;
}
export function completeRun(state,reflection){
  const run=state.current;if(!run.analysisReviewed)throw Error('请先检查分析数据状态。');
  for(const k of ['conclusion','limitation','next'])if(typeof reflection[k]!=='string'||reflection[k].trim().length<8)throw Error('请分别填写结论、证据局限和下一步，每项至少8个字。');
  run.reflection=copy(reflection);run.completed=true;log(run,'保存练习记录','未生成真实观测或成绩。');
  const snapshot={...copy(run),id:`${run.id}-v${Date.now().toString(36)}`,runId:run.id,savedAt:new Date().toISOString(),quantitative_result:null,teacher_approved:false};
  state.records=[snapshot,...state.records].slice(0,12);return snapshot;
}
export function hydrate(text){
  const s=JSON.parse(text);
  if(s?.version!==1||!s.current||!Array.isArray(s.records)||s.records.length>12)throw Error('记录版本不支持');
  for(const r of [s.current,...s.records]){
    if(!RECIPES[r.route]||!Number.isInteger(r.stage)||r.stage<0||r.stage>5||typeof r.reason!=='string'||!r.plan||!r.materials||!r.reflection||!Array.isArray(r.samples)||!Array.isArray(r.events)||!Array.isArray(r.chat))throw Error('记录损坏');
    if(typeof r.id!=='string'||r.reason.length>2000||Object.keys(freshRun().plan).some(k=>typeof r.plan[k]!=='string'||r.plan[k].length>2000)||['conclusion','limitation','next'].some(k=>typeof r.reflection[k]!=='string'||r.reflection[k].length>2000)||r.events.length>200||r.events.some(x=>!x||typeof x.at!=='string'||typeof x.action!=='string'||typeof x.detail!=='string')||r.chat.some(x=>!x||!['user','assistant'].includes(x.role)||typeof x.content!=='string'))throw Error('记录字段无效');
    if(r.assemblyConfirmed&&(!r.routeConfirmed||!Object.keys(MATERIALS).every(k=>r.materials[k]===RECIPES[r.route][k])))throw Error('装配顺序无效');
    if(r.planConfirmed&&!r.assemblyConfirmed)throw Error('条件顺序无效');
    if(r.operation!=='idle'&&!r.planConfirmed)throw Error('操作顺序无效');
    if(r.analysisReviewed&&r.operation!=='sampled')throw Error('分析顺序无效');
    if(!['idle','checked','mixed','running','ready','sampled'].includes(r.operation))throw Error('状态无效');
    if(r.samples.some(x=>x.observation!==null||x.quantitative_result!==null))throw Error('记录包含不支持的观测');
    if(r.planConfirmed && validatePlan(r.plan))throw Error('方案无效');
    if(!canVisit(r,r.stage))throw Error('步骤顺序无效');
    if(r.operation==='running'){r.operation='mixed';log(r,'刷新中断演练','请重新启动，不推断已完成。');}
    if(r.retroImport!==undefined&&!validImportRecord(r.retroImport))throw Error('逆合成来源记录无效');
    r.chat=r.chat.slice(-30);
    r.learning=hydrateLearning(r.learning);
    if(!r.analysis||typeof r.analysis!=='object'||Array.isArray(r.analysis))r.analysis=freshAnalysis(); // TASK-026: 旧存档补默认分析状态。
    if(r.exploration!==undefined){
      if(!r.exploration||typeof r.exploration!=='object'||Array.isArray(r.exploration))r.exploration=undefined;
      else{
        if(!Number.isInteger(r.exploration.step)||r.exploration.step<1||r.exploration.step>3)delete r.exploration.step;
        if(Array.isArray(r.exploration.papers))r.exploration.papers=r.exploration.papers.filter(id=>RECIPES[id]);else delete r.exploration.papers;
        for(const k of['act1','act2'])if(r.exploration[k]!==undefined&&typeof r.exploration[k]!=='string')delete r.exploration[k];
        if(typeof r.exploration.revealed!=='boolean')delete r.exploration.revealed;
        if(typeof r.exploration.routeChosen!=='boolean')delete r.exploration.routeChosen;
      }
    }
    if(r.aiRequested!==undefined&&typeof r.aiRequested!=='boolean')throw Error('AI请求记录无效');
    if(r.contextRevision!==undefined&&(!Number.isSafeInteger(r.contextRevision)||r.contextRevision<0||r.contextRevision>=Number.MAX_SAFE_INTEGER))throw Error('方案修订记录无效');
    r.aiRequested=hasTutorInteraction(r);
    r.contextRevision??=0;
    // TASK-027 L02 旧存档迁移：无 stage_mode/revision 概念时按默认值迁移，不丢旧答案与题目 ID。
    if(r.stageMode!==undefined&&!STAGE_MODES.includes(r.stageMode))throw Error('阶段模式无效');
    if(r.guidedDone!==undefined&&(!r.guidedDone||typeof r.guidedDone!=='object'||Array.isArray(r.guidedDone)||Object.entries(r.guidedDone).some(([k,v])=>!RECIPES[k]||v!==true)))throw Error('参照练习完成记录无效');
    r.stageMode??='guided'; // 旧存档视为参照练习未完成（guidedDone 默认空）。
    r.guidedDone??={};
  }
  return s;
}
export function exportPayload(state){return {schema:'flavoglycolab.practice.v1',exportedAt:new Date().toISOString(),kind:'student_process_practice',observations:[],quantitative_result:null,teacher_approved:false,current:copy(state.current),records:copy(state.records)};}
export function markdownRecord(run){
  return `# 异槲皮苷实验练习记录\n\n记录：${run.id}\n\n路线：${run.route}\n\n独立依据：${run.reason}\n\n## 学生设计条件（非已测/推荐值）\n\n${Object.entries(run.plan).map(([k,v])=>`- ${k}: ${v}`).join('\n')}\n\n## 操作\n\n${run.events.map(e=>`- ${e.at} ${e.action} ${e.detail}`).join('\n')}\n\n## 分析结果\n\n无对应实验数据。observations=[]；quantitative_result=null；teacher_approved=false。\n\n${run.retroImport?`## 逆合成计算来源\n\n${run.retroImport.packet.selection.source_id} · ${run.retroImport.packet.selection.doi}\n\n计算候选，未独立复算；无实验观测。\n\n运行索引：${run.retroImport.packet.run.id}\n\n`:""}${learningMarkdown(run)}\n## 学生结论\n\n${run.reflection.conclusion}\n\n证据局限：${run.reflection.limitation}\n\n下一步：${run.reflection.next}\n\n## AI 辅导记录\n\n${run.chat.map(m=>`${m.role==='user'?'学生':m.mode==='model'?'模型':'系统'}：${m.content}`).join('\n\n')}\n`;
}
