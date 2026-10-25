# TASK-040：导入文案删减与异槲皮苷介绍改写

## 合同元数据
- 任务ID：TASK-040
- 状态：Completed（2026-10-24，工程验证；见同号REPORT）
- 基线分支：main
- 基线提交：92fe3f8；保留TASK-039既存未提交改动。
- 授权来源：human_direct，所有者本轮明确要求删除intro/1列出的标题、步骤条、来源/审核及观察提示，并将四段介绍改为陈述句、去掉“它”、展开生物活性。
- 人工负责人：项目所有者；执行者：Cano。
- 修改预算：`frontend/student/views/inquiry.js`、`frontend/student/content/demo-content.json`的intro.case文案及该段来源关联、`tests/test_inquiry_browser.mjs`、`tests/test_pages_browser.mjs`中受影响的既有断言；本TASK/同号REPORT、STATE.md、PROGRESS.md。
- 关联ADR：沿用现有原生ES模块与单一学习状态，无新增设计决定。

## 目标
导入页删除指定重复信息，第一幕保留分子、四段介绍与原有问题/推进。四段不使用“它”，生物活性只表述已有论文中的研究方向，不声称实验结果或临床效果。

## 背景与已核实事实
导入共用scene-title和三步导航；第一幕来源/审核文案由inquiry.js投影，正文唯一维护于demo-content.json。8766服务直接读取student资产，静态更新刷新即可生效。已有TASK-039改动不回滚、不提交。本机未提供Browser插件，按前端测试技能使用已有Playwright。

## 范围
### 允许项
- 删除导入共用标题/副标题/orientation和三步导航的显示。
- 仅第一幕删除kicker、正文来源条、审核标签、问题来源标签以及点名的重试观察指引；保留回答错误的简短状态反馈。
- 改写intro.case四段；末段关联Pei2019（水溶性）、Zhang2015（抗氧化/抗过敏）、Niu2024（心血管保护）既有来源。来源元数据和待审字段继续保留。
- 读取已有三份PDF确认背景表述；修正既有浏览器断言并检查桌面/手机、错答/答对/推进、回退/刷新。完整套件用127.0.0.1:8771隔离无模型实例，另在所有者给定8766地址验证实际页面。
### 禁止项
- 不修改原始PDF、raw/derived/private、科学/许可登记、状态机、答案、24步内容、AI或后端。
- 不新增依赖、模型请求、系统服务操作、Git提交/push或公众教学发布。
### 涉及目录及文件职责
| 目录职责 | 文件 | 拟改动 |
| --- | --- | --- |
| 导入投影 | frontend/student/views/inquiry.js | 精简展示、保留交互与可访问标题 |
| 候选文案 | frontend/student/content/demo-content.json | 四段正文、重试短提示与来源关联 |
| 现有浏览器守卫 | tests/test_inquiry_browser.mjs、tests/test_pages_browser.mjs | 调整已删除元素断言，核验现行页面 |
| 事前/事后与当前事实 | 本TASK/REPORT、STATE.md、PROGRESS.md | 如实闭环 |

## 非目标
不改第二/三幕正文、导航状态或主线探究，不做科学功效判断和新的文献综述。

## 必须执行的操作
1. 保存本轮相关文件基线、三份PDF指纹；只读核对论文背景。
2. 完成最小展示和文案修改，保留既存TASK-039改动。
3. 运行标准工程检查和受影响的浏览器流程，查看桌面/手机截图。
4. 生成REPORT，更新STATE/PROGRESS。

## 验收标准
- [x] 指定文案在第一幕初始/错答状态均不显示，正文四段无“它”。
- [x] 生物活性有已有来源支持；待审/来源字段未丢失，无新增观测或疗效结论。
- [x] 3D分子与错误/正确答案、逐幕推进、论文门禁及回退/刷新继续可用。
- [x] `python3 scripts/dev.py check`、`npm test`及受影响浏览器检查通过，桌面/手机无溢出和应用错误。
- [x] 三份PDF SHA不变；科学、教学、发布三个门不晋级。

## 验证
```bash
python3 scripts/dev.py check
npm test
QA_OUTPUT=/tmp/flavoglycolab-task-040/browser FRONTEND_URL=http://127.0.0.1:8771/ npm run test:browser
QA_OUTPUT=/tmp/flavoglycolab-task-040/pages FRONTEND_URL=http://10.70.160.64:8766/ npm run test:pages-browser
```
所有浏览器API由现有测试夹具拦截，不调用真实模型；截图/临时探针置于/tmp。

## 停止条件
需要改受保护资产、状态机或科学/审核门；来源不支持扩写；不能安全保留现存修改；既有与新增故障无法区分。检查失败时不得记Completed。

## 报告要求
生成docs/reports/REPORT-040-intro-copy-simplification.md，记录真实改动、验证分母、失败/重试和未测边界；更新STATE/PROGRESS，不自动启动下一TASK。
