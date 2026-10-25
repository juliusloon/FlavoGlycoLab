# REPORT-043：阶段图标、独立面板与全站字号统一

## 对应任务
- TASK文件：docs/tasks/TASK-043-sitewide-panels-type-scale.md
- 状态：Completed（2026-10-24，工程验证）
- 基线分支/提交：main / 92fe3f8；保留既有未提交工作。
- 结果提交：pending；未提交/push。
- 授权来源：human_direct，所有者本轮全站布局与字号指令。

## 改动文件与职责
本轮以`/tmp/flavoglycolab-task-043/baseline/`为逐文件基线，保留039—042既有工作；不将Git总差异全部归为043。

| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 图标 | frontend/student/ui.js | 新增六阶段SVG及唯一STAGE_ICONS映射 |
| 阶段投影 | frontend/student/views/workbench.js、views/pages.js | 实验历程/总览六阶段序号改图标；保留名称、事件、禁用及当前状态；去历程标题前误加的历史图标 |
| 共享视觉 | frontend/student/design-tokens.css、components.css | 统一12/13/14/16/20/24px层级，手机标题22px；页头56/48px，同步高度token；统一标题/字段默认值及图标容器 |
| 学习页外观 | frontend/student/styles.css | 左栏小一档；中右面板独立白底/边框/圆角/16px间距；去右侧重复外框；统一文字与反馈字号、右栏sticky顶部和手机堆叠；限定覆盖查看器两个内联11px提示 |
| 领域外观 | frontend/student/case-page.css、data-page.css、inquiry-tools.css | 案例、数据及09/17/20工具沿同一token层级，普通辅助字号最低12px；科学SVG内字和原图不改 |
| 组件示例 | frontend/student/components-page.js | 现有字号/布局说明同步新尺寸，不改示例功能 |
| 既有工程守卫 | tests/test_inquiry_browser.mjs | 侧栏标题断言18px改16px，其余流程守卫保留 |
| 规范与闭环 | docs/design/interface-system.md、TASK/REPORT-043、STATE/PROGRESS | 当前字号、页头、图标、面板规范与真实验收；STATE去除041仍实施中的过时描述，引用其已完成报告 |

test_pages_browser.mjs在预算内但最终无需修改；未新增运行文件/依赖或另一份科学/学习状态。

## 实际操作与观察
1. 按PROJECT→STATE→ARCHITECTURE和本轮human_direct登记合同；保存15项允许路径基线、Git状态和211项保护指纹。组件页说明在修改前补入同一合同预算和基线。
2. 将六个阶段分别映射为路线、烧瓶、条件调节、取样、分析、报告SVG，实验历程与总览共享。图标仅作视觉，名称继续提供可读/无障碍含义；阶段和任务门禁保持原规则。
3. 中间叙事/导入内容和右侧问题/填写区分别为白色、1px边框、16px圆角的独立面板；间距16px、桌面padding24px/手机16px。右侧保留独立滚动和sticky，去内层重复卡片外框，原有输入/分页/反馈完整保留。
4. 左栏标题18→16px、任务15→14px、简介13→12px、阶段14→13px。普通正文与填写14px、按钮等控件13px、辅助12px、面板标题16px；主标题24px、手机22px。五份既有CSS的数值字号归入共享token；科学图示内标注和原始图像保持原样。
5. 共享页头桌面实测56px、手机48px；通过同一高度变量同步实验空间。品牌/两项主导航/记录/设置维持一行，手机不靠缩小正文挤出空间。
6. Browser plugin not available，沿用已有Node22.23.1、Playwright和Chromium153，无依赖安装。127.0.0.1:8772临时实例禁用模型；8766只查看页面、核对静态字节，不重启服务。
7. 40个页面位置×1440/768/375px完成逐页检查；桌面/手机80张首屏截图及三个视口各两张弹窗截图，共86张有效截图。实际查看任务、导入、案例、数据、论文/分析、记录、阶段、组件的代表截图，并查看8766桌面/手机实页。

## 验证
| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `python3 scripts/dev.py check`（PATH使用已有Node22） | Python78项：75通过、3显式research跳过；附带Node78/78；`dev-check.log` |
| `npm test` | 78/78；`npm-test.log` |
| `FRONTEND_URL=http://127.0.0.1:8772/ npm run test:browser` | 1518/1518；三路线/三视口、24任务、六阶段、门禁、保存/导出、论文/导师夹具等；错误0、外联0，4条WebGL性能warning；`final-browser/results.json` |
| 同地址 `npm run test:pages-browser` | 643/643；直达/回退/刷新/续接、共享设置/组件及资料页；错误0、外联0，4条WebGL性能warning；`final-pages/results.json` |
| 同地址 `npm run test:data-browser` | 71/71，控制台错误0、外联0；`data.log` |
| `node --input-type=module < /tmp/flavoglycolab-task-043/page-coverage.mjs` | 888/888；1440/768/375px×40页面位置；页头56/48px、标题24/22px/面板16px、正常文字≥12px、中右独立边界/16px间距/无溢出、正文/输入14px、六个不同阶段图标；设置、新实验取消、阶段点击、任务回看、导师输入；错误0、外联0、模型请求0，4条WebGL性能warning；`coverage/results.json` |
| 8766实页与资产 | 1440×1100、375×812：均六图标、独立面板，字号16/14/12/13/14/14px、页头56/48px，无横向溢出；`live-results.json`、`live-1440.png`、`live-375.png`；十项相关资产10/10匹配，`live-assets.json` |
| 保护核对 | 211/211 SHA+size零差异，三篇PDF SHA不变；包含app.js、lab-state、learning-state、quest-state、navigation、analysis-engine、data-query、demo-content和views/inquiry.js；`protected-result.json` |
| 差异检查 | `git diff --check`通过；本轮逐文件差异`implementation.diff`，与既有修改分开 |

浏览器命令均使用已有CHROMIUM_EXECUTABLE和`QA_OUTPUT=/tmp/flavoglycolab-task-043/...`；所有过程证据、脚本、截图仅存本机/tmp，不进入Git。

## 与任务合同的偏差
无范围偏差；组件示例里的旧尺寸说明在实施前补入预算，属于全站一致性的同一授权。失败/重试如实保留：

- 全页专项先后发现查看器加载提示内联11px、叙事小标题14px、组件空状态标题回落到浏览器默认21px、导师输入框仍12px；分别使用限定的展示CSS与共享标题默认值补齐，不改查看器或AI代码。
- 最后一次导师字体探针曾读取调整前样式；独立新页面确认实际14px后，专项改为逐页刷新并对导入/任务等待精确页面标识，消除hash换页/缓存干扰。最终120个页面位置检查及888项全部通过。早期失败日志/截图仍在临时目录。
- 工作台、跨页、数据三个既有套件未出现产品流程失败；后续字号补齐后再次运行工作台和跨页，仍1518/643通过。

## 数据、许可与审核门
research_evaluation保持候选；teaching_case_review仍22/22待审、教师批准0；public_teaching_release=not_started。

没有更改原件、来源/许可、内容/答案、学习规则或数值字段；普通练习/工程截图不构成化学观测、教师审定或公开教学服务验收。

## 已发现但未改的问题
科学图示及图片内部的专用字和原件继续保持原样，不以网页字体覆盖。手机仍按内容长度纵向滚动。视口模拟不等于移动实体机验证；未做新增浏览器品牌或课堂并发测试。

## 遗留风险、仓库与CI
main / 92fe3f8；保留039—042既有未提交修改。本轮未提交/push、未运行新CI、未调用真实模型、未改常驻服务/网卡/防火墙。8766静态更新刷新即可见；本轮临时8772服务收尾关闭。所有受限数据与第三方材料保持原路径和许可，不新增公开载荷。

## 建议的下一TASK
不自动启动。
