# 数据、证据和发布治理

## 四层来源
1. 受控原始来源data/raw：实存122/登记123，按来源SHA核对；第三方论文、商业来源与模型各保留授权状态，不入Git。
2. 候选派生层data/derived/v3：3059条历史研究候选；每条保留结构、反应角色、结果来源与质量限制，不自动升级为教学数据。
3. 教学候选层data/private/review_candidates + case_admission：22条均待专业教师核实结构/条件/方向/作者、实验测量、重复与许可。
4. 经教师批准的教学/仿真层：当前不存在。未来须以独立版本manifest、审定日志、QA和受限可公开字段生成。

## 科学语义
必须区分quercetin、rutin、isoquercitrin与其它糖苷，核对连接位点及立体化学。结构产品匹配只是候选链接，不能证明为同一实验或同一酶催化。原始产率必须带基准、单位、方法、测量误差与来源；不得将missing、0、predicted、human_approved混为同一标签。

## 三个独立门
research_evaluation：质量、化学模型与来源身份判断；teaching_case_review：具名专业教师逐证据批注与签署；public_teaching_release：许可、隐私/权限、安全、iLab平台与传输权利独立验收。Agent不能代签专业或法律事实。

## 可发布范围
代码/本项目原创文档按各自声明许可证；受限原件、SciFinder、第三方模型权重不因持有本地副本而可公开。发布包默认不包含data/raw、data/derived、data/private和参考快照。必须有专项发布审批。

## 校验
本地data/registries/source_registry.csv和metadata/active.json是权威数据入口。migrations仅提供历史复制审计，不作为运行时外部根。数据哈希出现冲突时fail closed。

## TASK-008公开范围例外（2026-10-18）

所有者明确指令“三篇PDF也要公开”。`data/raw/literature/`中的三个已提交PDF按`PUBLIC_PDFS`（`scripts/export_public_repository.py`）登记的精确路径及SHA公开；其余raw/derived/private仍不公开。这是human_direct范围决定，出版方rights_verified=false，不追认为教师审定或全数据授权，PDF不适用本项目原创代码/文档许可。原件不改，原案例表仍脱敏。
