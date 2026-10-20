# FlavoGlycoLab 贡献与执行规范

本项目采用CondRxnBench式操作闭环，但不迁移其任务历史与科学研究对象。任何实质修改需使用本项目唯一TASK合同，并对应生成REPORT与更新STATE。

## 本地协作

先按[协作说明](docs/operations/collaboration.md)运行`python scripts/dev.py`和`python scripts/dev.py check`。默认public随Git齐全，不需要服务器账户或私有证据池。只做全量研究时导入内部研究包并显式使用research；不提交包或凭据。三篇PDF按metadata/public_sources.json的精确范围例外保留。

## 操作合同
先查PROJECT、STATE、ARCHITECTURE，再创建TASK。写明目标、上下文、批准来源、修改预算、允许/禁止项、非目标、精确验收标准、验证、停止条件；未批准不能执行大范围工作。

## 分支与审查
默认从main创建短期分支开展后续实验功能。直接修改main只能由项目所有者明确允许，并在REPORT记录。PR须覆盖数据/许可影响、实际验证与未解决风险。

## 数据和教学科学
所有原始资料登记原定位、SHA、许可与能否再分发。候选不升为gold，agent机器检查不等于教师审定；零值、未知和缺失不混用。代码或报告不得以检索/MCTS分数冒充产率。受限内容不入Git、部署包或浏览器静态资源。

## 实现责任
src/flavoglycolab包含可测代码；版本配置入metadata/configs；文献/案例准入入data/registries及受限私有目录；测试入tests。职责变化先更新ARCHITECTURE，经ADR记录长期设计选择。

## 完成定义
验收必须包含变更文件表、可复现命令及结果、修改预算偏差、未完成/失败证据、许可/教师审核及发布门不越权、匹配REPORT、STATE同步。没有相应证据则使用candidate/planned/partial，而非ready或released。
