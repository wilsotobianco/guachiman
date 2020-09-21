/**
 * TODOS:
 * - Add customized exception to give clearer errors to the client.
 * - Think about a way to make the isTrackOnce configurable per `observe` call.
 */

const generateGuachimanId = (rootId, { rootMargin, threshold }) => {
  return `${rootId}-${rootMargin.replaceAll(' ', '')}-${threshold}`;
};

const getRootId = (root, perf) => {
  const idPrefix = 'gchmn';

  if (!root) {
    return idPrefix;
  }

  const { gchmnId = `${idPrefix}-${perf.now()}` } = root.dataset;

  root.dataset.gchmnId = gchmnId;

  return `${gchmnId}`;
};

const detectIntersections = (guachiman, entries, cbIn, cbOut, isTrackOnce) => {
  entries.forEach((entry) => {
    if (isIntersecting(entry)) {
      notifyIntersection(entry, guachiman, cbIn, isTrackOnce);
    } else {
      cbOut();
    }
  });
};

const notifyIntersection = (entry, guachiman, cbIn, isTrackOnce) => {
  cbIn();

  if (isTrackOnce) {
    guachiman.io.unobserve(entry.target);
    guachiman.elementsTracked.delete(entry.target);
    console.log('guachiman.io', guachiman);
  }
};

const isIntersecting = (entry) => {
  return entry.isIntersecting;
};

class Guachiman {
  constructor(global, config = {}) {
    this.global_ = global;
    this.config_ = config;
    this.performance_ = this.global_.performance;
    this.guachimans_ = {};
  }

  observe(
    elements,
    callbackIn,
    callbackOut,
    {
      isTrackOnce = false,
      root = null,
      threshold = 0,
      rootMargin = '0px 0px 0px 0px',
    } = {}
  ) {
    const rootId = getRootId(root, this.performance_);
    const ioConfig = { root, threshold, rootMargin };
    const id = generateGuachimanId(rootId, ioConfig);

    if (!this.guachimans_[id]) {
      this.guachimans_[id] = this.setUpNewGuachiman_(
        id,
        callbackIn,
        callbackOut,
        isTrackOnce,
        ioConfig
      );
    }

    const guachiman = this.guachimans_[id];

    this.trackNewElements_(guachiman, elements);
  }

  trackNewElements_(guachiman, elements) {
    guachiman.elementsTracked = new Set([
      ...guachiman.elementsTracked,
      ...elements,
    ]);

    guachiman.elementsTracked.forEach((elem) => guachiman.io.observe(elem));
  }

  setUpNewGuachiman_(id, callbackIn, callbackOut, isTrackOnce, ioConfig) {
    const io = new IntersectionObserver(
      this.handleIntersection_(id, callbackIn, callbackOut, isTrackOnce),
      ioConfig
    );

    return { io, elementsTracked: new Set([]) };
  }

  handleIntersection_(id, callbackIn, callbackOut, isTrackOnce) {
    return (entries) =>
      detectIntersections(
        this.guachimans_[id],
        entries,
        callbackIn,
        callbackOut,
        isTrackOnce
      );
  }
}

export default Guachiman;
