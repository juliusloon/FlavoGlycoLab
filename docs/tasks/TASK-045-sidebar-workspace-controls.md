# TASK-045：左下操作菜单、可收起导航与正文减框

## 合同元数据
- 任务ID：TASK-045
- 状态：Completed（2026-10-25，工程验收；见同号REPORT）
- 基线分支/提交：main / 92fe3f8；保留TASK-039—044既有未提交修改。
- 授权来源：human_direct，2026-10-24所有者明确要求删除header bar、将标题与更多移至左下并向上弹出新实验/记录/设置、参考Paperico web实现侧栏收起、左右panel保留卡片而正文去框。
- 人工负责人：项目所有者；执行者：Cano。
- 修改预算：frontend/student/{components.js,components.css,design-tokens.css,index.html,case.html,data.html,components.html,app.js,styles.css,components-page.js,README.md}、views/{inquiry.js,workbench.js}；仅受布局/入口变动影响的现有tests/{test_navigation.mjs,test_pages_browser.mjs,test_inquiry_browser.mjs,test_data_query.mjs,test_data_page_browser.mjs}；docs/design/interface-system.md、ARCHITECTURE.md、STATE.md、PROGRESS.md、本TASK/REPORT。不要求用满预算；无新运行依赖。
- 关联ADR：沿用原生ES模块/共享组件，界面偏好与学习状态分开。

## 目标
学生端各页取消顶部站点栏，固定左下“标题｜更多”，更多向上显示“开启新实验 / 实验记录 / 设置”。主线任务与实验历程分别可收起，两者均收起时桌面缩为窄图标栏。正文移除外层白底边框/阴影，侧栏与右侧填写区各保留一层卡片。

## 背景与已核实事实
TASK-044已加入三幅文献图。当前入口由components.js共享，左栏由app.js刷新。Paperico本地web成品包含52px窄栏、隐藏标题文字而保留展开按钮的模式；本轮只读查看其呈现与行为，不复制整个框架、素材或引入跨工作区运行依赖。

## 范围
### 允许项
- 将共享站点栏替换为底部共享控件与向上菜单，保留总览/续接、设置开发入口和记录功能。标题链接回总览，学习续接使用现有页面入口/返回条。
- 新实验复用既有确认弹窗与保留历史逻辑；独立资料页可跳至学习应用请求同一确认，不直接清草稿。
- 两导航组分别折叠，组合成窄栏；折叠、展开、更多开关仅改变DOM与独立界面偏好，不重渲染正文或修改学习记录。保留aria-expanded、可读名称、键盘与焦点恢复、点击外部/Esc收起菜单。
- 取消正文叙事容器外框；左右功能区各一层卡片，不清除正文中的文献图、装置或数据专用边界。
- 只读查看Paperico已存在web资产；必要时启动仅本机临时静态参考服务，不更改其文件/后台服务/数据。所有活动运行资产仍来自本项目。
- 使用现有Playwright/Chromium做public与8766实页验证；临时服务无真实模型配置，8766不重启。
### 禁止项
- 不改demo-content及三幅原图/来源、raw/derived/private、metadata/registries、migrations、reference、原交件、状态机/答案/判定/AI协议。
- 不直接清除练习，不新建另一套学习真值，不更改权限/科学/教师/发布状态。
- 不改Paperico，不新增依赖、不改后端/常驻服务/模型/网卡/防火墙、不提交/push。
### 文件职责
| 职责 | 文件 | 拟变动 |
| --- | --- | --- |
| 全站入口与界面偏好 | components.js、四入口HTML、app.js | 左下控件、原生菜单/设置与新实验交接、折叠偏好 |
| 导航组呈现 | views/inquiry.js、views/workbench.js | 标题折叠按钮与内容容器；门禁不变 |
| 样式 | components.css、design-tokens.css、styles.css | 无页头高度、底部控件空间、窄栏/手机、正文去框 |
| 工程守卫 | 预算内既有tests | 更新旧页头断言/点击路径，验证菜单/折叠/焦点与原流程 |
| 规范与闭环 | 组件展示、README、设计规范、架构及TASK/REPORT/STATE/PROGRESS | 当前UI合同与真实验收 |

## 非目标
不重做正文科学内容、不新增教学任务、不重新绘图、不重构状态机或更换前端框架。

## 必须执行的操作
1. 保存允许路径基线与冻结指纹，登记TASK，查看Paperico的web折叠与底部操作模式。
2. 实现左下菜单与独立折叠偏好、正文减框，保留全部既有入口作用和破坏性确认。
3. 运行标准工程、工作台/跨页/数据浏览器回归；专项检查菜单向上、外部/Esc/键盘/回焦、分别/一起收起、刷新保留偏好而不改学习、移动布局、原文图及正文无框。
4. 核对保护零差异与8766静态资产，REPORT真实结果并更新STATE/PROGRESS。

## 验收标准
- [x] 各页无顶部站点栏；左下标题/更多清晰可达，菜单严格包含指定三操作并向上展开。
- [x] 新实验需原确认且历史保留；记录、设置及二级开发入口、总览/续接可用，弹窗与菜单焦点恢复正确。
- [x] 两组导航分别收起，两者均收起时桌面窄栏可恢复；偏好跨刷新保留，不改变草稿/学习/分子实例。
- [x] 正文透明、无外框/阴影；侧栏/答题区有单层卡片；桌面/平板/手机无横向溢出，浮动控件不互相覆盖，底部内容可滚动至操作条上方。
- [x] 标准检查与相关浏览器回归通过，无新应用错误/外部运行请求/真实模型调用；冻结原件与内容不变，三状态门不晋级。

## 验证
`python3 scripts/dev.py check`、`npm test`、`npm run test:browser`、`npm run test:pages-browser`、`npm run test:data-browser`及临时专项。Browser plugin not available，沿用已有Playwright/Chromium，不安装依赖。过程证据只存`/tmp/flavoglycolab-task-045/`。

## 停止条件
需改状态机/科学内容/冻结资产、需新增依赖、无法保全既有改动、必须修改Paperico或常驻服务、无法区分既有与新增故障。未通过不得记Completed。

## 报告要求
生成docs/reports/REPORT-045-sidebar-workspace-controls.md，写真实改动、验证分母、偏差及未测限制；更新STATE/PROGRESS，不自动启动下一TASK。
