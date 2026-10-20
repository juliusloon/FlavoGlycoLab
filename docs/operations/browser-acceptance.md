# Chrome与Edge原型走查及录像

TASK-014，2026-10-20。实际品牌流程和LAN实时AI检查已通过，录像保存为WebM及MP4。执行者Cano，代理逐步操作，human_reviewed=false；不冒充成员/老师真人签收、实体Windows或移动设备、完整24步课程验收。

测试流：案例路线→材料装配→方案/对照→操作/样品标签→缺数据检查→反思→保存/刷新/快照比较/导出；同时检查错误输入、上游失效、未配置AI与错误恢复。

## 环境与浏览器身份

本机Ubuntu24.04.4 LTS x86_64；Playwright1.64.1。Browser plugin not available，使用现有Playwright驱动实际品牌可执行文件。

- Chrome来自[Google官方页面](https://www.google.com/chrome/)对应的Linux stable包，版本Google Chrome155.0.8059.84。
- Edge来自[Microsoft官方页面](https://www.microsoft.com/en-us/edge/download)与官方packages.microsoft.com/repos/edge stable仓库，版本Microsoft Edge155.0.4283.62；官方仓库索引SHA实际核对。
- 只解压到本项目temp/task-014/browsers，没有系统安装或替换既有浏览器。两个包的URL、大小、SHA、版本stdout/stderr和可执行文件位置见本地browser-packages.json。版本是本次实际下载/执行结果，不保证未来仍为最新。
- 无密钥副本仅复制本项目运行资产、源码和三个已公开PDF，使用127.0.0.1:18768；不复制private或全量研究池。现有LAN服务8766不变。

## 实际结果

| 品牌与版本 | 无密钥独立运行 | 原LAN真实AI | 正常路径页面/控制台错误、页面外部请求 |
| --- | --- | --- | --- |
| Google Chrome155.0.8059.84 | 87/87通过 | 8/8通过 | 各0 |
| Microsoft Edge155.0.4283.62 | 87/87通过 | 8/8通过 | 各0 |

每品牌覆盖1536×1024/R1、768×1024/R3、375×812/R2；87项是既有84项加三个实际UA身份核验。各有三段完整过程录像，桌面为酶促路线、平板为工程菌、手机为选择性水解。记录阶段的刷新/保存/上游修改失效/取消重置/保留历史/比较/JSON导出均实际操作。3个视口是工程模拟，不能写成3台实体客户端。

LAN检查使用http://127.0.0.1:8766/现有服务：两品牌各一次真正上游回复mode=model、一次无数据定量请求mode=evidence_guard；学生方案未被AI改写，正常页面无控制台错误或外部请求。两次真实上游调用和两次直接守卫是本轮小样QA事实，不等于已实现全平台ai_data汇总。没有读取或输出密钥，不变更LAN/模型配置。

| QA项目 | 结果与证据 |
| --- | --- |
| 页面身份/非空 | 正确标题、两主入口和实际装配/分析/记录界面；results.json含UA/URL/title |
| 无错误覆盖层/控制台 | 正常路径错误0；模拟模型失败和内容503是独立fixture，不混入正常错误分母 |
| 操作反馈 | 错材料和非法时点阻断；无观测保持null；保存/恢复/导出/重置与比较状态正确 |
| 响应式 | 三视口无横向溢出；手机导师抽屉与Escape返回可用 |
| 截图复核 | 同轮查看Chrome1536-records与Edge375-analysis，记录/缺数据展示清楚；非视觉重设计 |
| 录像 | 两品牌分别三条路线的原始WebM、逐路线MP4与拼接总览；真实AI另各一段WebM/MP4。录像为代理逐步操作，不冒充真人签收或申报成片 |

本地证据根temp/task-014：chrome/results.json、edge/results.json、chrome-live/results.json、edge-live/results.json；各目录PNG；chrome-walkthrough.mp4、edge-walkthrough.mp4、chrome-live-ai.mp4、edge-live-ai.mp4。逐片文件名、SHA、时长/分辨率/帧率由video-manifest.json及live-video-manifest.json记录；原件保留，不将录像/浏览器包上传公共Git。

首轮录屏遇到Playwright专用ffmpeg缺失，随后在本项目pw-runtime补齐；另一次隔离预览随父shell退出导致连接拒绝，已用持续exec会话承载并复测。错误日志保留在初始*-initial-*文件，不计为产品流程失败。为便于逐帧审阅，录屏模式默认每次驱动操作留120ms间隔，可用QA_SLOW_MO_MS调整；不把该延时视为产品性能测量。

## 复现

先运行本机不含模型私有配置的检出：

```bash
python scripts/dev.py --port 8767
```

另一个终端安装QA依赖后，为每个品牌分别指定实际安装或解压的可执行文件：

```bash
npm ci
npx playwright install ffmpeg
```

设置以下环境变量后运行`npm run test:browser`（按自己终端的环境变量语法填写）：

| 变量 | 值/用途 |
| --- | --- |
| CHROMIUM_EXECUTABLE | 本机实际Chrome或Edge可执行文件；不硬编码他人home |
| BROWSER_LABEL | Chrome或Edge，保存品牌并核验对应UA |
| FRONTEND_URL | http://127.0.0.1:8767/ |
| QA_RECORD_VIDEO | 1，逐视口生成WebM录像 |
| QA_SLOW_MO_MS | 录屏默认120，非录屏默认0；驱动间隔不是界面响应实测 |
| QA_OUTPUT | 本项目temp下的新目录，如temp/qa/chrome |
| FLAVOGLYCOLAB_LIVE_AI | 默认不设置：无密钥模式；1为明确的真实模型测试，须配置可达服务 |

Linux本轮使用已有PLAYWRIGHT_MODULE指向本项目先前的QA依赖；其它成员按npm ci使用锁定版本即可。录像在context关闭后落盘。需要MP4时可对原始WebM运行ffmpeg，保留原件与转码参数/SHA。

## 未覆盖范围

没有实体手机/平板/Windows桌面用户走查、Safari/Firefox、并发/队列/带宽/长稳、完整课程与正式成绩验收。无配置模式/模拟模型错误的fixture只用于验证界面分支，不当作真实模型推理。以最终报告中的实际成功/失败分母为准。
