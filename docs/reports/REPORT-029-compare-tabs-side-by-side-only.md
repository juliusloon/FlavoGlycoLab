# REPORT-029：论文对照弹窗仅留并排对照与结论与反思；并排对照改对齐矩阵

- 任务：[TASK-029](../tasks/TASK-029-compare-tabs-side-by-side-only.md)（human_direct，两轮指令，见合同授权来源）
- 状态：Completed（2026-10-23 实施与工程验收完成；三状态门不晋级）
- 执行者：Cano；人工负责人：龙锦轩（LJX）
- 基线：`main`@`2704edd2c0eda071a4b21a093a7e25689c580728`；工作树另含 TASK-028（CSS）与并行会话 TASK-031（导入单幕两区，暂停未收口）、TASK-032（论文PDF在线阅读，已完成）的在途改动，本任务未回退、未代为提交

## 实际改动

| 文件 | 实际改动 |
| --- | --- |
| `frontend/student/views/inquiry.js` | ①`studyTabs`：页签由 5 个（all/R1/R2/R3/analysis）减为 2 个（并排对照/结论与反思）；②`caseComparison`：删除按 routeId 过滤的单路线分支（“探索这项研究”标题、`study-grid single` 类一并移除），`data-case` 入口（导入第三幕论文卡、阶段横幅路线按钮）现统一渲染并排视图，app.js 无需改动；③并排视图重构为对齐矩阵 `.study-matrix`：表头行（角空格＋3 篇 `article.study`：R1/R2/R3、DOI、路线图、阶段标题）＋6 个 `data-field` 行（研究怎么做/条件与对照/待检验假说/证据在哪里/仍需核对/原文位置）＋论文行＋（stage 0）选择路线行；④`paperView`：改为 `display:contents` 网格子项（要点含待审标识、`在线阅读论文 PDF` 按钮、PDF 面板各占一行），原 per-列 h4「论文 PDF 与要点」上移为行标签，`togglePaper` 的 `closest('.paper-view')` 定位不受影响 |
| `frontend/student/styles.css` | 末尾追加 TASK-029 注释块（+28 行，既有行未改）：矩阵网格、行/列分隔线、`display:contents` 子网格放置（要点行 1/按钮行 2/面板行 3）、≤620px 标签列 96px＋内部横向滚动 |
| `tests/test_inquiry_browser.mjs` | 随交互与布局同步：`compareStudies` 改矩阵断言（6 行/6 标签/18 单元格逐格非空、`.study-locator`×3、论文行 `.paper-view`×3＋`data-open-paper`×3、选择路线行 stage0=3）；`paperPanel` 作用域由 `.study.<route>` 改 `.paper-view[data-paper-view]`；keyboard/failure/slow-paper 三夹具 11 处选择器同步改 `data-paper-view="Pei2019"` 作用域 |
| docs | 本 REPORT、TASK-029 合同（含两轮指令与偏差登记）、`docs/tasks/README.md`、`docs/reports/README.md`、`STATE.md` |

## 需求逐条落实

1. **移除单路线“具体内容”视图，只留并排对照**：页签删除＋单路线分支整体移除；弹窗仅存「并排对照」「结论与反思」两个页签；`data-compare-route` 按钮 2 个。导入论文卡点击仍计数门禁（`recordIntroPaper` 在 `showEvidence` 前执行，app.js:243 未动），但展示并排视图。
2. **重复标题挪最左列、三篇内容对应行展示**：五个字段标签（研究怎么做/条件与对照/待检验假说/证据在哪里/仍需核对）由 per-列 `dt` 改为最左 `matrix-label` 列；原文定位行补行标签「原文位置」（数据查询页既有词汇）；论文区行标签「论文 PDF 与要点」（原 per-列 h4 文案上移，非新造）。
3. **按钮行对齐**：DOM 几何探针实测（`temp/task-029/align_probe.mjs`、`panel_diag.mjs`，Chromium 153@1536px）：字段单元格 top 424/424/424；要点行 top 451×3；`在线阅读论文 PDF` 按钮行 top 726×3；`选择这条路线` 按钮行 top 1100×3；标签列 x=196 位于最左；打开面板后 `grid-row:3/col:2` 放置正确（top 778，位于按钮行下方）。`新标签页打开 PDF` 链接已由 TASK-032 从 `.paper-view` 删除，本任务核实 `frontend/student` 的 UI 渲染层内 `按所有者指定公开`、`再利用`（UI 文案）、`新标签页打开 PDF` 均 0 残留（更正：`content/demo-content.json` 的 9 处 `license_status` 字段含同源措辞“现有PDF按所有者指定公开；新增图表/全文再利用权限待核验”，属数据内容登记，非所有者点名句与 UI 文案），该提醒句无需再删；任务 01 论文解读卡中另一句不同措辞（“PDF 公开范围见 TASK-008 例外，请勿二次分发。”）与其 `新标签页打开 ↗` 链接不在本轮点名范围，保留待所有者决定（同 REPORT-032 未改问题 1）。
4. **结论与反思页保留**：`routeAnalysis` 未改动。

## 编号与并行会话事实

- 实施时 029 曾被两个并行会话占用，本任务一度登记 TASK-030；所有者随后指示“另外两个对话已经暂停了，你应该维持你是 task 29”。两会话已自行改号：TASK-031（导入单幕两区，暂停、无 REPORT）、TASK-032（论文PDF在线阅读，已完成、REPORT-032 在），029 回归本任务，临时 TASK-030 合同文件已删除（未入 Git 历史）。

## 验证（2026-10-23 远程实测）

- 语法：`node --check` inquiry.js、test_inquiry_browser.mjs 均 OK。
- `npm test`：69/69 通过。
- `python3 scripts/dev.py check`：74 项，1 失败＝`test_task_report_pair_ids_and_slugs`（TASK-031 有合同无报告，属暂停并行会话；TASK-029/032 已配对；031 收口后自愈），3 skip＝显式 research 门禁。
- `npm run test:browser`（`FRONTEND_URL=http://127.0.0.1:8771/`，`FLAVOGLYCOLAB_LIVE_AI=1`，`CHROMIUM_EXECUTABLE=chromium-1243`）：**975/975 通过**（Chromium 153.0.8010.12，375/768/1536 三视口 × R1/R2/R3；对比 TASK-028 时代 644 项：增量来自本任务矩阵逐格断言与 031/032 的测试扩展）。含 noOverflow 三视口、console 健康、外联 0。
- `npm run test:data-browser`：68/68，consoleErrors 0，externals 0。
- 环境口径：playwright 包已升 1.64.1（期望 headless_shell-1248 未安装），测试以 `CHROMIUM_EXECUTABLE` 指向缓存中完整版 chromium-1243（同为 153 内核）；验证服务 `python3 scripts/dev.py --port 8771`（避开 8766/8767/8768/8769），验收后已停止；本机检测到 Qwen 故按 REPORT-027/028 同口径加 `FLAVOGLYCOLAB_LIVE_AI=1`。8766 LAN 服务直读本工作树（REPORT-032 已于 15:35 重启），页面强刷即可见新布局。

## 偏差与登记

- 测试文件超出首轮预算（第一轮 `paperPanel`、第二轮 `compareStudies`＋三夹具），均为交互/布局变更的验收必需同步，已在合同“必须执行的操作”登记。
- `.study-grid`、`.study-grid.single`、`.study dl` 及其 ≤900/≤620px 媒体规则成为无害死规则（旧布局残留），本轮按“不顺手重构”保留，未清理。
- 新增行标签「原文位置」与上移的「论文 PDF 与要点」属呈现文案，需教师审定；`teaching_case_review` 不晋级（22/22 案例待审状态未变）。

## 未解决问题

1. TASK-031（导入单幕两区）暂停未出 REPORT，治理配对测试持续失败直至其收口。
2. 论文解读卡（任务 01）的 `新标签页打开 ↗` 链接与 TASK-008 提醒句变体是否随删，待所有者决定。
3. `.study-grid` 等死规则清理、`.analysis-table-wrap` 与新矩阵在极窄视口的滚动条样式统一，留待后续 UI 任务。
