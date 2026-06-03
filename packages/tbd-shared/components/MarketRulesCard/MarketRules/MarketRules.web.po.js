const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, TITLE, SECTION, FOOTER } = require("./MarketRules.web.selectors");

module.exports = class MarketRulestPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get sections() {
    return this.element.$$(SECTION);
  }

  get footer() {
    return this.element.$(FOOTER);
  }

  get footerLink() {
    return this.element.$(`${FOOTER} a`);
  }
};
