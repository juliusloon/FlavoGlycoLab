# 学生网站局域网运行说明

截至2026-10-19，TASK-012已将原LAN骨架升级为交互实验台与同源Qwen辅导服务，沿用TASK-011的systemd常驻方式；科学、教师审定及公众教学发布门不晋级。

## 访问入口

| 服务器接口 | 同一局域网/有路由权限的设备使用 |
| --- | --- |
| ens1f0，10.70.160.0/24 | [http://10.70.160.64:8766/](http://10.70.160.64:8766/) |
| ens1f1，10.70.192.0/22 | [http://10.70.194.126:8766/](http://10.70.194.126:8766/) |

两地址为本次实测网卡地址。若网卡地址改变，访问地址相应改变；服务监听0.0.0.0:8766，无需因IPv4地址变化而重新绑定。能否从某台客户端访问还取决于该客户端与服务器间的路由、校园网隔离和防火墙。当前没有其它物理客户端测试记录，不能把服务器自身的LAN地址请求称跨设备实测。

浏览器此前显示的10.197.175.10:59590不在本机接口清单，本次没有修改或依赖该入口。原127.0.0.1:8765静态预览保留，但只预览前端，不能提供导师API。请将本页的8766地址提供给局域网使用者。

## 持续运行方式

- 服务名：`flavoglycolab-lan.service`，由ljx的systemd用户管理器托管。
- 配置安装位置：`~/.config/systemd/user/flavoglycolab-lan.service`；模板由`ops/systemd/flavoglycolab-lan.service.in`唯一维护。
- 工作目录是当前项目，使用系统`/usr/bin/python3`，由`scripts/serve_lab.py`提供HTTP；静态根仅`frontend/student`，另有同源`/api/health`及`/api/tutor`。本进程无需Conda/npm/GPU或其它工作区，实时导师调用用户指定的已有私网模型服务。
- 已配置`WantedBy=default.target`、enable、`Restart=always`和3秒恢复间隔；账户现有`Linger=yes`允许退出登录后继续运行，并在系统启动时启动用户管理器。
- 已实测异常退出后的自动恢复与普通服务restart；未实际重启共享主机或退出所有登录会话。不提供主机断电、网络中断或长期可用性SLA。

## 安装、更新、状态和日志

从仓库根目录执行（以ljx身份，无需sudo）：

```bash
/usr/bin/python3 scripts/install_lan_service.py
systemctl --user status flavoglycolab-lan.service
journalctl --user -u flavoglycolab-lan.service -n 50 --no-pager
```

安装器只维护本服务：检查端口和符号链接，生成本项目绝对工作目录，校验unit，reload并enable/start；相同配置重复执行不会打断正在运行的服务。没有改全局systemd设置、网卡、路由或防火墙。不要sudo运行安装器，否则会指向另一个账户的用户服务。

本轮服务直接读取student目录。修改网页资产后刷新浏览器即可读取；部署科学内容前仍需相应任务/审核。不要把私有材料或指向仓库其它目录的符号链接放入student目录。修改Python服务代码后执行restart；修改服务模板后重新运行安装器；迁移项目路径后同样重跑，不要同时在另一个检出启动同名服务。

```bash
systemctl --user restart flavoglycolab-lan.service
```

若短期反复失败触发启动限制，先看日志并修复原因，再执行：

```bash
systemctl --user reset-failed flavoglycolab-lan.service
systemctl --user start flavoglycolab-lan.service
```

## 停止和回滚

暂时停止（下次开机会按已启用配置启动）：

```bash
systemctl --user stop flavoglycolab-lan.service
```

关闭当前服务并取消开机启动：

```bash
systemctl --user disable --now flavoglycolab-lan.service
```

如需彻底移除服务，先执行上面的disable，再仅删除本项目的配置文件并reload；不修改该账户原有Linger或其它服务：

```bash
rm "$HOME/.config/systemd/user/flavoglycolab-lan.service"
systemctl --user daemon-reload
```

## 实时导师配置与边界

唯一私有配置为项目内`data/private/runtime/tutor.json`（0600，已被Git忽略，禁止复制到student）。字段为`base_url`、`model`、`api_key`；密钥不在文档或模板中存储。当前所有者指定Qwen模型`qwen3.8-flash-next-iq3_s`，后端调用固定私网服务。浏览器只请求本站，不接收上游密钥。更换服务请编辑服务器私有配置，保留权限0600；本服务逐请求读取，不需要重启模型。

GET `/api/health`返回配置状态和模型名，不意味着已经完成一次实时推理；POST `/api/tutor`接受问题与限定实验上下文。请求体24KB、问题2000字符、最多6条对话上下文、同时2个上游请求、每来源IP每分钟12次、上游45秒超时。没有任意URL代理、文件/命令工具或公开教师接口。跨源请求拒绝，错误不返回上游原文或密钥。无数据定量问题由证据守卫直接拒绝，明确区别于实时模型回复。模型输出仍需核对，守卫不是完整科学真实性证明。

服务不持久保存学生对话正文，HTTP日志只记请求方法/路径/状态；学生方案/对话/记录保存在浏览器本地。当前无账户与跨设备同步，不用于敏感数据或正式成绩托管。页面输入发送到用户指定模型服务，服务端配置信息不会发送给模型。

静态处理拒绝目录列表、点文件、越界和指向根外的符号链接；仅允许运行资产扩展名。仓库、私有配置、PDF和来源原件均不经此服务提供。按需关闭导师可移走私有配置文件，实验台仍可运行，UI显示未配置；不需要删除前端。

## 验证边界

TASK-012的完整三路线流程、持久化、方案失效、导出、实时AI/证据拒绝、失败恢复与响应式检查见[REPORT-012](../reports/REPORT-012-interactive-workbench.md)。TASK-011原托管验证见[REPORT-011](../reports/REPORT-011-lan-deployment.md)。未进行另一物理客户端、真实主机重启、并发容量、正式认证/安全或教学效果验收。案例待审，真实观测仍为空；流程演练不产生科学测量或正式成绩。
