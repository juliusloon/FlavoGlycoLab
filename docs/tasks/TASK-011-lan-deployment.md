# TASK-011：学生网站局域网持续访问

## 合同元数据
- 状态：Completed（2026-10-19，局域网原型工程验收）。
- 基线：main，279d76bfaaff053f30e840b9e68a1938caecd28a；保留TASK-010尚未提交的全部文件及修改，具体基线见temp/task-011/baseline.json。
- 授权来源：human_direct；龙锦轩明确要求“将网站部署到局域网上，保持可以在同一局域网下访问”。此授权覆盖启动和持续托管局域网网站，不自动批准公众教学发布。
- 人工负责人：龙锦轩；执行者：Cano。
- 修改预算：新增ops/systemd/flavoglycolab-lan.service.in、scripts/install_lan_service.py、docs/operations/lan-site.md；修改frontend/student/README.md、README/ARCHITECTURE/STATE/PROGRESS、TASK/REPORT索引；本合同与同号REPORT。验证证据限temp/task-011/。
- 主机改动预算：仅安装~/.config/systemd/user/flavoglycolab-lan.service并systemctl --user enable --now；允许停止/重启本服务作验证。只用空闲TCP8766；保留现有127.0.0.1:8765预览及其他服务，不安装系统软件，不修改sudo/防火墙/网卡/路由。
- 资源/时间预算：一次局域网托管任务；标准库静态服务，无新增数据库、模型、GPU或第三方运行包，不做性能容量承诺。
- 关联ADR：0004；不更改科学政策。

## 目标
当前网站可通过服务器局域网地址访问；由后台服务持续运行，退出当前聊天/终端不依赖该进程的存活；配置开机启动和异常自动重启，并交付访问、查看状态、停止及回滚方法。

## 背景与已核实事实
- 按顺序阅读PROJECT、STATE、ARCHITECTURE及本合同；学生网站已完成TASK-010。
- 当前127.0.0.1:8765只监听回环。服务器ens1f0=10.70.160.64/24，ens1f1=10.70.194.126/22。8766无现存监听。
- systemd用户管理器可用（整体degraded不代表本服务失败），账户Linger=yes；无需root权限。
- 用户当前浏览器显示的10.197.175.10:59590不属于本机已核实网卡地址，不能据此宣称是本机LAN入口。

## 范围
### 允许项
- 将frontend/student作为唯一HTTP根，0.0.0.0:8766监听本机现有IPv4接口；当前两块上联网卡都是私网地址。
- 使用系统/usr/bin/python3和systemd用户服务；配置enable、Restart=always、RestartSec及明确的工作目录。安装器只写本服务配置，不改其它单元或全局用户设置。
- 通过本机两个LAN地址实际请求首页及全部运行资产；验证六路由及运行关键分支、私有/仓库路径拒绝、后台状态、异常重启与普通重启。
- 保留“无对应实验数据”和“交互示例，未连接实时大模型”；网页科学内容及所有冻结来源字节保持不变。
### 禁止项
- 不开放仓库根目录、raw/derived/private、.git、注册表或申报附件；不复制第三方原件。
- 不改前端业务逻辑/科学内容，不新增账号、模型、评分或真实数据接口。
- 不设置公网域名、端口映射、TLS、隧道或反向代理，不变更已有转发端口；不声称公众教学发布、安全/容量/iLab验收。
- 不Git提交/push，不自动实施历史完整本地演示提案。
### 涉及目录及文件职责
| 职责 | 工件 | 改动 |
| --- | --- | --- |
| 服务配置 | ops/systemd/flavoglycolab-lan.service.in | 配置模板；安装器仅填本项目工作目录 |
| 安装 | scripts/install_lan_service.py | 幂等安装、reload、enable及启动/重启 |
| 运维入口 | docs/operations/lan-site.md | 唯一LAN地址、启停、日志、更新及回滚说明 |
| 当前事实 | STATE/ARCHITECTURE/PROGRESS及README | 区分局域网原型托管与公众教学发布 |
| 验收 | 同号REPORT、temp/task-011/ | 实际URL、分母、状态及验证限制 |

## 非目标
公众教学上线、长期可用性SLA、真实设备兼容、教师审批、校级等保/联网认证、容量压测和完整教学功能。

## 必须执行的操作
1. 核对接口、端口、systemd/Linger和资产边界，记录受保护文件指纹。
2. 安装仅属于本项目的用户服务，启动并验证LAN HTTP。
3. 验证六路由及资产、后台状态、异常/手动重启、路径隔离；如无其它真实客户端，不将服务器自身LAN地址请求声称跨设备实测。
4. 生成报告，更新唯一运维说明和STATE/PROGRESS/ARCHITECTURE。

## 验收标准
- [x] AC1：两块已核实LAN地址的8766首页和运行资产均返回200，首页字节与student/index.html相同。
- [x] AC2：服务active/enabled、Linger=yes，ExecStart/工作目录/监听端口正确，脱离聊天命令会话托管。
- [x] AC3：主动终止本服务主进程后systemd自动恢复（PID改变、重启计数增加、HTTP恢复）；手动restart后同样可访问。不执行真实主机重启，开机启动只能按配置验证。
- [x] AC4：新LAN入口完整运行六路由和关键缺数据/AI/步骤行为；仓库、私有与越界路径均不可读，页面无外部请求或项目错误。
- [x] AC5：已有前端/来源/证据等受保护文件字节不变，治理测试通过，报告与状态记录真实访问范围/未测事项，提供停止和回滚命令。

## 验证
systemctl --user is-active/is-enabled/show、loginctl Linger、ss监听；禁用代理的urllib/curl LAN请求；复用TASK-010浏览器守卫检查实际LAN URL；治理8项、受保护文件SHA及git diff --check。实际结果写REPORT。

## 停止条件
端口被占用、现有服务归属不明、需要root/全局防火墙或网卡变更时停止对应操作并报告；来源/科学内容变化时停止。网络隔离导致其它设备无法访问时明确区分主机配置与跨设备可达性，不虚报结果。

## 报告要求
生成REPORT-011-lan-deployment.md；记录实际服务状态、地址、重启/HTTP/浏览器分母、失败、跨设备/开机实测限制、文件保护、未提交及三个状态门。不得启动下一TASK。
