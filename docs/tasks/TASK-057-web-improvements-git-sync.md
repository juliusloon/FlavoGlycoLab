# TASK-057：三项Web改进与管理归并的Git同步

## 合同元数据
- 任务ID：TASK-057；状态：Completed（2026-10-25，Git同步验收，CI状态见报告）。
- 基线：main / 92fe3f8；人工负责人：项目所有者；执行者：Cano。
- 授权来源：human_direct，所有者在三项归并完成后明确要求“git 同步”。授权提交并普通推送当前已完成的039—056源码/资产/测试/文档，057仅为交付记录，不增加第四个Web改进主题。
- 修改预算：本TASK/REPORT、docs/tasks/README.md、docs/reports/README.md、STATE.md、PROGRESS.md；允许为既有044三幅已授权原图及024已公开路线PNG补齐scripts/export_public_repository.py精确路径/SHA兼容及tests/test_governance.py对应守卫。不修改产品功能、CI或原件。既有待同步路径事前清单为temp/task-057/approved-payload.json；验证/干净检出/日志限temp/task-057/，不入Git。
- 关联ADR：沿用0004治理闭环、0005普通main推送及0006公开/研究分层；不新增长期选择。

## 目标与已核实事实
将054—056归并的三项Web改进及其原执行记录同步至public/main，核对远端SHA与CI。现有工作树尚有039—056源码、三幅配图、五分子相关资产、固定PDF.js与原许可、测试和管理文档；不重做原功能或将旧测试冒称本轮实跑。

## 范围
- 读取/核对现有差异、授权和来源登记；显式暂存事前清单内文件，不强制加入忽略项。
- 既有导出守卫只登记装置PNG，044新增三图尚未兼容；如核实确有阻断，只按assets/literature/sources.json的三个已授权文件和SHA补齐，不放开任意二进制/来源。全树检查如发现同类既有已公开图件遗漏，可按原合同/已登记SHA精确兼容并报告，禁止改图。
- git fetch public后确认父链；工作树与干净检出运行public检查，校验完整拟公开载荷、三PDF及既有原件/代码保护。必要时运行针对性兼容回归。
- 普通提交/push main，核对远端；读取本次CI结果，进行中如实登记。允许后续文档提交收尾同步事实，不递归改写报告引用自身提交。

## 非目标与禁止项
不实施036提案，不新增科学数据、模型、真实观测或教师结论；不提交其余raw/derived/private、研究包、密钥、temp或旧研究归档分支。不强推/重写历史、不改常驻服务/网络/防火墙，不提升研究、教师或公众发布三个门。

## 必须执行与验收标准
- [x] 事前路径清单/公开内容守卫通过；仅三幅已授权PNG、已公开的024路线PNG及原PDF等既有精确例外，不新增公开范围。
- [x] 原源码/来源/已完成合同报告的SHA不变（仅上述治理及必要导出兼容为允许修改）；public工作树及项目内干净检出检查通过。
- [x] 普通提交并推送public/main，本地/远端SHA一致，工作树无本次遗漏；CI以实际查询结果记录。
- [x] REPORT记真实分母、失败/偏差、提交/CI与限制；STATE/PROGRESS只更新当前事实与里程碑，三项主题仍为054—056。

## 验证
`python3 scripts/dev.py check`（public，使用已有Node22）、`git diff --cached --check`、公开路径/内容守卫、项目内detached干净检出、`git ls-remote public refs/heads/main`及`gh run view`。浏览器原回归引用053；不调用真实模型。

## 停止条件
发现未授权载荷/凭据、来源哈希冲突、未知并发改动或远端分叉时停止相应推送并报告；不强推。工程/CI失败须定位并如实记录，修复仅限本次同步所必需的既有合同兼容，不扩大功能范围。

## 报告要求
生成[REPORT-057](../reports/REPORT-057-web-improvements-git-sync.md)，记录已发生的同步与CI事实；后续新任务须另行授权。
