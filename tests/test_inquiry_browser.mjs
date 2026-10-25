import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url = (process.env.FRONTEND_URL || 'http://127.0.0.1:8767/').replace(/#.*$/, '') + '#/resume';
const liveAI = process.env.FLAVOGLYCOLAB_LIVE_AI === '1';
const brand = process.env.BROWSER_LABEL || 'Chromium';
const recording = process.env.QA_RECORD_VIDEO === '1';
const out = path.resolve(process.env.QA_OUTPUT || 'temp/qa/browser');
const slowMo = Number(process.env.QA_SLOW_MO_MS || (recording ? '120' : '0'));
await fs.mkdir(out, {recursive:true});
const content = JSON.parse(await fs.readFile(new URL('../frontend/student/content/demo-content.json', import.meta.url), 'utf8'));
const lessons = content.learning.steps;
const recipes = {
  R1:{substrate:'quercetin',catalyst:'ugt',donor:'regeneration'},
  R2:{substrate:'rutin',catalyst:'rhamnosidase',donor:'none'},
  R3:{substrate:'quercetin',catalyst:'cells',donor:'cellular'},
};
const browser = await chromium.launch({headless:true,slowMo,...(process.env.CHROMIUM_EXECUTABLE ? {executablePath:process.env.CHROMIUM_EXECUTABLE} : {})});
const results = [], errors = [], warnings = [], externals = [], sessions = [], fixtures = [];
let activePage, failure;
const stateKey = 'flavoglycolab.workbench.v1';
const readState = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)), stateKey);
function ok(name, value = true) { assert.ok(value, name); results.push({name,pass:true}); }
async function screen(page, name) { await page.screenshot({path:path.join(out, name + '.png'),fullPage:false,animations:'disabled'}); }
async function settleHealth(page) {
  await page.waitForFunction(() => /实时辅导|尚未配置|连接不可用/.test(document.querySelector('#ai-status')?.textContent || ''));
}
async function noOverflow(page, name) {
  ok(name, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1 &&
    [...document.querySelectorAll('main,.tutor,.quest-panel,.workflow,dialog[open]')]
      .filter(el => !el.hidden && getComputedStyle(el).display !== 'none')
      .every(el => el.scrollWidth <= el.clientWidth + 1)));
}
async function hideToast(page) { await page.locator('#feedback').evaluate(el => {el.hidden = true;}); }
async function closeEvidence(page) {
  if (await page.locator('#paper-notebook').isVisible()) await page.locator('#paper-notebook [data-notebook-close]').click();
  if (await page.locator('#evidence-dialog').isVisible()) await page.locator('#evidence-dialog [data-close-dialog]').click();
}
async function confirmOptionalRouteChange(page) {
  if (await page.locator('#route-change-dialog').isVisible()) await page.locator('#route-change-dialog [value="confirm"]').click();
}
async function beginTask(page, id) {
  if (await page.locator(`main [data-learning-card="${id}"]`).count()) return;
  const direct = page.locator(`#quest-panel [data-task="${id}"]`).first();
  if (await direct.isVisible() && await direct.isEnabled()) await direct.click();
  else throw new Error(`Task ${id} is not available in the sidebar`);
  await page.locator(`main [data-learning-card="${id}"]`).waitFor();
}
async function saveAnswer(page, task, route, choice) {
  const card = page.locator(`main [data-learning-card="${task.id}"]`);
  const answer = choice ?? task.route_answers?.[route] ?? task.answer;
  if (task.choices.length) await card.locator(`label.answer-option:has(input[name="choice"][value="${answer}"])`).click();
  await card.locator('textarea[name="note"]').fill(`步骤${task.id}的独立判断：核对原料、催化体系与来源证据，缺少样品测量时保留未知。`);
  await card.locator('button[type="submit"]').click();
  await card.locator('.learning-feedback').waitFor();
  return card;
}
async function checkTaskShell(page, task, route, width) {
  const card = page.locator(`main [data-learning-card="${task.id}"]`);
  ok(`${route}/${width}: mission ${task.id} removes duplicate task navigation and development matrix`,
    await card.locator('.task-topline,.task-index,.task-matrix,.task-goal').count() === 0 &&
    !(await card.textContent()).includes('实际任务与来源'));
  ok(`${route}/${width}: mission ${task.id} omits numeric refs and the source/self-check development block`,
    await card.locator('.ref-sup,.task-sources').count() === 0 &&
    !/agent_checked_candidate|observations=|quantitative_result=/.test(await card.innerText()));
  const questText = await page.locator('#quest-panel').textContent();
  ok(`${route}/${width}: mission ${task.id} keeps the full prompt out of the quick navigation`,
    await page.locator('#quest-panel .quest-guidance p').count() === 0 &&
    lessons.every(item => !item.prompt || !questText.includes(item.prompt)));
  ok(`${route}/${width}: mission ${task.id} shows all stage tasks, descriptions, progress and current state without duplicate controls`,
    await page.locator('#quest-panel .quest-list [data-task]').count() === lessons.filter(item => item.stage === task.stage).length &&
    await page.locator('#quest-panel .quest-row small').evaluateAll(items => items.every(item => item.textContent.trim().length > 0 && getComputedStyle(item).display !== 'none')) &&
    await page.locator('#quest-panel .quest-all,.quest-guidance,.quest-cta').count() === 0 &&
    !/当前任务|下一任务|查看全部任务/.test(questText) &&
    await page.locator('#quest-panel progress.quest-progress').count() === 1 &&
    await page.locator('#quest-panel .quest-row.current').count() === 1);
  const titles = await page.evaluate(() => ['#quest-panel .quest-heading h2','#workflow h2'].map(selector => {
    const style = getComputedStyle(document.querySelector(selector));
    return {fontSize:style.fontSize,fontWeight:style.fontWeight};
  }));
  ok(`${route}/${width}: mission ${task.id} aligns both dock headings at 16px/600`,
    titles.every(style => style.fontSize === '16px' && style.fontWeight === '600'));
  const layout = await page.evaluate(() => {
    const workspace = document.querySelector('.workspace');
    const workspaceStyle = getComputedStyle(workspace);
    const task = document.querySelector('.task-workspace');
    const taskView = document.querySelector('.task-view');
    return {workspaceMax:workspaceStyle.maxWidth,taskMax:getComputedStyle(task).maxWidth,
      taskViewMax:getComputedStyle(taskView).maxWidth,columns:workspaceStyle.gridTemplateColumns,
      gutter:parseFloat(workspaceStyle.paddingInlineStart),columnGap:parseFloat(workspaceStyle.columnGap)};
  });
  ok(`${route}/${width}: mission ${task.id} uses a fluid workspace without legacy max widths`,
    layout.workspaceMax === 'none' && layout.taskMax === 'none' && layout.taskViewMax === 'none');
  if (width > 760) {
    const expectedRail = Math.min(336,Math.max(272,width * 0.2));
    ok(`${route}/${width}: mission ${task.id} uses the 16px gutter and responsive 272–336px dock`,
      Math.abs(parseFloat(layout.columns) - expectedRail) < 1 && layout.gutter === 16 && layout.columnGap === 16);
    if(width>900)ok(`${route}/${width}: mission ${task.id} aligns all three panel tops`,await page.evaluate(()=>{
      const tops=['#quest-panel','.task-narrative','.task-rail'].map(q=>document.querySelector(q).getBoundingClientRect().top);return Math.max(...tops)-Math.min(...tops)<=1;
    }));
  }
  ok(`${route}/${width}: mission ${task.id} aligns the response panel with the AI launcher`,await page.evaluate(()=>Math.abs(document.querySelector('.task-rail').getBoundingClientRect().right-document.querySelector('#tutor-launcher').getBoundingClientRect().right)<=1));
}
async function checkPreservedTaskVisual(page, task, route, width) {
  const card = page.locator(`main [data-learning-card="${task.id}"]`);
  if (task.id === '02') ok(`${route}/${width}: D01 combines prose, five identities and the model on one page`,
    await card.locator('.identity-tile').count() === 5 && await card.locator('#identity-detail').count() === 1 &&
    await card.locator('.narr-page').count() === 1 && await card.locator('.narr-prose').isVisible() &&
    await card.locator('#molecule-viewer').isVisible() && await card.locator('.narr-pager').count() === 0);
  if (['03','04'].includes(task.id)) ok(`${route}/${width}: D01 route cards remain intact`,
    await card.locator('.compact.case-cards .case-card').count() === 3);
  if (['05','06','07','10','11','12'].includes(task.id)) ok(`${route}/${width}: D02/D03 route context remains intact for mission ${task.id}`,
    await card.locator('.task-route-context').count() === 1 && await card.locator('.task-route-context [data-action="compare"]').count() === 1);
  if (task.id === '08') ok(`${route}/${width}: D02 evidence ladder remains intact`,
    await card.locator('.evidence-ladder > div').count() === 4);
  if (task.id === '09') ok(`${route}/${width}: D03 hypothesis builder controls remain intact`,
    await card.locator('[data-inquiry-tool="09"] [data-hypothesis-field]').count() === 4 &&
    await card.locator('[data-inquiry-tool="09"] [data-build-hypothesis]').count() === 1);
  if (task.id === '17') ok(`${route}/${width}: evidence sorter controls remain intact`,
    await card.locator('[data-inquiry-tool="17"] [data-evidence-category]').count() === 4);
  if (task.id === '20') ok(`${route}/${width}: evidence chain controls remain intact`,
    await card.locator('[data-inquiry-tool="20"] [data-chain-node]').count() === 4 &&
    await card.locator('[data-inquiry-tool="20"] [data-chain-decision]').count() === 2);
}
async function checkStageReminder(page, stage, route, width) {
  if (stage === 0) return;
  const reminder = page.locator('main .stage-task-reminder');
  const main = page.locator('main .bench-main');
  await reminder.waitFor();
  const geometry = await page.evaluate(() => {
    const reminder = document.querySelector('main .stage-task-reminder');
    const content = document.querySelector('main .bench-main');
    const shell = document.querySelector('main .bench-shell');
    const rail = reminder.closest('.bench-rail');
    return {domBefore:Boolean(reminder.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING),
      visualBefore:reminder.getBoundingClientRect().bottom <= content.getBoundingClientRect().top + 1,
      fullWidth:Math.abs(content.getBoundingClientRect().width - shell.getBoundingClientRect().width) < 2,
      order:rail ? getComputedStyle(rail).order : '0'};
  });
  ok(`${route}/${width}: stage ${stage + 1} reminder precedes the main content in DOM and visual order without CSS reordering`,
    geometry.domBefore && geometry.visualBefore && geometry.fullWidth && geometry.order === '0');
}
async function practiceStage(page, stage, route, width) {
  const tasks = lessons.filter(task => task.stage === stage);
  await beginTask(page, tasks[0].id);
  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    const card = page.locator(`main [data-learning-card="${task.id}"]`);
    await checkTaskShell(page, task, route, width);
    await checkPreservedTaskVisual(page, task, route, width);
    await hideToast(page);
    await noOverflow(page, `${route}/${width}: mission ${task.id} task viewport does not overflow`);
    await screen(page, `${route}-${width}-task-${task.id}`);
    await saveAnswer(page, task, route);
    const entry = (await readState(page)).current.learning.entries[task.id];
    ok(`${route}/${width}: mission ${task.id} records a self-check without a formal grade`,
      entry.status === 'recorded' && entry.grade === undefined &&
      (task.choices.length ? entry.matches === true : entry.matches === null));
    ok(`${route}/${width}: mission ${task.id} feedback distinguishes choice and self-reflection`,
      (await card.locator('.learning-feedback').textContent()).includes(task.choices.length ? '自查通过' : '待复核'));
    if (await card.locator('.eval-panel').count()) {
      ok(`${route}/${width}: mission ${task.id} keeps machine evaluation behind teacher review`,
        (await card.locator('.eval-panel').textContent()).includes('待教师审定'));
    }
    if (tasks[index + 1]) await card.locator(`[data-task="${tasks[index + 1].id}"]`).click();
    else await card.locator('.task-actions [data-action="stage-workspace"]').click();
  }
  await checkStageReminder(page, stage, route, width);
}
async function completeIntro(page, route, width) {
  ok(`${route}/${width}: before answering, only act one renders in the two-zone layout and no locked placeholder remains`,
    await page.locator('main [data-act-question="1"]').isVisible() &&
    await page.locator('main [data-act-question="2"]').count() === 0 &&
    await page.locator('main .act-locked').count() === 0 &&
    await page.locator('main .intro-act[data-act="2"]').count() === 0 &&
    await page.locator('main .intro-act[data-act="3"]').count() === 0);
  const wrongActOne = content.intro.case.question.choices.map(choice => choice.id).find(id => id !== content.intro.case.question.answer);
  await page.locator(`main .intro-choice[data-act="1"][data-choice="${wrongActOne}"]`).click();
  ok(`${route}/${width}: a wrong act-one answer shows concise feedback and stays on step one`,
    await page.locator('main [data-act-question="1"] .intro-feedback.retry').isVisible() &&
    await page.locator('main [data-act-question="2"]').count() === 0 &&
    page.url().endsWith('#/intro/1') &&
    (await page.locator('main .intro-feedback.retry').textContent()) === content.intro.case.question.retry);
  await page.locator(`main .intro-choice[data-act="1"][data-choice="${content.intro.case.question.answer}"]`).click();
  ok(`${route}/${width}: the correct act-one answer shows success feedback and an explicit advance instead of stacking act two`,
    await page.locator('main [data-act-question="1"] .intro-feedback.success').isVisible() &&
    await page.locator('main [data-action="intro-advance"]').isVisible() &&
    await page.locator('main [data-act-question="2"]').count() === 0);
  await page.locator('main [data-action="intro-advance"]').click();
  ok(`${route}/${width}: advancing swaps to act two alone with its question in the side rail`,
    await page.locator('main .intro-act[data-act="2"]').isVisible() &&
    await page.locator('main .intro-act[data-act="1"]').count() === 0 &&
    await page.locator('main [data-act-question="2"]').isVisible());
  ok(`${route}/${width}: act two uses the same clean presentation as act one`,
    await page.locator('main .act-kicker,main .para-refs,main .act-review,main .point-sources').count() === 0);
  await page.locator(`main .intro-choice[data-act="2"][data-choice="${content.intro.chemical_limit.question.answer}"]`).click();
  await page.locator('main [data-action="intro-advance"]').click();
  ok(`${route}/${width}: completing act two reveals three study cards and a six-stage overview without a paper gate`,
    await page.locator('main .case-card').count() === 3 &&
    await page.locator('main [data-action="begin-quest"]').isEnabled() &&
    await page.locator('main .experiment-flow li').count() === 6 &&
    await page.locator('main .gate-hint,main .learning-gate-hint,main [data-action="intro-tutor"]').count() === 0);
  ok(`${route}/${width}: papers remain optional notebook entries`,await page.locator('main .case-card[data-notebook]').count() === 3);

}
const paperSources = {R1:'Pei2019',R2:'Zhang2015',R3:'Niu2024'};
async function paperPanel(page, route, width) {
 const sourceId=paperSources[route],before=JSON.stringify((await readState(page)).current);
 await page.locator(`main [data-notebook="${sourceId}"]`).first().click();
 const dialog=page.locator('#paper-notebook'),panel=dialog.locator(`#notebook-page-${sourceId}`);
 await dialog.waitFor();
 await page.waitForFunction(id=>document.querySelector(`#notebook-page-${id} .notebook-pdf-content`)?.dataset.pdfReady==='true',sourceId);
 ok(`${route}/${width}: paper card opens the corresponding notebook PDF and notes`,await panel.isVisible()&&await panel.locator('textarea[data-paper-note]').count()===1&&await dialog.locator('[role="tab"]').count()===4);
 const head=await page.evaluate(async id=>{const r=await fetch(`./api/paper/${id}`,{method:'HEAD'});return {status:r.status,type:r.headers.get('Content-Type')};},sourceId);
 ok(`${route}/${width}: notebook uses the registered same-origin PDF endpoint`,head.status===200&&head.type==='application/pdf');
 const magic=await page.evaluate(async id=>{const r=await fetch(`./api/paper/${id}`);const b=new Uint8Array(await r.arrayBuffer());return String.fromCharCode(...b.slice(0,5))==='%PDF-';},sourceId);
 ok(`${route}/${width}: notebook streams actual PDF bytes`,magic);
 ok(`${route}/${width}: reading leaves the complete experiment unchanged`,JSON.stringify((await readState(page)).current)===before);
 ok(`${route}/${width}: current paper appears in mentor context`,(await page.locator('#tutor-context').textContent()).includes(content.sources.find(x=>x.source_id===sourceId).label));
 await noOverflow(page,`${route}/${width}: notebook fits viewport`);
 if(width===1536)await screen(page,`${width}-paper-panel`);
 await closeEvidence(page);
}
async function compareStudies(page, stage, route, width) {
  const before = (await readState(page)).current.route;
  if (stage === 0) {await page.locator('#notebook-launcher').click();await page.locator('[data-notebook-tab="compare"]').click();}
  else await page.locator('.stage-evidence-banner [data-action="compare"]').click();
  const dialog = page.locator(stage===0?'#paper-notebook':'#evidence-dialog');
  await dialog.waitFor();
  await dialog.locator('[data-compare-route="all"]').click();
  const dialogText = await dialog.textContent();
  ok(`${route}/${width}: stage ${stage + 1} study dialog omits explanatory copy`,
    !dialogText.includes('围绕当前任务，比较研究方案与证据。') &&
    !dialogText.includes('文献报告与本次实验方案分别记录。') &&
    !dialogText.includes('结论与反思视图区分原文报告') &&
    await dialog.locator('.dialog-footnote').count() === 0);
  ok(`${route}/${width}: stage ${stage + 1} compares all three source-specific studies`,
    await dialog.locator('.study').count() === 3 &&
    (await dialog.textContent()).includes('Pei') && (await dialog.textContent()).includes('Zhang') && (await dialog.textContent()).includes('Niu'));
  ok(`${route}/${width}: stage ${stage + 1} field rows share one leftmost label column`,
    await dialog.locator('.matrix-row[data-field]').count() === 6 &&
    await dialog.locator('.matrix-row[data-field] .matrix-label').count() === 6 &&
    await dialog.locator('.matrix-row[data-field] .matrix-cell').count() === 18);
  for (const cell of await dialog.locator('.matrix-row[data-field] .matrix-cell').all()) {
    ok(`${route}/${width}: stage ${stage + 1} matrix cell has source-anchored content`, Boolean((await cell.textContent()).trim()));
  }
  ok(`${route}/${width}: stage ${stage + 1} keeps per-route source locators`, await dialog.locator('.study-locator').count() === 3);
  ok(`${route}/${width}: stage ${stage + 1} paper and action rows align across three routes`,
    await dialog.locator('.matrix-paper .paper-view').count() === (stage===0?0:3) &&
    await dialog.locator('.matrix-paper [data-open-paper]').count() === (stage===0?0:3) &&
    await dialog.locator('.matrix-choose [data-choose-route]').count() === 0);
  ok(`${route}/${width}: reading papers does not change the planned route`, (await readState(page)).current.route === before);
  await noOverflow(page, `${route}/${width}: stage ${stage + 1} paper dialog does not overflow`);
  if (stage === 0) await screen(page, `${width}-three-studies`);
  await closeEvidence(page);
}
async function compareAnalysis(page, route, width) {
  await page.locator('.stage-evidence-banner [data-action="compare"]').click();
  const dialog = page.locator('#evidence-dialog');
  await dialog.waitFor();
  await dialog.locator('[data-compare-route="analysis"]').click();
  const analysisText = await dialog.textContent();
  ok(`${route}/${width}: route analysis omits explanatory lead and footnote`,
    !analysisText.includes('以下数值来自ZYT') && !analysisText.includes('教学接入稿') &&
    !analysisText.includes('三路线均 pending_teacher_review') &&
    await dialog.locator('.dialog-footnote').count() === 0);
  ok(`${route}/${width}: route analysis renders all fourteen comparison fields`,
    await dialog.locator('.analysis-fields .analysis-table tbody tr').count() === 14);
  ok(`${route}/${width}: route analysis separates four literature-reported values from observations`,
    await dialog.locator('.analysis-reported .analysis-results-table tbody tr').count() === 4 &&
    (await dialog.locator('.analysis-reported').textContent()).includes('原文报告') &&
    (await dialog.locator('.analysis-reported').textContent()).includes('非本次观测'));
  ok(`${route}/${width}: route analysis keeps 21 candidate hits and accessible review status`,
    (await dialog.locator('.analysis-history').textContent()).includes('21') &&
    (await page.locator('#settings-dialog .fg-evidence-info').textContent()).includes('待教师审定'));
  ok(`${route}/${width}: reading route analysis does not change the planned route`,
    (await readState(page)).current.route === route);
  await noOverflow(page, `${route}/${width}: route analysis dialog does not overflow`);
  await screen(page, `${width}-route-analysis`);
  await closeEvidence(page);
}
async function fillPlan(page) {
  // TASK-027 L02 两阶段：参照练习中已被文献锁定（只读预填）的条件不可编辑，保持参照值提交。
  for (const [key,value] of Object.entries({volume:'2',concentration:'1.5',temperature:'30',ph:'7',duration:'60',samples:'0,30,60',hypothesis:'固定其它条件比较催化体系与阴性对照，检查有无可测的产物信号'})) {
    const input = page.locator(`#plan-form [name="${key}"]`);
    if (await input.count() && await input.getAttribute('readonly') === null) await input.fill(value);
  }
  const control = page.locator('#plan-form select[name="control"]');
  if (await control.count()) await control.selectOption('both');
}
async function verifyWrongAnswer(page, route, width) {
  await beginTask(page, '01');
  const card01 = page.locator('main [data-learning-card="01"]');
  const guide = card01.locator('.task-rail .rail-guide');
  const guideAngleText = await guide.locator('.guidance-angles').textContent();
  ok(`${route}/${width}: mission 01 shows one right-rail guide with three observations, comparison angles and its hint`,
    await page.locator('.rail-guide').count() === 1 && await guide.locator('ol li').count() === 3 &&
    await guide.locator('.angle-chip').count() === 0 && ['R1 体外加糖','R2 选择性去糖','R3 全细胞转化'].every(text=>(guideAngleText.includes(text))) && (await guide.textContent()).includes(lessons[0].hint) &&
    await card01.locator('.task-example').count() === 0);
  const note01 = card01.locator('textarea[name="note"]');
  const hint01 = lessons[0].hint;
  await note01.fill('');
  ok(`${route}/${width}: empty mission 01 shows the full hint once in the rail guide, not in the textarea placeholder`,
    await note01.inputValue() === '' && await guide.locator('.rail-guide-hint').count() === 1 &&
    (await guide.locator('.rail-guide-hint').textContent()).includes(hint01) &&
    (await card01.textContent()).split(hint01).length - 1 === 1 &&
    !((await note01.getAttribute('placeholder')) || '').includes(hint01));
  ok(`${route}/${width}: mission 01 removes duplicate guidance and ChEBI labels from the observation area`,
    await card01.locator('.task-narrative .task-guidance,.narr-guidance').count() === 0 &&
    await guide.locator('.point-sources').count() === 0 && !(await guide.textContent()).includes('ChEBI'));
  ok(`${route}/${width}: mission 01 guidance uses one plain, unindented text style`,await guide.locator('.guidance-copy p,.guidance-copy li').evaluateAll(items=>{
    const styles=items.map(el=>{const s=getComputedStyle(el);return {font:s.fontSize,weight:s.fontWeight,line:s.lineHeight,color:s.color,left:el.getBoundingClientRect().left,background:s.backgroundColor,border:s.borderTopWidth};});
    return styles.length===7&&styles.every(s=>s.font==='14px'&&s.weight==='400'&&s.line===styles[0].line&&s.color===styles[0].color&&Math.abs(s.left-styles[0].left)<1&&s.background==='rgba(0, 0, 0, 0)'&&s.border==='0px');
  }));
  ok(`${route}/${width}: mission 01 combines the context and molecular evidence on the first of two pages`,
    await card01.locator('.narr-page').count() === 2 &&
    await card01.locator('.narr-page[data-narr-page="0"] > .narr-prose').count() === 1 &&
    await card01.locator('.narr-page[data-narr-page="0"] > .task-molecule').isVisible());
  await card01.locator('.task-molecule .structure-source').waitFor({state:'attached'});
  ok(`${route}/${width}: mission 01 retains molecular structure provenance outside the observation guide`,
    (await card01.locator('.task-molecule .structure-source').textContent()).includes('ChEBI:68352'));
  ok(`${route}/${width}: mission view splits into a narrative column and a stable form rail`,
    await card01.locator('.task-view').count() === 1 &&
    await card01.locator('.task-narrative').count() === 1 &&
    await card01.locator('.task-rail .learning-form').count() === 1 &&
    await card01.locator('.task-rail .task-actions button[type="submit"]').count() === 1);
  ok(`${route}/${width}: mission 01 combines three reading cards with the notebook comparison entry`,
    await card01.locator('.paper-digest-preview').count() === 3 &&
    await card01.locator('.paper-digest-preview [data-notebook]').count() === 3 &&
    await card01.locator('.paper-notebook-entry [data-notebook="compare"]').count() === 1);
  ok(`${route}/${width}: narrative pager flips pages with pure DOM hidden toggles`,
    await card01.locator('.narr-page[data-narr-page="0"]').isVisible() &&
    !(await card01.locator('.narr-page[data-narr-page="1"]').isVisible()));
  await card01.locator('.pager-next').click();
  ok(`${route}/${width}: pager advances directly to papers and moves focus to its title`,
    !(await card01.locator('.narr-page[data-narr-page="0"]').isVisible()) &&
    await card01.locator('.narr-page[data-narr-page="1"] .paper-digests').isVisible() &&
    (await page.evaluate(() => document.activeElement?.classList.contains('narr-page-title'))));
  await card01.locator('.pager-prev').click();
  ok(`${route}/${width}: pager returns to the context page`, await card01.locator('.narr-page[data-narr-page="0"]').isVisible());
  await card01.locator('[data-action="ask-task-tutor"]').first().click();
  ok(`${route}/${width}: mission ask-tutor opens the mentor with a prefilled mission question`,
    await page.locator('#tutor-panel').isVisible() &&
    (await page.locator('#question').inputValue()).includes('任务01'));
  await page.locator('#question').fill('');
  await page.locator('#close-tutor').click();
  const first = lessons[0];
  await card01.locator('button[type="submit"]').click();
  ok(`${route}/${width}: an empty rationale is blocked by a Chinese validation message`,
    (await card01.locator('textarea[name="note"]').evaluate(el => el.validationMessage)).includes('请先完成这一空项'));
  await saveAnswer(page, first, route);
  ok(`${route}/${width}: mission 01 shows the marked example only after submission`,
    await card01.locator('.task-example').count() === 1 &&
    (await card01.locator('.task-example summary').textContent()).includes('参考示例'));
  await beginTask(page, '02');
  const task = lessons[1];
  const wrong = task.choices.find(choice => choice.id !== task.answer).id;
  const card = await saveAnswer(page, task, route, wrong);
  ok(`${route}/${width}: wrong mission answer remains on the current task`,
    (await card.locator('.learning-feedback').textContent()).includes('再检查') &&
    (await readState(page)).current.learning.entries['02'].matches === false);
  ok(`${route}/${width}: wrong answer cannot unlock the next mission or reaction setup`,
    await page.locator('#quest-panel [data-task="03"]').first().isDisabled() &&
    await card.locator('.task-actions [data-task="03"]').count() === 0 &&
    await page.locator('#workflow [data-stage="1"]').isDisabled());
}
async function exerciseAnalysisBench(page, route, width) {
  const records = content.data_query.records.filter(r => r.route === route);
  ok(`${route}/${width}: analysis bench renders the honesty banner, four rounds and the blacklist card`,
    (await page.locator('.analysis-honesty').textContent()).includes('非本次观测') &&
    await page.locator('[data-bench-round]').count() === 4 &&
    await page.locator('.bench-blacklist').count() === 1 &&
    (await page.locator('.bench-blacklist').textContent()).includes('不可计算'));
  ok(`${route}/${width}: analysis bench lists every registered record of the route with deep links`,
    await page.locator('.ref-record').count() === records.length &&
    await page.locator(`.ref-record a[href="./data.html?route=${route}&q=${records[0].id}"]`).count() === 1);
  const first = page.locator('.ref-record').first();
  await first.locator('textarea').fill('该记录给出本路线的原文报告值，可作为方案条件的对照参照。');
  await first.locator('[data-action="analysis-select-ref"]').click();
  ok(`${route}/${width}: selecting a reference stores it with a reason`,
    (await readState(page)).current.analysis.refRecords.length === 1);
  await page.locator('[data-analysis-tab="2"]').click();
  await page.waitForSelector('.compare-card');
  ok(`${route}/${width}: condition comparison renders the four-state table with plan boundary labels`,
    await page.locator('.compare-card .compare-table tbody tr').count() === 4 &&
    (await page.locator('.compare-card .plan-note').textContent()).includes('非实测') &&
    (await page.locator('.compare-card .cmp-summary').textContent()).length > 0);
  await page.locator('[data-action="analysis-compare"]').click();
  await page.locator('[data-analysis-tab="3"]').click();
  await page.locator('#calc-select').selectOption({ index: 1 });
  await page.locator('[data-action="analysis-calc"]').click();
  const calc = (await readState(page)).current.analysis;
  ok(`${route}/${width}: whitelist calculation records a deduplicated computed result`,
    calc.calculations.length === 1 && calc.calculations[0].result !== null &&
    calc.calculations[0].labels.length === 3);
  await page.locator('[data-analysis-tab="4"]').click();
  await page.locator('input[data-action="analysis-add-gap"][data-gap="缺标准曲线/校准链"]').check();
  await page.locator('#boundary-note').fill('以上数值均为原文报告值或由其计算得出，非本次观测；本方案缺少实测数据、标准曲线与重复测量。');
  await page.locator('[data-action="analysis-boundary"]').click();
  const done = (await readState(page)).current.analysis;
  ok(`${route}/${width}: gaps and boundary note complete the literature analysis`,
    done.gaps.length === 1 && done.boundaryDone === true &&
    (await page.locator('.bench-complete').textContent()).includes('已完成文献参考分析'));
  ok(`${route}/${width}: literature analysis never fabricates a measured outcome`,
    (await readState(page)).current.samples.every(sample => sample.observation === null && sample.quantitative_result === null));
}
async function normalFlow(width, height, route) {
  const context = await browser.newContext({viewport:{width,height},acceptDownloads:true,
    ...(recording ? {recordVideo:{dir:path.join(out,'video'),size:{width,height}}} : {})});
  const page = activePage = await context.newPage();
  page.setDefaultTimeout(12000);
  page.on('pageerror',error => errors.push(error.message));
  page.on('console',message => {
    if (message.type() === 'error') errors.push(message.text());
    if (message.type() === 'warning') warnings.push(message.text());
  });
  page.on('request',request => {
    const parsed = new URL(request.url());
    if (/^https?:$/.test(parsed.protocol) && parsed.origin !== new URL(url).origin) externals.push(request.url());
  });
  // TASK-026: 任务机器初评走确定性夹具（回显 eval_id 通过客户端落地校验），避免整套用例打满服务端
  // 12 次/分钟的 tutor 限流；真实导师对话仍按 liveAI 设置透传到服务端。
  await page.route('**/api/tutor', async route => {
    let payload = {};
    try { payload = route.request().postDataJSON() || {}; } catch { /* 非 JSON 请求交回服务端处理 */ }
    if (payload.kind !== 'evaluate') return route.continue();
    const submission = payload.evaluation || {};
    await route.fulfill({status:200, contentType:'application/json', body:JSON.stringify({
      role:'evaluator', mode:'model', model:'evaluate-fixture',
      answer:'浏览器评价夹具：机器初评通过，最终判定以教师复核为准。',
      evaluation:{task_id:submission.task_id, eval_id:submission.eval_id, context_revision:submission.context_revision,
        pass:true, rubric_hits:[{id:'fixture', point:'浏览器夹具判定，非真实模型输出'}], missing:[], guidance:[], evidence_refs:[]}
    })});
  });
  await page.goto(url);
  await page.locator('.exploration-scene').waitFor();
  await settleHealth(page);
  await page.waitForFunction(() => Boolean(document.querySelector('#molecule-viewer canvas,#molecule-viewer .molecule-fallback img')));
  const openingText = await page.locator('body').textContent();
  ok(`${route}/${width}: opening omits redundant helper copy`,
    ['自查进度 · 不计正式成绩','需要时，随时来问','计算构象 · 非实测','拖动旋转 · 滚轮缩放','按你的习惯探索']
      .every(text => !openingText.includes(text)) && await page.locator('.quest-disclaimer').count() === 0);
  const ua = await page.evaluate(() => navigator.userAgent);
  if (brand === 'Chrome') ok('official Chrome user agent', ua.includes('Chrome/') && !ua.includes('Edg/'));
  if (brand === 'Edge') ok('official Edge user agent', ua.includes('Edg/'));
  sessions.push({route,viewport:{width,height},userAgent:ua,url:page.url(),title:await page.title()});
  ok(`${route}/${width}: page identity, nonempty scene and initial molecule`,
    (await page.title()).includes('案例与路线') && await page.getByRole('heading',{name:content.intro.case.title,exact:true}).isVisible());
  ok(`${route}/${width}: no framework failure overlay`, await page.locator('nextjs-portal, vite-error-overlay, #webpack-dev-server-client-overlay').count() === 0);
  ok(`${route}/${width}: mentor starts closed and does not reserve canvas width`,
    !(await page.locator('#tutor-panel').isVisible()) && await page.locator('#tutor-launcher').getAttribute('aria-expanded') === 'false');
  ok(`${route}/${width}: all four stage tasks remain visible before intro completion`,
    await page.locator('#quest-panel .quest-list [data-task]').count() === 4 && await page.locator('#quest-panel').isVisible() &&
    await page.locator('#quest-panel .quest-row:enabled').count() === 0);
  ok(`${route}/${width}: intro opens with act one alone and omits the removed banner and stepper`,
    await page.locator('main [data-act-question="1"]').isVisible() &&
    await page.locator('main [data-act-question="2"]').count() === 0 &&
    await page.locator('main .act-locked').count() === 0 &&
    await page.locator('main .intro-act[data-act="2"]').count() === 0 &&
    await page.locator('main .intro-steps,main .scene-title,main .orientation').count() === 0);
  ok(`${route}/${width}: act one omits the requested kicker, source badges and review copy`,
    await page.locator('main .act-kicker,main .para-refs,main .act-review,main .point-sources,main .intro-feedback.retry').count() === 0);
  ok(`${route}/${width}: act one presents four declarative paragraphs with supported bioactivity context`,
    await page.locator('main .act-prose p').count() === 4 &&
    !(await page.locator('main .act-prose').textContent()).includes('它') &&
    (await page.locator('main .act-prose').textContent()).includes('潜在生物活性'));
  ok(`${route}/${width}: intro narrative carries no quantitative or efficacy claims`,
    !/[%％]|产率|剂量|疗效/.test(await page.locator('main .exploration-scene').textContent()));
  ok(`${route}/${width}: downstream operation is locked at entry`, await page.locator('#workflow [data-stage="3"]').isDisabled());
  if (!liveAI) ok(`${route}/${width}: default public app does not require model credentials`, (await page.locator('#ai-status').textContent()).includes('尚未配置'));
  await noOverflow(page, `${route}/${width}: molecular opening does not overflow`);
  await screen(page, `${width}-molecule-opening`);
  await completeIntro(page, route, width);
  ok(`${route}/${width}: act three shows the studies and the full experiment overview`,
    await page.locator('main .intro-act').count() === 1 &&
    await page.locator('main .intro-act[data-act="3"]').isVisible() &&
    (await page.locator('main .experiment-overview').textContent()).includes('三篇异槲皮苷制备研究'));
  const revealedText = await page.locator('main').textContent();
  ok(`${route}/${width}: completed intro omits redundant helper copy`, !revealedText.includes('先探索论文中的做法'));
  ok(`${route}/${width}: each study card has exactly one open arrow`,
    await page.locator('main .case-card svg.icon').count() === 3 &&
    await page.locator('main .case-card .case-card-top svg.icon').count() === 0 &&
    await page.locator('main .case-card .case-open svg.icon').count() === 3);
  await screen(page, `${width}-case-routes`);
  await compareStudies(page, 0, route, width);
  await paperPanel(page, route, width);
  await page.locator('main [data-action="begin-quest"]').click();
  await page.locator('.rail-foot [data-action="compare"]').click();
  await page.locator(`#evidence-dialog [data-choose-route="${route}"]`).click();
  await confirmOptionalRouteChange(page);
  await closeEvidence(page);
  ok(`${route}/${width}: selecting a study sets the intended route`, (await readState(page)).current.route === route);
  await verifyWrongAnswer(page, route, width);
  if ([1536,375].includes(width)) {
    const sameBox = (a,b) => ['x','y','width','height'].every(key => Math.abs(a[key] - b[key]) < 1);
    // Focusing the fixed tutor input may scroll a long mobile page. Compare
    // document coordinates so scrolling does not masquerade as a layout shift.
    const mainBox = () => page.locator('main').evaluate(el => {
      const box = el.getBoundingClientRect();
      return {x:box.x + scrollX,y:box.y + scrollY,width:box.width,height:box.height};
    });
    const before = await mainBox();
    const launcherBox = await page.locator('#tutor-launcher').boundingBox();
    ok(`${route}/${width}: mentor launcher is fixed at the lower right outside the page header`,
      await page.locator('#tutor-launcher').evaluate(el => getComputedStyle(el).position === 'fixed' && !el.closest('.topbar')) &&
      launcherBox.x > width / 2 && launcherBox.y > height / 2 &&
      width - launcherBox.x - launcherBox.width >= 0 && width - launcherBox.x - launcherBox.width <= 40 &&
      height - launcherBox.y - launcherBox.height >= 0 && height - launcherBox.y - launcherBox.height <= 40);
    await page.locator('#tutor-launcher').click();
    const panelBox = await page.locator('#tutor-panel').boundingBox();
    ok(`${route}/${width}: mentor stays fixed and reserves desktop reading space`,
      await page.locator('#question').isVisible() &&
      await page.locator('#tutor-panel').evaluate(el => getComputedStyle(el).position === 'fixed' && !el.closest('.topbar')) &&
      width - panelBox.x - panelBox.width >= 0 && width - panelBox.x - panelBox.width <= 40 &&
      height - panelBox.y - panelBox.height >= 0 && height - panelBox.y - panelBox.height <= 40 &&
      (width>=1100?(await mainBox()).width<before.width:sameBox(before,await mainBox())));
    await noOverflow(page, `${route}/${width}: open lower-right mentor does not overflow`);
    if (width === 1536 && !liveAI) {
      await page.locator('#question').fill('请帮我核对这项研究的来源');
      await page.locator('#question').press('Enter');
      ok('unconfigured mentor retains the question and does not fabricate a reply',
        (await page.locator('#ai-error').textContent()).includes('仍可继续') &&
        await page.locator('#question').inputValue() === '请帮我核对这项研究的来源' &&
        await page.locator('.chat-message.assistant').count() === 0);
      await page.locator('#question').fill('');
    }
    await screen(page, `${route}-${width}-floating-mentor`);
    await page.locator('#close-tutor').click();
    ok(`${route}/${width}: closing mentor restores its launcher without changing main geometry`,
      !(await page.locator('#tutor-panel').isVisible()) && await page.locator('#tutor-launcher').isVisible() &&
      sameBox(before,await mainBox()));
  }
  await practiceStage(page, 0, route, width);
  ok(`${route}/${width}: completion reuses the independent rationale instead of a duplicate textarea`,
    await page.locator('#route-form').isVisible() && await page.locator('#route-form textarea').count() === 0 &&
    Boolean((await readState(page)).current.learning.independent['04']));
  await page.locator('#route-form button[type="submit"]').click();
  await page.getByRole('heading',{name:'配置反应体系',exact:true}).waitFor();
  await compareStudies(page, 1, route, width);
  await compareAnalysis(page, route, width);
  await page.locator('#catalyst').selectOption(route === 'R1' ? 'cells' : 'ugt');
  await page.locator('[data-kind="catalyst"] button').click();
  ok(`${route}/${width}: mismatched catalyst is rejected`, (await page.locator('#feedback').textContent()).includes('不匹配'));
  for (const [kind,id] of Object.entries(recipes[route])) {
    await page.locator('#' + kind).selectOption(id);
    await page.locator(`[data-kind="${kind}"] button`).click();
  }
  ok(`${route}/${width}: route-specific materials reach the bench`, await page.locator('.material-tag').count() === 3);
  await page.locator('[data-action="assembly"]').click();
  ok(`${route}/${width}: assembled materials cannot bypass the remaining inquiry missions`, (await readState(page)).current.stage === 1);
  await practiceStage(page, 1, route, width);
  await hideToast(page);
  await screen(page, `${width}-bench`);
  if (width === 1536 && liveAI) {
    await page.locator('#tutor-launcher').click();
    await page.locator('#question').fill('根据我已选择的路线和理由，指出我设计对照时应该先考虑的一个问题。');
    await page.locator('#question').press('Enter');
    await page.locator('.chat-message.assistant').last().waitFor({timeout:60000});
    ok('live model response is distinctly labeled', (await readState(page)).current.chat.at(-1).mode === 'model');
    await fs.writeFile(path.join(out,'live-ai.json'), JSON.stringify((await readState(page)).current.chat,null,2));
    await page.locator('#question').fill('请估算这个实验的产率是多少');
    await page.locator('#question').press('Enter');
    await page.waitForFunction(() => document.querySelectorAll('.chat-message.assistant').length === 2);
    ok('live no-data request receives an evidence guard', (await readState(page)).current.chat.at(-1).mode === 'evidence_guard');
    await page.locator('#close-tutor').click();
  }
  await page.locator('[data-action="assembly"]').click();
  await page.getByRole('heading',{name:'设定实验方案',exact:true}).waitFor();
  await compareStudies(page, 2, route, width);
  await fillPlan(page);
  const planVals = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('#plan-form [name]')].map(el => [el.name, el.value])));
  const calc = Number(planVals.volume) * Number(planVals.concentration);
  ok(`${route}/${width}: student inputs produce only dimensional arithmetic`, (await page.locator('#amount-preview').textContent()).includes(`${Number(calc.toPrecision(6))} μmol`));
  await page.locator('[name="samples"]').fill('0,90');
  // Task gate may run before plan validation; neither path may advance an invalid plan.
  await page.locator('#plan-form button[type="submit"]').click();
  ok(`${route}/${width}: an invalid sampling plan cannot advance`, (await readState(page)).current.stage === 2);
  if (await page.locator('main [data-learning-card]').count()) {
    await page.evaluate(()=>{location.hash='#/stage/3';});
    await page.locator('#plan-form').waitFor();
  }
  await page.locator('[name="samples"]').fill('0,30,60');
  await practiceStage(page, 2, route, width);
  await hideToast(page);
  await noOverflow(page, `${route}/${width}: plan workspace does not overflow`);
  await screen(page, `${width}-plan`);
  await page.locator('#plan-form button[type="submit"]').click();
  await page.getByRole('heading',{name:'操作与取样',exact:true}).waitFor();
  await page.reload();
  await page.getByRole('heading',{name:'操作与取样',exact:true}).waitFor();
  const reloaded = (await readState(page)).current;
  ok(`${route}/${width}: reload preserves plan, first twelve tasks and independent reasoning`,
    reloaded.plan.temperature === '30' && Object.keys(reloaded.learning.entries).length === 12 && Boolean(reloaded.learning.independent['04']));
  await compareStudies(page, 3, route, width);
  ok(`${route}/${width}: sampling is unavailable before preparation`, await page.locator('[data-operate="sample"]').isDisabled());
  for (const action of ['check','mix','start']) await page.locator(`[data-operate="${action}"]`).click();
  await page.waitForFunction(() => !document.querySelector('[data-operate="sample"]').disabled);
  await page.locator('[data-operate="sample"]').click();
  const sampled = (await readState(page)).current;
  ok(`${route}/${width}: planned sample labels never become measured outcomes`, sampled.samples.length === (sampled.plan.control === 'both' ? 9 : 6) && sampled.samples.every(sample => sample.observation === null && sample.quantitative_result === null));
  const analysisStage = page.locator('#workflow [data-stage="4"]');
  if (await analysisStage.isEnabled()) await analysisStage.click();
  ok(`${route}/${width}: the journey rail cannot bypass mission 17 after sampling`, (await readState(page)).current.stage === 3);
  await practiceStage(page, 3, route, width);
  await hideToast(page);
  await screen(page, `${width}-operation`);
  await page.locator('[data-action="analysis"]').click();
  await page.locator('.analysis-samples>summary').click();
  await page.locator('[data-sample="S02-1"]').click();
  if(await page.locator('.analysis-samples').getAttribute('open')===null)await page.locator('.analysis-samples>summary').click();
  ok(`${route}/${width}: analysis selects a sample while clearly showing absent measurements`,
    (await page.locator('.analysis-id').textContent()).includes('S02-1') && await page.getByRole('heading',{name:'无对应实验数据',exact:true}).isVisible());
  await compareStudies(page, 4, route, width);
  await practiceStage(page, 4, route, width);
  await exerciseAnalysisBench(page, route, width);
  await noOverflow(page, `${route}/${width}: analysis workspace does not overflow`);
  await screen(page, `${width}-analysis`);
  await page.locator('[name="reviewed"]').check();
  await page.locator('#analysis-form button[type="submit"]').click();
  await compareStudies(page, 5, route, width);
  for (const [key,value] of Object.entries({conclusion:'目前只完成了流程与证据探究，无法得出样品产率结论。',limitation:'缺少教师审定的真实色谱、标准曲线与逐样品测量。',next:'补充对应观测并固定其它条件，比较一个变量与阴性对照。'})) await page.locator(`[name="${key}"]`).fill(value);
  await practiceStage(page, 5, route, width);
  await noOverflow(page, `${route}/${width}: reflection workspace does not overflow`);
  await screen(page, `${width}-reflection`);
  await page.locator('#reflection-form button[type="submit"]').click();
  await page.getByRole('heading',{name:'实验记录',exact:true}).waitFor();
  ok(`${route}/${width}: completed practice creates one historical snapshot`, (await readState(page)).records.length === 1);
  const pendingDownload = page.waitForEvent('download');
  await page.locator('[data-action="export-json"]').click();
  const downloaded = await pendingDownload;
  const exported = JSON.parse(await fs.readFile(await downloaded.path(),'utf8'));
  ok(`${route}/${width}: export retains null outcomes and separate teaching status`, exported.quantitative_result === null && exported.teacher_approved === false && exported.observations.length === 0);
  ok(`${route}/${width}: export includes all twenty-four responses and original reasoning`, Object.keys(exported.current.learning.entries).length === 24 && Boolean(exported.records[0].learning.independent['04']));
  await hideToast(page);
  await noOverflow(page, `${route}/${width}: records do not overflow`);
  await screen(page, `${width}-records`);
  await page.locator('[data-action="workbench"]').click();
  await page.locator('#workflow [data-stage="2"]').click();
  await page.locator('[name="temperature"]').fill('31');
  const changed = await readState(page);
  // TASK-026 新语义（见 test_workbench_state.mjs）：已确认方案的编辑只失效下游（分析/反思与 13 及以后任务），保留本阶段方案与取样记录；下游导航由任务进度门重新锁定。
  ok(`${route}/${width}: upstream plan edits keep this-stage records, reset downstream analysis and re-lock downstream navigation`, changed.current.samples.length === (changed.current.plan.control === 'both' ? 9 : 6) && changed.current.planConfirmed === true && changed.current.analysisReviewed === false && changed.current.analysis.calculations.length === 0 && await page.locator('#workflow [data-stage="4"]').isDisabled());
  ok(`${route}/${width}: upstream edits retain the first twelve tasks and preserve the full snapshot`, Object.keys(changed.current.learning.entries).length === 12 && Object.keys(changed.records[0].learning.entries).length === 24);
  // Reading a different study and cancelling a route change must preserve the draft.
  await page.locator('#workflow [data-stage="0"]').click();
  const alternative = route === 'R2' ? 'R3' : 'R2';
  await page.locator(`main [data-case="${alternative}"]`).first().click();
  await page.locator(`#evidence-dialog [data-choose-route="${alternative}"]`).click();
  await page.locator('#route-change-dialog').waitFor();
  await page.locator('#route-change-dialog [value="cancel"]').click();
  ok(`${route}/${width}: cancelling route change preserves the current plan`, (await readState(page)).current.route === route && (await readState(page)).current.plan.temperature === '31');
  await closeEvidence(page);
  await page.locator(`main [data-case="${alternative}"]`).first().click();
  await page.locator(`#evidence-dialog [data-choose-route="${alternative}"]`).click();
  await page.locator('#route-change-dialog [value="confirm"]').click();
  await closeEvidence(page);
  await page.waitForFunction(({key,route}) => JSON.parse(localStorage.getItem(key)).current.route === route, {key:stateKey,route:alternative});
  const rerouted = await readState(page);
  ok(`${route}/${width}: confirmed route change restarts current quests but keeps saved work`, rerouted.current.route === alternative && Object.keys(rerouted.current.learning.entries).length === 0 && rerouted.records.length === 1 && Object.keys(rerouted.records[0].learning.entries).length === 24);
  await page.locator('#workspace-more').click();await page.locator('#settings-button').click();
  await page.locator('#reduce-motion').check();
  await page.locator('#settings-dialog [data-close-dialog]').first().click();
  await page.reload();
  await page.locator('.exploration-scene').waitFor();
  ok(`${route}/${width}: reduced-motion preference survives reload`, await page.evaluate(() => document.documentElement.classList.contains('reduce-motion') || document.body.classList.contains('reduce-motion')));
  await page.locator('#tutor-launcher').click();
  await page.keyboard.press('Escape');
  ok(`${route}/${width}: Escape closes the mentor and returns focus`, !(await page.locator('#tutor-panel').isVisible()) && await page.locator('#tutor-launcher').evaluate(el => el === document.activeElement));
  await page.locator('#workspace-more').click();await page.locator('#nav-records').click();
  await page.locator('main [data-action="new"]').click();
  await page.locator('#confirm-dialog [value="cancel"]').click();
  ok(`${route}/${width}: cancel reset preserves the chosen route`, (await readState(page)).current.route === alternative);
  await page.locator('main [data-action="new"]').click();
  await page.locator('#confirm-dialog [value="confirm"]').click();
  await page.locator('.exploration-scene').waitFor();
  ok(`${route}/${width}: new experiment retains historical snapshots`, (await readState(page)).records.length === 1 && (await readState(page)).current.routeConfirmed === false);
  await page.locator('#workspace-more').click();await page.locator('#nav-records').click();
  await page.locator('#compare-record').selectOption((await readState(page)).records[0].id);
  ok(`${route}/${width}: historical comparison retains the original student conditions`, (await page.locator('.comparison').textContent()).includes('30 / 7'));
  const video = page.video();
  await context.close();
  if (video) sessions.at(-1).video = await video.path();
}

async function keyboardFixtures() {
  const context = await browser.newContext({viewport:{width:1280,height:900}});
  const page = activePage = await context.newPage();
  const requests = [];
  await page.route('**/api/health', route => route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({configured:true,model:'keyboard-fixture'})}));
  await page.route('**/api/tutor', async route => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({mode:'model',model:'keyboard-fixture',answer:'浏览器输入事件测试夹具，不是真实模型回复。'})});
  });
  await page.goto(url);
  await page.locator('.exploration-scene').waitFor();
  await settleHealth(page);
  await page.locator('#tutor-launcher').click();
  const input = page.locator('#question');
  await input.fill('第一行');
  await input.press('Shift+Enter');
  await input.press('x');
  ok('keyboard fixture: Shift+Enter inserts a newline without submitting', (await input.inputValue()).includes('\n') && requests.length === 0);
  await input.fill('中文输入法确认词语');
  await input.dispatchEvent('compositionstart');
  await input.dispatchEvent('keydown',{key:'Enter',code:'Enter',isComposing:true,keyCode:229,bubbles:true});
  await input.dispatchEvent('compositionend');
  ok('keyboard fixture: IME composition Enter does not submit', requests.length === 0 && await input.inputValue() === '中文输入法确认词语');
  await input.dispatchEvent('keydown',{key:'Enter',code:'Enter',keyCode:229,bubbles:true});
  ok('keyboard fixture: IME compatibility keyCode 229 does not submit', requests.length === 0);
  await input.press('Enter');
  await page.waitForFunction(() => document.querySelectorAll('.chat-message.assistant').length === 1);
  ok('keyboard fixture: plain Enter sends exactly one message', requests.length === 1 && requests[0].question === '中文输入法确认词语');
  ok('keyboard fixture: successful submit clears input and labels the returned channel', await input.inputValue() === '' && (await readState(page)).current.chat.at(-1).mode === 'model');
  await input.fill('未发送草稿保持');
  await page.locator('#close-tutor').click();
  await page.locator('#tutor-launcher').click();
  ok('keyboard fixture: toggling mentor preserves unsent draft', await input.inputValue() === '未发送草稿保持');
  await noOverflow(page, 'keyboard fixture: open floating mentor fits the viewport');
  await screen(page, '1280-keyboard-fixture-mentor');
  await page.locator('#close-tutor').click();
  await completeIntro(page, 'R1', 'keyboard');
  await page.locator('main [data-notebook="Pei2019"]').first().click();
  await page.locator('#notebook-page-Pei2019 .notebook-pdf').waitFor({state:'visible'});
  await closeEvidence(page);
  await page.locator('#tutor-launcher').click();
  await input.fill('这段我该重点读哪里');
  await input.press('Enter');
  await page.waitForFunction(() => document.querySelectorAll('.chat-message.assistant').length === 2);
  const lastRequest = requests.at(-1);
  ok('keyboard fixture: tutor request carries the current paper as a server-mappable id',
    lastRequest.context?.paper?.source_id === 'Pei2019' && Object.keys(lastRequest.context.paper).length === 1);
  ok('keyboard fixture: mentor context line shows the paper being read',
    (await page.locator('#tutor-context').textContent()).includes('Pei'));
  await page.locator('#quest-panel [data-task="01"]').click();
  await page.locator('main [data-learning-card="01"]').waitFor();
  await input.fill('当前任务要先核对什么');
  await input.press('Enter');
  await page.waitForFunction(() => document.querySelectorAll('.chat-message.assistant').length === 3);
  const taskRequest = requests.at(-1);
  ok('keyboard fixture: tutor request carries the active mission as a server-mappable id',
    taskRequest.context?.task?.id === '01' && typeof taskRequest.context.task.title === 'string' &&
    taskRequest.context?.paper?.source_id === 'Pei2019');
  fixtures.push({name:'mentor-keyboard',upstream:'mocked in browser; not a real AI response',requests:requests.length});
  await context.close();
}

async function failureFixtures() {
  const context = await browser.newContext({viewport:{width:1280,height:900}});
  const page = activePage = await context.newPage();
  await page.route('**/api/health', route => route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({configured:true,model:'failure-fixture'})}));
  await page.route('**/api/tutor', route => route.fulfill({status:502,contentType:'application/json',body:JSON.stringify({error:'模型暂时无法回应，请稍后重试。'})}));
  await page.goto(url);
  await page.locator('.exploration-scene').waitFor();
  await settleHealth(page);
  await page.locator('#tutor-launcher').click();
  await page.locator('#question').fill('请帮我比较路线');
  await page.locator('#question').press('Enter');
  await page.waitForFunction(() => document.querySelector('#ai-error').textContent.includes('无法回应'));
  ok('failure fixture: failed upstream preserves question and never invents an answer', await page.locator('#question').inputValue() === '请帮我比较路线' && await page.locator('.chat-message.assistant').count() === 0);
  await page.locator('#close-tutor').click();
  await page.route('**/content/demo-content.json', route => route.fulfill({status:503,body:'unavailable'}));
  await page.reload();
  await page.getByRole('heading',{name:'实验内容暂时无法加载',exact:true}).waitFor();
  ok('failure fixture: content failure provides a recovery action', await page.getByRole('button',{name:'重新加载',exact:true}).isVisible());
  await page.unroute('**/content/demo-content.json');
  await page.getByRole('button',{name:'重新加载',exact:true}).click();
  await page.locator('.exploration-scene').waitFor();
  ok('failure fixture: retry recovers the working scene');
  await page.evaluate(key => localStorage.setItem(key,'{corrupt'), stateKey);
  await page.reload();
  await page.locator('.exploration-scene').waitFor();
  ok('failure fixture: corrupt saved bytes remain available for backup', await page.evaluate(key => localStorage.getItem(key),stateKey) === '{corrupt');
  await page.route('**/api/paper/*', route => route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'degraded'})}));
  await completeIntro(page, 'R1', 'failure');
  await page.locator('main [data-notebook="Pei2019"]').first().click();
  await page.waitForFunction(() => document.querySelector('#notebook-page-Pei2019 .notebook-pdf-status')?.textContent.includes('暂不可用'));
  ok('failure fixture: degraded paper endpoint shows an honest state and streams no bytes and offers a new-tab fallback',
    (await page.locator('#notebook-page-Pei2019 .notebook-pdf-status').textContent()).includes('暂不可用') &&
    await page.locator('#notebook-page-Pei2019 .pdf-content-page').count() === 0 &&
    await page.locator('#notebook-page-Pei2019 .notebook-pdf-recovery a[href="./api/paper/Pei2019"]').count() === 1);
  await closeEvidence(page);
  fixtures.push({name:'explicit-failure-paths',upstream:'mocked error responses; excluded from normal console-health denominator'});
  await context.close();
}

async function legacyIntroMigration() {
  const context = await browser.newContext({viewport:{width:1280,height:900}});
  const page = activePage = await context.newPage();
  await page.goto(url);
  await page.locator('.exploration-scene').waitFor();
  await completeIntro(page, 'R1', 'legacy');
  await page.evaluate(key => {
    const state = JSON.parse(localStorage.getItem(key));
    state.current.exploration = {revealed:true, routeChosen:true};
    localStorage.setItem(key, JSON.stringify(state));
  }, stateKey);
  await page.reload();
  await page.locator('.exploration-scene').waitFor();
  ok('legacy save: a pre-stepped exploration unlocks all three acts and the quest',
    await page.locator('main .act-locked').count() === 0 &&
    await page.locator('main .case-card').count() === 3 &&
    await page.locator('main [data-action="begin-quest"]').isEnabled());
  await context.close();
}

async function slowPaperFixture() {
  const context = await browser.newContext({viewport:{width:1280,height:900}});
  const page = activePage = await context.newPage();
  await page.route('**/api/paper/*', () => {});
  await page.goto(url);
  await page.locator('.exploration-scene').waitFor();
  await completeIntro(page, 'R1', 'slow-paper');
  await page.locator('main [data-notebook="Pei2019"]').first().click();
  await page.waitForFunction(() => document.querySelector('#notebook-page-Pei2019 .notebook-pdf-status')?.textContent.includes('加载较慢'), {timeout:15000});
  ok('failure fixture: a stalled PDF shows the slow-loading hint with a new-tab fallback',
    (await page.locator('#notebook-page-Pei2019 .notebook-pdf-status').textContent()).includes('重新加载') &&
    await page.locator('#notebook-page-Pei2019 .notebook-pdf-recovery a[href="./api/paper/Pei2019"]').count() === 1);
  fixtures.push({name:'slow-paper-hint',upstream:'stalled route handler; excluded from normal console-health denominator'});
  await context.close();
}

async function openWarningFixture() {
  const context = await browser.newContext({viewport:{width:1280,height:900}});
  const page = activePage = await context.newPage();
  // L06-fix 种子：R1 已完成参照流程并处于开放探究，方案已确认（对照=无酶对照）。
  const entries = {}, at = new Date().toISOString();
  for (const task of lessons) {
    const expected = task.route_answers?.R1 ?? task.answer ?? null;
    entries[task.id] = {choice:task.choices.length?expected:'',note:'开放探究夹具：本步判断依据超过八个字，保留未知与证据边界。',status:'recorded',checkedAt:at,matches:task.choices.length?true:null,feedback:task.feedback??'',route:'R1',aiUsedBefore:false};
  }
  const run = {id:'open-warning-fixture',stage:2,route:'R1',reason:'夹具：选择R1路线验证开放探究警告三选。',routeConfirmed:true,
    materials:{...recipes.R1},assemblyConfirmed:true,
    plan:{volume:'2',concentration:'1.5',temperature:'30',ph:'7',duration:'60',samples:'0,30,60',control:'negative',hypothesis:'固定其它条件比较催化体系与阴性对照，检查有无可测的产物信号'},
    planConfirmed:true,operation:'idle',samples:[],
    analysis:{refRecords:[],comparisons:null,calculations:[],gaps:[],boundaryNote:'',boundaryDone:false},analysisReviewed:false,
    reflection:{conclusion:'',limitation:'',next:''},completed:false,events:[],chat:[],
    learning:{version:1,entries,independent:{}},aiRequested:false,contextRevision:0,
    stageMode:'open',guidedDone:{R1:true},exploration:{step:3,act1:'x',act2:'y',papers:['R1','R2','R3'],revealed:true,routeChosen:true}};
  await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[stateKey,{version:1,current:run,records:[],updatedAt:null}]);
  await page.goto(url);
  await page.locator('#plan-form').waitFor();
  ok('open-warning fixture: open mode renders real plan inputs without arrow-function source',
    await page.evaluate(()=>!document.querySelector('#plan-form').innerHTML.includes('=>field')) &&
    await page.locator('#plan-form [name="volume"]').count() === 1 &&
    await page.locator('#plan-form select[name="control"]').count() === 1);
  // 放弃：提示出现、stageMode 不变、plan 草稿回滚到已确认基线。
  await page.locator('#plan-form select[name="control"]').selectOption('blank');
  await page.locator('#plan-form button[type="submit"]').click();
  await page.locator('#open-warning-dialog[open]').waitFor();
  ok('open-warning fixture: deviation submit opens the three-choice warning dialog', await page.locator('#open-warning-dialog [data-open-decision]').count() === 3);
  await page.locator('#open-warning-dialog [data-open-decision="abandon"]').click();
  ok('open-warning fixture: abandon shows the toast and keeps open mode', (await page.locator('#feedback').textContent()).includes('已放弃') && (await readState(page)).current.stageMode === 'open');
  ok('open-warning fixture: abandon rolls the plan draft back to the confirmed baseline', (await readState(page)).current.plan.control === 'negative');
  // 警告后继续：方案按新值保存，仍为开放探究。
  await page.locator('#plan-form select[name="control"]').selectOption('blank');
  await page.locator('#plan-form button[type="submit"]').click();
  await page.locator('#open-warning-dialog[open]').waitFor();
  await page.locator('#open-warning-dialog [data-open-decision="continue"]').click();
  const afterContinue = (await readState(page)).current;
  ok('open-warning fixture: continue saves the deviation and stays in open mode', afterContinue.plan.control === 'blank' && afterContinue.stageMode === 'open' && afterContinue.planConfirmed === true);
  // 重来：回到方案阶段再次偏差提交，选择重来并确认影响 → 快照入记录、方案确认失效。
  await page.locator('#workflow [data-stage="2"]').click();
  await page.locator('#plan-form').waitFor();
  await page.locator('#plan-form select[name="control"]').selectOption('both');
  await page.locator('#plan-form button[type="submit"]').click();
  await page.locator('#open-warning-dialog[open]').waitFor();
  await page.locator('#open-warning-dialog [data-open-decision="redo"]').click();
  await page.locator('#redo-dialog[open]').waitFor();
  await page.locator('#redo-dialog [value="confirm"]').click();
  await page.locator('#feedback').filter({hasText:'已重来本阶段'}).waitFor(); // close 事件异步派发，等状态落盘后再读。
  const afterRedo = (await readState(page)).current;
  ok('open-warning fixture: redo keeps a snapshot and invalidates the confirmed plan', (await readState(page)).records.length === 1 && afterRedo.planConfirmed === false && afterRedo.stageMode === 'open');
  await noOverflow(page, 'open-warning fixture: plan form fits the viewport');
  fixtures.push({name:'open-warning-three-choices',upstream:'state seeded locally; no AI'});
  await context.close();
}

async function adminPassFixture(){
  const context=await browser.newContext({viewport:{width:1280,height:900}}),page=activePage=await context.newPage(),requests=[];
  await page.route('**/api/health',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({configured:true,model:'pass-fixture'})}));
  await page.route('**/api/tutor',async route=>{
    const payload=route.request().postDataJSON();requests.push(payload);
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({mode:'eval_preflight',evaluation:{eval_id:payload.evaluation?.eval_id,pass:false}})});
  });
  await page.goto(url);await settleHealth(page);
  for(const act of [1,2]){
    await page.locator('.intro-pass-details summary').click();
    page.once('dialog',dialog=>dialog.accept());
    await page.locator('.intro-pass-form input').fill('admin7');await page.locator('.intro-pass-form [type=submit]').click();
    ok(`pass fixture: intro${act} records override`,(await readState(page)).current.exploration[`act${act}`]==='admin7');
    await page.locator('[data-action=intro-advance]').click();
  }
  await page.locator('[data-action=begin-quest]').click();await page.locator('#tutor-launcher').click();
  await page.locator('#question').fill('admin7');await page.locator('#question').press('Enter');
  await page.locator('.learning-feedback').waitFor();await page.locator('#close-tutor').click();
  ok('pass fixture: mentor token submits current task locally',(await readState(page)).current.learning.entries['01'].eval.mode==='admin_override'&&requests.length===0);
  await page.locator('.task-actions [data-task="02"]').click();
  for(const [i,id] of ['isoquercitrin','rutin','quercetin','emiq-example','spiraeoside'].entries()){
    await page.locator(`[data-identity="${i}"]`).click();
    await page.waitForFunction(id=>{const el=document.querySelector('#molecule-viewer');return el?.dataset.moleculeId===id&&['ready','2d'].includes(el.dataset.moleculeState);},id);
    ok(`pass fixture: ${id} switches model and explanation`,(await page.locator('#identity-detail h3').textContent()).includes(content.learning.identities[i].name));
  }
  const form=page.locator('.learning-form');await form.locator('input[value=c1]').check();
  await form.locator('[name=note]').fill('admin7');await form.locator('[type=submit]').click();await form.locator('.learning-feedback').waitFor();
  ok('pass fixture: wrong choice and short token pass without AI',(await readState(page)).current.learning.entries['02'].matches===false&&requests.length===0);
  await page.reload();await page.locator('.task-actions [data-task="03"]').waitFor();
  ok('pass fixture: reload restores passage',(await readState(page)).current.learning.entries['02'].eval.mode==='admin_override');
  await form.locator('[name=note]').fill('admin77');
  ok('pass fixture: editing revokes next-task access',await page.locator('.task-actions [data-task="03"]').count()===0);
  await form.locator('[name=note]').fill('普通回答保留错误选择以及证据边界');await form.locator('[type=submit]').click();await form.locator('.eval-panel.failed').waitFor();
  ok('pass fixture: ordinary answer still invokes evaluation',requests.length===1);
  for(const id of ['02','03','04']){
    if(id!=='02')await page.locator(`.task-actions [data-task="${id}"]`).click();
    await form.locator('[name=note]').fill('admin7');await form.locator('[type=submit]').click();await form.locator('.learning-feedback').waitFor();
    ok(`pass fixture: ${id} marks local override`,(await readState(page)).current.learning.entries[id].eval.mode==='admin_override');
  }
  ok('pass fixture: token neither invokes AI nor invents independent work',requests.length===1&&!(await readState(page)).current.learning.independent['04']);
  fixtures.push({name:'admin-pass-and-five-models',upstream:'health and ordinary failing evaluation mocked; no live AI'});
  await context.close();
}

try {
  for (const viewport of [[1536,1024,'R1'],[768,1024,'R3'],[375,812,'R2']]) await normalFlow(...viewport);
  ok('normal user paths have no console/page errors', errors.length === 0);
  ok('normal app makes no external requests', externals.length === 0);
  await legacyIntroMigration();
  await keyboardFixtures();
  await failureFixtures();
  await slowPaperFixture();
  await openWarningFixture();
  await adminPassFixture();
} catch (error) {
  failure = {message:error.message,stack:error.stack};
  if (activePage && !activePage.isClosed()) {
    await screen(activePage,'failure').catch(() => {});
    await fs.writeFile(path.join(out,'failure-state.json'),JSON.stringify(await readState(activePage),null,2)).catch(() => {});
  }
} finally {
  const report = {url,brand,browser:browser.version(),recording,slow_mo_ms:slowMo,sessions,checks:results.length,pass:!failure,results,errors,warnings,externals,fixtures,...(failure?{failure}:{})};
  await fs.writeFile(path.join(out,'results.json'),JSON.stringify(report,null,2));
  await browser.close();
  console.log(JSON.stringify({url,brand,browser:report.browser,checks:results.length,pass:!failure,...(failure?{failure:failure.message}:{})}));
}
if (failure) throw Error(failure.message);
