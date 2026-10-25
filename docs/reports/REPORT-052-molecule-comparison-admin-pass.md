# REPORT-052：五类分子合页与答题通行词

## 对应任务
- TASK文件：[TASK-052](../tasks/TASK-052-molecule-comparison-admin-pass.md)。
- 状态：Completed（工程自验，2026-10-25）。
- 基线：main / 92fe3f8；结果提交pending；授权来源human_direct。
- 保留039—051全部既有未提交修改；本报告只认领下列052范围，不追认为教师审定。

## 改动文件与职责
| 目录职责 | 文件 | 本轮实际改动 |
| --- | --- | --- |
| 页面投影/编排 | frontend/student/views/inquiry.js、app.js、styles.css | 任务02两页合一；五按钮切换本地结构与糖种/数量/连接/辨析讲解；名称小按钮及指定常驻说明删除；快捷通行入口、校验及异步评价处理 |
| 结构生命周期 | frontend/student/molecule-viewer.js | 五项固定身份及重原子白名单；按身份缓存/加载JSON、二维与aria；切换回收、旧异步挂载作废；原默认异槲皮苷身份锚定保留 |
| 公开可视化资产 | assets/molecules下rutin、quercetin、spiraeoside、emiq-example各JSON/SVG及原README | 三项ChEBI结构与一个Q3M代表；保存来源/定位/SHA/许可/待审、计算方法及原子分组；原isoquercitrin JSON/SVG零字节修改 |
| 答题状态 | learning-state.js、quest-state.js、lab-state.js | 统一isAdminPass/validAnswer，严格完整匹配trim后的admin7；recorded/route/note仍为唯一进度真值，eval.mode=admin_override；长度豁免不改变数值格式或真实操作依赖 |
| 四字段假设工具 | views/inquiry-tools.js | 任一假设输入为通行词时直接带入主线回答，免补其他字段，仍由提交自查放行 |
| 启动及工程守卫 | scripts/dev.py；tests/test_quest_state.mjs、test_inquiry_browser.mjs、test_governance.py | 清点新增8资产；新增4项Node守卫覆盖24题×3路线/存档/撤销/结构；浏览器补16项通行与模型守卫；ADR枚举更新至0010 |
| 规范/闭环 | ARCHITECTURE、docs/design/interface-system、frontend/student/README、ADR0010及索引、TASK/REPORT、STATE/PROGRESS | 唯一职责、通行词语义与可追溯真实验证 |

表中无目录前缀的前端路径均位于frontend/student/。临时脚本、来源响应及影像只存/tmp/flavoglycolab-task-052，不进入运行或Git；未新增依赖版本、模型或服务端代码。

## 实际操作与观察
1. 任务02仅一个内容页，直接显示原探究文字、五身份按钮、所选3Dmol与具体讲解；旧分页偏好不再隐藏分子。按钮切换只更新模型/说明，保留右侧草稿。糖基高亮、复位、方向键/加减/Home与二维降级随身份工作；无糖槲皮素禁用糖基高亮。
2. 槲皮素、芦丁、4′-O异构体分别取ChEBI:16243/28527/75839的default_structure.smiles，RDKit标准InChIKey与来源一致，22/43/33重原子。来源许可核验[ChEBI About](https://www.ebi.ac.uk/chebi/about)的CC BY 4.0声明，保留ChEBI / EMBL-EBI署名。异槲皮苷原有33重原子资产未重建。
3. EMIQ不伪造唯一纯单体：依[Makino et al. 2009](https://doi.org/10.1248/bpb.32.2034) p.2035 Fig.1化合物3（Q3M）/4（EMIQ）及Chemicals段，在原异槲皮苷葡萄糖O4手工编码一个α-(1→4)葡萄糖延伸代表Q3M，44重原子。随后按精确InChIKey命中[PubChem CID10304622](https://pubchem.ncbi.nlm.nih.gov/compound/10304622)，分子式C27H30O17与立体SMILES标准化完全相符。JSON记录论文SHA/定位、父结构SHA及交叉响应SHA；没有分发新论文原文或图像，没有声称其适用CC BY 4.0。页面明确当前3D不代表完整产品、唯一分子或含量。
4. 四项新增资产使用RDKit 2026.09.1、ETKDGv3种子20261025、MMFF94最多2000步，全部收敛；SDF重读InChIKey与生成前一致。生成环境仅用于开发，意外生成的uv.lock、.venv及egg-info已清理，不是运行依赖。
5. 通行词覆盖24题、两幕导入（新增快捷通行输入）、导师输入、四字段假设工具、方案假设、参照理由、分析边界、结论/局限/下一步反思。精确通行词优先于8/15字、必选项、错误选项及导师评价；普通回答保留原生中文验证和确定性/AI流程。主线单独显示“通行词已放行”，保留事件与导出标识，不生成首次独立判断；改写立即撤销，刷新恢复，换路线保持原失效语义。数字、阅读笔记和实际操作不属于问答判定，不用通行词伪造实验结果。
6. 正在评价时可编辑为通行词并提交；晚到的失败评价因修订及请求身份失效，不覆盖放行，也不提示通行词需要重评。导师框在模型未配置、正常配置及请求忙碌时优先识别通行词，不发送新的导师请求。

## 验证
Browser plugin not available，使用已有Playwright 1.64.1、Node22.23.2及Chromium153.0.8010.12。完整回归使用本项目127.0.0.1:8779临时服务（仅临时进程禁用模型配置）；专项使用8778并在浏览器拦截health/tutor，8766真实静态页面同样拦截模型请求。未调用真实模型。

| 已执行命令/检查 | 分母、实际结果与证据 |
| --- | --- |
| PATH=/home/ljx/.local/bin:$PATH python3 scripts/dev.py check | Python78：75通过、3项显式research跳过；Node84/84；check-closed.log |
| Node新增守卫 | 24题×3路线全部通行、未选/错选、trim/大小写/近似词、存档/导出、编辑撤销/路线隔离/无独立判断及五结构元数据；Node84中的4新增项 |
| FRONTEND_URL=http://127.0.0.1:8779/ … node tests/test_workbench_browser.mjs | 1630/1630，含新增16项通行/五模型fixture；1536×1024、768×1024、375×812与既有错误/键盘/流程fixture；workbench-final/results.json |
| FRONTEND_URL=http://127.0.0.1:8778/ … node tests/test_pages_browser.mjs | 692/692；应用错误0、外联0，pages/results.json |
| node /tmp/flavoglycolab-task-052/check-ui.mjs | 154/154；1440×1000/390×844，五模型均实际ready、对应来源/说明/单canvas/草稿保留、方向键旋转、聚焦/复位、20次快速切换、WebGL丢失事件后的对应二维图；24题逐题真实表单提交及两幕导入/导师/假设/参照/边界/反思入口；刷新/编辑撤销/错误AI晚到不覆盖；ui-results.json |
| 追加边界专项 | node /tmp/flavoglycolab-task-052/check-extra.mjs：5/5，模型未配置时通行、导师忙碌时启用发送且本地放行、8766手机EMIQ及精确Q3M来源；extra-results.json、8766-mobile.png |
| 专项API事实 | 正常通行词路径评价/聊天POST为0；主专项1次POST是为测试陈旧失败评价而明确提交的普通答案，追加专项1次是模拟导师忙碌的普通问题，均已拦截为fixture。原生方案假设校验豁免经浏览器检查，方案完整数值/操作依赖由Node及完整工作台回归覆盖 |
| 页面身份/非空/覆盖层/控制台/截图/交互 | 页面身份和非空检查通过，无框架故障覆盖层，正常应用错误0、外联0；专项4条及跨页4条警告均为Chromium ReadPixels性能提示，非应用错误；1440/390五结构截图与8766实页截图已实际查看代表图 |
| 来源/结构核验 | 四项新增SDF立体身份往返4/4，优化收敛4/4，三ChEBI身份3/3，Q3M PubChem精确立体SMILES/分子式相符；structure-verification.json、emiq-pubchem-crosscheck.json及本地生成脚本 |
| 保护及8766 | 事前34文件中唯一变化是预算内assets/molecules/README.md；其余33/33（含注册、metadata、3PDF、原isoquercitrin及vendor）SHA不变。8766相关16/16资产与源码字节一致；protection-lan.json |
| git diff --check | 通过；不将039—051既有修改归为本轮 |

证据根目录/tmp/flavoglycolab-task-052。关键浏览器命令使用CHROMIUM_EXECUTABLE指向已有chromium-1243/chrome-linux64/chrome，不安装新浏览器依赖。页面身份、非空、错误覆盖、控制台、截图、真实控件响应均已验证；8766无需重启，刷新可见。

## 与任务合同的偏差、失败与修复
- 初次浏览器命令遇到系统Node18不符合Playwright要求，随后默认Chromium1248缺失；改用已有Node22及Chromium1243，无依赖版本修改。
- 初次误用8767（被另一应用占用），页面身份不符，检查失败；没有采用该应用结果或数据，改用本项目临时8778/8779。8778读到已有模型配置导致public无密钥断言失败；完整回归改为8779临时进程的缺失配置路径，不改私有文件或常驻8766。
- 初版对学习表单统一novalidate使普通空回答的原生中文提示回归失败（66项后停止）；已改为仅精确通行词动态豁免，最终1630项全通过。
- 新Node测试初版直接把stage写至5但未配置实际操作前置，hydrate正确拒绝；修正测试将跨阶段答案记录置于stage0，不放宽hydrate。
- 专项脚本初版读取错误WebGL context名称、重载时反复注入种子覆盖刚存答案、任务09未翻至工具页；均为测试脚本问题，分别改为丢失事件注入、仅空存储初始化及显式翻页后，最终154项通过。附加专项初版用innerText读取折叠来源内的隐藏链接导致断言失败，改用textContent后5项通过。早期失败不计入最终通过分母。
- 发现任务09还有四字段文本搭建器，依用户“所有问答框”的原授权纳入views/inquiry-tools.js，预算同步记录；无新增授权需求或科学范围扩张。

## 数据、许可与审核门
- research_evaluation：仍为历史候选/计算表示，几何优化和身份核对不是独立化学实验验证。
- teaching_case_review：22/22 pending_teacher_review，未代填教师结论；admin_override不属于AI/教师批准。
- public_teaching_release：not_started；三篇既有PDF许可边界不变，不自动公众发布。

## 已发现但未改的问题
- 8767由其他应用使用，本任务不操作该应用或端口。
- 未测实体手机、Safari/Firefox或真实模型服务；EMIQ没有被表示为完整混合物，更没有新实验观测。当前捷径是本地原型流程特例，正式评分/身份/公开发布时应按ADR0010复审。

## 遗留风险、仓库与CI
main / 92fe3f8；本任务未提交/push、未触发CI、未重启8766。已保留全部既有改动；临时8778/8779验证进程收口后停止。运行仍只依赖本项目静态资产和既有服务；无需RDKit、uv或任何私有数据作为学生开发前置。

## 建议的下一TASK
无自动后续；等待所有者下一指令。

## 同号追加：删除说明与名称小按钮（2026-10-25）

用户human_direct明确要求仍放在TASK-052内。事前已在原TASK追加允许路径、预算与验收；没有创建TASK-053。

实际运行改动仅两处：views/inquiry.js删除指定“计算构象 · 可拖动旋转、滚轮缩放 · 待教师审定”常驻句，并删除按钮内圆形符号/额外标签，五button只显示原名称；styles.css将入口改为自然宽度、36px高、8px间距的小按钮，窄屏自动换行。原data-identity、aria-pressed、焦点及模型/说明切换保留。来源/SDF/审核元数据、讲解、答题流程和admin7未修改。既有界面规范、STATE/PROGRESS同步到当前呈现。

验证入口为http://127.0.0.1:8766/#/task/02；Browser plugin not available，继续使用已有Node22.23.2、Playwright1.64.1/Chromium153。临时脚本/影像只存/tmp/flavoglycolab-task-052/compact/，无新持久测试、依赖或临时服务。

| 检查 | 实际结果与证据 |
| --- | --- |
| node /tmp/flavoglycolab-task-052/compact/check.mjs | 53/53；1440×1000、768×1000、390×844，页面身份/非空、指定句/圆形符号消失、五按钮纯名称且高度≤40px、无横向溢出、各五模型和说明对应/草稿保留、键盘Enter激活、admin7零评价POST；results.json |
| PATH=/home/ljx/.local/bin:$PATH npm test | 84/84，node.log |
| 控制台、外联与截图 | 应用错误0、外联0、POST0；4条Chromium ReadPixels性能提示；1440/768/390三个名称按钮截图及桌面实页截图，实际查看桌面与手机代表图 |
| 保护指纹 | 其余97/97文件SHA不变，包括app/state模块、结构/来源/元数据/原PDF；protected-before.json、protection-lan.json |
| 8766资产与Git差异 | views/inquiry.js、styles.css两项响应与当前源码SHA一致；git diff --check通过 |

本次没有失败/范围偏差；不重复运行全站长流程或将上一轮1630/692项报告为本次重跑。来源状态与三个审核门不变，未重启/真实模型调用/提交/push。更新后8766刷新可见；未测实体手机及其他浏览器。
