# TASK-029：导入三幕改为单幕两区顺序呈现（左内容 · 右问题）

## 合同元数据

- 任务ID：TASK-031（2026-10-23 两轮让号：原编号 TASK-029 让位于并行会话 paper-pdf-online-reading；改号 TASK-030 又与并行会话 compare-tabs-side-by-side-only 相撞，最终定为 TASK-031。test_governance 的 TASK/REPORT 配对以本号为准）
- 状态：Completed（2026-10-23 原会话自验收口：dev.py check 全绿、npm 69/69、test:browser 975/975、test:data-browser 68/68、保护 170/170 零差异；期间经 TASK-029 会话代登记过渡，实际改动与自验以 [REPORT-031](../reports/REPORT-031-intro-single-act-two-zone.md) §1 为准；三状态门不晋级）
- 基线分支：`main`；基线提交：`2704edd2c0eda071a4b21a093a7e25689c580728`（TASK-015—027 已入库；工作树含 TASK-028 未提交改动，本任务不回退、不代为提交）
- 授权来源：human_direct（所有者 2026-10-23 会话明确指令："首先来修改主线任务-明确实验任务, 现在导入一共三步, 我需要你做如下修改: 导入的三幕不要变成从上到下, 而是改成和后面任务一样的, 先只展示第一幕,右边是问题, 完成之后进入下一幕, 这样的顺序."）
- 人工负责人：龙锦轩（LJX）；执行者：Cano
- 修改预算（逐路径允许清单）：`frontend/student/views/inquiry.js`、`frontend/student/app.js`、`frontend/student/styles.css`、`tests/test_inquiry_browser.mjs`、`docs/tasks/TASK-031-intro-single-act-two-zone.md`、`docs/reports/REPORT-031-intro-single-act-two-zone.md`、`docs/tasks/README.md`、`docs/reports/README.md`、`STATE.md`、`temp/task-031/`（Git 忽略，过程证据）
- 关联ADR：无新增（沿用 TASK-026 两区单屏布局的既有设计，不构成新的长期设计决定）

## 目标

导入（开场三幕）从「三幕自上而下纵向堆叠」改为与主线任务视图一致的两区单屏顺序呈现：

1. 任一时刻只渲染当前幕：左侧为该幕叙事内容（幕一含 3D 分子查看器，幕三为三张论文卡），右侧 `task-rail` 为该幕问题（幕一/幕二选择题）或阅读门禁（幕三）；
2. 答对幕一/幕二：右侧显示成功反馈与「进入下一幕」按钮，点击后进入下一幕；答错仍为 retry 提示不推进（TASK-023 语义保持）；
3. 幕三门禁逻辑不变：至少打开一篇论文卡才放行「开始主线探究」，打开计数照常累加。

状态机 `lab-state.js`（introProgress/answerIntroAct/recordIntroPaper）零改动；legacy 存档（revealed/routeChosen）仍直入第三幕。

## 背景与已核实事实

| 来源 | 事实 / 对本任务的影响 |
| --- | --- |
| 现状（frontend/student/views/inquiry.js:29-41） | `explorationScene` 一次渲染全部三幕：未解锁幕渲染 `.act-locked` 占位，已解锁幕全部纵向排列，问题在幕内下方 |
| TASK-026 两区布局（inquiry.js:110-121、styles.css:139-158） | `taskView` 已确立「左叙事分页 + 右 `task-rail` 填写区」单屏模式；本任务把导入对齐到同一模式，复用 `.task-view`/`.task-rail` 既有样式 |
| 状态机（frontend/student/lab-state.js:158-182） | 答对即 `step+1`（幕二答对后 `revealed=true`）；`complete = step===3 && papers.length>=1`。答对后立即 render 会使成功反馈不可见，故需视图侧记忆「完成幕」：新增 app.js 内存态 `introShowAct`（不入 localStorage），答对时停在当前幕显示反馈＋进入按钮，点击「进入下一幕」后回到默认「显示 progress.step 幕」 |
| 浏览器合同（tests/test_inquiry_browser.mjs:83-108、336-341、372-374、640-658） | 既有断言锁定「三幕同屏＋两个 .act-locked 占位」；本任务同步更新导入流程断言为单幕顺序语义，legacy 迁移断言（act-locked 0 / case-card 3 / begin-quest enabled）天然兼容，不改 |
| 门禁重渲染钩子（app.js:343-347） | 论文对话框关闭后按 `.gate-row` 存在与否重渲染；幕三 rail 保留 `.gate-row` 类，钩子行为不变 |

## 范围

### 允许项

- `frontend/student/views/inquiry.js`：重写 `explorationScene` 及其幕渲染辅助函数（`introAct` → `introNarrative`/`introRail`）；幕三/幕一内容、来源标签、待审定标记、门禁文案原样保留。
- `frontend/student/app.js`：新增内存态 `introShowAct` 与 `intro-advance` 动作；在 openTask/goStage/replay-intro/新实验路径重置该内存态；答对分支设置 `introShowAct`。
- `frontend/student/styles.css`：文件末尾追加带 TASK-029 注释的规则块（幕三论文卡在窄列改单列横排、rail 内问题/门禁的边距与对齐）；不改既有规则行。
- `tests/test_inquiry_browser.mjs`：仅更新导入相关断言（completeIntro、开场检查、幕三检查），其余断言不动。
- temp/task-031/：保护清单前后快照、验证服务日志（Git 忽略）。

### 禁止项

- 不修改 `frontend/student/lab-state.js`、`quest-state.js`、`content/demo-content.json`、index.html；不改 raw/derived/private/registries 与 metadata 登记文件；不触碰三个状态门；不 Git commit/push；不重启/调整 8766 LAN 服务；不改主线任务（quest/taskView）既有行为。

### 涉及目录及文件职责

| 唯一职责 | 允许修改的精确路径 | 拟改动边界 |
| --- | --- | --- |
| 导入视图 | `frontend/student/views/inquiry.js` | explorationScene 重写为单幕两区；删除 `.act-locked` 占位渲染 |
| 导入视图态 | `frontend/student/app.js` | `introShowAct` 内存态、`intro-advance` 动作、路径重置点 |
| 样式 | `frontend/student/styles.css` | 末尾追加 TASK-029 规则块 |
| 浏览器合同 | `tests/test_inquiry_browser.mjs` | 导入断言改单幕顺序语义 |
| 任务与闭环 | 本合同、同号 REPORT、两个 README、STATE.md | 登记本次任务入口与真实结果 |
| 过程证据（不入 Git） | `temp/task-031/` | 保护清单前后快照、8768 验证日志 |

## 非目标

不改动导入题目内容、来源标注与文案；不做主线任务（01—24）视图改动；不做已完成幕的回看导航（stepper 仅作进度指示，登记为未做项）；不做移动端专门重排（≤900px 沿用 task-view 单列堆叠）；不处理 8766 服务重启或 Git 同步；不推进任何状态门。

## 必须执行的操作

1. 改动前：temp/task-031/protected-before.json（冻结根 169 文件 + metadata/tutor_presets.json，sha256+size 口径，排除 `._*`/`.DS_Store`；复用 temp/task-028/snapshot_protected.py）。
2. 按「合同元数据·修改预算」实施 inquiry.js / app.js / styles.css / test_inquiry_browser.mjs 改动；写入后回读确认关键行已落盘。
3. 远程验收：`python3 scripts/dev.py check`、`npm test`；启动 8768 验证服务后 `npm run test:browser`、`npm run test:data-browser`，结束后停止服务并确认端口释放。
4. 改动后：temp/task-031/protected-after.json 与 before 逐文件比对，冻结根必须 0 差异。
5. 生成 REPORT-029，更新本合同状态、docs/tasks/README.md、docs/reports/README.md 与 STATE.md。

## 验收标准

- [ ] 导入任一时刻仅渲染当前幕：无 `.act-locked` 占位；`.intro-act[data-act]` 同屏最多 1 个；幕一/幕二问题位于右侧 rail。
- [ ] 答对幕一/幕二显示成功反馈＋「进入下一幕」；点击后切换到下一幕；答错 retry 提示且不推进（与 TASK-023 语义一致）。
- [ ] 幕三：左侧三张论文卡，右侧门禁（已打开 n/3、前置学习提示、「开始主线探究」按钮）；打开论文卡计数与放行逻辑不变。
- [ ] lab-state.js 字节不变；legacy 存档直入第三幕且 begin-quest 可用（legacy 夹具通过）。
- [ ] `dev.py check`、`npm test`、`test:browser`、`test:data-browser` 全部通过；保护清单 170 文件前后 0 差异；PDF SHA 3/3（如 dev.py check 覆盖）。
- [ ] 三状态门不晋级：research_evaluation 候选、teaching_case_review 22/22 待审、public_teaching_release not_started。

## 验证

    cd /home/ljx/FlavoGlycoLab
    python3 scripts/dev.py check
    npm test
    python3 scripts/serve_lab.py --bind 127.0.0.1 --port 8768   # 后台验证服务
    npm run test:browser && npm run test:data-browser          # 结束后停止服务
    python3 temp/task-031/snapshot_protected.py . temp/task-031/protected-after.json
    # before/after 逐文件 sha256+size 比对必须 0 差异

## 停止条件

- 保护清单出现任何字节差异、dev.py check 或浏览器合同失败且原因不在本任务改动内、发现需要改 lab-state.js 才能实现（说明范围误判）——任一出现即中止并报告，不推断化学事实，不扩大范围。

## 报告要求

必须生成 docs/reports/REPORT-031-intro-single-act-two-zone.md（即使 Partial/Blocked/Failed），报告实际状态并更新 STATE/PROGRESS。不要自动执行下一 TASK。
