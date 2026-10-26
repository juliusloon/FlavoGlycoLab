import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {freshState,answerIntroAct,recordIntroPaper,selectRoute,confirmRoute} from '../frontend/student/lab-state.js';
import {draftLearning,checkLearning} from '../frontend/student/learning-state.js';
const base=(process.env.FRONTEND_URL||'http://127.0.0.1:8767/').replace(/#.*$/,'');
const out=process.env.QA_OUTPUT||'/tmp/flavoglycolab-pages-qa';
await fs.mkdir(out,{recursive:true});
const content=JSON.parse(await fs.readFile(new URL('../frontend/student/content/demo-content.json',import.meta.url)));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
const results=[],errors=[],warnings=[],externals=[];
function check(name,value){assert.ok(value,name);results.push({name,pass:true});}
const stateKey='flavoglycolab.workbench.v1';
async function currentPage(page,label,active){
  const current=page.locator('[data-site-page][aria-current="page"]');
  const linked=active&&active!=='bench';
  check(`${label}: current site entry matches the available destination`,await current.count()===(linked?1:0));
  if(linked)check(`${label}: current entry is ${active}`,await current.first().getAttribute('data-site-page')===active);
}
async function identity(page,label,active){
  check(`${label}: page identity and meaningful content`,(await page.title()).includes('FlavoGlycoLab')&&(await page.locator('main h1').count())>0);
  check(`${label}: no top site header and one bottom control bar`,await page.locator('[data-site-header],.fg-site-header').count()===0&&await page.locator('.fg-site-controls').count()===1&&await page.locator('.fg-site-controls').evaluate(el=>getComputedStyle(el).position==='fixed'&&el.getBoundingClientRect().left===16&&el.getBoundingClientRect().bottom<=innerHeight-15));
  check(`${label}: title and more replace the old navigation row`,await page.locator('.fg-site-controls > #nav-home').count()===1&&await page.locator('.fg-site-controls > #workspace-more').count()===1&&await page.locator('.fg-site-nav,[aria-label*="面包屑"],[aria-label*="breadcrumb"],.breadcrumb').count()===0);
  check(`${label}: more is an accessible icon-only button`,await page.locator('#workspace-more').evaluate(el=>el.textContent===''&&el.getAttribute('aria-label')==='更多'&&el.querySelectorAll('svg.icon[aria-hidden="true"]').length===1));
  check(`${label}: page header omits redundant lead and development kicker`,await page.locator('main .hero-kicker,main .section-kicker,main .fg-page-header>div>p,main .hero-lead').count()===0);
  check(`${label}: the upward menu has exactly the three requested actions`,await page.locator('#workspace-menu [role="menuitem"]').allTextContents().then(labels=>labels.map(s=>s.trim()).join(',')==='开启新实验,实验记录,设置'));
  check(`${label}: one synchronously mounted settings dialog`,await page.locator('#settings-dialog').count()===1);
  check(`${label}: review and source status remains available in settings`,await page.locator('#settings-dialog .fg-evidence-info').count()===1&&(await page.locator('#settings-dialog .fg-evidence-info').textContent()).includes('待教师审定'));
  check(`${label}: AI and retro import remain outside the bottom control bar`,await page.locator('.fg-site-controls #tutor-launcher,.fg-site-controls #retro-import-button').count()===0);
  check(`${label}: no horizontal page overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  check(`${label}: shared tokens`,await page.locator('body').evaluate(el=>getComputedStyle(el).fontSize==='14px'&&getComputedStyle(el).backgroundColor==='rgb(246, 248, 248)'));
  await currentPage(page,label,active);
  if(page.viewportSize().width===375){
    for(const selector of ['#nav-home','#workspace-more']){
      check(`${label}: ${selector} is reachable at 375px`,await page.locator(selector).isVisible()&&await page.locator(selector).evaluate(el=>{const box=el.getBoundingClientRect();return box.left>=0&&box.right<=innerWidth;}));
    }
  }
  const launcher=page.locator('#tutor-launcher');
  if(await launcher.count()){
    check(`${label}: AI launcher is a fixed body-level control`,await launcher.evaluate(el=>el.parentElement===document.body&&!el.closest('header')&&getComputedStyle(el).position==='fixed'));
    check(`${label}: AI launcher keeps its icon and accessible controls`,await launcher.getAttribute('aria-label')==='AI 实验导师'&&await launcher.getAttribute('aria-controls')==='tutor-panel'&&await launcher.locator('svg.icon[aria-hidden="true"]').count()===1);
    check(`${label}: AI launcher is an icon with an accessible name`,await launcher.textContent()===''&&await launcher.evaluate(el=>el.getBoundingClientRect().width===48&&el.getBoundingClientRect().height===48));
  }
}
async function openSettings(page,label,{workbench=false}={}){
  await page.locator('#workspace-more').click();
  await page.locator('#settings-button').click();
  const dialog=page.locator('#settings-dialog');
  check(`${label}: settings opens as the only shared dialog`,await dialog.count()===1&&await dialog.isVisible());
  check(`${label}: workbench-only settings stay scoped`,await dialog.locator('#reduce-motion').count()===(workbench?1:0)&&await dialog.locator('#retro-import-button').count()===(workbench?1:0)&&await dialog.locator('[data-action="replay-intro"]').count()===(workbench?1:0));
  const details=dialog.locator('details:has(.fg-developer-links)');
  if(!await details.evaluate(el=>el.open))await details.locator('summary').click();
  check(`${label}: developer disclosure exposes four site pages`,await details.evaluate(el=>el.open)&&await details.locator('summary').textContent()==='开发者模式'&&await details.locator('[data-site-page]').evaluateAll(links=>links.map(link=>link.dataset.sitePage).join(',')==='papers,case,data,components'));
  return dialog;
}
async function escapeSettings(page,label){
  await page.keyboard.press('Escape');
  check(`${label}: Escape closes settings and restores focus to more`,await page.locator('#settings-dialog').isVisible()===false&&await page.locator('#workspace-more').evaluate(el=>el===document.activeElement));
}
async function retroSettings(page,label){
  for(const close of ['Escape','button']){
    await openSettings(page,`${label}/${close}`,{workbench:true});
    await page.locator('#retro-import-button').click();
    check(`${label}/${close}: import replaces settings as the only modal`,await page.locator('dialog[open]').evaluateAll(dialogs=>dialogs.length===1&&dialogs[0].id==='retro-import-dialog'));
    if(close==='Escape')await page.keyboard.press('Escape');
    else await page.locator('#retro-import-dialog [data-retro-close]').click();
    check(`${label}/${close}: closing import returns focus to visible more opener`,await page.locator('dialog[open]').count()===0&&await page.locator('#workspace-more').evaluate(el=>el===document.activeElement&&el.getBoundingClientRect().width>0));
  }
}
async function workspaceMenuChecks(page,label){
  const more=page.locator('#workspace-more'),menu=page.locator('#workspace-menu'),items=menu.locator('[role="menuitem"]');
  await more.click();await menu.waitFor();
  check(`${label}: menu expands above the fixed title bar`,await menu.evaluate(el=>el.getBoundingClientRect().bottom<=document.querySelector('.fg-site-controls').getBoundingClientRect().top-4));
  if(await menu.locator('#save-status').count())check(`${label}: save status is readable inside the menu on every viewport`,await menu.locator('#save-status').isVisible());
  await page.locator('main h1').first().click();
  check(`${label}: outside click dismisses menu`,await menu.isVisible()===false);
  await more.focus();await more.press('ArrowDown');
  check(`${label}: down arrow opens and focuses first action`,await items.first().evaluate(el=>el===document.activeElement));
  await page.keyboard.press('End');
  check(`${label}: End focuses settings`,await page.locator('#settings-button').evaluate(el=>el===document.activeElement));
  await page.keyboard.press('ArrowDown');
  check(`${label}: menu navigation wraps`,await items.first().evaluate(el=>el===document.activeElement));
  await page.keyboard.press('Escape');
  check(`${label}: Escape closes menu and restores more`,await menu.isVisible()===false&&await more.evaluate(el=>el===document.activeElement));
  await more.press('ArrowUp');await page.keyboard.press('Enter');
  check(`${label}: keyboard activates settings without leaving a menu behind`,await page.locator('#settings-dialog').isVisible()&&await menu.isVisible()===false);
  await escapeSettings(page,label+'/keyboard');
}
async function sidebarChecks(page,label,width){
  await page.waitForFunction(()=>Boolean(document.querySelector('#molecule-viewer canvas,#molecule-viewer .molecule-fallback img')));
  const before=await page.evaluate(key=>{window.sidebarViewerBefore=document.querySelector('#molecule-viewer');return localStorage.getItem(key);},stateKey);
  const quests=page.locator('[data-toggle-sidebar="quests"]'),workflowToggle=page.locator('[data-toggle-sidebar="workflow"]');
  check(`${label}: workflow has no independent collapse button`,await workflowToggle.count()===0);
  check(`${label}: quest control owns both content regions`,(await quests.getAttribute('aria-controls'))==='quest-panel-content workflow-content');
  await quests.click();
  check(`${label}: one action collapses both sections`,await page.locator('#quest-panel-content').isVisible()===false&&await page.locator('#workflow-content').isVisible()===false&&await quests.getAttribute('aria-expanded')==='false'&&await page.locator('.workspace.sidebar-collapsed').count()===1);
  check(`${label}: compact sidebar keeps two square entries and hides workflow and more`,await page.locator('#quest-panel,.fg-site-controls').evaluateAll(items=>items.length===2&&items.every(el=>{const r=el.getBoundingClientRect();return r.width===56&&r.height===56;}))&&await page.locator('#workflow').isVisible()===false&&await page.locator('#workspace-more').isVisible()===false);
  check(`${label}: unified preference is persisted`,await page.evaluate(()=>JSON.parse(localStorage.getItem('flavoglycolab.sidebar.v1')).collapsed===true));
  if(width>760)check(`${label}: compact sidebar releases canvas width`,await page.locator('.workspace').evaluate(el=>Math.abs(parseFloat(getComputedStyle(el).gridTemplateColumns)-56)<1));
  check(`${label}: presentation changes do not save learning or replace the viewer`,await page.evaluate(({key,before})=>localStorage.getItem(key)===before&&document.querySelector('#molecule-viewer')===window.sidebarViewerBefore,{key:stateKey,before}));
  await page.reload();await page.locator('.intro-act[data-act="1"]').waitFor();
  check(`${label}: collapsed preference survives reload for both sections`,await page.locator('.workspace.sidebar-collapsed').count()===1&&await quests.getAttribute('aria-expanded')==='false'&&await page.locator('#quest-panel-content').isVisible()===false&&await page.locator('#workflow-content').isVisible()===false);
  await quests.click();
  check(`${label}: one action restores both sections and more`,await page.locator('#quest-panel-content').isVisible()&&await page.locator('#workflow-content').isVisible()&&await page.locator('#workflow').isVisible()&&await quests.getAttribute('aria-expanded')==='true'&&await page.locator('.workspace.sidebar-collapsed').count()===0&&await page.locator('#workspace-more').isVisible());
}
try{
for(const width of [1440,900,375]){
  const context=await browser.newContext({viewport:{width,height:width===375?812:1000}});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(`${width}: ${error.message}`));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(`${width}: ${msg.text()}`);else if(msg.type()==='warning')warnings.push(msg.text());});
  page.on('request',req=>{if(/^https?:/.test(req.url())&&new URL(req.url()).origin!==new URL(base).origin)externals.push(req.url());});
  await page.route('**/api/health',r=>r.fulfill({json:{configured:false}}));
  await page.goto(base);await page.locator('main h1').waitFor();
  await identity(page,`${width}/overview`,'home');
  await workspaceMenuChecks(page,`${width}/overview/menu`);
  check(`${width}: overview uses its reading class and drops developer cards`,await page.locator('.workspace.fg-reading-page').count()===1&&await page.locator('main .fg-resource').count()===0&&await page.getByRole('heading',{name:'资料与证据'}).count()===0);
  await openSettings(page,`${width}/overview`,{workbench:true});await escapeSettings(page,`${width}/overview`);
  await retroSettings(page,`${width}/overview/retro`);
  await page.screenshot({path:path.join(out,`${width}-overview.png`)});
  await page.locator('.skip-link').evaluate(el=>el.click());
  check(`${width}: skip link focuses content without replacing route`,await page.locator('main').evaluate(el=>el===document.activeElement)&&!page.url().endsWith('#main-content'));
  await page.getByRole('link',{name:'继续当前练习',exact:true}).click();await page.locator('.intro-act[data-act="1"]').waitFor();
  check(`${width}: explicit intro URL`,page.url().endsWith('#/intro/1'));
  await sidebarChecks(page,`${width}/intro/sidebar`,width);
  check(`${width}: intro has no repeated return or local task navigation`,await page.locator('main [data-page-back],main > .fg-local-nav').count()===0&&await page.locator('.workspace.fg-reading-page').count()===0);
  await page.locator(`.intro-choice[data-act="1"][data-choice="${content.intro.case.question.answer}"]`).click();
  await page.locator('[data-action="intro-advance"]').click();await page.locator('.intro-act[data-act="2"]').waitFor();
  await page.goBack();await page.locator('.intro-act[data-act="1"]').waitFor();
  await page.goForward();await page.locator('.intro-act[data-act="2"]').waitFor();
  await page.reload();await page.locator('.intro-act[data-act="2"]').waitFor();
  check(`${width}: back, forward and reload preserve intro progress`,await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).current.exploration.step,stateKey)===2);
  await page.locator(`.intro-choice[data-act="2"][data-choice="${content.intro.chemical_limit.question.answer}"]`).click();
  await page.locator('[data-action="intro-advance"]').click();await page.locator('.intro-act[data-act="3"]').waitFor();
  check(`${width}: overview unlocks tasks without opening a paper`,await page.locator('main [data-action="begin-quest"]').isEnabled()&&await page.locator('main .experiment-flow li').count()===6);
  await page.locator('main [data-action="begin-quest"]').click();await page.locator('[data-learning-card="01"]').waitFor();
  check(`${width}: task has no repeated return or local task navigation`,await page.locator('main [data-page-back],main > .fg-local-nav').count()===0);
  await page.locator('.learning-form textarea').fill('页面拆分验收：这是保留在当前任务的草稿依据。');
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).current.learning.entries['01'].note,stateKey);
  check(`${width}: task has independent URL`,page.url().endsWith('#/task/01'));
  await page.goBack();await page.locator('.intro-act[data-act="3"]').waitFor();
  await page.goForward();await page.locator('[data-learning-card="01"]').waitFor();
  await page.reload();await page.locator('[data-learning-card="01"]').waitFor();
  check(`${width}: task draft survives back/forward/reload`,await page.locator('.learning-form textarea').inputValue()===saved);
  await identity(page,`${width}/task`,'bench');await page.screenshot({path:path.join(out,`${width}-task.png`)});
  await page.locator('#nav-home').click();await page.locator('.workspace.fg-reading-page').waitFor();
  await page.getByRole('link',{name:'继续当前练习',exact:true}).click();await page.locator('[data-learning-card="01"]').waitFor();
  check(`${width}: global resume restores task and draft`,await page.locator('.learning-form textarea').inputValue()===saved);
  const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).current,stateKey);
  for(const address of ['#/task/24','#/stage/6']){
    await page.goto(base+address);await page.getByRole('heading',{name:'这一页尚未解锁'}).waitFor();
    const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).current,stateKey);
    check(`${width}: ${address} cannot bypass or erase learning`,JSON.stringify(after)===JSON.stringify(before));
    await identity(page,`${width}/${address}`,null);
  }
  await page.goto(base+'#/bad-address');await page.getByRole('heading',{name:'页面未找到'}).waitFor();
  await openSettings(page,`${width}/unknown`,{workbench:true});
  await page.locator('#settings-dialog [data-site-page="papers"]').click();await page.locator('.study-matrix').waitFor();
  check(`${width}: settings developer link closes and opens papers`,page.url().endsWith('#/papers')&&await page.locator('#settings-dialog').isVisible()===false);
  await page.goto(base+'#/papers?stage=4');await page.locator('.study-matrix').waitFor();
  await page.locator('main [data-compare-route="analysis"]').click();await page.locator('[data-route-analysis]').waitFor();
  check(`${width}: comparison tab in URL`,page.url().endsWith('#/papers?stage=4&tab=analysis'));
  await page.reload();await page.locator('[data-route-analysis]').waitFor();
  await page.locator('[data-page-back]').click();await page.locator('.study-matrix').waitFor();
  const afterPapers=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).current,stateKey);
  check(`${width}: reading other stages does not alter learning`,JSON.stringify(afterPapers)===JSON.stringify(before));
  await identity(page,`${width}/papers`,'papers');await page.screenshot({path:path.join(out,`${width}-papers.png`)});
  await page.goto(new URL('case.html',base).href);await page.locator('.case-hero').waitFor();await identity(page,`${width}/case`,'case');
  await openSettings(page,`${width}/case`);await page.locator('#settings-dialog [data-site-page="data"]').click();await page.locator('.data-hero').waitFor();
  await identity(page,`${width}/data`,'data');
  await page.locator('#data-q').fill('3830');await page.locator('.route-tabs [data-route="R1"]').click();
  check(`${width}: query URL keeps filters`,page.url().includes('q=3830')&&page.url().includes('route=R1'));
  await page.reload();await page.locator('#data-results .data-record').waitFor();
  check(`${width}: query refresh keeps results`,await page.locator('#data-results .data-record').count()===1);
  await page.locator('#workspace-more').click();await page.locator('#nav-records').click();await page.locator('main h1').waitFor();await identity(page,`${width}/records`,'records');
  await openSettings(page,`${width}/records`,{workbench:true});await escapeSettings(page,`${width}/records`);
  await page.locator('[data-page-back]').click();await page.locator('.data-hero').waitFor();
  check(`${width}: cross-document back restores filtered query`,await page.locator('#data-q').inputValue()==='3830');
  await identity(page,`${width}/data`,'data');await page.screenshot({path:path.join(out,`${width}-data.png`)});
  await openSettings(page,`${width}/data`);await page.locator('#settings-dialog [data-site-page="components"]').click();await page.locator('#controls').waitFor();
  await identity(page,`${width}/components`,'components');
  check(`${width}: component guidance drops retired fixed widths and dual-row header`,!/1180px|248px|双行页头/.test(await page.locator('#layout').textContent()));
  await openSettings(page,`${width}/components`);await escapeSettings(page,`${width}/components`);
  await page.locator('[data-action="demo-action"]').click();check(`${width}: example button works`,await page.locator('#demo-feedback').textContent()==='示例操作已完成。');
  await page.locator('[data-action="demo-dialog"]').click();check(`${width}: demo dialog opens`,await page.locator('.fg-demo-dialog').isVisible());await page.keyboard.press('Escape');
  check(`${width}: demo dialog closes and focus returns`,await page.locator('.fg-demo-dialog').isVisible()===false&&await page.locator('[data-action="demo-dialog"]').evaluate(el=>el===document.activeElement));
  await page.locator('#demo-form input').fill('调用示例');await page.locator('#demo-form select').selectOption({label:'主辅两列'});await page.locator('#demo-form button').click();
  check(`${width}: component form provides real feedback`,(await page.locator('#demo-feedback').textContent()).includes('主辅两列'));
  await page.screenshot({path:path.join(out,`${width}-components.png`)});
  const sample=freshState();answerIntroAct(sample.current,1,content.intro.case.question.answer,true);answerIntroAct(sample.current,2,content.intro.chemical_limit.question.answer,true);recordIntroPaper(sample.current,'R1');
  for(const t of content.learning.steps.filter(t=>t.stage===0)){if(t.id==='04')selectRoute(sample.current,'R1');if(t.choices.length)draftLearning(sample.current,t.id,'choice',t.route_answers?.R1??t.answer);draftLearning(sample.current,t.id,'note','根据来源对照底物、催化体系与供体，保留证据边界。');checkLearning(sample.current,t);}
  confirmRoute(sample.current,'根据已完成的主线比较选择路线，等待教师复核。');
  await page.evaluate(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:stateKey,value:sample});
  await page.goto(base+'#/stage/2');await page.locator('#assembly-form,.material-shelf').first().waitFor();
  await identity(page,`${width}/stage2`,'bench');
  check(`${width}: stage has no repeated return or local task navigation`,await page.locator('main [data-page-back],main > .fg-local-nav').count()===0);
  await page.screenshot({path:path.join(out,`${width}-stage2.png`)});
  await page.goto(base+'#/task/05');await page.locator('[data-learning-card="05"]').waitFor();
  check(`${width}: unlocked later-stage task reloads independently`,page.url().endsWith('#/task/05')&&await page.locator('main [data-page-back],main > .fg-local-nav').count()===0);
  await context.close();
}
check('no application console/page errors',errors.length===0);check('no external runtime requests',externals.length===0);
}finally{await fs.writeFile(path.join(out,'results.json'),JSON.stringify({results,errors,warnings,externals},null,2));await browser.close();}
console.log(JSON.stringify({passed:results.length,errors:errors.length,warnings:warnings.length,externals:externals.length,output:out}));
