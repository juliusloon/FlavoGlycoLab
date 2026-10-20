# REPORT-014：LJX技术底稿、双浏览器走查与交付接入准备

## 对应任务
- 合同：[TASK-014-ljx-technical-preparation.md](../tasks/TASK-014-ljx-technical-preparation.md)；状态：Completed（技术准备与代理工程验收）。
- 日期2026-10-20；基线main/ac74e02；实施分支codex/ljx-technical-preparation。
- 授权human_direct：所有者明确执行上一轮第2/3/4项；校内事务由两位指导老师负责，LJX仅技术材料、验收和内部协调。
- 执行者Cano；human_reviewed=false，decision_origin=agent_task_audit。准备稿与代理QA不等于同事接收、老师审核或最终申报定稿。
- 结果提交：本报告所在的技术准备提交及其后续闭环提交；实际SHA由Git提交记录读取，不在文件内编造自身SHA。同步结果见文末。

## 实际结果

1. **第6、7栏准备稿完成。** 对照本地附件1的word/document.xml第279—382段，6栏14项、7栏12项合计26/26；每项有可填文案/事实或待补标记。当前/拟建架构两图、六工具6/6真实状态、ai_data三字段3/3的计数/重试/未知语义齐全。原表路径/SHA在本地source-form-provenance.json，第三方DOCX原件没有改写或公开。
2. **实际Chrome/Edge走查与录屏完成。** 官方Chrome155.0.8059.84和Edge155.0.4283.62，Ubuntu上各87/87完整过程检查；各3视口/3路线，页面正常错误0、外部请求0。现有LAN每品牌8/8真实AI与无数据守卫检查，共2次真实模型回复、2次直接证据拒绝，AI没有改写学生方案。源码app/状态机/服务不需产品修复。
3. **交接/接入准备完成。** 13条原交接加LJX技术稿共14项，四类核心交付有字段/来源/缺项/接入合同；站会15分钟议程与会后槽位已准备。未收到同事材料的行仍“未登记接收”，未召开/未签收不编造。校内办理职责更正为两位指导老师。

## 改动文件与职责

| 文件 | 实际改动 |
| --- | --- |
| docs/tasks/TASK-014-ljx-technical-preparation.md、本REPORT | 本次直接授权、事前预算、五项验收与事后证据 |
| docs/p10ns/261019/shenbaoshu_sections_LJX.md | 可直接使用的6/7栏技术准备文案；26字段、两架构图、AI六工具/三统计字段、待补来源 |
| docs/p10ns/261019/handoff_acceptance.md | 14项接收状态、文献/案例/24步/脚本合同、接入路径、缺项与冲突处理；不复制科学真值 |
| docs/p10ns/261019/standup_log.md | 今晚15分钟议程、真实会后填写槽位；状态未登记，不代填参会/老师答复 |
| docs/operations/browser-acceptance.md | 双品牌实际版本、流程/AI/录像结果、复现命令、失败与未测范围 |
| tests/test_workbench_browser.mjs | 保留默认84项；品牌UA增加3项，实际身份/URL/title、可选录像、可配置代理操作间隔、按会话保存视频定位 |
| docs/p10ns/261019/申报阶段分工与执行方案_20261019-1026.md | 顶部新增现行职责和实现更新，原历史排程/目标/表格保留，不用旧“前端为空”驱动当前工作 |
| docs/policy/ilab-2026/readiness-evidence-2026.md | 标明老师/技术职责及旧快照日期，链接当前技术稿；不把旧目标改成已测容量，不改科学来源 |
| ARCHITECTURE.md | 唯一工件归属、老师职责和技术/接收/站会/QA边界 |
| STATE.md、PROGRESS.md | 当前准备稿、品牌/真实AI验收与待补范围；三状态门不晋级 |
| README.md、docs/README.md、docs/tasks/README.md、docs/reports/README.md | 新工件入口及014索引，旧历史候选不整份追认 |

## 验证与证据

本地证据根temp/task-014，不公开浏览器发行包、源码附件、私有材料或大录像。Browser plugin not available，应用frontend-testing-debugging技能，使用已有Playwright1.64.1驱动两个官方品牌可执行文件，默认headless；是代理逐步操作，非人类手动签收。文稿按当前要求使用简明中文与明确事实/拟建/待补；没有可用的个人写作样例连接器，不声称检索到用户历史写作样本。

| AC / 实际方法 | 分母、结果、证据及限制 |
| --- | --- |
| AC1 源表覆盖 | S6.1.1—S6.6.2合计14项、S7.01—S7.12合计12项，共26/26精确匹配；段落原定位/SHA核对。source-form-6-7.txt、source-form-provenance.json、document-verification.json |
| AC2 架构/AI/职责 | 当前与拟建两图，六工具6/6分别说明现有工程基础/科学与接口待建；ai_data3/3定义真实请求/失败重试/未知累计量，不把未知填0；老师责任已在稿/清单/方案/基线/STATE更新 |
| AC3 品牌身份 | 官方Chrome155.0.8059.84、Microsoft Edge155.0.4283.62，包URL/大小/SHA、version stdout/stderr及UA保留。Edge包另与官方Packages索引SHA比对。browser-packages.json、browsers/edge-package.json；仅项目temp解压，没有系统安装 |
| AC3 无私有配置流程 | 每品牌87/87；1536×1024/R1、768×1024/R3、375×812/R2；正常页面错误0/外部请求0。chrome/results.json、edge/results.json及各目录PNG/WebM。87＝原84项＋3视口UA身份检查 |
| AC3 流程与异常 | 路线/装配/条件/对照/单位/取样/无观测/反思到记录可走通；错材料/错取样阻断，刷新恢复、上游失效、快照/比较/导出、取消重置、损坏备份与内容恢复通过。模拟模型502和内容503是独立fixture，不假冒真实模型或正常错误统计 |
| AC3 LAN真实AI | 每品牌8/8，共16检查；127.0.0.1:8766实际已有服务、mode=model真实回复，定量请求mode=evidence_guard，学生方案不变，页面错误/外部请求0。chrome-live/results.json、edge-live/results.json、live-ai-check.log及PNG/WebM；只做小量功能检查，不测容量 |
| AC3 录屏与图像 | 每品牌3段完整路线WebM、3个H.264/25fps MP4和1个三路线拼接MP4；真实AI另各1段WebM/MP4。最终验收引用6段流程＋2段AI的8个原始会话视频、10个MP4（含2拼接总览），ffprobe校验可播放且时长>1秒，SHA/大小/尺寸见video-manifest.json、live-video-manifest.json |
| AC3 视觉复核 | 同轮查看Chrome1536-records及Edge375-analysis，记录/缺数据界面清楚、三视口自动溢出检查通过；实际AI回复/守卫独立截图。没有改视觉设计，不做概念图或像素等价声明 |
| AC4 接收合同 | H01—H14精确14/14；四类核心合同覆盖文献、案例、24步和脚本，接入层/责任/版本/缺项明确；所有未到件/未开会保持未登记。document-verification.json及三份准备文件 |
| AC5 默认工程检查 | python scripts/dev.py check：46项Python中43通过、3项可选研究资产明确skip；JS状态9/9通过。default-check.log。没有改数据，不重复全量研究测试 |
| AC5 字节保护/链接/公开 | baseline.json的172项raw/derived/private/登记/迁移/参考SHA逐项一致；86/86活跃相对链接与16/16本次文本路径通过公开载荷/凭据守卫；source DOCX原SHA再次核对，10/10 MP4指纹/可播放信息验证；git diff --check通过 |

实际主机/工具快照：Ubuntu24.04.4 LTS、系统Python3.12.3/开发Python3.13.13、Node22.23.2/npm10.9.8、Git2.43.0。96逻辑CPU和约125.37 GiB总内存是共享主机观测，不是项目配额。health仅返回配置/模型名，不输出密钥。runtime-snapshot.json绑定本轮读取；原容量/性能目标未做负载试验。

## 交付文件和影像

- 技术准备稿：docs/p10ns/261019/shenbaoshu_sections_LJX.md。
- 接收/接入：docs/p10ns/261019/handoff_acceptance.md；会议唯一模板/记录standup_log.md。
- 便于查看的两品牌总览：temp/task-014/chrome-walkthrough.mp4、edge-walkthrough.mp4；分辨率1536×1024，三视口视频按原比例留边拼接，不冒充申报B1/B2成片。
- 逐路线MP4：各品牌目录中的R1-1536、R3-768、R2-375文件；手机转H.264时按偶数尺寸374×812编码，不改变源375×812走查视口，原WebM保留。
- 实时AI影像：temp/task-014/chrome-live-ai.mp4、edge-live-ai.mp4，另有model-reply/evidence-guard PNG。真实问答使用工程QA文本，不是学生真实学习记录。
- 浏览器包、源码附件解析、版本/host快照与影像仅在本项目ignored目录。原创准备稿、可复现工具与事实报告经审查纳入Git，供团队拉取。

## 失败、修复及合同偏差

1. 首轮录屏在newPage时发现Playwright专用ffmpeg-1013缺失；系统已有ffmpeg不能自动替代该路径。已从Playwright官方CDN仅下载到项目temp/task-014/pw-runtime，未改系统安装。初始日志chrome/edge-initial-no-video.log与ffmpeg-install.log保留。
2. 第二轮隔离副本通过短shell的Popen启动后被执行环境回收，浏览器连接拒绝。已改用持续exec会话，重新跑同样流程成功；初始*-initial-preview-exited.log保留。这两类是QA环境准备失败，不伪称已测产品错误。
3. 首次成功录像动作较快，录屏模式增加120ms驱动间隔后两品牌各87/87复测并重新转码；默认无录屏CI仍无驱动延迟。不把录屏时长或该间隔当响应性能测量。原快录像仍留本地，最终manifest指向复测会话。
4. 官方品牌浏览器采用Linux headless方式，不能交付“真人手动/实体Windows”结论；代理走查/截图/视频为本轮实际可复现工程证据，已在合同与材料说明。校内/科学/教学输入未到时正常保留待补，准备稿本身可验收。
5. 历史文档准备候选编号010仍Proposed；本次014只执行新授权2/3/4，不追认为原候选中的对外沟通或完整旧演示已完成。

## 数据、许可与审核门

research_evaluation仍为历史研究候选；teaching_case_review仍22/22 pending_teacher_review，human_reviewed=false；public_teaching_release=not_started，public_release=false。真实观测仍空、quantitative_result=null。没有修改受保护科学文件、补造文献数值/课程成绩/教师签字。浏览器发行包保留其厂商许可，仅本地QA；未加入Git。第三方申报附件及源材料不公开，模型密钥不读取/输出/入包。

## 遗留风险、仓库与CI

本轮未做实体Windows/macOS/手机、Safari/Firefox、带宽/负载/排队/长稳或真实主机重启；未做老师/成员真人签收、完整课程/正式评分、资质或公众服务验收。技术稿后续需同事的案例/教学/文献输入及两位老师负责的校内依据。原LAN/systemd/模型配置没有调整。

提交及同步在全部本地核验后普通执行；不force push、不推旧研究归档分支。当前GitHub CI沿用TASK-013的三平台公开检查/默认浏览器流程，不能冒充本轮品牌包QA的另一份独立人审证据。

## 建议的下一TASK

不自动启动。材料收到后按H编号接收并核对差异，再按新的批准范围接入科学/教学内容；待老师提供校内结论后更新正式字段。当前准备完成不替代上述实际输入。
