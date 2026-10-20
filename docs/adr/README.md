# ADR 长期决策索引

ADR回答为什么长期采用某项结构或数据语义决策，不替代TASK授权、REPORT事实和STATE实时状态。仅对跨任务重要选择登记；状态为proposed/accepted/superseded/rejected。

- 0001-initial-rebuild.md：早期独立仓库/受控迁移策略；原临时项目名保留为历史事实，命名部分已被ADR0003替代。
- 0002-standalone-data.md：当前项目必须保存自己可用的受控原件与本地读取入口；早期名称保留为历史文本。
- 0003-name-and-identity.md：FlavoGlycoLab正式身份与更名决定。
- 0004-project-governance.md：采用CondRxnBench式控制闭环及三状态门。

新增ADR使用TEMPLATE.md，不改写旧ADR中的当时事实。ADR编号从0001递增，不接续其它项目。

- [0005-normal-main-push.md](0005-normal-main-push.md)：当前main普通推送与旧研究归档。

- [0006-collaboration-data-profiles.md](0006-collaboration-data-profiles.md)：默认公开开发配置、显式研究模式及离线研究包。
