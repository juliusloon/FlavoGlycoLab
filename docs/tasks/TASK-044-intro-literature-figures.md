# TASK-044：合成难点页补充文献原图

## 合同元数据
- 任务ID：TASK-044
- 状态：Completed（2026-10-24，工程验收；见同号REPORT）
- 基线分支/提交：main / 92fe3f8；保留TASK-039—043既有未提交修改。
- 授权来源：human_direct，2026-10-24所有者要求“异槲皮苷的合成难点页……从三篇文献中找到合适的图片加进页面”。这同时授权该页展示选定原图，不推定出版方许可或教师审定。
- 人工负责人：项目所有者；执行者：Cano。
- 修改预算：frontend/student/views/inquiry.js、styles.css、content/demo-content.json（仅intro.chemical_limit展示字段）；frontend/student/assets/literature/（最多三张来自既有公开PDF的图、一个来源登记）；ARCHITECTURE.md、本TASK/REPORT、STATE.md、PROGRESS.md。必要时更新既有浏览器检查中受影响的展示断言；不新增运行依赖。
- 关联ADR：沿用本地静态资产与现有来源登记。

## 目标
在`index.html#/intro/2`展示三篇既有文献中与制备难点相符的原图，配简体中文解释、图号/页码及原PDF链接；桌面/手机可读，既有问答、门禁与导航继续有效。

## 背景与已核实事实
该页当前只有四段文字与选择题；三篇PDF由metadata/public_sources.json登记，原件公开例外仍为rights_verified=false。当前已有大量未提交界面修改，必须保全。

## 范围
### 允许项
- 只读三篇已公开PDF，逐图查看内容与原图注，选择每篇最多一图/明确标注的原分面。
- 无重绘、无数据再造地渲染/裁取原图；派生图登记source_id、原PDF路径及SHA、图号/物理页码、裁取坐标、资产SHA与尺寸、质量/许可/审核状态。
- 在当前页补充图文内容及响应式排版；图片和PDF均使用同源相对路径，支持打开清晰原图。
- 使用既有Playwright做public环境和8766实页检查，不调用真实模型；静态文件更新无需重启服务。
### 禁止项
- 不修改PDF、raw/derived/private、既有metadata/registries、migrations、reference、原交件、任务答案与学习状态机。
- 不把文献曲线写成本次实验观测，不新增产率预测，不将文献路线图冒称化学保护/脱保护实验证据。
- 不公开SI或其他私有图文、不新增依赖、不改服务端或常驻进程、不提交/push、不晋级三个状态门。
### 文件职责
| 职责 | 文件 | 拟改动 |
| --- | --- | --- |
| 页面内容/渲染 | demo-content.json、views/inquiry.js | 原图与中文释义、源定位及清晰图入口 |
| 排版 | styles.css | 仅本页图文样式与窄屏适配 |
| 图像及来源 | assets/literature/ | 精确选图与唯一派生来源登记；不复制科学准入真值 |
| 规范与闭环 | ARCHITECTURE、TASK/REPORT、STATE/PROGRESS | 归属、实际验证和边界 |

## 非目标
不重做全站、不改后续24任务或科学准入、不构建新模拟器、不获取新文献。

## 必须执行的操作
1. 保存允许文件和冻结资产指纹，核对三PDF原SHA。
2. 逐篇筛图、查看原图与图注，登记定位和派生流程后接入图文。
3. 运行标准工程检查、既有跨页/工作台浏览器检查及本页专项；查看桌面/手机截图，实点问答与原图/PDF链接。
4. 核对保护零差异，生成REPORT并更新STATE/PROGRESS。

## 验收标准
- [x] 三篇各一幅相关原图/分面可见；中文解释准确，来源图号/页码可追溯，无伪造化学图/数据。
- [x] 同源图片、清晰原图与原PDF可访问，保留版权归属和未审核状态。
- [x] 桌面与手机无横向溢出/遮挡；图片清晰，问答重试、推进及返回/刷新有效。
- [x] 标准工程与相关浏览器检查通过，应用错误及外部运行请求为0。
- [x] 三PDF及所有保护文件字节不变；三状态门不晋级。

## 验证
`python3 scripts/dev.py check`、`npm test`、现有`test:browser`与`test:pages-browser`及临时本页Playwright专项。Browser plugin not available，使用已有Playwright/Chromium；临时脚本、截图和日志保存在`/tmp/flavoglycolab-task-044/`。

## 停止条件
无法核对图号/来源、必须修改受保护原件、需使用未经本轮授权的材料、需改答案/状态机或新增依赖；失败如实报告，不猜测化学事实。

## 报告要求
生成docs/reports/REPORT-044-intro-literature-figures.md，记录实际选图/变动、验证分母、偏差和未测限制；更新STATE/PROGRESS，不自动执行下一TASK。
