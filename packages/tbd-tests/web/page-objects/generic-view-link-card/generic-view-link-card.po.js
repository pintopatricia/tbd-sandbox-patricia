const { TEST_ID } = require("@ppb/tbd-shared/components/GenericViewLinkCard/GenericViewLinkCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class GenericViewLinkCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = GenericViewLinkCardPO;
