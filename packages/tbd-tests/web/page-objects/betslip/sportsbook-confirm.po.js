const { TEST_ID } = require("@ppb/tbd-shared/components/Betslip/SportsbookConfirm/SportsbookConfirm.web.selectors");
const { PRIMARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");
const { SECONDARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/SecondaryButton/SecondaryButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SportsbookConfirmPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get place() {
    return this.element.$(PRIMARY_BUTTON);
  }

  get edit() {
    return this.element.$(SECONDARY_BUTTON);
  }
}

module.exports = SportsbookConfirmPO;
