# FlavoGlycoLab 当前状态

截至2026-10-23。TASK-029（human_direct）完成：论文对照弹窗移除单路线页签仅留「并排对照/结论与反思」，并排视图改对齐矩阵（五字段＋原文位置最左标签列，三篇内容、论文要点、在线阅读按钮、PDF面板、选择路线各自成行对齐，`data-case` 入口统一渲染并排视图）；inquiry.js 重构＋styles.css 追加28行＋测试随交互同步，npm 69/69、dev.py check 74项（唯一失败=TASK-031有合同无报告，暂停会话待收口）、test:browser 975/975、test:data-browser 68/68（console/外联0），DOM几何探针证实各行列对齐；`新标签页打开 PDF`链接与`PDF 按所有者指定公开（TASK-008 例外）…请勿二次分发。`提醒句经核实已由TASK-032删除、前端实时文件0残留（合同/报告/temp历史证据中的引用记录除外），解读卡变体句保留待所有者决定，见[REPORT-029](docs/reports/REPORT-029-compare-tabs-side-by-side-only.md)。TASK-031（human_direct）完成：导入三幕单幕两区顺序呈现——任一时刻仅渲染当前幕（左叙事/3Dmol/论文卡＋右 task-rail 问题或门禁），答对停本幕出反馈＋intro-advance 显式推进、答错 retry 不推进，删除 act-locked 占位，lab-state 状态机零改动；原会话暂停期间由 029 会话代登记，恢复后自验收口（dev.py check 全绿、npm 69/69、test:browser 975/975、test:data-browser 68/68、保护 170/170 零差异，8768 起停两次端口已释放），该轮 975+68 同时为 TASK-032 待补的联合全量验收提供最终组合树分母，见[REPORT-031](docs/reports/REPORT-031-intro-single-act-two-zone.md)。TASK-032（human_direct）完成论文PDF在线阅读可用性：8766根因=2026-10-19启动的旧进程无`/api/paper`（实测404），15:35 CST重启后 health 200、三份论文HEAD 200 application/pdf、字节流`%PDF-`；研究对话框“论文 PDF 与要点”删除所有者点名两句（“新标签页打开 PDF”链接与“PDF 按所有者指定公开（TASK-008 例外），出版方再利用权利未核验，请勿二次分发。”），app.js三条提示去“新标签页”引用＋test_inquiry_browser四处守卫同步；npm 69/69、保护170/170零差异；联合全量验收已于2026-10-23独立补跑通过（dev.py check exit=0全绿、npm 69/69、test:browser 975/975、test:data-browser 68/68），见[REPORT-032](docs/reports/REPORT-032-paper-pdf-online-reading.md)。TASK-028（human_direct）完成：站内绿色系文字可点元素获得非颜色持久提示——5处summary折叠行（.task-goal/.task-sources/.task-example/.route-evidence/.analysis-fields）改整行可点击bar（▸展开/收起旋转）、DOI/ChEBI外链改链接条+↗、topbar与正文链接加下划线；纯CSS追加（styles.css +14、case-page.css +3），浏览器644+68、专项探针与保护170/170全过，见[REPORT-028](docs/reports/REPORT-028-green-text-clickable-bars.md)。TASK-027（human_direct）完成：LJX会后整合全闭环——L01 三路线×六阶段171格走查通过（主路线R1，console/外联0）；L02 学习门禁（首篇任选、切换重判不继承）＋两阶段状态（stageMode guided/open、guidedDone、修订号复用contextRevision、旧存档fail-closed迁移）；L03 服务端新增result_analyst角色与kind=analyze协议（四分区输出：文献事实/学生自述/机制假设/尚不可判断；伪造来源/审核/观测400、提示注入按数据、索要产率证据守卫拒答）；L04 21条记录对账✓17/⚠4/✗0、4组报告值与PDF一致、8项白名单复算通过、峰比对与产率定量比较判定不可做；L05 逆合成融合可行性评估结论=受限（仅静态教学引入，动态四门槛有实质缺口）；L06 走查4缺陷修复（箭头函数字面量、警告三按钮、放弃回滚、gate-hint选择器）并完成回归。验证（2026-10-23远程实测）：dev.py check Python 74 OK（3 skip显式research门禁）＋node 69/69、unittest 39/39、npm 69/69、test:browser 644、test:data-browser 68、走查73/73（含1次真实AI analyze调用与降级），console/外联0；保护清单169文件0差异；PDF SHA 3/3。全部AI输出标“机器反馈·待教师审定”，三状态门不晋级。历史：TASK-026评价闭环/分析台/布局/重置修复；TASK-015—027已随2704edd入库；8766已于2026-10-23经TASK-032重启，8768验证服务已停止。默认public不依赖私有数据。当前仍为过程及证据审查练习；真实观测、数值仿真、正式课程评分与公众教学发布未实现。

## 运行与协作

| 项 | 当前事实 |
| --- | --- |
| 代码仓库 | [juliusloon/FlavoGlycoLab](https://github.com/juliusloon/FlavoGlycoLab)，public；main沿用现有公开父链 |
| 当前TASK | 最近完成TASK-029（对照弹窗页签收敛＋并排对齐矩阵，human_direct，见[REPORT-029](docs/reports/REPORT-029-compare-tabs-side-by-side-only.md)）；TASK-015—027已随2704edd提交入库，TASK-028—032已按所有者2026-10-23 human_direct指示随当日同步提交入库；TASK-030 为编号过渡登记对（对照弹窗任务曾临时占用 030 后回归 029，见[REPORT-030](docs/reports/REPORT-030-number-transition-registry.md)）；TASK-031（导入单幕两区）Completed 自验收口（[REPORT-031](docs/reports/REPORT-031-intro-single-act-two-zone.md)，代登记历史保留于其 §2）；TASK-032（论文PDF在线阅读＋两句文案删除＋8766重启）Completed（2026-10-23联合验收补跑通过）。TASK-033（human_direct）修复三份LYW交件的Git行尾规范化失配（`*.md text eol=lf`提交时剥离CRLF，干净检出字节≠demo-content登记的原件SHA，致2704edd/1bedaa4两次CI public-check三平台失败）：三文件改`-text`原样入库、blob恢复为登记SHA对应字节，磁盘原件与登记零改动，见[REPORT-033](docs/reports/REPORT-033-lyw-handout-raw-bytes-in-git.md)。三状态门：research_evaluation仍为候选、teaching_case_review不晋级（22/22待审）、public_teaching_release=not_started |
| 本地入口 | `python scripts/dev.py`，默认127.0.0.1:8767，Python 3.10+标准库，无需Conda/npm/GPU/私有数据/模型密钥 |
| 默认工程检查 | `python scripts/dev.py check`；Python 74项中71通过、3项研究资产明确跳过；Node可用时 `npm test` 69/69（2026-10-23远程实测） |
| 本地干净克隆验收 | TASK-013历史干净克隆84项见REPORT-013；TASK-018三路线/三视口403项、工具51项、真实AI10项、状态专项6项通过；TASK-019为484项、TASK-020为487项、TASK-021为517项、TASK-022为551项、TASK-023为603项（均Chromium153三视口/三路线，console错误/外部请求0）；TASK-024为工作台603项＋案例页3视口；TASK-025为工作台603/603、数据页65/65（隔离public）与68/68（本机Qwen）、案例页3/3；TASK-027为test:browser 644＋数据页68＋三路线走查73（含1次真实AI analyze），均非新的干净克隆或CI |
| 可选research | 导入离线包后显式选择；新克隆全量46项Python、9项JS、3059记录及117必需现存原件/SQLite核验通过 |
| 研究包 | 121文件＝117非模型原件＋4项v3派生；首次导入121、重复导入0/相同121。包约12.3 MB，SHA与本地路径见REPORT-013；未自动发送给成员 |
| 实时AI | 可选本机private/runtime/tutor.json；无配置不阻断流程。配置时前端显示“Qwen · 实时辅导（本机演示，未接入正式平台）”，固定角标“本机演示 · 未接入正式平台”；未配置/失败如实降级。原LAN的Qwen接入历史验收见REPORT-012，TASK-014实际完成两品牌各1次真实上游答复和1次无数据守卫；TASK-025只验收状态标识，不做容量测量或正式平台联调 |
| 练习保存 | 当前浏览器/站点源localStorage；最多12快照，可比较并导出；含学习草稿/自查、首次AI请求前判断；助手宽度偏好独立保存；无账号或跨设备同步 |
| 原LAN托管 | flavoglycolab-lan.service，8766；TASK-018只读核对13/13静态资产与当前源码逐字节相同，未调整/重启服务、模型、网卡或防火墙；2026-10-23 15:35 CST经所有者指示重启（TASK-032），当前进程为已提交TASK-027版serve_lab.py，`/api/paper`三份HEAD 200（见[REPORT-032](docs/reports/REPORT-032-paper-pdf-online-reading.md)）；唯一说明docs/operations/lan-site.md |
| 跨平台CI | 2704edd与1bedaa4两次推送public-check三平台失败（test 27干净检出SHA失配，根因见REPORT-033），TASK-033修复后随当日后继提交推送复核；browser job持续通过；历史成功run见TASK-014（39379185252）与204b232（39378915182） |
| 数据/来源保护 | TASK-018/019/020/021/022/023保护分母均199/199字节不变，含raw/derived/private/迁移/参考及冻结登记；TASK-027启动口径改为169文件逐路径sha256+size快照（mode跨宿主不可比剔除，见temp/task-027/protected-note.md），收尾0差异；TASK-016的196项历史检查仍见旧报告；SI独立登记未改变 |
| 日常Git | 当前main可普通提交/push；所有者远端public，成员克隆通常origin；不要推送旧研究归档分支 |

协作步骤唯一维护于[docs/operations/collaboration.md](docs/operations/collaboration.md)，现行规范[docs/data-governance.md](docs/data-governance.md)。此前公开仓库仅到TASK-009、前端未提交的问题由TASK-013解决；历史“无提交/push”只描述对应旧任务结束时的状态。

## 数据与审核门

| 层/状态 | 当前事实 |
| --- | --- |
| 默认public | metadata/active.json默认public；22条真实待审案例索引、123条来源元数据、三个指定PDF随Git提供；全量研究record_count=null |
| 完整本地原件 | 历史登记123、现存122，缺少1项OS元数据.DS_Store；本轮新增SI独立登记，不改变历史分母或研究包 |
| 研究包原件 | 117项现存非模型证据；5项external_model不随包交付且非运行依赖，允许缺失但存在时仍核对SHA |
| v3候选资源 | 3059条混合候选，不等于3059个实验；records.json原SHA不变 |
| 候选案例 | 1主案例＋21历史反应结构命中＝22条，全部pending_teacher_review；human_review_status=not_performed |
| 公开案例值 | 11项withheld_unlicensed；10项原缺失missing保留；原表在private历史副本保全 |
| P1待审材料 | 历史登记12项本地private custody，37项未移入；本轮未重新盘点/迁移 |
| research_evaluation | 历史研究候选与计算证据；不表示独立化学实验验证 |
| teaching_case_review | 22/22待审，教师批准0；工程守卫/AI回复不代签 |
| public_teaching_release | not_started；public_release=false，公开源码不代表教学服务验收 |
| 三篇公开PDF | TASK-008 human_direct精确例外；metadata/public_sources.json唯一登记路径/SHA，PUBLIC_PDFS兼容加载；出版方rights_verified=false |
| 新增文献交接 | HYK署名v2.0、7份Markdown＋15图共22文件，本地只读、未入Git；H01已收到/需补充，非数值说明已接入；三PDF 3/3匹配原登记 |
| 摘录核对范围 | TASK-015清点51正文项＋7SI声明并做12重点检查；TASK-016后续SI七项已核目录/四图/三表及正文关联；未做全部数值/序列/谱系科学复核或图数字化 |
| SI子来源 | metadata/literature_supplements.json登记三篇查证；只有Niu公开SI已见/已收，1915426字节且与官方逐字节一致；Zhang hasSuppl=N、Niu=Y、Pei未查到Europe PMC记录；SI原件/图文不入Git |
| 数据缺口 | Pei配比摘录需补正、Zhang原文条件/动力学冲突、Niu数据声明不能证明原始数据不存在；Niu SI原件缺件已关闭，另两篇未见公开SI；SI菌株表标签歧义保留；三路线标准曲线/可重放原始测量链仍不足 |

原始/派生/private其余字节不入公共Git。受限离线包不是公开数据集，不包含旧模型、private、密钥或Git历史，不自动发送/上传。内部交接仍按实际使用权限，不追认第三方版权。程序只读本项目相对路径，导入落点也限定项目内。

## 当前模块

| 模块 | 当前能力与局限 |
| --- | --- |
| evidence | 默认公开案例/来源读取与三个PDF核验；显式research读取v3/核验历史原件，缺失或损坏明确失败 |
| frontend/student | 异槲皮苷导入单幕两区顺序呈现（左当前幕叙事/3Dmol/论文卡＋右问题或门禁，答对 intro-advance 推进；幕一分子观察题、幕二合成难处判断题、幕三论文卡门禁）、六阶段和24项方案/证据练习（TASK-026起逐步导师评价门控）；任务01观察指引/比较角度/参考示例；任务视图两区单屏布局（左叙事分页+右稳定填写区）与论文解读卡内嵌PDF面板；LYW v5六界面×4步与"待教师审定"角标；三路线"结论与反思"4组原文报告值/14字段/21命中边界；阶段4结果分析台（DQ参照/条件四态对照/白名单计算8项/缺口与边界，全标"原文报告值·非本次观测"）；独立只读案例页`case.html`与数据查询页`data.html`；AI状态按本机Qwen实况显示；09/17/20探究工具；记录/导出、按需浮动AI |
| scripts/serve_lab.py | student限定资产及同源health/tutor/paper；`/api/paper/{source_id}`仅服务TASK-008三份登记PDF（启动SHA校验、降级503、响应单独放宽frame-ancestors 'self'）；导师上下文白名单含当前任务/论文的服务端映射；TASK-026起支持kind=evaluate评价协议（preset服务端判定、span子串校验、独立限流/单飞/eval_id缓存、审计日志）与literature_analyst角色；双守卫不放宽；模型配置仅后端，不提供任意文件/命令工具 |
| chemistry/experiment/teaching | scaffold；无教师审定的身份/反应系统校验、真实D1/色谱、完整24步课程或正式评分 |
| platform/teacher | scaffold；无正式师生账户、审核工作流、成绩/公众教学服务 |

输入条件均为学生方案，动画时间不代表反应速度；样品为计划标签，没有真实测量，observations=[]、quantitative_result=null。来源非数值摘要不是独立全文审定，模型不修改方案/创建批准。

## LJX技术准备与校内职责

- 两位指导老师负责校内沟通、推荐/提交流程、材料/签章、课程负责人、等保/权属/软著等校内事务；LJX提供技术材料、接收实际结论并做内部协调，不代办或代填。
- 第6/7栏技术准备稿26/26字段、当前/拟建架构、六工具状态及ai_data三字段设计已完成：docs/p10ns/261019/shenbaoshu_sections_LJX.md。未测容量/移动实体设备/资质继续待补，不把准备稿写成正式申报定稿。
- 14项交接清单及四类接收/接入合同已准备：docs/p10ns/261019/handoff_acceptance.md。站会唯一日志standup_log.md已建模板，未登记实际召开或成员签收。
- H01现已登记HYK署名v2.0和所有者后续补交SI的本地到件/指纹及需补项；无提交/传输时刻或真人签收凭据。data_gap_list.md为TASK-015代理准备稿，覆盖15类最低字段、24步影响与降级；待HYK确认，不记HYK的T-H2定稿或其他同事交付已完成。
- H02—H05与TASK-020实际交件：所有者2026-10-21把ZYT案例表（26,371字节/SHA `a731b7e7…c109`）、三路线docx（3,589,953字节/SHA `0c549adf…f982d`）与LYW矩阵（7,627字节/SHA `8a86c76e…a359`）放入`temp/261021-handout/`；TASK-020已解析docx文本并按实际内容校正网页。LYW实际稿无分钟/分值，180分钟/100分只是代理草案；B1/B2各180秒仍为待审设计。没有ZYT/LYW本人签收、docx一致性确认、视频成片或真人互审凭据。
- ZYT 2026-10-22三交件：B1脚本v1（6,642字节/`96408256…cc9f8`）、案例页文案v1（8,550字节/`4cc3f963…fe9a`）、路线图文字稿（4,891字节/`89bd34ba…3fbf`）已由所有者转交并代理接办；H04更新，新增H15/H16。B1 v1要求中列“未连接实时大模型”，与实际本机Qwen“实时辅导已配置”冲突，成片前须由ZYT在v2决定措辞/预置画面；无本人签收。
- 实际Google Chrome155.0.8059.84、Microsoft Edge155.0.4283.62在Ubuntu各87/87流程与8/8真实AI检查通过；3视口均无横向溢出，正常控制台错误/页面外部请求0。录像/截图/版本与限制见docs/operations/browser-acceptance.md和REPORT-014。
- 品牌包和录屏编码器仅解压到项目temp；没有系统安装或修改既有服务/模型。代理自动操作不是真人签收，视口模拟不是Windows/macOS/移动实体设备测试。

## 申报与未解决事项

- 所有者确认推荐资格、拟用化学生物学实验课程、校内2026-10-27截止及内部10-26定版；具体时刻、签章/提交安排和具名负责人由两位指导老师确认后补入。
- 异槲皮苷主案例身份、21命中的来源/方向/重复仍待审定；三篇已见全文与摘录，条件冲突/数值、原始测量链及逐载荷许可仍待准入。Niu正文声明CC BY 4.0不改变三篇PDF例外登记的rights_verified=false或自动授权新增图文。
- 工程过程和24项方案/证据练习已可用；完整24步科学教学、真实观测驱动仿真/分析、教师量规/正式评分、公众教学发布尚未完成。
- 2026-10-18主机/共享资源快照和规划预算仅作历史实施输入，当前未重测容量/带宽/并发或实际跨物理设备/主机开机。唯一基线docs/policy/ilab-2026/readiness-evidence-2026.md。
- 三名成员的实际设备/账号与真人验收未获得回执；研究包已经本地生成/新克隆实测，不声称已经发给成员或成员已经运行。
- 原研究历史保存在本地codex/archive-research-20261018及已核验bundle；35项历史汇报/附件本地保留，不混入公开父链。
- 历史文档准备/完整演示提案保留proposals目录；未被整份批准，不因本轮修复自动实施。后续任务须使用新的连续编号。

## TASK-027当前事实

- human_direct（2026-10-23所有者指令设计并实施L01—L06）：L01走查三路线×六阶段171/171格、主路线R1；L02学习门禁＋两阶段（stageMode guided/open、guidedDone、修订号复用、fail-closed迁移）；L03服务端result_analyst＋kind=analyze四分区协议；L04对账21条✓17/⚠4/✗0、4组报告值与PDF一致、白名单8项复算通过、峰比对与产率定量比较不可做（最终判定）；L05逆合成结论=受限（仅静态教学引入）；L06修复走查4缺陷并完成回归。
- 验收（2026-10-23远程cano）：dev.py check Python 74 OK（3 skip显式research门禁）＋node 69/69、unittest 39/39、npm 69/69、test:browser 644、test:data-browser 68、走查73/73（1次真实AI analyze记账）；console/外联0；保护169/169字节0差异；PDF SHA 3/3；8768已杀、8766未碰。
- AI实测与降级：本机tutor.json存在，仅1次真实analyze调用；其余协议级模拟；课堂并发55s超时/12次每分限流降级风险已在走查问题单标注。截至收口未收到LYW/ZYT/HYK实际交付，交接状态见handoff_acceptance.md追加段；不代签科学结论。
- 遗留：DQ-R2-03派生换算（约9.23 g/L）登记conflict未修复；数据丰度不均；三状态门不晋级（research_evaluation候选/teaching_case_review 22/22待审/public_teaching_release not_started）；未提交/push；证据在temp/task-027/。

## TASK-026当前事实

- human_direct五要求逐项落地：同阶段重置三处修复（回归4例）；导师评价闭环（preset/自动评价/门控/降级）；结果分析台五回合（analysis-engine.js白名单8项计算，全部标注"原文报告值/计算值·非本次观测"）；两区单屏布局+叙事分页+成段文字；24步文案具体化+paper_digests三篇解读+解读卡内嵌PDF面板（有头浏览器实测渲染正常）。
- 验收：dev.py check 62/62（REPORT落盘后配对消除）、npm 60/60、Chromium153/8768三视口637/637（console/外联0，本机Qwen实况）、test_lab_server 27/27；冻结目录内容零改动；PDF端点守卫通过。
- 全部AI输出标"机器反馈·待教师审定"；preset/文案/解读为agent_checked_candidate；三状态门不晋级；8766未重启；未提交/push；证据截图在temp/task-026/。

## TASK-025历史事实

- 接办LYW 2026-10-22三份交件：v2科学24步29,452字节/`f3e3ccb0…f74d`、评价说明8,103字节/`31d8b1b5…30da`、B2执行版26,874字节/`1052c864…abf9`；原字节归档至`docs/p10ns/261019/`且SHA一致。无LYW本人签收/教师审定；v2自述未做浏览器/模型验收。
- 数据查询页：`data.html`/`data-page.js`/`data-query.js`/`data-page.css`只读同源`demo-content.json.data_query`；21条记录（R1 9/R2 5/R3 7，7类），按路线/来源/类别/关键词筛选，URL深链；无匹配显示“没有对应实验数据”，不转0、不预测、不排名。入口在顶栏、案例页与分析页；不调用AI、不读写学习记录、无第三方请求。
- AI实况：配置Qwen时显示`Qwen · 实时辅导（本机演示，未接入正式平台）`，固定角标`本机演示 · 未接入正式平台`；未配置显示`模型尚未配置 · 本机练习可继续`，失败显示`模型连接不可用 · 实验台可继续`。案例页同步为“本机演示”表述，不再声称“未连接实时大模型”。
- 24步状态：按LYW v2科学24步（5/5/6/1/3/4）映射现行v5网页任务（4/4/4/4/4/4），得可操作13（02、03、05、06、09、10、11、12、16、17、22、23、24）、仅占位9（01、04、07、08、13、14、15、20、21）、受阻2（18、19）；`24step_status_LJX.md`24行齐全，不声称v2已实现。
- B1素材：`temp/task-025/`新增数据页默认/筛选/空状态、AI实况与v2状态板共5张1920×1080截图；TASK-024的16/6/2状态板与旧AI截图转为历史。B2只接办执行版，未录制/成片。
- 工程验收：`dev.py check` 52项Python（49通过+3研究skip，内置Node 48/48）、`npm test` 48/48、数据页65/65（隔离public）与68/68（本机Qwen）、工作台603/603、案例页3/3；console错误0、外部请求0；保护199/199、PDF SHA 3/3。8766未重启；三状态门不晋级；未提交/push。

## TASK-024历史事实（ZYT接办）

- 接办ZYT 2026-10-22三份交件（B1脚本v1、案例页文案v1、路线图文字稿），SHA与本轮TASK-024一致；未改原件，未取得ZYT本人签收或提交时刻。
- 图1：原创`route_map_v1.svg`17,045字节＋Chromium渲染`route_map_v1.png`897,428字节；R1加糖/R2剪糖/R3工程菌三路线、公共产物、旁路/副产物、三步改造括注、三组结果标签与5条脚注；PubChem CID/分子式已核，芦丁SMILES书写差异以CID交叉核对且图内不印SMILES；Springer图表授权仍待。
- 案例页：`case.html`/`case-page.js`/`case-page.css`只读读取`demo-content.json.case_page`；S1—S6逐字、5分子、3路线卡、10行对照、4证据规则、5参考文献（[4] Bondonno仅文本引用，未入来源登记/PDF端点）；全部数值标“原文报告·非本次观测·待教师审定”。三视口均无溢出，图1可见，console错误0/外部请求0。
- 24步状态：24/24行，可操作16（01—10、12、17、21—24）、仅占位6（11、13—16、20）、受阻2（18—19）；11张1920×1080真实界面截图与状态板存`temp/task-024/b1-assets/`（Git忽略）。发现AI角标冲突与无独立数据查询UI，详见REPORT-024。
- 工程验收：`dev.py check`通过（Python52=49通过+3研究skip，其Node子集35/35；`npm test` 42/42）；工作台Chromium153隔离public-root三路线/三视口603/603（console错误0、外联0），案例页三视口3/3（无溢出、console/外联0）；保护199/199、PDF SHA 3/3。8766未重启；三状态门不晋级；未提交/push。

## TASK-023当前事实

- 双角色评测落档`temp/task-023/teacher|student/`（各notes.md＋40+截图）：导入文档流、任务01无脚手架、导师入口被动、首屏无定位、英文校验气泡、PDF卡加载无提示等被确认；装配重置与无仿真内核两项P0转未决（超预算）。
- 开场三幕改为顺序步骤：幕一分子观察选择题（3-O位，挂ChEBI68352/ChEBI75839）、幕二合成难处判断题（选择性/保护基，挂Pei2019/Niu2024），答错给retry提示不推进、答对给反馈并解锁；幕三须至少打开一篇论文卡（已打开n/3）才放行"开始主线探究"；进度指示与首屏orientation定位行新增。
- `lab-state.js`新增`introProgress/answerIntroAct/recordIntroPaper`；旧存档（有revealed/routeChosen无step）自动视为导入完成；hydrate对exploration宽容清洗不throw。24步语义、状态机核心、判定/保存/导出零改动。
- 任务01新增观察指引3条（挂ChEBI16243/ChEBI68352）、三路线比较角度chips、提交后"参考示例（非标准答案）"；理由框标签统一为note_prompt；每个任务视图均有"问导师"预填（任务01用coach_question）；幕三有"让导师带我读论文"预填。
- 表单required控件中文校验提示；PDF面板8秒无加载提示新标签页；对话框close重渲染限定导入场景（修复异步close与表单fill竞态导致的丢值）。
- 工程验收：`dev.py check`通过（Python51=48通过+3研究skip，Node35/35）；Chromium153三视口/三路线603/603（含legacy迁移/键盘/失败/慢PDF夹具）；console错误0、外联0；保护199/199、PDF SHA 3/3。证据见REPORT-023与`temp/task-023/`。
- 8766未重启；三状态门不晋级；未提交/push。

## TASK-022当前事实

- 开场改为四幕：幕一"认识异槲皮苷"（4条表述逐条挂ChEBI68352/Zhang2015/ChEBI28527/Niu2024/Pei2019并标"导入内容 · 待教师审定"＋3Dmol保留聚焦糖基/复位/来源面板）；幕二"为什么不直接化学合成"（4条挂源表述）；幕三三张文献卡（原理示意SVG沿用）＋阅读提示"不必现在读完，主线中AI导师指导阅读"＋开始主线探究。reveal机制、未展开占位、replay-intro均保留。
- 单研究对话框新增"论文 PDF 与要点"：方向/催化/供体/小结4条非数值要点（复用routes.evidence与route_summary）、待审定标签、TASK-008公开范围说明；点击后经HEAD预检加载同源iframe，失败出诚实状态，新标签页回退链接常显；并排对照视图不加面板。
- `/api/paper/{source_id}`仅服务intro.papers三个登记id：启动时与metadata/public_sources.json精确匹配路径/SHA并核验文件字节，缺件或SHA失配降级503且不出字节；未知id/遍历/查询串返回404/400；流式application/pdf＋no-store；仅论文响应CSP放宽为frame-ancestors 'self'，其余页面仍'none'；静态后缀白名单未加.pdf。
- AI导师上下文白名单新增task{id,title}与paper{source_id}：标题/定位/要点全部由服务端映射，客户端伪造字段不进上下文；SYSTEM增加两句阅读指导边界；"最近阅读"在对话框关闭后保留于导师上下文，新实验清空。无数据守卫（QUANT_REQUEST/QUANT_OUTPUT）行为不变。
- 工程验收：`dev.py check`通过（Python51=48通过+3研究skip，Node31/31）；Chromium153三视口/三路线551/551；console错误0、外部请求0、4条WebGL性能warning；保护199/199；三份PDF SHA 3/3一致。证据见REPORT-022与`temp/task-022/`。
- 8766未重启：其旧进程无论文端点，在线阅读在8766呈诚实失败态；端点已在8768隔离副本（模拟干净克隆：含公开PDF、无私有导师配置）验收。24步语义、状态机、判定、保存/导出与三状态门未改。

## TASK-021当前事实

- 删除所有者点名的首页与对话框说明：`自查进度 · 不计正式成绩`、`先探索论文中的做法，再提出自己的方案。`、成功态`计算构象 · 非实测`、`拖动旋转 · 滚轮缩放`、导师`需要时，随时来问`、`围绕当前任务，比较研究方案与证据。`及文献报告/计划样品长脚注。
- 文献卡片顶部重复箭头删除，首页与路线确认卡片各保留底部一个入口箭头；紧凑任务视图沿用原有隐藏入口标签行为。
- 同步清理设置副文案、工作台页头解释、阶段文献条标题、路线确认与对话框建议、导师分阶段指导、记录迁移说明、导出“不计成绩”标签及未渲染的`learning.description`；保留取样/导出上限、隐私提示、无障碍名称和错误恢复。
- 必要边界改为短标签保留：`数据依赖 · 待教师审定`、`教学判断 · 待教师审定`、`原文报告/非本次观测`、`22/22 案例待教师审定`、`无对应实验数据`、`尚无真实测量`、`案例仍待教师审定`。
- 工程验收：`dev.py check`通过（Python46=43通过+3研究skip，Node30/30）；Chromium153三视口/三路线517/517；console错误0、外部请求0、4条WebGL性能warning；保护199/199；8766未重启，8768测试服务已停止。证据见REPORT-021与`temp/task-021/`。
- 24步标题、阶段映射、证据数值、状态机、AI协议和原始交付件未改；三状态门不晋级。

## TASK-020当前事实

- 24项任务按LYW实际“v5 界面简明版”分为六界面×4步（4/4/4/4/4/4）；每项有`matrix_title`、`goal_requirement`、`data_dependency`与`review_status=pending_teacher_review`，没有`minutes`/`points`/`score_type`。数据依赖沿用TASK-019代理设计，仍为04、09、13—22（12项），LYW实际稿未给该角标，全部待教师审定。
- `learning.teaching_matrix`记录实际来源路径/SHA、`actual_has_minutes_points=false`、`data_dependent_steps`和`proxy_rubric`；180分钟/100分只作`agent_proposal_not_teacher_approved`内部草案，页面不显示、不计成绩。
- 三篇论文对话框“结论与反思”新增4组ZYT docx文献报告值（R1补料3,830 mg/L/94.3%、R1供体/酶组合64.8/98.4/96.8%、R2 18.25/19.87 mM、R3 35.6 g/L/yield 77.2%），每行标原文条件、来源及“原文报告/非本次观测”边界；C01—C14、21条命中边界与三栏结论保留。
- 实际文件SHA：案例表`a731b7e7…c109`、docx`0c549adf…f982d`、LYW矩阵`8a86c76e…a359`；docx解析文本148行存`temp/task-020/`，原件未改。无ZYT/LYW签收或教师审定。
- 工程验收：`dev.py check`通过（Python46=43通过+3研究skip，Node30/30）；Chromium153三视口/三路线487/487；console错误0、外部请求0、4条WebGL性能warning；保护199/199。证据见REPORT-020与`temp/task-020/`。

## TASK-019历史事实（代理假设，已校正）

- TASK-019当时按仓库代理工作副本接入24步拟议分钟/分值/成绩类型与数据依赖角标；合计180分钟/100分，阶段切分为8/2/6/1/3/4。该时间/分值与切分不是LYW实际交件，已由TASK-020替换。
- 当时“docx不可读/未解析”、案例表17,168字节等记录只说明TASK-019时点；TASK-020已确认docx可读、实际案例表26,371字节。历史验收484/484与REPORT-019保留，不冒充本轮结果。

## TASK-018基础事实

- 学生入口已完成沉浸式探究空间：异槲皮苷本地 3Dmol 结构（ChEBI:68352、PubChem:5280804 交叉核对；RDKit 计算构象）、三种路线机制示意、八项顺序主线、六阶段论文对照与实验记录。
- `demo-content.json.case_studies` 维护三路线×六阶段的非数值方案、条件语义、待检验假说、证据定位和缺口；不消费私有摘录，不生成真实观测、产率或成绩。
- AI 默认收起并按需浮窗；`aiRequested` 与 `contextRevision` 防止路线变更后的陈旧回复或不当追认。真实 8766 专项恰好 2 次 POST；模型仍为可选服务。
- 工程验收：Python46（43通过/3研究skip）、Node27/27、浏览器403/403、工具51/51、真实AI10/10、状态专项6/6；受保护资产199/199、8766静态资产13/13。详细事实见 REPORT-018 与 `temp/task-018/`。
- image_gen 概念图调用返回 HTTP404，未取得概念图；依据用户布局规格和实际截图完成视觉核对，台账为 `temp/task-018/fidelity-ledger.md`。
- 工程通过不改变三个状态门：22/22案例仍 pending_teacher_review，教师批准0，公众教学发布 not_started。

## 事实入口

[TASK-027](docs/tasks/TASK-027-ljx-meeting-integration.md) / [REPORT-027](docs/reports/REPORT-027-ljx-meeting-integration.md)维护LJX会后整合、学习门禁与两阶段状态、result_analyst结果解析、21条对账、逆合成受限结论与L06四缺陷修复；[TASK-026](docs/tasks/TASK-026-tutor-swarms-loop-ui-reset-fix.md) / [REPORT-026](docs/reports/REPORT-026-tutor-swarms-loop-ui-reset-fix.md)维护导师评价闭环、结果分析台、两区布局、文案具体化与重置修复；[TASK-025](docs/tasks/TASK-025-lyw-handoff-data-query.md) / [REPORT-025](docs/reports/REPORT-025-lyw-handoff-data-query.md)维护LYW 10-22三交件接办、只读数据查询页、本机Qwen实况AI标识与v2科学24步映射；[TASK-024](docs/tasks/TASK-024-zyt-handoff-figure-casepage.md) / [REPORT-024](docs/reports/REPORT-024-zyt-handoff-figure-casepage.md)保留ZYT 10-22三交件接办、图1制图、案例页v1与24步状态表；[TASK-023](docs/tasks/TASK-023-guided-intro-steps.md) / [REPORT-023](docs/reports/REPORT-023-guided-intro-steps.md)维护导入分步交互、任务01引导与导师预填入口；[TASK-022](docs/tasks/TASK-022-intro-narrative-paper-access.md) / [REPORT-022](docs/reports/REPORT-022-intro-narrative-paper-access.md)维护四幕导入、论文PDF端点与导师阅读上下文；[TASK-021](docs/tasks/TASK-021-ui-copy-cleanup.md) / [REPORT-021](docs/reports/REPORT-021-ui-copy-cleanup.md)维护界面注释文案清理与单箭头修正；[TASK-020](docs/tasks/TASK-020-actual-handout-reconciliation.md) / [REPORT-020](docs/reports/REPORT-020-actual-handout-reconciliation.md)维护实际交件校正、LYW v5 24步与三路线报告值接入；[TASK-019](docs/tasks/TASK-019-teaching-matrix-route-analysis.md) / [REPORT-019](docs/reports/REPORT-019-teaching-matrix-route-analysis.md)保留代理假设历史；[TASK-018](docs/tasks/TASK-018-immersive-inquiry-workspace.md) / [REPORT-018](docs/reports/REPORT-018-immersive-inquiry-workspace.md)维护探究空间、主线/分子/AI基础；[TASK-017](docs/tasks/TASK-017-delegated-handoffs-lab-enrichment.md) / [REPORT-017](docs/reports/REPORT-017-delegated-handoffs-lab-enrichment.md)维护代理交接和实验/侧栏验收；[H02—H05](docs/p10ns/261019/handoff_acceptance.md)为唯一交接记录。

[TASK-016](docs/tasks/TASK-016-supplement-reconciliation.md) / [REPORT-016](docs/reports/REPORT-016-supplement-reconciliation.md)维护本轮SI查证；[REPORT-015](docs/reports/REPORT-015-literature-handoff-integration.md)保留前一轮文献接入与SI当时未到的历史事实；[数据缺口](docs/p10ns/261019/data_gap_list.md)为代理准备稿。[REPORT-014](docs/reports/REPORT-014-ljx-technical-preparation.md)维护技术准备验收；[REPORT-013](docs/reports/REPORT-013-collaboration-ready.md)保存协作交付证据；[REPORT-012](docs/reports/REPORT-012-interactive-workbench.md)保存原LAN/实时AI历史验收；其余历史见docs/reports。STATE仅保存当前事实，里程碑见PROGRESS。
