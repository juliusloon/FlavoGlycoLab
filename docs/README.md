# 项目文档索引

- PROJECT.md：长期项目合同；禁止改成日常操作流水。
- STATE.md：单一的当前事实与Agent交接状态。
- PROGRESS.md：阶段/里程碑进度表。
- ARCHITECTURE.md：组件责任及Artifact Registry。
- ROADMAP.md：计划与依赖，不是执行授权。
- AGENTS.md：自动化助手阅读顺序、停止条件、最小变更约束。
- docs/tasks/：事前任务合同、编号和模板。
- docs/reports/：事后事实报告、编号和模板。
- docs/adr/：长期设计决策、模板和复审条件。
- docs/data-governance.md：来源、许可、身份、教学真值和发布准入。
- docs/acceptance-criteria.md：各阶段最低验收要求。
- docs/decisions-needed.md：需专业/所有者决定的开放事项。
- docs/cases/isoquercitrin/：当前候选案例，未经过教师审核。
- docs/research/：2026可行性调研原文和来源说明；规划输入，不构成教师/发布批准。
- docs/p10ns/：面向特定汇报与申报节点的阶段性材料（261017老师汇报、261019申报分工方案）；属执行层文档，不改变治理合同与状态门。

进展分析与公开代码同步见[REPORT-003](reports/REPORT-003-progress-public-repository.md)。所有者确认资格、10-27校内截止/10-26内部定版、拟用化学生物学实验课程，并指定当前Ubuntu服务器后，正式授权[TASK-006](tasks/TASK-006-feasibility-gate.md)。[实施基线](policy/ilab-2026/readiness-evidence-2026.md)与[REPORT-006](reports/REPORT-006-feasibility-gate.md)记录主机实况、项目预算、技术目标、条件与交接；教学授权/公开接入/认证后续落实，容量未压测，服务未部署。

本地推送钩子删除和公开更新见[TASK-007](tasks/TASK-007-remove-hook-public-sync.md)与[REPORT-007](reports/REPORT-007-remove-hook-public-sync.md)。公开导出明确排除本地汇报包及两份申报附件，公开历史仍与研究历史分离；文档准备/本地演示候选顺延010/011。

老师汇报HTML全文表达优化见[REPORT-004](reports/REPORT-004-presentation-language.md)；仅本地文档交付，没有启动案例审定、教学建设或可行性调查。2026申报冲刺的[分工与执行方案v2.1](p10ns/261019/申报阶段分工与执行方案_20261019-1026.md)为所有者human_direct工作计划；实施仍须TASK授权，未启动。

[REPORT-005](reports/REPORT-005-ljx-independent-work-audit.md)审计LJX独立范围与13条交接；[文档准备010](tasks/proposals/TASK-010-ljx-document-preparation.md)和[本地演示011](tasks/proposals/TASK-011-ljx-local-demo.md)仍为可分别批准的Proposed合同，成品/代码尚未实施，006不自动启动它们。历史报告/汇报保留当时草案路径和状态，活跃任务入口以上述正式索引为准。

三篇PDF公开与日常git publish入口见[TASK-008](tasks/TASK-008-pdf-public-sync.md)、[REPORT-008](reports/REPORT-008-pdf-public-sync.md)。候选合同顺延010/011，不自动执行。

当前Git操作以[TASK-009](tasks/TASK-009-normal-git-push.md)/[REPORT-009](reports/REPORT-009-normal-git-push.md)为准：当前main直接普通push，不再依赖独立检出同步。历史报告保留当时两套历史的事实。

- [协作成员本地运行与数据交接](operations/collaboration.md)：无需服务器账号，默认public；仅研究任务需要离线研究包。

- [LJX技术底稿](p10ns/261019/shenbaoshu_sections_LJX.md)、[交接/接入](p10ns/261019/handoff_acceptance.md)、[站会](p10ns/261019/standup_log.md)、[品牌浏览器验收](operations/browser-acceptance.md)：TASK-014技术准备与真实证据。

- [TASK-015](tasks/TASK-015-literature-handoff-integration.md) / [REPORT-015](reports/REPORT-015-literature-handoff-integration.md)：HYK文献交接核对、三路线非数值说明及[data_gap_list.md](p10ns/261019/data_gap_list.md)代理准备稿；不代表教师准入或D1已可用。

- [TASK-016](tasks/TASK-016-supplement-reconciliation.md) / [REPORT-016](reports/REPORT-016-supplement-reconciliation.md)：三篇SI查证、Niu附件与官方字节匹配及七项材料核对；元数据唯一登记于metadata/literature_supplements.json，原件不入Git。

- [TASK-017](tasks/TASK-017-delegated-handoffs-lab-enrichment.md) / [REPORT-017](reports/REPORT-017-delegated-handoffs-lab-enrichment.md)：[案例证据表](p10ns/261019/case_evidence_table.md)、[24步设计](p10ns/261019/24step_table_3-6.md)、B1/B2脚本由代理补齐并交LJX接入；实验台已有24项非数值练习和可调宽度助手，教师/正式课程/成片仍待后续。

- [TASK-022](tasks/TASK-022-intro-narrative-paper-access.md) / [REPORT-022](reports/REPORT-022-intro-narrative-paper-access.md)：四幕导入叙事（挂源介绍→化学受限→三篇文献卡与同源PDF/要点→主线探究）、`/api/paper`只读端点与AI导师阅读上下文；8766未重启，三状态门不晋级。

- [TASK-023](tasks/TASK-023-guided-intro-steps.md) / [REPORT-023](reports/REPORT-023-guided-intro-steps.md)：双角色（老师/学生）实走评测；导入三幕改为需交互推进的步骤（分子观察题/合成难处题/论文卡门禁），任务01观察引导与参考示例，问导师预填入口；603项浏览器验收通过，三状态门不晋级。

- [TASK-024](tasks/TASK-024-zyt-handoff-figure-casepage.md) / [REPORT-024](reports/REPORT-024-zyt-handoff-figure-casepage.md)：接办ZYT 10-22三交件；按文字稿制作[图1](../frontend/student/assets/figures/route_map_v1.svg)、接入只读[案例页](../frontend/student/case.html)（S1—S6/5分子/3路线/10行对照/5参考文献），产出[24步状态表](p10ns/261019/24step_status_LJX.md)与B1镜头8/9真实界面截图；全部内容待教师审定，不晋级三状态门。

- [TASK-025](tasks/TASK-025-lyw-handoff-data-query.md) / [REPORT-025](reports/REPORT-025-lyw-handoff-data-query.md)：接办LYW 10-22三交件（[v2科学24步](p10ns/261019/24step_teaching_matrix_LYW_v2.md)、[评价说明](p10ns/261019/evaluation_rubric_LYW_v1.md)、[B2执行版](p10ns/261019/b2_shotlist_LYW_v1.md)）；新增只读[数据查询页](../frontend/student/data.html)（21条文献报告值/筛选/深链/空状态），按本机Qwen实况更新AI标识，并按v2重算[24步状态表](p10ns/261019/24step_status_LJX.md)为13/9/2；三状态门不晋级。

- [TASK-018](tasks/TASK-018-immersive-inquiry-workspace.md) / [REPORT-018](reports/REPORT-018-immersive-inquiry-workspace.md)：[现行探究空间设计](design/workbench.md)、[分子资产来源](../frontend/student/assets/molecules/README.md)，三案例与顺序主线、按需AI；替代固定侧栏和长折叠表单布局。
- [TASK-019](tasks/TASK-019-teaching-matrix-route-analysis.md) / [REPORT-019](reports/REPORT-019-teaching-matrix-route-analysis.md)：24步拟议矩阵/数据依赖角标、[三路线结论与反思](p10ns/261019/three_route_analysis_LJX.md)、H02/H03当日转交；教师/发布门不晋级（历史代理假设）。
- [TASK-020](tasks/TASK-020-actual-handout-reconciliation.md) / [REPORT-020](reports/REPORT-020-actual-handout-reconciliation.md)：按[LYW v5实际动作](p10ns/261019/24step_teaching_matrix_LYW_v5.md)重排六界面×4步、移除未提交量规，[三路线报告值](p10ns/261019/three_route_analysis_LJX.md)标“原文报告/非本次观测”；教师/发布门不晋级。
- [TASK-021](tasks/TASK-021-ui-copy-cleanup.md) / [REPORT-021](reports/REPORT-021-ui-copy-cleanup.md)：清理界面注释性文案与文献卡片重复箭头，保留24步任务、反馈、来源定位及必要证据边界；不改变科学/教师/发布门。
