// A view preference only: resizing never re-renders or changes a practice record.
export const SIDEBAR_STORAGE_KEY = 'flavoglycolab.tutor-width.v1';

export function initSidebarResize() {
  const workspace = document.querySelector('.workspace');
  const handle = document.querySelector('#tutor-resizer');
  const panel = document.querySelector('#tutor-panel');
  const resetButton = document.querySelector('#reset-tutor-width');
  if (!workspace || !handle || !panel || !resetButton) return;

  const desktop = window.matchMedia('(min-width: 951px)');
  let preferredWidth = null;
  let drag = null;
  try {
    const value = Number(localStorage.getItem(SIDEBAR_STORAGE_KEY));
    if (Number.isFinite(value) && value >= 280 && value <= 600) preferredWidth = value;
  } catch { /* Unavailable storage must not prevent resizing. */ }

  function bounds() {
    const railWidth = document.querySelector('#workflow').getBoundingClientRect().width;
    const available = workspace.getBoundingClientRect().width - railWidth - 12 - 420;
    return { min: 280, max: Math.max(280, Math.min(600, Math.floor(available))) };
  }
  const defaultWidth = () => innerWidth <= 1200 ? 300 : 350;
  function paint() {
    handle.tabIndex = desktop.matches ? 0 : -1;
    if (!desktop.matches) return;
    const { min, max } = bounds();
    const width = Math.round(Math.max(min, Math.min(max, preferredWidth ?? defaultWidth())));
    workspace.style.setProperty('--tutor-width', `${width}px`);
    handle.setAttribute('aria-valuemin', String(min));
    handle.setAttribute('aria-valuemax', String(max));
    handle.setAttribute('aria-valuenow', String(width));
    handle.setAttribute('aria-valuetext', `${width} 像素`);
  }
  function remember() {
    try {
      if (preferredWidth === null) localStorage.removeItem(SIDEBAR_STORAGE_KEY);
      else localStorage.setItem(SIDEBAR_STORAGE_KEY, String(preferredWidth));
    } catch { /* The current viewport remains usable without persistence. */ }
  }
  function setWidth(value) {
    const { min, max } = bounds();
    preferredWidth = Math.round(Math.max(min, Math.min(max, value)));
    paint();
  }
  function finish(commit) {
    if (!drag) return;
    const previous = drag;
    drag = null;
    if (!commit) preferredWidth = previous.preference;
    document.documentElement.classList.remove('resizing-tutor');
    if (handle.hasPointerCapture(previous.id)) handle.releasePointerCapture(previous.id);
    paint();
    if (commit) remember();
  }
  function reset() {
    finish(false);
    preferredWidth = null;
    paint();
    remember();
  }
  handle.addEventListener('pointerdown', event => {
    if (!desktop.matches || drag || !event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    handle.focus({ preventScroll: true });
    drag = { id: event.pointerId, x: event.clientX, width: panel.getBoundingClientRect().width, preference: preferredWidth };
    handle.setPointerCapture(event.pointerId);
    document.documentElement.classList.add('resizing-tutor');
  });
  handle.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    setWidth(drag.width + drag.x - event.clientX);
  });
  handle.addEventListener('pointerup', event => {
    if (drag?.id === event.pointerId) finish(true);
  });
  handle.addEventListener('pointercancel', event => {
    if (drag?.id === event.pointerId) finish(false);
  });
  handle.addEventListener('lostpointercapture', event => {
    if (drag?.id === event.pointerId) finish(false);
  });
  handle.addEventListener('dblclick', reset);
  handle.addEventListener('keydown', event => {
    if (!desktop.matches || drag) return;
    const width = panel.getBoundingClientRect().width;
    const step = event.shiftKey ? 48 : 16;
    const { min, max } = bounds();
    if (event.key === 'ArrowLeft') setWidth(width + step);
    else if (event.key === 'ArrowRight') setWidth(width - step);
    else if (event.key === 'Home') setWidth(min);
    else if (event.key === 'End') setWidth(max);
    else if (event.key === 'Enter') reset();
    else return;
    event.preventDefault();
    remember();
  });
  resetButton.addEventListener('click', reset);
  document.addEventListener('keydown', event => {
    if (drag && event.key === 'Escape') {
      event.preventDefault();
      finish(false);
    }
  });
  window.addEventListener('blur', () => finish(false));
  window.addEventListener('resize', () => { finish(false); paint(); });
  window.addEventListener('storage', event => {
    if (event.key !== SIDEBAR_STORAGE_KEY || drag) return;
    const value = Number(event.newValue);
    preferredWidth = Number.isFinite(value) && value >= 280 && value <= 600 ? value : null;
    paint();
  });
  paint();
}
