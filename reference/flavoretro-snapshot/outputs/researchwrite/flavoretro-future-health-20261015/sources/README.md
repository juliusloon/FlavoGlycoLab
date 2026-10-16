# 来源索引与核验范围

核验日期：2026-10-15。采用目标检索与当前源码静态审计，非系统综述、非程序运行验证。以下官方正文已通过公开链接只读获得，未登录或提交业务接口。

|ID|来源|定位/已取得内容|证据限制|
|---|---|---|---|
|P1|https://shenbao.ilab-x.com/file?id=123129|官方2026年十月版申报书DOCX；SHA256 8bf711df68db7825cea1d91ba5e0d48033ad8bd389539a052e02c1bf8c2b8ea6|采用现行官方版，非高校旧九月版|
|P2|https://shenbao.ilab-x.com/file?id=123105|官方申报书PDF；SHA256 ba755a0b41aa82108f3ac6d587ceaa725cfa8e26a7bc81d9255acc6b2d2d9bbb|18印刷页；7页20步骤，10–12页技术/等保，14–15页五年，18页证明|
|P3|https://shenbao.ilab-x.com/file?id=123106|官方征集说明PDF；SHA256 025579ebe96f8c3eb00392d5250a6f51765db9a2e2fb1a096f3196dd56becbd1|4页全文；并非学校校内细则|
|P4|https://shenbao.ilab-x.com/declare/wiki/v2#1-3|官方2026接口说明|网页动态渲染，正文由公开JS取得|
|P4a|https://shenbao.ilab-x.com/js/wiki_v2.js|2026 ai_data、2022接口继承、结果步骤、联调流程|没有调用业务接口；实际密钥及验收未取得|
|P5|https://aao.nuaa.edu.cn/_t2299/2026/1010/c8222a414437/page.htm|2026-10-10转发通知，含国家原件|校内要求不迁移到浙大；附件申报书是旧九月版|
|Z1|https://ilab.zju.edu.cn/|浙江大学虚拟仿真实验共享平台|存在不等于已接入或等保覆盖|
|Z2|https://ai.zju.edu.cn/2026/0112/c89504a3127572/page.htm|AI STEP与智海/浙大先生；正文时间2025-03-06，事件2025-03-01|网址带2026不等于事件发生于2026|
|Z3|https://zjubiolab.zju.edu.cn/page/course/detail/154/2359|2024-02-28合成生物学课程介绍|校内教学资源线索，不是合作承诺|
|Z4|https://ugrs.zju.edu.cn/2025/0319/c80787a3028799/page.htm|2025 X+AI改革通知|只说明历史校内建设路径，不能代替2026本轮通知|
|L1|https://link.springer.com/article/10.1007/s10600-019-02712-9|Pei et al.2019，UGT/蔗糖合酶协同糖基化|仅摘要核查；不能当全量条件数据|
|L2|https://pubmed.ncbi.nlm.nih.gov/25724715/|Zhang et al.2015，DOI10.1007/s10529-015-1792-6，芦丁水解|摘要/原始研究身份；未注册教学模型|
|L3|https://link.springer.com/article/10.1186/s12934-024-02390-5|Niu et al.2024，枯草芽孢杆菌异槲皮苷生物转化，开放全文|外加槲皮素；非葡萄糖全合成，外部数据非本项目实验|
|L4|https://www.nature.com/articles/s41589-018-0154-9|Yang et al.2018，GT活性预测原始研究|仅支持酶候选AI方向，不授予本项目泛化资格|
|L5|https://www.nature.com/articles/s41467-025-61530-6|Sirirungruang et al.2025，高通量GT谱；子代理核查开放全文|root直接抓取跳转失败，由子代理取得；初筛限制必须保留|
|L6|https://www.nature.com/articles/nbt.2955|Bonde et al.2014，虚拟生技实验教育原始研究|可借鉴教学设计；不能转用其效果为本项目成效|

完整政策正文提取证据：operations/command-6225.log、6239.log、6243.log、6250.log、6251.log；本调研来源留档复制这些已取得正文，不再下载原件，不将外部科学材料加入任何TASK-017研究库。

当前项目依据：PROJECT.md、STATE.md、ARCHITECTURE.md、docs/FOUNDATION_CAPABILITIES.md、docs/WORKBENCH_ROADMAP.md、docs/tasks/TASK-017-independent-c-ss-transfer-benchmark.md、flavoretro/{contracts,service,worker,web}.py、web/app.js、metadata/{sources,release}.json、LICENSES/README.md、configs/literature_teaching_layer.json。代码与运行时仅静态核查，不以历史测试通过推导现时公网就绪。

未取得：教育部门户本次原文网页；浙江大学本轮校内通知/截止日期；真实实验合作/数据授权；平台实际密钥/正式联调/等保适用证明。
