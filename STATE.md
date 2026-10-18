# FlavoGlycoLab 状态

截至：2026-10-18。当前操作：无在执行TASK，最近完成TASK-007（human_direct：删除本地推送钩子并同步公开更新）。指定钩子已删除，独立公开检出恢复，允许公开的最新更新已推送且治理CI成功。资格、10-27校内截止/10-26内部定版、拟用化学生物学实验课程及本机承载选择已登记；教学授权、公开接入/认证后续落实。业务模块仍仅evidence active，网站/AI/D1/服务部署与申报提交未实施，候选008/009未自动启动。

## 一句话状态
独立证据仓库具备自身来源、候选记录、SQLite与只读校验器；22条案例全部待教师审核，教学仿真、AI导师、师生服务和公众教学发布未实现。TASK-007已更新独立公开代码快照，不包含受限原件、旧历史未授权数值、本地汇报包及两份申报附件。2026申报分工方案仍属工作计划；TASK-006已核实当前Ubuntu并完成实施基线，网站/申报成品实施未开始，三个状态门不变。

## 当前状态元数据
| 项 | 当前事实 |
| --- | --- |
| 项目 | FlavoGlycoLab，原临时项目名FutureHealth |
| 仓库 | 独立本地研究历史；公开快照在temp/public-repository使用新根Git历史，不依赖其他研究repo |
| 当前TASK | 最近完成TASK-007：删除本地推送钩子并同步公开更新；无在执行TASK |
| 前一TASK | TASK-006：2026申报实施基线与Ubuntu承载核实，已完成 |
| 推荐资格 | 所有者2026-10-18会话确认“有”；未附校内书面通知，不据此否定筹备输入 |
| 校内与内部期限 | 所有者确认当前校内2026-10-27截止；内部2026-10-26定版；校内具体时刻及签章/提交安排待补 |
| 拟用课程 | 化学生物学实验课程（所有者确认用途）；不表示已开设或教师量规已通过 |
| 授权与承载 | 教学使用授权后续拟定；目标承载已选当前Ubuntu服务器，主机已只读核实；未部署/未通过公开接入或认证 |
| 主机实况 | Ubuntu24.04.4 LTS；48物理核/96逻辑CPU；125.37 GiB RAM，快照可用26.61 GiB；项目卷可用181.47 GiB；2张RTX PRO6000。均共享，未为本项目预留 |
| 技术基线 | docs/policy/ilab-2026/readiness-evidence-2026.md；起始4逻辑CPU/8 GiB/20 GiB软预算，50会话/10轻量请求及100Mbps均为待验目标，实测容量/时延为null |
| 来源 | 登记123，现存122，缺OS元数据.DS_Store |
| v3候选资源 | 3059条，可本地读取 |
| 候选教学案例 | 22条，pending_teacher_review，人工审核0 |
| P1待审资产 | 12项本地private custody，37项尚未移入 |
| 独立运行 | 本轮完整18/18测试通过、122现存来源核验通过；公开检出治理7/7通过，见REPORT-007 |
| 教学/发布 | 未实现，public_teaching_release=not_started，public_release=false |
| GitHub代码 | [juliusloon/FlavoGlycoLab](https://github.com/juliusloon/FlavoGlycoLab)，public，独立公开main；治理CI通过 |
| Git同步位置 | 按所有者指令删除本地pre-push钩子；研究main无公开upstream；已恢复temp/public-repository，使用其origin/main同步公开文件树 |
| 公开边界 | 导出副本11项历史数值为withheld_unlicensed，10项missing保留；本地原表与旧历史不公开 |
| 本轮公开排除 | docs/p10ns/261017/本地汇报包及两份DOCX/PDF申报附件；原文件保留本地，未知载荷继续拒绝导出 |

上述来源、v3与P1计数指原本地研究工作区；公开克隆不含这些私有资产。`temp/public-repository/`是原工作区的公开导出位置，公开克隆本身无需此目录。

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
- TASK-007：已删除指定本地钩子并恢复独立公开检出，101文件公开/35文件排除，11项数值脱敏/10项missing保留；18/18本地、7/7公开治理、168/168保护字节核对与公开历史复核通过，普通push及治理CI成功。原候选007/008顺延008/009，仍未批准；过程失败与完整分母见REPORT-007。
- TASK-006：完成当前Ubuntu主机只读核实及唯一实施基线；26项字段、9项目标、17项条件、13条交接、24步范围和54个活跃链接检查通过，治理7/7；7项输入SHA、125项受保护文件及Git索引/HEAD不变。008/009、安装/服务启动、部署、压测、申报提交未执行；见docs/reports/REPORT-006-feasibility-gate.md。
- TASK-005：完成15项范围与13条交接审计、文档准备008与本地演示009两份Proposed合同；治理7/7、5项输入SHA及49个本地链接检查通过。原可行性草案仅顺延006、未执行；008/009未获实施授权，准备稿成品/前端代码/部署均未开始。审计见docs/reports/REPORT-005-ljx-independent-work-audit.md。
- TASK-004：本地最终HTML的22页主讲、7页附录及讲稿全部改写为面向老师的中文；保留29页、互动和科学状态。结构、29页Chromium显示与7项治理检查通过，尚未现场投屏；见docs/reports/REPORT-004-presentation-language.md。汇报包后续已入本地研究Git，TASK-007公开导出仍排除该包，仅公开治理合同/报告。
- TASK-003：完成进展对照、中文仓库入口及同名public代码仓库同步；发现受限数值后采用独立公开历史，根快照CI通过。原表和私有来源不变，验收见docs/reports/REPORT-003-progress-public-repository.md。
- TASK-002：实施项目名称与治理体系改造。逐文件结果见docs/reports/REPORT-002-governance-and-rename.md。
- TASK-001：完成122项可用原件、3059候选资源本地自包含核验；11项工程检查通过，历史科学结论未复核。

## 冻结资产与禁止碰触
- data/raw、data/derived、data/private的原始字节与第三方许可状态。
- migrations中的迁移SHA和历史路径归属证据；更名只更新项目自身身份，不重写旧项目操作历史。
- 参考快照的23个源文件保持哈希一致。
- 未经教师或许可审批不得升格 case_admission 或发布/训练/评分真值。
- 不引用外部工作区来满足活动程序执行条件。

## 未解决事项
1. 校内截止时刻、签章/提交流程、具名课程负责人和授权待落实。推荐资格/日期和本机承载选择已确认，不再整体标未知；网络入口、资源配额、带宽/容量、服务/安全凭据仍待验。
2. 异槲皮苷主案例身份、21条反应来源/方向与重复计数需教师核验。
3. Pei2019、Zhang2015、Niu2024实际实验条件/可用定量数据及再分发权需逐篇核对。
4. 面向学生的D1仿真、24步课程、审核流程与公开部署均未开发。
5. 本地raw/derived/private及含未授权数值的旧Git历史不推送到公开远端。公开代码不含可教学定量数据；不得直接push本地main或旧分支。

## 下一任务建议（未批准）
- 文档准备：docs/tasks/proposals/TASK-008-ljx-document-preparation.md，五项沟通问法、6/7栏底稿、站会模板；估算0.75人日，无同事交接前置，未编制成品。
- 本地演示：docs/tasks/proposals/TASK-009-ljx-local-demo.md，W-01/W-05完整演示范围及W-02/03/04局部；估算2.25人日，不接模型/真实数值、不部署，前端仍scaffold。
- 007仅执行Git同步，008/009仍可分别批准，候选号按实际批准次序连续登记，不自动执行。实际沟通由LJX负责；T-Z1/T-Y1/T-H2接收、科学/教学审定、真实部署/定版另行定约。D-07后续实施与D-08 Git取舍仍待决定。
