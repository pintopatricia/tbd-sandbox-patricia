const {
  TEST_ID,
  ICON,
  TITLE,
  SUBTITLE,
} = require("@ppb/tbd-shared/components/UserProfile/SuccessfulDepositContent/SuccessfulDepositContent.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SuccessfulDepositContentPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get icon() {
    return this.element.$(ICON);
  }

  get title() {
    return this.element.$(TITLE);
  }

  get subtitle() {
    return this.element.$(SUBTITLE);
  }
}

module.exports = SuccessfulDepositContentPO;
