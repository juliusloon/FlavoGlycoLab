# REPORT-042：左侧主线任务与实验历程排版

## 对应任务
- TASK文件：docs/tasks/TASK-042-sidebar-task-typography.md
- 状态：Completed（2026-10-24，工程验证）
- 基线分支/提交：main / 92fe3f8；保留既有未提交修改。
- 结果提交：pending；未提交/push。
- 授权来源：human_direct，所有者本轮左栏排版指令。

## 改动文件与职责
本轮差异以`/tmp/flavoglycolab-task-042/baseline/`为基线；Git还包含TASK-039—041的既有改动，不将其归入042。

| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 任务投影 | frontend/student/views/inquiry.js | 本阶段完整列表；24条简短行动介绍；去重复状态/CTA/details；导入完成与原解锁规则投影disabled，完成勾选附无障碍名称 |
| 阶段投影 | frontend/student/views/workbench.js | 新实验入口移至实验历程标题右侧，保留既有data-action与确认处理 |
| 样式 | frontend/student/styles.css | 放大字号、任务行及阶段行；手机纵向保留介绍；删除失效CTA/details/底部样式；左栏自然滚动 |
| 图标 | frontend/student/ui.js | 新增本地SVG历史与加号图标，沿用现有icon函数 |
| 既有工程守卫 | tests/test_inquiry_browser.mjs | 更新四项完整列表、介绍、字号、导入禁用和任务点击断言；AI浮层几何改按文档坐标比较，避免聚焦导致的页面滚动误报 |
| 界面规范 | docs/design/interface-system.md | 当前侧栏字号、完整列表、手机简介及标题右侧新实验规范 |
| 执行闭环 | TASK-042/REPORT-042、STATE.md、PROGRESS.md | 事前范围、事后结果、当前事实与里程碑 |

## 实际操作与观察
1. 先读PROJECT→STATE→ARCHITECTURE，按所有者直接指令登记042；保存8项文件基线、现有Git状态及210项保护指纹。
2. 取消前三项切片与重复details，直接投影`questProgress.tasks`中的本阶段四项；六阶段仍由实验历程切换。简介来自既有任务目标的非数值概括，不修改原始任务内容。
3. 删除侧栏重复底部标题和开始/继续探究、阶段完成CTA。任务末尾的下一项/完成探究及阶段入口继续承担原流程；全部完成后仍可点击四项回看。
4. 标题18px/600、任务标题15px、简介13px、阶段14px；手机取消横排挤压与隐藏简介，保留全文换行。新实验位于标题同一行右侧，历史/加号均为本地SVG。
5. Browser plugin not available，使用已有Node22.23.1与Playwright/Chromium153，无新增依赖。临时public服务绑定127.0.0.1:8772并禁用模型配置；另查看现有`http://10.70.160.64:8766/#/task/01`桌面/手机页面，四项相关静态资产与本地字节一致，未重启8766。
6. 已实际查看桌面侧栏及手机完整截图，任务、简介和历程文字可见，标题行按钮无重叠。证据全部位于`/tmp/flavoglycolab-task-042/`，不进入Git。

## 验证
| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `PATH=.../node/v22.23.1/bin:$PATH python3 scripts/dev.py check` | Python78项：75通过、3显式research跳过；附带Node78/78；`dev-check.log` |
| `npm test`（Node22） | 78/78通过；`npm-test.log` |
| `FRONTEND_URL=http://127.0.0.1:8772/ npm run test:browser` | 1518/1518通过；三路线/三视口、24任务、六阶段、记录与导师夹具；错误0、外联0，4条既有WebGL性能warning；`browser-verified/results.json` |
| `FRONTEND_URL=http://127.0.0.1:8772/ npm run test:pages-browser` | 643/643通过；页面直达、回退/刷新、记录及共享入口；错误0、外联0，4条WebGL性能warning；`pages/results.json` |
| `node --input-type=module < /tmp/flavoglycolab-task-042/sidebar-qa.mjs` | 297/297通过；1440/1024/375px、R1/R2/R3×六阶段、字体/换行/对齐/无溢出；导入门禁、解锁、直接打开、键盘回看及答案保留；新实验取消不变、确认清草稿且保留历史；错误/警告/外联/模型请求均0；`sidebar-results.json` |
| 8766实页 | 1440×1000及375×812：均4任务/4简介、新实验入口可见；`live-results.json`、`live-1440.png`、`live-375.png`、`sidebar-final.png`；四项资产4/4字节相同，`live-assets.json` |
| 保护与差异 | 210/210文件SHA+size不变，包含三篇PDF、来源/许可登记、冻结资产及8项前端规则/内容/编排文件；`protected-result.json`；`git diff --check`通过 |

运行浏览器命令时设置已有`CHROMIUM_EXECUTABLE`和`QA_OUTPUT=/tmp/flavoglycolab-task-042/...`；完整环境与本轮源码差异保存于临时目录。保护代码包含app.js、lab-state、learning-state、quest-state、navigation、analysis-engine、data-query及demo-content.json。

## 与任务合同的偏差
无范围偏差。实际失败/重试保留如下：

- 首次独立截图在3D渲染尚未完成时返回`Unable to capture screenshot`；等待分子画布/降级图出现后重拍成功。
- 工作台首轮1062项后、第二轮1064项后，R2/375的AI浮层打开/关闭几何断言分别失败：原断言把视口位置变化当作布局变化。检查固定浮层和聚焦行为后，将两处比较统一为文档坐标；第三轮1518/1518通过。未改AI或app.js。
- 侧栏专项发现手机残留`.stage{font-size:11px}`覆盖主规则，已改14px并重验。之后专项末项误预期三次评价请求；public未配置模型时实际0请求，与app原逻辑一致，修正临时脚本断言后297/297通过。临时失败截图及日志保留。

## 数据、许可与审核门
research_evaluation保持候选；teaching_case_review仍22/22待审、教师批准0；public_teaching_release=not_started。

无科学内容、数值、原件、来源/许可或教师审定变更。`observations=[]`、缺少真实测量和数值仿真的现状不变。

## 已发现但未改的问题
TASK-041仍处于原报告登记的实施状态，本任务不代验收。

手机页面按内容纵向滚动；当前专项是浏览器视口模拟，无移动实体设备或新增品牌浏览器验收。缺少正式教学/科学验证等原有边界保持原状。

## 遗留风险、仓库与CI
main / 92fe3f8；本轮10项文件变动与既有TASK-039—041修改共存，未提交/push、未运行新CI。临时测试服务于收尾关闭，8766常驻服务未重启；静态资产刷新可见。未调用真实模型或更改系统服务/网卡/防火墙。受限数据和外部材料保持原有路径与许可，不新增发行物。

## 建议的下一TASK
不自动启动。
