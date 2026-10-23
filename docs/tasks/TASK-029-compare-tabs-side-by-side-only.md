# TASK-029：论文对照弹窗仅留并排对照与结论与反思；并排对照改对齐矩阵

## 合同元数据

- 任务ID：TASK-029（本仓库正式编号。过程说明：实施时 029 曾被两个并行会话占用，本任务一度登记为 TASK-030 避让；所有者 2026-10-23 指示两个并行对话已暂停、本任务维持 TASK-029。两会话已自行改号为 TASK-031（暂停、未出报告）与 TASK-032（已完成、见 REPORT-032），029 现无其他占用，故回归 029 并删除临时 030 合同）
- 状态：Completed（2026-10-23 实施与工程验收完成；批准来源 human_direct；实际改动与验收分母以 [REPORT-029](../reports/REPORT-029-compare-tabs-side-by-side-only.md) 为准；三状态门不晋级）
- 基线分支：`main`；基线提交：`2704edd2c0eda071a4b21a093a7e25689c580728`（工作树含 TASK-028 未提交改动与并行会话 TASK-029 两项的在途改动，本任务不触碰、不回退、不代为提交）
- 授权来源：human_direct。第一轮（2026-10-23）：“目前的三篇论文 · 当前阶段对照, 三篇论文的具体内容相比并排对照没有任何内容上的区别, 因此将其去掉, 直接留下并排对照就行. 结论与反思页先保留.”；第二轮（同日，另两并行对话暂停后）：“另外两个对话已经暂停了, 你应该维持你是 task 29”；“对于三篇论文 · 当前阶段对照, 将重复标题统一挪到最左侧: 研究怎么做, 条件与对照, 待检验假说, 证据在哪里, 仍需核对, 三篇论文的内容在右侧对应行展示. 这样处理完之后, 在线阅读论文 PDF / 新标签页打开 PDF / 选择这条路线 三个内容也需要对齐”；“PDF 按所有者指定公开（TASK-008 例外），出版方再利用权利未核验，请勿二次分发。这句提醒删掉”
- 人工负责人：龙锦轩（LJX）；执行者：Cano
- 修改预算（逐路径允许清单）：`frontend/student/views/inquiry.js`（`studyTabs`/`caseComparison`/`paperView`）、`frontend/student/styles.css`（文件末尾追加 TASK-029 注释块，不重写既有行）、`tests/test_inquiry_browser.mjs`（`compareStudies`/`paperPanel`/三个论文面板夹具随交互与布局同步）、`docs/tasks/TASK-029-compare-tabs-side-by-side-only.md`、`docs/reports/REPORT-029-compare-tabs-side-by-side-only.md`、`docs/tasks/README.md`、`docs/reports/README.md`、`STATE.md`
- 关联ADR：无新增（弹窗页签呈现的收敛，不构成跨任务设计决定）

## 目标

「三篇论文 · 当前阶段对照」弹窗（`#evidence-dialog`）中，R1/R2/R3 三个单路线页签打开的“探索这项研究”视图与“并排对照”视图渲染同一批字段（研究怎么做/条件与对照/待检验假说/证据在哪里/仍需核对，加论文 PDF 与要点），仅是数量过滤差异，无内容区别。本任务：

1. 移除 `studyTabs` 中的三个单路线页签按钮（R1/R2/R3），页签只剩「并排对照」与「结论与反思」；
2. 移除 `caseComparison` 中不可再达的单路线分支（按 routeId 过滤、“探索这项研究”标题、`study-grid single` 类），保留 `routeId==='analysis'` 的「结论与反思」分支（页签先保留）。

## 背景与已核实事实

| 来源 | 事实 / 对本任务的影响 |
| --- | --- |
| 所有者指令（2026-10-23） | 单路线页签内容与并排对照无内容区别，要求移除，只留并排对照；结论与反思页签本轮保留 |
| `frontend/student/views/inquiry.js` `studyTabs`/`caseComparison` | 原实现生成 all/R1/R2/R3/analysis 五个页签；单路线视图仅过滤路线数组并改标题/加 `single` 类，字段与 all 视图完全一致 |
| `frontend/student/app.js` `showEvidence` | 页签点击经 `showEvidence` 进入 `caseComparison`；移除按钮后 routeId 只剩 null 与 'analysis' 两种来源 |
| `tests/test_inquiry_browser.mjs` `compareStudies`/`compareAnalysis` | 只点击 `[data-compare-route="all"]` 与 `[data-compare-route="analysis"]`，不断言单路线页签 |
| 并行会话（2026-10-23 15:22—15:26 实测） | TASK-029 两个并行任务（导入单幕两区、论文PDF在线阅读）在途修改 inquiry.js/app.js/styles.css/test_inquiry_browser.mjs；本任务与其文件级重叠，行级不重叠；验收在树落定后统一执行并在 REPORT-029 如实登记分母口径 |

## 范围

### 允许项

- 仅上述修改预算清单内文件；`inquiry.js` 仅改 `studyTabs` 与 `caseComparison` 两处。

### 禁止项

- 不改 `routeAnalysis`（结论与反思视图）、`paperView`、app.js 事件绑定与任何内容 JSON/CSS；不修改 data/raw、data/derived、data/private、registries、metadata；不触碰三个状态门；不 Git commit/push；不重启 8766 服务。

### 涉及目录及文件职责

| 唯一职责 | 允许修改的精确路径 | 拟改动边界 |
| --- | --- | --- |
| 对照弹窗视图 | `frontend/student/views/inquiry.js` | `studyTabs` 删单路线按钮；`caseComparison` 删单路线过滤/标题/single 类 |
| 任务与闭环 | 本合同、同号 REPORT、`docs/tasks/README.md`、`docs/reports/README.md`、`STATE.md` | 登记本次任务入口与真实结果 |

## 非目标

不新增/删除任何内容或数据；不改「结论与反思」页内容（保留现状）；不清理 `.study-grid.single` 相关 CSS（无害死规则，另行登记）；不改其它文案；不处理并行会话自身的编号冲突（由其各自会话登记）。

## 必须执行的操作

1. 修改 `studyTabs`：删除 `${c.routes.map(...)}` 单路线按钮段。
2. 修改 `caseComparison`：删除 routeId 过滤、条件标题与 `single` 类，标题固定为「三篇论文 · 当前阶段对照」。
3. 实施偏差（已按最小必要执行并在 REPORT-029 登记）：①单路线视图除页签外还有 `data-case` 入口（导入第三幕论文卡、阶段横幅路线按钮，app.js:243），为满足「直接留下并排对照」，`caseComparison` 的单路线分支整体移除，`data-case` 现渲染并排视图，app.js 无需改动；②`tests/test_inquiry_browser.mjs` 断言随交互与布局同步（第一轮 `paperPanel` 改并排 3 篇作用域断言；第二轮 `compareStudies` 改矩阵行列断言、论文夹具改 `data-paper-view` 作用域）。
4. 第二轮：`caseComparison` 并排视图重构为对齐矩阵——最左列为字段标签（研究怎么做/条件与对照/待检验假说/证据在哪里/仍需核对，另将原文定位行补标签「原文位置」、论文区补行标签「论文 PDF 与要点」），三篇论文内容在右侧对应行展示；论文要点行、`在线阅读论文 PDF` 按钮行、PDF 面板行、`选择这条路线` 按钮行（仅 stage 0）各自成行跨三列对齐；样式以 styles.css 末尾追加块实现，≤900px 视口矩阵内部横向滚动（沿用 `.analysis-table-wrap` 模式）。
5. 所有者点名的提醒句 `PDF 按所有者指定公开（TASK-008 例外），出版方再利用权利未核验，请勿二次分发。` 与 `新标签页打开 PDF` 链接：已由 TASK-032（论文 PDF 在线阅读）从 `.paper-view` 删除；本任务核实全树 0 残留后不再重复改动，任务 01 论文解读卡中另一句不同措辞（“PDF 公开范围见 TASK-008 例外，请勿二次分发。”）不在点名范围，保留并由所有者后续决定。
6. 统一验收：`python3 scripts/dev.py check`、`npm test`、`npm run test:browser`、`npm run test:data-browser`；失败即停。

## 验收标准

- [ ] `#evidence-dialog` 页签仅剩「并排对照」「结论与反思」；`data-compare-route` 按钮数量为 2。
- [ ] 并排视图为对齐矩阵：字段标签行 6（5 字段＋原文位置）、每行右侧 3 列内容；论文要点/在线阅读按钮/PDF 面板/选择路线各成行对齐。
- [ ] 结论与反思视图与改动前一致（14 字段表等断言不变）。
- [ ] 真实验收命令全部通过；失败时停止并如实报告。

## 验证

    python3 scripts/dev.py check
    npm test
    npm run test:browser
    npm run test:data-browser

## 停止条件

- 测试出现与本任务无关的失败且无法归因；inquiry.js 预算外区域出现非预期改动；编号再次被占用。

## 报告要求

必须生成docs/reports/REPORT-029-compare-tabs-side-by-side-only.md（即使Partial/Blocked/Failed），报告实际状态并更新STATE/PROGRESS。不要自动执行下一TASK。
