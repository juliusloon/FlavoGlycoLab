# ADR 0004：事前合同—事实报告—实时状态的项目治理闭环

- 状态：accepted
- 日期：2026-10-15
- 来源：human_direct（所有者要求复刻CondRxnBench管理架构）
- 关联TASK：TASK-002

## 背景
只有README/迁移CSV无法表达科学审核、教学真值、私有源和平台发布之间的职责边界；需要跨任务可复核控制机制。参考CondRxnBench的PROJECT、STATE、ARCHITECTURE、TASK、REPORT、ADR分工，不移入其历史TASK或化学benchmark流程。

## 决定
实施UNDERSTAND→SPECIFY→APPROVE→EXECUTE→VERIFY→REPORT→UPDATE STATE；TASK唯一编号，REPORT同号同短名，ADR保存长期决定；STATE保存当前事实，PROGRESS单独记录里程碑，ARCHITECTURE的Artifact Registry指定唯一工件owner，AGENTS定义代理行为；PROJECT明确科学和许可硬约束。

三个门research_evaluation/teaching_case_review/public_teaching_release分别审查。人审来源标识为human_direct或agent_delegated而不冒充专业教师审核。科学真值和公开发布必须经专门验收。

## 备选方案
仅以Git提交代替报告：无法记录未改问题/人工门；只有看板没有TASK：缺授权边界；直接复制CondRxnBench研究逻辑：领域与证据不同，拒绝。

## 影响与风险
增加小型文档维护成本；通过模板、架构索引和测试约束避免文件职责漂移。当前建立规则不意味着已经部署CI或公网平台。

## 复审条件
科学数据治理、课程审核或仓库权限职责出现需调整的跨任务需求。
