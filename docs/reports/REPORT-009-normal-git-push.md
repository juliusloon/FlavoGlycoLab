# REPORT-009：修复当前main的普通Git推送

## 对应任务
- TASK：docs/tasks/TASK-009-normal-git-push.md；状态：Completed。
- 基线：研究eb82c66、公开fb6050a；授权human_direct：用户明确要求原命令在当前目录正常工作。
- 结果提交：首次修复提交c2e23cf9e11b9c94a780d5ef71730ef382b7a6e2；闭环文档追加提交，最终以当前main的git log -1核对。

## 改动文件与职责
README/STATE/PROGRESS/ARCHITECTURE/ROADMAP及docs索引/待决入口说明普通推送与归档；.gitignore保留35项本地文件；scripts/publish.py改普通push兼容入口；ADR-0005登记持久选择、治理ADR编号守卫同步；本TASK/REPORT配对，候选009/010仅顺延010/011。

## 实际操作与观察
原main与公开main无共同祖先，先前替代git publish未修复用户原命令。备份142个tracked文件及171个保护文件SHA，创建并verify完整bundle。旧研究main改名为codex/archive-research-20261018（HEAD仍eb82c66）；当前main从public/main创建，上游已配置。35项原文件已恢复原路径并忽略；原案例表原字节另存data/private/research-history-20261018/case_admission.csv，当前tracked案例表沿用远端已有脱敏表示。没有删除旧提交或强推。

## 验证
- 原命令git push -u public main实测退出0，Everything up-to-date；main...public/main为0/0。
- 新修复提交再次使用原命令实际推送：fb6050a..c2e23cf main → main，退出0；随后直接git push也退出0，Everything up-to-date。
- main与远端SHA均为c2e23cf9e11b9c94a780d5ef71730ef382b7a6e2；上游remote=public、merge=refs/heads/main；差异0/0；新提交作者julius及账号隐私邮箱。
- 142项tracked原树备份、完整Git bundle verify通过；归档分支HEAD仍eb82c66。171/171保护文件字节保全：170项原路径不变，原案例表1项在private副本保持原SHA；当前tracked案例表与远端原有脱敏表一致。
- 35/35本地汇报/附件恢复原路径，SHA与事前相同，全部被gitignore忽略；三篇PDF仍公开且原字节不变。
- 本地完整19/19测试通过；123登记、122现存来源SHA通过，唯一缺失仍为.DS_Store；3059候选、22待审、0教师批准与public_release=false不变。
- 首推前对当前main全部9个公开提交与拟提交树审计177组路径/blob；旧研究提交交集0、两项受限案例blob不可达，路径/内容凭据守卫无匹配。
- [CI 39103537428](https://github.com/juliusloon/FlavoGlycoLab/actions/runs/39103537428)，对应c2e23cf，completed/success，公开治理8/8。闭环说明追加提交仍使用原命令普通推送。
- 本轮git diff --check通过；工作区main已跟踪public/main，未安装钩子、未force push、未改写旧提交。

## 与任务合同的偏差
无；当前案例表的表示转换已明确登记，原表原字节/原树/旧历史均完整保存，未静默丢弃数据。

## 数据、许可与审核门
三个状态门不变；3篇PDF沿用TASK-008例外，其他来源许可不改变，旧研究历史与原表数值不公开。

## 已发现但未改的问题
历史报告中的双历史同步说明保留其当时事实，当前操作以README/STATE/ADR-0005为准。

## 遗留风险、仓库与CI
旧研究归档分支仅本地保留，不推送--all；当前main普通推送已完成，首次修复CI成功；闭环说明随后追加。作者julius，钩子仍不存在。

## 建议的下一TASK
候选010/011待各自授权，不自动启动。
