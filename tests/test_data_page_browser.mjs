import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://127.0.0.1:8767/';
const out = path.resolve(process.env.QA_OUTPUT || 'temp/task-025');
await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}),
});
const results = [];
const consoleErrors = [];
const externals = [];
const check = (name, value = true) => { assert.ok(value, name); results.push({ name, pass: true }); };
const pageUrl = (name) => new URL(name, base).href;

async function noOverflow(page, name) {
  check(name, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1 &&
    [...document.querySelectorAll('main,.query-panel,.record-grid,.source-grid')]
      .every((el) => el.scrollWidth <= el.clientWidth + 1)));
}

for (const [width, height] of [[1536, 1024], [768, 1024], [375, 812]]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push({ width, text: message.text() }); });
  page.on('pageerror', (error) => consoleErrors.push({ width, text: error.message }));
  page.on('request', (request) => {
    const target = new URL(request.url());
    const origin = new URL(base);
    if (target.origin !== origin.origin) externals.push({ width, url: request.url() });
  });

  await page.goto(pageUrl('data.html'));
  await page.locator('#data-results .data-record').first().waitFor();
  check(`${width}: 21 registered records render`, await page.locator('#data-results .data-record').count() === 21);
  check(`${width}: page identity`, (await page.title()).includes('数据查询'));
  check(`${width}: boundary calls out non-live and non-observation`, (await page.locator('.data-boundary').textContent()).includes('不是实时文献库') && (await page.locator('.data-boundary').textContent()).includes('不是本次实验测量'));
  check(`${width}: every card is labelled original report and pending review`,
    await page.locator('#data-results .data-record .badge.report').count() === 21 &&
    await page.locator('#data-results .review-flag').count() === 21);
  check(`${width}: source locations are visible`, await page.locator('#data-results .data-record').first().locator('dt', { hasText: '原文定位' }).count() === 1);
  await noOverflow(page, `${width}: data page has no horizontal overflow`);
  await page.screenshot({ path: path.join(out, `data-query-${width}.png`), fullPage: false, animations: 'disabled' });

  await page.locator('.route-tabs button[data-route="R2"]').click();
  check(`${width}: R2 filter shows five records`, await page.locator('#data-results .data-record').count() === 5);
  check(`${width}: R2 count is explicit`, (await page.locator('#result-count').textContent()).includes('5 / 21'));
  check(`${width}: filter is reflected in the URL`, page.url().includes('route=R2'));

  await page.locator('.route-tabs button[data-route=""]').click();
  await page.locator('#data-q').fill('BS306G');
  check(`${width}: keyword search finds the BS306G record`, await page.locator('#data-results .data-record').count() === 1);
  check(`${width}: keyword result keeps the 48 h value`, (await page.locator('#data-results .record-value').textContent()).includes('3.58 g/L'));

  await page.locator('#data-q').fill('BS999');
  check(`${width}: no match shows an explicit empty state`, await page.locator('.empty-results h2').textContent() === '没有对应实验数据');
  check(`${width}: empty state does not turn absence into zero`, (await page.locator('.empty-results').textContent()).includes('不表示结果为 0'));
  await page.locator('.empty-results [data-clear]').click();
  check(`${width}: clearing filters restores all records`, await page.locator('#data-results .data-record').count() === 21);

  await page.locator('#data-source').selectOption('Niu2024');
  check(`${width}: source filter shows seven R3 records`, await page.locator('#data-results .data-record').count() === 7);
  await page.locator('#data-source').selectOption('');
  await page.locator('#data-category').selectOption('身份/谱图');
  check(`${width}: category filter shows three identity records`, await page.locator('#data-results .data-record').count() === 3);

  await page.goto(pageUrl('data.html?route=R1&q=3830'));
  await page.locator('#data-results .data-record').first().waitFor();
  check(`${width}: deep link applies route and keyword`, await page.locator('#data-results .data-record').count() === 1);
  check(`${width}: deep link keeps R1 tab pressed`, await page.locator('.route-tabs button[data-route="R1"]').getAttribute('aria-pressed') === 'true');

  await page.goto(pageUrl('index.html'));
  await page.waitForFunction(() => /实时辅导|尚未配置|连接不可用/.test(document.querySelector('#ai-status')?.textContent || ''));
  const aiText = await page.locator('#ai-status').textContent();
  const badge = await page.locator('#ai-mode-badge').textContent();
  check(`${width}: AI status follows runtime configuration`, /实时辅导|尚未配置|连接不可用/.test(aiText));
  check(`${width}: fixed badge says local demo, not formal platform`, badge === '本机演示 · 未接入正式平台');
  check(`${width}: page never claims an unconnected model when configured`, !aiText.includes('未连接实时大模型'));
  if (aiText.includes('实时辅导')) check(`${width}: configured state keeps the local-demo boundary`, aiText.includes('未接入正式平台'));
  await context.close();
}

check('data page and workbench produce no console errors', consoleErrors.length === 0);
check('data page and workbench make no external requests', externals.length === 0);

const report = { base, browser: browser.version(), checks: results.length, consoleErrors, externals, results };
await fs.writeFile(path.join(out, 'data-browser-results.json'), JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify({ checks: report.checks, consoleErrors: consoleErrors.length, externals: externals.length }));
if (consoleErrors.length || externals.length) process.exitCode = 1;
