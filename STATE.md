# FlavoGlycoLab 当前状态

截至2026-10-25。学生端是可运行的本机/LAN Web原型，24项主线按六阶段组织；真实实验观测为空，22/22案例待教师审定，公众教学发布未启动。

## 本轮三项任务

2026-10-24—25的17项执行记录归并为三项管理任务；归并已完成（文档验收），检查见REPORT-056。原合同/报告保持原路径，完整映射见[任务索引](docs/tasks/README.md#原任务对应表)。

| 任务 | 当前成果 | 报告 |
| --- | --- | --- |
| [054 页面与交互统一](docs/tasks/TASK-054-web-interface-consolidation.md) | 子页面可返回/刷新/续接；共享组件、文案、侧栏折叠、三栏排版与导师入口已统一 | [REPORT-054](docs/reports/REPORT-054-web-interface-consolidation.md) |
| [055 文献阅读与分子学习](docs/tasks/TASK-055-web-reading-molecule-consolidation.md) | 三篇配图/解读、实验速览、任务01/02合页、四便签笔记本、本地PDF阅读与五类分子切换已实现 | [REPORT-055](docs/reports/REPORT-055-web-reading-molecule-consolidation.md) |
| [056 流程稳定性与验收](docs/tasks/TASK-056-web-reliability-management-consolidation.md) | 评价防重/取消/恢复、草稿保全、四回合分析、条件读取、酶量和操作反馈已修复；管理入口已归并 | [REPORT-056](docs/reports/REPORT-056-web-reliability-management-consolidation.md) |

## 运行与交付

| 项目 | 当前事实 |
| --- | --- |
| 默认运行 | `python scripts/dev.py`，默认127.0.0.1:8767，Python3.10+标准库；public配置无需私有数据、模型、Conda、GPU或npm |
| 实际端口 | 历史验收记录8767被其他应用占用；可用`--port`指定空闲端口。LAN常驻原型为8766，本轮未操作服务 |
| 协作与运维 | [collaboration.md](docs/operations/collaboration.md)唯一维护开发/离线交接步骤；[lan-site.md](docs/operations/lan-site.md)唯一维护LAN地址、启停及日志 |
| 实时AI | 可选的本机私有配置；配置成功显示“Qwen · 实时辅导”，无配置/失败可继续本地流程。最新Web回归用受控响应，不是新一轮真实模型/并发验收 |
| 学习记录 | 当前浏览器/站点localStorage，最多12快照，可比较及JSON/Markdown导出；含草稿、独立判断和论文笔记，无账号/跨设备同步 |
| 分析草稿 | 未提交的分析文字仅在页面会话内保留，刷新不恢复；已提交记录、主线草稿及方案按原机制持久化 |
| 答题通行入口 | admin7逐题标记admin_override，不走AI评价、不生成独立判断；不是教师批准或正式评分，正式权限/发布须按[ADR0010](docs/adr/0010-answer-passphrase-workflow.md)复审 |
| 分子与阅读 | 五类分子为计算结构，EMIQ仅Q3M代表组分；三篇原PDF只读，笔记只属学生自述；图文/分子/AI反馈仍待专业审核 |
| 逆合成 | [REPORT-035](docs/reports/REPORT-035-isoquercitrin-retro-handoff.md)仅接收计算来源并校验/保存/导出；动态搜索/仿真未部署；[TASK-036](docs/tasks/proposals/TASK-036-isoquercitrin-coupled-enzyme-evidence-plan.md)为未执行提案 |
| Git | main → public/main；039—056及057导出兼容随227523e提交并推送，远端SHA已核对；本次文档收尾提交由Git日志定位，见[REPORT-057](docs/reports/REPORT-057-web-improvements-git-sync.md) |
| CI | [功能提交227523e的CI](https://github.com/juliusloon/FlavoGlycoLab/actions/runs/40169280889)四项全部通过（Ubuntu/Windows/macOS public-check及browser）；后续文档提交如触发新CI，状态以Actions为准 |

## 工程验证

| 验证层 | 最新证据及限制 |
| --- | --- |
| 本次Git同步 | 工作树与227523e干净检出均Python79（76通过/3显式research跳过）及Node87/87；全树326/326路径/内容守卫、244/244保护SHA、实际快照导出通过；见[REPORT-057](docs/reports/REPORT-057-web-improvements-git-sync.md) |
| 本轮文档整理 | public工程检查通过：Python78（75通过/3显式research跳过）、Node87/87；17/17映射、307/307链接、298/298保护SHA通过，见[REPORT-056](docs/reports/REPORT-056-web-reliability-management-consolidation.md) |
| 最近完整Web回归 | [REPORT-053](docs/reports/REPORT-053-experience-report-reliability.md)：Python78（75通过/3显式research跳过）、Node87/87、工作台1702/1702、跨页692/692、异步专项31/31、8766交互36/36；363保护文件SHA不变、11/11相关资产一致 |
| 阅读/分子专项 | [REPORT-055](docs/reports/REPORT-055-web-reading-molecule-consolidation.md)汇总原图113、笔记本419、便签94及五分子154等原验收；分母有重叠，不合计为新增测试 |
| 验证边界 | 浏览器结果为Chromium及模拟视口；未宣称实体设备、Safari/Firefox、真实模型质量、课堂并发或教学效果已验收。本轮只整理文档，不重跑浏览器 |

## 数据与三个审核门

| 层/状态 | 当前事实 |
| --- | --- |
| 默认public | 22条待审案例、123条历史来源登记和三份指定PDF随Git提供；全量研究record_count=null |
| 历史原件 | 历史登记123/现存122，缺1项OS元数据；五项旧模型非开发依赖。Niu SI独立登记于metadata/literature_supplements.json，原件仅本地 |
| 可选research | 3059混合候选不是3059个实验；内部离线包121文件＝117非模型证据＋4派生，缺失/损坏须显式报错，不公开上传，不含private/密钥/旧模型 |
| 公开案例值 | 11项withheld_unlicensed、10项missing保留；原表在private历史副本保全 |
| 数据缺口 | Pei配比摘录、Zhang条件/动力学及SI标签等仍有核对事项；三路线缺少足以重放的标准曲线/原始测量链，不能给学生样品生成产率或色谱 |
| research_evaluation | 历史候选/计算与工程证据，未确认独立化学实验验证 |
| teaching_case_review | 22/22 pending_teacher_review，human_review_status=not_performed，教师批准0 |
| public_teaching_release | not_started，public_release=false；公开代码与LAN可用不表示正式教学发布 |
| 公开范围 | 三PDF为TASK-008 human_direct精确例外，路径/SHA只在metadata/public_sources.json登记，出版方rights_verified=false；既有选图范围见REPORT-044。其余raw/derived/private不入公共Git |

未完成：具名专业/教师审定、定量数据准入、真实D1仿真、正式评分与师生权限、公众发布专项验收。分工及申报节点以[执行方案](docs/p10ns/261019/申报阶段分工与执行方案_20261019-1026.md)、[实施基线](docs/policy/ilab-2026/readiness-evidence-2026.md)和[交接记录](docs/p10ns/261019/handoff_acceptance.md)为准，不代填签收或批准。

历史过程与失败保留在[REPORT索引](docs/reports/README.md)，阶段与阻断见[PROGRESS](PROGRESS.md)，下一任务须单独授权。
