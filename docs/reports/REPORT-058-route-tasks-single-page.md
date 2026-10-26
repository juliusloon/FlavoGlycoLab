# REPORT-058：路线比较与路线选择分别合为单页

## 对应任务
- TASK文件：[TASK-058](../tasks/TASK-058-route-tasks-single-page.md)。
- 状态：Completed（2026-10-25，工程验收）。
- 基线提交与分支：main / dcab65f。
- 结果提交：pending，未提交或push；授权来源：human_direct，见任务合同。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 学生端任务投影 | frontend/student/views/inquiry.js | 03/04各三页合一；删除草稿状态提示，选择题组改用隐藏的目标说明作为legend |
| 展示样式 | frontend/student/styles.css | 删除失效的draft-notice样式 |
| 现有浏览器守卫 | tests/test_inquiry_browser.mjs | 验证03/04文字、三路线卡与三篇解读同页且无分页 |
| 现有异步回归 | tests/test_submission_browser.mjs | 验证新任务内容清空及原草稿恢复，不再依赖已删除的提示 |
| 治理闭环 | 本TASK/REPORT、两索引、STATE/PROGRESS | 范围、实测、当前事实与里程碑；索引保留历史任务编号 |

## 实际操作与观察
任务03/04复用现有内容与路线/论文入口，不修改学习完成状态、科学数据、AI服务或其他任务分页。原sessionStorage的03/04分页值因无pager不再生效。

通用答题栏不再生成“新任务，输入框已清空”及“已载入草稿/已提交回答”提示；选择题组legend以任务目标作为隐藏可访问名称，视觉上不再显示“作出你的判断”。提交后的评价与反馈保留。常驻8766直接读取本项目student目录，HTTP取回inquiry.js与styles.css均与改后字节一致，无需重启服务；本次未操作常驻进程或私有模型配置。

## 验证
Browser plugin not available，使用已有Playwright、Node22.23.2和Chromium153.0.8010.12；不安装依赖。临时QA地址http://127.0.0.1:8781/，模型读取在临时进程显式禁用；响应夹具不调用真实模型。所有脚本、日志、保护清单与截图在/tmp/flavoglycolab-task-058/，不纳入Git。
| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `PATH=/home/ljx/.local/bin:$PATH python3 scripts/dev.py check` | public：Python79项，76通过/3显式research跳过；Node87/87通过，public-check.log |
| `FRONTEND_URL=http://127.0.0.1:8781/ QA_OUTPUT=/tmp/flavoglycolab-task-058/inquiry CHROMIUM_EXECUTABLE=…/chromium-1243/chrome-linux64/chrome node tests/test_inquiry_browser.mjs` | 完整工作台1702/1702，R1/1536×1024、R3/768×1024、R2/375×812；inquiry/results.json；03/04各一页、三卡/三篇解读可见及既有24步流程通过 |
| 同环境运行 `tests/test_submission_browser.mjs` | 31/31通过，1440×960及390×960；草稿切换、评价防重/取消/陈旧响应、刷新恢复与既有分步分析通过；submission/results.json |
| `node /tmp/flavoglycolab-task-058/routes-qa.mjs` | 合页专项68/68，1536/768/390×1024；旧03/04分页值为2仍显示完整内容、六组论文展开、选项可访问名称、草稿/选项返回恢复、提交解锁04、实际选择R1及刷新保留依据通过；routes-results.json |
| 布局/控制台/截图 | 两项任务三种视口无横向溢出、无错误遮罩和应用console/page errors；人工查看task-03-1536.png、task-04-1536.png、task-03-390.png，文字/路线/解读/答题栏正常。记录的4条GPU ReadPixels警告见下文 |
| 保护与常驻资产 | 318/318预算外tracked文件SHA不变；8766的2/2修改资产HTTP200且与本地字节一致，protection-and-lan.json；未动来源/内容登记/状态机/后端 |
| `git diff --check` | 通过；最终变更清单限合同允许的10个路径（含新TASK/REPORT），未提交/push |
| 最终文档与范围核验 | 治理测试9/9通过；10/10变更路径在预算内、318/318保护SHA不变、224/224本地Markdown链接存在；final-governance.log、final-audit.json。临时8781进程已停止，常驻8766未操作 |

浏览器检查证据：

| 检查 | 结果 |
| --- | --- |
| 页面身份/非空 | URL任务03/04及FlavoGlycoLab标题正确，两页主内容可见 |
| 错误遮罩/控制台 | 无应用错误；仅headless Chromium的GPU性能警告 |
| 交互 | 展开三篇解读、选择答案并提交03、进入04选择路线/填写依据、提交后刷新恢复全部通过 |
| 截图 | 桌面与窄屏均已保存；下方为两页桌面结果 |

## 与任务合同的偏差
- 默认Playwright请求chromium_headless_shell-1248而本机仅有1243；改用CHROMIUM_EXECUTABLE指向已有Chromium，无依赖变动。
- 首次public检查79项中仅TASK-058尚缺配对REPORT失败；补齐本报告后public检查全部通过。初次日志保存在public-check.log.initial。
- 首次完整浏览器在“默认public未配置模型”断言失败：临时服务误覆盖了不存在的tutor_config名称；随后改为临时read_config明确抛OSError，不改源码或私有配置，1702项重跑通过。首次测试在默认配置断言即退出，未执行真实模型请求。
- 专项首轮67项功能断言通过，末尾将所有console warning一律计为应用警告的断言失败。4条均为切回任务02触发3D查看器时的Chromium `GL Driver Message … GPU stall due to ReadPixels`；专项脚本仅排除此已明确的驱动性能警告，保留原消息，重跑68/68通过。原结果/日志保存为routes-results.json.initial和routes-qa.log.initial；未修改产品来消除浏览器驱动警告。

## 数据、许可与审核门
- research_evaluation：仍为历史候选/计算与工程证据，未新增化学实验验证。
- teaching_case_review：22/22 pending_teacher_review，human_review_status=not_performed，教师批准0。
- public_teaching_release：not_started，public_release=false；未改变来源公开范围或许可。

## 已发现但未改的问题
未发现本次两页合并范围内的未解决功能问题。headless Chromium在既有3D页面切换时的GPU性能警告保留，未扩展至分子渲染或驱动设置。

## 遗留风险、仓库与CI
本次改动尚未提交/push，远端CI未触发；浏览器为模拟视口与受控响应，未验证实体设备、其他浏览器、真实模型或教师审定。

## 建议的下一TASK
无自动续作；新的范围由所有者另行授权。

## 截图

![任务03：路线比较合为一页](/tmp/flavoglycolab-task-058/task-03-1536.png)
![任务04：路线选择合为一页](/tmp/flavoglycolab-task-058/task-04-1536.png)
