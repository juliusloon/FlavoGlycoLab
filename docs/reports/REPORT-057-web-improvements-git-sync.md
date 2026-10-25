# REPORT-057：三项Web改进与管理归并的Git同步

## 对应任务
[TASK-057](../tasks/TASK-057-web-improvements-git-sync.md)；human_direct，2026-10-25；状态：Completed（Git同步与本地/干净检出验收；CI状态见下表）。基线main / 92fe3f8，功能提交227523eade70c52e38b7bb657662db0ccd94a23f（已推送public/main）。

## 改动文件与职责
本次同步事前核对的039—056共109项源码/资产/测试/文档，加057合同/报告与导出兼容，共112项；原功能归[054—056三项管理任务](../tasks/README.md#本轮三项任务)，057只负责交付。

| 文件/范围 | 实际操作与职责 |
| --- | --- |
| frontend/student/、package.json、scripts/dev.py及相关tests/ | 提交已完成的界面、阅读、分子和流程改进；本轮未修改这些产品实现字节 |
| docs/adr/0009、0010、原039—056合同/报告及设计/使用文档 | 纳入原执行记录与三项归并，不重写旧授权、验证或失败 |
| scripts/export_public_repository.py、tests/test_governance.py | 精确兼容044三幅已授权选图与024已公开路线PNG，校验固定路径/原SHA；增加损坏图/未知图/受限路径拒绝回归 |
| 057合同/报告、两个索引、STATE/PROGRESS | 登记同步范围、验证与交付状态；三项Web主题保持054—056 |

## 实际操作与观察
1. `git fetch public`确认基线与public/main差异0/0，无分叉；读取上一轮CI实际已全部成功，旧报告的进行中是当时时点事实。
2. 记录109项事前载荷和246项保护指纹；显式暂存112项，不添加忽略文件。044配图SHA从原sources.json读取，024路线图保持既有README登记SHA。
3. 工作树检查及全树核验通过，112项提交为227523e并普通push至public/main；git ls-remote确认完整SHA一致，ahead/behind为0/0。
4. 项目内detached干净检出通过public检查后已移除，日志保留；实际导出326文件公开快照成功，无新脱敏替换，11项withheld/10项missing保持原样。功能提交CI四项全部通过（Ubuntu/Windows/macOS public-check及browser）；状态来自本次实际查询。

## 验证
| 本轮实跑 | 分母、结果与证据 |
| --- | --- |
| `PATH=/home/ljx/.local/bin:$PATH python3 scripts/dev.py check` | public配置：Python79项（76通过/3显式research跳过），Node87/87；temp/task-057/worktree-check-final.log |
| 完整暂存树路径/内容守卫 | 326/326通过，未授权受限路径0；三PDF SHA3/3、5张精确登记PNG原SHA通过；temp/task-057/index-audit.json |
| 原资产/合同报告保护 | 244/244 SHA不变（排除本合同允许修改的两个索引），包括原Web代码、来源与数据登记、原合同/报告、三PDF；temp/task-057/protection.json |
| 固定PDF.js来源核对 | 4/4与既有provenance.json登记SHA一致，保留原许可，无新依赖 |
| `git diff --cached --check` | 通过 |
| 227523e干净检出 | Python79项（76通过/3显式research跳过），Node87/87；temp/task-057/clean-check.log；无私有数据/模型配置 |
| 实际公开快照导出 | 326文件成功、排除0、案例字节/11项withheld/10项missing保持；temp/task-057/export-check.json |
| 远端与工作树 | 普通push成功，ls-remote SHA与227523e完整SHA一致；0/0，首轮push后工作树干净 |
| 本次功能CI | [run40169280889](https://github.com/juliusloon/FlavoGlycoLab/actions/runs/40169280889)：四项全部通过（Ubuntu/Windows/macOS public-check及browser）；temp/task-057/ci-feature.json |

## 与任务合同的偏差、失败与修正
首次109项守卫拒绝三幅已授权论文PNG；补齐精确来源/SHA兼容。随后全树守卫暴露024已公开路线PNG的同类旧遗漏，核对原合同、已提交原件及README登记后，仅补该路径/原SHA白名单。两次守卫失败均在提交/push前处理，未放开目录或任意二进制，未改任何图件/来源字节。增加1项治理测试覆盖原图通过、变造/未知图/受限路径拒绝，Python总数由78变79。无产品/CI工作流改动。

## 数据、许可与审核门
research_evaluation仍为历史候选/工程证据；teaching_case_review保持22/22待审、0教师批准；public_teaching_release=not_started。三PDF及既有选图rights_verified=false不变；代码同步不构成教学发布，不含其余raw/derived/private、离线研究包、模型、密钥或临时文件。

## 已发现但未改的问题与风险
浏览器回归引用053的1702/692/31及8766专项36等历史实测，本轮未重跑浏览器或真实模型；本次CI浏览器结果另记。科学审核、真实测量、评分/账号/发布条件继续见STATE。未实施036、未重启常驻服务或修改系统配置。

## 遗留风险、仓库与CI
main；功能提交227523e已推送并核对。功能CI四项全部通过（Ubuntu/Windows/macOS public-check及browser）。同步事实以本次简短文档提交收尾，其最终SHA由Git日志和远端引用定位，不递归改写本报告引用自身；收尾提交若产生新CI，以Actions实际状态为准，不冒称该新CI已通过。验证过程仅在项目内ignored的temp/task-057/，不是运行依赖。

## 建议的下一TASK
无自动启动；后续新范围须独立授权。
