# REPORT-016：三文献SI查证与附件入库

## 对应任务
[TASK-016](../tasks/TASK-016-supplement-reconciliation.md)，human_direct，Completed（SI来源/材料核对和现行内容更新）；main / c90e0f7de2588d56fae4c3d23840323586afedbe，结果提交pending。保留TASK-015未提交改动，无新commit/push。

## 改动文件与职责
| 工件 | 实际职责/变化 |
| --- | --- |
| data/raw/literature/supplementary/02_MicrobCellFact2024_Supplementary_Material_1.docx | 新增本地原字节SI，不纳Git |
| metadata/literature_supplements.json | 三篇SI状态/查证范围，Niu SI子来源/父DOI/原件路径/SHA/七项定位唯一登记 |
| data/registries/publication_sources.csv | 仅Niu行更新SI已见和余下定量链限制；其他行保持本次基线 |
| docs/p10ns/261019/handoff_acceptance.md、data_gap_list.md、shenbaoshu_sections_LJX.md；docs/cases/isoquercitrin/README.md | 关闭SI原件缺件，补三篇查证/七项材料，保留条件冲突、标准曲线/原始测量及教师准入 |
| frontend/student/content/demo-content.json | R1/R2无公开SI说明、R3已到/已核SI及生物量/菌株标签限制；无JS/CSS逻辑变更 |
| TASK/REPORT-016及索引、ARCHITECTURE、STATE、PROGRESS、README/docs/README | 定约、职责、验收与当前状态；015合同/报告及temp/task-015证据未改 |
| temp/task-016/ | 本地保护SHA、出版社HTML/Europe PMC JSON、原件/官方比对、DOCX文本/图像/表、QA及验证；不入Git |

## 实际操作与观察
1. 所有者补交的DOCX为1915426字节，SHA-256为01f86b05cbe0cbabb76a607df09c0f186a635f3f598b9661223a9ce431563ed8。附件、本地副本与[出版社SI下载文件](https://media.springernature.com/original/springer-static/esm/art%3A10.1186%2Fs12934-024-02390-5/MediaObjects/12934_2024_2390_MOESM1_ESM.docx)字节相同。ZIP CRC通过，标题/作者与父论文对应；附件仅作证据资料读取，未执行文档中的内容。
2. 复核[Zhang出版社页](https://link.springer.com/article/10.1007/s10529-015-1792-6)、[Niu出版社页](https://link.springer.com/article/10.1186/s12934-024-02390-5)、[Pei出版社页](https://link.springer.com/article/10.1007/s10600-019-02712-9)及本地正文。只有Niu页面列1个MOESM DOCX；另两页无SI下载链接/区块，正文无补充材料编号或声明。Zhang正文规范空白后检出4处data not shown，不能据此制造SI或推称全部原始数据已发表。
3. Europe PMC DOI精确匹配：Zhang PMID25724715 hasSuppl=N；Niu PMID38641799/PMC11031953 hasSuppl=Y；Pei查询未返回对应记录，保留null，不填N。请求URL和原始响应在source-check.json及各europepmc.json；公开元数据保存可复查URL。结论限当前已核公开来源，无SI不是原始实验数据不存在的证据。
4. SI七项均有标题和对应材料；四张TIFF提取为PNG仅供本地查看，未改原件；三表共2/75/109行（含表头/类别行，不等于1/74/108独立实验）。七项与正文关联如下。

| SI定位 | 核对结果 | 正文/教学支持与局限 |
| --- | --- | --- |
| Fig. S1 | PCR验证图，已查看 | 基因操作方法的构建佐证，不是产物定量数据 |
| Fig. S2 | HPLC及负离子MS/MS、MS1图，已查看 | 目标/降解物/底物信号讨论；未知信号不等于完整结构确证 |
| Fig. S3 | 工程菌代谢物HPLC图，已查看 | 对应降解消除结果；图像不等于原始信号/积分表 |
| Fig. S4 | 工程菌生物量图，已查看 | 含报告的生物量汇总值，不能笼统称SI无定量信息；没有逐重复点表 |
| Table S1 | UGT78D2序列表存在 | 对应菌株/试剂方法；未逐碱基科学核查 |
| Table S2 | 菌株/质粒表存在 | 对应菌株方法；BS215标签重复，后一行描述UGT78D2表达，保留歧义不改为BS215G |
| Table S3 | 引物表存在 | 对应菌株构建方法；未逐碱基科学核查 |

5. DOCX文本/表及四幅图中未见本项目所需的标准曲线、原始峰面积、稀释链或逐重复数值表；有汇总图不等于原始数据齐全。此前原摘录“SI无额外定量结果”的笼统说法不进入现行说明，原交接字节仍保留。
6. SI作为Niu的子来源独立登记，不是第四篇研究。旧source_registry的123登记、研究包117＋4范围、metadata/public_sources.json三个PDF例外全部不改。public运行/测试不加载SI，成员无需取得附件即可开发。

## 验证
| AC / 方法 | 分母、结果及证据 | 局限 |
| --- | --- | --- |
| AC1 原件/父源/保护 | 附件、本地、官方三方SHA/字节匹配；ZIP完整；196/196原保护文件不变 | baseline.json、official-comparison.json、si-audit.json、verification.json；仅新增SI，旧科学/研究资产不改 |
| AC2 三篇/七项 | 3/3来源有当前依据与范围，7/7材料关联；4/4图查看、3/3表解析 | source-check.json、main-pdf-check.json、si-audit.json及本文；无图数字化或全谱系/逐序列验证 |
| AC3 现行同步 | H01、缺口/案例/技术底稿/前端均关闭SI原件缺件；旧015历史与原derived不改 | 当前diff；原始定量链、条件冲突、标签歧义、人审门仍保留 |
| AC4 默认工程检查 | python scripts/dev.py check：Python46项中43通过/3研究skip，JS9/9 | check-public.log；没有引入SI/研究池日常依赖；本轮未重复research全量检查 |
| AC4 浏览器 | Chrome155.0.8059.84，三路线×1536/375两视口共26/26检查通过 | browser-results.json；身份/非空、对应来源、SI状态更新、无横向溢出/无新样品；正常控制台错误/外部请求0 |
| AC4 公开/链接/元数据 | 新DOCX被Git忽略且未跟踪；父DOI/路径/SHA/七项定位、22/22工作树改动公开路径/内容、112/112相对链接及diff检查通过 | verification.json；只查当前工作树，未创建提交/推送/远端CI |

浏览器使用上一轮已说明的前端验证流程：Browser plugin not available，沿用项目内Playwright/Chrome，无新依赖。隔离无密钥服务http://127.0.0.1:8876/，测试后关闭；8766常驻服务不变。截图temp/task-016/browser-1536-R3.png、browser-375-R3.png。只有JSON文字变化，本轮做针对性渲染/状态检查，未冒充重复完成完整102项六阶段验收或实时AI测试。

默认检查命令为python scripts/dev.py check；来源复核、DOCX解析与浏览器脚本分别保存在temp/task-016/check_sources.py、update_content.py及browser-check.mjs，复核结果以对应JSON固定。SI原件与抽出材料仅本地保留。

## 与任务合同的偏差
无实质范围偏差。出版社HTTP最终URL带cookies_not_supported查询参数，但返回了完整目标文章页；已核对文章身份和SI区块/链接，并交叉检查web读取结果/本地正文，未将登录空页当作无SI证据。首次文档补丁因整行不匹配未应用，改为精确替换后验证；无工程测试失败。

## 数据、许可与审核门
research_evaluation为agent_checked_candidate的来源/材料核对，不是独立化学实验验证；teaching_case_review仍22/22待审、教师批准0；public_teaching_release仍not_started。human_reviewed=false，decision_origin=agent_task_audit，observations=[]、quantitative_result=null、teacher_approved=false。正文CC BY声明不等于本次自动授权公开所有新载荷；附件/四图/序列/引物不入Git或网页。

## 已发现但未改的问题
Pei配比摘录遗漏、Zhang条件/动力学原文冲突、标准曲线/峰面积/稀释/逐重复数据、完整身份与教师支持域、LYW正式24步与量规仍未解决。SI自身BS215标签歧义保留。原HYK摘录及015报告保存当时的证据/缺件，不静默改成已经核读SI。

## 遗留风险、仓库与CI
015/016改动均在main工作树，未提交/推送/远端CI。196份原保护文件与新SI均核对原SHA；新SI不在既有研究包中，未来交接须按实际权限另行处理。未测试Edge/其它实体设备、真实AI、并发或公众教学服务；原LAN静态content JSON已只读取回并与工作树SHA匹配，刷新页面即可看到新说明；未重启服务。

## 建议的下一TASK
待同事/教师给出案例、条件冲突处理与步骤量规后再决定数据子集和24步实施；本轮未自动启动后续任务。
