import {escapeHTML as e} from './ui.js';
import {mountSiteHeader,bindReturnNavigation,returnControl,pageHeader,panel,button,field,statusBadge,emptyState} from './components.js';
mountSiteHeader('components');bindReturnNavigation();
const code=text=>`<pre class="fg-code"><code>${e(text)}</code></pre>`;
const section=(id,title,body)=>`<section class="fg-section" id="${id}"><h2>${title}</h2>${body}</section>`;
document.querySelector('#component-main').innerHTML=returnControl()+pageHeader({title:'界面规范与组件'})+`<nav class="fg-doc-nav" aria-label="规范目录"><a href="#foundation">视觉基础</a><a href="#layout">页面与分栏</a><a href="#controls">按钮与表单</a><a href="#states">状态与反馈</a><a href="#tables">数据表格</a><a href="#development">开发接入</a></nav>`+
section('foundation','视觉基础',panel({body:`<div class="fg-swatches">${[['正文','text'],['主色','accent'],['背景','canvas'],['边框','border']].map(([label,token])=>`<div><div class="fg-swatch swatch-${token}"></div><strong>${label}</strong><code class="fg-code">--fg-color-${token}</code></div>`).join('')}</div><p>统一字体：系统无衬线与中文回退；正文 14px / 1.65，控件 13px，辅助文字 12px；面板标题 16px，页面标题桌面 24px、手机 22px；顶部不设站点栏，左下操作条高 56px，更多菜单向上展开。间距使用 4、8、12、16、24、32、48px；控件圆角 10px，面板圆角 16px。</p>`}))+
section('layout','页面与分栏',`<div class="fg-split"><section><h3>正文</h3><p>正文直接呈现，不加外层卡片。内容页使用流式宽度与 16px 外边距；实验总览最大 1200px，手机按正文、说明顺序排列。</p>${button({label:'打开实验总览',href:'./index.html#/home'})}</section>${panel({title:'辅助内容',body:'<p>实验工作台使用自适应导航列与流式内容列。主线任务与实验历程可分别收起，两者都收起时为56px方形图标入口，左下隐藏更多；正文无外框，右侧填写区保留一层卡片，以 16px 间距分开。</p>'})}</div>`+code('<main class="fg-container">\n  <div class="fg-split">…主内容… …辅助内容…</div>\n</main>'))+
section('controls','按钮与表单',panel({body:`<div class="fg-example">${button({label:'执行示例',action:'demo-action'})}${button({label:'打开对话框',variant:'secondary',action:'demo-dialog'})}${button({label:'清除示例反馈',variant:'quiet',action:'demo-clear'})}${button({label:'暂不可用',disabled:true})}</div><p>同一操作区只保留一个主按钮；次按钮用于回退与辅助操作。按钮高度至少 42px；禁用态保留说明。链接负责导航，按钮负责动作。</p><form id="demo-form" class="fg-split">${field({label:"示例名称",name:"name",attributes:'required maxlength="40" placeholder="输入组件示例名称"'})}<label class="field"><span>示例布局</span><select name="layout"><option>单列</option><option>主辅两列</option></select></label><div class="actions">${button({label:'验证表单',type:'submit'})}</div></form><p id="demo-feedback" role="status" aria-live="polite"></p>`})+code("import {button, panel} from './components.js';\nbutton({label:'继续当前练习', href:'./index.html#/resume'});\npanel({title:'辅助说明', body:'可信的组件 HTML'});"))+
section('states','状态与反馈',panel({body:`<div class="fg-example">${statusBadge('待开始')}${statusBadge('草稿已保存','success')}${statusBadge('待教师审定','warning')}${statusBadge('加载失败','danger')}</div><p>成功、警告和失败同时使用文字与颜色。教师审定与机器反馈分别呈现；缺失数值不显示为 0。反馈用 role="status"，需要立即处理的错误用 role="alert"。</p>`})+emptyState({title:'没有匹配的示例',description:'空状态解释原因，并给出一个可执行恢复入口。',actions:button({label:'回到控件示例',href:'#controls',variant:'secondary'})}).replace('<h1>','<h2>').replace('</h1>','</h2>')+code("emptyState({title:'没有匹配结果', description:'请调整筛选条件。', actions: button({label:'重试', action:'reload'})});"))+
section('tables','数据表格',`<div class="fg-table-wrap"><table class="fg-table"><caption>布局与组件的责任分配</caption><thead><tr><th scope="col">层级</th><th scope="col">唯一维护位置</th><th scope="col">使用方式</th></tr></thead><tbody><tr><th scope="row">视觉变量</th><td>design-tokens.css</td><td>使用 --fg-*，禁止另建颜色表</td></tr><tr><th scope="row">通用控件与外壳</th><td>components.js / components.css</td><td>导入渲染函数和样式</td></tr><tr><th scope="row">学习与科学状态</th><td>原有 lab-state / learning-state / quest-state</td><td>页面只读投影，不复制状态</td></tr></tbody></table></div><p>表格使用 caption、列标题与行标题；窄屏仅在表格容器内横向滚动。</p>`)+
section('development','开发接入',panel({body:`<p>1. 普通页面加载 components.css，提供 footer[data-site-controls] 挂载点，调用 mountSiteHeader(active)。</p><p>2. 使用 pageHeader、panel、button、statusBadge、emptyState 组合页面；受信任的 HTML 才能传入 body/actions，普通文本由组件转义。</p><p>3. 学习子页面在 navigation.js 登记解析与访问条件，在 app.js 编排，在 views/ 渲染；不修改原学习门禁。</p><p>4. 完整页面矩阵、状态恢复与验收方式见仓库 docs/design/interface-system.md。扩展资产须同步 scripts/dev.py 的运行清单。</p>`})+code("import {mountSiteHeader, pageHeader} from './components.js';\nmountSiteHeader('data');\nmain.innerHTML = pageHeader({title:'数据查询', description:'页面用途'});"));
const dialog=document.createElement('dialog');
dialog.setAttribute('aria-labelledby','demo-dialog-title');
dialog.innerHTML='<form method="dialog"><h2 id="demo-dialog-title">组件对话框</h2><p>原生 dialog 提供焦点约束与 Esc 关闭。关闭后回到触发按钮。</p>'+button({label:'关闭',type:'submit',variant:'secondary'})+'</form>';
dialog.className='fg-demo-dialog';
document.body.append(dialog);
document.addEventListener('click',event=>{
  const action=event.target.closest('[data-action]')?.dataset.action;
  if(action==='demo-action')document.querySelector('#demo-feedback').textContent='示例操作已完成。';
  if(action==='demo-clear')document.querySelector('#demo-feedback').textContent='';
  if(action==='demo-dialog')dialog.showModal();
});
document.querySelector('#demo-form').addEventListener('submit',event=>{
  event.preventDefault();const data=new FormData(event.target);
  document.querySelector('#demo-feedback').textContent=`示例「${data.get('name')}」已验证，布局：${data.get('layout')}。`;
});
