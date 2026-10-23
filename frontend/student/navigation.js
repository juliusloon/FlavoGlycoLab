import {canVisit, introProgress} from './lab-state.js';
import {canOpenTask, questProgress} from './quest-state.js';

// URLs describe views. Learning answers remain solely in the existing run state.
export const LAST_PAGE_KEY = 'flavoglycolab.last-page.v1';
export function parsePage(hash = '') {
  const raw = hash.replace(/^#/, '') || '/';
  const [path, search = ''] = raw.split('?');
  const params = new URLSearchParams(search);
  if (path === '/' || path === '/home') return {kind:'home', path:'/home'};
  if (path === '/resume') return {kind:'resume', path};
  if (path === '/records') return {kind:'records', path};
  if (path === '/papers') {
    const stage = Number(params.get('stage') ?? 0);
    if (!Number.isInteger(stage) || stage < 0 || stage > 5) return {kind:'unknown',path};
    const tab = params.get('tab') === 'analysis' ? 'analysis' : 'all';
    return {kind:'papers',stage,tab,path:`/papers?stage=${stage}${tab === 'analysis' ? '&tab=analysis' : ''}`};
  }
  const intro = path.match(/^\/intro\/([1-3])$/);
  if (intro) return {kind:'intro',act:Number(intro[1]),path};
  const stage = path.match(/^\/stage\/([1-6])$/);
  if (stage) return {kind:'stage',stage:Number(stage[1])-1,path};
  const task = path.match(/^\/task\/(0[1-9]|1[0-9]|2[0-4])$/);
  if (task) return {kind:'task',id:task[1],path};
  const legacy = {'/steps':'/home','/ai':'/resume','/case':'./case.html','/data':'./data.html','/about':'./components.html'};
  if (legacy[path]) return {kind:'redirect',target:legacy[path],path};
  return {kind:'unknown',path};
}

export function stageAccessible(run, content, stage) {
  return canVisit(run,stage) && Array.from({length:stage},(_,i)=>i)
    .every(i=>questProgress(run,content,i).allComplete);
}
export function pageAccess(page, run, content) {
  if (page.kind === 'unknown') return {allowed:false,reason:'这个地址没有对应页面。'};
  if (page.kind === 'intro' && page.act > Math.min(introProgress(run).step,3))
    return {allowed:false,reason:'先完成前一幕的分子观察与判断，再进入这一幕。'};
  const task = page.kind === 'task' ? content.learning.steps.find(t=>t.id === page.id) : null;
  const stage = task?.stage ?? page.stage;
  if (page.kind === 'task' || page.kind === 'stage') {
    if (!stageAccessible(run,content,stage)) return {allowed:false,reason:'先完成前面阶段的主线与必要操作，再进入这个阶段。'};
    if (page.kind === 'task' && (!introProgress(run).complete || !canOpenTask(run,content,page.id,stage)))
      return {allowed:false,reason:'先完成导入与前序主线任务，再进入这一项任务。'};
  }
  return {allowed:true,stage};
}
export function currentPage(run,content) {
  if (!introProgress(run).complete) return `/intro/${Math.min(introProgress(run).step,3)}`;
  return `/stage/${run.stage+1}`;
}
export function resumePage(saved,run,content) {
  const page = parsePage(saved);
  return ['intro','stage','task'].includes(page.kind) && pageAccess(page,run,content).allowed
    ? page.path : currentPage(run,content);
}
