# ADR-0002：独立来源数据与FutureHealth本地运行入口

日期：2026-10-15
决定：accepted。所有者要求完全独立，包括所需数据文件；复制不等于批准作为教学真值或公开材料。

## 问题

此前23项P0文件虽已迁移，123项来源登记对应的原始字节未全部在FutureHealth工作区，旧迁移清单仍保留历史来源路径。无法据此声称自包含数据基础。

## 决定

将123项登记中的122个实际存在的来源原件复制到data/raw/legacy，缺失的.DS_Store仅登记为原始操作系统元数据缺口；完整v3记录、manifest及SQLite索引复制到data/derived/v3。两目录受.gitignore保护，文件不入Git。研究候选中的P1反应源及3项教学配置仅限private custody，教师审核后才可进入课程。

metadata/active.json记录FutureHealth内部相对路径。src/futurehealth/evidence/catalog.py使用Python标准库，拒绝工作区外的路径，逐文件核查本地登记SHA；本项目可离开旧工作区运行。历史迁移审计仍以旧路径记录不可变原始出处，但不用于程序加载或新数据路径。

公开教学许可、实际审定实验条件、D1数据服务和AI教学仍待独立通过，绝不自动升格。

## 任务编号

FutureHealth从TASK-001重新编号，不接续旧项目的TASK-020。只保留本项目必要的短任务合同，不移入旧研究TASK/REPORT/日志。

## 验收

在非项目工作目录启动本项目模块；比对本地122个源原件SHA、3,059候选记录、22项未审教学登记、路径隔离与受限文件Git排除；仍未执行新MCTS、酶动力学或教学联调。
