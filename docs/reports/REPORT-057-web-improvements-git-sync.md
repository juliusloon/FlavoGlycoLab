# REPORT-057：三项Web改进与管理归并的Git同步

## 对应任务
[TASK-057](../tasks/TASK-057-web-improvements-git-sync.md)；human_direct，2026-10-25；状态：Partial（本地验收通过，提交/干净检出/推送待完成）。基线main / 92fe3f8，结果提交pending。

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
3. 工作树检查及拟公开全树核验通过；本地提交、干净检出、远端SHA与本次CI结果待后续记录。

## 验证
| 本轮实跑 | 分母、结果与证据 |
| --- | --- |
| `PATH=/home/ljx/.local/bin:$PATH python3 scripts/dev.py check` | public配置：Python79项（76通过/3显式research跳过），Node87/87；temp/task-057/worktree-check-final.log |
| 完整暂存树路径/内容守卫 | 326/326通过，未授权受限路径0；三PDF SHA3/3、5张精确登记PNG原SHA通过；temp/task-057/index-audit.json |
| 原资产/合同报告保护 | 244/244 SHA不变（排除本合同允许修改的两个索引），包括原Web代码、来源与数据登记、原合同/报告、三PDF；temp/task-057/protection.json |
| 固定PDF.js来源核对 | 4/4与既有provenance.json登记SHA一致，保留原许可，无新依赖 |
| `git diff --cached --check` | 通过 |
| 干净检出、远端与新CI | 待完成；不将旧CI当作本次结果 |

## 与任务合同的偏差、失败与修正
首次109项守卫拒绝三幅已授权论文PNG；补齐精确来源/SHA兼容。随后全树守卫暴露024已公开路线PNG的同类旧遗漏，核对原合同、已提交原件及README登记后，仅补该路径/原SHA白名单。两次守卫失败均在提交/push前处理，未放开目录或任意二进制，未改任何图件/来源字节。增加1项治理测试覆盖原图通过、变造/未知图/受限路径拒绝，Python总数由78变79。无产品/CI工作流改动。

## 数据、许可与审核门
research_evaluation仍为历史候选/工程证据；teaching_case_review保持22/22待审、0教师批准；public_teaching_release=not_started。三PDF及既有选图rights_verified=false不变；代码同步不构成教学发布，不含其余raw/derived/private、离线研究包、模型、密钥或临时文件。

## 已发现但未改的问题与风险
浏览器回归引用053的1702/692/31及8766专项36等历史实测，本轮未重跑浏览器或真实模型；本次CI浏览器结果另记。科学审核、真实测量、评分/账号/发布条件继续见STATE。未实施036、未重启常驻服务或修改系统配置。

## 遗留风险、仓库与CI
main；尚未push，本次CI尚未触发。验证过程只在项目内ignored的temp/task-057/，不作为运行依赖。最终同步事实允许另作简短文档提交，不递归改写报告引用自身提交。

## 建议的下一TASK
无自动启动；后续新范围须独立授权。
