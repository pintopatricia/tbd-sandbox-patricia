const {
  TEST_ID,
  ICON,
  SELECTED,
  DISABLED,
} = require("@ppb/the-wall-web/components/bricks/PromoButton/PromoButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PromoButtonPO extends BasePO {
  /**
   * Creates a odds movement page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get icon() {
    return this.element.$(ICON);
  }

  static get states() {
    return {
      selected: SELECTED.replace(".", ""),
      disabled: DISABLED.replace(".", ""),
    };
  }
}

module.exports = PromoButtonPO;
