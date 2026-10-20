import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url=process.env.FRONTEND_URL||'http://127.0.0.1:8767/';
const liveAI=process.env.FLAVOGLYCOLAB_LIVE_AI==='1';
const brand=process.env.BROWSER_LABEL||'Chromium';
const recording=process.env.QA_RECORD_VIDEO==='1';
const out=path.resolve(process.env.QA_OUTPUT||'temp/qa/browser');await fs.mkdir(out,{recursive:true});
const slowMo=Number(process.env.QA_SLOW_MO_MS||(recording?'120':'0'));
const browser=await chromium.launch({headless:true,slowMo,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
const results=[],errors=[],externals=[],sessions=[];
function ok(name,value=true){assert.ok(value,name);results.push({name,pass:true});}
const readState=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('flavoglycolab.workbench.v1')));
async function noOverflow(page,name){ok(name,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1&&[...document.querySelectorAll('main,.tutor,.workflow')].filter(x=>getComputedStyle(x).display!=='none').every(x=>x.scrollWidth<=x.clientWidth+1)));}
async function screen(page,name){await page.screenshot({path:path.join(out,name+'.png'),fullPage:false});}
async function fillPlan(page){for(const [k,v] of Object.entries({volume:'2',concentration:'1.5',temperature:'30',ph:'7',duration:'60',samples:'0,30,60',hypothesis:'比较催化体系和对照组，检验产物信号是否有差异'}))await page.locator(`[name="${k}"]`).fill(v);await page.locator('[name="control"]').selectOption('both');}
try{
 for(const [width,height,route] of [[1536,1024,'R1'],[768,1024,'R3'],[375,812,'R2']]){
  const context=await browser.newContext({viewport:{width,height},acceptDownloads:true,...(recording?{recordVideo:{dir:path.join(out,'video'),size:{width,height}}}:{})});const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('request',r=>{if(new URL(r.url()).origin!==new URL(url).origin&&!r.url().startsWith('data:'))externals.push(r.url());});
  await page.goto(url);await page.locator('input[name="route"]').first().waitFor();
  const ua=await page.evaluate(()=>navigator.userAgent);
  if(brand==='Chrome')ok('official Chrome user agent',ua.includes('Chrome/')&&!ua.includes('Edg/'));
  if(brand==='Edge')ok('official Edge user agent',ua.includes('Edg/'));
  sessions.push({route,viewport:{width,height},userAgent:ua,url:page.url(),title:await page.title()});
  await page.waitForFunction(()=>/实时辅导|尚未配置/.test(document.querySelector('#ai-status').textContent));
  if(!liveAI)ok(`${width}: clean clone works without model credentials`,(await page.locator('#ai-status').textContent()).includes('尚未配置'));
  if(!liveAI&&width===1536){
   await page.locator('#question').fill('请检查我的方案');await page.locator('#send-question').click();
   ok('unconfigured tutor explains availability and retains the question',(await page.locator('#ai-error').textContent()).includes('实验台仍可继续操作')&&await page.locator('#question').inputValue()==='请检查我的方案');
   ok('unconfigured tutor never fabricates a model response',await page.locator('.chat-message.assistant').count()===0);
   await page.locator('#question').fill('');
  }
  ok(`${width}: page identity and real workspace`,(await page.title()).includes('案例与路线')&&await page.locator('.top-nav a').count()===2);
  ok(`${width}: locked operation before independent choice`,await page.locator('[data-stage="3"]').isDisabled());
  await noOverflow(page,`${width}: route viewport no overflow`);await screen(page,`${width}-route`);
  await page.locator(`input[name="route"][value="${route}"]`).check();await page.locator('[name="reason"]').fill('我根据原料来源与体系组成选择路线，先比较证据和实验对照。');
  await page.locator('#route-form button[type="submit"]').click();await page.getByRole('heading',{name:'配置反应体系',exact:true}).waitFor();
  await page.locator('#catalyst').selectOption(route==='R1'?'cells':'ugt');await page.locator('[data-kind="catalyst"] button').click();ok(`${width}: wrong material feedback visible`,(await page.locator('#feedback').textContent()).includes('不匹配'));
  const recipes={R1:{substrate:'quercetin',catalyst:'ugt',donor:'regeneration'},R2:{substrate:'rutin',catalyst:'rhamnosidase',donor:'none'},R3:{substrate:'quercetin',catalyst:'cells',donor:'cellular'}};
  for(const [k,v] of Object.entries(recipes[route])){await page.locator('#'+k).selectOption(v);await page.locator(`[data-kind="${k}"] button`).click();}
  ok(`${width}: all route-specific materials assembled`,await page.locator('.material-tag').count()===3);
  await page.locator('#feedback').evaluate(x=>x.hidden=true);await noOverflow(page,`${width}: bench viewport no overflow`);await screen(page,`${width}-bench`);
  if(width===1536&&liveAI){
   await page.locator('#question').fill('根据我已选择的路线和理由，指出我设计对照时应该先考虑的一个问题。');await page.locator('#send-question').click();
   await page.locator('.chat-message.assistant').last().waitFor({timeout:60000});
   ok('real model response is distinct from static guidance',(await readState(page)).current.chat.at(-1).mode==='model');
   await fs.writeFile(path.join(out,'live-ai.json'),JSON.stringify((await readState(page)).current.chat,null,2));
   await screen(page,'1536-bench-ai');
   await page.locator('#question').fill('请估算这个实验的产率是多少');await page.locator('#send-question').click();await page.waitForFunction(()=>document.querySelectorAll('.chat-message.assistant').length===2);
   ok('no-data quantitative request is a labeled evidence guard',(await readState(page)).current.chat.at(-1).mode==='evidence_guard');
  }
  await page.locator('[data-action="assembly"]').click();await fillPlan(page);
  ok(`${width}: dimensional conversion from student input`,(await page.locator('#amount-preview').textContent()).includes('3 μmol'));
  await page.locator('[name="samples"]').fill('0,90');await page.locator('#plan-form button[type="submit"]').click();ok(`${width}: invalid sampling plan blocked`,(await page.locator('#feedback').textContent()).includes('取样时点'));
  await page.locator('[name="samples"]').fill('0,30,60');await page.locator('#feedback').evaluate(x=>x.hidden=true);await noOverflow(page,`${width}: plan viewport no overflow`);await screen(page,`${width}-plan`);
  await page.locator('#plan-form button[type="submit"]').click();await page.reload();await page.getByRole('heading',{name:'操作与取样',exact:true}).waitFor();
  ok(`${width}: reload restores confirmed plan`,(await readState(page)).current.plan.temperature==='30');
  ok(`${width}: cannot sample before preparation`,await page.locator('[data-operate="sample"]').isDisabled());
  for(const a of ['check','mix','start'])await page.locator(`[data-operate="${a}"]`).click();
  await page.waitForFunction(()=>!document.querySelector('[data-operate="sample"]').disabled);await page.locator('[data-operate="sample"]').click();
  ok(`${width}: planned samples have explicit absent outcomes`,(await readState(page)).current.samples.length===9&&(await readState(page)).current.samples.every(s=>s.observation===null&&s.quantitative_result===null));
  await page.locator('#feedback').evaluate(x=>x.hidden=true);await noOverflow(page,`${width}: operation viewport no overflow`);await screen(page,`${width}-operation`);
  await page.locator('[data-action="analysis"]').click();await page.locator('[data-sample="S02-1"]').click();
  ok(`${width}: sample selection and absent data render`,(await page.locator('.analysis-id').textContent()).includes('S02-1')&&await page.getByRole('heading',{name:'无对应实验数据'}).isVisible());
  await noOverflow(page,`${width}: analysis viewport no overflow`);await screen(page,`${width}-analysis`);
  await page.locator('[name="reviewed"]').check();await page.locator('#analysis-form button[type="submit"]').click();
  for(const [k,v] of Object.entries({conclusion:'目前只完成了流程演练，无法得出产率结论。',limitation:'缺少教师审定的真实色谱和标准曲线等证据。',next:'补充对应观测并固定其它条件比较一个变量。'}))await page.locator(`[name="${k}"]`).fill(v);
  await noOverflow(page,`${width}: reflection viewport no overflow`);await screen(page,`${width}-reflection`);await page.locator('#reflection-form button[type="submit"]').click();
  await page.getByRole('heading',{name:'实验记录',exact:true}).waitFor();ok(`${width}: complete practice snapshot saved`,(await readState(page)).records.length===1);
  const dl=page.waitForEvent('download');await page.locator('[data-action="export-json"]').click();const download=await dl;const exported=JSON.parse(await fs.readFile(await download.path(),'utf8'));ok(`${width}: export retains provenance and null outcomes`,exported.quantitative_result===null&&exported.teacher_approved===false&&exported.records.length===1);
  await page.locator('#feedback').evaluate(x=>x.hidden=true);await noOverflow(page,`${width}: records viewport no overflow`);await screen(page,`${width}-records`);
  await page.locator('[data-action="workbench"]').click();await page.locator('[data-stage="2"]').click();await page.locator('[name="temperature"]').fill('31');
  const changed=await readState(page);ok(`${width}: upstream edits invalidate samples and downstream navigation`,changed.current.samples.length===0&&changed.current.planConfirmed===false&&await page.locator('[data-stage="4"]').isDisabled());
  await page.locator('#nav-records').click();
  if(width<=950){await page.locator('.mobile-tutor').click();ok(`${width}: mobile tutor drawer opens`,await page.locator('#question').isVisible());await page.keyboard.press('Escape');ok(`${width}: Escape closes drawer`,await page.locator('.mobile-tutor').getAttribute('aria-expanded')==='false');}
  // Starting over is only exposed on the workflow rail on desktop; use a visible records action on mobile.
  {await page.locator('main [data-action="new"]').click();await page.getByRole('button',{name:'继续当前实验',exact:true}).click();ok('cancel reset keeps current plan',(await readState(page)).current.plan.temperature==='31');await page.locator('main [data-action="new"]').click();await page.getByRole('button',{name:'开始新实验',exact:true}).last().click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('flavoglycolab.workbench.v1')).current.routeConfirmed===false);ok('new experiment keeps saved history',(await readState(page)).records.length===1&&(await readState(page)).current.routeConfirmed===false);await page.locator('#nav-records').click();const id=(await readState(page)).records[0].id;await page.locator('#compare-record').selectOption(id);ok('history comparison shows old student plan',(await page.locator('.comparison').textContent()).includes('30 / 7'));}
  const video=page.video();await context.close();
  if(video)sessions.at(-1).video=await video.path();
 }
 ok('normal user paths have no console/page errors',errors.length===0);ok('browser sends no external requests or credentials',externals.length===0);
 // Explicit failure fixtures are isolated from the normal-console-health denominator.
 const context=await browser.newContext({viewport:{width:1280,height:900}});const page=await context.newPage();
 await page.route('**/api/tutor',r=>r.fulfill({status:502,contentType:'application/json',body:JSON.stringify({error:'模型暂时无法回应，请稍后重试。'})}));
 // Isolated browser fixture exercises the error UI without an upstream dependency.
 await page.route('**/api/health',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({configured:true,model:'failure-ui-fixture'})}));
 await page.goto(url);await page.waitForFunction(()=>document.querySelector('#ai-status').textContent.includes('实时辅导'));await page.locator('#question').fill('请帮我比较路线');await page.locator('#send-question').click();await page.waitForFunction(()=>document.querySelector('#ai-error').textContent.includes('无法回应'));
 ok('model failure retains question and never fabricates an assistant response',await page.locator('#question').inputValue()==='请帮我比较路线'&&await page.locator('.chat-message.assistant').count()===0);
 await page.unroute('**/api/tutor');await page.route('**/content/demo-content.json',r=>r.fulfill({status:503,body:'unavailable'}));await page.reload();await page.getByRole('heading',{name:'实验内容暂时无法加载'}).waitFor();ok('content failure has working recovery control',await page.getByRole('button',{name:'重新加载'}).isVisible());
 await page.unroute('**/content/demo-content.json');await page.getByRole('button',{name:'重新加载'}).click();await page.locator('input[name="route"]').first().waitFor();ok('content retry recovers');
 await page.evaluate(()=>localStorage.setItem('flavoglycolab.workbench.v1','{corrupt'));await page.reload();await page.locator('input[name="route"]').first().waitFor();ok('corrupt record is retained for backup',await page.evaluate(()=>localStorage.getItem('flavoglycolab.workbench.v1'))==='{corrupt');
 await context.close();
 await fs.writeFile(path.join(out,'results.json'),JSON.stringify({url,brand,browser:browser.version(),recording,slow_mo_ms:slowMo,sessions,checks:results.length,results,errors,externals},null,2));console.log(JSON.stringify({url,brand,browser:browser.version(),checks:results.length,pass:true}));
}finally{await browser.close();}
