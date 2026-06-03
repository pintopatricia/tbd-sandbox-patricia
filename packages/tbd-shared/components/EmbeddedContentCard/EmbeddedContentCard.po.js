const { BasePO } = require("@ppb/wdio-lazy-element");

const {
  TEST_ID,
  TITLE,
} = require("@ppb/tbd-components-rich-data/components/EmbeddedContentCard/view/EmbeddedContentCard.selectors");

module.exports = class EmbeddedContentCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }
};
