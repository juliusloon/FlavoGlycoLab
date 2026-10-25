# REPORT-045：左下操作菜单、可收起导航与正文减框

## 对应任务
- TASK文件：docs/tasks/TASK-045-sidebar-workspace-controls.md
- 状态：Completed（2026-10-25，工程验收）
- 基线提交与分支：main / 92fe3f8；以`/tmp/flavoglycolab-task-045/baseline/`逐文件基线区分本轮与039—044既有未提交工作。
- 结果提交：pending；未提交/push。
- 授权来源：human_direct，2026-10-24所有者关于页头迁移、Paperico折叠及正文去框的直接指令。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 全站组件 | frontend/student/components.js | 原顶部栏改为左下标题/更多；原生popover向上显示指定三项，键盘/外部点击/焦点恢复；独立导航折叠偏好与按钮 |
| 全站外观 | frontend/student/components.css、design-tokens.css | 页头高度0，底部操作条56px，窄栏/窄屏与菜单外观，正文底部预留滚动空间 |
| HTML挂载 | frontend/student/index.html、case.html、data.html、components.html | 移除顶部header挂载，改为固定左下footer；学习页给导航组加只负责布局的容器 |
| 页面编排 | frontend/student/app.js | 导航刷新后同步折叠DOM；独立资料页#new交接到原新实验确认；保存异常在更多按钮提示；不改保存/清理规则 |
| 导航投影 | frontend/student/views/inquiry.js、views/workbench.js | 主线/历程标题折叠按钮、可隐藏内容容器；移除历程标题旁新实验重复入口 |
| 正文外观 | frontend/student/styles.css | 正文透明且无外层边框/阴影；右侧填写保持单层卡；两组都收起时80px窄栏，手机保留可恢复标题按钮 |
| 原有工程守卫 | tests/test_navigation.mjs、test_pages_browser.mjs、test_inquiry_browser.mjs、test_data_query.mjs | 旧顶部栏/入口断言更新；在现有跨页套件增加菜单键盘/外点/Esc、折叠持久化/独立性/不替换分子实例验证 |
| 规范与示例 | frontend/student/components-page.js、README.md、docs/design/interface-system.md、ARCHITECTURE.md | 当前底部入口/折叠/无框正文的组件调用与唯一职责 |
| 闭环 | TASK/REPORT、STATE.md、PROGRESS.md | 本轮事实与验收 |

预算内test_data_page_browser.mjs未改。没有新增生产运行文件或依赖，科学内容/状态机/文献原图不变。

## 实际操作与观察
本轮于2026-10-24接办，跨至北京时间2026-10-25收口；授权日期与完成日期分别记录。

1. 先登记合同、保存允许文件基线及411项SHA/size保护清单；文献图与JSON内容均包含在保护范围。
2. 只读查看Paperico本地web成品JS/CSS，并用单独的127.0.0.1:8774静态实例与空数据/无密钥的API夹具查看论文库收起效果。原页面宽栏收起为52px，标题/列表隐藏而展开图标保留。没有更改Paperico文件、服务或数据。
3. 本项目两组导航分别折叠；一组仍展开时保持原导航宽度，两组均收起时桌面80px图标栏，保留两个恢复入口。与Paperico的52px差异用于同时容纳本项目底部总览图标和更多按钮。手机使用可读的并排折叠标题按钮，保持触发按钮在可视范围。
4. 折叠只改现有DOM/独立localStorage偏好`flavoglycolab.sidebar.v1`，不调用save/render、不改草稿或学习解锁；组合宽度变化只通知查看器resize，不销毁实例。每次正常导航投影刷新后恢复折叠状态。
5. 更多菜单严格为“开启新实验 / 实验记录 / 设置”，保存状态另作非操作提示；原生popover提供外点关闭，补齐方向键/Home/End/Esc/Tab行为。菜单在打开设置/新实验前收起并聚焦可见的更多按钮，避免弹窗关闭后回到隐藏菜单项。
6. 总览入口由左下标题提供，续接沿用总览和资料页返回条；设置内开发入口、审定/许可资料、逆合成导入保留。独立资料页的新实验链接只请求原确认，不能直接清草稿；保存失败/跨标签页冲突会在更多按钮留提示并保持原toast保护。
7. 导入三幕和24任务的正文外层透明、无边框/圆角/阴影；保留图像/数据等专用边界。左右功能区保留单层白卡。
8. Browser plugin not available；使用已有Node22.23.1、Playwright和Chromium153；127.0.0.1:8775临时public实例无真实模型配置，8766实页检查不重启服务。

## 验证
所有临时脚本、截图和日志仅存`/tmp/flavoglycolab-task-045/`，不进Git。

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `python3 scripts/dev.py check`（已有Node22） | Python78项：75通过/3显式research跳过；附带Node78/78；dev-check.log |
| `npm test` | 78/78；npm-test.log |
| `FRONTEND_URL=http://127.0.0.1:8775/ npm run test:browser` | 1518/1518；三路线/三视口、24任务、六阶段、原门禁、保存/导出、路线切换、导师/PDF夹具；browser/results.json |
| 同地址`npm run test:pages-browser` | 最终662/662；原跨页/返回/刷新/续接/锁定页/开发入口及新增菜单键盘/外点/Esc/回焦、独立折叠/80px窄栏/刷新偏好/学习存储与分子实例保全；pages-complete/results.json |
| 同地址`npm run test:data-browser` | 71/71；三视口原筛选/深链/空状态/来源/边界；data.log |
| `node --input-type=module < /tmp/flavoglycolab-task-045/workspace-qa.mjs` | 最终797/797；37个应用页面位置×1440/900/375视口（111次地址检查），另含案例页跨文档新实验取消/确认保留历史，草稿精确字节/输入保全，坏偏好/存储失败降级，坏学习原存储不覆盖及更多保存警示；specialist-results.json、specialist-final.log |
| 8766实页专项 | 1440×1000、375×812、320×812；原合成难点页三图保留、无顶部栏、左右卡片/无框正文、菜单向上、底部控件/AI不重叠、收起与恢复；包含在797项内；live-*.png |
| 8766静态字节 | 17/17匹配源码：12项页面/组件/样式/视图资产及内容JSON/图源登记/三PNG；protection-results.json |
| 保护 | 411/411 SHA+size零差异，三PDF SHA3/3；包括demo-content、三幅原图/来源JSON、原状态机/AI后端/注册与受限来源等；protection-results.json |
| 差异/参考 | git diff --check通过；implementation.diff区分本轮基线；reference-ledger.md记录Paperico52px与本项目80px的有意差异，paperico-expanded.png / paperico-collapsed.png已实际查看 |

浏览器各套件均应用错误0、外部运行请求0；专项真实模型请求0。工作台/跨页/专项各4条既有WebGL性能warning，来自分子渲染，与新菜单和配图无关。没有安装依赖。

| 浏览器必查项 | 结果 |
| --- | --- |
| 页面地址/标题 | 通过，本地public及用户指定8766主机，独立资料页及新实验跳转正确 |
| 非空 | 通过，正文、原图、任务与真实表单完整 |
| 框架遮罩 | 通过，未见错误覆盖层 |
| 控制台 | 通过，无应用错误；既有WebGL性能warning单列 |
| 截图 | 通过，实际查看Paperico展开/收起、桌面菜单/窄栏、任务09、手机折叠及320px菜单；截图保留于/tmp |
| 交互 | 通过，更多→键盘/外点/Esc、设置/逆合成回焦、两组分别/一起收起与刷新恢复、资料页新实验取消/确认、历史和草稿保留 |

手机正文按长度滚动；固定操作条在滚动中覆盖其浮动位置，正文及侧栏已预留底部空间，末尾内容可滚至操作条上方。未声称所有正文同时单屏可见。Browser插件未提供，本次使用Playwright；后续可选装Browser插件做应用内预览与检查。

## 与任务合同的偏差
无范围偏差。参考实例的早期探针遇到两个同名目标的严格匹配失败，以及空settings夹具缺少model_profiles导致Paperico自己的加载错误；收窄定位并补齐空结构后成功查看52px折叠效果，没有据此修改Paperico或本项目科学内容。全页专项初始夹具的反思短句未满足既有最少8字合同，补齐夹具后继续；未放宽生产校验。

视觉检查发现旧mobile样式隐藏save-status；本轮用限定菜单样式恢复可读显示并增加跨视口断言。手机两组折叠后的滚动位置也已修正，恢复按钮保持可见；修改后跨页662项及专项797项再次全部通过。既有工作台/数据流程无失败，原始失败探针与最终日志分别保留，不把早期截图冒充最终状态。

## 数据、许可与审核门
research_evaluation保持候选；teaching_case_review仍22/22待审、0教师批准；public_teaching_release=not_started。没有改内容、来源/许可、文献图、答案、原件或模型协议；布局偏好、工程截图与测试不是科学观测或教师审定。

## 已发现但未改的问题
原24任务/正式评分/真实测量与公众教学发布的既有未完成边界不变。手机使用纵向滚动；视口模拟不代表实体设备或课堂验收。未增加新浏览器品牌、并发/模型测试。

## 遗留风险、仓库与CI
保留039—044既有未提交修改；未提交/push、未运行远端CI、未调用真实模型；8766只读查看与静态核对，不更改常驻服务/网卡/防火墙。Paperico仅设计参考，不成为本项目运行或验收前置依赖。临时8774参考服务和8775测试服务收尾停止，8766刷新即可见。

## 建议的下一TASK
不自动启动。
