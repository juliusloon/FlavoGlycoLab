# REPORT-060：任务04去重文案与主面板路线选择

## 对应任务
- [TASK-060](../tasks/TASK-060-task04-content-layout.md)；状态：Completed（2026-10-25，工程验收）。
- 基线main / dcab65f，含058/059未提交成果；结果提交pending，未提交/push。
- 授权来源human_direct：所有者要求删除任务04反复文案，并将短说明、路线选择放在主面板论文卡片上方。

## 改动文件与职责
| 文件 | 实际改动与职责 |
| --- | --- |
| frontend/student/views/inquiry.js | 04仅渲染一次页面标题及一条短说明；路线按钮从表单移到主面板三篇笔记本卡片上方；右侧一条完整问题、回答与提交反馈；去掉重复的目标提示/小标题/三问清单/空方案框/选择状态长句及额外导师入口 |
| frontend/student/styles.css | 删除被移除的决策框/清单样式；调整本页说明/选择间距、右侧问题字号和回答框起始位置；无全站排版重构 |
| tests/test_case_route_browser.mjs | 更新旧空方案框断言，核对控件真实归属/顺序、单次问题、删减后的文案；增加04论文卡打开笔记本后路线和草稿不变的检查 |
| tests/test_inquiry_browser.mjs | 04布局守卫改为主面板选择/阅读，右面板无选择控件，保留整个流程验证 |
| 本TASK/REPORT、STATE/PROGRESS与两索引 | 事前范围、实测与当前事实；058/059原报告及其他文件保持 |

## 实际操作与观察
主面板展示一次短说明、路线选择和三篇论文卡片，右侧只展示问题与作答交互；保留既有空路线、草稿、独立记录、提交评价和总结推进逻辑。

主面板说明为“选择一条规划路线；点击论文卡片可回看原文与笔记。”右侧直接问“为什么选择这条路线？请结合原料、催化体系及文献证据说明，并指出待核对的问题。”只问一次；回答框用简短的最少字数提示。选项的aria-pressed与卡片边框显示选择状态，不再重复“已选择…请在下方填写依据并提交”。论文卡片只打开对应笔记本，选择路线仍由上方按钮完成。

## 验证
Browser plugin not available；使用已有Node22.23.2、Playwright和Chromium153.0.8010.12（chromium-1243），不安装依赖。专项使用请求中的原主机http://10.70.160.64:8766/，其后续页面为#/task/04；评价/health为受控浏览器响应，无真实模型调用。完整流程另用临时public服务127.0.0.1:8781，模型在该临时进程禁用。证据只在/tmp/flavoglycolab-task-060/，不入Git。

| 命令/检查 | 分母、结果与证据 |
| --- | --- |
| `PATH=/home/ljx/.local/bin:$PATH python3 scripts/dev.py check` | Python79项（76通过/3显式research跳过）；Node92/92通过；public-check.log |
| `FRONTEND_URL=http://10.70.160.64:8766/ QA_OUTPUT=/tmp/flavoglycolab-task-060/case-route CHROMIUM_EXECUTABLE=…/chromium-1243/chrome-linux64/chrome node tests/test_case_route_browser.mjs` | 244/244；1536/R1、768/R2、390/R3、1536/R2、1536/R3五组，均实际完成01—04及总结→guided体系配置；case-route/results.json |
| 同环境以8781运行 `tests/test_inquiry_browser.mjs` | 1708/1708；1536/768/375宽的三路线六阶段24步、下游失效/记录/导出/失败/键盘等既有守卫通过；inquiry/results.json |
| 页面/交互/截图 | 正确页面标题与地址、非空、无错误遮罩；04选择在主面板且在三卡上方、右侧一个问题；初始为空、实际选择三路线、改选、论文阅读不改选择/草稿、刷新恢复与提交至总结通过。实际查看1536/R1及390/R3的04截图，无横向溢出 |
| 控制台 | 两组浏览器应用console/page errors均0；各保留4条既有3D步骤触发的headless GPU ReadPixels性能警告，未冒称产品错误 |
| 来源与LAN保护 | 324/324预算外基线文件SHA不变，含科学内容、preset、状态机、058/059原合同/报告；实际LAN的2/2修改资产HTTP200且等于本地字节。systemd仍active、MainPID113468不变，服务操作0；audit.json |
| 治理/差异 | 最终治理9/9，`git diff --check`通过；只改合同允许的10个路径，文件/本地链接检查通过；governance.log、audit.json |

页面身份、非空、错误遮罩、控制台、截图与交互均已检查。未把059的历史1708/219当作本轮结果：本轮确实重跑完整流程1708项与更新后的专项244项。

## 与任务合同的偏差
无范围偏差，首轮public及两组浏览器均通过。未修改内容登记/preset或重启常驻服务；未调用真实模型。

## 数据、许可与审核门
research_evaluation仍为历史候选/计算与工程证据；teaching_case_review为22/22 pending_teacher_review、0教师批准；public_teaching_release=not_started、public_release=false。原件、科学数据和许可不变。

## 已发现但未改的问题
本次范围内未发现未解决功能问题；未扩展其他页面、状态或服务。

## 遗留风险、仓库与CI
本次未提交/push，未触发CI；浏览器夹具与模拟视口不代表真实模型、实体设备或教师审定。

临时8781验收服务完成后关闭，常驻8766继续原进程提供新静态文件。

## 建议的下一TASK
无自动续作。

## 截图

![任务04桌面：主面板选择及论文卡片，右侧问题与作答](/tmp/flavoglycolab-task-060/case-route/1536-R1-04.png)
![任务04窄屏：简短说明、选择与论文卡片](/tmp/flavoglycolab-task-060/case-route/390-R3-04.png)
