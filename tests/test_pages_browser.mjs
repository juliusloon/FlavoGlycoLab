import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {freshState,answerIntroAct,recordIntroPaper,confirmRoute} from '../frontend/student/lab-state.js';
import {draftLearning,checkLearning} from '../frontend/student/learning-state.js';
const base=(process.env.FRONTEND_URL||'http://127.0.0.1:8767/').replace(/#.*$/,'');
const out=process.env.QA_OUTPUT||'/tmp/flavoglycolab-pages-qa';
await fs.mkdir(out,{recursive:true});
const content=JSON.parse(await fs.readFile(new URL('../frontend/student/content/demo-content.json',import.meta.url)));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
const results=[],errors=[],warnings=[],externals=[];
function check(name,value){assert.ok(value,name);results.push({name,pass:true});}
const stateKey='flavoglycolab.workbench.v1';
async function identity(page,label){
  check(`${label}: page identity and meaningful content`,(await page.title()).includes('FlavoGlycoLab')&&(await page.locator('main h1').count())>0);
  check(`${label}: shared navigation and no breadcrumb`,await page.locator('.fg-site-nav').count()===1&&await page.locator('[aria-label*="面包屑"],[aria-label*="breadcrumb"],.breadcrumb').count()===0);
  check(`${label}: no horizontal page overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  check(`${label}: shared tokens`,await page.locator('body').evaluate(el=>getComputedStyle(el).fontSize==='14px'&&getComputedStyle(el).backgroundColor==='rgb(246, 248, 248)'));
}
try{
for(const width of [1440,900,390]){
  const context=await browser.newContext({viewport:{width,height:1000}});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(`${width}: ${error.message}`));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(`${width}: ${msg.text()}`);else if(msg.type()==='warning')warnings.push(msg.text());});
  page.on('request',req=>{if(/^https?:/.test(req.url())&&new URL(req.url()).origin!==new URL(base).origin)externals.push(req.url());});
  await page.route('**/api/health',r=>r.fulfill({json:{configured:false}}));
  await page.goto(base);await page.locator('main h1').waitFor();
  await identity(page,`${width}/overview`);await page.screenshot({path:path.join(out,`${width}-overview.png`)});
  await page.locator('.skip-link').evaluate(el=>el.click());
  check(`${width}: skip link focuses content without replacing route`,await page.locator('main').evaluate(el=>el===document.activeElement)&&!page.url().endsWith('#main-content'));
  await page.getByRole('link',{name:'继续当前练习',exact:true}).click();await page.locator('.intro-act[data-act="1"]').waitFor();
  check(`${width}: explicit intro URL`,page.url().endsWith('#/intro/1'));
  await page.locator(`.intro-choice[data-act="1"][data-choice="${content.intro.case.question.answer}"]`).click();
  await page.locator('[data-action="intro-advance"]').click();await page.locator('.intro-act[data-act="2"]').waitFor();
  await page.goBack();await page.locator('.intro-act[data-act="1"]').waitFor();
  await page.goForward();await page.locator('.intro-act[data-act="2"]').waitFor();
  await page.reload();await page.locator('.intro-act[data-act="2"]').waitFor();
  check(`${width}: back, forward and reload preserve intro progress`,await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).current.exploration.step,stateKey)===2);
  await page.locator(`.intro-choice[data-act="2"][data-choice="${content.intro.chemical_limit.question.answer}"]`).click();
  await page.locator('[data-action="intro-advance"]').click();await page.locator('.intro-act[data-act="3"]').waitFor();
  await page.locator('.case-card[data-case="R1"]').click();await page.locator('#evidence-dialog [data-close-dialog]').click();
  await page.locator('main [data-action="begin-quest"]').click();await page.locator('[data-learning-card="01"]').waitFor();
  await page.locator('.learning-form textarea').fill('页面拆分验收：这是保留在当前任务的草稿依据。');
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).current.learning.entries['01'].note,stateKey);
  check(`${width}: task has independent URL`,page.url().endsWith('#/task/01'));
  await page.locator('[data-page-back]').click();await page.locator('.intro-act[data-act="3"]').waitFor();
  await page.goForward();await page.locator('[data-learning-card="01"]').waitFor();
  await page.reload();await page.locator('[data-learning-card="01"]').waitFor();
  check(`${width}: task draft survives back/forward/reload`,await page.locator('.learning-form textarea').inputValue()===saved);
  await identity(page,`${width}/task`);await page.screenshot({path:path.join(out,`${width}-task.png`)});
  await page.locator('#nav-home').click();await page.locator('main h1').waitFor();
  await page.locator('#nav-bench').click();await page.locator('[data-learning-card="01"]').waitFor();
  check(`${width}: global resume restores task and draft`,await page.locator('.learning-form textarea').inputValue()===saved);
  const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).current,stateKey);
  for(const address of ['#/task/24','#/stage/6']){
    await page.goto(base+address);await page.getByRole('heading',{name:'这一页尚未解锁'}).waitFor();
    const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).current,stateKey);
    check(`${width}: ${address} cannot bypass or erase learning`,JSON.stringify(after)===JSON.stringify(before));
    await identity(page,`${width}/${address}`);
  }
  await page.goto(base+'#/bad-address');await page.getByRole('heading',{name:'页面未找到'}).waitFor();
  await page.goto(base+'#/papers?stage=4');await page.locator('.study-matrix').waitFor();
  await page.locator('main [data-compare-route="analysis"]').click();await page.locator('[data-route-analysis]').waitFor();
  check(`${width}: comparison tab in URL`,page.url().endsWith('#/papers?stage=4&tab=analysis'));
  await page.reload();await page.locator('[data-route-analysis]').waitFor();
  await page.locator('[data-page-back]').click();await page.locator('.study-matrix').waitFor();
  const afterPapers=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).current,stateKey);
  check(`${width}: reading other stages does not alter learning`,JSON.stringify(afterPapers)===JSON.stringify(before));
  await identity(page,`${width}/papers`);await page.screenshot({path:path.join(out,`${width}-papers.png`)});
  await page.goto(new URL('case.html',base).href);await page.locator('.case-hero').waitFor();await identity(page,`${width}/case`);
  await page.locator('#nav-data').click();await page.locator('.data-hero').waitFor();
  await page.locator('#data-q').fill('3830');await page.locator('.route-tabs [data-route="R1"]').click();
  check(`${width}: query URL keeps filters`,page.url().includes('q=3830')&&page.url().includes('route=R1'));
  await page.reload();await page.locator('#data-results .data-record').waitFor();
  check(`${width}: query refresh keeps results`,await page.locator('#data-results .data-record').count()===1);
  await page.locator('#nav-records').click();await page.locator('main h1').waitFor();
  await page.locator('#settings-button').click();await page.locator('#settings-dialog a[href="#/records"]').click();
  check(`${width}: settings navigation closes its dialog`,await page.locator('#settings-dialog').isVisible()===false);
  await page.locator('[data-page-back]').click();await page.locator('.data-hero').waitFor();
  check(`${width}: cross-document back restores filtered query`,await page.locator('#data-q').inputValue()==='3830');
  await identity(page,`${width}/data`);await page.screenshot({path:path.join(out,`${width}-data.png`)});
  await page.goto(new URL('components.html',base).href);await page.locator('#controls').waitFor();await identity(page,`${width}/components`);
  await page.locator('[data-action="demo-action"]').click();check(`${width}: example button works`,await page.locator('#demo-feedback').textContent()==='示例操作已完成。');
  await page.locator('[data-action="demo-dialog"]').click();check(`${width}: dialog opens`,await page.locator('dialog').isVisible());await page.keyboard.press('Escape');
  check(`${width}: dialog closes and focus returns`,await page.locator('dialog').isVisible()===false&&await page.locator('[data-action="demo-dialog"]').evaluate(el=>el===document.activeElement));
  await page.locator('#demo-form input').fill('调用示例');await page.locator('#demo-form select').selectOption({label:'主辅两列'});await page.locator('#demo-form button').click();
  check(`${width}: component form provides real feedback`,(await page.locator('#demo-feedback').textContent()).includes('主辅两列'));
  await page.screenshot({path:path.join(out,`${width}-components.png`)});
  const sample=freshState();answerIntroAct(sample.current,1,content.intro.case.question.answer,true);answerIntroAct(sample.current,2,content.intro.chemical_limit.question.answer,true);recordIntroPaper(sample.current,'R1');
  for(const t of content.learning.steps.filter(t=>t.stage===0)){if(t.choices.length)draftLearning(sample.current,t.id,'choice',t.route_answers?.R1??t.answer);draftLearning(sample.current,t.id,'note','根据来源对照底物、催化体系与供体，保留证据边界。');checkLearning(sample.current,t);}
  confirmRoute(sample.current,'根据已完成的主线比较选择路线，等待教师复核。');
  await page.evaluate(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:stateKey,value:sample});
  await page.goto(base+'#/stage/2');await page.locator('#assembly-form,.material-shelf').first().waitFor();
  await identity(page,`${width}/stage2`);await page.screenshot({path:path.join(out,`${width}-stage2.png`)});
  await page.goto(base+'#/task/05');await page.locator('[data-learning-card="05"]').waitFor();
  check(`${width}: unlocked later-stage task reloads independently`,page.url().endsWith('#/task/05'));
  await context.close();
}
check('no application console/page errors',errors.length===0);check('no external runtime requests',externals.length===0);
}finally{await fs.writeFile(path.join(out,'results.json'),JSON.stringify({results,errors,warnings,externals},null,2));await browser.close();}
console.log(JSON.stringify({passed:results.length,errors:errors.length,warnings:warnings.length,externals:externals.length,output:out}));
