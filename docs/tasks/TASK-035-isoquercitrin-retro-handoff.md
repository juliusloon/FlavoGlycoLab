# TASK-035：异槲皮苷逆合成与 FlavoGlycoLab 可审计交接

- 状态：Approved；批准来源 agent_delegated；human_reviewed=false。
- 授权：所有者明确要求在本项目搜索异槲皮苷、出现实验室第一篇文献并导入实验室，另两篇按证据作为路线或探索。沿用自主审批权，不代替科学或教师审核。
- 执行者 Cano；基线保存 outputs/task029/baseline.json，另库基线同一审计记录。

## 范围、理由与预算
Pei2019（R1）是第一篇主开发文献；Zhang2015（R2）为选择性水解备选；Niu2024（R3）为工程菌开发比较。读取现有三篇PDF及登记，不下载或再分发新原件。只将核对的精确分子转换加入新版本来源库，不将工程菌改造冒充单步化学反应。保留真实生成证据与事后关联证据的区别。
允许改 frontend/student 新 retro-import.js、lab-state.js、app.js、index.html、styles.css；scripts/serve_lab.py 及新交接校验模块；相关 tests、metadata/retrosynthesis.json；本 TASK/REPORT/索引/STATE/ARCHITECTURE/PROGRESS；temp/task-035 本地审计。不安装/复制 Retro 模型或私有数据。Retro 按其 TASK-029 运行。新MCTS最多3次，每次≤90秒、≤500迭代、≤8000节点，前两次用于主例/失败修复，第三次仅有明确失败时重试；不改权重、不缓存冒充搜索、不做无关算法优化。

## 验收
1. 新一次实际 MCTS 原始结果含 Pei2019 精确来源及可追溯原文定位，保存请求、运行、来源绑定。
2. R2作为有来源的精确水解候选；R3作为并行工程菌探索，角色不混淆。
3. Retro 结果可导出自包含交接包并进入 Lab；Lab本地独立校验来源/目标/角色，附到练习记录；无对其它仓库的运行时文件依赖。不得伪造观测、自动通过学习门禁或教师审定。
4. 真实浏览器走通结果→Pei来源→Lab接收→主路线/另两篇比较；桌面/移动布局、失败输入守卫；适当工程回归。
5. 双仓库中文报告、STATE及工件登记更新，保留历史，不提交推送。

## 停止条件
原件SHA或身份冲突时对应转换不准入；无法明确供体/方向时只保留探索角色；必须额外科学审定才可声称的结果不得声明。本任务不接入定量仿真、不推进科学/教师/公开发布门、不改原始来源/旧TASK报告/其它未批准任务。

## 执行补充（agent_delegated）
为保证自包含公开配置，允许 scripts/dev.py 的运行资产清单增记 retro-import.js；增加原始运行只读深链，不发起新搜索。

## 交接协议登记补充（agent_delegated）
允许新增协议ADR及各自ADR索引；Lab tests/test_governance.py 的ADR连续编号守卫随新增0007递增。仅登记本任务实际选择，不改科学/教师/发布门。后续任务仅保存于 proposals，不自动执行。

## 完成记录（2026-10-23）
本合同授权范围Completed；原批准类型agent_delegated，human_reviewed=false。实际实施/验收/偏差与未解决问题见[REPORT-035](../reports/REPORT-035-isoquercitrin-retro-handoff.md)。后续TASK036仅提案，不自动执行。
