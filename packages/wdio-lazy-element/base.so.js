const LazyElement = require("./lazy-element");
const LazyElementGroup = require("./lazy-element-group");
class BaseSO {
  constructor(lazyElement, defaultLazyElement) {
    if (lazyElement && !(lazyElement instanceof LazyElement || lazyElement instanceof LazyElementGroup)) {
      throw new TypeError(
        `You must pass a lazy element to create a screen object! Element: ${JSON.stringify(lazyElement)}`,
      );
    }

    this.element = lazyElement || defaultLazyElement;
  }

  bySelector(selector) {
    return this.element.$(`~${selector}`);
  }
}

module.exports = BaseSO;
