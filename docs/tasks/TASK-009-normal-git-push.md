# TASK-009：修复当前main的普通Git推送

## 合同元数据
- 任务ID：TASK-009；状态：In Progress；基线研究main eb82c66，公开main fb6050a。
- 授权来源：human_direct，2026-10-18用户再次明确要求解决当前目录`git push -u public main`拒绝；此前替代命令未满足实际使用方式。
- 修改预算：本TASK/REPORT、README/STATE/PROGRESS/ARCHITECTURE/ROADMAP、docs索引/待决入口、.gitignore、scripts/publish.py、docs/adr/0005-normal-main-push.md及ADR索引、tests/test_governance.py的ADR编号守卫；Git分支/上游/别名配置；候选009/010顺延010/011，仅编号及活跃引用。备份归temp/task-009与data/private/research-history-20261018，不公开。三个PDF、原始来源、源登记、迁移与科学状态字节不改。

## 目标
当前工作区main接续现有公开main，实际成功执行用户原命令`git push -u public main`，配置public/main上游。研究旧历史与所有原文件完整本地保存，不把旧受限父链公开。

## 范围与操作
1. 保存完整Git bundle、已跟踪文件字节、保护文件SHA和本地原案例表。
2. 将现有研究main改名为本地归档分支`codex/archive-research-20261018`，再从public/main创建当前main；不删除/重写旧提交，不强推。
3. 原案例登记原字节保存至data/private/research-history-20261018/case_admission.csv；当前已跟踪表使用远端已有脱敏表示。35项本地汇报/附件从备份恢复原路径并加入忽略，其他私有资产不动。旧分支保留完整原树。
4. 修正活动说明，git publish兼容入口改为当前main的普通push，不再要求两个工作区同步。科学数据读取仍沿用本项目本地路径。
5. 本地完整测试、来源/字节验证、公开父链/受限blob核查后，实际运行原推送命令、核对SHA和CI；完成闭环。

## 非目标
不公开更多资料、不修改PDF或实验结果、不改写历史作者，不提升三个状态门，不执行候选任务。

## 验收标准
- [ ] 旧研究分支与bundle保留原HEAD/历史；35项本地文件、原案例表及全部私有原件字节可读且不变。
- [ ] 当前main以原公开main为祖先，旧研究提交/受限案例blob不在当前main可达集合。
- [ ] 本地完整测试、公开治理/原件SHA通过；新作者仍julius。
- [ ] `git push -u public main`实际成功，public/main上游设定、远端SHA一致，CI如实记录。

## 验证
git merge-base --is-ancestor fb6050a main；git push -u public main；git rev-list --left-right --count main...public/main；python3 -m unittest discover -s tests -v；保护字节及Git bundle verify；远端CI。

## 停止条件
工作树有并行修改、备份不完整、原件SHA变化、远端并行更新或当前main将包含受限父链时停止；不覆盖用户新修改或强推。

## 报告要求
REPORT-009-normal-git-push.md写清分支迁移、原表位置及当前脱敏表、验证分母/失败、实际原命令执行结果和未解决项；更新STATE/PROGRESS。
