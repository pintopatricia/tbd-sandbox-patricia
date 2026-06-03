const LazyElement = require("./lazy-element");
const LazyElementGroup = require("./lazy-element-group");

/**
 * Base Page Object class that serves as a foundation for creating page objects.
 * @throws {Error} Throws an error if the provided lazyElement is neither a LazyElement nor a LazyElementGroup instance.
 */
class BasePO {
  /**
   * @param {import("@ppb/wdio-lazy-element").LazyElement} lazyElement - The lazy element or lazy element group to use as the base element
   * @param {import("@ppb/wdio-lazy-element").LazyElement} defaultLazyElement - The default lazy element or lazy element group to use as the base element
   */
  constructor(lazyElement, defaultLazyElement) {
    if (lazyElement) {
      if (!(lazyElement instanceof LazyElement || lazyElement instanceof LazyElementGroup)) {
        throw new Error(
          `You must pass a lazy element to create a page object! Element: ${JSON.stringify(lazyElement)}`,
        );
      }
    }

    this.element = lazyElement || defaultLazyElement;
  }
}

module.exports = BasePO;
