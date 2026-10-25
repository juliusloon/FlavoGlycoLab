# REPORT-047：实验速览与常驻论文笔记本

## 对应任务
- TASK文件：docs/tasks/TASK-047-experiment-overview-paper-notebook.md
- 状态：Completed
- 基线提交与分支：main / 92fe3f8；保留039—046既有未提交改动，以及并行048导师精简、049任务01合页。
- 结果提交：pending；未提交/push。
- 授权来源：human_direct，2026-10-25用户两项界面实施要求。重复的最后一个“第一篇”按第三篇实现。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 导入/任务呈现 | frontend/student/views/inquiry.js | 导入保留三卡、右侧六阶段速览与直接开始；卡片进入对应论文；任务01三张阅读卡＋阶段对照入口共用笔记本；矩阵新增notebook只读呈现选项，原有路线选择保留 |
| 阅读浮窗 | frontend/student/paper-notebook.js、paper-notebook.css | 独立原生dialog、左四便签、三篇PDF/笔记/阅读指引/问导师、加载/较慢/失败重试及新标签页；键盘切换、Esc/回焦，桌面并排/手机纵排 |
| 全局挂载/编排 | frontend/student/index.html、app.js | 常驻48px笔记本图标，与导师共用右边缘；笔记写入当前run并复用save；论文上下文及转导师；不发送AI请求。index/app中的导师精简属于048，不归本轮 |
| 学生记录 | frontend/student/lab-state.js | 取消论文打开数门槛；paperNotes默认/旧记录迁移/三个source_id及8000字符校验；随既有快照/JSON/Markdown导出，换路线保留、新实验清空 |
| 运行检查 | scripts/dev.py | 两个新运行资产纳入完整性清单，无新依赖/后端接口 |
| 工程守卫 | tests/test_workbench_state.mjs、test_governance.py | ADR序列断言纳入0009；更新旧论文门槛断言，新增笔记迁移/非法数据、快照、导出、路线/新实验隔离等有行为意义的检查 |
| 浏览器守卫 | tests/test_inquiry_browser.mjs、test_pages_browser.mjs | 原点击门槛改速览直接开始、任务01统一阅读入口；原PDF检查迁至笔记本；保留24任务/三路线/键盘/故障及路线确认，兼容049合页 |
| 文档/长期决定 | frontend/student/README.md、docs/design/interface-system.md、ARCHITECTURE.md、docs/adr/0009-paper-notebook-student-notes.md、docs/adr/README.md、TASK/REPORT、STATE/PROGRESS | 使用规则、唯一职责、笔记语义与验收闭环 |

styles.css、demo-content.json、元数据/原图/原件及服务端无本轮改动；不将其他任务的共享文件差异计入本轮。

## 实际操作与观察
1. 保存488项文件基线及允许路径源码副本；其中276项科学/来源/原图/交件为本次冻结核对分母。
2. 导入不再要求打开论文。前两幕顺序判断和24任务判定保持原有约束；保留旧papers字段兼容历史，但不再用于当前门槛。
3. 笔记本四便签为论文对比、Pei2019、Zhang2015、Niu2024；三篇真实PDF沿用受控同源端点与既有解读，无新材料。比较内容随当前实验阶段投影，不另存科学数据；单纯阅读/笔记不改变路线、学习答案、AI使用事实或观测。
4. 笔记输入即时保存于run.paperNotes；不重建任务表单或分子视图。三篇各8000字符，旧记录缺字段补空对象，非法来源/类型/长度fail closed。JSON、Markdown及历史快照包含笔记；当前任务答题草稿保持独立。
5. 便签短标签修正初次手机长标题拥挤，完整名称留无障碍名称/悬停标题。桌面PDF与笔记并排，手机上下滚动。初次截图过早看到PDF加载黑底，等待原生阅读器绘制后复核，真实文档在两种视口可见。
6. Browser plugin not available；使用已有Node22.23.1、Playwright及Chromium153.0.8010.12。临时127.0.0.1:8777实例禁用模型配置；8766实页亦未发送POST。最终视觉直接用view_image核对三卡/六流程、居中矩形/四左便签、共享字级/白绿配色、PDF/笔记分栏、手机折行与入口；与用户布局一致。未生成概念位图，属于既有设计系统内有限表面调整。视觉台账见本地fidelity-ledger.md。

## 验证
证据均在/tmp/flavoglycolab-task-047/，不入Git。

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| python3 scripts/dev.py check（public，Node22 PATH） | Python78：75通过、3显式research跳过；Node80/80；check-closed-final.log |
| npm test | 80/80；新增两项笔记语义检查；node.log |
| npm run test:browser | 1614/1614；三路线/桌面1536、平板768、手机375，含24任务、旧记录、键盘/模型失败、慢PDF及开放探究；browser-final2/results.json，normal console错误/外联0 |
| npm run test:pages-browser | 692/692；errors0/externals0，4条既有WebGL性能warning；pages/results.json |
| npm run test:data-browser | 71/71；console错误0/外联0；data.log |
| notebook-qa.mjs专项 | 190/190，public1536/900/375及用户原URL8766的1536/375；覆盖无需读论文开始、四便签、中心/尺寸、键盘/回焦、三篇真实PDF、中文输入/纯文本转义、草稿/笔记/刷新/换路线/新实验隔离、导师切换、PDF故障重试、保存失败。应用错误0、外联0、真实模型POST0；notebook-results.json及各视口截图 |
| final-surface.mjs | 6/6；8766桌面/手机独立论文页上打开笔记本、切换结论反思/对照、无重复id及Esc回焦；final-surface.json |
| 冻结资产 | 276/276与基线字节相同；三份公开PDF SHA3/3与metadata/public_sources.json登记一致；protection.json |
| 8766静态字节 | index/app/lab-state/inquiry/新JS/新CSS六项HTTP200，6/6与磁盘源码相同，刷新可见；不重启服务 |

## 与任务合同的偏差
无功能范围偏差。预算补列受旧门槛影响的test_pages_browser、test_governance.py的ADR序列更新与长期ADR0009。初次Node为78中77通过/1项旧门槛断言失败，按合同更新后80全通过。默认Node18及Playwright期望的1248浏览器不可用，改用机器已有Node22及Chromium1243，无安装或依赖更改；有头尝试因无可用DISPLAY退出，最终使用可正常绘制PDF的无头Chromium并检查截图。

第一次整套浏览器运行在并行049合页前加载了旧脚本、手机后段加载了新页面，1121项处遇旧三页断言；保留049后重跑。第二次1597项处，旧损坏存储夹具被新加的JSON读取断言解析失败；将该断言改为检查可选论文入口，不覆盖损坏存储，最终1614全通过。额外论文页专项初次误以为standalone会输出标题id，调整为按实际DOM检查分析内容与全页id唯一性，6项通过。失败日志保留，不计入最终通过分母。

文档收口新增ADR0009后，Python硬编码的1—8序列断言失败1项；按实际登记扩为1—9，最终重跑78项通过（3显式research跳过），日志check-closed-final.log。

并行048/049对app/index及任务01页面组装/分页的改动予以保留，不由本轮代签；本轮最终回归覆盖当前共同代码。

## 数据、许可与审核门
- research_evaluation：历史研究候选；未新增独立实验或数值观测。
- teaching_case_review：仍22/22待审，教师批准0；解读与工程通过不代替教师审核。
- public_teaching_release：not_started，未做公众教学发布验收。
- 三份PDF仍为TASK-008 human_direct精确例外，出版方rights_verified=false；未增加PDF/数据公开范围。

## 已发现但未改的问题
笔记仅当前浏览器/站点本地保存，不跨设备/地址同步。手机需在PDF下方滚动至笔记；原生PDF界面由浏览器提供。不宣称实体移动设备或Safari/Firefox兼容性已验收。

## 遗留风险、仓库与CI
main / 92fe3f8；保留既有及并行工作，未提交/push、未运行远端CI、未调用真实模型、未修改常驻服务/系统配置。临时8777仅供本轮public QA，收尾停止；8766不重启。

## 建议的下一TASK
不自动启动。
