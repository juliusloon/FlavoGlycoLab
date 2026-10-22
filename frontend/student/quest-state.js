// Navigation through student self-checks, not scientific validation or grades.
// The content order is authoritative; no progress is stored separately from answers.

export function stageTasks(content, stage) {
  if (!Number.isInteger(stage) || stage < 0 || stage > 5) return [];
  return (content?.learning?.steps ?? []).filter(task => task.stage === stage);
}

// TASK-026 v2: 模型评价只作增强门控；选择题永远锚定确定性核对（matches），
// 模型不可翻转锚定结果；无评价/评价降级时保持"已记录"语义，AI 不可用不卡死流程。
function entryPassedForRoute(run, task, routeId) {
  const entry = run?.learning?.entries?.[task.id];
  if (entry?.status !== 'recorded' || entry.route !== routeId ||
      typeof entry.note !== 'string' || entry.note.trim().length < 8) return false;
  const evalState = entry.eval?.state;
  if (evalState === 'passed' || evalState === 'failed') {
    if (evalState !== 'passed') return false;
    return !task.choices?.length || entry.matches === true;
  }
  if (!task.choices?.length) return true; // evaluating/degraded/无评价：保持已记录语义。
  const expected = task.route_answers?.[routeId] ?? task.answer;
  return entry.matches === true && typeof expected === 'string' &&
    entry.choice === expected && task.choices.some(choice => choice.id === entry.choice);
}

export function taskPassed(run, task) {
  if (!task?.id) return false;
  return entryPassedForRoute(run, task, run?.route);
}

// TASK-027 L02 先学后做：路线前置学习门禁。只按阶段1（导入后主线 01—04）判断，
// 逐路线独立：切换路线后按目标路线重新判断，不继承另一条路线的通过结论；
// 缺内容时永远不放行。不另存进度真值，全部从已存学习答案推导。
export function routeLearningGate(run, content, routeId = run?.route) {
  const tasks = stageTasks(content, 0);
  const completed = tasks.filter(task => entryPassedForRoute(run, task, routeId)).length;
  return {
    route: routeId,
    completed,
    total: tasks.length,
    complete: tasks.length > 0 && completed === tasks.length,
  };
}

export function taskStatus(run, task) {
  if (taskPassed(run, task)) return task.choices?.length ? 'passed' : 'submitted';
  const entry = run?.learning?.entries?.[task?.id];
  if (!entry) return 'pending';
  if (entry.status === 'recorded') return entry.route === run?.route ? 'retry' : 'stale';
  return 'draft';
}

export function questProgress(run, content, stage = run?.stage) {
  const tasks = stageTasks(content, stage);
  const firstIncomplete = tasks.findIndex(task => !taskPassed(run, task));
  return {
    tasks,
    completed: tasks.filter(task => taskPassed(run, task)).length,
    total: tasks.length,
    currentId: firstIncomplete < 0 ? null : tasks[firstIncomplete].id,
    nextIds: firstIncomplete < 0 ? [] : tasks.slice(firstIncomplete + 1, firstIncomplete + 3).map(task => task.id),
    // Missing or unknown teaching content must never open a stage gate.
    allComplete: tasks.length > 0 && firstIncomplete < 0,
  };
}

export function canOpenTask(run, content, id, stage = run?.stage) {
  const tasks = stageTasks(content, stage);
  const index = tasks.findIndex(task => task.id === id);
  if (index < 0) return false;
  // Legacy saved answers later in the list do not bypass unfinished prerequisites.
  return tasks.slice(0, index).every(task => taskPassed(run, task));
}

export function nextTaskId(run, content, id, stage = run?.stage) {
  const tasks = stageTasks(content, stage);
  const index = tasks.findIndex(task => task.id === id);
  if (index < 0 || !canOpenTask(run, content, id, stage) || !taskPassed(run, tasks[index])) return null;
  return tasks[index + 1]?.id ?? null;
}
