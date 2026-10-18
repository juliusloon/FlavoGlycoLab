# TASK-008：三篇PDF公开同步与提交身份修正

## 合同元数据
- 任务ID：TASK-008；状态：In Progress。
- 基线：main，d6817ca；原公开main：14cdfe8。
- 授权来源：human_direct，2026-10-18用户要求作者名改成julius，并明确选择“三篇PDF也要公开”。这是项目所有者的公开范围指令，不声称完成出版方许可核验或教师审核。
- 修改预算：本TASK/配对REPORT；scripts/export_public_repository.py与新增scripts/publish.py；tests/test_governance.py、tests/test_standalone.py、.github/workflows/governance.yml；AGENTS、PROJECT、ARCHITECTURE、STATE、PROGRESS、README、ROADMAP、.gitignore、LICENSES/README、docs/data-governance及文档/任务/报告/待决索引；候选008/009顺延009/010，仅编号/引用变化；本地两处Git作者及git publish别名配置。原PDF/数据/历史字节不改。

## 目标
用julius身份将已提交的三篇指定PDF按原字节公开到现有GitHub main，保留其他私有数据边界，并提供研究根目录可执行的git publish同步入口。

## 背景与范围
- 研究main与公开main无共同祖先，普通git push public main无法快进；不通过强推或合并研究历史处理。
- 只为data/raw/literature下本次三个文件登记精确路径及SHA例外，其余raw/derived/private仍拒绝公开。
- 沿用公开父链、既有案例表脱敏与35项排除；不改已提交作者历史、不新增钩子。
- 两个候选任务仅顺延，不实施。

## 非目标
科学/教师审定、出版社权利确认、教学发布、部署和其他数据公开。

## 必须执行的操作
1. 固定三篇PDF及保护文件SHA，登记例外和真实授权来源。
2. 修正公开导出/治理守卫，仅放行精确字节；添加git publish入口，使用当前作者、现有公开历史及普通推送。
3. 本地/公开检查、完整公开历史审核、普通推送并核验远端PDF与CI；闭环更新。

## 验收标准
- [ ] 三篇PDF在远端main存在且SHA与原件一致；新提交作者julius。
- [ ] 未知raw/PDF或指定PDF字节变化仍拒绝；原受保护字节不变。
- [ ] 本地完整测试、公开治理、全部公开历史审核通过，远端CI真实记录。
- [ ] git publish在研究根目录可执行且重复执行不制造空提交；没有force push或旧历史合入。

## 验证
python3 -m unittest discover -s tests -v；公开治理检查；git publish；GitHub SHA、作者及CI读回。

## 停止条件
远端并行修改、意外脏公开检出、SHA冲突、指定三篇之外的受限文件或凭据出现时停止对应推送，不覆盖或强推。

## 报告要求
REPORT-008-pdf-public-sync.md记录文件/SHA、所有者授权与rights_verified=false的区别、真实验证及未完成项，更新STATE/PROGRESS。
