const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, ITEM } = require("./SportRibbonCardGroup.web.selectors");

class SportRibbonCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get items() {
    return this.element.$$(ITEM);
  }
}

module.exports = SportRibbonCardGroupPO;
