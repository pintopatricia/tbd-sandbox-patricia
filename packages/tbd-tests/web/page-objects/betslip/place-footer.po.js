const {
  TEST_ID,
  REMOVE_ALL_BTN,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookPlace/snowflakes/PlaceFooter/PlaceFooter.web.selectors");
const { PRIMARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");
const { TEST_ID: ALERT } = require("@ppb/the-wall-web/components/bricks/Alert/Alert.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PlaceFooterPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get freeBetsWalletsAlert() {
    return this.element.$(ALERT);
  }

  get removeAllButton() {
    return this.element.$(REMOVE_ALL_BTN);
  }

  get primaryButton() {
    return this.element.$(PRIMARY_BUTTON);
  }

  get depositLabel() {
    return this.element.$('//button[.//span[contains(text(), "Deposit to")]]');
  }
}

module.exports = PlaceFooterPO;
