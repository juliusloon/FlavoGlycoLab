# FlavoGlycoLab 状态

截至：2026-10-16。当前操作：TASK-003，进展对照与公开代码仓库同步（执行中）。以下状态区分本地证据、公开代码与教学发布。

## 一句话状态
独立证据仓库已具备自身原始来源、候选记录、SQLite与只读校验器；22条案例全部待教师审核，教学仿真、AI导师、师生服务和公众教学发布仍未实现。公开代码快照正在独立验收，不包含受限原件与旧历史中的未授权数值。

## 当前状态元数据
| 项 | 当前事实 |
| --- | --- |
| 项目 | FlavoGlycoLab，原临时项目名FutureHealth |
| 仓库 | 独立本地研究历史；公开快照在temp/public-repository使用新根Git历史，不依赖其他研究repo |
| 当前TASK | TASK-003：进展对照与公开代码仓库同步 |
| 前一TASK | TASK-002：更名与治理，已完成 |
| 来源 | 登记123，现存122，缺OS元数据.DS_Store |
| v3候选资源 | 3059条，可本地读取 |
| 候选教学案例 | 22条，pending_teacher_review，人工审核0 |
| P1待审资产 | 12项本地private custody，37项尚未移入 |
| 独立运行 | Python标准库只读校验；测试见TASK-002 REPORT |
| 教学/发布 | 未实现，public_teaching_release=not_started，public_release=false |
| GitHub代码 | 待创建juliusloon/FlavoGlycoLab；最终状态以本轮REPORT及远端核验为准 |
| 公开边界 | 导出副本11项历史数值为withheld_unlicensed，10项missing保留；本地原表与旧历史不公开 |

## 当前模块状态
| 层 | 状态 | 说明 |
| --- | --- | --- |
| 来源原件及注册表 | local active restricted | 源SHA与许可登记保留 |
| 衍生v3数据 | local candidate | 不是教师通过的数据集 |
| evidence catalog | active read-only | 能本地核验、分组汇总 |
| chemistry | scaffold | 无完成身份/反应方向的系统级教师认证 |
| experiment | scaffold | 无真实D1量化仿真 |
| teaching | scaffold | 24步课程未实施 |
| platform | scaffold | 无用户/会话/开放API |
| frontend | scaffold | 学生与教师页面未建设 |

## 最新操作
- TASK-003：依据指定研究报告对照进展；发现登记表旧历史含未授权数值，改用独立公开快照；实际验收见docs/reports/REPORT-003-progress-public-repository.md。
- TASK-002：实施项目名称与治理体系改造。逐文件结果见docs/reports/REPORT-002-governance-and-rename.md。
- TASK-001：完成122项可用原件、3059候选资源本地自包含核验；11项工程检查通过，历史科学结论未复核。

## 冻结资产与禁止碰触
- data/raw、data/derived、data/private的原始字节与第三方许可状态。
- migrations中的迁移SHA和历史路径归属证据；更名只更新项目自身身份，不重写旧项目操作历史。
- 参考快照的23个源文件保持哈希一致。
- 未经教师或许可审批不得升格 case_admission 或发布/训练/评分真值。
- 不引用外部工作区来满足活动程序执行条件。

## 未解决事项
1. 异槲皮苷主案例身份、21条反应来源/方向与重复计数需教师核验。
2. Pei2019、Zhang2015、Niu2024实际实验条件/可用定量数据及再分发权需逐篇核对。
3. 面向学生的D1仿真、24步课程、审核流程与公开部署均未开发。
4. 本地raw/derived/private及含未授权数值的旧Git历史不推送到公开远端。公开代码不含可教学定量数据；不得直接push本地main或旧分支。

## 下一任务建议（未批准）
TASK-004 草案：双轨可行性门槛与2026申报决策包，见 docs/tasks/proposals/TASK-004-feasibility-gate.md。原候选编号TASK-003因本次直接批准的公开同步任务而顺延；双轨规划方向已选择，草案仍未授权执行。异槲皮苷案例来源/身份审查另行定约。
