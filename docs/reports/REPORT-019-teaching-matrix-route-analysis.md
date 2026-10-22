# REPORT-019：24步教学矩阵与三路线结论接入

## 对应任务

- TASK文件：[TASK-019-teaching-matrix-route-analysis.md](../tasks/TASK-019-teaching-matrix-route-analysis.md)
- 状态：Completed（工程接入范围；科学、教师、公众发布门不晋级）
- 日期：2026-10-21
- 基线与结果：当前main工作树，基线提交`c90e0f7`；本轮未提交、未push、未重启8766、未录制视频、未启动下一TASK。
- 授权来源：human_direct。所有者2026-10-21转交ZYT/LYW当日文档并指示完成LJX工作。

## 输入与可读性限制

| 引用 | 本仓库实际使用 | SHA-256 | 结论 |
| --- | --- | --- | --- |
| `case_evidence_table(1).md`（ZYT） | [case_evidence_table.md](../p10ns/261019/case_evidence_table.md) | `11b8e80b0afd21cc9512e5a21ac2e9120b506164b17eed5513302269aea0bd3d` | 同名工作副本可用；原附件位于macOS微信目录，本Linux工作区不可读，未做原字节比对 |
| `24step_teaching_matrix.v1.md`（LYW） | [24step_table_3-6.md](../p10ns/261019/24step_table_3-6.md) | `3ae96e36bdfc1fff892e40d093b7c5a3bc369dff674e0d4db5b64c0df856ff74` | 24行/180分钟/100分与引用描述一致；原文件不可读 |
| `异槲皮苷三路线分析结果与结论反思.docx`（ZYT） | [three_route_analysis_LJX.md](../p10ns/261019/three_route_analysis_LJX.md) | 新建稿 | **docx未解析**；LJX另编接入整理稿，明确非逐字转录，ZYT确认前不署其名 |
| LYW申报3-6(2) | [shenbaoshu_sections_LYW.md](../p10ns/261019/shenbaoshu_sections_LYW.md) | `7224105532eff7f512a325268ada5b861e44ce69b2d4c7c1a1fc1e1030e661ba` | 作为矩阵背景材料引用 |

原附件路径、SHA缺口和不可读事实见`temp/task-019/baseline.json`；交接登记见[handoff_acceptance.md](../p10ns/261019/handoff_acceptance.md#task-0192026-10-21-zytlyw文档转交与w-03接入)。不把工作副本或本次整理稿写成ZYT/LYW本人签收。

## 改动文件与职责

| 职责 | 文件 | 实际改动 |
| --- | --- | --- |
| 内容 | `frontend/student/content/demo-content.json` | 24步各增`matrix_title`、`goal_requirement`、`minutes`、`points`、`score_type`、`data_dependency`、`review_status`；新增`learning.teaching_matrix`（180分钟/100分/四类成绩/12个数据依赖步）与`learning.route_analysis`（C01—C14×3路线、21条命中边界、可支持/不可结论/下一步） |
| 任务页 | `frontend/student/views/inquiry.js` | 每项任务显示拟议分钟、成绩类型与分值、数据依赖/量规“待教师审定”角标；折叠显示目标要求与来源；新增“结论与反思”对话框页签与14行对照表、21条命中状态、三栏结论 |
| 样式 | `frontend/student/styles.css` | 矩阵条、角标、目标折叠、路线分析表格/状态/三栏的桌面与900px/620px响应式样式 |
| 状态测试 | `tests/test_quest_state.mjs` | 新增3项：矩阵元数据完整且180/100、数据依赖恰为04/09/13—22、路线分析14字段/21命中且无观测/无数值结果 |
| 浏览器测试 | `tests/test_inquiry_browser.mjs` | 每项任务检查矩阵时间/分值/角标；新增“结论与反思”页签的14行、21条、路线不变与无溢出检查 |
| 交接/站会 | `docs/p10ns/261019/handoff_acceptance.md`、`standup_log.md` | 登记H02/H03当日转交、工作副本路径/SHA、docx不可读与未决项；新增10-21 20:00站会准备（未登记实际召开） |
| 分析/报告 | `docs/p10ns/261019/three_route_analysis_LJX.md`、本报告、STATE/PROGRESS、索引 | 结论反思整理、真实验收分母与状态闭环 |

未修改任何原始来源、`data/raw`、`data/derived`、`data/private`、模型配置或8766服务。

## 实际操作与观察

- 24项任务现在都显示矩阵元数据；数据依赖集合为**04、09、13、14、15、16、17、18、19、20、21、22**（12项），其余12项显示“量规待教师审定”而非数据依赖角标。
- 三篇论文对话框新增“结论与反思”：状态为`pending_teacher_review`，展示三条路线摘要、C01—C14共14行、21条历史命中（11 withheld/10 missing、方向D0/酶促E0/去重U0）、可支持/不可结论/下一步；阅读该页签不改变已选路线。
- 页面没有新增产率、浓度、动力学或推荐条件；`observations=[]`、`quantitative_result=null`保持。
- 浏览器实际截图在`temp/qa/browser-task-019/`，包括`1536-route-analysis.png`、`768-route-analysis.png`、`375-route-analysis.png`。

## 验证

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `npm test` | 30/30通过；原27项加新增3项矩阵/路线分析守卫。 |
| `python scripts/dev.py check` | 通过（exit 0）：Python 46项=43通过+3项研究资产按显式规则跳过；Node 30/30；日志`temp/task-019/check.log`。 |
| 浏览器回归`tests/test_inquiry_browser.mjs` | **484/484通过**；Chromium 153.0.8010.12，1536/R1、768/R3、375/R2三视口三路线六阶段24题；console/page错误0、外部请求0；`temp/qa/browser-task-019/results.json`。 |
| 矩阵总量 | 24/24有元数据；分钟8+…+13=180、分值4+…+6=100；成绩类型仅“预习成绩/操作成绩/实验报告/教师评价”。 |
| 路线分析 | 14行×3路线；21条命中状态完整；页面无新增数值结果。 |
| 受保护字节 | 199/199 SHA一致，差异0、缺失0；`temp/task-019/protected-after.json`（基线复用`temp/task-018/protected-before.json`）。 |
| 隔离运行 | 仓库`data/private/runtime/tutor.json`存在合法模型配置，直接以8767运行会使“public无凭据”断言不成立；为不读取/改动私有配置，使用`temp/task-019/public-root/`内复制的`serve_lab.py`+指向当前学生资产的符号链接，在8768启动隔离public实例后验收。 |

浏览器warnings为4条相同的WebGL `ReadPixels`性能提示（GPU stall），与TASK-018记录一致，不是页面错误；未作为功能失败隐藏。

## 与任务合同的偏差

- **原始附件不可读**：三项微信路径在当前Linux环境不存在；本轮无法核对原字节、提交时刻或docx内容。已按停止条件保留限制，不以猜测替代。
- **原24步引用文件名与仓库工作副本不同**：以内容字段一致性作为候选接收，不声称版本已由LYW确认。
- **第一次浏览器启动失败**：默认`node`为18、Playwright期望浏览器修订1248；改用Node 22、缓存Chromium 1243可执行文件后通过，未安装系统包或下载新浏览器。
- **public服务隔离**：因私有模型配置存在而使用隔离public-root实例；未修改或删除私有配置，也未依赖外部工作区（Playwright模块仍来自仓库内`temp/task-013/clean-clone/node_modules`）。

## 数据、许可与审核门

- `research_evaluation`：仍为历史候选与定性核对，不表示独立化学实验验证。
- `teaching_case_review`：22/22案例`pending_teacher_review`，教师批准0；24步量规、身份卡与三路线结论均待审定。
- `public_teaching_release`：`not_started`；本轮未做许可、权限、容量或平台发布验收。
- 三篇PDF的TASK-008公开例外与`rights_verified=false`不变；21条历史命中11条`withheld_unlicensed`未恢复，10条`missing`未补造；Niu SI到件不自动开启D1数值查询。

## 已发现但未改的问题

- ZYT docx未读，三路线结论需其本人确认；LYW未确认24步矩阵版本及04/09/13—22数据依赖集合。
- 21条命中的反应方向、酶促性、独立研究与去重仍待HYK/ZYT/专业复核。
- 标曲、稀释链、峰面积、逐重复原始表与教师准入仍缺，D1不可启用。
- localStorage无账号/跨设备同步；代理浏览器验收不等同真人课程、实体移动设备或Windows/macOS客户端验收；本轮未重跑CI。

## 建议的下一TASK

建议在收到ZYT可读docx/LYW版本确认后，由教师审定24步量规与三路线科学表述；D1数值查询须另立任务并具备完整定量链与许可。本轮不自动启动下一TASK。
