const { BasePO } = require("@ppb/wdio-lazy-element");

const { TEST_ID, TITLE, CARD_CONTAINER } = require("./SelectableItemsCardGroup.web.selectors");

module.exports = class SelectableItemsCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get cardContainer() {
    return this.element.$(CARD_CONTAINER);
  }
};
