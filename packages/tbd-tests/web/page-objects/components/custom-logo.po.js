const {
  TEST_ID,
  CUSTOM_LOGO_SOURCE,
} = require("@ppb/tbd-shared/components/GameCard/snowflakes/GameTile/CustomLogo/CustomLogo.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class BadgePo extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get customLogoSource() {
    return this.element.$(CUSTOM_LOGO_SOURCE);
  }
};
