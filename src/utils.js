import { presets } from './presets';

const asyncCall = (global, cb) =>
  new Promise((resolve, reject) => {
    global.setTimeout(() => {
      try {
        resolve(cb());
      } catch (error) {
        reject(error);
      }
    });
  });

export const getPreset = (id, global) =>
  asyncCall(global, () => presets[id] || '0% 0% 0% 0%');

export const generateGuachimanId = (
  rootId,
  { rootMargin, threshold },
  global
) =>
  asyncCall(global, () => {
    return `${rootId}-${rootMargin.replaceAll(' ', '')}-${threshold}`;
  });

export const getRootId = (root, perf, global) =>
  asyncCall(global, () => {
    const idPrefix = 'gchmn';

    if (!root) {
      return idPrefix;
    }

    const { gchmnId = `${idPrefix}-${perf.now()}` } = root.dataset;

    root.dataset.gchmnId = gchmnId;

    return `${gchmnId}`;
  });

export const detectIntersections = (
  guachiman,
  entries,
  cbIn,
  cbOut,
  isTrackOnce
) => {
  entries.forEach((entry) => {
    if (isIntersecting(entry)) {
      notifyIntersection(entry, guachiman, cbIn, isTrackOnce);
    } else {
      cbOut(entry.target);
    }
  });
};

const notifyIntersection = (entry, guachiman, cbIn, isTrackOnce) => {
  cbIn(entry.target);

  if (isTrackOnce) {
    guachiman.io.unobserve(entry.target);
    guachiman.elementsTracked.delete(entry.target);
  }
};

const isIntersecting = (entry) => {
  return entry.isIntersecting;
};
