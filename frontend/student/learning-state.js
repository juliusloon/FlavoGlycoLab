// Practice responses are student records, never observations or formal grades.
// LYW v5: six interfaces with four tasks each; this is sequencing, not grades.
export const LEARNING_STAGES = [0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5];
export const freshLearning = () => ({version:1,entries:{},independent:{}});
// Owner-authorized local workflow override; never a scientific/teacher verdict.
export const isAdminPass = value => typeof value==='string' && value.trim()==='admin7';
export const validAnswer = (value,min=8) => typeof value==='string' && (isAdminPass(value)||value.trim().length>=min);
export function hasTutorInteraction(run){
  return run.aiRequested===true ||
    run.chat?.some(m=>m.role==='user'||m.role==='assistant'&&m.mode==='model')===true ||
    Object.values(run.learning?.entries??{}).some(entry=>entry.aiUsedBefore===true);
}
export function learningStage(id){
  return /^(0[1-9]|1[0-9]|2[0-4])$/.test(id) ? LEARNING_STAGES[Number(id)-1] : -1;
}
export function resetLearning(run,from){
  run.learning ??= freshLearning();
  for(const id of Object.keys(run.learning.entries))if(learningStage(id)>=from)delete run.learning.entries[id];
  if(from===0)run.learning.independent={};
}
export function draftLearning(run,id,field,value){
  if(learningStage(id)!==run.stage||!['choice','note'].includes(field)||typeof value!=='string')throw Error('学习任务输入无效。');
  run.learning ??= freshLearning();
  const entry=run.learning.entries[id] ?? {choice:'',note:'',status:'draft'};
  entry[field]=value.slice(0,field==='note'?2000:20);entry.status='draft';
  delete entry.checkedAt;delete entry.matches;delete entry.feedback;delete entry.eval; // TASK-026: 修改即作废旧评价。
  run.learning.entries[id]=entry;run.completed=false;
}
export function checkLearning(run,task){
  if(!task||learningStage(task.id)!==run.stage||task.stage!==run.stage)throw Error('请在当前阶段核对学习任务。');
  const entry=run.learning?.entries[task.id];
  if(!entry||!validAnswer(entry.note))throw Error('请至少用8个字写出判断依据或需要补充的证据。');
  const override=isAdminPass(entry.note);
  if(!override&&task.choices.length&&!task.choices.some(c=>c.id===entry.choice))throw Error('请先作出选择，再核对依据。');
  const expected=task.route_answers?.[run.route]??task.answer;
  const matches=expected?entry.choice===expected:null;
  // A route change may clear visible chat, but cannot erase prior AI exposure.
  run.aiRequested=hasTutorInteraction(run);
  delete entry.eval; // TASK-026: 新提交清除旧评价，评价闭环将重新发起。
  Object.assign(entry,{status:'recorded',checkedAt:new Date().toISOString(),matches,
    feedback:override?'通行词已放行。':task.feedback,route:run.route,aiUsedBefore:run.aiRequested});
  if(override)entry.eval={state:'passed',pass:true,mode:'admin_override',evaluatedAt:entry.checkedAt};
  if(!override&&['04','09'].includes(task.id)&&!entry.aiUsedBefore&&!run.learning.independent[task.id]){
    run.learning.independent[task.id]={note:entry.note,route:run.route,at:entry.checkedAt};
  }
  run.completed=false;return entry;
}
export function hydrateLearning(value){
  if(value===undefined)return freshLearning(); // Migrate pre-TASK-017 browser records.
  const validText=(v,n)=>typeof v==='string'&&v.length<=n;
  const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
  if(!object(value)||value.version!==1||!object(value.entries)||!object(value.independent)||Object.keys(value).some(k=>!['version','entries','independent'].includes(k)))throw Error('学习记录损坏');
  for(const [id,x] of Object.entries(value.entries)){
    if(learningStage(id)<0||!x||!validText(x.note,2000)||!validText(x.choice,20)||!['draft','recorded'].includes(x.status))throw Error('学习记录字段无效');
    if(x.status==='recorded'&&(!validText(x.feedback,3000)||!validText(x.checkedAt,40)||!['R1','R2','R3'].includes(x.route)||typeof x.aiUsedBefore!=='boolean'||![true,false,null].includes(x.matches)))throw Error('学习核对记录无效');
    // No measured result/grade fields may be restored through this extension.
    // TASK-026: eval 允许 undefined 或带合法 state 的对象；非法形状只丢弃该字段，不丢整条。
    if(x.eval!==undefined&&(!object(x.eval)||!['evaluating','passed','failed','degraded'].includes(x.eval.state)))delete x.eval;
    // A restored browser record has no live request. Keep the answer and allow retry.
    if(x.eval?.state==='evaluating')x.eval={state:'degraded',reason:'interrupted'};
    if(Object.keys(x).some(k=>!['choice','note','status','checkedAt','matches','feedback','route','aiUsedBefore','eval'].includes(k)))throw Error('学习记录包含不支持的字段');
  }
  for(const [id,x] of Object.entries(value.independent)){
    // 05/06 are pre-TASK-020 independent IDs kept only so older local records are not lost.
    if(!['04','05','06','09'].includes(id)||!x||!validText(x.note,2000)||!validText(x.at,40)||!['R1','R2','R3'].includes(x.route)||Object.keys(x).some(k=>!['note','route','at'].includes(k)))throw Error('独立判断记录无效');
  }
  return value;
}
export function learningMarkdown(run){
  const entries=Object.entries(run.learning?.entries??{});
  const independent=Object.entries(run.learning?.independent??{});
  const legacy=independent.some(([id])=>['05','06'].includes(id));
  return `## 学习任务自述\n\n${entries.map(([id,x])=>`### 步骤 ${id} · ${x.status==='recorded'?'已记录':'草稿'}\n\n选择：${x.choice||'短答'}\n\n${x.note}\n\n核对提示：${x.feedback||'尚未核对'}${x.status==='recorded'&&isAdminPass(x.note)?'（admin_override；非AI评价或教师审核）':''}\n`).join('\n')||'尚未填写。'}\n\n## 首次独立判断\n\n${independent.map(([id,x])=>`步骤 ${id} · ${x.route} · ${x.at}\n\n${x.note}`).join('\n\n')||'未记录发起AI请求前的独立提交。'}${legacy?'\n\n*步骤05/06为TASK-020前的旧版编号，仅作历史记录保留，不对应当前24步任务。*':''}\n`;
}
