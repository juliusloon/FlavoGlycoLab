# TASK-002：项目更名与治理架构本地化

## 合同元数据
- 任务ID：TASK-002
- 状态：Completed（human_direct批准；本地更名及治理验收通过）
- 基线分支：main
- 基线提交：03519b1976020dea17451d7eaf8602e2a58f2c96
- 授权来源：human_direct（要求复刻CondRxnBench管理架构并按核心目标重命名）
- 人工负责人：项目所有者
- 执行者：Agent
- 修改预算：项目根名称、src包名、pyproject、活动说明/测试路径、PROJECT/ARCHITECTURE/STATE/PROGRESS/ROADMAP/AGENTS/CONTRIBUTING；docs任务/报告/ADR/治理材料、.github模板、.editorconfig/.gitattributes；不修改raw数据字节。

## 目标
将项目正式命名为FlavoGlycoLab，复用CondRxnBench操作控制闭环，建立本项目自主TASK/REPORT/ADR模板与责任体系，并在不依赖其他仓库的情况下验证证据读取能力与受限数据Git边界。

## 背景
现有项目只有独立来源/只读入口与少量ADR/TASK，没有完整STATE/ARCHITECTURE/模板体系。CondRxnBench包含PROJECT/STATE/ARCHITECTURE/AGENTS及TASK/REPORT/ADR模板和长期决策约束；该管理框架可复用，但反应条件benchmark的科学结论不属于本项目。

## 范围
### 允许项
- 更名工作区及Python分发包，更新本项目活动引用和测试。
- 从CondRxnBench改写完整的项目管理文件、索引和三个模板。
- 保留已有2项ADR并明确历史更名，建立新ADR0003/0004。
- 为既存TASK-001形成事实型REPORT-001，新增TASK-002及对应REPORT-002。
### 禁止项
- 不动CondRxnBench/FlavoRetro文件与Git状态，不改动任何受控原件/SHA。
- 不进行新科学审核、AI/仿真功能、Git远端push、公共发布。
### 涉及目录与职责
| 路径 | 目的 |
| --- | --- |
| 根治理文档与docs/ | 明确目标、决策与控制闭环 |
| src/flavoglycolab/ + tests/ | 更名活动导入并保持只读验证 |
| migrations/ | 历史凭据不改源哈希，更正项目现用标识 |
| data/raw/derived/private | 严格保留原件与许可，不改字节 |

## 非目标
学校项目命名认可、商标核查、教学科学审定、前后端实施和iLab上线。

## 必须执行操作
1. 阅读CondRxnBench真实治理文件和模板。
2. 提交完整本地化治理与命名ADR，确保不复制旧项目TASK历史。
3. 更名目录与src包/CLI、更新本项目README/运行说明、修复测试引用。
4. 核验候选资源/来源哈希、数据禁入Git、Git工作树及报告真实性。

## 验收标准
- [ ] 根目录正式更名、无旧路径活动运行依赖。
- [ ] PROJECT/ARCHITECTURE/STATE/PROGRESS/AGENTS及TASK/REPORT/ADR TEMPLATE/README存在。
- [ ] 本项目TASK-001/002与REPORT-001/002编号和短标题一致。
- [ ] 23项P0 hash、122个原始来源hash、3059资源仍不变。
- [ ] 单元测试、工作区外启动、SQLite完整性及Git受限路径检查通过。
- [ ] 未改变任何旧仓库和教师/公开审批状态。

## 停止条件
目标目录已存在、原件哈希不一致、读写权限不足、数据意外追踪、任何Git源历史要求被覆盖。遇此立即报告并不冒进。

## 报告
结果见docs/reports/REPORT-002-governance-and-rename.md，最终更新STATE/PROGRESS。
