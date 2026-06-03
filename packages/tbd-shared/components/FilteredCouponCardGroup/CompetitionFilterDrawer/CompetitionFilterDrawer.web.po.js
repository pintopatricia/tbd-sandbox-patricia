const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, COMPETITION_BY_COUNTRY } = require("./CompetitionFilterDrawer.web.selectors");

module.exports = class FilteredCouponCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get competitionByCountry() {
    return this.element.$$(COMPETITION_BY_COUNTRY);
  }
};
