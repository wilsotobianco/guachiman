import {
  IntersectionObserverDoesNotExist,
  WrongParametersGuachimanError,
} from './errors';
import {
  getPreset,
  getRootId,
  generateGuachimanId,
  detectIntersections,
} from './utils';

/**
 * TODO: Think about implementing pixel measurements with offset.
 */
class Guachiman {
  constructor(global, config = {}) {
    this.config_ = config;
    this.global_ = global;

    this.validateParameters_();

    this.performance_ = this.global_.performance;
    this.guachimans_ = {};
  }

  async observe(
    elements,
    callbackIn,
    callbackOut,
    {
      isTrackOnce = false,
      root = null,
      threshold = 0,
      rootMargin = '0% 0% 0% 0%',
      preset = false,
    } = {}
  ) {
    rootMargin = !preset ? rootMargin : await getPreset(preset, this.global_);

    const rootId = await getRootId(root, this.performance_, this.global_);
    const ioConfig = { root, threshold, rootMargin };
    const id = await generateGuachimanId(rootId, ioConfig, this.global_);

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

  setUpNewGuachiman_(id, callbackIn, callbackOut, isTrackOnce, ioConfig) {
    const io = new IntersectionObserver(
      this.handleIntersection_(id, callbackIn, callbackOut, isTrackOnce),
      ioConfig
    );

    return { io, elementsTracked: new Set([]) };
  }

  trackNewElements_(guachiman, elements) {
    guachiman.elementsTracked = new Set([
      ...guachiman.elementsTracked,
      ...elements,
    ]);

    guachiman.elementsTracked.forEach((elem) => guachiman.io.observe(elem));
  }

  /**
   * TODO: activate the polyfill.
   */
  activatePolyfill_() {}

  validateParameters_() {
    if (!this.global_) {
      throw new WrongParametersGuachimanError();
    } else if (!('IntersectionObserver' in this.global_)) {
      if (this.config_.activatePolyfill) {
        this.activatePolyfill_();
      } else {
        throw new IntersectionObserverDoesNotExist();
      }
    }
  }
}

export default Guachiman;
