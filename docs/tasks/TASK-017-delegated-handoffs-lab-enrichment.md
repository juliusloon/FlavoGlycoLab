# TASK-017：代理补齐交接、实验内容接入与助手宽度调整

## 合同元数据
- 状态：Completed（代理交接与本地工程验收）；日期：2026-10-21。
- 基线分支/提交：main / c90e0f7de2588d56fae4c3d23840323586afedbe；保留TASK-015/016全部未提交工作。
- 授权来源：human_direct。所有者本轮明确要求“LYW和ZYT……交接通过subagents完成，完成后交接给LJX，丰富虚拟实验的具体内容……右侧的ai助手侧栏宽度可拖动”。
- 人工负责人：LJX；执行者：Cano与分别承接LYW、ZYT工作的subagents。代理交付不冒称本人提交、真人签收或教师批准。
- 修改预算：下表所列工件，限本轮交接/内容/界面与必要守卫；不新增运行依赖、模型或数据下载包。既有公开元数据和原文只读核对，必要时只读查证分子身份。
- 关联决定：沿用ADR0004/0006及三个独立状态门。

## 目标与已核事实
排程10-20要求ZYT推进案例表/B1初稿、LYW推进24步表/B2大纲，完整v1截止10-21。本次按直接命令补到可接入的候选工作稿，交给LJX技术整合；不把晚于20号的申报分段、互审签字、录制成片或正式课程验收记为完成。
当前六阶段实验台已有三路线非数值文献摘要；计划样品无观测，正式24步科学课程/成绩尚未实现。TASK-015/016保留条件冲突、数据缺口与许可边界。

## 范围
### 允许项及工件职责
| 工件 | 拟改动/唯一职责 |
| --- | --- |
| docs/p10ns/261019/case_evidence_table.md | ZYT范围代理工作稿：5类身份、21条候选逐项审查、三路线证据与至少10字段核对 |
| docs/p10ns/261019/24step_table_3-6.md | LYW范围代理工作稿：24行、180分钟/100分拟议量规与逐步降级/接入要求；非教师审定 |
| docs/p10ns/261019/shenbaoshu_sections_LYW.md | 仅与24步交接必需的3-6(2)详细说明；其余分段不提前宣称完成 |
| docs/p10ns/261019/b1_script_v1.md、b1_storyboard.md | 介绍脚本/分镜代理v1，区分当前能拍与拟建 |
| docs/p10ns/261019/b2_script_v1.md、b2_shotlist.md | 操作脚本/镜头单代理v1，含无数据拒绝数值分支 |
| docs/p10ns/261019/handoff_acceptance.md | H02—H05代理交付、定位/版本/校验/缺项和LJX实际接入的唯一接收记录 |
| frontend/student/content/demo-content.json | 候选身份/反应辨析、分阶段学习任务与证据提示的UI投影；不替代准入登记或24步设计原稿 |
| frontend/student/{app.js,lab-state.js,ui.js,index.html,styles.css,views/workbench.js}及必要单一职责辅助JS | 学生动作、形成性反馈、学习记录/导出；右栏拖动、键盘调整、宽度记忆、窄屏适配 |
| scripts/serve_lab.py | 仅必要的新增静态资产白名单/已有AI上下文衔接，不扩模型权限 |
| scripts/dev.py | 仅将新增单一职责JS纳入既有必需运行资产检查 |
| tests/test_workbench_state.mjs、test_workbench_browser.mjs、test_lab_server.py | 内容/保存/失效/无观测守卫及拖动交互的必要回归验证 |
| docs/design/workbench.md、frontend/student/README.md、docs/cases/isoquercitrin/README.md | 对应功能/证据入口说明 |
| ARCHITECTURE/STATE/PROGRESS、README/docs/README、任务/报告索引、本TASK/REPORT | 工件登记与真实闭环 |
| temp/task-017/ | 基线SHA、子代理检查、浏览器/工程验证，本地ignored |

### 禁止项/非目标
- 不修改原始/derived/private字节及冻结科学登记，不公开新的第三方图文、数值、SMILES数据包、SI或密钥；原有三PDF例外保持。
- 不把推断写成化学事实，不将21条结构命中认定为21项酶法实验；无法核验的字段明确留缺失/待审。
- 不生成产率、色谱、菌株增产值、正式评分或教师身份；量规是拟议设计，页面只给练习反馈。
- 不代记成员/老师参加会议、签收、确认、审校；不自动执行后续任务、提交/push或公开教学发布。
- 不修改常驻服务、模型、GPU、账号、网卡或防火墙。

## 必须执行的操作
1. 保存当前工作树与来源指纹；先登记工件、再并行派发LYW/ZYT交接。
2. 各代理按现有证据完成工作稿并回报验证/缺项；根代理作为LJX技术接入执行者检查，不代签LJX真人。
3. 按交接丰富实验台具体学习动作与反馈，支持保存/恢复/导出；缺数据任务以证据审查练习降级。
4. 内容接入后优化现有页面，完成右侧AI助手可拖动宽度，保留键盘与移动端可用性。
5. 执行public工程检查、三路线浏览器回归、学习内容/侧栏专项、来源保护检查；填写REPORT并更新STATE/PROGRESS。

## 验收标准
- [x] AC1：两位subagents分别完成可追溯交接工作稿；24步算术/21条分母/脚本时长核验，真人待审与未能完成项明示。
- [x] AC2：H02—H05定位与LJX接入记录完整；无伪造交付时刻或签名。
- [x] AC3：实验内容有具体动作、证据/路线差异与反馈，保存/刷新/导出可用；修改上游后下游学习记录不冒充当前完成。
- [x] AC4：右栏鼠标/触控拖动、键盘调整/重置、边界/视口变化/刷新保持正常，窄屏不遮挡主要流程。
- [x] AC5：默认public检查及实际浏览器验证通过；无未授权数据/外部依赖/科学状态晋级，旧工作与保护资产不变。

## 验证
`python scripts/dev.py check`；`npm run test:browser`；已有Playwright用于新增任务与拖动/键盘/刷新/窄屏验证。Browser plugin not available，沿用已有Playwright与项目内浏览器包，不安装依赖。本地检查与远端CI分开报告。

## 停止条件
原件SHA变化或证据冲突即暂停相应科学字段接入；人审/观测/许可缺失阻断相应数值功能，但不阻断原创教学提示与证据审查练习。发现不在本合同范围的系统/发布要求，保留待办。

## 报告要求
生成REPORT-017-delegated-handoffs-lab-enrichment.md，逐项记录真实分母、初次失败与修正、子代理贡献、尚待人工确认项及Git状态。不得自动进入下一TASK。
