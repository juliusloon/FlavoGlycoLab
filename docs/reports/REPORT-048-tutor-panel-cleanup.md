# REPORT-048：AI实验导师浮窗精简

## 对应任务
- TASK文件：docs/tasks/TASK-048-tutor-panel-cleanup.md
- 状态：Completed
- 基线提交与分支：main / 92fe3f8，保留既有未提交改动。
- 结果提交：pending；未提交/push。
- 授权来源：human_direct，2026-10-25用户三项导师浮窗调整要求。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 导师浮窗 | frontend/student/index.html | 删除固定演示角标节点 |
| 状态与事件编排 | frontend/student/app.js | 配置成功仅显示“Qwen · 实时辅导”；当前阶段/主线为独立按钮，阅读上下文单列；点击收起导师、返回当前阶段或聚焦当前任务，不重建当前任务 |
| 浮窗样式 | frontend/student/styles.css | 按钮背景/边框/键盘焦点，删除闲置角标样式和提示区border-top；桌面导师z-index由20改21，避免笔记本入口覆盖发送按钮 |
| 使用说明 | frontend/student/README.md | 同步导师文案与按钮行为 |
| 已有浏览器守卫 | tests/test_data_page_browser.mjs | 替换被本轮明确撤销的旧角标/长状态断言 |
| 合同与事实 | TASK/REPORT-048、STATE.md、PROGRESS.md | 本轮范围、验收及当前状态，不代签TASK-047 |

## 实际操作与观察
已保存7项界面/文档基线和261项保护资产SHA于/tmp/flavoglycolab-task-048/。仅导师浮窗删除两处指定说明，保留未配置/故障反馈。当前任务按钮显示“当前：案例与路线 · 主线 01”，点击后当前任务草稿、实验状态和导师输入均保留；非工作台页面可返回当前阶段。

截图核对发现TASK-047新增的常驻笔记本入口与原导师同为z-index:20、且DOM在后，会遮住发送按钮。只提高导师自身桌面层级到21，不改笔记本实现；手机既有30不变。最终三视口均用elementFromPoint确认发送按钮可点，并实际查看桌面与手机截图。

## 验证
Browser plugin not available，使用现有Playwright 1.64.1；本机Node22.23.1＋已有Chromium153.0.8010.12，未安装任何依赖。目标地址http://127.0.0.1:8766/；视口1440×1000、768×1024、375×812。目标流程：任务01→打开导师→提示预填/键盘返回→确认任务与提问草稿→论文阅读上下文→未配置/503降级→总览返回当前阶段。

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| npm test | 当前含TASK-047的工作树80/80通过；node-tests.log |
| python3 scripts/dev.py check | Python78项：75通过、3项显式research跳过；内置Node80/80；dev-check.log |
| npm run test:data-browser | 指定Node22、已有CHROMIUM_EXECUTABLE、FRONTEND_URL=8766、QA_OUTPUT=/tmp/flavoglycolab-task-048/data-browser；74/74通过，console错误0、外部请求0 |
| 临时tutor-qa.mjs | 57/57通过；tutor-qa-results.json；健康状态均模拟，POST/真实模型请求0 |
| 页面身份/非空/错误遮罩 | 三视口任务01地址与标题准确、正文非空、无框架错误遮罩 |
| UI与交互 | 三视口均核对短状态/角标删除、当前任务按钮边框背景、提示顶边框0、提示预填、Enter/关闭/回焦、输入及实验草稿不变、独立论文标签、降级显示及无横向溢出 |
| 浮层控件 | 三视口发送按钮命中检查通过；1440-tutor.png、768-tutor.png、375-tutor.png，实际查看桌面/手机最终截图 |
| 控制台/外联 | 最终专项应用错误0、外联0；只有三条主动模拟health 503对应的预期资源错误 |
| 保护资产 | integrity.json：261/261 SHA不变，含三份公开PDF；后端、科学内容与登记未改 |
| 8766静态资产 | index.html/app.js/styles.css 3/3 HTTP字节与当前磁盘一致，无需服务重启 |
| Git差异空白检查 | git diff --check通过 |

关键复现：PATH=/home/ljx/.nvm/versions/node/v22.23.1/bin:$PATH；CHROMIUM_EXECUTABLE=/home/ljx/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome；专项由该Node执行/tmp/flavoglycolab-task-048/tutor-qa.mjs。浏览器工具路径仅为本机QA选择，不是应用运行依赖。

## 与任务合同的偏差
无功能范围偏差；验收期间修正导师浮层的实际遮挡。初次浏览器命令因默认Node18不满足Playwright20+、默认浏览器版本未安装而未启动，随后显式使用已有Node22与Chromium，无安装或系统改动。临时专项初跑误点隐藏的任务分页阅读入口、下一次误写笔记本启动器ID，均为QA脚本选择器问题，改用实际常驻入口；一次完整专项在控制台总断言失败，补充完整错误日志后的完整重跑57/57通过，最终仅三条预置503。失败运行未记为通过。

## 数据、许可与审核门
research_evaluation候选；teaching_case_review 22/22待审；public_teaching_release not_started，不晋级。

## 已发现但未改的问题
TASK-047仍在原任务实施/验证中，本任务不代签。未发现本轮导师界面的未解决缺陷；正文中的其他平台说明不属于本次指定导师浮窗删除范围，保留既有事实描述。

## 遗留风险、仓库与CI
main / 92fe3f8；保留039—047既有未提交工作，本轮也未提交/push，未运行远端CI、未重启服务、未调用真实模型。未重跑完整24任务/跨页浏览器套件，未测试实体手机、其他品牌浏览器或实际上游答复；本轮仅前端展示/定位交互，相关降级与草稿保护已覆盖。应用没有新增运行依赖。

## 建议的下一TASK
不自动启动。
