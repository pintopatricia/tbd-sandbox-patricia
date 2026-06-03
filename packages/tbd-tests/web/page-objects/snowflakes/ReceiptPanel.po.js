const { ICON_CONTAINER, MESSAGE } = require("@ppb/the-wall-web/components/bricks/Alert/Alert.selectors");
const {
  LEFT_LABEL,
  RIGHT_LABEL,
  RIGHT_VALUE_CONTAINER,
  LEFT_VALUE_CONTAINER,
} = require("@ppb/the-wall-web/components/bricks/BetSegments/BetSegments.selectors");
const { TEST_ID: BET_DETAILS_TEST_ID } = require("@ppb/the-wall-web/components/walls/BetDetails/BetDetails.selectors");
const {
  TEST_ID,
  DONE,
  TITLE,
  DISMISS_BUTTON,
  STATUS_COLOR,
} = require("@ppb/tbd-shared/components/Receipt/snowflakes/ReceiptPanel/ReceiptPanel.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ReceiptPanelPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get betDetails() {
    return this.element.$$(BET_DETAILS_TEST_ID);
  }

  get receiptTitle() {
    return this.element.$(TITLE);
  }

  get receiptStatus() {
    return this.element.$(STATUS_COLOR);
  }

  get done() {
    return this.element.$(DONE);
  }

  get dismissButton() {
    return this.element.$(DISMISS_BUTTON);
  }

  get cashoutValue() {
    return this.element.$(LEFT_VALUE_CONTAINER);
  }

  get cashoutLabel() {
    return this.element.$(LEFT_LABEL);
  }

  get profitOrLiability() {
    return this.element.$(RIGHT_VALUE_CONTAINER);
  }

  get profitOrLiabilityLabel() {
    return this.element.$(RIGHT_LABEL);
  }

  get notificationIcon() {
    return this.element.$(ICON_CONTAINER);
  }

  get notificationMessage() {
    return this.element.$(MESSAGE);
  }
}

module.exports = ReceiptPanelPO;
