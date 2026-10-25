# REPORT-053：体验报告驱动的提交稳定性与分步分析

## 对应任务
- TASK：[TASK-053](../tasks/TASK-053-experience-report-reliability.md)。状态：Completed（工程自验完成，2026-10-25）。
- 基线与现状：main / 92fe3f8；结果提交pending，未提交/push；039—052既有未提交修改保留。
- 授权：human_direct，用户提供完整24任务体验报告并要求按报告实施。

## 改动文件与职责
相对本轮事前工作树快照核对，而非将既有Git差异归入本任务。

| 文件 | 实际改动 |
| --- | --- |
| frontend/student/app.js | 一个评价请求对应不可变提交快照；取消/超时/修订校验；编辑恢复提交；陈旧回复不重绘当前任务；草稿提示、分析页签/有界内存草稿、路线提示、通行确认、装配与导师上下文 |
| frontend/student/learning-state.js | 恢复时将无在途请求的evaluating转为degraded，保留原回答供重试 |
| frontend/student/quest-state.js | evaluating不计达成；进度与下一题仍由同一回答推导，无重复进度真值 |
| frontend/student/analysis-engine.js | 方法条件卡读取value及conditions，区分底物/供体、反应/终止条件，不借用其他记录补数值 |
| frontend/student/lab-state.js | plan新增可选UGT/GmSUS/鼠李糖苷酶活性浓度字符串、格式校验与旧记录迁移；既有快照/导出自然携带 |
| frontend/student/views/inquiry.js | 评价loading、任务级载入/新建通知、任务04邻近路线选择、模型认可但选项错误的明确提示、折叠通行入口 |
| frontend/student/views/learning.js | 当前路线必修、其他路线可选及三篇对照推荐的明确说明 |
| frontend/student/views/workbench.js | 四分析页签/确认对照、默认折叠取样、酶量字段/每管mU换算/记录比较、邻近装配按钮和已加入状态、缺失条件用本条未登记措辞 |
| frontend/student/molecule-viewer.js | 3D糖基橙红色/加粗；对应二维SVG运行时高亮；严格CSP下使用本地样式及SVG呈现属性，原资产不改 |
| frontend/student/index.html、styles.css | 独立判断提示、关键只读状态对比度、页签/装配反馈；桌面导师预留空间、手机独立面板 |
| tests/test_submission_browser.mjs、package.json | 新增可控异步评价回归及test:submission-browser入口，不增加依赖 |
| tests/test_{analysis_engine,quest_state,workbench_state}.mjs | 方法条件、供体/终止排除、酶量迁移、评价恢复与在途门控回归 |
| tests/test_inquiry_browser.mjs | 完整流程适配页签/取样折叠/通行确认及导师预留空间；保留原科学/操作断言 |
| ARCHITECTURE.md、docs/design/interface-system.md、frontend/student/README.md、TASK/REPORT、STATE/PROGRESS | 职责、行为、限制与验收闭环 |

## 实际操作与观察
1. 原条件对照只读conditions，DQ-R1-01实际参数位于value。修复后该卡对照显示35°C、pH7.5、1.25mM、30min；R2的100°C/30min终止条件不会当作反应条件；UDP/供体浓度不当作底物浓度。没有扩充或改写任何原文摘录。
2. 原异步评价finally无条件render，可能在另一任务编辑时重绘；在途又可提前推进。现为提交→评价中→终态；在途禁止重复与推进，编辑取消并撤销旧反馈；网络错误/超时/刷新有明确降级和重试路径。AI认可文字而选项不对时明确说明，仍须修正选项。
3. 主线草稿仍使用原run.learning.entries。切题明确区分载入原文和空的新题；未提交分析理由/边界文本仅在当前页面会话内、按run/revision隔离保留（最多24组），不冒充已提交记录。取样展开状态在操作重绘时保持。
4. 方案可分别填写UGT、GmSUS或鼠李糖苷酶的mU/mL，显示mU/mL×mL=mU；不将不同酶相加、不转成蛋白质量、不填文献默认值，R3提示细胞投料另行记录。
5. 任务04的选路线和写依据在同处关联；装配选择有即时提示、加入有本地勾选；通行入口折叠并确认；问导师带任务/路线/当前草稿，首次独立判断有可见状态。桌面导师右侧留白与正文间实测16px，手机独立可关闭面板。
6. 糖基3D像素变化与二维SVG键实际颜色均经实测；原分子JSON/SVG字节未改。二维导入先转义固定资产的style声明，解析后转SVG呈现属性，高亮仅使用本地CSS，不降低服务CSP。

## 验证
环境：Browser plugin not available；使用既有Playwright 1.64.1、Node22.23.1、Chromium153.0.8010.12及已安装chromium-1243，无新增依赖。临时public服务127.0.0.1:8780（无模型配置），实际常驻127.0.0.1:8766仅浏览器与静态字节核对。8767为其他应用，未使用/操作。

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| python3 scripts/dev.py check | Python78项：75通过/3显式research跳过；Node87/87。final-check.log |
| npm test | 87/87（由上项实际调用，含新增3项状态/科学守卫） |
| FRONTEND_URL=http://127.0.0.1:8780/ … node tests/test_workbench_browser.mjs | 1702/1702，三路线及1536×1024、768×1024、375×812，完整24任务/分析/记录/错误夹具；应用错误0、外联0。workbench/results.json |
| FRONTEND_URL=http://127.0.0.1:8780/ … node tests/test_pages_browser.mjs | 692/692，跨页/返回/刷新/锁定/共享组件；应用错误0、外联0。pages/results.json |
| … node tests/test_submission_browser.mjs | 31/31；1440×960、390×960；任务07重复提交、评价loading/进度、切题草稿、编辑取消旧回复、失败重试、503降级、刷新恢复、另一任务输入保全、错选但AI认可、响应ID不符、时钟推进55s超时恢复，以及四分析页签/草稿/条件/量纲。submission/results.json |
| … node /tmp/flavoglycolab-task-053/check-interactions.mjs | 8780与8766分别36/36；1440×960/390×960，通行取消/确认、邻近路线选择/草稿保留、导师任务上下文/独立判断/不遮正文、装配反馈、3D像素变化、二维实际橙红色及复位。最终8766 live-interactions.log、interactions.json |
| 保护指纹 | 本轮范围外363/363文件SHA不变，含科学内容、registries/metadata、三公开PDF、所有原结构/图像与服务端。protection-live.json |
| 8766静态资产 | 11/11相关JS/CSS/HTML与当前工作树SHA一致，刷新即可使用，无需重启服务 |
| git diff --check | 通过 |

证据根目录：/tmp/flavoglycolab-task-053（仅本地临时QA，不进入Git或产品运行依赖）。代表截图：submission/analysis-1440.png、analysis-390.png、plan-1440.png；tutor-1440.png、tutor-390.png、molecule-highlight-390.png、assembly-390.png。已实际查看分析、方案、导师与分子图。

页面身份、非空、无框架错误覆盖、控制台健康、截图及真实控件动作均已检查；完整回归的4项warning均为WebGL截图ReadPixels性能提示，非应用错误。专项503为故意注入的服务故障；相应网络控制台条目不记为未解释应用错误。所有AI响应均为受控夹具，未调用真实模型。

## 与任务合同的偏差、失败与修正
范围无新增科学内容/数据/依赖/服务变更。以下初次失败不记为通过：
- 默认node18不能运行已有Playwright；改用主机已有node22，没有安装或升级依赖。最初临时服务误用底层HTTPServer，PDF缺少LabServer初始化；改用项目现有LabServer后重跑完整流程。
- 初次Python因本REPORT尚未建档而配对失败；补建后78项通过。旧Node断言允许evaluating推进，按本合同更新；一项新夹具误给开放题传入undefined选项，修正夹具后87项通过。
- 旧浏览器断言要求导师不改变正文尺寸，与减少遮挡目标冲突；更新为预留空间。取样折叠的断言同步调整为按展开状态操作，完整流程1702项通过。
- 额外颜色检查发现最初二维内联高亮样式被CSP阻止；修为本地CSS，并将原SVG声明在解析前改为惰性属性、解析后转呈现属性。最终实际颜色与控制台均通过。未改变/放宽CSP。
- 临时交互脚本最初对所有iframe重复写入seed造成假“另一标签页”提示；改成仅空存储初始化。专项随后以实际8766重跑通过。

## 数据、许可与审核门
- research_evaluation：保持历史候选/工程验证，未新增独立化学实验验证。
- teaching_case_review：22/22 pending_teacher_review，0教师批准；AI评价、通行词及新界面不改变该门。
- public_teaching_release：not_started；未进行公众发布/安全/许可验收，原PDF rights_verified=false保持。

## 已发现但未改的问题与遗留风险
- 未扩充文献/条件库、未新增真实色谱、产率或观测；未知条件仍须回原文/专业人员核对。
- 未提交的分析文字在刷新后不恢复；已提交记录、主线草稿和方案仍按原localStorage持久化。真正的多标签同时编辑继续提示冲突并暂停保存。
- 浏览器验证仅Chromium，不宣称Safari/Firefox或真实模型服务质量已验收。模型限流、长延迟和教师教学效果仍需对应环境评估；本轮以可控失败/超时/陈旧响应验证客户端。
- 保留全部既有未提交工作；main/92fe3f8、未提交/push、CI未运行。仅临时测试服务用于QA，常驻8766未重启。

## 建议的下一TASK
后续如需扩展条件库、真实教师试教或公众发布，须独立授权与验收；本轮不自动执行。
