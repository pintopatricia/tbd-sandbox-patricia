const LazyElement = require("./lazy-element");
const LazyElementGroup = require("./lazy-element-group");
const BasePO = require("./base.po");
const BaseSO = require("./base.so");

/**
 * Override for LazyElement.$ and LazyElementGroup.$
 * @param {string} selector The element selector
 * @returns {LazyElement} A Lazy Element
 */
function findChildElement(selector) {
  return new LazyElement({ parent: this, selector });
}

/**
 * Override for LazyElement.$$ and LazyElementGroup.$$
 * @param {string} selector The element selector
 * @returns {LazyElementGroup} A Lazy Element Group
 */
function findChildElements(selector) {
  return new LazyElementGroup({ parent: this, selector });
}

LazyElement.prototype.$ = findChildElement;
LazyElement.prototype.$$ = findChildElements;
LazyElementGroup.prototype.$ = findChildElement;
LazyElementGroup.prototype.$$ = findChildElements;

// webdriverio ESM doesn't allow access to functions
const functionNames = [
  "addValue",
  "clearValue",
  "click",
  "doubleClick",
  "dragAndDrop",
  "getAttribute",
  "getHTML",
  "getLocation",
  "getSize",
  "getText",
  "getValue",
  "isClickable",
  "isDisplayed",
  "isDisplayedInViewport",
  "isEnabled",
  "isExisting",
  "isFocused",
  "isSelected",
  "moveTo",
  "saveScreenshot",
  "scrollIntoView",
  "setValue",
  "waitForClickable",
  "waitForDisplayed",
  "waitForEnabled",
  "waitForExist",
  "waitUntil",
];

/**
 * Override all the Element functions so the full element chain is solved here
 */
functionNames.forEach((functionName) => {
  LazyElement.prototype[functionName] = function getLazyElementAndCall(...args) {
    const getElementAndApplyFn = async () => {
      const compoundSelector = driver.isIOS && this.getCompoundSelector();

      if (compoundSelector && compoundSelector.indexOf("undefined") > 0) {
        throw new Error(`There's an 'undefined' element in the DOM selector, please, review your SO file`);
      }

      const element = compoundSelector ? await browser.$(compoundSelector) : await this.getElement();

      if (!element) {
        throw new Error("Element not in DOM. Probably accessed out of bounds in $$() array");
      }

      return element[functionName](...args);
    };

    return getElementAndApplyFn().catch((error) => {
      const selector = driver.isIOS ? `$(${this.getCompoundSelector()})` : this.getSelector();

      console.log(
        `Lazy element failed for ${functionName}(${args}) with error:\n${error}\nSelector was: ${selector}.\nRe-attempting once\n`,
      );

      return getElementAndApplyFn().catch((secondError) => {
        // this should never happen with the
        // "does not exist in DOM anymore" error
        console.log(
          `AGAIN Lazy element failed for ${functionName}(${args}) with error:\n${secondError}\nNot attempting anymore\n`,
        );

        throw secondError;
      });
    });
  };
});

module.exports = {
  /**
   * Function to override the $ selector
   * @param {string} selector
   */
  findElementLazy: function $(selector) {
    return new LazyElement({ selector });
  },
  /**
   * Function to override the $$ selector
   * @param {string} selector
   */
  findElementsLazy: function $$(selector) {
    return new LazyElementGroup({ selector });
  },
  LazyElement,
  LazyElementGroup,
  BasePO,
  BaseSO,
};
