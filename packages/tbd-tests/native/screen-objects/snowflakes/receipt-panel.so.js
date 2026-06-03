const {
  RECEIPT_PANEL,
} = require("@ppb/tbd-shared/components/Receipt/snowflakes/ReceiptPanel/ReceiptPanel.native.selectors");
const { ICON_CONTAINER, MESSAGE, DETAIL } = require("@ppb/the-wall-native/components/Alert/Alert.selectors");
const {
  BET_DETAILS_TITLE,
  BET_DETAILS_SUBTITLE,
} = require("@ppb/the-wall-native/components/BetDetails/BetDetails.selectors");
const {
  BET_SEGMENTS_LEFT_SEGMENT,
  BET_SEGMENTS_RIGHT_SEGMENT,
} = require("@ppb/the-wall-native/components/BetReceipt/BetSegments/BetSegments.selectors");
const {
  BET_SEGMENTS_VALUE,
  BET_SEGMENTS_TERM,
} = require("@ppb/the-wall-native/components/BetReceipt/BetSegments/SelectionSegment/SelectionSegment.selectors");
const {
  RECEIPT_DISMISS_ICON_BUTTON,
} = require("@ppb/the-wall-native/components/BetReceipt/ReceiptTitle/ReceiptTitle.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ReceiptPanelSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RECEIPT_PANEL}`));
  }

  get dismissButton() {
    return this.element.$(`~${RECEIPT_DISMISS_ICON_BUTTON}`);
  }

  get notificationIcon() {
    return this.element.$(`~${ICON_CONTAINER}`);
  }

  get notificationMessage() {
    return this.element.$(`~${MESSAGE}`);
  }

  get notificationDetail() {
    return this.element.$(`~${DETAIL}`);
  }

  get betDetailsTitle() {
    return this.element.$(`~${BET_DETAILS_TITLE}`);
  }

  get betDetailsSubtitle() {
    return this.element.$(`~${BET_DETAILS_SUBTITLE}`);
  }

  get betLeftSegment() {
    return this.element.$(`~${BET_SEGMENTS_LEFT_SEGMENT}`);
  }

  get betRightSegment() {
    return this.element.$(`~${BET_SEGMENTS_RIGHT_SEGMENT}`);
  }

  get cashoutLabel() {
    return this.betLeftSegment.$(`~${BET_SEGMENTS_TERM}`);
  }

  get cashoutValue() {
    return this.betLeftSegment.$(`~${BET_SEGMENTS_VALUE}`);
  }

  get profitLabel() {
    return this.betRightSegment.$(`~${BET_SEGMENTS_TERM}`);
  }

  get profitValue() {
    return this.betRightSegment.$(`~${BET_SEGMENTS_VALUE}`);
  }
}

module.exports = ReceiptPanelSO;
