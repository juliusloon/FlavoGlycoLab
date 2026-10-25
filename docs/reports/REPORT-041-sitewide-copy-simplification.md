# REPORT-041：全站精简展示与陈述式文案

## 对应任务
- TASK文件：docs/tasks/TASK-041-sitewide-copy-simplification.md
- 状态：Completed（工程验证，2026-10-24；已复核并行侧栏改动的兼容性）
- 基线提交与分支：main / 92fe3f8，保留TASK-039/040未提交工作。
- 结果提交：pending；未提交/push。
- 授权来源：human_direct，本轮所有者全站推广指令。

## 改动文件与职责
本轮基线存于`/tmp/flavoglycolab-task-041/baseline/`，原TASK-039/040差异保留。以下是本TASK负责的部分；并行TASK-042新增的侧栏、图标、字号和对应断言不归本TASK。

| 文件 | 本轮改动与职责 |
| --- | --- |
| frontend/student/views/pages.js | 总览去口号、导入复述与重复待审；保留续接、阶段及回访入口 |
| frontend/student/views/inquiry.js | 三幕统一清理幕次/来源/审核条；24任务去数字来源与开发块；论文去重复标题和逐卡待审；历史候选审计折叠，表格去C编号；保留来源/PDF入口及真实反馈 |
| frontend/student/views/learning.js | 路线学习门禁用进度和动作表达，去内部状态码与长说明；独立判断空态精简 |
| frontend/student/views/workbench.js | 阶段标题/模式/条件/分析/记录说明精简，去观察对象字段、白名单/黑名单等实现词；保存位置、缺数据与数值语义保留；不改参照锁定/计算/状态 |
| frontend/student/views/inquiry-tools.js | 将两处“它”改为明确对象，精简证据链指引；工具逻辑/分类答案不变 |
| frontend/student/components.js | 设置增加按需展开的“资料与审定状态”，保留案例与教学待审事实及来源查询链接 |
| frontend/student/components-page.js | 去顶部泛化介绍，技术规范和可操作示例按开发用途保留 |
| frontend/student/case-page.js、case.html | 案例使用明确标题/章节，去版本/重复标签与口号；原S1—S6、旧功能状态、版本和SHA移入展开区；原交件内容不改 |
| frontend/student/data-page.js、data-page.css、data.html | 去kicker、介绍/每卡待审/重复来源ID；三篇来源登记改原生details；保留筛选、记录ID、原指标/条件/定位、实际来源和原文报告标签 |
| frontend/student/content/demo-content.json | 仅48个展示叶字段变化；24段任务正文改为直接陈述，其他字段完整保留 |
| frontend/student/app.js | 仅论文标题和机器结果解析的展示字符串精简，去实现字段提示；不改请求/状态/事件/协议 |
| frontend/student/index.html、retro-import.js | 精简条件偏离、新实验/重来、逆合成说明；保留操作后果和计算候选性质，校验规则不变 |
| tests/test_inquiry_browser.mjs | 将全部24任务纳入去引用/无开发字段检查，幕二同规则；审定事实改核验设置可查询；适配“非实测”等现行文案 |
| tests/test_pages_browser.mjs | 每个被检页面检查无重复页头/开发kicker、设置中审定查询入口；多details定位到开发者区域 |
| tests/test_data_page_browser.mjs | 检查去逐卡待审、来源按需展开；展开核对后复位滚动再截首屏 |
| tests/test_navigation.mjs | 总览标题断言随“实验阶段”精简更新 |
| docs/design/interface-system.md | 维护全站统一文案、按需溯源、真实反馈和科学边界规则 |
| 本TASK/REPORT、STATE.md、PROGRESS.md | 事前合同、事后事实和当前状态/里程碑；收尾更新不覆盖并行任务 |

`ui.js`、`styles.css`中本轮期间出现的图标和侧栏字号改动归TASK-042，本TASK没有修改这两个文件。ARCHITECTURE无新增工件责任，无新运行文件或依赖。

## 实际操作与观察
- 全站去掉重复介绍、kicker、幕次、文案版本、数字来源和内部实现说明。正文直接陈述结构、组分或证据关系，实际题目、作答标签、格式限制、按钮和错误提示保留。
- 24任务正文由2776字缩为1913字；未更改题目答案、选择项、任务顺序、目标所需证据或量规。原始成员交件与S1—S6标准句仍逐字保留。
- 来源/许可/待审事实通过“设置→资料与审定状态”、案例原件说明、数据来源展开区及论文/PDF入口查询。数据卡保留原文报告/非本次观测标识，机器反馈仍明确机器来源及待审状态。
- 只修改已有student资产，8766刷新即可读取；未重启常驻服务，未调用真实模型。完整流程在8771无模型临时实例执行。

页面覆盖（当前所有已实现页面）：

| 页面/区域 | 覆盖 |
| --- | --- |
| 总览与导入 | home＋intro/1—3，去重复顶部与来源/审定条，答错/答对/逐幕推进保持 |
| 主线任务 | task/01—24，陈述正文、去开发来源、保留分页/图示/题目/反馈/PDF与导师入口 |
| 阶段操作 | stage/1—6，路线确认、装配、方案、操作、分析和反思；实际状态继续准确显示 |
| 论文 | 并排对照与结论反思，保留三篇、14字段、4组报告值、PDF与来源定位 |
| 记录 | 当前/历史比较、学习记录、时间线与JSON/Markdown导出，保存约束继续显示 |
| 案例 | 分子、三路线、图、表与参考文献；原件说明和旧版本资料可展开 |
| 数据 | 全21记录、筛选/清除/空状态/URL深链/来源登记展开，数值和定位未改 |
| 组件与弹窗 | 开发示例、设置/审定查询、AI、逆合成、新实验；原套件另覆盖路线切换/重来/条件偏离 |

## 验证
Browser plugin not available，沿用现有Playwright，Node22.23.1＋Chromium153.0.8010.12，未安装依赖。证据均在`/tmp/flavoglycolab-task-041/`。

| 检查 | 实际结果与证据 |
| --- | --- |
| python3 scripts/dev.py check | Python78＝75通过＋3显式research跳过；内置Node78/78通过，dev-check.log；文档收尾后final-check.log再次全通过 |
| npm test | 78/78，npm-test.log |
| 工作台浏览器 | 最终1518/1518通过（三路线/1536、768、375宽度，含失败/慢PDF/键盘夹具），browser-final/results.json；使用当前含TASK-042侧栏的源码与新断言重新运行，不沿用旧结果 |
| 跨页浏览器 | 最终643/643，1440/900/375宽度，pages-final/results.json；实际导航、返回/刷新、记录、深链、设置和组件均通过 |
| 数据页浏览器 | 71/71，1536/768/375宽度；consoleErrors=0、externals=0；data/data-browser-results.json |
| LAN页面与弹窗专项 | 最终388/388，在10.70.160.64:8766下40入口×桌面1440×1000/手机375×812＋关键弹窗，coverage-final/results.json；90张有效截图，已在TASK-042侧栏合入后重截。用本机隔离浏览器状态夹具，不代表真实用户已完成实验 |
| 页面身份、非空、错误层 | 40入口标题/正文/预期任务或幕次正确，无框架错误层，无开发字段或重复页头 |
| 控制台和外部请求 | 上述已通过套件应用错误/外部请求均0；常见套件有4条既有WebGL ReadPixels性能warning，不声称无warning |
| 实际视觉查看 | 已查看总览、分析、数据、手机任务14、设置、手机案例等截图；最终又查看当前侧栏下的手机任务14和桌面论文结论。布局清晰，初轮视觉夹具误报保存冲突已修正并重截，未修改产品来掩盖冲突 |
| JSON字段保护 | 只48个允许展示叶字段变化，其他全部相等：答案/选择项、21条DQ记录、14字段、4报告组、所有规则/来源/定位/SHA/审核和S1—S6不变；content-changed-paths.json |
| 原件/状态机保护 | 208/208文件SHA＋size零差异，含raw/derived/private、metadata、registries、migrations、reference与6个状态/规则模块；protected.json |
| Git空白/范围 | git diff --check通过；并行TASK-042的图标/侧栏/字号差异另归042，未覆盖 |

关键命令（现有临时实例8771必须启动，运行资产均取本项目）：
```bash
export PATH=/home/ljx/.nvm/versions/node/v22.23.1/bin:$PATH
export CHROMIUM_EXECUTABLE=/home/ljx/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
python3 scripts/dev.py check
npm test
FRONTEND_URL=http://127.0.0.1:8771/ QA_OUTPUT=/tmp/flavoglycolab-task-041/browser npm run test:browser
FRONTEND_URL=http://127.0.0.1:8771/ QA_OUTPUT=/tmp/flavoglycolab-task-041/pages npm run test:pages-browser
FRONTEND_URL=http://127.0.0.1:8771/ QA_OUTPUT=/tmp/flavoglycolab-task-041/data npm run test:data-browser
node /tmp/flavoglycolab-task-041/capture-pages.mjs
```

## 与任务合同的偏差
- 初次Node检查有两项旧文案断言失败：总览旧标题和“零”的字面形式；总览断言随设计更新，缺失值语义保留原“缺失不等于 0”，重跑78/78。
- 首轮跨页检查仍按一个details定位设置，新增审定展开区后出现多匹配；定位开发者区域后643通过。工作台的逐卡待审和“非已测值”旧文案断言同步改为可查询审定状态及“非实测”，完整1518通过。
- 临时视觉夹具先因学习输入未按阶段设置而被状态机拒绝；改用对应阶段。随后误等隐藏分页里的3D画布，改为只等待可见查看器；均未修改产品规则。
- 首轮90截图出现“另一个标签页”保存冲突，原因为夹具在每次文档载入时重写localStorage；改为仅启动时种入一次状态，并新增无保存冲突检查，388项通过且重截。数据页展开来源后测试滚动位置留在页尾，已在截首屏前归顶。
- 收尾检测到并行TASK-042实际修改了相同视图和测试；保留全部修改，不代042改侧栏。041一次重跑仍使用“三项预览”旧断言而失败，042另有手机AI几何检查失败。对方更新侧栏样式/断言后，本TASK以当前源码独立重跑1518/643/388全部通过；不将中间失败记为通过，也不代签TASK-042专项。

## 数据、许可与审核门
research_evaluation保持候选；teaching_case_review仍22/22待审、教师批准0；public_teaching_release=not_started。

## 已发现但未改的问题
无本TASK阻断。TASK-042的侧栏专项仍归其独立合同/报告，本报告只记录全站文案与当前集成回归。原图/PDF及原始交件中的图内文字、原始标准句和历史记录保持原样，不将来源原件当作可随意改写的页面文案。

## 遗留风险、仓库与CI
main / 92fe3f8；既有TASK-039/040与并行TASK-042修改均保留。未提交/push、未运行新CI、未重启8766或调用真实模型。041临时8771实例已在验证后停止，未操作042的8772实例；最终保护与各套件结果汇总见本地final-audit.json。

LAN专项是服务器自身经LAN地址访问，不是另一物理客户端。截图以桌面/手机视口验证，未测试真实手机、Safari/Firefox或教学效果。长页自然纵向滚动；没有声称所有内容单屏可见。工程与文案统一不晋级科学、教师或发布状态门。

## 建议的下一TASK
不自动启动。
