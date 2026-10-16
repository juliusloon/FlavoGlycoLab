# REPORT-003：进展对照与公开代码仓库同步

## 对应任务
- TASK文件：docs/tasks/TASK-003-progress-public-repository.md
- 状态：执行中，最终验收待填写
- 基线提交与分支：286ec2f，main；工作分支codex/progress-public-repository
- 结果提交：pending；本地原历史与公开快照为两个不同Git历史，不推送含受限值的旧历史。
- 授权来源：human_direct，2026-10-16所有者要求进展分析及同名public GitHub同步。

## 进展结论与可行性目标对照

**本仓库已完成独立候选证据基础与治理闭环，尚未形成可运行的虚拟教学实验。** 可行性报告是2026-10-15历史规划输入，本次不重新核验外部政策或作2026申报就绪判定。

| 可行性报告中的目标 | 本仓库实际交付 | 缺口与依据 |
| --- | --- | --- |
| 来源可追溯与证据分层（第3、6节） | 123条登记、122项原件，3,059条候选资源及SQLite，只读目录活动运行 | 少1项系统元数据；资源数不能作为实验数。见metadata/active.json、source_registry和catalog.py |
| 一个可审定主案例及两类模块（第1、6节） | 异槲皮苷主案例1项、历史结构命中21项，全部待审 | 教师批准0；21项涉及5个来源文件，不是21项独立酶法研究。见case_admission.csv |
| 实验观测驱动D1（第8、13节） | 来源/案例登记与量化缺口可定位 | 无教师批准的观测包；experiment仅占位。6篇参考索引不代表全文数据抽取完成 |
| 24步操作与确定性评分（第7节） | 原报告有建议脚本，仓库保留规划 | curriculum、teaching与experiment未实现，无实际投料/取样/分析闭环 |
| 受控AI、师生服务（第9、11节） | 活动业务仅evidence；历史搜索代码只作参考 | 无导师、角色、会话、队列、评分或前端。历史MCTS/Web属于FlavoRetro，不能计入本库功能 |
| iLab、试教、公开运行（第10—14节） | 本轮仅建立公开代码与文档仓库 | 无业务接口回执、教学URL、安全/容量/浏览器验收；教学成效及运行指标未测，数值为null |
| 独立治理及许可保护 | TASK-001/002、4项ADR及本轮TASK/REPORT闭环 | 工程通过不晋升研究、教师或教学发布门；公开代码另作快照审计 |

双轨规划已存在于ROADMAP，但可行性门槛草案仍为Proposed。本轮正式使用TASK-003，原草案仅顺延TASK-004并修正引用；不执行F0—F4调查、申报决定或后续建设。不计算缺乏合理分母的“总体完成百分比”。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 访问入口与工程元数据 | README.md、pyproject.toml | 中文项目介绍、进展与公开/私有检查分流、真实仓库链接 |
| 当前事实与规划归属 | STATE、PROGRESS、ARCHITECTURE、ROADMAP | 区分公开代码与教学发布；登记导出脚本、公开检出及草案顺延 |
| 执行证据 | 本TASK/REPORT、docs索引、proposal草案 | 新合同/报告及编号引用；原草案不执行 |
| 公开界面与守卫 | .github、tests/test_governance.py | 中文显示、标签关联及连续任务编号守卫 |
| 许可与公开导出 | LICENSES/README、scripts/export_public_repository.py | 文档许可链接、受限数值撤下及可重现导出 |
| 已有修改保全 | PROJECT、TASK/REPORT-002、研究报告及原ROADMAP改动 | 保留启动时已存在修改；原研究报告字节不变 |

## 实际操作与观察
1. 读取PROJECT→STATE→ARCHITECTURE→合同，核对指定研究报告，并以独立只读审计交叉检查进展与公开边界。
2. 初始历史4提交、157个可达对象、94个独立blob；禁止数据路径和二进制载荷为0，所查高风险凭据模式匹配0。
3. 发现两个case_admission历史blob含11项未获再分发许可的数值，停止全历史公开方案。10项原有missing和1项主案例的非适用状态另行保留。
4. 使用独立公开快照撤下11项数值；本地原表、旧提交和所有来源原件保持。公开检出仅从已提交树生成，无旧parent，不执行push --all或force push。

## 验证
| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `python3 -m unittest discover -s tests -v` | 18/18通过，包含SQLite只读完整性、23个唯一冻结来源/24个目标SHA和路径隔离 |
| `PYTHONPATH=src python3 -m flavoglycolab.evidence.catalog --workspace . --verify-sources` | 3,059资源、22待审/0教师批准；123登记/122现存，122/122字节校验通过，唯一缺失为OS元数据 |
| 原研究报告SHA | `27c67394e706409634f8ae3fc3ad9130eb3757faaac97d56af3496f14fc9f073`，保持原字节 |
| 原案例表SHA | `b9662cd99142091e6097a316e6d79782cc76b43d8c38eadb34779b32d1aa1cc7`，保持原字节 |
| 导出器初验 | 对286ec2f导出84文件，11项撤下/10项missing；非空目标、外部目标、非法ref、未知状态、受限路径/二进制及凭据拒绝；重复撤下不改变公开表字节 |
| `git diff --check` | 通过 |
| 正式公开检出、远端与CI | 待同步后填写实际结果 |

## 与任务合同的偏差
初拟审计通过后推送原历史，实际发现受限数值，改为本地保留原历史、仅同步清理后的独立公开快照。修订已写回事前合同，属于完成已授权公开同步所需的安全技术选择，不是来源再分发批准。

## 数据、许可与审核门
- research_evaluation：历史候选，无新独立化学验证。
- teaching_case_review：22条pending_teacher_review，human_review_status=not_performed，教师批准0。
- public_teaching_release：not_started；metadata的public_release=false保持。GitHub公开仅限允许的代码、文档和登记元数据。
- 123条原始来源均未清理再分发许可；raw/derived/private、第三方全文与权重不公开。原创代码Apache-2.0、原创文档CC BY4.0，第三方材料继承原许可。

## 已发现但未改的问题
案例身份/方向/重复、论文条件和原测量、数据/展示许可仍待专业人员确认；无课程负责人、平台承载或校内推荐的新增证据。历史REPORT-002中的下一TASK建议属于当时快照，以本轮登记及STATE为当前编号。

## 遗留风险、仓库与CI
创建及同步完成后在此补齐GitHub实际元数据、两个Git历史、公开SHA与CI。禁止后续将本地main或旧分支直接推至公开远端；只能从清理后的公开检出同步。

## 建议的下一TASK
TASK-004可行性门槛仍未批准；案例证据、课程合同和服务合同按ROADMAP分别定约，不能因公开代码自动启动。
