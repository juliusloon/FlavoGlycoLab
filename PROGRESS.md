# FlavoGlycoLab 里程碑与阻断

截至2026-10-26。当前事实以[STATE](STATE.md)为准；此处只记录阶段成果和阻断。工程完成不等于科学、课程或公众发布完成。

## 近两天：三项Web改进

| 管理任务 | 里程碑成果 | 状态与证据 |
| --- | --- | --- |
| 054 页面与交互统一 | 可恢复的子页面、共享组件与文案、侧栏/三栏布局、导师入口统一 | 工程成果已归并（文档验收）；[REPORT-054](docs/reports/REPORT-054-web-interface-consolidation.md) |
| 055 文献阅读与分子学习 | 三论文图文、速览与任务合页、笔记本/PDF、五分子与通行入口 | 工程成果已归并（文档验收）；[REPORT-055](docs/reports/REPORT-055-web-reading-molecule-consolidation.md) |
| 056 流程稳定性与验收 | 异步评价/草稿一致性、分步分析/条件/操作反馈，管理入口归并 | 工程成果已归并（文档验收）；[REPORT-056](docs/reports/REPORT-056-web-reliability-management-consolidation.md) |

覆盖2026-10-24—25的17项执行记录，完整编号映射与原件见[任务索引](docs/tasks/README.md#原任务对应表)。原报告保留历史验证和失败，里程碑不再逐项堆叠重复验收数字。

2026-10-25交付：三项Web改进及管理归并已随227523e同步public/main；工作树/干净检出与326文件公开核验通过，CI及同步事实见[REPORT-057](docs/reports/REPORT-057-web-improvements-git-sync.md)。

## 本次页面调整

2026-10-26：[TASK-063](docs/tasks/TASK-063-bottom-card-notebook-tutor-entry.md)按所有者澄清将内容高度问答卡改为底边衔接笔记本入口，同时补齐论文modal上方的可点击AI导师图标；保留062排版/删减，见[REPORT-063](docs/reports/REPORT-063-bottom-card-notebook-tutor-entry.md)。

2026-10-26：[TASK-062](docs/tasks/TASK-062-content-height-floating-tutor.md)完成内容高度问答卡、移除导入快捷入口、导师覆盖浮层及论文阅读排版/删减。8766专项和跨页、临时public完整流程验证通过；未重启常驻服务或提交/push，三个审核门不晋级。见[REPORT-062](docs/reports/REPORT-062-content-height-floating-tutor.md)。

2026-10-25：[TASK-061](docs/tasks/TASK-061-panel-height-sidebar-sync.md)完成主线/历程联动折叠、纯图标更多及双栏纵向对齐；桌面右卡与论文笔记本保持16px，窄屏维持流式。public工程、完整实验/跨页/四任务专项及折叠几何实测通过，8766静态字节一致，未重启服务或提交/push；见[REPORT-061](docs/reports/REPORT-061-panel-height-sidebar-sync.md)。

2026-10-25：[TASK-060](docs/tasks/TASK-060-task04-content-layout.md)完成任务04重复文案删减，短说明/路线选择置于主面板论文卡片上方，右侧只保留问题与作答；实际LAN专项244项通过，未操作服务或提交/push，见[REPORT-060](docs/reports/REPORT-060-task04-content-layout.md)。

2026-10-25：[TASK-059](docs/tasks/TASK-059-case-route-flow.md)完成案例与路线四任务及总结页调整；首次路线选择移至04，01—03成为共通学习，初选R2/R3不再重走流程。public工程、完整实验/跨页/专项及异步浏览器验收通过，8766恢复既有托管并加载新评价目标，未提交/push；实测与旧记录边界见[REPORT-059](docs/reports/REPORT-059-case-route-flow.md)。

2026-10-25：[TASK-058](docs/tasks/TASK-058-route-tasks-single-page.md)按所有者要求完成任务03/04各自合页及答题提示删减；public工程、完整浏览器流程、合页专项与异步回归通过，常驻8766两项资产已读取新版本，未重启或提交/push；实测与限制见[REPORT-058](docs/reports/REPORT-058-route-tasks-single-page.md)。

## 更早里程碑

| 阶段 | 已完成的工程/文档成果 | 证据入口 |
| --- | --- | --- |
| 资料基础与治理 | 自包含证据读取、来源保护、命名与治理、公开代码与数据范围 | [REPORT-001](docs/reports/REPORT-001-standalone-data-foundation.md)、[002](docs/reports/REPORT-002-governance-and-rename.md)、[003](docs/reports/REPORT-003-progress-public-repository.md)、[008](docs/reports/REPORT-008-pdf-public-sync.md)、[009](docs/reports/REPORT-009-normal-git-push.md) |
| 汇报与申报技术准备 | 老师汇报、LJX范围/实施基线、6/7栏底稿与交接准备 | [REPORT-004](docs/reports/REPORT-004-presentation-language.md)、[005](docs/reports/REPORT-005-ljx-independent-work-audit.md)、[006](docs/reports/REPORT-006-feasibility-gate.md)、[014](docs/reports/REPORT-014-ljx-technical-preparation.md) |
| 可协作实验台 | 网站/LAN、交互工作台、可选AI、public默认运行与离线research交接 | [REPORT-010](docs/reports/REPORT-010-website-scaffold.md)、[011](docs/reports/REPORT-011-lan-deployment.md)、[012](docs/reports/REPORT-012-interactive-workbench.md)、[013](docs/reports/REPORT-013-collaboration-ready.md) |
| 证据与教学过程接入 | 文献/SI/交接、六阶段24项主线、案例/数据查询、导师评价与结果解析 | [REPORT-015—027历史索引](docs/reports/README.md#更早报告)；只是候选内容/过程交互，未完成课程验收 |
| 10月23日体验与工程修复 | 可点提示、论文对照、单幕导入、PDF可用性、Git原字节/MIME守卫、逆合成来源接收 | [REPORT-028—035历史索引](docs/reports/README.md#更早报告)；035为计算来源交接，036未执行 |

## 当前阻断与后续条件

| 事项 | 状态 | 解除条件/责任 |
| --- | --- | --- |
| 科学身份、条件与许可 | 待专业审核；22/22案例未审 | 所有者组织具名专业/教师及持权方审定；[待决事项](docs/decisions-needed.md) |
| 定量仿真与结果 | 缺可准入的原始测量链，真实观测为空 | 核验标准曲线、原始测量、条件与使用权限，再另立实施TASK；[数据缺口](docs/p10ns/261019/data_gap_list.md) |
| 正式课程、量规与评分 | 过程交互已实现，教师验收未完成 | 教师审定课程/量规，按[验收标准](docs/acceptance-criteria.md)独立验收 |
| 权限与公众发布 | 师生账号/正式权限未实现，public_teaching_release=not_started | 单独授权发布TASK，完成许可、权限、安全与平台验收；通行入口按ADR0010复审 |

下一步只列条件，不自动执行。交接与校内节点仍由[执行方案](docs/p10ns/261019/申报阶段分工与执行方案_20261019-1026.md)和[交接唯一记录](docs/p10ns/261019/handoff_acceptance.md)维护。
