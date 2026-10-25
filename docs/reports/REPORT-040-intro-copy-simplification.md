# REPORT-040：导入文案删减与异槲皮苷介绍改写

## 对应任务
- TASK文件：docs/tasks/TASK-040-intro-copy-simplification.md
- 状态：Completed（工程验证，2026-10-24）
- 基线提交与分支：main / 92fe3f8，保留既有TASK-039未提交改动。
- 结果提交：pending，未提交/push。
- 授权来源：human_direct，本轮所有者明确删除及改写指令。

## 改动文件与职责
本轮以`/tmp/flavoglycolab-task-040/baseline/`保存的启动文件为比较基线，保留TASK-039已有未提交差异。实际仅修改以下7个路径，未增加运行资产或依赖。

| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 导入展示 | frontend/student/views/inquiry.js | 删除共用scene-title/orientation/步骤条；第一幕不投影幕次、正文来源、审核标签及问题来源；按当前幕读取retry标记，避免空对象被当作已答错 |
| 候选介绍 | frontend/student/content/demo-content.json | 仅intro.case内四段、末段来源关联及重试短提示改动；四段改用明确主语，展开潜在生物活性研究方向 |
| 现有交互守卫 | tests/test_inquiry_browser.mjs | 调整已删除元素及页面标题断言；初始无错误反馈，错答仍留本幕，正文四段无“它” |
| 任务合同 | docs/tasks/TASK-040-intro-copy-simplification.md | 事前范围、授权、验证和验收结果 |
| 事后事实 | 本REPORT | 实际改动、失败/修正和验证边界 |
| 当前状态 | STATE.md | 当前导入显示、验证和待审状态 |
| 里程碑 | PROGRESS.md | 增加本任务完成里程碑 |

`tests/test_pages_browser.mjs`本轮未改，复用原跨页守卫；ARCHITECTURE不新增工件责任，TASK/REPORT继续归既有目录。

## 实际操作与观察
- 已删除导入共用顶部标题、介绍和步骤条；第一幕来源/审核/幕次提示不再投影。
- 已改写四段介绍与错误短反馈；末段关联三篇已有来源，待审字段保留。
- 已只读提取三篇原PDF首页/第二页，核对水溶性及抗氧化、抗过敏、心血管保护背景；三份SHA与登记相符。
- 保留“认识异槲皮苷”内容标题、四段、3D分子/聚焦/复位与右侧问题。错误时仅显示“回答不正确，请重新选择。”，答对反馈和进入下一幕按钮继续沿用；三幕仍顺序推进。
- 扩写仅作研究背景：Pei2019摘要/引言支持与槲皮素的水溶性比较，Zhang2015引言支持抗氧化/抗过敏研究背景，Niu2024摘要/Background支持心血管保护研究方向。三者均为制备论文中的背景转述，本次未独立核验其所引生物活性研究，不新增临床或本实验功效结论。
- 只读8766实际地址并用既有服务直接显示更新资产；无需重启。完整工作台测试使用8771临时实例，配置指向项目内不存在的测试配置路径，未读取私有模型配置；套件的评价夹具不调用真实模型。

## 验证
| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| npm test（本机已有Node22） | 78/78通过，/tmp/flavoglycolab-task-040/npm-test.log |
| python3 scripts/dev.py check | Python78＝75通过＋3显式research跳过；内置Node78/78通过；dev-check.log；文档收尾后final-check.log再次全通过 |
| npm run test:browser | 1475/1475，Chromium153.0.8010.12，1536×1024/R1、768×1024/R3、375×812/R2及失败/慢PDF/键盘等夹具；browser/results.json |
| npm run test:pages-browser | 577/577，实际8766地址，1440/900/375三宽度；pages/results.json；回退/前进/刷新、草稿和记录继续通过 |
| 实际LAN专项 | 38/38，1440×1000、375×812；lan-qa.json。初始无误报、四段/删除项、聚焦/复位、错答/答对、逐幕推进、回退/刷新、论文门禁→task/01均通过 |
| 页面身份/非空/错误层 | 请求URL和文档标题正确，认识异槲皮苷标题、正文与3D画布可见；无框架错误层 |
| 控制台/请求 | 三套正常流程应用error/pageerror均0、外部请求0；每套4条既有WebGL ReadPixels性能warning，不记为无warning |
| 视觉检查 | 已实际查看after-1440.png及after-375.png；删除区域不留空块，桌面两区、手机纵向布局，均无横向溢出。保留before-1440/375对照；证据均在/tmp/flavoglycolab-task-040/ |
| 内容及原件保护 | 将intro.case从新旧JSON剔除后整体相等；问题prompt/choices/answer/feedback/source_ids/review_status均不变；三PDF SHA 3/3与原登记相符 |
| Git空白与范围 | git diff --check通过；本轮相对启动快照仅上述7路径，未改原始资产、科学登记、状态机、服务端或TASK-039其他改动 |

Browser plugin not available，按前端测试技能使用现有Playwright。复现环境：
```bash
export PATH=/home/ljx/.nvm/versions/node/v22.23.1/bin:$PATH
export CHROMIUM_EXECUTABLE=/home/ljx/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
python3 scripts/dev.py check
npm test
FRONTEND_URL=http://127.0.0.1:8771/ QA_OUTPUT=/tmp/flavoglycolab-task-040/browser npm run test:browser
FRONTEND_URL=http://10.70.160.64:8766/ QA_OUTPUT=/tmp/flavoglycolab-task-040/pages npm run test:pages-browser
node /tmp/flavoglycolab-task-040/lan-qa.mjs
```
8771为本轮临时无模型服务，验证完成后已停止；环境绝对路径仅记录本机验收工具，不成为运行依赖。

## 与任务合同的偏差
- 系统python命令不可用，改用已有python3；默认Node18低于Playwright要求，改用本机已有Node22；Playwright默认1248浏览器未安装，显式使用已有1243，无依赖安装。
- Python首轮78项中74通过、3跳过、1失败，原因为新TASK尚无同名REPORT；登记报告后完整重跑通过。未将首轮记为通过。
- 首轮截图发现既有retry对象直接作为布尔值，初始就显示观察指引；替换为错误短反馈后会误报已答错。已修正为读取当前幕retry[act]，初始与第二幕无错误，答错后才显示。此为导入展示修正，不改学习状态。
- LAN临时探针首次以整个main的“来源”字样判删文，误命中保留的“结构来源与SMILES”控件；改为核验用户点名的正文/问题来源条。另一轮手机探针未等待原生dialog的异步close重渲染就读取门禁，按既有套件的1/3就绪条件等待后通过；均未改产品来迎合探针。
- 修正retry投影后重跑完整工作台与跨页套件通过；未新增实施镜像测试或依赖。

## 数据、许可与审核门
- research_evaluation：仍为历史/计算候选，未做新的化学实验验证。
- teaching_case_review：22/22待审，教师批准0。
- public_teaching_release：not_started，未开展正式公众教学发布。

## 已发现但未改的问题
无阻断。本轮保留分子查看器的“结构来源与SMILES”按需入口；用户点名的正文及问题内来源标签均已移除。第二/第三幕原有正文和审核展示不属此次第一幕删文范围，继续保留。

## 遗留风险、仓库与CI
当前工作树包含TASK-039既有改动；本轮未提交、push、运行新CI、修改/重启8766服务或调用真实模型。

LAN专项为服务器自身经其LAN地址访问，非第二物理客户端。未测Safari/Firefox、真实手机、全部视口笛卡尔积或教学效果；移动端自然纵向滚动，不宣称单屏放下所有内容。截图与工程通过不替代教师审定。

## 建议的下一TASK
无自动后续任务。
