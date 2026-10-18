# REPORT-009：修复当前main的普通Git推送

## 对应任务
- TASK：docs/tasks/TASK-009-normal-git-push.md；状态：执行中。
- 基线：研究eb82c66、公开fb6050a；授权human_direct：用户明确要求原命令在当前目录正常工作。
- 结果提交：pending。

## 改动文件与职责
README/STATE/PROGRESS/ARCHITECTURE/ROADMAP及docs索引/待决入口说明普通推送与归档；.gitignore保留35项本地文件；scripts/publish.py改普通push兼容入口；ADR-0005登记持久选择、治理ADR编号守卫同步；本TASK/REPORT配对，候选009/010仅顺延010/011。

## 实际操作与观察
原main与公开main无共同祖先，先前替代git publish未修复用户原命令。备份142个tracked文件及171个保护文件SHA，创建并verify完整bundle。旧研究main改名为codex/archive-research-20261018（HEAD仍eb82c66）；当前main从public/main创建，上游已配置。35项原文件已恢复原路径并忽略；原案例表原字节另存data/private/research-history-20261018/case_admission.csv，当前tracked案例表沿用远端已有脱敏表示。没有删除旧提交或强推。

## 验证
- 原命令git push -u public main实测退出0，Everything up-to-date；main...public/main为0/0。
- bundle verify成功；保护字节、测试和新提交/CI仍在验收。

## 与任务合同的偏差
无；当前案例表的表示转换已明确登记，原表原字节/原树/旧历史均完整保存，未静默丢弃数据。

## 数据、许可与审核门
三个状态门不变；3篇PDF沿用TASK-008例外，其他来源许可不改变，旧研究历史与原表数值不公开。

## 已发现但未改的问题
历史报告中的双历史同步说明保留其当时事实，当前操作以README/STATE/ADR-0005为准。

## 遗留风险、仓库与CI
旧研究归档分支仅本地保留，不推送--all；当前main普通推送，新提交及CI待完成。作者julius，钩子仍不存在。

## 建议的下一TASK
候选010/011待各自授权，不自动启动。
