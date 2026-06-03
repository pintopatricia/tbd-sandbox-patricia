const {
  TEST_ID,
  LABEL,
  BUTTON,
} = require("@ppb/tbd-shared/components/GamesCardGroup/snowflakes/GamingCategoryLink/GamingCategoryLink.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class GamingCategoryLinkPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get label() {
    return this.element.$(LABEL);
  }

  get button() {
    return this.element.$(BUTTON);
  }
}

module.exports = GamingCategoryLinkPO;
