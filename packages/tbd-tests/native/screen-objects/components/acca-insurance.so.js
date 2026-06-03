const {
  ACCA_INSURANCE,
  ACCA_INSURANCE_SUBTITLE,
  ACCA_INSURANCE_TERMS_LINK,
} = require("@ppb/the-wall-native/components/Betslip/AccaInsurance/AccaInsurance.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class AccaInsuranceSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${ACCA_INSURANCE}`));
  }

  get subtitle() {
    return this.element.$(`~${ACCA_INSURANCE_SUBTITLE}`);
  }

  get termsLink() {
    return this.element.$(`~${ACCA_INSURANCE_TERMS_LINK}`);
  }
}

module.exports = AccaInsuranceSO;
