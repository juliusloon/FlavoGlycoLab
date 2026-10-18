# TASK-007：删除本地推送钩子并同步公开更新

## 合同元数据
- 任务ID：TASK-007
- 状态：In Progress（human_direct 已批准）
- 基线分支：main
- 基线提交：3ebd036
- 授权来源：human_direct，2026-10-18所有者明确命令“把这个钩子删掉然后同步”。允许删除本地 `.git/hooks/pre-push` 并完成GitHub代码同步；不据此登记第三方再分发许可或教学审批。
- 人工负责人：项目所有者
- 执行者：Cano
- 修改预算：`.git/hooks/pre-push`删除；`scripts/export_public_repository.py`明确排除本地汇报包及两份未核许可的申报附件；`README.md`、`STATE.md`、`PROGRESS.md`、`ARCHITECTURE.md`、`ROADMAP.md`、`docs/README.md`、`docs/decisions-needed.md`、任务/报告索引；本TASK及同号REPORT。两个未批准候选合同007/008顺延008/009并同步活跃引用，内容范围与未批准状态不变。`temp/`仅保存过程校验及恢复的独立公开检出。
- 关联ADR：沿用现有科学/许可与公开历史边界；不新增科学政策。

## 目标
删除用户指定的本地推送钩子，恢复独立公开检出，将允许公开的最新代码及原创文档普通推送到现有GitHub main并核验。保留研究历史与公开历史的分离以及三个状态门。

## 背景与已核实事实
- 本地main为3ebd036，工作树干净；GitHub main为fd81bd2，远端可读。
- `.git/hooks/pre-push`按公开URL拒绝推送，用户已明确要求删除；不新增替代钩子。
- `temp/public-repository`当前不存在，需从现有远端恢复，沿用其提交父链。
- 本地案例表含11项numeric、10项missing及1项非适用；公开副本仍须撤下11项数值。
- 最新提交纳入本地汇报包（含7个字体）及DOCX/PDF附件；当前导出器拒绝9项二进制。公开导出明确排除`docs/p10ns/261017/`及这两份附件，原文件和旧提交不修改。

## 范围
### 允许项
- 删除指定本地钩子；从同名公开远端clone至既有工件位置。
- 在导出器中登记精确排除项与原因，报告遗漏文件分母；保持其余路径、内容、凭据及案例状态守卫。
- 从已提交树导出安全公开文件，替换公开检出内容但保留`.git`；普通提交/push main，核对远端SHA及治理CI。
- 更新当前事实、操作说明、配对TASK/REPORT和顺延候选入口。
### 禁止项
- 不修改/删除原始数据、原案例表、来源登记、迁移字节或历史提交。
- 不强推、不把研究历史合并进公开父链、不公开本地汇报包、附件、原件或模型。
- 不安装替代拦截钩子，不设置研究main的公开upstream。
- 不执行两个顺延候选任务、模型、教学/科学审定、部署或申报提交。
### 涉及目录及文件职责
| 目录职责 | 文件 | 当前状态与拟改动 |
| --- | --- | --- |
| 本地Git配置 | .git/hooks/pre-push | 按human_direct删除，不入Git |
| 公开导出 | scripts/export_public_repository.py | 明确排除项、原因与分母，不放宽其他守卫 |
| 当前事实与导航 | 根文档及docs索引/待决事项 | 删除现行钩子表述、更新公开同步说明与候选号 |
| 事前/事后合同 | TASK/REPORT-007、proposals | 配对记录本次；候选007/008顺延008/009 |
| 过程暂存 | temp/ | 独立公开检出、字节/历史审计与本地验证记录 |

## 非目标
- 修改第三方授权、教师审定、实验结果、教学平台或发布状态。
- 重写任何本地或远端历史，或把全部本地提交直接推到公开main。

## 必须执行的操作
1. 保存基线SHA和受保护文件指纹，记录合同。
2. 删除指定钩子并恢复远端独立检出。
3. 完成明确的导出排除、当前状态/导航修正与候选顺延。
4. 运行本地治理、来源/冻结字节核对、导出逐字节比较和公开治理检查；审计全部公开可达历史及拟新增blob。
5. 提交、普通push，核对远端SHA和CI，完成REPORT/STATE/PROGRESS闭环。

## 验收标准
- [ ] 指定钩子已删除，没有替代钩子；研究main未设置公开upstream。
- [ ] 原表、原件及冻结字节保持，11项数值仅在公开副本撤下，10项missing保留。
- [ ] 导出文件集精确等于已提交树减去明确排除项；其余文件逐字节相同。
- [ ] 本地/公开治理检查通过；公开全部可达历史无受限路径、受限数值blob或所查凭据。
- [ ] GitHub main与公开检出HEAD一致，原公开提交仍为祖先，CI真实结果有记录。
- [ ] TASK/REPORT配对与活跃候选入口有效，三个状态门未提升。

## 验证
```bash
test ! -e .git/hooks/pre-push
python3 -m unittest discover -s tests -p test_governance.py -v
PYTHONPATH=src python3 -m flavoglycolab.evidence.catalog --workspace . --verify-sources
python3 scripts/export_public_repository.py temp/public-export-007
git diff --check
git -C temp/public-repository ls-remote origin refs/heads/main
gh run list --repo juliusloon/FlavoGlycoLab
```
另以只读脚本比较导出/原树字节和全公开历史，不输出来源原值或凭据。

## 停止条件
- 远端出现并行冲突、原件哈希变化、明确排除项之外存在受限载荷/凭据，停止对应公开步骤并报告；可在本合同预算内修复的工程问题修复后再验收。

## 报告要求
生成`docs/reports/REPORT-007-remove-hook-public-sync.md`，记录删除钩子、恢复检出、公开/未公开文件分母、验证结果、SHA/CI和候选顺延，不虚构未完成步骤。
