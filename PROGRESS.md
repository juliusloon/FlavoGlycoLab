# FlavoGlycoLab 项目进度总览

最后核对：2026-10-16。此文是按阶段的看板，工程当前事实以STATE.md为准，历史过程看对应REPORT。

| 阶段 | 目标 | 状态 | 证据/阻断 |
| --- | --- | --- | --- |
| G0 仓库隔离与资料保全 | 独立Git、原始资料内部可取、来源SHA | Completed (engineering) | TASK-001；122真实来源、3059资源、受限资料不入Git |
| G1 名称与治理闭环 | 项目更名、根文档、模板规范与责任表 | Completed (local governance) | TASK-002；详见REPORT-002 |
| 公开代码与进展对照 | 中文入口、受限数值撤下、同名GitHub代码仓库 | 执行中 | TASK-003；独立公开快照验收中，公众教学发布仍未启动 |
| S1 科学案例身份与许可 | 异槲皮苷、21命中、Pei/Zhang/Niu逐条复核 | Blocked on expert review | 22/22未审，许可未核 |
| S2 可教学定量数据 | 来源实验设计/观测/条件准入，D1依据 | Planned | 0项教师核验的教学真值 |
| E1 课程与实验 | 24步教学、酶法主线、工程菌比较 | Planned | 课程/实验模块scaffold |
| E2 教学服务 | 师生角色、评分及受限AI导师 | Planned | 运行服务未实施 |
| R1 合规与平台发布 | 授权、数据隔离、安全、iLab接入 | Planned | 单独发布门未启动 |

状态含义：Completed只覆盖注明的工程/治理验收；Blocked说明缺专业审批；Planned不表示启动。不得将工程完成率汇总为教学发布就绪率。

## 里程碑证据
- TASK-001：完成自包含证据读取与字节级保护。
- TASK-002：复用CondRxnBench操作管理机制，产生独立PROJECT/ARCHITECTURE/STATE/PROGRESS及事前/事后/长期决定模板，项目名由FutureHealth调整为FlavoGlycoLab。
- TASK-003：进展对照及公开代码快照同步，验收以REPORT-003为准；不执行原顺延为TASK-004的可行性草案。
