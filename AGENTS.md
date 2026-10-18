# FlavoGlycoLab Agent 执行规则

## 适用范围
本仓库建设“黄酮糖苷智能生物制造虚拟实验室”：基于经核验的真实文献/反应/结构证据，设计酶法合成与生物制造的教学虚拟实验。现阶段是可审计的候选证据基础；不是已验收的教学模拟器。

## 必须按顺序阅读
1. PROJECT.md：稳定目标、非目标和许可/教学边界。
2. STATE.md：当前经验证状态、冻结资产、禁止触碰范围。
3. ARCHITECTURE.md：模块与工件唯一责任归属。
4. 本次已批准的 docs/tasks/TASK-NNN-*.md：唯一执行合同。

未经批准的 TASK 不得开展跨模块的实质性改动。用户在对话中直接给出的明确实施命令，可记录为 human_direct，不必声称经过额外书面签字。Agent 代为选择技术手段不等于教师批准或原始科学证据确认。

## 闭环
UNDERSTAND → SPECIFY → APPROVE → EXECUTE → VERIFY → REPORT → UPDATE STATE

- 每个实质性操作有唯一递增 TASK 编号；本项目从 TASK-001 开始。
- TASK 写事前范围、预算、禁区、可测验收、停止条件与批准来源。
- REPORT 写事后真实改动、验证分母、偏差、失败和未解决问题。
- STATE 只保存当前事实，不充当工作日志；PROGRESS 只保存里程碑与阻断。
- 持久设计选择用 ADR；Git 证明文件改动；README 是阅读入口。
- 合同之外不顺手重构。触及停止条件则中止、报告，不推断化学事实。
- 未经新的批准，不自动启动下一个 TASK。
- 项目面向使用者的说明默认简体中文；代码/标识符可使用英文。

## 必须区分的三个状态门
- research_evaluation：历史研究来源/计算通过不表示独立的化学实验验证。
- teaching_case_review：必须有教师/专业审核的可追溯审定记录；agent_checked_candidate 不是 teacher_approved。
- public_teaching_release：必须单独验收许可、数据再分发、权限/安全和平台部署；未通过不可发布。

## 科学、原件和来源保护
- 原始来源字节不可静默修改。每条派生记录保留 source_id、原定位、SHA、质量/许可/教师审定状态。
- 异槲皮苷结构命中不等于该记录是酶促生产实验；实验条件和产率不得凭结构匹配或算法评分编造。
- 零值、缺失、推断、机器验证、真人审核和真实观测必须分开。
- data/raw、data/derived、data/private 全部禁止纳入 Git；第三方来源和模型权重不能因本地副本而公开。
- 活动运行和验证只读取本项目内部相对路径；不得依赖其它工作区，历史迁移证据除外。

## 文件责任
- src/flavoglycolab：本项目代码，evidence 是当前唯一 active 子包。
- data/registries、metadata：许可/来源/案例登记与活跃的相对路径配置。
- data/raw、data/derived、data/private：本地私有来源、衍生和待审核候选，不进入公开 Git。
- docs/tasks、docs/reports、docs/adr：事前合同、事后事实与长期决定，使用各目录的 TEMPLATE.md。
- PROJECT/ARCHITECTURE/STATE/PROGRESS/ROADMAP：长期合同、结构、实时事实、阶段进度与规划。
- tests：工程合同守卫；真实教学和化学验证另有门槛。

创建持久文件前先查 ARCHITECTURE 的 Artifact Registry，避免一份真值多处登记。

## TASK-008公开范围例外（2026-10-18）

所有者明确指令“三篇PDF也要公开”。`data/raw/literature/`中的三个已提交PDF按`PUBLIC_PDFS`（`scripts/export_public_repository.py`）登记的精确路径及SHA公开；其余raw/derived/private仍不公开。这是human_direct范围决定，出版方rights_verified=false，不追认为教师审定或全数据授权，PDF不适用本项目原创代码/文档许可。原件不改，原案例表仍脱敏。
