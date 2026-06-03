const { TEST_ID, PEBBLES, ACTIVE } = require("@ppb/the-wall-web/components/walls/PebbleList/PebbleList.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PebbleListPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get pebbles() {
    return this.element.$$(PEBBLES);
  }

  static get states() {
    return {
      active: ACTIVE.replace(".", ""),
    };
  }
}

module.exports = PebbleListPO;
