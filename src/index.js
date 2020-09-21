const generateGuachimanId = ({ rootMargin, threshold, rootId }) => {
  return `${rootId}-${rootMargin.replaceAll(' ', '')}-${threshold}`;
};

const getRootId = (root, perf) => {
  const idPrefix = 'gchmn';
  if (!root) {
    return idPrefix;
  }

  const { gchmnId = perf.now() } = root.dataset;

  root.dataset.gchmnId = gchmnId;

  return `${gchmnId}`;
};

class Guachiman {
  constructor(global) {
    this.global_ = global;

    this.performance_ = this.global_.performance;

    this.guachimans_ = {};
  }

  observe(
    elements,
    callbackIn,
    callbackOut,
    {
      once = false,
      root = null, // Remember to handle the root as an Id with performance.now().
      threshold = 0,
      rootMargin = '0px 0px 0px 0px',
    } = {}
  ) {
    const rootId = getRootId(root, this.performance_);
    const config = { once, threshold, rootMargin, rootId };
    const id = generateGuachimanId(config);

    if (!this.guachimans_[id]) {
      this.guachimans_[id] = new IntersectionObserver(
        this.handleIntersection_(callbackIn, callbackOut),
        config
      );
    }

    console.log(this.guachimans_);
    const guachiman = this.guachimans_[id];
    elements.forEach((elem) => guachiman.observe(elem));
  }

  handleIntersection_(callbackIn, callbackOut) {
    return (e, o) => {
      console.log(e, o, callbackIn, callbackOut);
    };
  }
}

export default Guachiman;
