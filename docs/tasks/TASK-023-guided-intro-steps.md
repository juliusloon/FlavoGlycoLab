# TASK-023：导入分步交互与任务引导重构

## 合同元数据
- 任务ID：TASK-023（本仓库唯一、严格递增）
- 状态：Approved（human_direct 定约；不得扩项）
- 基线分支：main（工作树保留TASK-015—022未提交改动）
- 基线提交：`c90e0f7`
- 授权来源：human_direct。所有者2026-10-22要求：①幕一、幕二、幕三改为三个单独步骤，需交互才能进入下一步；②派两个子agent分别扮演授课老师与学生，带着预设实走虚拟实验并带回评测；③指出当前产品"像带icon的md文档，没有交互感、教学感、设计感，信息不直观"；④点名任务01：学生看着分子就要自己写探究结论，毫无引导，不具备虚拟实验必需的引导性；⑤AI导师作用没有被强调。所有者要求按这些要求完成任务。
- 人工负责人：LJX（所有者）
- 执行者：主agent＋角色扮演与实施子agent
- 修改预算（逐路径允许清单）：
  - `docs/tasks/TASK-023-guided-intro-steps.md`
  - `docs/reports/REPORT-023-guided-intro-steps.md`
  - `frontend/student/views/inquiry.js`
  - `frontend/student/app.js`
  - `frontend/student/lab-state.js`（仅 exploration 分幕状态与安全迁移）
  - `frontend/student/quest-state.js`（仅当解锁逻辑确需）
  - `frontend/student/styles.css`
  - `frontend/student/content/demo-content.json`（intro 交互与任务01引导内容；24步语义不动）
  - `frontend/student/index.html`（仅当骨架/无障碍标注需要）
  - `tests/test_inquiry_browser.mjs`、`tests/test_workbench_state.mjs`、`tests/test_lab_server.py`（仅当需要）
  - `STATE.md`、`PROGRESS.md`、`docs/README.md`、`docs/tasks/README.md`、`docs/reports/README.md`
  - `temp/task-023/`（角色扮演报告/截图与验证证据，Git忽略）
- 关联：TASK-018（探究空间）、TASK-020（LYW v5 24步）、TASK-021（文案清理）、TASK-022（四幕导入与论文PDF）；不改变三个状态门。

## 目标
把开场三幕改为顺序解锁、各需完成明确交互的导入步骤；为任务01补足观察引导与"问导师"预填入口；让AI导师在导入与任务流程中有明确、一键可用的角色；在不改24步语义与状态机核心的前提下提升交互感、教学感与信息直观性。

## 背景与已核实事实
- 当前三幕（TASK-022）在同一页面纵向排列，reveal后即全部可滚动浏览，无分步交互。
- `run.exploration`为ad-hoc字段（`{revealed,routeChosen}`），hydrate不校验也不清除；新增分幕状态须向后兼容：旧存档（无分幕字段但已revealed/routeChosen）视为导入已完成；全新run从幕一开始。
- 任务01当前仅渲染分子＋结构注记＋理由textarea（`taskVisual('01')`），无观察指引；导师仅右上角浮窗被动入口。
- 导师协议已支持`task:{id,title}`与`paper:{source_id}`上下文（TASK-022）；预填提问只需前端置textarea值并打开面板，无需改服务端。
- 本机`data/private/runtime/tutor.json`存在，8766/仓库根启动的服务health为configured:true；角色扮演可真实提问（限速12次/分钟，每角色至多2次真实提问）。
- 无头Chromium可用：`PLAYWRIGHT_MODULE=/home/ljx/paperico/frontend/node_modules/playwright/index.mjs`，缓存chromium 153。

## 范围
### 允许项
- `demo-content.json`：intro块增加各幕交互题（题干/选项/反馈，逐条挂已登记source_id、标pending_teacher_review）与任务01观察引导内容；不新增数值/疗效/剂量。
- `inquiry.js`/`app.js`/`styles.css`：三幕分步呈现与解锁（幕一分子观察选择、幕二合成困难判断、幕三至少打开一篇论文卡后开放"开始主线探究"）、导入进度指示、任务01观察指引与"问导师"预填按钮、幕内导师提示入口。
- `lab-state.js`：exploration分幕状态字段与安全迁移（旧字段不失效）。
- 角色扮演评测（temp/task-023/）、测试扩展、REPORT-023与索引更新。

### 禁止项
- 不改`learning.steps` 24步语义/顺序/判定、`teaching_matrix`、`route_analysis`数值与21命中边界；不新增观测、计分、成绩或自动晋级。
- 不改三份PDF及`data/raw`、`data/derived`、`data/private`、`metadata/*`、`data/registries/*`任何字节；不消费HYK摘录/原文配图/SI图文。
- 不引入CDN/外部请求/构建器/新第三方库；不放宽全局CSP；不动`/api/paper`与tutor服务端协议。
- 不回添TASK-021已删除的装饰性文案；不写医疗诊断、剂量、疗效结论或产率数值。
- 不重启8766、不提交、不push、不启动下一TASK。
- 角色扮演agent除`temp/task-023/`外不得修改任何项目文件。

## 必须执行的操作
1. 派两个角色扮演子agent（授课老师预设、学生预设）实走当前应用（含TASK-022导入与论文面板），产出评测到`temp/task-023/teacher/`与`temp/task-023/student/`（notes.md＋截图），最终消息给出按优先级排列的具体问题与建议。
2. 综合两份评测与所有者要求，形成分幕交互与任务01引导设计（写入`temp/task-023/design.md`），再实施。
3. 实现三幕分步交互与解锁、导入进度指示、任务01观察引导、"问导师"预填入口（导入幕与任务视图）。
4. 扩展三类测试（分幕解锁/迁移/引导呈现/导师预填/回归），运行全部验证。
5. 生成REPORT-023（含评测采纳/未采纳清单、测试分母、偏差），更新STATE/PROGRESS与三个README索引；保护字节审计199/199＋三份PDF SHA复核。

## 验收标准
- [ ] AC1：幕一/二/三顺序解锁，每幕需完成指定交互方可推进；进度刷新后保留；replay-intro重置到幕一；无分幕字段的旧存档按已完成导入处理、不阻断。
- [ ] AC2：任务01呈现观察指引（苷元/糖基/连接位点）与导师预填提问；导入幕与任务视图均可一键打开导师并预填与当前上下文相关的问题；24步判定、保存、导出与独立判断记录逻辑零变化。
- [ ] AC3：新增展示文案逐条挂已登记source_id并标待教师审定；无数值产率、无疗效/剂量声明；不回添已删文案。
- [ ] AC4：Python、Node、浏览器（Chromium三视口×三路线）测试通过并记录分母；console错误0、页面外联0；保护字节199/199；PDF SHA 3/3。
- [ ] AC5：两份角色扮演评测落档；REPORT-023列明采纳与未采纳建议及理由。
- [ ] AC6：REPORT-023闭环、STATE/PROGRESS更新；三状态门不晋级。

## 验证
    python scripts/dev.py check
    npm test
    # 浏览器回归：Node 22 + 既有Playwright缓存；隔离端口8768（public-root副本）；三视口×三路线
    # 保护字节审计：199/199；sha256sum data/raw/literature/*.pdf 对 metadata/public_sources.json

实际分母与偏差写入REPORT-023，不得用历史结果冒充本轮。

## 停止条件
- 分幕或引导必须改24步语义、状态机核心或注册表/元数据字节才能实现。
- 新表述必须引入数值、疗效/剂量结论或新参考文献才能成立。
- 角色扮演暴露的核心问题在预算路径内无法解决（中止并报告，请求新合同）。
- 需要重启8766、提交或push才能继续。

## 报告要求
生成`docs/reports/REPORT-023-guided-intro-steps.md`：记录分幕交互与引导的实际实现、角色扮演评测采纳情况、测试分母、偏差与未决问题；更新STATE/PROGRESS与索引。不自动启动下一TASK。
