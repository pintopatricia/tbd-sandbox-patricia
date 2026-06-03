const { TEST_ID, HEADER, TITLE } = require("@ppb/the-wall-web/components/bricks/CardGroup/CardGroup.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class CardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get header() {
    return this.element.$(HEADER);
  }

  get title() {
    return this.element.$(TITLE);
  }
};
