# REPORT-007：删除本地推送钩子并同步公开更新

## 对应任务
- TASK文件：docs/tasks/TASK-007-remove-hook-public-sync.md
- 状态：执行中，尚未完成公开推送验收
- 基线提交与分支：3ebd036，main；原公开main为fd81bd2
- 结果提交：pending，未推送
- 授权来源：human_direct，2026-10-18所有者明确要求“把这个钩子删掉然后同步”。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 本地Git配置 | .git/hooks/pre-push | 已删除，未安装替代钩子；不属于Git跟踪文件 |
| 公开导出 | scripts/export_public_repository.py | 明确排除本地汇报包和两份附件，输出路径、原因和分母；其余守卫保留 |
| 当前事实及导航 | README、STATE、PROGRESS、ARCHITECTURE、ROADMAP、docs/README、docs/decisions-needed、任务/报告索引 | 更新钩子删除、公开同步与候选入口 |
| 合同与报告 | TASK/REPORT-007-remove-hook-public-sync.md | 记录本次授权、修改边界和真实验收 |
| 未批准候选 | proposals/TASK-007-ljx-document-preparation.md → TASK-008-ljx-document-preparation.md；TASK-008-ljx-local-demo.md → TASK-009-ljx-local-demo.md | 顺延占位编号与活跃引用，未启动实施；历史TASK/REPORT未修改 |
| 本地过程暂存 | temp/public-repository、temp/task-007/ | 从现有远端恢复公开检出；保存保护字节基线及删除钩子的本地副本，不入Git |

## 实际操作与观察
1. 读取项目合同、当前状态、架构、模板及现有公开合同；定位本地钩子按URL拒绝推送。
2. 保存168项受保护文件SHA后删除指定钩子；从现有GitHub main恢复独立检出，不重建/覆盖公开根历史。
3. 本地最新提交包含9项导出器拒绝的二进制：7个字体和DOCX/PDF附件。按现有公开范围明确排除整个本地汇报目录及两份附件，原文件与研究提交不改。
4. 本轮正式编号007；原候选007/008顺延008/009，未批准状态与业务范围不变。
5. 导出验证、公开历史审计、普通推送与远端CI待执行，下表仅填写已运行结果。

## 验证
| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| 指定钩子 | `.git/hooks/pre-push`已不存在；没有替代钩子 |
| 受保护基线 | 168文件SHA已保存，最终对照待执行 |
| 原公开main | 远端读取fd81bd2fcfdcedc6f1619432ff9425aa8f6638a6，clone已完成 |
| 本地/公开治理 | 待执行 |
| 公开导出与历史审计 | 待执行 |
| 普通push与远端CI | 待执行 |

## 与任务合同的偏差
当前无新增偏差。没有直接推送研究main；同步采用现有独立公开历史与脱敏文件树。

## 数据、许可与审核门
- research_evaluation：历史候选，未新增化学实验或独立科学验证。
- teaching_case_review：22项pending_teacher_review，教师批准0。
- public_teaching_release：not_started；public_release=false。此次仅公开代码/原创文档更新，不授予第三方再分发许可。

## 已发现但未改的问题
- 本地研究main与公开main历史独立，删除钩子不会自动把原工作区的普通push转换成脱敏同步。
- 本地汇报包和两份附件保留本地，不包含在本轮公开更新。

## 遗留风险、仓库与CI
本地main保留所有旧提交与原数据，未设置公开upstream。公开检出origin/main恢复成功；本轮提交、push及CI仍待完成。

## 建议的下一TASK
候选文档准备008和本地演示009仍待各自授权；本轮不自动启动。
