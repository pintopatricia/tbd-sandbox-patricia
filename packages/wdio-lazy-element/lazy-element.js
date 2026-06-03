/**
 * This class will replace the element returned by the wdio $.
 * This will be usefull to allow us to avoid async/awaits when creating new
 *  Page Objects and will allow us to use getters and chain promises.
 */
class LazyElement {
  /**
   *
   * @param {string} selector Element selector
   * @param {LazyElement} parent Element parent if it exists
   * @param {number} index Index of the pretended element. Used when retrieving an LazyElement
   *  from the LazyElementGroup class
   */
  constructor({ selector, parent, index }) {
    this.getInnerSelector = () => `$("${selector}")`;
    this.getSelector = () => `${this.getInnerSelector()}.getElement()`;

    this.getCompoundSelector = () => {
      const iOSselector = selector?.replace("~", "#") || "";

      if (parent && parent.getCompoundSelector && iOSselector) {
        return `${parent.getCompoundSelector()} ${iOSselector}`;
      }

      if (parent && parent.getCompoundSelector && index !== undefined) {
        return `${parent.getCompoundSelector()}:nth-child(${index + 1})`;
      }

      return iOSselector;
    };

    // eslint-disable-next-line no-undef
    this.getElement = () => browser.$(selector); // not monkey patched browser.$

    if (parent && Number.isInteger(index)) {
      this.getInnerSelector = () => `${parent.getInnerSelector()}[${index}]`;
      this.getElement = () =>
        parent.getElement().then((parentElement) => {
          if (!parentElement) {
            throw new Error(`Parent does not exist in the DOM anymore for selector: ${this.getInnerSelector()}`);
          }
          return parentElement[index];
        });
    } else if (parent) {
      this.getInnerSelector = () => `${parent.getInnerSelector()}.$("${selector}")`;
      this.getElement = () =>
        parent.getElement().then((parentElement) => {
          if (!parentElement) {
            throw new Error(`Parent does not exist in the DOM anymore for selector: ${this.getInnerSelector()}`);
          }
          return parentElement.$(selector);
        });
    }
  }
}

module.exports = LazyElement;
