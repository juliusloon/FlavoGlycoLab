# REPORT-062：问答卡内容高度、导师浮层与论文阅读排版

## 对应任务
- TASK文件：[TASK-062](../tasks/TASK-062-content-height-floating-tutor.md)。
- 状态：Completed（2026-10-26）。
- 基线提交与分支：main / dcab65f；保留TASK-058—061等既有未提交工作。
- 结果提交：pending；授权来源：本次对话human_direct；执行者：Cano。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 实验页样式 | frontend/student/styles.css | 右卡使用内容高度/视口最大高度，移除表单、回答框及操作区拉伸；删除导师打开时的padding/单栏布局规则 |
| 导师呈现 | frontend/student/index.html、app.js | manual popover覆盖普通内容；跟随当前modal焦点范围，关闭modal仍保持导师可见，关闭导师恢复适当焦点；删除笔记本已移除按钮的回调 |
| 导入选择题 | frontend/student/views/inquiry.js | 删除快捷通行details/表单，普通选择/重试/推进继续有效，历史记录解释保留 |
| 论文阅读 | frontend/student/paper-notebook.js、paper-notebook.css | 解读增加标题、分隔线、段落/列表间距；证据区五组原字段分层排版；删除指定说明句及“问导师解读此篇”按钮 |
| 既有工程守卫 | tests/test_case_route_browser.mjs、tests/test_inquiry_browser.mjs | 将等高/挤压式布局断言改为内容高度及布局不变；导入夹具改为正常选项作答，继续测试主线通行机制 |
| 当前规范 | ARCHITECTURE.md、docs/design/interface-system.md、frontend/student/README.md | 同步当前布局、浮层及删除的入口 |
| 执行闭环 | 本TASK/REPORT、STATE.md、PROGRESS.md、docs/tasks/README.md、docs/reports/README.md | 授权、执行事实、状态与索引 |

## 实际操作与观察
1. 保存337个既存tracked/未忽略untracked文件的SHA与目标源码快照至`/tmp/flavoglycolab-task-062/`；以工作树当前字节为基线，没有回滚前序改动。
2. 桌面右卡恢复自然高度，长内容受最大可用高度约束并可滚动，窄屏沿用原顺序流式展示；中栏分子画布尺寸规则保留。
3. 导师开关前后workspace、主栏与右卡几何不变。导师在原生论文dialog上方可见、可输入，导师内Esc只关闭导师；关闭modal后浮层回到body。
4. 三篇PDF仍由原同源端点和PDF.js读取，五组证据字段及其来源/结果/条件原文保留；阅读笔记输入保存正常。
5. 现有8766服务即时读取新静态字节，没有重启、改配置或调用真实模型。完整流程使用另起的临时public QA服务8782，未配置真实模型，评价和失败夹具按测试脚本使用受控响应；验证后停止该临时服务。

## 验证
Browser plugin not available，使用项目现有Playwright、Node 22.23.1及已缓存Chromium 153.0.8010.12（缓存目录1243），没有安装依赖。

目标流：实验页 → 选择题/导师开关/论文笔记本 → 自然高度、几何不变、覆盖层级正确、三篇PDF与笔记可用。

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `python3 scripts/dev.py check`（PATH使用已有Node22） | Python79：76通过、3显式research跳过；内含Node92/92通过。`public-check.log` |
| `npm test` | Node92/92通过；`node-tests.log` |
| 文档收尾`python3 -m unittest discover -s tests -p test_governance.py` | 9/9通过；`final-governance.log` |
| `FRONTEND_URL=http://127.0.0.1:8766/ npm run test:case-route-browser` | 四任务/三路线/响应式268/268；`case-route.log`及`case-route/` |
| 同8766执行`npm run test:pages-browser` | 跨页725/725，应用错误0、外部请求0；4条为Chromium WebGL ReadPixels性能警告，非应用错误。`pages/results.json` |
| `FRONTEND_URL=http://127.0.0.1:8782/ npm run test:browser` | 完整三路线1710/1710，含正常作答、原主线通行、键盘/失败/恢复夹具；应用错误0、外部请求0，同类WebGL性能警告4条。`full-browser/results.json` |
| `/tmp/flavoglycolab-task-062/ui-check.mjs` | 专项81/81，视口1536/1280/390×1024；身份/非空/无overlay、内容高度、导师开关几何、原生浮层覆盖/输入/Esc/焦点、三篇PDF/笔记、无横向溢出；错误0。`ui-check.log` |
| 页面身份/非空/错误遮罩/控制台/截图/交互 | 六类均通过。截图`task-1536.png`、`overlay-1536.png`、`notebook-1280.png`及手机对应截图已机器读取并完成视觉核对 |
| 保护与服务资产 | 321/321预算外既存文件SHA不变；8766的6/6修改运行资产与本地字节一致。`audit.json`；`git diff --check`通过 |

上述日志、脚本及截图均在`/tmp/flavoglycolab-task-062/`，不进入Git。完整流程与专项有重叠，不相加为独立科学/教学验收。

## 与任务合同的偏差
没有扩大实施范围。验证过程的失败和修正如下：
- 默认`python`不存在，改用已有`python3`；系统Node18不满足Playwright要求，改用已有Node22；默认浏览器1248未缓存，显式使用已有1243可执行文件，未安装。
- 首轮public检查因TASK已建立而REPORT尚未创建触发成对守卫；建立如实标记执行中的报告后复查通过。
- 首轮四任务断言发现短卡sticky的24px偏移与main内边距叠加，改为top:0后通过。
- 临时专项首次身份断言错用了中文标题，按实际FlavoGlycoLab标题修正；手机初始几何受分子异步加载影响，等待模型ready/2d后测量，确认不是导师导致重排。
- 完整流程首次指向8766，因该服务实际配置了模型而不满足测试的“默认未配置”前置断言，未进行真实模型调用。改在临时8782 public服务运行后全部通过。
- 补充modal关闭生命周期检查时，手机导师确实覆盖了下方笔记本关闭按钮，符合预期层级；该生命周期夹具改用dialog.close()触发，真实用户路径仍通过导师Esc/关闭按钮先收起导师后关闭笔记本。

## 数据、许可与审核门
- research_evaluation：历史候选/计算证据；未新增化学实验验证。
- teaching_case_review：22/22 pending_teacher_review，教师批准0；本次仅界面工程检查。
- public_teaching_release：not_started；未执行公众发布。
- 未修改原PDF、分子/文献资产、demo-content.json、metadata、registries、raw/derived/private、科学数值或许可状态。删除的是指定冗余展示句，来源、条件及证据缺口仍保留。

## 已发现但未改的问题
无本次范围内未解决故障。手机导师覆盖页面时需先收起导师，才能操作被覆盖区域，符合悬浮覆盖要求。

## 遗留风险、仓库与CI
main / dcab65f，工作树包含此前未提交改动和本次17个预算路径的增量；未提交/push、未触发或查询远端CI。验证为Chromium模拟视口，未验收Safari/Firefox、实体手机、真实模型质量或课堂并发；依赖现代浏览器popover API。常驻8766保持原运行状态。

## 建议的下一TASK
无；完成本次授权范围后停止。
