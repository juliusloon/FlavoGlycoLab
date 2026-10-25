# REPORT-049：任务01前两页合并

## 对应任务
- TASK文件：docs/tasks/TASK-049-task01-combined-content.md
- 状态：Completed（2026-10-25，仅本轮合页范围）
- 基线提交与分支：main / 92fe3f8；保留039—046及同工作树TASK-047施工。
- 结果提交：pending；未提交/push。
- 授权来源：human_direct，2026-10-25用户要求合并“明确实验任务”前两页。

## 改动文件与职责
| 职责 | 文件 | 实际变动 |
| --- | --- | --- |
| 叙事投影 | frontend/student/views/inquiry.js | taskView仅在id=01合并context/visual，保留papersPage；bindTaskNarrative对任务01使用01-combined偏好键，其他任务逻辑不变 |
| 既有守卫 | tests/test_inquiry_browser.mjs | 仅任务01由三页改两页、第一页分子可见/下一页直达论文的断言 |
| 规范与闭环 | docs/design/interface-system.md、TASK/REPORT、STATE/PROGRESS | 本轮范围与实际结果 |

## 实际操作与观察
1. 发现独立TASK-047正在同一工作树实施实验速览/论文笔记本，读取其合同后仅修改049所需的页面组装与偏好行，保留047的阅读卡/窗口及其他变化。
2. 任务01第一页复用完整contextPage.html＋visualPage.html，第二页复用当前papersPage；没有复制/更改正文、结构资产、右侧指导、表单或学习判断。
3. 旧三页偏好不再被任务01新布局读取，默认落在合并页；新两页的选择继续在同一sessionStorage偏好对象内保存，其他23任务键不变。
4. 所有验证临时资料存`/tmp/flavoglycolab-task-049-task01/`；Browser plugin not available，使用已有Playwright/Chromium，无新增依赖或真实模型调用。

## 验证
科学来源/图像冻结清单213项，047/048施工路径另列，不将其变动算作本轮修改或验收。

| 命令/检查 | 实际结果与证据 |
| --- | --- |
| `npm test` | 当前共享树80/80；npm-test.log。增加的既有测试来自047，不归为049新增 |
| `python3 scripts/dev.py check` | 过程快照Python78：75通过、3显式research跳过；附带Node80/80；dev-check.log。047当时已有其自身REPORT，不存在配对阻断；该通过记录早于下述并行ADR变更，不能当作最终全库通过 |
| 收口`python3 -m unittest discover -s tests -p test_governance.py -v` | 7/8通过；TASK/REPORT配对守卫通过。另1项失败为共享树新增ADR0009而旧断言仍枚举1—8，governance.log；本轮不改ADR或该守卫，不记为全绿 |
| `node --input-type=module < /tmp/flavoglycolab-task-049-task01/task01-qa.mjs` | 最终96/96；23项其他任务页数组装检查，public1440/900/375与8766实页1440/375共五种场景；task01-final.log、results.json |
| 同页/交互 | 两页/两分页按钮、第一页面文字与分子同显、结构说明与来源、聚焦糖基/复位、论文页/标题焦点、同一分子及表单DOM、精确草稿字节保全、新偏好/草稿跨刷新、其他任务偏好、原提交与任务02入口；均通过 |
| 浏览器健康/截图 | 应用错误0、外联0、模型请求0；4条既有WebGL性能warning。实际查看live-1440-combined.png及手机截图；未见框架错误层或新增横向溢出 |
| 来源/运行资产 | 213/213 SHA+size零差异，含三PDF、demo-content和原图；从046保留指纹交叉核对，protection-results.json。8766/views/inquiry.js逐字节匹配当前文件，刷新可见 |
| 差异 | git diff --check通过；本轮生产变动只限taskView页面组装一行及bindTaskNarrative偏好键三行，不改同文件内047的阅读/导入函数 |

本轮验证目标为任务01默认同时显示说明与分子→进入论文页→返回→刷新保持笔记/视图→原自查提交→进入任务02。未重复整套跨页/工作台长流程，也不代签047/048完整功能验收。Browser插件未提供，采用已有Playwright/Chromium；可选装Browser插件进行应用内预览。

## 与任务合同的偏差
功能范围无偏差。同工作树另一个任务同时使用048编号及通用临时目录，本轮主动改为唯一TASK-049，并迁移本页证据至专属/tmp目录；没有重编号或修改另一份TASK-048。临时保护文件被另一任务同名文件替换导致一次验证脚本按原schema读取时报TypeError，未涉及任何科学原件修改；最终使用046已保留的相同213项科学/图像指纹交叉核对全部不变。独立047/048的其他源文件改动不计入本轮。

## 数据、许可与审核门
research_evaluation保持候选；teaching_case_review保持22/22待审；public_teaching_release=not_started。页面合并不构成科学观测、教师审定或公开教学发布。

## 已发现但未改的问题
TASK-047的完整导入/论文笔记本功能和验收由其自身合同维护，本轮不代签。收口时共享树新增ADR0009与治理检查中的旧枚举冲突，7/8治理检查通过；该新增与本轮无关，不越范围修复。物理设备/新浏览器品牌/并发/真实模型未测。

## 遗留风险、仓库与CI
保留所有既有修改，未提交/push，未运行远端CI、未调用真实模型；8766静态更新无需重启。共享工作树中的047内容会继续变化，本轮报告只说明合页范围；本轮临时8778服务收尾停止。

## 建议的下一TASK
不自动启动。
