import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as components from '../frontend/student/components.js';
const {settingsDialog} = components;
import { queryRecords, countByRoute, summarize, validRoute, ROUTE_ORDER } from '../frontend/student/data-query.js';

const root = new URL('../', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), 'utf8');
const content = JSON.parse(read('frontend/student/content/demo-content.json'));
const data = content.data_query;
const html = read('frontend/student/data.html');
const script = read('frontend/student/data-page.js');
const logic = read('frontend/student/data-query.js');
const css = read('frontend/student/data-page.css');

test('data query content is a bounded, sourced literature-report register', () => {
  assert.equal(data.review_status, 'pending_teacher_review');
  assert.equal(data.as_of, '2026-10-22');
  assert.equal(data.records.length, 21);
  assert.deepEqual(data.categories, ['方法条件', '产物浓度', '转化率/收率', '供体/机制', '指标辨析', '身份/谱图', '投料/梯度']);
  assert.deepEqual(Object.keys(data.route_labels), ROUTE_ORDER);
  const ids = new Set();
  const sourceIds = new Set(content.sources.map(source => source.source_id));
  for (const record of data.records) {
    assert.match(record.id, /^DQ-R[123]-\d{2}$/);
    assert.ok(!ids.has(record.id), `duplicate ${record.id}`);
    ids.add(record.id);
    assert.ok(ROUTE_ORDER.includes(record.route), record.id);
    assert.ok(sourceIds.has(record.source_id), record.id);
    assert.ok(data.categories.includes(record.category), record.id);
    for (const field of ['title', 'value', 'metric', 'conditions', 'location', 'boundary']) {
      assert.ok(typeof record[field] === 'string' && record[field].length >= 4, `${record.id}.${field}`);
    }
    assert.ok(Array.isArray(record.tags) && record.tags.length > 0, record.id);
  }
  assert.deepEqual(countByRoute(data.records), { R1: 9, R2: 5, R3: 7 });
});

test('search matches route, source, category and multi-term Chinese keywords', () => {
  assert.equal(queryRecords(data.records, { route: 'R1' }).length, 9);
  assert.equal(queryRecords(data.records, { route: 'R2' }).length, 5);
  assert.equal(queryRecords(data.records, { route: 'R3' }).length, 7);
  assert.equal(queryRecords(data.records, { source: 'Niu2024' }).length, 7);
  assert.equal(queryRecords(data.records, { category: '身份/谱图' }).length, 3);
  const bs306 = queryRecords(data.records, { q: 'BS306G' });
  assert.equal(bs306.length, 1);
  assert.equal(bs306[0].value, '1.64 g/L（BS221G）；3.58 g/L（BS306G）；48 h');
  assert.equal(queryRecords(data.records, { q: 'R3 菌株' }).length, 1);
  assert.equal(queryRecords(data.records, { q: 'R1', route: 'R1' }).length, 9);
  assert.equal(queryRecords(data.records, { q: '补料', route: 'R1' }).length, 2);
  assert.equal(queryRecords(data.records, { q: '不存在的记录 BS999' }).length, 0);
  assert.equal(queryRecords(data.records, { q: 'Ｒ３ ４８ ｈ' }).length, 4);
});

test('empty and count states are explicit and never convert absence to zero', () => {
  assert.equal(data.empty_state.title, '没有对应实验数据');
  assert.match(data.empty_state.body, /不表示结果为 0/);
  assert.match(data.boundary, /缺失不等于 0/);
  assert.equal(summarize([], 21), '显示 0 / 21 条已登记记录');
  assert.equal(summarize(data.records, 21), '显示全部 21 条已登记记录');
  assert.equal(validRoute('R9'), '');
  assert.equal(validRoute('R2'), 'R2');
  assert.match(script, /empty-results/);
  assert.match(script, /data\.empty_state\.title/);
  assert.match(script, /原文报告 · 非本次观测/);
  assert.match(script, /待教师审定/);
});

test('data page is same-origin, read-only and does not touch learning state or AI', () => {
  for (const text of [html, script, css, logic]) {
    assert.doesNotMatch(text, /<script[^>]+https?:|@import\s+url\(\s*['"]?https?:|fetch\(\s*['"]https?:/i);
  }
  assert.doesNotMatch(script, /localStorage|sessionStorage|api\/tutor|api\/health/);
  assert.match(script, /fetch\('\.\/content\/demo-content\.json'\)/);
  assert.match(html, /href="\.\/case-page\.css"/);
  assert.match(html, /href="\.\/data-page\.css"/);
  assert.match(html, /src="\.\/data-page\.js"/);
  assert.match(html, /data-site-controls/);
  assert.equal(typeof settingsDialog, 'function');
  assert.match(settingsDialog(), /href="\.\/data\.html"/);
  assert.match(settingsDialog(), /data-site-page="data"/);
  assert.match(html, /href="\.\/index\.html"/);
});

test('case page and analysis view link to the independent query page', () => {
  const caseScript = read('frontend/student/case-page.js');
  const workbench = read('frontend/student/views/workbench.js');
  const caseHtml = read('frontend/student/case.html');
  assert.match(caseScript, /href="\.\/data\.html"/);
  assert.match(workbench, /href="\.\/data\.html\?route=/);
  assert.match(caseHtml, /data-site-controls/);
  assert.equal(typeof settingsDialog, 'function');
  assert.match(settingsDialog(), /href="\.\/data\.html"/);
});
