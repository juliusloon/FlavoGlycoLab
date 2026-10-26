# FlavoGlycoLab 当前状态

截至2026-10-26。学生端是可运行的本机/LAN Web原型，24项主线按六阶段组织；真实实验观测为空，22/22案例待教师审定，公众教学发布未启动。

## 本轮三项任务

2026-10-24—25的17项执行记录归并为三项管理任务；归并已完成（文档验收），检查见REPORT-056。原合同/报告保持原路径，完整映射见[任务索引](docs/tasks/README.md#原任务对应表)。

| 任务 | 当前成果 | 报告 |
| --- | --- | --- |
| [054 页面与交互统一](docs/tasks/TASK-054-web-interface-consolidation.md) | 子页面可返回/刷新/续接；共享组件、文案、侧栏折叠、三栏排版与导师入口已统一 | [REPORT-054](docs/reports/REPORT-054-web-interface-consolidation.md) |
| [055 文献阅读与分子学习](docs/tasks/TASK-055-web-reading-molecule-consolidation.md) | 三篇配图/解读、实验速览、任务01/02合页、四便签笔记本、本地PDF阅读与五类分子切换已实现 | [REPORT-055](docs/reports/REPORT-055-web-reading-molecule-consolidation.md) |
| [056 流程稳定性与验收](docs/tasks/TASK-056-web-reliability-management-consolidation.md) | 评价防重/取消/恢复、草稿保全、四回合分析、条件读取、酶量和操作反馈已修复；管理入口已归并 | [REPORT-056](docs/reports/REPORT-056-web-reliability-management-consolidation.md) |

通用答题栏已依[TASK-058](docs/tasks/TASK-058-route-tasks-single-page.md)删除草稿清空/载入提示及“作出你的判断”标题，保留选项组可访问名称和草稿机制；03/04继续保持单页，内容组织现按TASK-059。此前合页验证保存在[REPORT-058](docs/reports/REPORT-058-route-tasks-single-page.md)，改动尚未提交/push。

TASK-059在此基础上完成四任务及总结页调整：01单页明确实验目标与结果记录；02扩大分子画布，资料卡/工具置于框内上方，来源/SMILES归入资料卡；03三卡只进对应论文笔记本，首页系统对照，解读集中于论文页；04承担规划路线选择与依据；总结左右排列完成信息和路线判断，用一个入口开始参照练习并进入配置阶段。新实验route=null、caseFlowVersion=2；01—03共通学习，初选/改选不清空前三步。旧默认选择恢复为空，真实04提交/后续实验保留；旧03题目变动可能需要重新核对该题，原作答不改写。见[REPORT-059](docs/reports/REPORT-059-case-route-flow.md)，改动尚未提交/push。

任务04现按[TASK-060](docs/tasks/TASK-060-task04-content-layout.md)收敛为：主面板一条短说明、路线选择、三篇笔记本卡片；右面板一条完整问题及作答/提交反馈，删除重复标题、清单与选择状态长句。原选择、草稿、评价逻辑不变，静态资产直接在8766生效，未操作服务；见[REPORT-060](docs/reports/REPORT-060-task04-content-layout.md)。

[TASK-061](docs/tasks/TASK-061-panel-height-sidebar-sync.md)已完成侧栏与实验页纵向布局调整：主线任务按钮统一控制实验历程，历程无独立折叠按钮；左下更多为纯图标。侧栏折叠与纯图标入口继续有效；双栏高度规则现由TASK-062替代，右卡按内容增高，窄屏保持流式。偏好只保存单一collapsed并兼容旧双布尔，折叠不改变学习记录。见[REPORT-061](docs/reports/REPORT-061-panel-height-sidebar-sync.md)，改动尚未提交/push。

[TASK-062](docs/tasks/TASK-062-content-height-floating-tutor.md)已按内容恢复右侧问答卡自然高度，删除导入选择题快捷通行入口；AI导师以原生popover覆盖页面及论文弹窗，开关不改变主/右栏位置。三篇笔记本解读与证据区增加标题、段落和列表间距，删除指定说明句与“问导师解读此篇”按钮，PDF和笔记保留。见[REPORT-062](docs/reports/REPORT-062-content-height-floating-tutor.md)，8766静态资产即时生效，改动尚未提交/push。

[TASK-063](docs/tasks/TASK-063-bottom-card-notebook-tutor-entry.md)纠正右卡锚点：桌面卡片保持内容高度，底边距论文笔记本按钮顶部16px并向上展开；长内容仍可滚动。AI导师启动图标现与面板一样跟随modal显示在上层，从笔记本打开后可直接点击并反复唤起，关闭/键盘焦点正常。前序阅读排版及删减保留，详见[REPORT-063](docs/reports/REPORT-063-bottom-card-notebook-tutor-entry.md)。

## 运行与交付

| 项目 | 当前事实 |
| --- | --- |
| 默认运行 | `python scripts/dev.py`，默认127.0.0.1:8767，Python3.10+标准库；public配置无需私有数据、模型、Conda、GPU或npm |
| 实际端口 | 8767为其他应用；LAN原型为8766。TASK-059核实原为手动进程且既有unit失败，已将本项目8766恢复为既有systemd托管并加载新preset，health与静态字节核对通过；未改unit/模型/网络配置 |
| 协作与运维 | [collaboration.md](docs/operations/collaboration.md)唯一维护开发/离线交接步骤；[lan-site.md](docs/operations/lan-site.md)唯一维护LAN地址、启停及日志 |
| 实时AI | 可选的本机私有配置；配置成功显示“Qwen · 实时辅导”，无配置/失败可继续本地流程。最新Web回归用受控响应，不是新一轮真实模型/并发验收 |
| 学习记录 | 当前浏览器/站点localStorage，最多12快照，可比较及JSON/Markdown导出；含草稿、独立判断和论文笔记，无账号/跨设备同步 |
| 分析草稿 | 未提交的分析文字仅在页面会话内保留，刷新不恢复；已提交记录、主线草稿及方案按原机制持久化 |
| 答题通行入口 | 导入选择题已删除快捷输入，主线答题与导师输入仍支持admin7；历史记录兼容。admin7逐题标记admin_override，不走AI评价、不生成独立判断；不是教师批准或正式评分，正式权限/发布须按[ADR0010](docs/adr/0010-answer-passphrase-workflow.md)复审 |
| 分子与阅读 | 五类分子为计算结构，EMIQ仅Q3M代表组分；三篇原PDF只读，笔记只属学生自述；图文/分子/AI反馈仍待专业审核 |
| 逆合成 | [REPORT-035](docs/reports/REPORT-035-isoquercitrin-retro-handoff.md)仅接收计算来源并校验/保存/导出；动态搜索/仿真未部署；[TASK-036](docs/tasks/proposals/TASK-036-isoquercitrin-coupled-enzyme-evidence-plan.md)为未执行提案 |
| Git | main → public/main；039—056及057导出兼容随227523e提交并推送，远端SHA已核对；本次文档收尾提交由Git日志定位，见[REPORT-057](docs/reports/REPORT-057-web-improvements-git-sync.md) |
| CI | [功能提交227523e的CI](https://github.com/juliusloon/FlavoGlycoLab/actions/runs/40169280889)四项全部通过（Ubuntu/Windows/macOS public-check及browser）；后续文档提交如触发新CI，状态以Actions为准 |

## 工程验证

| 验证层 | 最新证据及限制 |
| --- | --- |
| 本次底边衔接与论文页导师入口 | TASK-063：Python79（76通过/3显式research跳过）、Node92/92；实际8766专项163/163、四任务298/298，临时public完整流程1710/1710。桌面底边16px、内容自然高度/长卡滚动、先开论文再点击导师图标、关闭重开及手机布局通过；326/326预算外SHA和3/3静态资产一致。见[REPORT-063](docs/reports/REPORT-063-bottom-card-notebook-tutor-entry.md) |
| 此前问答卡、导师与阅读排版 | TASK-062：Python79（76通过/3显式research跳过）、Node92/92；实际8766四任务268/268、跨页725/725，临时public完整流程1710/1710。专项81/81覆盖1536/1280/390视口、导师不重排和覆盖论文弹窗、三篇PDF/笔记；详见[REPORT-062](docs/reports/REPORT-062-content-height-floating-tutor.md)。6/6静态资产一致，预算外保护SHA无变化；模型使用受控响应，三个审核门不晋级 |
| 此前侧栏与双栏布局 | TASK-061：Python79（76通过/3显式research跳过）、Node92/92；实际8766四任务专项268/268、跨页725/725，临时public完整流程1708/1708；1536/390折叠与16px几何通过，5/5静态资产一致，326个tracked快照预算外0变化。完整流程含受控响应，不是真实模型验收；见[REPORT-061](docs/reports/REPORT-061-panel-height-sidebar-sync.md) |
| 本次任务04文案与布局 | TASK-060：Python79（76通过/3显式research跳过）、Node92/92；实际10.70.160.64:8766浏览器专项244/244，完整流程1708/1708；主/右面板归属、三个路线选择、论文阅读及草稿保留通过，无应用错误；324/324预算外SHA及2/2静态资产核对通过；见[REPORT-060](docs/reports/REPORT-060-task04-content-layout.md) |
| 本次四任务与路线选择 | TASK-059：Python79（76通过/3显式research跳过）、Node92/92；完整浏览器1708/1708、跨页692/692、四任务专项219/219、异步31/31；297/297预算外tracked SHA及科学内容保持，8766的11/11资产一致，01/04新preset通过无模型调用核验。见[REPORT-059](docs/reports/REPORT-059-case-route-flow.md) |
| 此前任务03/04合页 | TASK-058：Python79（76通过/3显式research跳过）、Node87/87；完整浏览器1702/1702、合页专项68/68、异步提交31/31；318/318预算外tracked SHA不变。当前页面以059为准；见[REPORT-058](docs/reports/REPORT-058-route-tasks-single-page.md) |
| 本次Git同步 | 工作树与227523e干净检出均Python79（76通过/3显式research跳过）及Node87/87；全树326/326路径/内容守卫、244/244保护SHA、实际快照导出通过；见[REPORT-057](docs/reports/REPORT-057-web-improvements-git-sync.md) |
| 本轮文档整理 | public工程检查通过：Python78（75通过/3显式research跳过）、Node87/87；17/17映射、307/307链接、298/298保护SHA通过，见[REPORT-056](docs/reports/REPORT-056-web-reliability-management-consolidation.md) |
| 最近完整Web回归 | [REPORT-053](docs/reports/REPORT-053-experience-report-reliability.md)：Python78（75通过/3显式research跳过）、Node87/87、工作台1702/1702、跨页692/692、异步专项31/31、8766交互36/36；363保护文件SHA不变、11/11相关资产一致 |
| 阅读/分子专项 | [REPORT-055](docs/reports/REPORT-055-web-reading-molecule-consolidation.md)汇总原图113、笔记本419、便签94及五分子154等原验收；分母有重叠，不合计为新增测试 |
| 验证边界 | 浏览器结果为Chromium及模拟视口；未宣称实体设备、Safari/Firefox、真实模型质量、课堂并发或教学效果已验收。054—056归并仅文档验收；058/059为另行实施与浏览器实测 |

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
