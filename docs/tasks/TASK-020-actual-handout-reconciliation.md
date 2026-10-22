# TASK-020：按2026-10-21实际转交件校正24步与三路线接入

## 合同元数据
- 任务ID：TASK-020（本仓库唯一、严格递增）
- 状态：Completed（2026-10-21，工程与文档验收完成）
- 基线分支：main（工作树保留TASK-015—019未提交改动）
- 基线提交：`c90e0f7`
- 授权来源：human_direct。所有者2026-10-21先转交三项附件引用并指示完成当日LJX工作，随后把可读文件放入`temp/261021-handout`并明确“继续工作”。本任务据此校正TASK-019的代理假设，不追认成员签收或教师审定。
- 人工负责人：LJX
- 执行者：Cano
- 修改预算：
  - `docs/tasks/TASK-020-actual-handout-reconciliation.md`
  - `docs/reports/REPORT-020-actual-handout-reconciliation.md`
  - `docs/p10ns/261019/24step_teaching_matrix_LYW_v5.md`
  - `docs/p10ns/261019/three_route_analysis_LJX.md`
  - `docs/p10ns/261019/handoff_acceptance.md`
  - `docs/p10ns/261019/standup_log.md`
  - `frontend/student/content/demo-content.json`
  - `frontend/student/views/inquiry.js`
  - `frontend/student/views/inquiry-tools.js`
  - `frontend/student/learning-state.js`
  - `frontend/student/styles.css`
  - `tests/test_quest_state.mjs`
  - `tests/test_inquiry_browser.mjs`
  - `tests/test_workbench_state.mjs`
  - `STATE.md`、`PROGRESS.md`、`ARCHITECTURE.md`、`README.md`
  - `docs/README.md`、`docs/reports/README.md`、`docs/tasks/README.md`
  - `frontend/student/README.md`、`docs/design/workbench.md`
  - `temp/task-020/`（本地证据，Git忽略）
- 关联：W-03、H02/H03、TASK-018、TASK-019；ADR0004/0006。

## 目标
用实际可读的ZYT案例证据表、三路线分析反思docx和LYW 24步教学矩阵，校正TASK-019基于代理工作副本形成的接入内容：24步动作与六阶段映射、时间/分值的来源标注、三路线文献报告值与证据边界。完成W-03当前可交付部分；科学、教师和公众发布门不晋级。

## 背景与已核实事实
- 实际文件已位于`temp/261021-handout/`：`24step_teaching_matrix.v1.md`、`异槲皮苷三路线分析结果与结论反思.docx`、`case_evidence_table(1).md`。
- 实际24步稿为“v5 界面简明版”，24步分属六个界面，每界面4步；没有分钟、分值或成绩类型。TASK-019使用的180分钟/100分来自代理设计表`24step_table_3-6.md`，不是LYW实际提交内容。
- 实际案例表26,371字节，与TASK-019使用的17,168字节代理表不同；SHA不同。实际docx3,589,953字节，可解析，包含三路线图表说明、原文报告数值和反思任务。
- 实际docx的文献报告值（如R1补料3830 mg/L/94.3%、R2 18.25/19.87 mM、R3 35.6 g/L/yield 77.2%）属于原文报告，不是学生样品观测；跨路线指标口径不可直接排名，转化率不等于纯度。
- 21条历史候选在ZYT实际表中仍为21条：A 2、B 3、C 13、D 2、E 1；11条`withheld_unlicensed`、10条`missing`。方向、酶促性、独立研究去重和教师审核仍未完成。
- 现行网页的24步标题、目标和阶段切分为代理设计（8/2/6/1/3/4），与实际LYW稿（4/4/4/4/4/4）不一致；必须校正，避免把代理设计写成LYW提交。

## 范围
### 允许项
- 读取三项实际转交件、计算SHA、抽取docx文本；只在`temp/task-020/`保存解析中间物，不改原字节。
- 新建LYW v5动作摘要，重写24项学习任务的标题、目标、题干、反馈和选择项，使六阶段各4步；保留现有状态机、保存、导出、解锁和失效逻辑。
- 明确区分“LYW动作要求”与“代理拟议分钟/分值”；保留后者时必须在界面和状态文件中标注来源，不写成LYW或教师审定。
- 按W-03合同保留04、09、13—22的数据依赖“待教师审定”角标。
- 在结论与反思视图加入docx明确给出的文献报告值，逐条标注“原文报告/非本次观测”、条件、指标口径和不可比较边界。
- 更新工程守卫、文档、交接和状态闭环，重跑Node、Python、浏览器和受保护字节检查。

### 禁止项
- 不修改或复制覆盖三项原始交付；不把docx图片或案例表数值打包进公开前端资产。
- 不新增学生样品观测、条件推荐、最优值、产率预测、纯度结论或正式成绩。
- 不把文献报告值写成网页实测；不把转化率/摩尔转化写成纯度；不跨路线直接排名。
- 不恢复11条受限数值，不为10条缺失记录补造字段。
- 不写ZYT/LYW/LJX本人签收、教师批准或互审通过。
- 不提交、不push、不重启8766、不录制视频、不启动下一TASK。

### 涉及目录及文件职责
| 目录职责 | 文件 | 当前状态与拟改动 |
| --- | --- | --- |
| 事前合同 | 本文件 | 新建 |
| 实际动作摘要 | `docs/p10ns/261019/24step_teaching_matrix_LYW_v5.md` | 新建：24步/六界面/4步每阶段，来源SHA与代理量规分栏 |
| 三路线整理 | `docs/p10ns/261019/three_route_analysis_LJX.md` | 修正“docx未解析”，补实际报告值、口径与边界 |
| 内容投影 | `frontend/student/content/demo-content.json` | 重写24步动作/阶段；路由分析加入报告值；时间/分值来源分层 |
| 任务渲染 | `frontend/student/views/inquiry.js`、`inquiry-tools.js` | 矩阵标识、阶段映射、专用工具ID、文献报告区块 |
| 学习状态 | `frontend/student/learning-state.js` | 六阶段各4步；独立判断改绑04/09 |
| 样式 | `frontend/student/styles.css` | 文献报告区块与窄屏 |
| 测试 | `tests/test_quest_state.mjs`、`test_inquiry_browser.mjs`、`test_workbench_state.mjs` | 新动作/阶段/工具/报告值守卫 |
| 交接与站会 | `handoff_acceptance.md`、`standup_log.md` | 实际路径SHA、TASK-020修正说明、20:00站会 |
| 报告与索引 | `REPORT-020`、STATE/PROGRESS/ARCHITECTURE/README及索引 | 事后事实闭环 |

## 非目标
- D1数值查询、正式评分、教师后台、账号、真实测量接入、视频成片、公开发布。
- 对三篇论文逐值复核、图读数、SI科学审核或21条候选结构判定。
- 重新设计六阶段实验台本身；只校正学习任务与接入内容。

## 必须执行的操作
1. 保存实际文件路径、大小、SHA和docx解析限制。
2. 建立LYW v5 24步动作摘要，明确4/4/4/4/4/4阶段映射。
3. 重写24步学习任务并更新状态守卫、专用工具和独立判断ID。
4. 将代理拟议时间/分值改为显式来源标注；不得写成LYW提交。
5. 把docx文献报告值接入结论与反思，标注原文条件、指标口径、非本次观测和不可排名。
6. 更新交接/站会/报告/STATE/PROGRESS/索引。
7. 运行`npm test`、`python scripts/dev.py check`、浏览器三视口三路线回归、受保护字节审计。

## 验收标准
- [x] AC1：24步标题和动作与LYW v5实际稿一致；六阶段各4步；旧代理阶段切分不再显示。
- [x] AC2：时间/分值只标为代理拟议，合计180/100可作为草案保留；页面和内容不写成LYW提交或教师量规。
- [x] AC3：04、09、13—22仍标“数据依赖/科学依据待教师审定”，其余不误标。
- [x] AC4：结论与反思展示docx报告值，逐条标注“原文报告/非本次观测”和口径边界；页面无学生样品数值。
- [x] AC5：24步可走通、刷新持久化、01—12段可演示；桌面/平板/窄屏无横向溢出，console错误0、外联0。
- [x] AC6：Node/Python/浏览器测试通过并记录分母；199项受保护字节不变；无提交/push/8766重启。

## 验证
```bash
node --test tests/test_quest_state.mjs tests/test_workbench_state.mjs
npm test
python scripts/dev.py check
# 浏览器回归使用Node 22与既有Playwright缓存，结果保存temp/task-020/
```
实际分母和失败必须写入REPORT-020，不得用历史结果冒充本轮。

## 停止条件
- 实际文件SHA/内容与所有者转交说明冲突，或无法区分原文报告与网页观测。
- 必须编造数值、条件推荐、教师签名、成员签收或正式成绩才能通过。
- 改动溢出到`data/raw`、`data/derived`、`data/private`或三项原件。
- 浏览器/工程检查失败且无法在本任务范围内修复。

## 报告要求
生成`docs/reports/REPORT-020-actual-handout-reconciliation.md`，记录实际文件SHA、解析方法、改动、分母、偏差、失败和未决科学/教学项；更新STATE/PROGRESS，不自动进入下一TASK。
