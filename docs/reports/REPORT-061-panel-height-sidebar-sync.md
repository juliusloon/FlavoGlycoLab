# REPORT-061：侧栏联动折叠与双栏纵向对齐

## 对应任务
- TASK文件：docs/tasks/TASK-061-panel-height-sidebar-sync.md
- 状态：Completed（2026-10-25）
- 基线提交与分支：dcab65fdf0b1e6b269a88d2abfbe11552fdde9b5 / main
- 结果提交：pending；未提交、未push
- 授权来源：human_direct（2026-10-25所有者本项明确界面调整指令）

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 共享入口与折叠 | frontend/student/components.js、components.css | 更多改为纯图标；主线按钮统一控制两组内容；旧双布尔偏好读取为单一collapsed状态 |
| 侧栏呈现 | frontend/student/views/workbench.js | 删除实验历程独立折叠按钮及未使用导入，保留阶段导航 |
| 实验页布局 | frontend/student/styles.css | 桌面双栏顶部对齐与纵向可用高度、右卡与笔记本16px间距、回答区与提交操作纵向延展；窄屏保持流式 |
| 工程守卫 | tests/test_pages_browser.mjs、test_case_route_browser.mjs | 联动折叠/纯图标入口与双栏几何断言 |
| 使用与组件说明 | frontend/student/README.md、components-page.js | 同步当前交互和布局说明 |
| 责任与状态闭环 | ARCHITECTURE.md、STATE.md、PROGRESS.md、docs/tasks/README.md、docs/reports/README.md、本TASK/REPORT | 登记当前职责、实际结果和边界，不提升状态门 |

预算中的app.js、views/inquiry.js和tests/test_inquiry_browser.mjs无需改动；未修改科学内容、状态机、后端、模型或服务配置。

## 实际操作与观察
保留TASK-058—060及此前未提交工作树，在其上增量修改。改前保存326个tracked文件的工作树字节/尺寸/模式基线。实际8766基线专项244项通过并留存截图。初始远程Node 18不能运行当前Playwright，改用既有Node 22.23.1；当前Playwright默认浏览器1248未安装，按既有环境改用Chromium 1243，未安装依赖。

主线按钮现在一次控制quest-panel-content与workflow-content，偏好只写collapsed；旧quests/workflow仅用于兼容读取。更多保留aria-label、title、菜单和键盘操作。桌面正文不垂直居中，右卡利用固定可用高度延展作答区；导师导致1100—1499px单栏及窄屏时取消桌面固定高度。收起后只留主线和总览两个56px方形入口。

完整inquiry测试含“默认public不配置模型”的断言，不能直接以配置了模型的8766作为该套件public基线；另用temp/task-061/public_server.py启动127.0.0.1:8781无模型临时服务，测试结束后由EXIT trap停止。所有AI上游均为套件既有受控响应，未调用真实模型。

## 验证
| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| 改前FRONTEND_URL=8766的test_case_route_browser.mjs | 244/244通过；temp/task-061/before-case-route/ |
| 改后同一专项（回答区延展前） | 268/268通过；temp/task-061/after-case-route/ |
| 最终FRONTEND_URL=8766的test_case_route_browser.mjs | 268/268通过，errors=0；含双栏顶边/高度及两处16px间距；temp/task-061/final-case-route/ |
| 最终FRONTEND_URL=8766的test_pages_browser.mjs | 725/725通过，errors=0、externals=0；1440/900/375三视口，含折叠恢复、偏好、学习记录和纯图标入口；temp/task-061/pages/ |
| scripts/dev.py check | public配置通过；22案例、3个公开来源 |
| Python unittest | 79项：76通过、3个显式research跳过，OK；FLAVOGLYCOLAB_TEST_RESEARCH未启用 |
| npm test | Node 92/92通过 |
| 直接对8766运行完整test_inquiry_browser.mjs | 非通过项：因default public app does not require model credentials断言停止；8766已配置模型，环境不符合该套件public前提；temp/task-061/inquiry/ |
| 临时public 8781运行完整test_inquiry_browser.mjs | 1708/1708通过，errors=0、externals=0；受控fixture，不是真实模型验收；temp/task-061/inquiry-public/ |
| 最终折叠与几何专项 | 1536×1024中/右栏top均24px、height均856px、bottom均880px；笔记本top 896px/bottom 944px，AI按钮top 960px；右卡—笔记本和笔记本—AI均16px。1536及390折叠后两个入口均56×56px，同步恢复且学习记录不变，无横向溢出或应用错误；temp/task-061/final-visual/ |
| 截图人工复核 | 查看任务01—04、390任务页、1440/900/375跨页及1536/390折叠态；未见回答区遮挡、按钮越界或窄屏强拉视口高度 |
| 8766静态字节 | components.js、components.css、styles.css、views/workbench.js、components-page.js共5/5 HTTP 200且与本地逐字节一致 |
| 服务状态 | 临时8781无监听；常驻flavoglycolab-lan.service为active；本TASK未重启8766 |
| 工作树与格式保护 | 改前/改后326个tracked文件快照对比，12个变化均在预算内、314个不变、预算外0变化；状态新增仅为5个预算内文件首次标记M及本REPORT未跟踪，无状态删除；git diff --check通过；temp/task-061/protection-audit.json |

浏览器结果中的4条warnings均为Chromium WebGL“GPU stall due to ReadPixels”性能提示；不作为应用错误，也不据此宣称GPU性能通过。

## 失败、修正与保留记录
1. 首次内联基线命令因shell引号导致Python语法错误，未执行快照或改动文件；改用temp/task-061/capture_baseline.py完成基线。
2. 首次Python检查因TASK-061已建立而REPORT尚未建立出现1项失败；补齐报告后完整重跑为79项OK。
3. 直接对8766运行非liveAI完整流程时遇到上述public前提失败；没有将其记作布局通过，也没有修改应用或测试绕过，而是按套件前提另起临时无模型服务完成1708项。
4. 首次静态HTTP审计误把frontend/student/仓库前缀用于URL，得到404；改为站点根相对路径后5/5一致。两次均为审计脚本路径问题，未改应用。
5. 早期“回答区延展前”结果保留，最终268项和截图均来自延展后的版本。
6. 首次保护审计把5个本TASK新变为M的预算内tracked文件误排除在状态预期之外，断言失败；快照同时证明12个变化均在预算内、预算外为空。修正为5个M加1个未跟踪REPORT的精确预期后重跑通过，未改应用或保护资产。

## 与任务合同的偏差
无范围偏差。Node/Chromium使用远程既有版本，未安装依赖。test_case_route_browser.mjs在基线时已是TASK-059留下的未跟踪文件，本TASK仅在预算内增量编辑；326个tracked快照不覆盖该文件，未将其描述成全文件保护证明。未重启服务、未提交/push、未调用真实模型。

## 数据、许可与审核门
未修改科学内容、来源原件、数据登记、许可或教学判定。research_evaluation保持历史候选/计算与工程证据；teaching_case_review保持22/22待教师审定；public_teaching_release保持not_started。工程检查不提升任何状态门。

## 已发现但未改的问题
无新增越权问题。WebGL性能提示保留为浏览器警告，不在本布局TASK中处理。

## 遗留风险、仓库与CI
当前为工作树增量修改，HEAD仍为dcab65f；未提交、未push、未触发新CI。浏览器验证限于Chromium及模拟视口，尚不能声称实体设备、Safari/Firefox、真实模型质量、课堂并发或教学效果通过。

## 建议的下一TASK
不自动启动下一TASK。所有者可先在常用桌面视口确认视觉；如需进一步微调，再另行授权。
