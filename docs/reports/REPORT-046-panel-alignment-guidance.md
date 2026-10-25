# REPORT-046：三栏对齐、方形入口与指导文字统一

## 对应任务
- TASK文件：docs/tasks/TASK-046-panel-alignment-guidance.md
- 状态：Completed（2026-10-25，工程验收）
- 基线提交与分支：main / 92fe3f8；以`/tmp/flavoglycolab-task-046/baseline/`区分本轮和039—045既有未提交工作。
- 结果提交：pending；未提交/push。
- 授权来源：human_direct，2026-10-25所有者四项界面调整指令。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 共享尺寸 | frontend/student/design-tokens.css | 新增唯一收起尺寸56px |
| 全站控件样式 | frontend/student/components.css | 收起后隐藏更多，主线/历程/总览均方形；48px纯图标导师，保留保存异常时总览图标提示 |
| 领域外观 | frontend/student/styles.css | 三栏顶边与正文标题/右卡、56px恢复入口、指导正文统一与去缩进、合适的右卡高度/滚动槽 |
| 页面渲染 | frontend/student/index.html、views/inquiry.js | 删除导师可见文字并保留aria/title；24任务标题移入中间正文列；任务01既有字段重组为统一说明，笔记标签与minlength/required保留 |
| 布局同步 | frontend/student/app.js | 仅测量右卡实际右边，ResizeObserver/resize同步固定导师按钮，处理原生滚动条占位；不保存状态、不改协议 |
| 既有工程守卫 | tests/test_inquiry_browser.mjs、test_pages_browser.mjs | 更新原80px/chips展示断言，新增三方形/隐藏更多、顶边/右边、统一指导样式与纯图标检查；原交互守卫保留 |
| 规范与闭环 | 组件示例/README、interface-system.md、ARCHITECTURE、TASK/REPORT/STATE/PROGRESS | 当前合同及真实结果 |

components.js在预算内但无需修改；未新增运行依赖或生产文件。

## 实际操作与观察
1. 按PROJECT→STATE→ARCHITECTURE→TASK登记合同，并保存允许文件基线及440项受保护文件指纹，含全部既有任务/报告、内容与原图。
2. 两导航组均收起时，主线、历程和左下总览入口均56×56px；更多隐藏，展开任一组后恢复。手机同样使用方形恢复入口，继续保留总览可访问名称及保存异常指示。
3. 将任务标题移入正文列，避免占据整个任务行后将右卡下推；宽度>900px三栏按24px顶边排列，≤900px沿用原有纵向主辅布局。正文仍无外卡。
4. 导师启动器只保留48×48px图标，aria-label、title、开关/回焦不变。检测到常驻滚动条会占15px后，以右卡实际右边缘同步fixed入口，使用布局观察与resize，不把尺寸写入学习状态。
5. 任务01由原字段渲染目标、三观察步骤、比较角度、示例提示与笔记要求；统一14px/400字重/1.85行距/同色同左起点，去列表额外缩进、角度胶囊和单独目标提示块。正文逐字段保留，笔记有独立可访问标签及描述关联，校验不变。
6. Browser plugin not available；使用已有Node22.23.1、Playwright、Chromium153。临时127.0.0.1:8776 public实例无模型配置；8766仅实页与资产核对，不重启。

## 验证
所有临时脚本、日志、截图及本轮差异只存`/tmp/flavoglycolab-task-046/`，不入Git。

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `python3 scripts/dev.py check`（已有Node22） | Python78项：75通过/3显式research跳过；附带Node78/78；dev-check.log |
| `npm test` | 78/78；npm-test.log |
| `FRONTEND_URL=http://127.0.0.1:8776/ npm run test:browser` | 最终1617/1617；三路线/三视口、24任务、原门禁/表单/保存导出/导师及PDF夹具、新顶边/右边与指导样式断言；browser-final/results.json |
| 同地址`npm run test:pages-browser` | 最终689/689；原跨页/返回/刷新/续接/设置与新增三个56px方形/隐藏更多/恢复、纯图标与ARIA；pages-final/results.json |
| `node --input-type=module < /tmp/flavoglycolab-task-046/alignment-qa.mjs` | 最终892/892；三幕＋24任务×1440×1000/1024×768/1920×1080/900×1000/375×812/320×812，共162次页面位置检查，另加8766三个视口与经典滚动条三个视口；指导原字段逐项可见一次、7段文字样式/左起点统一、原校验/可访问标签、折叠存储不变/刷新恢复/总览/AI开关及回焦；alignment-results.json、alignment-final.log |
| 三栏顶边 | 85个桌面页面位置，最大误差0px；包括短屏、1920px宽屏、8766及经典滚动条场景；alignment-results.json.metrics |
| 右卡与导师右边 | 168个页面位置，最大误差0px；经典滚动条1440/1024/375场景分别1409/993/344px，两控件完全一致 |
| 8766静态资产 | 12/12与源码逐字节相同；含布局/视图/入口/内容JSON及图源登记/三PNG；protection-results.json |
| 保护/差异 | 440/440 SHA+size零差异，三PDF SHA3/3；demo-content及原图/来源登记、旧任务报告、状态机/服务端等均不变。git diff --check通过；implementation.diff保存本轮基线差异 |

工作台与跨页套件均应用错误0、外部运行请求0，各4条既有WebGL性能warning；专项应用错误/警告/外部请求/模型请求均0。没有安装依赖或调用真实模型。数据页不在本次功能改动范围，未额外重复其浏览器套件；数据读取/查询守卫仍由标准工程检查执行。

| 浏览器必查项 | 结果 |
| --- | --- |
| 地址/标题 | 通过，本地public与用户指定8766的任务/导入地址正确 |
| 非空 | 通过，正文、指导、表单及原图完整 |
| 错误遮罩 | 通过，未见框架错误层 |
| 控制台 | 通过，无应用错误；既有WebGL性能warning单列 |
| 截图 | 通过，实际查看桌面展开/收起、手机、1024px指导卡及经典滚动条截图；最终live-expanded-final.png / live-compact-final.png |
| 交互 | 通过，收起→三个方形/隐藏更多→刷新保留→恢复菜单；图标开导师→Esc回焦；原笔记输入/校验/提交与主线导航继续通过 |

Browser插件未提供，本次使用已有Playwright；后续可选装Browser插件以便应用内预览与检查。

## 与任务合同的偏差
无范围偏差。初次专项发现三幕导入右卡受sticky top偏移24px，已恢复无额外偏移；900px及以下原本是纵向主辅布局，合同/验证明确沿用该断点，避免误记为三栏。额外启用常驻滚动条检查发现15px右缘偏差，使用预算内纯布局同步修复。上述修正后重跑工作台1617、跨页689、专项892均通过；早期截图/日志保留，最终结果单列。

部分最初收起截图取在浏览器布局重新绘制的瞬间；几何测量正确，等待绘制稳定后重新取得最终截图，不将未绘完的图当作完成证据。

## 数据、许可与审核门
research_evaluation仍为候选；teaching_case_review仍22/22待审、0教师批准；public_teaching_release=not_started。没有修改来源/原图、科学字段、答案、实验记录规则或AI协议；工程外观验证不构成科学观测或教师审定。

## 已发现但未改的问题
窄屏继续按内容滚动，不宣称全部内容同时单屏可见。视口模拟不是实体设备验收；未增加新品牌浏览器、并发或真实模型测试。

## 遗留风险、仓库与CI
保留039—045既有未提交修改；未提交/push、未运行远端CI、未调用真实模型、未改常驻服务/网卡/防火墙。8766静态文件刷新即可见；临时8776 public测试服务收尾停止。

## 建议的下一TASK
不自动启动。
