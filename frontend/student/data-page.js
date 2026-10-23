import {mountSiteHeader,returnControl,bindReturnNavigation} from './components.js';
mountSiteHeader('data');
bindReturnNavigation();
import { escapeHTML as e } from './ui.js';
import { queryRecords, countByRoute, validRoute, summarize, ROUTE_ORDER } from './data-query.js';

const main = document.querySelector('#data-main');
const params = new URLSearchParams(location.search);
const filters = {
  q: params.get('q') || '',
  route: validRoute(params.get('route') || ''),
  source: params.get('source') || '',
  category: params.get('category') || '',
};
const examples = [
  { label: 'R1 补料', q: '补料', route: 'R1' },
  { label: 'R2 时间', q: '时间进程', route: 'R2' },
  { label: 'R3 菌株', q: 'BS306G', route: 'R3' },
  { label: '标准曲线', q: '标准曲线', route: '' },
];

try {
  const response = await fetch('./content/demo-content.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const content = await response.json();
  const data = content.data_query;
  if (!data || !Array.isArray(data.records)) throw new Error('缺少 data_query 内容块');

  const sources = content.sources || [];
  const sourceLabel = (id) => sources.find((source) => source.source_id === id)?.label || id;
  const usedSourceIds = ROUTE_ORDER.flatMap((route) => data.records.filter((record) => record.route === route))
    .map((record) => record.source_id)
    .filter((id, index, list) => list.indexOf(id) === index);
  const counts = countByRoute(data.records);
  if (!data.categories.includes(filters.category)) filters.category = '';
  if (!usedSourceIds.includes(filters.source)) filters.source = '';

  main.innerHTML = `${returnControl()}
    <header class="data-hero">
      <p class="hero-kicker">${e(data.kicker)} · 截至 ${e(data.as_of)}</p>
      <h1>${e(data.title)}</h1>
      <p class="hero-lead">${e(data.lead)}</p>
      <div class="badge-row">
        <span class="badge review">全部记录待教师审定</span>
        <span class="badge neutral">${data.records.length} 条已登记报告记录</span>
        <span class="badge source">原文报告 · 非本次观测</span>
      </div>
    </header>
    <p class="data-boundary" role="note">${e(data.boundary)}</p>

    <section class="query-panel" aria-labelledby="query-title">
      <div class="query-heading">
        <div>
          <p class="section-kicker">检索</p>
          <h2 id="query-title">按路线、来源或关键词查</h2>
        </div>
        <button class="text-button" type="button" data-clear>清除筛选</button>
      </div>
      <div class="route-tabs" role="group" aria-label="按路线筛选">
        <button type="button" data-route="" aria-pressed="${filters.route === ''}">全部 <span>${data.records.length}</span></button>
        ${ROUTE_ORDER.map((route) => `<button type="button" data-route="${route}" aria-pressed="${filters.route === route}"><strong>${route}</strong> ${e(data.route_labels[route] || '')} <span>${counts[route]}</span></button>`).join('')}
      </div>
      <form class="query-bar" id="query-form" role="search">
        <label class="field query-field">
          <span>关键词</span>
          <input type="search" name="q" id="data-q" value="${e(filters.q)}" placeholder="如：补料、BS306G、18.25、标准曲线" autocomplete="off">
        </label>
        <label class="field query-field">
          <span>来源</span>
          <select name="source" id="data-source">
            <option value="">全部来源</option>
            ${usedSourceIds.map((id) => `<option value="${e(id)}" ${filters.source === id ? 'selected' : ''}>${e(sourceLabel(id))}</option>`).join('')}
          </select>
        </label>
        <label class="field query-field">
          <span>数据类型</span>
          <select name="category" id="data-category">
            <option value="">全部类型</option>
            ${data.categories.map((category) => `<option value="${e(category)}" ${filters.category === category ? 'selected' : ''}>${e(category)}</option>`).join('')}
          </select>
        </label>
      </form>
      <div class="query-examples" aria-label="示例查询">
        <span>试查：</span>
        ${examples.map((item) => `<button type="button" data-example="${e(item.label)}" data-q="${e(item.q)}" data-example-route="${e(item.route)}">${e(item.label)}</button>`).join('')}
      </div>
      <p class="result-count" id="result-count" role="status"></p>
    </section>

    <section id="data-results" class="data-results" aria-label="查询结果"></section>

    <section class="source-panel" aria-labelledby="source-title">
      <p class="section-kicker">来源</p>
      <h2 id="source-title">三篇论文的登记状态</h2>
      <div class="source-grid">
        ${usedSourceIds.map((id) => {
          const source = sources.find((item) => item.source_id === id);
          return `<article class="source-card">
            <h3>${e(source?.label || id)}</h3>
            <p class="source-id">${e(id)} · DOI ${e(source?.doi || '未登记')}</p>
            <p>${e(source?.source_locator || '原文定位待登记')}</p>
            <p class="source-boundary">${e(source?.license_status || '许可状态待核')}</p>
            <p class="source-review">待教师审定 · 摘录核对不等于独立实验验证</p>
          </article>`;
        }).join('')}
      </div>
      <p class="fine-print">本页不加载论文原文、不调用 AI、不读取学习记录；所有结果只来自同源内容文件。来源许可与再分发状态以登记为准。</p>
    </section>`;

  const results = main.querySelector('#data-results');
  const count = main.querySelector('#result-count');
  const search = main.querySelector('#data-q');
  const sourceSelect = main.querySelector('#data-source');
  const categorySelect = main.querySelector('#data-category');

  function syncUrl() {
    const url = new URL(location.href);
    for (const [key, value] of Object.entries(filters)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, '', url);
  }

  function recordCard(record) {
    return `<article class="data-record route-${e(record.route.toLowerCase())}" data-record-id="${e(record.id)}">
      <header class="record-head">
        <div class="badge-row">
          <span class="badge route-badge">${e(record.route)}</span>
          <span class="badge neutral">${e(record.category)}</span>
          <span class="badge report">原文报告 · 非本次观测</span>
        </div>
        <span class="record-id">${e(record.id)}</span>
      </header>
      <h3>${e(record.title)}</h3>
      <p class="record-value">${e(record.value)}</p>
      <dl class="record-meta">
        <div><dt>原指标</dt><dd>${e(record.metric)}</dd></div>
        <div><dt>条件</dt><dd>${e(record.conditions)}</dd></div>
        <div><dt>原文定位</dt><dd>${e(record.location)}</dd></div>
        <div><dt>使用边界</dt><dd>${e(record.boundary)}</dd></div>
      </dl>
      <footer class="record-foot">
        <span>${e(sourceLabel(record.source_id))} · ${e(record.source_id)}</span>
        <span class="review-flag">待教师审定</span>
      </footer>
    </article>`;
  }

  function renderResults() {
    const matched = queryRecords(data.records, filters);
    count.textContent = summarize(matched, data.records.length);
    for (const button of main.querySelectorAll('[data-route]')) {
      button.setAttribute('aria-pressed', String(button.dataset.route === filters.route));
    }
    if (matched.length) {
      results.innerHTML = `<div class="record-grid">${matched.map(recordCard).join('')}</div>`;
    } else {
      results.innerHTML = `<div class="empty-results" role="status">
        <p class="empty-kicker">0 条匹配</p>
        <h2>${e(data.empty_state.title)}</h2>
        <p>${e(data.empty_state.body)}</p>
        <p class="empty-hint">${e(data.empty_state.hint)}</p>
        <button class="button secondary" type="button" data-clear>清除筛选，查看全部记录</button>
      </div>`;
    }
    syncUrl();
  }

  function clearFilters() {
    filters.q = ''; filters.route = ''; filters.source = ''; filters.category = '';
    search.value = ''; sourceSelect.value = ''; categorySelect.value = '';
    renderResults();
    search.focus();
  }

  main.addEventListener('input', (event) => {
    if (event.target !== search) return;
    filters.q = event.target.value;
    renderResults();
  });
  main.addEventListener('change', (event) => {
    if (event.target === sourceSelect) filters.source = event.target.value;
    else if (event.target === categorySelect) filters.category = event.target.value;
    else return;
    renderResults();
  });
  main.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.matches('[data-clear]')) { clearFilters(); return; }
    if (button.dataset.route !== undefined) {
      filters.route = validRoute(button.dataset.route);
      renderResults();
      return;
    }
    if (button.dataset.example) {
      filters.q = button.dataset.q || '';
      filters.route = validRoute(button.dataset.exampleRoute || '');
      search.value = filters.q;
      renderResults();
      search.focus();
    }
  });
  renderResults();
} catch (error) {
  main.innerHTML = `<div class="case-error" role="alert"><h1>数据查询暂时无法读取</h1><p>${e(error.message)}</p><p>请通过本地开发服务打开本页，或返回 <a href="./index.html">虚拟探究实验</a>。</p></div>`;
}
