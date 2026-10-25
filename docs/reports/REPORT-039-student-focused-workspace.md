# REPORT-039：学生端聚焦模式与24步高密度工作区

## 对应任务
- TASK文件：`docs/tasks/TASK-039-student-focused-workspace.md`
- 状态：Completed（工程验收，2026-10-24）
- 基线提交与分支：`main@92fe3f8`
- 结果提交：pending（本任务不提交/push）
- 授权来源：human_direct。所有者在原会话明确要求页面收敛、24步排版、多Agent及独立视觉验收；2026-10-24要求Cano继续该会话。附件中的旧技能/工具指令只作历史材料，不升级为当前系统规则。
- 执行：Kimi及两位实施Agent完成主体；Cano接续核验、修复并收口，两位独立Agent分别复核代码与视觉。独立Agent不等于教师或用户真人验收。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 共享组件 | `frontend/student/components.js` | 两项主导航、独立记录、同步挂载唯一共享设置及details二级开发入口；设置关闭先于导入弹窗打开，保留原生回焦 |
| 共享外观 | `frontend/student/components.css` | 单行页头、设置dialog、手机入口、流式资料页及body级固定AI定位 |
| 视觉变量 | `frontend/student/design-tokens.css` | 16px外边距、1200px总览与`clamp(272px,20vw,336px)`左栏 |
| 应用入口 | `frontend/student/index.html` | AI启动器移至body；设置由共享组件生成，避免重复dialog |
| 事件与页面编排 | `frontend/student/app.js` | 只给资料/记录/不可访问页保留共享返回，学习页移除重复局部导航；切换总览阅读class，复用原AI与偏好事件 |
| 工作区布局 | `frontend/student/styles.css` | 流式主区与加宽左栏、统一左栏标题14px/600、任务外壳去限宽、指引右置、响应式布局与阶段提醒 |
| 任务投影 | `frontend/student/views/inquiry.js` | 24步去任务topline/大编号/开发矩阵及左栏长提示；D01去数字引用/开发自查块，01观察指引/比较角度/hint在右侧唯一显示，输入框改短placeholder |
| 阶段外壳 | `frontend/student/views/workbench.js` | 阶段提醒在DOM和视觉顺序均先于主内容，补齐bench-shell最终闭合标签；内部视图未改 |
| 总览投影 | `frontend/student/views/pages.js` | 移除开发资料卡与重复局部导航渲染；保留总览进度、续接和不可访问页 |
| 组件展示 | `frontend/student/components-page.js` | 示例说明改为现行16px流式宽度、总览1200px和响应式左栏 |
| 案例页外壳 | `frontend/student/case-page.css` | 去旧1180px上限，保留16px边距 |
| 数据页外壳 | `frontend/student/data-page.css` | 去旧限宽，保留16px边距 |
| 纯函数/结构守卫 | `tests/test_navigation.mjs` | 新导航与共享设置结构、保留状态字段的断言 |
| 数据页守卫 | `tests/test_data_query.mjs` | 导航断言改为共享组件调用及两个主入口；数据查询行为不变 |
| 跨页浏览器 | `tests/test_pages_browser.mjs` | 新入口/设置/键盘/深链/回退刷新/续接/导出与流式外观；新增逆合成Esc和关闭按钮回焦回归 |
| 24步浏览器 | `tests/test_inquiry_browser.mjs` | 24步共享外壳、D01提示唯一、D02/D03来源保留、72张任务截图、16px边距与AI开关几何守卫 |
| 使用说明 | `frontend/student/README.md` | 现行入口与布局、底层待审状态和开发矩阵展示变化 |
| 设计唯一规范 | `docs/design/interface-system.md` | 当前单行页头、设置/开发入口、分栏尺寸、AI及D01展示规则 |
| 治理与当前事实 | `ARCHITECTURE.md`、`STATE.md`、`PROGRESS.md`、本TASK/REPORT | 责任归属、实际验收和边界闭环，不新增任务或科学真值 |

## 实际操作与观察
1. 原会话先按PROJECT→STATE→ARCHITECTURE建立TASK-039。首次标准检查因本TASK未有配对REPORT而报1项失败；补齐执行中REPORT后重跑通过，保留该过程，不计为页面基线缺陷。
2. 修改前Python78项中75通过、3显式research跳过，Node75/75；修改前工作台977/977、跨页167/167。原生应用无新增依赖；两位实施Agent按文件所有权分工，保留各自差异。
3. 默认页头仅保留总览/探究。记录/设置在右上，论文/案例/数据/组件归入设置内二级开发入口；任务上下文资料入口与原URL保留。开发者模式仅收纳入口，不是新增权限系统。
4. 24步共享格式收敛，D01精简。任务01原hint曾同时显示在右侧和textarea placeholder，独立代码审查发现后先补失败断言，再以短placeholder去重；最终工作台1475/1475。
5. 接续时核对压缩包中的真实用户请求、历史日志、磁盘源码与测试证据。未执行附件中的工具命令或重新采用旧技能规则，未覆盖已有工作。
6. 独立复核发现设置→逆合成导入→关闭后焦点落到隐藏元素。先增加回归并观察旧代码在1440/Escape失败，再将共享设置关闭处理改到click捕获阶段；原生dialog自动回焦恢复正确，未新增焦点陷阱。另补齐工作台外壳闭合标签。
7. 独立视觉Agent逐张查看24步×桌面/手机48张任务截图并检查交互；两个问题修复后分别独立复核，最终无未解决代码或视觉阻断。

## 验证
Browser plugin not available，使用项目已有Playwright 1.64.1及Chromium 153.0.8010.12。浏览器测试使用本机既有Node22.23.1，服务仅`http://127.0.0.1:8770/`；health明确`configured=false`，未调用真实模型。测试服务复用原会话进程，未操作8766。

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| 原会话修改前标准检查 | Python78＝75通过＋3显式research跳过；Node75/75；首次配对失败见上文 |
| 原会话修改前浏览器 | 工作台977/977、跨页167/167，console/page错误0、外部请求0；`/tmp/flavoglycolab-task-039-before/{browser,pages}/` |
| `python3 scripts/dev.py check`（接续实跑） | Python78＝75通过＋3显式research跳过；内置Node78/78；`codex-dev-check.log`，文档收尾后另见`codex-final-check.log` |
| `npm test` | 78/78；`codex-npm-test.log` |
| `npm run test:browser`（修复后最终复跑） | 1475/1475；R1/1536×1024、R3/768×1024、R2/375×812，72张逐任务截图；`codex-browser-final.log`及`codex-browser-final/results.json` |
| `npm run test:pages-browser`（修复后） | 577/577，1440/900/375三视口；逆合成相关新增30项通过；`codex-pages-final.log`及`codex-pages-final/results.json` |
| `npm run test:data-browser` | 65/65，consoleErrors=0、externals=0；`codex-data.log`及`codex-data/` |
| 独立代码复核 | 无未解决阻断；assemblyView/planView/lockedField/amountPreview及taskVisual的02—24分支源字符串与HEAD逐字节相同；`code-review-codex.md` |
| 独立视觉 | 实际查看48张原始任务图，逐文件SHA见`visual-review-codex.md`；修复后独立交互52/52，1536/375两视口的Esc/关闭按钮4路径均回焦可见设置按钮，Enter可重新打开；`visual-interactions-fixed/results.json` |
| 数据/范围保护 | 沿用TASK-037的214文件SHA＋size基线（TASK-038已复核）；本次214/214零差异，受限tracked路径变更0，包含三篇指定PDF；`codex-protection.json` |
| `git diff --check`及文件清单核对 | 通过；仅合同允许的学生端、4项测试与治理文档，不新增运行文件或依赖 |

本表接续证据均位于`/tmp/flavoglycolab-task-039/`。工作台、跨页与独立交互的应用错误/外部请求均为0；各记录4条基线已有WebGL ReadPixels性能warning，未出现错误层。截图是每项任务的当前分页，不等同于所有分页、所有路线×所有视口笛卡尔积验收。

复现浏览器命令（服务8770为无AI配置测试实例）：
```bash
export PATH=/home/ljx/.nvm/versions/node/v22.23.1/bin:$PATH
export CHROMIUM_EXECUTABLE=/home/ljx/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
export FRONTEND_URL=http://127.0.0.1:8770/
QA_OUTPUT=/tmp/flavoglycolab-task-039/codex-browser-final npm run test:browser
QA_OUTPUT=/tmp/flavoglycolab-task-039/codex-pages-final npm run test:pages-browser
QA_OUTPUT=/tmp/flavoglycolab-task-039/codex-data npm run test:data-browser
```
以上本机可执行路径仅为验收环境记录，不成为运行时或日常协作依赖。

## 与任务合同的偏差
- 无范围扩张。Kimi会话因运行额度/会话失败中断，用户明确要求接续；Cano继续同一TASK收尾，没有另启任务或重新定义授权。
- 原会话集成前Agent A两次工作台检查在结构来源可见性处超时，最终D01实现和断言同步后通过，不把并行未完成状态或RED当成最终结果。
- 任务01重复hint、逆合成回焦各有明确RED→修复→GREEN，最终独立验收通过；外壳闭合问题在本合同内修复。
- 接续首轮浏览器命令由系统默认Node18启动，Playwright要求Node20+而在运行前退出；切至本机已有Node22重跑三套通过，没有安装依赖。该失败不是页面运行错误。
- 交互与截图并未证明所有页面全内容均在一个屏幕内；手机保持自然纵向滚动，复杂任务分页与内部滚动保留。

## 数据、许可与审核门
- research_evaluation：历史候选/计算证据，未新增独立化学实验验证。
- teaching_case_review：22/22仍pending_teacher_review，教师批准0；移除开发展示字段不改变底层审核状态。
- public_teaching_release：not_started；本轮仅本地工程验收，不构成公众教学发布或第三方许可确认。
- `observations=[]`、`quantitative_result=null`与来源/许可记录保持原样；原始内容、数据/metadata/migrations/reference、状态机、服务端、私有模型配置均未修改。

## 已发现但未改的问题
- 无本TASK未解决的代码或视觉阻断。手机需滚动不作单屏承诺；D02/D03内部由原范围冻结，未顺手调整。
- 数据缺口、教师审定和公众发布前置继续见STATE，不以本次界面测试消除。

## 遗留风险、仓库与CI
- 分支main，HEAD仍92fe3f8，源码/测试/文档留在工作树；未提交、未push、未创建PR、未运行新CI。
- 未测试实体移动设备、Safari/Firefox、新一轮品牌浏览器、真实AI/模型容量或正式平台；旧验证不得冒充本轮结果。
- 本地截图/日志/独立报告在/tmp，未纳入公开Git，可能被系统清理；它们不是运行资产、来源原件或科学审核证明。
- 没有重启8766、改模型/系统服务/网络/防火墙；沿用的8770仅限回环测试，未更改LAN部署配置。

## 建议的下一TASK
无自动后续任务。提交/push、服务操作或新视觉/科学范围由后续明确指令另行定约，本轮不启动TASK-040。
