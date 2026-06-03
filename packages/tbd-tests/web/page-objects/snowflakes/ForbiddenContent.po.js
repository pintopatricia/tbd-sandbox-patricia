const {
  TEST_ID,
  ICON,
  LABEL,
} = require("@ppb/tbd-shared/components/ForbiddenContentCard/snowflakes/ForbiddenContent/ForbiddenContent.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ForbiddenContentPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get icon() {
    return this.element.$(ICON);
  }

  get label() {
    return this.element.$(LABEL);
  }
}

module.exports = ForbiddenContentPO;
