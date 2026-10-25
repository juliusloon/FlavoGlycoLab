# ADR 长期决策索引

[0007](0007-retrosynthesis-computational-handoff.md)：接收外部计算来源，不推进实验/教师状态。

ADR回答为什么长期采用某项结构或数据语义决策，不替代TASK授权、REPORT事实和STATE实时状态。仅对跨任务重要选择登记；状态为proposed/accepted/superseded/rejected。

- 0001-initial-rebuild.md：早期独立仓库/受控迁移策略；原临时项目名保留为历史事实，命名部分已被ADR0003替代。
- 0002-standalone-data.md：当前项目必须保存自己可用的受控原件与本地读取入口；早期名称保留为历史文本。
- 0003-name-and-identity.md：FlavoGlycoLab正式身份与更名决定。
- 0004-project-governance.md：采用CondRxnBench式控制闭环及三状态门。

新增ADR使用TEMPLATE.md，不改写旧ADR中的当时事实。ADR编号从0001递增，不接续其它项目。

- [0005-normal-main-push.md](0005-normal-main-push.md)：当前main普通推送与旧研究归档。

- [0006-collaboration-data-profiles.md](0006-collaboration-data-profiles.md)：默认公开开发配置、显式研究模式及离线研究包。

- [ADR0008：独立页面地址与共享界面组件](0008-page-navigation-component-system.md)：原生hash子页面、访问/续接、统一token与组件唯一责任。

- [ADR0009：论文笔记本与学生阅读笔记](0009-paper-notebook-student-notes.md)：四便签原生阅读浮窗、run内学生笔记、导入不再以论文点击计数解锁。

- [ADR0010：答题通行词的流程语义](0010-answer-passphrase-workflow.md)：admin7逐题放行，独立标记admin_override，保留流程/科学审核边界。
