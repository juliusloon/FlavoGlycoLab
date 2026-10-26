// TASK-059: the four common/decision tasks, notebook and actual first route choice.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {freshState,STORAGE_KEY} from '../frontend/student/lab-state.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const content=JSON.parse(await fs.readFile(new URL('../frontend/student/content/demo-content.json',import.meta.url),'utf8'));
const url=process.env.FRONTEND_URL||'http://127.0.0.1:8781/';
const out=path.resolve(process.env.QA_OUTPUT||'/tmp/flavoglycolab-task-059/case-route');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
const checks=[],errors=[],warnings=[],requests=[];
const ok=(name,value)=>{assert.ok(value,name);checks.push(name);};
const stateOf=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),STORAGE_KEY);
const commonOf=run=>JSON.stringify(Object.fromEntries(['01','02','03'].map(id=>[id,run.learning.entries[id]])));
let active,failure;
async function screen(page,name){await page.screenshot({path:path.join(out,name+'.png'),fullPage:false});}
async function submit(page,id,note){
 const task=content.learning.steps.find(t=>t.id===id),card=page.locator(`[data-learning-card="${id}"]`);
 if(task.choices.length)await card.locator(`input[value="${task.answer}"]`).check();
 await card.locator('[name=note]').fill(note);
 await card.locator('[type=submit]').click();
 await page.waitForFunction(({key,id})=>JSON.parse(localStorage.getItem(key)).current.learning.entries[id]?.eval?.state==='passed',{key:STORAGE_KEY,id});
}
async function clean(page,label){
 ok(label+': no document overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 ok(label+': no error overlay',await page.locator('vite-error-overlay,nextjs-portal').count()===0);
 if(page.viewportSize().width>900&&await page.locator('.task-view>.task-rail').count()){
  const geometry=await page.evaluate(()=>{
   const rail=document.querySelector('.task-rail').getBoundingClientRect(),notebook=document.querySelector('#notebook-launcher').getBoundingClientRect(),tutor=document.querySelector('#tutor-launcher').getBoundingClientRect();
   const style=getComputedStyle(document.querySelector('.task-rail'));
   return {notebookGap:notebook.top-rail.bottom,naturalHeight:style.minHeight==='0px'&&rail.height<=parseFloat(style.maxHeight)+1,launcherGap:tutor.top-notebook.bottom};
  });
  ok(label+': response uses content height and joins the notebook from above',Math.abs(geometry.notebookGap-16)<=1&&geometry.naturalHeight);
  ok(label+': floating launchers keep their gap',Math.abs(geometry.launcherGap-16)<=1);
 }
}
try{
 for(const [width,route]of [[1536,'R1'],[768,'R2'],[390,'R3'],[1536,'R2'],[1536,'R3']]){
  const state=freshState();state.current.exploration={step:3,revealed:true,routeChosen:false};
  const ctx=await browser.newContext({viewport:{width,height:1024}}),page=active=await ctx.newPage();
  page.setDefaultTimeout(12000);page.on('pageerror',err=>errors.push(err.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());if(msg.type()==='warning')warnings.push(msg.text());});
  await page.addInitScript(({key,state})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(state));sessionStorage.setItem('flavoglycolab.narr-page',JSON.stringify({'01-combined':1,'03':2,'04':2}));},{key:STORAGE_KEY,state});
  await page.route('**/api/health',r=>r.fulfill({json:{configured:true}}));
  await page.route('**/api/tutor',r=>{const p=r.request().postDataJSON();requests.push(p);return r.fulfill({json:{mode:'model',evaluation:{eval_id:p.evaluation?.eval_id,pass:true,rubric_hits:[],missing:[],guidance:[],evidence_refs:[]}}});});
  await page.goto(url+'#/task/01');
  await page.waitForFunction(()=>document.querySelector('#ai-status')?.textContent.includes('实时辅导'));
  const prefix=`${width}/${route}`,one=page.locator('[data-learning-card="01"]');
  ok(prefix+': page identity and nonblank',page.url().endsWith('#/task/01')&&(await page.title()).includes('FlavoGlycoLab')&&await one.isVisible());
  ok(prefix+': mission01 has one clear goal page',await one.locator('.narr-page').count()===1&&await one.locator('.narr-pager,#molecule-viewer,.paper-digest').count()===0&&await one.locator('.mission-brief').isVisible());
  ok(prefix+': mission01 does not require route comparison',!/R1|R2|R3|比较点/.test(await one.innerText()));
  ok(prefix+': fresh route empty',(await stateOf(page)).current.route===null);
  await screen(page,`${width}-${route}-01`);await clean(page,prefix+'/01');
  await submit(page,'01','本次以异槲皮苷为目标完成生物催化制备方案设计和流程演练，记录制备过程与产物鉴定结果。');
  await page.locator('.task-actions [data-task="02"]').click();
  const two=page.locator('[data-learning-card="02"]');
  await page.waitForFunction(()=>['ready','2d'].includes(document.querySelector('#molecule-viewer')?.dataset.moleculeState));
  ok(prefix+': five molecule choices',await two.locator('[data-identity]').count()===5);
  for(const i of [0,1,2,3,4,0]){
   await two.locator(`[data-identity="${i}"]`).click();
   await page.waitForFunction(()=>document.querySelector('#identity-detail .structure-source code')?.textContent.length>10);
   ok(prefix+`/02: molecule${i} source and SMILES inside its information card`,await two.locator('#identity-detail .structure-source').count()===1&&await two.locator('.identity-model>.structure-source').count()===0&&(await two.locator('#identity-detail h3').textContent()).includes(content.learning.identities[i].name));
  }
  await two.locator('[data-molecule="highlight"]').click();
  ok(prefix+': sugar highlight works',await two.locator('[data-molecule="highlight"]').getAttribute('aria-pressed')==='true');
  await two.locator('[data-molecule="reset"]').click();
  ok(prefix+': reset works',await two.locator('[data-molecule="highlight"]').getAttribute('aria-pressed')==='false');
  ok(prefix+': model sits below the floating information controls',await two.evaluate(card=>{const info=card.querySelector('.identity-overlay').getBoundingClientRect(),model=card.querySelector('#molecule-viewer').getBoundingClientRect();return model.top>=info.bottom-1&&model.height>=300;}));
  ok(prefix+': molecular learning does not choose a route',(await stateOf(page)).current.route===null);
  await two.locator('.task-title').scrollIntoViewIfNeeded();await screen(page,`${width}-${route}-02`);await clean(page,prefix+'/02');
  await submit(page,'02','芦丁比异槲皮苷多一个末端鼠李糖基；目标保留槲皮素3位的葡萄糖基，不能与4位连接异构体混淆。');
  await page.locator('.task-actions [data-task="03"]').click();
  const three=page.locator('[data-learning-card="03"]');
  ok(prefix+': mission03 only routes reading to notebook',await three.locator('.case-card[data-notebook]').count()===3&&await three.locator('[data-case],.paper-digests').count()===0);
  for(const id of ['Pei2019','Zhang2015','Niu2024']){
   await three.locator(`.case-card[data-notebook="${id}"]`).click();
   const notebook=page.locator('#paper-notebook'),paper=notebook.locator(`#notebook-page-${id}`);
   await paper.waitFor();
   ok(prefix+`/03: ${id} opens its PDF, interpretation and notes`,await paper.locator('.notebook-paper-digest').isVisible()&&await paper.locator('[data-paper-note]').isVisible()&&await paper.locator('.notebook-pdf-content').count()===1);
   await page.locator('#tutor-launcher').click();
   ok(prefix+`/03: ${id} mentor opens from its visible notebook launcher`,await page.locator('#question').isVisible()&&await notebook.isVisible());
   await page.locator('#question').press('Escape');
   ok(prefix+`/03: ${id} mentor closes back to the notebook launcher`,await page.locator('#tutor-launcher').isVisible()&&await page.locator('#tutor-launcher').evaluate(el=>el===document.activeElement)&&await notebook.isVisible());
   await page.locator('#tutor-launcher').click();await page.locator('#close-tutor').click();
   await paper.locator('[data-paper-note]').fill(`阅读${id}，核对原料、催化体系和证据局限。`);
   await notebook.locator('[data-notebook-close]').click();
   ok(prefix+`/03: ${id} reading leaves route empty`,(await stateOf(page)).current.route===null);
  }
  await three.locator('[data-notebook="compare"]').click();
  const notebook=page.locator('#paper-notebook'),comparison=notebook.locator('#notebook-page-compare');
  ok(prefix+': notebook first page systematically compares all routes',await comparison.locator('.notebook-comparison-intro').isVisible()&&await comparison.locator('.matrix-head .study').count()===3&&await comparison.locator('.notebook-condition-comparison tbody tr').count()===content.case_page.comparison.rows.length);
  ok(prefix+': comparison offers no planning selection',await comparison.locator('[data-choose-route]').count()===0);
  await comparison.locator('[data-notebook="Zhang2015"]').click();
  ok(prefix+': overview links to the matching paper tab',await notebook.locator('#notebook-page-Zhang2015').isVisible());
  await notebook.locator('[data-notebook-tab="compare"]').click();await screen(page,`${width}-${route}-notebook`);await clean(page,prefix+'/notebook');
  await notebook.locator('[data-notebook-close]').click();
  await screen(page,`${width}-${route}-03`);
  await submit(page,'03','R1从槲皮素体外加糖，R2从芦丁去掉鼠李糖；R3用工程细胞转化外加槲皮素，需分别核对证据。');
  await page.locator('.task-actions [data-task="04"]').click();
  const four=page.locator('[data-learning-card="04"]'),common=commonOf((await stateOf(page)).current);
  ok(prefix+': decision has no preselected route',await four.locator('[data-route-choice][aria-pressed="true"]').count()===0&&(await stateOf(page)).current.route===null);
  ok(prefix+': planning selection is in the main panel above three paper cards',await four.locator('.task-narrative [data-route-choice]').count()===3&&await four.locator('.task-narrative .case-card[data-notebook]').count()===3&&await four.locator('.task-rail [data-route-choice],.task-rail .case-card').count()===0&&await four.evaluate(card=>card.querySelector('.route-choice-field').getBoundingClientRect().bottom<=card.querySelector('.case-cards').getBoundingClientRect().top));
  ok(prefix+': repeated headings, lists and selection notices are removed',await four.locator('h1').count()===1&&await four.locator('.narr-page-title,.narr-prose,.decision-prompts,.route-empty,.rail-prompt').count()===0&&await four.locator('.route-decision>p').count()===1&&!/选择与依据|作出你的路线选择|请在下方填写依据并提交|先选择规划路线/.test(await four.innerText()));
  ok(prefix+': answer rail asks the question once',await four.locator('.task-rail .answer-reason>span').count()===1&&(await four.locator('.task-rail .answer-reason>span').innerText()).startsWith('为什么选择这条路线？')&&await four.locator('.task-rail .rail-foot').count()===0);
  const note=`选择${route}，结合原料来源与催化体系核对对应文献；仍需核对产物鉴定及完整测量链。`;
  const count=requests.length;await four.locator('[name=note]').fill(note);await four.locator('[type=submit]').click();
  ok(prefix+': submitting without a route is blocked',requests.length===count&&(await stateOf(page)).current.route===null&&await four.isVisible());
  for(const id of [route,route==='R2'?'R3':'R2',route]){
   await four.locator(`[data-choose-route="${id}"]`).click();
   ok(prefix+`/04: choosing ${id} retains common work and rationale`,commonOf((await stateOf(page)).current)===common&&await four.isVisible()&&await four.locator('[name=note]').inputValue()===note&&await page.locator('#route-change-dialog').isVisible()===false);
  }
  await four.locator('.case-card[data-notebook="Zhang2015"]').click();
  await notebook.locator('#notebook-page-Zhang2015').waitFor();
  ok(prefix+': decision paper card opens notebook without changing planning route',(await stateOf(page)).current.route===route);
  await notebook.locator('[data-notebook-close]').click();
  ok(prefix+': reading the paper keeps the answer draft',await four.locator('[name=note]').inputValue()===note);
  await page.reload();await four.waitFor();
  ok(prefix+': draft route and rationale survive refresh',(await stateOf(page)).current.route===route&&await four.locator('[name=note]').inputValue()===note);
  await screen(page,`${width}-${route}-04`);await clean(page,prefix+'/04');
  await submit(page,'04',note);await four.locator('[data-action="stage-workspace"]').click();
  await page.locator('#route-form').waitFor();
  ok(prefix+': summary has one clear start action',await page.locator('#route-form button[type=submit]').count()===1&&await page.locator('[data-action="enter-guided"]').count()===0&&(await page.locator('#route-form').innerText()).includes('配置反应体系'));
  if(width>900)ok(prefix+': decision is to the right of completion',await page.evaluate(()=>document.querySelector('.initial-decision').getBoundingClientRect().left>document.querySelector('.completion-summary').getBoundingClientRect().right));
  await screen(page,`${width}-${route}-summary`);await clean(page,prefix+'/summary');
  await page.locator('#route-form [type=submit]').click();await page.locator('.material-shelf').waitFor();
  ok(prefix+': start enters selected route guided assembly',(await stateOf(page)).current.route===route&&(await stateOf(page)).current.stage===1&&(await stateOf(page)).current.stageMode==='guided');
  await ctx.close();
 }
 ok('no application console or page errors',errors.length===0);
}catch(error){failure={message:error.message,stack:error.stack};if(active&&!active.isClosed())await screen(active,'failure').catch(()=>{});}
finally{await fs.writeFile(path.join(out,'results.json'),JSON.stringify({pass:!failure,checks:checks.length,results:checks,errors,warnings,requests:requests.length,browser:browser.version(),url,...(failure?{failure}:{})},null,2));await browser.close();}
console.log(JSON.stringify({pass:!failure,checks:checks.length,errors,...(failure?{failure:failure.message}:{})}));
if(failure)throw Error(failure.message);
