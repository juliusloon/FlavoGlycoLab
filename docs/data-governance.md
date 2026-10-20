# 数据、证据与协作规范

现行版本：2026-10-20，TASK-013 / ADR 0006。此前规定中“默认运行和默认全量测试需要私有研究池”的依赖已替代；历史TASK/REPORT保留当时事实。

## 运行配置与交付

| 配置/层 | 唯一入口 | 交付与约束 |
| --- | --- | --- |
| public（默认） | metadata/active.json的public配置；case_admission.csv、source_registry.csv与metadata/public_sources.json | 随Git完整提供开发所需代码、22条真实待审索引与三个指定PDF；record_count=null，不冒充全量研究数据 |
| research（显式可选） | active.json的research配置；原件source_registry.csv；派生metadata/research_bundle.json | 本项目data/raw/legacy与data/derived/v3；117项现存证据＋4项派生文件离线包，不公开上传 |
| 历史旧模型 | source_registry.csv中external_model角色5项 | 保留来源登记与原件，非运行/研究包依赖；如已存在仍核对SHA，缺失明确列optional_absent |
| 私有审核/服务 | data/private/ | 待审材料、凭据/历史保全；不进Git、运行资产或研究包 |
| 审定教学观测 | 当前不存在 | 将来独立版本manifest、具名教师记录及专项准入，不能由工程包自动产生 |

公开模式不寻找、下载或自动回退到私有资产，不依赖所有者服务器/别的工作区。显式research缺失必须报取得/导入指引；损坏必须失败。单个.DS_Store缺失继续单独标记，不构造虚假原件。研究包导入后的预期为117现存证据、5项可选旧模型缺失、1项OS元数据历史缺失；原本地工作区仍可有122项原件。

## 原件与派生记录

原始字节只读，登记source_id/原定位/SHA/质量/许可/教师状态。纠错写新版本及证据，不覆盖原件。v3的3059条候选保留原SHA；每条结构、角色、结果、决策和来源不因交付方式改变。现有22条案例均pending_teacher_review，0批准。公开表11项withheld_unlicensed、10项missing不改。

metadata/public_sources.json唯一维护TASK-008三篇公开PDF路径/SHA；export_public_repository.py的PUBLIC_PDFS兼容加载该清单，不再重复写三份指纹。metadata/research_bundle.json只登记四项v3派生字节；原件指纹仍以source_registry.csv为唯一真值。migrations保存历史复制证据，不是运行时外部根。

## 研究交接

scripts/research_bundle.py仅打包登记的117项现存非模型原件与4项v3派生文件，排除private、密钥、Git历史、模型及未知载荷。整包SHA由提供方另行交付；接收方核验本地登记的清单/大小/SHA，拒绝路径越界、符号链接、重复、缺失、额外文件与覆盖冲突。所有预检通过后才写入，已有相同字节可重复导入，不覆盖不同版本。

生成包不等于已经向成员发送，也不等于持权方允许再分发。团队使用获准的私有交接方式，按实际具备的使用权限接收；不能上传公共GitHub/Release/网页。工具不申请服务器账号或自动联网传输；日常开发不以取得研究包为前置。步骤与报错见docs/operations/collaboration.md唯一维护。

## 科学语义与审核门

区分quercetin、rutin、isoquercitrin及其它糖苷，核对连接位点/立体化学。产品结构命中只证明候选链接，不证明同一实验/同一酶催化。产率必须带基准、单位、方法、误差与来源；missing、0、predicted、机器检查、教师批准和实际观测不能互换。

research_evaluation仍是历史候选与计算证据，不代表独立化学验证；teaching_case_review必须有具名教师审定；public_teaching_release另验许可、权限/安全和平台。Agent不得代签，工程测试不推进这些状态门。无观测时结果null，不用演示数字替代。

## Git、服务与许可

原创代码/文档按项目声明许可。data/raw、data/derived、data/private默认不入Git；TASK-008已公开的三个精确PDF按新清单保留，其出版方rights_verified=false，不适用原创代码/文档许可。其余第三方原件、商业数据库、模型权重不因本地副本或研究包而可公开。

前端只含原创非数值内容、指纹与用户方案，不读取受限数据。serve_lab.py只提供student运行资产与限定API，禁止用仓库根通用静态服务交付。模型凭据仅服务器/各成员本机private文件；学生输入通过主动辅导请求发往所配置服务。测试fixture、真实模型回复与证据守卫必须分别标记。

默认测试在干净public克隆运行，三项研究资产检查显式skip且报原因；选择research时缺失/损坏即失败，不按文件是否存在偷偷跳过。真实原件保护与完整研究核验另行记录实际分母。
