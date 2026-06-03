const { TEST_ID, COUNTER, ACTIVE, CHECKED_ON } = require("@ppb/the-wall-web/components/bricks/Pebble/Pebble.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PebblePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get states() {
    return {
      active: ACTIVE.replace(".", ""),
      checked: CHECKED_ON.replace(".", ""),
    };
  }

  get counter() {
    return this.element.$(COUNTER);
  }
}

module.exports = PebblePO;
