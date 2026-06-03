const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  QUICK_LINKS,
  TITLES,
  COLLAPSE_TITLES,
  QUICKLINKS_LIST,
} = require("./FutureRacingCardGroup.web.selectors");

module.exports = class FutureRacingCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get titles() {
    return this.element.$$(TITLES);
  }

  get quickLinksContainers() {
    return this.element.$$(QUICK_LINKS);
  }

  get collapseTitles() {
    return this.element.$$(COLLAPSE_TITLES);
  }

  get quicklinks() {
    return this.element.$$(QUICKLINKS_LIST);
  }
};
