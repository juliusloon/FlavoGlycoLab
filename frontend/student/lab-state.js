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
export function freshRun(){
  return {id:globalThis.crypto?.randomUUID?.() || `run-${Date.now()}-${Math.random().toString(36).slice(2)}`,stage:0,route:'R1',reason:'',routeConfirmed:false,materials:{},assemblyConfirmed:false,
    plan:{volume:'',concentration:'',temperature:'',ph:'',duration:'',samples:'',control:'',hypothesis:''},planConfirmed:false,
    operation:'idle',samples:[],analysisReviewed:false,reflection:{conclusion:'',limitation:'',next:''},completed:false,events:[],chat:[]};
}
export function freshState(){return {version:1,current:freshRun(),records:[],updatedAt:null};}
export function log(run,action,detail=''){run.events.push({at:new Date().toISOString(),action,detail});run.events=run.events.slice(-200);}
export function clearDownstream(run,from){
  if(from<=0){run.routeConfirmed=false;run.materials={};}
  if(from<=1){run.assemblyConfirmed=false;}
  if(from<=2){run.planConfirmed=false;run.operation='idle';run.samples=[];}
  if(from<=3){run.analysisReviewed=false;}
  run.reflection={conclusion:'',limitation:'',next:''};run.completed=false;
}
export function selectRoute(run,id){
  if(!RECIPES[id])throw Error('请选择已有路线。');
  if(id!==run.route){clearDownstream(run,0);run.plan=freshRun().plan;run.route=id;run.stage=0;run.chat=[];log(run,'更换路线',id);}
}
export function confirmRoute(run,reason){
  if(typeof reason!=='string'||reason.trim().length<8)throw Error('请至少用8个字说明你的路线选择依据。');
  if(run.routeConfirmed && run.reason!==reason.trim())clearDownstream(run,0);
  run.reason=reason.trim().slice(0,2000);run.routeConfirmed=true;run.stage=1;log(run,'确认路线',`${run.route}：${run.reason}`);
}
export function addMaterial(run,kind,id){
  if(!run.routeConfirmed)throw Error('请先确认路线。');
  if(RECIPES[run.route][kind]!==id)throw Error(`这项材料与当前路线摘要不匹配。${RECIPES[run.route].hint}请重新选择。`);
  clearDownstream(run,1);run.materials[kind]=id;log(run,'加入体系',MATERIALS[kind].find(x=>x.id===id).label);
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
export function confirmPlan(run,plan){
  if(!run.assemblyConfirmed)throw Error('请先完成体系装配。');
  const error=validatePlan(plan);if(error)throw Error(error);
  clearDownstream(run,2);run.plan=copy(plan);run.planConfirmed=true;run.stage=3;log(run,'保存实验方案','条件均为学生设计，未核验适用域。');
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
    r.chat=r.chat.slice(-30);
  }
  return s;
}
export function exportPayload(state){return {schema:'flavoglycolab.practice.v1',exportedAt:new Date().toISOString(),kind:'student_process_practice',observations:[],quantitative_result:null,teacher_approved:false,current:copy(state.current),records:copy(state.records)};}
export function markdownRecord(run){
  return `# 异槲皮苷实验练习记录\n\n记录：${run.id}\n\n路线：${run.route}\n\n独立依据：${run.reason}\n\n## 学生设计条件（非已测/推荐值）\n\n${Object.entries(run.plan).map(([k,v])=>`- ${k}: ${v}`).join('\n')}\n\n## 操作\n\n${run.events.map(e=>`- ${e.at} ${e.action} ${e.detail}`).join('\n')}\n\n## 分析结果\n\n无对应实验数据。observations=[]；quantitative_result=null；teacher_approved=false。\n\n## 学生结论\n\n${run.reflection.conclusion}\n\n证据局限：${run.reflection.limitation}\n\n下一步：${run.reflection.next}\n\n## AI 辅导记录\n\n${run.chat.map(m=>`${m.role==='user'?'学生':m.mode==='model'?'模型':'系统'}：${m.content}`).join('\n\n')}\n`;
}
