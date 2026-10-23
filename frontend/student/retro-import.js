import {escapeHTML as e} from './ui.js';
export function validImportRecord(value){
 const p=value?.packet,hash=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
 return !!value&&value.validation==='local_identity_source_and_checksum_match'&&value.upstream_run_independently_verified===false&&value.teacher_approved===false&&Array.isArray(value.observations)&&value.observations.length===0&&value.quantitative_result===null&&
 p?.schema==='flavoretro.lab-handoff.v1'&&['Pei2019','Zhang2015'].includes(p.selection?.source_id)&&['R1','R2'].includes(p.selection?.route_id)&&typeof p.selection?.doi==='string'&&hash(p.selection?.source_sha256)&&
 p.teacher_approved===false&&Array.isArray(p.observations)&&p.observations.length===0&&p.quantitative_result===null&&p.independent_chemical_validation===false&&
 typeof p.target?.smiles==='string'&&typeof p.target?.inchikey==='string'&&typeof p.run?.id==='string'&&/^\d{8}T\d{6}-[a-f0-9]{32}$/.test(p.run.id)&&p.run.execution_source==='live_aizynthfinder_mcts'&&hash(p.run.result_sha256)&&hash(p.run.manifest_sha256)&&
 hash(p.route?.id)&&hash(p.route?.tree_sha256)&&Number.isInteger(p.route?.steps)&&p.route.steps>0&&p.route.steps<=10&&['partial','surrogate'].includes(p.route.closure)&&
 typeof p.witness?.product_smiles==='string'&&Array.isArray(p.witness?.precursor_smiles)&&p.witness.precursor_smiles.every(x=>typeof x==='string')&&Array.isArray(p.literature)&&p.literature.length<=3&&hash(p.packet_sha256);
}
export function importedSourceCard(run,content){
 const value=run.retroImport;if(!validImportRecord(value))return '';
 const back=new URL(globalThis.location?.href||'http://127.0.0.1:8766/');back.port='8767';back.pathname='/';back.search=new URLSearchParams({run:value.packet.run.id}).toString();back.hash='';
 const p=value.packet,s=content.sources.find(s=>s.source_id===p.selection.source_id);
 return `<section class="retro-source-card" aria-label="逆合成来源"><strong>逆合成 → ${e(s?.label||p.selection.source_id)} · ${e(p.selection.route_id)} 开发入口</strong><p>目标结构与本地论文来源匹配。来自 FlavoRetro 的计算候选；原始运行留存于导出端，未在此独立复算。</p><div class="actions"><a class="button secondary" href="${e(back.href)}" target="_blank" rel="noopener">查看原始候选</a><button class="button secondary" data-action="retro-papers">阅读与比较三篇论文</button><button class="button secondary" data-action="retro-export">导出计算来源</button></div><p class="fine-print">计算来源已随本机练习保存 · 未产生实验观测</p></section>`;
}
export function mountRetroImport({content,getRun,attach,onPapers,onExport,onError}){
 const dialog=document.querySelector('#retro-import-dialog'),body=dialog.querySelector('.retro-import-body'),status=dialog.querySelector('[role=status]'),accept=dialog.querySelector('[data-retro-accept]');
 let pending=null,generation=0;
 const close=()=>dialog.close();dialog.querySelector('[data-retro-close]').onclick=close;
 const summary=value=>{
  const p=value.packet;
  body.innerHTML=`<h3>异槲皮苷 · ${e(p.selection.source_id)} 开发入口</h3><p>接收后将来源附到当前草稿。实验路线、已有回答与学习进度由你继续操作。</p><ul>${p.literature.map(x=>`<li>${e(x.source_id)} · ${e(x.role==='main_development'?'体外双酶主开发':x.role==='alternative_synthesis'?'选择性水解备选':'工程菌并行开发')} · ${x.mcts_action?'实际搜索生成的文献转换':'同产物开发参照'}</li>`).join('')}</ul><p>目标与论文匹配通过；交接校验和只核对完整性，不证明上游运行真实性。候选仍需实验验证。</p>`;
 };
 document.querySelector('#retro-import-button').onclick=()=>{generation++;pending=null;accept.hidden=true;body.textContent='选择 FlavoRetro 导出的交接 JSON 文件，核对后附到练习。';status.textContent='';dialog.showModal();};
 async function receive(packet){
  const revision=++generation;
  if(!dialog.open)dialog.showModal();pending=null;accept.hidden=true;status.textContent='正在核对目标与论文…';
  try{
   const response=await fetch('./api/retro-import/validate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(packet)});
   const value=await response.json();if(revision!==generation)return;if(!response.ok||!validImportRecord(value))throw Error(value.error||'交接校验失败。');
   pending=value;summary(value);accept.hidden=false;status.textContent='核对完成，可接收计算来源。';
  }catch(error){if(revision!==generation)return;body.textContent='未接收计算来源，当前草稿保留。';status.textContent=error.message;}
 }
 dialog.querySelector('input[type=file]').onchange=async event=>{
  generation++;pending=null;accept.hidden=true;const file=event.target.files[0];if(!file)return;
  if(file.size>24000){status.textContent='交接包过大。';return;}
  try{await receive(JSON.parse(await file.text()));}catch{pending=null;accept.hidden=true;status.textContent='无法读取交接 JSON。';}
 };
 accept.onclick=()=>{if(!pending)return;attach(pending);pending=null;close();};
 document.addEventListener('click',event=>{const action=event.target.closest('button')?.dataset.action;if(action==='retro-papers')onPapers();if(action==='retro-export'){const value=getRun().retroImport;if(validImportRecord(value))onExport(value.packet);}});
 return {receive};
}
