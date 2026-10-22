// Local structure viewer. Geometry is computed, never an experimental observation.
const DATA_URL = new URL('./assets/molecules/isoquercitrin.json', import.meta.url);
const LIBRARY_URL = new URL('./vendor/3dmol/3Dmol-min.js', import.meta.url);
const FALLBACK_URL = new URL('./assets/molecules/isoquercitrin-2d.svg', import.meta.url);
const COLORS = { C: '#294f55', O: '#d76b5b', H: '#cbd4d5' };
let libraryPromise, dataPromise;
const instances = new WeakMap();

// 3Dmol 2.5.5 has no viewer disposer. Capture its three global listeners only
// during the synchronous constructor, then immediately restore the native methods.
function createDisposableViewer(library, host, cleanup) {
  const targets = [window, document.body];
  const originals = targets.map(target => ({
    target, descriptor: Object.getOwnPropertyDescriptor(target, 'addEventListener'),
    method: target.addEventListener
  }));
  try {
    for (const { target, method } of originals) {
      target.addEventListener = function (type, listener, options) {
        cleanup.push(() => target.removeEventListener(type, listener, options));
        return method.call(target, type, listener, options);
      };
    }
    return library.createViewer(host, { backgroundColor: '#f8faf9', backgroundAlpha: 0, antialias: true });
  } finally {
    for (const { target, descriptor } of originals) {
      if (descriptor) Object.defineProperty(target, 'addEventListener', descriptor);
      else delete target.addEventListener;
    }
  }
}

function loadLibrary() {
  if (globalThis.$3Dmol?.createViewer) return Promise.resolve(globalThis.$3Dmol);
  if (globalThis['3Dmol']?.createViewer) return Promise.resolve(globalThis['3Dmol']);
  if (!libraryPromise) {
    libraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = LIBRARY_URL.href;
      script.async = true;
      script.onload = () => {
        const library = globalThis.$3Dmol ?? globalThis['3Dmol'];
        if (library?.createViewer) resolve(library);
        else { script.remove(); reject(new Error('分子查看器加载失败')); }
      };
      script.onerror = () => { script.remove(); reject(new Error('分子查看器加载失败')); };
      document.head.append(script);
    }).catch(error => { libraryPromise = null; throw error; });
  }
  return libraryPromise;
}

function loadData() {
  if (!dataPromise) dataPromise = fetch(DATA_URL).then(response => {
    if (!response.ok) throw new Error('结构文件暂不可用');
    return response.json();
  }).then(data => {
    if (data.source_id !== 'ChEBI:68352' || data.crosscheck_id !== 'PubChem:5280804' ||
        data.geometry_kind !== 'computed_conformer_not_observed' ||
        typeof data.sdf !== 'string' || typeof data.smiles !== 'string') {
      throw new Error('结构文件身份不匹配');
    }
    return data;
  }).catch(error => { dataPromise = null; throw error; });
  return dataPromise;
}

/**
 * Mount the offline isoquercitrin viewer into a sized HTMLElement.
 * Methods: reset(), setStyle('ball-stick'|'stick'|'sphere'|'2d'),
 * highlight('sugar'|'aglycone'|'linkage'|null), destroy().
 * WebGL failure preserves the exact generated 2D structure and readable SMILES.
 * No animation loop runs, including when reducedMotion is false.
 */
export async function mountMolecule(element, { reducedMotion = false } = {}) {
  instances.get(element)?.destroy();
  let viewer = null, resizeObserver = null, destroyed = false, model = null;
  let style = 'ball-stick', group = null, data = null, initialView = null;
  const globalCleanup = [];
  const host = document.createElement('div');
  host.className = 'molecule-canvas';
  Object.assign(host.style, { position: 'relative', width: '100%', height: '100%', minHeight: '220px' });
  host.tabIndex = 0;
  host.setAttribute('role', 'group');
  host.setAttribute('aria-label', '异槲皮苷三维结构。拖动或方向键旋转，加减键缩放，Home键复位。');
  const status = document.createElement('p');
  status.className = 'molecule-viewer-status';
  status.setAttribute('role', 'status');
  status.textContent = '正在打开分子结构…';
  Object.assign(status.style, { position: 'absolute', inset: 'auto 12px 8px', margin: '0', textAlign: 'center', fontSize: '11px', color: '#637b7e', pointerEvents: 'none' });
  host.append(status);
  element.replaceChildren(host);
  element.dataset.moleculeState = 'loading';
  const keyListener = event => {
    if (!viewer || style === '2d') return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      viewer.rotate(event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -12 : 12,
        event.key === 'ArrowLeft' || event.key === 'ArrowRight' ? 'y' : 'x', 0);
      viewer.render();
    } else if (['+', '=', '-', '_'].includes(event.key)) {
      event.preventDefault(); viewer.zoom(['+', '='].includes(event.key) ? 1.15 : 0.87, 0); viewer.render();
    } else if (event.key === 'Home') { event.preventDefault(); controller.reset(); }
  };
  host.addEventListener('keydown', keyListener);

  function applyStyle() {
    if (!viewer || !model || style === '2d') return;
    const sphere = style === 'sphere' ? { scale: .78 } : { scale: .25 };
    const base = style === 'stick' ? { stick: { radius: .13 } } :
      style === 'sphere' ? { sphere } : { stick: { radius: .1 }, sphere };
    const colorFor = atom => {
      if (group && data.atom_groups[group]?.includes(atom.index)) {
        return group === 'linkage' ? '#e0a548' : group === 'sugar' ? '#40a99c' : '#6479b8';
      }
      return COLORS[atom.elem] ?? '#657c7e';
    };
    const colored = Object.fromEntries(Object.entries(base).map(([name, spec]) => [name, { ...spec, colorfunc: colorFor }]));
    model.setStyle({}, colored);
    viewer.render();
  }
  function show2D(message) {
    if (destroyed) return;
    host.querySelector('.molecule-fallback')?.remove();
    const wrap = document.createElement('div');
    wrap.className = 'molecule-fallback';
    Object.assign(wrap.style, { position: 'absolute', inset: '0', background: '#f8faf9', display: 'flex', flexDirection: 'column', justifyContent: 'center' });
    const img = document.createElement('img');
    img.src = FALLBACK_URL.href;
    img.alt = '异槲皮苷二维结构，由CHEBI:68352的立体SMILES绘制：槲皮素3-O位连接β-D-葡萄吡喃糖基。';
    Object.assign(img.style, { width: '100%', height: 'calc(100% - 40px)', objectFit: 'contain' });
    wrap.append(img);
    if (data?.smiles) {
      const details = document.createElement('details');
      details.className = 'molecule-smiles';
      Object.assign(details.style, { padding: '0 14px 26px', fontSize: '11px' });
      const summary = document.createElement('summary'); summary.textContent = '查看立体 SMILES';
      const text = document.createElement('code'); text.textContent = data.smiles; text.style.overflowWrap = 'anywhere';
      details.append(summary, text); wrap.append(details);
    }
    host.append(wrap, status);
    status.textContent = message;
    element.dataset.moleculeState = '2d';
  }
  function onContextLoss(event) {
    event.preventDefault();
    style = '2d';
    show2D('三维显示已中断 · 已保留二维结构');
  }
  const controller = {
    get data() { return data; },
    get mode() { return element.dataset.moleculeState; },
    reset() {
      if (destroyed) return;
      group = null;
      if (viewer && style !== '2d') { viewer.setView(initialView); applyStyle(); }
    },
    setStyle(value) {
      if (destroyed || !['ball-stick', 'stick', 'sphere', '2d'].includes(value)) return;
      style = value;
      if (value === '2d' || !viewer) { show2D(viewer ? '二维连接结构 · ChEBI 68352' : '三维暂不可用 · 二维结构仍可查看'); return; }
      host.querySelector('.molecule-fallback')?.remove();
      element.dataset.moleculeState = 'ready';
      status.textContent = '';
      applyStyle(); viewer.resize();
    },
    highlight(value) {
      if (destroyed) return;
      group = data?.atom_groups[value] ? value : null;
      applyStyle();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      resizeObserver?.disconnect();
      globalCleanup.splice(0).forEach(remove => remove());
      host.removeEventListener('keydown', keyListener);
      host.querySelector('canvas')?.removeEventListener('webglcontextlost', onContextLoss);
      // 3Dmol's clear() frees model geometry; context release also frees the GPU slot.
      if (viewer) {
        viewer.divwatcher?.disconnect();
        viewer.intwatcher?.disconnect();
        const gl = viewer.renderer?.getContext?.();
        viewer.clear();
        host.remove();
        gl?.getExtension('WEBGL_lose_context')?.loseContext();
      }
      host.remove();
      if (instances.get(element) === controller) instances.delete(element);
      viewer = null;
    }
  };
  instances.set(element, controller);
  try {
    data = await loadData();
    if (destroyed) return controller;
    const library = await loadLibrary();
    if (destroyed) return controller;
    viewer = createDisposableViewer(library, host, globalCleanup);
    model = viewer.addModel(data.sdf, 'sdf', { keepH: false });
    if (model.selectedAtoms({}).length !== 33) throw new Error('分子原子数不匹配');
    applyStyle();
    viewer.zoomTo(); viewer.rotate(12, 'x', 0); viewer.rotate(8, 'y', 0); viewer.zoom(.88, 0); viewer.render();
    initialView = viewer.getView();
    host.querySelector('canvas')?.addEventListener('webglcontextlost', onContextLoss);
    resizeObserver = new ResizeObserver(() => { if (!destroyed && viewer && element.isConnected) viewer.resize(); });
    resizeObserver.observe(element);
    element.dataset.moleculeState = 'ready';
    element.dataset.geometry = data.geometry_kind;
    element.dataset.reducedMotion = String(reducedMotion);
    status.textContent = '';
    // The host remains keyboard-focusable; WebGL canvas is decorative to screen readers.
    host.querySelectorAll('canvas').forEach(canvas => canvas.setAttribute('aria-hidden', 'true'));
    host.append(status);
  } catch (error) {
    if (!destroyed) {
      style = '2d';
      show2D(data ? '三维暂不可用 · 已展示二维结构' : '结构文件暂不可用 · 可查看二维连接示意');
      element.dataset.moleculeError = error.message;
    }
  }
  return controller;
}
