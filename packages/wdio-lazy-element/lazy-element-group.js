const LazyElement = require("./lazy-element");

class LazyElementGroup {
  /**
   * LazyElementGroup constructor.
   *
   * @param {string} selector Elements selector
   * @param {LazyElement} parent parent element
   */
  constructor({ selector, parent }) {
    this.getInnerSelector = () => `$$("${selector}")`;
    this.getSelector = () => `${this.getInnerSelector()}.getElement()`;

    this.getCompoundSelector = () => {
      const iOSselector = selector?.replace("~", "#") || "";

      if (parent && parent.getCompoundSelector && iOSselector) {
        return `${parent.getCompoundSelector()} ${iOSselector}`;
      }

      return iOSselector;
    };

    // eslint-disable-next-line no-undef
    this.getElement = () => browser.$$(selector); // not monkey patched browser.$$

    if (parent) {
      this.getInnerSelector = () => `${parent.getInnerSelector()}.$$("${selector}")`;
      this.getElement = () =>
        parent.getElement().then((parentElement) => {
          if (!parentElement) {
            throw new Error(`Parent does not exist in the DOM anymore for selector: ${this.getInnerSelector()}`);
          }
          return parentElement.$$(selector);
        });
    }

    // eslint-disable-next-line no-constructor-return
    return new Proxy(this, {
      get(target, property) {
        if (Number.isInteger(Number(property))) {
          return new LazyElement({ parent: target, index: Number(property) });
        }
        return target[property];
      },
    });
  }

  /**
   * Gives us the number of Elements on the LazyElementGroup
   */
  get length() {
    return this.getElement().then((element) => element.length);
  }
}

module.exports = LazyElementGroup;
