import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parsePage,pageAccess,resumePage,stageAccessible} from '../frontend/student/navigation.js';
import {freshRun,selectRoute,answerIntroAct,recordIntroPaper} from '../frontend/student/lab-state.js';
import {draftLearning,checkLearning} from '../frontend/student/learning-state.js';
import * as components from '../frontend/student/components.js';
import {overviewPage} from '../frontend/student/views/pages.js';
const {button,statusBadge,siteHeader,settingsDialog}=components;
const content=JSON.parse(fs.readFileSync(new URL('../frontend/student/content/demo-content.json',import.meta.url)));
function introduced(){const run=freshRun();answerIntroAct(run,1,content.intro.case.question.answer,true);answerIntroAct(run,2,content.intro.chemical_limit.question.answer,true);recordIntroPaper(run,'R1');return run;}
function completeStage(run,stage){for(const t of content.learning.steps.filter(t=>t.stage===stage)){if(t.id==='04'&&!run.route)selectRoute(run,'R1');if(t.choices.length)draftLearning(run,t.id,'choice',t.route_answers?.[run.route]??t.answer);draftLearning(run,t.id,'note','逐项核对来源、研究方向与证据范围。');checkLearning(run,t);}}

test('every intro, stage and task has its own canonical URL; invalid URLs stay unknown',()=>{
  for(let i=1;i<=3;i++)assert.equal(parsePage(`#/intro/${i}`).act,i);
  for(let i=1;i<=6;i++)assert.equal(parsePage(`#/stage/${i}`).stage,i-1);
  for(let i=1;i<=24;i++){const id=String(i).padStart(2,'0');assert.equal(parsePage(`#/task/${id}`).id,id);}
  for(const path of ['/intro/0','/intro/4','/stage/7','/task/00','/task/25','/task/1','/papers?stage=99','/papers?stage=NaN','/not-a-page'])assert.equal(parsePage(`#${path}`).kind,'unknown',path);
  assert.equal(parsePage('').kind,'home');assert.equal(parsePage('#/records').kind,'records');
});
test('fresh and partial runs cannot bypass intro, task order or stage prerequisites with a URL',()=>{
  const run=freshRun();
  for(const path of ['/intro/2','/intro/3','/task/01','/task/24','/stage/2','/stage/6'])assert.equal(pageAccess(parsePage(`#${path}`),run,content).allowed,false,path);
  answerIntroAct(run,1,content.intro.case.question.answer,true);
  assert.equal(pageAccess(parsePage('#/intro/2'),run,content).allowed,true);
  const ready=introduced();
  assert.equal(pageAccess(parsePage('#/task/01'),ready,content).allowed,true);
  assert.equal(pageAccess(parsePage('#/task/02'),ready,content).allowed,false);
  selectRoute(ready,'R1');ready.routeConfirmed=true;assert.equal(stageAccessible(ready,content,1),false);
  completeStage(ready,0);assert.equal(stageAccessible(ready,content,1),true);
  assert.equal(pageAccess(parsePage('#/task/05'),ready,content).allowed,true);
});
test('resume restores an accessible task; invalid or invalidated last views fall back safely',()=>{
  const run=introduced();
  assert.equal(resumePage('/task/01',run,content),'/task/01');
  for(const path of ['/task/24','/records','/resume','https://other.invalid','/unknown'])assert.equal(resumePage(path,run,content),'/stage/1');
  assert.equal(resumePage('/intro/3',freshRun(),content),'/intro/1');
});
test('paper comparison and access checks never mutate learning or selected route',()=>{
  const run=introduced(),before=JSON.stringify(run);
  for(let i=0;i<6;i++){const page=parsePage(`#/papers?stage=${i}&tab=analysis`);assert.equal(pageAccess(page,run,content).allowed,true);assert.equal(page.stage,i);assert.equal(page.tab,'analysis');}
  pageAccess(parsePage('#/task/24'),run,content);resumePage('/task/24',run,content);
  assert.equal(JSON.stringify(run),before);
});
test('legacy links are explicit redirects; shared navigation identifies its current page',()=>{
  for(const path of ['/case','/data','/ai','/about','/steps'])assert.equal(parsePage(`#${path}`).kind,'redirect');
  const nav=siteHeader('home');assert.match(nav,/id="nav-home"/);
  assert.equal((nav.match(/aria-current="page"/g)||[]).length,1);
  assert.match(button({label:'<script>x</script>',href:'#/home'}),/&lt;script&gt;/);
  assert.match(statusBadge('待教师审定','warning'),/fg-status warning/);
});
test('shared workspace controls provide the title and an accessible more-menu trigger',()=>{
  const controls=siteHeader('home',{workbench:true});
  assert.match(controls,/id="nav-home"/);assert.match(controls,/id="workspace-more"/);
  assert.match(controls,/popovertarget="workspace-menu"/);assert.match(controls,/aria-haspopup="menu"/);
  assert.doesNotMatch(controls,/fg-site-nav|fg-header|id="tutor-launcher"|id="retro-import-button"/);
});
test('shared settings expose four developer links and scope workbench controls',()=>{
  assert.equal(typeof settingsDialog,'function');
  const workbench=settingsDialog({workbench:true}),independent=settingsDialog();
  for(const dialog of [workbench,independent]){
    assert.equal((dialog.match(/id="settings-dialog"/g)||[]).length,1);
    assert.match(dialog,/<details>/);assert.match(dialog,/<summary>开发者模式<\/summary>/);
    assert.deepEqual(Array.from(dialog.matchAll(/data-site-page="([^"]+)"/g),match=>match[1]),['papers','case','data','components']);
  }
  for(const id of ['reduce-motion','retro-import-button'])assert.match(workbench,new RegExp(`id="${id}"`));
  assert.match(workbench,/data-action="replay-intro"/);
  assert.doesNotMatch(independent,/id="reduce-motion"|id="retro-import-button"|data-action="replay-intro"/);
});
test('overview removes developer resource cards without removing learning context',()=>{
  const overview=overviewPage(freshRun(),content,'/intro/1');
  assert.doesNotMatch(overview,/fg-resource|资料与证据/);
  assert.match(overview,/实验阶段/);assert.match(overview,/回看案例导入/);
});
