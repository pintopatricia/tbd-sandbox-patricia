const {
  TEST_ID,
  SUBTITLE,
  TERMS_LINK,
} = require("@ppb/the-wall-web/components/rooms/AccaInsurance/AccaInsurance.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class AccaInsurancePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  get termsLink() {
    return this.element.$(TERMS_LINK);
  }
}

module.exports = AccaInsurancePO;
