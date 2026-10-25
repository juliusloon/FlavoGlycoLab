# REPORT-044：合成难点页补充文献原图

## 对应任务
- TASK文件：docs/tasks/TASK-044-intro-literature-figures.md
- 状态：Completed（2026-10-24，工程验收）
- 基线提交与分支：main / 92fe3f8；逐文件基线为`/tmp/flavoglycolab-task-044/baseline/`，保留TASK-039—043既有未提交工作。
- 结果提交：pending；未提交/push。
- 授权来源：human_direct，所有者2026-10-24明确要求从三篇文献选图并加入`index.html#/intro/2`。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 页面图文 | frontend/student/content/demo-content.json | 仅intro.chemical_limit展示投影：保留两段难点导语，新增三项图文解释、源链接和收束提问；原选择题、答案与反馈不变 |
| 页面渲染 | frontend/student/views/inquiry.js | 第二幕插入三组原图、中文解释/图注、可打开的PNG与定位到页的同源PDF链接；原生details按需查看版权说明 |
| 排版 | frontend/student/styles.css | 仅新增synthesis/literature类；图片按原比例响应，窄屏无横向溢出；已有字号/面板/导航不变 |
| 文献图资产 | frontend/student/assets/literature/zhang2015-fig6.png、pei2019-fig1b.png、niu2024-fig4a.png | 从既有三PDF渲染裁取，不重绘、不修改数据；宽高1490×410、526×566、742×498 |
| 派生来源 | frontend/student/assets/literature/sources.json | 唯一登记原PDF路径/SHA、图号、物理/印刷页码、渲染尺寸与裁取坐标、PNG SHA、质量/权利/教师待审状态；不是新科学准入登记 |
| 归属与闭环 | ARCHITECTURE.md、TASK/REPORT、STATE.md、PROGRESS.md | 原图派生工件责任和实测结果 |

## 实际操作与观察
1. 按顺序读取PROJECT、STATE、ARCHITECTURE及本TASK；先保存允许路径基线与保护指纹，再修改页面。
2. 逐篇只读提取全文文字并查看PDF页面，核对图与正文。选图如下：

| 来源 | 选图/定位 | 页面解释 |
| --- | --- | --- |
| Zhang2015 | 图6结构反应图；PDF第7页/印刷页1263 | 芦丁去除末端鼠李糖，保留3-O-β-D-葡萄糖连接；说明选择性与已有糖基保留 |
| Pei2019 | 图1b分面；PDF第2页/印刷页454 | GmSUS/SUS3/AcSUS分别与AtUGT78D2配对，比较原文产物量；说明协同酶选择，单位及误差线保留 |
| Niu2024 | 图4A分面；PDF第8页 | UGT78D2糖基化与葡萄糖苷酶去糖相互竞争；说明工程细胞内产物回退 |

3. 使用已有pdftoppm/Pillow渲染裁取；最终三图共208,828字节，无新依赖。所有原图原标记保留，仅裁去无关正文/其他分面。原始PDF和私有摘录/SI未改、未复制到前端。
4. 初选Pei整张图1（a–c）在手机缩放后标注过小，改为直接相关的1b分面；最终裁取保留纵轴名称、mg/L单位、横轴酶名、b标记及误差线。
5. 导语解释化学糖基化的选择性负担，三幅图解释文献中相应的酶法/细胞路线问题；未将反应示意冒称保护/脱保护实验图，也未将曲线写成本次观测。
6. Browser plugin not available；使用已有Node22.23.1、Playwright、Chromium153。网页工具无法解析内网地址，改由Playwright与HTTP直接访问用户指定主机。127.0.0.1:8773临时实例使用无模型配置；8766只读取静态资产与浏览页面，无重启。

## 验证
过程日志、临时脚本和截图统一存`/tmp/flavoglycolab-task-044/`，不入Git。

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `python3 scripts/dev.py check`（使用已有Node22） | Python78项：75通过/3显式research跳过；附带Node78/78；dev-check-final.log |
| `npm test` | 78/78；npm-test.log |
| `FRONTEND_URL=http://127.0.0.1:8773/ npm run test:browser` | 最终1518/1518；三路线/三视口、24任务、门禁、保存/导出、导师/PDF夹具；browser-final/results.json |
| 同地址`npm run test:pages-browser` | 最终643/643；跨页/返回/刷新/续接/设置等；pages-final/results.json |
| `node --input-type=module < /tmp/flavoglycolab-task-044/verify-intro.mjs` | 最终113/113；public临时实例1440/900/375×1000/812、原8766主机1440×1000及375×812；图片载入/比例、无溢出、大图实点、三PDF HEAD及图片MIME、版权说明展开、错答重试、答对推进、刷新/返回、论文门禁；intro-results.json、intro-final.log |
| 8766静态资产逐字节核对 | 7/7与当前源码匹配：JS、CSS、内容JSON、图源登记及三PNG；protection-results.json |
| 保护/范围核对 | 342/342 SHA+size零差异，三PDF SHA3/3、三PNG SHA3/3匹配；JSON除chemical_limit外全部深比较相同，原问答逐字段相同 |
| 变动检查 | git diff --check通过；implementation.diff保存本轮相对基线差异，未把既有039—043修改归入本轮 |

各浏览器套件均应用错误0、外部运行请求0；页面专项模型请求0。每套4条既有WebGL性能warning，来自第一幕分子渲染，非配图加载或应用异常。未做真实模型调用。

| 浏览器必查项 | 结果 |
| --- | --- |
| 页面地址/标题 | 通过，精确到用户指定主机及#/intro/2 |
| 非空 | 通过，标题、三图及解读完整 |
| 框架错误遮罩 | 通过，无遮罩 |
| 控制台 | 通过，无应用错误；4条既有WebGL性能warning |
| 截图证据 | 通过，实际查看桌面首屏、每幅裁图、桌面/手机分段截图；live-1440-intro.png与live-375-Pei2019-fig1b.png等 |
| 交互 | 通过，第一幕答题→第二幕图文→大图/来源→错答重试→答对→刷新保留→第三幕阅读门禁→浏览器返回 |

原图总览截图不作为长滚动内容的完整证据；最终有效证据为逐段截图与桌面首屏。无需安装依赖。后续可选装Browser插件以便在应用内做浏览器预览和检查。

## 与任务合同的偏差
无范围偏差。首次Python标准检查在REPORT尚未生成时触发TASK/REPORT必须配对的治理守卫；补齐报告后收口复跑。初次裁图命令向subprocess传入整数导致TypeError，改成字符串后正常输出；未改源文件。保护清单最初并入上一任务名单时误含本轮允许修改的两个文件，核对时显式排除当前合同允许路径，并另外验证JSON范围与原选择题；不把预期改动记为原件变更。

大元素截图因main滚动容器裁剪导致未滚入视口部分留白，该截图不作为完整渲染证据；逐个图文section滚动截取并实际查看有效截图。

## 数据、许可与审核门
- research_evaluation：保持候选，原文数值不是本次观测。
- teaching_case_review：保持22/22待审、教师批准0；新增图文为机器核对候选。
- public_teaching_release：not_started。本轮所有者指令授权本页选图展示，出版方rights_verified=false；图像保留原作者/出版方权利，不适用本项目原创代码或文档许可；不公开其他数据或SI。

## 已发现但未改的问题
手机中的结构原图可点击新标签页放大；Niu4A原PDF内嵌图本身分辨率有限，本轮未以AI重绘或增补原图细节。视口模拟不等于实体设备/课堂验收；未测新浏览器品牌、并发或真实模型。

## 遗留风险、仓库与CI
保留既有未提交修改；本轮未提交/push、未运行远端CI、未调用真实模型、未改变常驻服务/防火墙/网卡。三PDF原字节与许可登记不变；8766刷新可见，临时8773测试实例已停止。

## 建议的下一TASK
不自动启动。
