# TASK-003：进展对照与公开代码仓库同步

## 合同元数据
- 任务ID：TASK-003
- 状态：Completed（human_direct批准，进展对照、独立公开快照、GitHub同步及验收完成）
- 基线分支：main；工作分支：codex/progress-public-repository
- 基线提交：286ec2f（启动时已有8个已跟踪文档修改及研究报告、可行性草案，全部保留并核查）
- 授权来源：human_direct，2026-10-16所有者明确要求“根据可行性报告分析本仓库进展，新建并同步到GitHub同名public repo，填写仓库相关内容，除标签和名称外中文”。此授权包含本次首次公开代码、登记和原创项目文档，不包含教学平台发布或受限数据公开。
- 人工负责人：项目所有者
- 执行者：Agent（机器核查及工程操作，不代替教师审定）
- 修改预算：本TASK及同号REPORT；README、STATE、PROGRESS、ARCHITECTURE、ROADMAP、docs各索引、docs/research/README；pyproject项目说明/链接；.github工作流和模板的中文展示；tests/test_governance.py的任务编号守卫；保留并同步现有PROJECT及TASK/REPORT-002文字修改。将未批准的proposals/TASK-003-feasibility-gate.md仅顺延为TASK-004并修正引用，内容与Proposed状态不变。GitHub仅操作juliusloon/FlavoGlycoLab的创建、描述、主页、主题、议题标签/模板、功能设置、main同步及CI核验。
- 关联ADR：0003、0004；不新增科学或教学政策。

### 公开审计后的实施修订（同一human_direct授权范围）
本次只读审计发现case_admission.csv及两个历史blob含11项尚无再分发授权的产率值，触发“停止全历史公开”条件；全历史push方案终止。采用独立公开快照：原表、原提交和私有字节保留在本地；新增scripts/export_public_repository.py只从已提交树导出允许文件，在导出副本将11项数值标为withheld_unlicensed，保留原有missing及审核状态。公开检出位于忽略目录temp/public-repository，使用新的无旧parent根提交及origin/main；原工作区只登记public远端，不给本地main设置公开上游，也不推送旧分支。新增脚本归属在ARCHITECTURE登记，LICENSES/README补充公开边界；不修改原case_admission.csv或任何冻结字节。REPORT记录这一安全实施偏差及两个Git历史的区别。

## 目标
以指定2026-10-15可行性报告为规划输入，对照本仓库的实际交付及缺口；在完成公开范围审计后，创建同名public GitHub仓库并同步经清理的独立公开快照及其新历史，中文填写面向访问者的介绍和说明。

## 背景与已核实事实
- 正式执行合同已完成TASK-001/002；原TASK-003仅在proposals内，尚未授权。当前新命令使用正式TASK-003，原草案顺延TASK-004，不执行其F0—F4调查或申报判定。
- 可行性报告描述的FlavoRetro历史搜索/Web能力不能登记为FlavoGlycoLab已运行功能；当前唯一活动子包为evidence。
- 原件登记123/现存122、候选资源3059、待审案例22/教师批准0，须本次重新验证。
- GitHub当前登录账号juliusloon；同名仓库查询未找到，现有本地main没有remote。

## 范围
### 允许项
- 只读核验指定报告、治理文件、登记、来源哈希、冻结快照、Git所有可达历史及本次待发布内容。
- 将进展对照和实际验收集中写入同号REPORT；README作访问入口，STATE保留当前事实，PROGRESS保留里程碑。
- 明确公开clone与带授权私有数据的本地运行差异；原始研究报告字节不修改。
- 提交本次文档/守卫/导出脚本，将本地工作分支快进至本地main；通过独立公开快照检出创建public仓库并普通push公开main；填写中文描述、主题、标签说明、项目链接，核对公开检出远端提交与CI。
### 禁止项
- 不修改data/raw、data/derived、data/private、metadata科学状态、案例准入及migrations冻结来源字节；不公开第三方全文、商业数据、模型权重、凭据。
- 不开发化学、仿真、课程、AI导师、前后端或iLab接口；不开展新政策/论文核查、对外联系或申报。
- 不改变research_evaluation、teaching_case_review、public_teaching_release，不将代码公开等同于教学服务发布。
- 不覆盖既存远端、不force push、不重写既存提交、不推送本地含受限数值的历史或修改其他工作区。
### 涉及目录及文件职责
| 目录职责 | 文件 | 拟改动 |
| --- | --- | --- |
| 事前/事后合同 | docs/tasks、docs/reports | TASK-003及配对REPORT；草案编号顺延 |
| 入口、状态与里程碑 | README、STATE、PROGRESS | 进展摘要、可复现检查与公开代码状态 |
| 工件/计划索引 | ARCHITECTURE、ROADMAP、docs索引 | 按既有Artifact Registry归属及正确引用 |
| 贡献与自动验证入口 | .github、pyproject、tests/test_governance.py | 中文元数据、项目链接及递增编号守卫 |
| 公开快照导出 | scripts/export_public_repository.py、LICENSES/README | 仅导出已提交允许文件，导出副本撤下受限数值，原表不变 |

## 非目标
教师审核、学校或平台批准、数据授权、2026申报可行性新判定、部署、GitHub Release及教学效果测量。

## 必须执行的操作
1. 核对工作树，保留原有修改；阅读报告并区别历史基础与本项目活动实现。
2. 审计全Git历史和本次文件的受限路径、载荷、凭据及许可边界；核对原件与冻结快照。
3. 完成中文入口、进展报告、状态和索引；更新必要的编号守卫及CI显示文案。
4. 运行本地全量检查及不含私有数据的干净检出治理检查，保存真实分母和失败。
5. 审计通过后创建同名public仓库，填写相关内容、提交并普通push；核对远端SHA、可见性、元数据及CI，再完成REPORT与STATE闭环。

## 验收标准
- [x] 对照可行性报告区分证据基础、科学案例、D1、24步、AI/角色服务及发布六类状态，逐项有本项目证据。
- [x] 原件122/122与冻结快照23个唯一来源的哈希不变，22条待审/0教师批准及报告原SHA不变。
- [x] 禁止路径在公开快照全部提交树中为0；导出副本11项数值撤下、10项missing保留，原表及本地历史不变；公开可达blob与新增文本凭据/受限载荷核查无阻断。
- [x] 本地全量测试、来源验证、SQLite只读完整性、公开检出治理测试、git diff --check通过。
- [x] GitHub同名仓库为public，描述/入口/自定义标签说明为中文，topics与标签名称可英文；主页指向实际项目文档而非虚构服务。
- [x] 公开检出main远端与本地SHA一致，本项目原main保留不同的私有历史且无公开upstream；CI实际状态如实记录；REPORT、STATE、PROGRESS及索引一致。

## 验证
```bash
PYTHONPATH=src python3 -m flavoglycolab.evidence.catalog --workspace . --verify-sources
python3 -m unittest discover -s tests -v
python3 -m unittest discover -s tests -p test_governance.py -v
git diff --check
git ls-remote origin refs/heads/main
gh repo view juliusloon/FlavoGlycoLab
gh run list --repo juliusloon/FlavoGlycoLab
```

## 停止条件
发现受限载荷/真实凭据进入可达历史、原件哈希冲突、同名已有仓库、账号权限不足或远端冲突时，停止相关公开操作并记录；能在授权范围内修正文档或配置的问题先修复再验收，不擅自公开或重写历史。

## 报告要求
生成docs/reports/REPORT-003-progress-public-repository.md，记录已有未提交改动、真实验证分母、公开与私有边界、GitHub链接/配置/CI和失败重试。原可行性草案仍为未批准，不自动启动TASK-004。
