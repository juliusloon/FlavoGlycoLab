# REPORT-011：学生网站局域网持续访问

## 对应任务
- TASK：[TASK-011-lan-deployment.md](../tasks/TASK-011-lan-deployment.md)
- 状态：Completed（局域网原型工程验收）。
- 日期：2026-10-19；授权来源：human_direct，用户明确要求“将网站部署到局域网上，保持可以在同一局域网下访问”。
- 基线：main，279d76bfaaff053f30e840b9e68a1938caecd28a；保留TASK-010未提交改动，原始工作树状态与117项保护SHA见temp/task-011/baseline.json。
- 结果提交：pending；未Git提交、push或CI。执行者Cano；human_reviewed=false，不代表教师审定。

## 改动文件与职责

| 文件/位置 | 实际改动 |
| --- | --- |
| ops/systemd/flavoglycolab-lan.service.in | 项目自己的用户服务模板，0.0.0.0:8766、student资产根、Restart=always/3秒、default.target启动 |
| scripts/install_lan_service.py | 检查资产符号链接、端口和单元归属；生成工作目录、校验unit、幂等安装/reload/enable/start；配置改变才重启活动服务 |
| ~/.config/systemd/user/flavoglycolab-lan.service | 本轮在当前账户安装的后台服务配置；不是仓库文件 |
| docs/operations/lan-site.md | 唯一LAN运行说明：地址、状态、启停、更新、日志、恢复及回滚 |
| README、frontend/student/README、STATE/PROGRESS/ARCHITECTURE及任务/报告索引 | 更新LAN托管事实与阅读入口；不改网页业务逻辑/内容 |
| temp/task-011/ | 本次HTTP、重启、浏览器、保护字节和治理证据，ignored |

## 实际操作与观察

服务由ljx的systemd用户管理器运行，使用系统Python3.12.3标准库，不依赖聊天进程、Conda、npm或其他工作区。仅服务frontend/student，保留原127.0.0.1:8765预览及其他端口。原有账户Linger=yes，未改变该全局设置；已enable当前用户的default.target启动链接。

本机接口实测为ens1f0=10.70.160.64/24、ens1f1=10.70.194.126/22，服务实际监听0.0.0.0:8766。入口为：

- 主入口：[http://10.70.160.64:8766/](http://10.70.160.64:8766/)
- 另一接口：[http://10.70.194.126:8766/](http://10.70.194.126:8766/)

两者经服务器自身的LAN地址请求验证。用户浏览器中10.197.175.10:59590不是已核实的本机接口，本轮未修改或依赖该转发。UFW单元显示active，但其配置ENABLED=no；本轮未修改任何防火墙，不能因此宣称已全面审计网络规则或其它客户端路由。

## 验证

| AC/方法 | 分母、结果、证据和限制 |
| --- | --- |
| AC1：禁用代理的HTTP资产比对 | 10个HTML/CSS/JS/JSON运行资产×2接口＝20/20均HTTP200且与student原字节一致；temp/task-011/http-checks.json |
| AC2：systemd、监听和账户 | active/running、enabled、Restart=always、正确工作目录和ExecStart；0.0.0.0:8766已监听；Linger=yes。后台由用户管理器托管，不是本次shell子进程 |
| AC3：自动恢复 | 对本服务主进程发SIGTERM，PID改变、NRestarts由0升至1、HTTP恢复；temp/task-011/restart-checks.json。普通restart后PID再改变且HTTP恢复；重复安装配置不变时PID不变。只验证配置开机启动，未重启共享主机或退出全部登录会话 |
| AC4：浏览器 | 主LAN入口复用原守卫53/53通过，1505/768/375像素、6路由、24步选择、AI三脚本、无数据、来源与键盘；Chromium153.0.8010.12，外部请求0、项目控制台错误0；temp/task-011/browser/results.json |
| AC4：目录隔离 | 每接口5个仓库/私有/越界路径均404，共10/10；浏览器另验5路径。安装前student无符号链接；不宣称未来放入私有文件/链接后仍可安全托管 |
| AC5：保护与治理 | 117/117已有文件原字节不变（含前端业务/内容、TASK-010合同/报告、原件和注册表；排除明确可修改治理/运行说明）；治理8/8；安装器py_compile通过；证据：temp/task-011/integrity.json、governance.log |

Browser插件未提供，沿用Playwright验证。没有修改受保护的tests/test_frontend_scaffold.mjs；在temp/task-011/run_browser.mjs中只将其输出目录改至本轮目录并提供LAN URL，保护TASK-010历史证据。网页视觉未改变，不新增设计概念/截图资产。

## 与任务合同的偏差

范围无扩张。首次服务配置将WorkingDirectory路径包在双引号中，systemd按字面解析为非绝对路径而拒绝启动；去掉引号后启动成功，并为安装器增加systemd-analyze verify。首次失败写入本机journal，未擦除。后续网络/重启/浏览器验证完整通过。

## 数据、许可与审核门

- research_evaluation：历史候选状态不变，无新科学验证。
- teaching_case_review：22条pending_teacher_review，批准仍0。
- public_teaching_release：not_started；public_release=false。本轮是明确授权的局域网原型托管，不是公众教学发布或校级验收。
- 网页内容/原件/注册表不变，不包含PDF、私有证据、用户成绩或真实模型请求。

## 已发现但未改的问题

未取得其它物理设备的跨设备访问记录；客户端路由、校园网/无线隔离仍影响该设备访问。未做真实主机重启、Chrome/Edge兼容、容量/安全/等保/iLab测试。没有公网域名、TLS、隧道或端口映射改动。只保证已核实的服务配置和当前HTTP状态，不提供长期SLA。

## 遗留风险、仓库与CI

应用运行与服务均为当前项目及当前账户配置。以后变更网卡地址需更新给使用者的URL；移动项目需重跑安装器。停止/取消自启/删除服务的准确命令见运行说明。保留当前未提交工作树，本轮没有提交、push或CI。

## 建议的下一TASK

无自动后续任务。教学内容、真实交互和公众服务仍按单独授权与审定推进。
