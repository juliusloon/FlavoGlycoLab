import {mountSiteHeader,returnControl,bindReturnNavigation} from './components.js';
mountSiteHeader('case');
bindReturnNavigation();
const main = document.querySelector('#case-main');
const e = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const list = (items, className = '') => `<ul class="${className}">${items.map(item => `<li>${e(item)}</li>`).join('')}</ul>`;

try {
  const response = await fetch('./content/demo-content.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const content = await response.json();
  const page = content.case_page;
  if (!page) throw new Error('缺少 case_page 内容块');

  const sourceLabel = id => content.sources.find(source => source.source_id === id)?.label ?? id;
  const sourceBadge = id => `<span class="badge source">${e(sourceLabel(id))}</span>`;
  const section = (id, kicker, title, body) => `
    <section class="case-section" id="${e(id)}" aria-labelledby="${e(id)}-title">
      <h2 id="${e(id)}-title">${e(title)}</h2>
      ${body}
    </section>`;

  const figure = `
    <figure class="case-figure">
      <img src="${e(page.figure.src)}" alt="${e(page.figure.alt)}" width="1800" height="1240" loading="eager">
      <figcaption>${e(page.figure.caption)}<br><span class="muted">图中数值均为原文报告，不是本次实验观测；R1/R2 图表展示待 Springer 授权。</span></figcaption>
    </figure>`;

  const standards = `
    <div class="standard-grid">
      ${page.standard_sentences.map(item => `
        <article class="standard-card">
          <p class="standard-id">${e(item.id)} · ${e(item.label)}</p>
          <p>${e(item.text)}</p>
        </article>`).join('')}
    </div>`;

  const target = `
    <div class="target-card">
      <div>
        <p class="target-name">${e(page.target.name)} <span>${e(page.target.english_name)}</span></p>
        <p class="target-formula">${e(page.target.formula)} · 相对分子质量 ${e(page.target.mass)}</p>
        <p>${e(page.target.definition)}</p>
      </div>
      <p class="note">${e(page.target.ms_note)}</p>
    </div>`;

  const molecules = `
    <div class="table-wrap">
      <table class="data-table molecule-table">
        <caption>五类分子的糖基组成与连接位置</caption>
        <thead><tr><th scope="col">分子</th><th scope="col">一句话辨别</th><th scope="col">与本案例关系</th><th scope="col">参考定位</th></tr></thead>
        <tbody>
          ${page.molecules.map(molecule => `
            <tr class="${molecule.is_target ? 'is-target' : ''}">
              <th scope="row">${e(molecule.name)}<span class="english">${e(molecule.english)}</span></th>
              <td>${e(molecule.distinction)}</td>
              <td>${e(molecule.relation)}</td>
              <td class="reference-cell">${e(molecule.reference)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="callout">${e(page.molecule_note)}</p>`;

  const routes = `
    <div class="route-grid">
      ${page.route_cards.map(card => `
        <article class="route-card route-${e(card.id.toLowerCase())}">
          <header>
            <h3>${e(card.name)}</h3>
            <div class="badge-row">${sourceBadge(card.source_id)}</div>
          </header>
          <dl>
            <dt>反应方向</dt><dd>${e(card.direction)}</dd>
            <dt>催化体系</dt><dd>${e(card.system)}</dd>
            <dt>关键结果</dt><dd>${list(card.key_results)}<span class="report-note">原文报告 · 非本次观测 · 条件不可外推</span></dd>
            <dt>对照</dt><dd>${e(card.controls)}</dd>
            <dt>数据缺口</dt><dd>${e(card.gaps)}</dd>
            <dt>许可状态</dt><dd>${e(card.license)}</dd>
          </dl>
        </article>`).join('')}
    </div>`;

  const comparison = `
    <p class="callout">${e(page.comparison.note)}</p>
    <div class="table-wrap">
      <table class="data-table comparison-table">
        <caption>三路线证据与条件对照</caption>
        <thead><tr>${page.comparison.headers.map(header => `<th scope="col">${e(header)}</th>`).join('')}</tr></thead>
        <tbody>
          ${page.comparison.rows.map(row => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${e(cell)}</th>` : `<td>${e(cell)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>`;

  const evidenceRules = `<ol class="rule-list">${page.evidence_rules.map(rule => `<li>${e(rule)}</li>`).join('')}</ol>`;

  const ai = `
    <div class="two-column">
      <article class="plain-card"><h3>AI 教学助手（本机演示）</h3><p>${e(page.ai.tutor)}</p></article>
      <article class="plain-card"><h3>数据查询页</h3><p>${e(page.ai.data_service)}</p><a class="card-link" href="./data.html">打开数据查询 →</a></article>
    </div>`;

  const status = `
    <div class="two-column">
      <article class="plain-card"><h3>交件记录的已有功能</h3>${list(page.status.existing)}</article>
      <article class="plain-card pending"><h3>拟建／待确认</h3>${list(page.status.pending)}</article>
    </div>
    <p class="muted">原交件状态截至 ${e(page.status.as_of)}。</p>`;

  const references = `
    <ol class="reference-list">${page.references.map(reference => `<li>${e(reference.replace(/^\[\d+\]\s*/, ''))}</li>`).join('')}</ol>
    <p class="note">${e(page.reference_note)}</p>`;

  main.innerHTML = `${returnControl()}
    <header class="case-hero">
      <h1>${e(page.title)}</h1>
    </header>
    <p class="disclaimer" role="note">文献报告值 · 非本次观测 · 不同体系的指标需按原文条件解读</p>
    ${section('figure', '先看全图', '制备路线图', figure)}
    ${section('target', '目标分子', '目标分子与近缘化合物', target + molecules)}
    ${section('routes', '三条路线', '三种催化体系', routes)}
    ${section('comparison', '横向对照', '路线对照', comparison)}
    ${section('evidence', '证据说明', '数据使用规则', evidenceRules)}
    ${section('ai', 'AI 与数据分工', 'AI 辅导与数据查询', ai)}
    ${section('references', '参考文献', '参考文献', references)}
    <details class="source-meta">
      <summary>资料来源与审定状态</summary>
      <p>案例与数值待教师审定。原交件的标准句、版本与功能记录如下。</p>
      ${standards}
      ${status}
      <p>文案来源：ZYT《case_page_copy_v1_20261022.md》，SHA-256 <code>${e(page.source_handoff.sha256)}</code>。图1 来源：${e(page.figure.src)}（ZYT 路线图文字稿 v1，L 制图）。</p>

    </details>`;
} catch (error) {
  main.innerHTML = `<div class="case-error" role="alert"><h1>案例页暂时无法读取</h1><p>${e(error.message)}</p><p>请通过本地开发服务打开本页，或返回 <a href="./index.html">虚拟探究实验</a>。</p></div>`;
}
