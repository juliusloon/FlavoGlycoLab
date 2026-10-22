# REPORT-020：按2026-10-21实际转交件校正24步与三路线接入

## 结论摘要

TASK-020已完成。所有者把三项实际文件放入`temp/261021-handout/`后，本轮核对了SHA、用Python标准库解析ZYT docx文本，并按实际内容校正W-03：

- LYW实际矩阵为“v5 界面简明版”，24步分属六界面、每界面4步；没有分钟、分值、成绩类型或数据依赖角标。
- ZYT实际案例表26,371字节，与TASK-019使用的17,168字节代理副本不同；5类身份、21条候选与三路线对照保留。
- ZYT docx可读，含三路线文献报告值、图注、结论和反思；网页只接入4组摘要值，全部标“原文报告/非本次观测”。
- 网页24项任务按六界面×4步重排，移除分钟/分值/成绩类型显示；180分钟/100分只保留在内部代理字段，标`agent_proposal_not_teacher_approved`。
- 学生样品观测仍为空，`quantitative_result=null`；未新增条件推荐、路线排名、纯度结论或正式成绩。

科学、教师和公众发布三状态门均未晋级。无提交/push，未重启8766，未录制视频，未启动下一TASK。

## 实际文件与解析

| 文件 | 大小 | SHA-256 | 处置 |
| --- | ---: | --- | --- |
| `temp/261021-handout/异槲皮苷三路线分析结果与结论反思.docx` | 3,589,953字节 | `0c549adf252a7fbd41bfb593d5e45735fb9323dd0fbbc83d508df198462f982d` | 原件未改；读取`word/document.xml` |
| `temp/261021-handout/case_evidence_table(1).md` | 26,371字节 | `a731b7e797be9a7079bc448312c1144f138049ba44eb8e10484bb275852ac109` | 原件未改；作案例/21条/路线卡来源 |
| `temp/261021-handout/24step_teaching_matrix.v1.md` | 7,627字节 | `8a86c76ea6858fd86cd60b41890e0eed34b43d25ab200bc8fc907e2db6f5a359` | 原件未改；作24步动作来源 |
| `temp/task-020/docx-extracted.md` | 148行 | `41d43861bca0a384e71d89589e54f510dbe60fcfb3b3836e8a3d415b8223274d` | 本地解析中间物，Git忽略 |

docx解析方法：Python标准库`zipfile`读取容器，`xml.etree.ElementTree`遍历`word/document.xml`的段落与表格文本；未执行宏、未修改原文件、未抽取或发布图片。解析文本只用于核对与整理，不能替代ZYT本人确认或逐字转录。

文件名写`v1`，内文标题写“v5 界面简明版 2026年10月21日”。本轮按内文称LYW v5，并在文档中保留版本差异待LYW确认。

## 改动

### 内容与视图

- 新建[LYW v5实际动作摘要](../p10ns/261019/24step_teaching_matrix_LYW_v5.md)，记录来源SHA、六界面×4步、与原代理矩阵的差异。
- 重写`frontend/student/content/demo-content.json`的24个`learning.steps`：标题、题干、目标、反馈、选择项与阶段映射按实际LYW v5动作；`stage`改为6组各4步。
- 移除任务卡上的分钟、分值、成绩类型显示；任务卡改为“界面n/6”和“教学判断/数据依赖 · 待教师审定”。
- `learning.teaching_matrix`记录实际来源路径/SHA、`actual_stage_step_counts=[4,4,4,4,4,4]`、`actual_has_minutes_points=false`、`data_dependent_steps`，以及`proxy_rubric`（180分钟/100分，`agent_proposal_not_teacher_approved`）。
- `learning.route_analysis`新增`reported_results`四行：R1补料终点、R1供体/酶组合、R2时间进程、R3 84 h补料；逐行含原文条件、来源和不可比较边界。新增实际三文件的`actual_inputs`。
- 结论与反思视图新增“文献报告值（原文报告，非本次观测）”表；14字段表、21条命中边界与三栏结论保留。
- 专用工具ID改绑实际任务：假设构建=09、证据分类=17、证据链=20；独立判断任务=04/09。
- `test_quest_state.mjs`新增实际LYW摘要与代理草案文件的SHA一致性断言，防止`demo-content.json`记录的来源指纹漂移。
- 24步重排后修正所有硬编码旧任务引用（`app.js`路线理由回填并阻止任务05覆盖路线理由、`routeConfirmation`、`shortTitles`）。
- `learning-state.js`允许只读恢复旧版05/06独立判断记录，导出时标“旧版编号”；学习记录页说明旧编号可能不对应现任务。
- `styles.css`增加文献报告区块及表格样式，窄屏沿用横向滚动容器。

### 文档

- [三路线分析接入稿](../p10ns/261019/three_route_analysis_LJX.md)移除“docx不可读/未解析”的旧假设，补实际来源SHA、4组报告值、分路线表、教学算术、C01—C14/21条边界与待人工处理。
- [handoff_acceptance.md](../p10ns/261019/handoff_acceptance.md)H02/H03/H06更新为实际路径/SHA；TASK-019节标为历史假设；新增TASK-020当前事实。
- [standup_log.md](../p10ns/261019/standup_log.md)20:00站会准备改为实际到件与校正后事实，会议召开/参会/决策仍未登记。
- 旧代理[24step_table_3-6.md](../p10ns/261019/24step_table_3-6.md)顶部加TASK-020校正说明，保留为历史草案；文件SHA由交付时`3ae96e36…ff74`变为`f1cccd85…c6be`，`proxy_rubric.source_sha256`已同步。

## 验证

### 工程与状态

| 检查 | 分母/结果 | 说明 |
| --- | --- | --- |
| `npm test` | 30/30通过 | `test_workbench_state.mjs`18项、`test_quest_state.mjs`12项 |
| `python3 scripts/dev.py check` | 46项：43通过、3项研究资产skip | public profile；含治理、服务、迁移、研究包守卫 |
| 浏览器回归 | 487/487通过 | Chromium 153.0.8010.12，Node 22.23.1，Playwright缓存 |
| 正常流程console错误 | 0 | 三视口/三路线 |
| 正常流程外部请求 | 0 | 仅同源资产 |
| 受保护字节 | 199/199不变 | 基线`temp/task-018/protected-before.json`；本轮`temp/task-020/protected-after.json` |
| 三项原件 | 未修改 | SHA见上表，操作前后一致 |

浏览器视口与路线：1536×1024/R1、768×1024/R3、375×812/R2。测试覆盖：初始分子/三案例、六阶段各4任务、错误答案留关、刷新恢复前12项、操作/取样、分析页、反思/导出、上游失效、路线变更、键盘/失败夹具。证据目录`temp/task-020/browser/`（截图与`results.json`）；隔离服务为`temp/task-020/public-root`的8768，未使用私有`tutor.json`，未重启8766。以上为文档闭环后的最终重跑；日志见`temp/task-020/check.log`与`temp/task-020/browser-run.log`，最终JSON已同步到隔离根。

浏览器首轮83项时在“刷新保留前16项”失败：新六阶段前3阶段共12项而非旧16项；修正测试分母为12后重跑487/487通过。该失败是测试预期未随阶段重排更新，不是应用状态丢失。

4条console warning为Chromium WebGL `GPU stall due to ReadPixels`性能提示，不是页面错误；已计入`warnings`，未从错误分母隐藏。

### 文献数值边界

网页展示的4组值均来自ZYT docx对原文的整理：R1 3,830 mg/L/94.3%、R1 64.8%/98.4%/96.8%、R2 18.25/19.87 mM、R3 35.6 g/L/yield 77.2%。页面同时显示“原文报告/非本次观测”、来源与边界；没有把转化率写成纯度，没有跨路线排名，没有生成学生样品值或D1查询。

## 偏差与未完成

- 修改预算外改动：`frontend/student/app.js`和`frontend/student/views/learning.js`不在TASK-020文件清单内，但前者本轮前仍硬编码旧任务05/06（其中任务05会把底物理由误写入`run.reason`），后者会把旧版独立判断显示成新任务标题；为避免错误归属做了最小一致性修复。未改动其状态机或评分语义。
- 同日同步更新`docs/p10ns/261019/shenbaoshu_sections_LJX.md`“拼装前仍需补充的输入”第3条：原文声称ZYT/LYW材料“收到后核对”，与实际到件及TASK-020校正不符，改为实际文件SHA、LYW v5六界面×4步与仍待本人/教师确认的事项。
- 旧localStorage记录：`learning`对象没有内容版本字段，无法可靠判断旧01—24记录对应哪一版动作。当前采用“保留记录+界面提示旧编号可能不对应”的最小策略；未做批量迁移或丢弃。若后续需要严格历史归属，应另立迁移任务。
- 未取得ZYT对docx整理稿的确认、LYW对版本/动作映射的确认、教师对身份/量规/科学表述的审定。
- 21条命中的方向、酶促性、独立研究去重仍未完成；11条受限值未恢复，10条缺失未补造。
- 三篇标准曲线、原始峰面积、稀释/回收链、逐重复表和终产品纯度仍缺，D1未启用。
- 8766服务未重启/未重新验收；本轮浏览器证据来自隔离8768。未提交/push/CI。

## 验收标准核对

| AC | 结果 | 证据 |
| --- | --- | --- |
| AC1 24步与LYW v5一致、六阶段各4步 | 通过 | 内容JSON、`test_quest_state`、浏览器487项 |
| AC2 时间/分值只作代理草案，不写成LYW/教师量规 | 通过 | `proxy_rubric.status`、页面无分钟/分值、测试断言 |
| AC3 04/09/13—22数据依赖角标 | 通过 | 内容JSON、任务卡截图、测试断言 |
| AC4 报告值标“原文报告/非本次观测”与边界 | 通过 | 分析页截图、`reported_results`、浏览器检查 |
| AC5 24步可走通、刷新持久化、三视口无溢出 | 通过 | 三视口487/487、console错误0、外联0 |
| AC6 Node/Python/浏览器/保护字节 | 通过 | 30/30、43通过+3skip、487/487、199/199 |

## 后续

1. ZYT确认docx整理稿与本人结论一致；LYW确认`v1`/`v5`版本与24步映射。
2. 教师审定五类身份、C01—C14表述、数据依赖集合与任何后续量规。
3. HYK/ZYT裁定21条命中的方向/酶促/去重；恢复受限值须另行许可。
4. 补齐定量链并取得教师准入后，才评估D1数值查询与正式评分。
5. 如需严格迁移旧浏览器记录，另立TASK-021合同；本任务不自动启动。
