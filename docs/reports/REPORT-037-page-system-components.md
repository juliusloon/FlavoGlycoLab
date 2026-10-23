# REPORT-037：子页面导航与统一界面组件

## 对应任务
- [TASK-037](../tasks/TASK-037-page-system-components.md)，human_direct，2026-10-24。
- 状态：Completed（工程自验，非教师审定）。
- 基线：main，1c0336e 加已有 TASK-035 未提交工作；结果提交 pending，未提交/push。

## 改动文件与职责
| 文件/范围 | 实际用途 |
| --- | --- |
| navigation.js | 纯路由解析、门禁检查、旧入口映射与可访问学习页续接 |
| components.js / components.css / design-tokens.css | 共用页头、标题、按钮、字段、面板、状态、空态、返回及统一视觉和分栏 |
| views/pages.js / app.js / index.html / styles.css | 总览、学习子页面与独立论文页编排、规范地址、历史和现有工作台联接 |
| views/inquiry.js / views/workbench.js | 导入进度转为可回访页面链接；工作台按钮/字段/标题调用共享组件 |
| case.html / data.html / case-page.js / data-page.js / case-page.css | 复用统一页头/返回/控件，移除独立调色板与重复页头样式 |
| components.html / components-page.js | 使用生产组件的真实示例，按钮/表单/原生dialog可操作 |
| scripts/dev.py / package.json | 新资产检查和可复现测试入口，不新增运行依赖 |
| tests/test_navigation.mjs / test_pages_browser.mjs | 独立地址、非法输入、顺序/阶段门禁、续接、浏览器恢复和响应式验证 |
| tests/test_data_query.mjs / test_inquiry_browser.mjs / test_governance.py | 静态重复页头守卫改查共享渲染；旧流程从明确的resume入口开始；保留已占号但未执行的036提案 |
| docs/design/interface-system.md / frontend/student/README.md | 页面矩阵、恢复协议、组件API、token/分栏/无障碍和接入验收规范 |
| ADR0008、TASK/REPORT/ADR索引、ARCHITECTURE/STATE/PROGRESS | 本轮职责、实际状态与里程碑 |

## 实际操作与观察
- 提供总览、三幕导入、六阶段、24项任务、独立论文对照、记录，以及原有案例/数据页与新增组件页。无面包屑栏。每幕/任务地址可复制，权限仍由原有操作与学习答案推导。
- URL仅表示视图；last-page仅记界面偏好。恢复时重新检查权限，已失效或非法路径回到可访问页面。不新建另一份学习状态。
- 论文对照读取其他阶段时使用临时只读投影，不改变实验阶段；原场景内的论文对话框继续复用同一渲染。AI/PDF/逆合成交接能力保留。
- 统一青绿色、背景、字体、控件尺寸、面板、标题、内容宽、主辅分栏和手机导航；可运行组件展示页含真实表单反馈、对话框和调用代码。

## 验证
| 检查 | 当前实测 |
| --- | --- |
| npm test | 75/75 |
| 原工作台浏览器回归 | 977/977，三路线、三视口，Chromium153 |
| 原数据页回归 | 65/65 public；初次带本机配置68/68，均未调用真实AI |
| 新页面浏览器 | 167/167，1440/900/390×1000，控制台错误0、外联0；4条WebGL ReadPixels性能warning |
| `python3 scripts/dev.py check` | Python78项：75通过＋3显式research跳过；Node75/75 |
| 原件与已有工作保护 | 214/214 sha256+size一致；原lab-state.js、serve_lab.py、test_workbench_state.mjs的TASK-035差异块完全一致 |
| 原LAN静态文件 | 8766新资产8/8 HTTP200，响应逐字节等于当前工作树；未重启 |
| Git空白检查 | `git diff --check`通过 |

截图、日志和基线保护清单位于 `/tmp/flavoglycolab-task-037/`，不入Git。Browser插件不可用，使用项目已有Playwright及本机Chromium153；未安装新浏览器/包。QA用独立127.0.0.1:8768服务，完成后已停止；原8766服务仍HTTP200，不重启LAN。后续可选安装Browser插件进行应用内联调。

## 视觉与交互核对
已通过view_image直接查看原界面、最新桌面总览/论文/组件和手机总览/任务截图，未生成新概念图。对照本任务沿用的原青绿色视觉及组件规范，核对：页头与激活状态、标题/正文层级、主辅分栏与手机纵排、按钮/输入/面板尺寸、表格局部滚动、颜色与状态标签。修复重复导入进度条、旧900px导航隐藏与CSP内联样式问题。桌面1440、平板900、手机390均无页面横向溢出。

新增交互链：总览→分幕导入→任务草稿→回退/前进→刷新→总览续接；非法/未解锁地址；跨阶段论文对照与反思页签；案例→数据筛选→记录→返回查询；组件按钮/表单/dialog/Esc回焦；skip-link与设置中的记录导航。PDF、六阶段与三路线由原工作台977项回归覆盖。未重新测真实模型或跨站Retro搜索，原协议服务代码未改。

## 与任务合同的偏差、失败与修复
- 宿主无 `python` 别名，首次命令失败后使用 python3；默认Node18不满足现有Playwright，改用已安装Node22.23.1；Playwright默认期待1248，本机已有1243，因此显式指定Chromium153路径。未安装新依赖。
- 初次旧静态页头断言不再适用，改验证共享页头的真实渲染；新增测试夹具调用checkLearning参数顺序错误，修复夹具后通过。
- 初次浏览器回归误连带本机AI配置的QA服务，与默认public断言冲突；独立QA进程改用不存在的配置路径（未写private），重新验证无凭据模式。真实AI调用0。
- 900px时遗留CSS隐藏nav-bench，新增共享导航显式规则修复；组件色块/演示dialog初次使用内联样式触发既有CSP限制，改为静态CSS类，未放宽CSP。
- TASK-036仍为未批准/未执行提案，编号继续使用037。治理检查纳入提案的已占号范围；不伪造036报告、不实施提案。

## 数据、许可与审核门
- research_evaluation：历史候选/计算证据，不改变。
- teaching_case_review：22/22 pending_teacher_review，教师批准0。
- public_teaching_release：not_started；本轮前端工程重组不等于公众教学验收。
- 不改原始来源、内容登记、模型或科学数据；数值仿真/正式评分仍未实现。已有TASK-035字节与改动归属保留。

## 已发现但未改的问题与风险
- 学习数据仍为当前浏览器/站点源的localStorage，不提供账号或跨设备同步。
- 视口模拟不代表Windows/macOS或手机实体机验收；未执行Safari/Firefox和真实模型并发验证。WebGL性能warning仍属既有渲染器行为。
- 本轮不提交/push或触发CI；现有LAN进程不改，静态文件由现有服务按请求读取。

## 建议的下一TASK
本轮不自动启动后续任务；科学证据计划036仍待所有者另行批准。
