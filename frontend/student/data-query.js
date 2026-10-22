const ROUTE_ORDER = ['R1', 'R2', 'R3'];

export function normalize(value) {
  return String(value ?? '').normalize('NFKC').toLowerCase();
}

export function recordText(record) {
  return [
    record.id, record.title, record.value, record.metric, record.conditions,
    record.location, record.boundary, record.category, record.route,
    record.source_id, ...(record.tags ?? []),
  ].join(' ');
}

export function queryRecords(records, filters = {}) {
  const terms = normalize(filters.q).trim().split(/\s+/).filter(Boolean);
  return (Array.isArray(records) ? records : []).filter((record) => {
    if (filters.route && record.route !== filters.route) return false;
    if (filters.source && record.source_id !== filters.source) return false;
    if (filters.category && record.category !== filters.category) return false;
    if (!terms.length) return true;
    const haystack = normalize(recordText(record));
    return terms.every((term) => haystack.includes(term));
  });
}

export function countByRoute(records) {
  const counts = Object.fromEntries(ROUTE_ORDER.map((route) => [route, 0]));
  for (const record of Array.isArray(records) ? records : []) {
    if (record.route in counts) counts[record.route] += 1;
  }
  return counts;
}

export function validRoute(value) {
  return ROUTE_ORDER.includes(value) ? value : '';
}

export function summarize(records, total) {
  const shown = Array.isArray(records) ? records.length : 0;
  const all = Number.isInteger(total) ? total : shown;
  return shown === all ? `显示全部 ${all} 条已登记记录` : `显示 ${shown} / ${all} 条已登记记录`;
}

export { ROUTE_ORDER };
