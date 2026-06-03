const {
  RECEIPT_TITLE,
  RECEIPT_STATUS,
  RECEIPT_LABEL,
  RECEIPT_DISMISS_ICON_BUTTON,
} = require("@ppb/the-wall-native/components/BetReceipt/ReceiptTitle/ReceiptTitle.selectors");
const { ACTION_LINK } = require("@ppb/the-wall-native/components/ActionLink/ActionLink.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ReceiptTitleSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RECEIPT_TITLE}`));
  }

  get status() {
    return this.element.$(`~${RECEIPT_STATUS}`);
  }

  get label() {
    return this.element.$(`~${RECEIPT_LABEL}`);
  }

  get done() {
    return this.element.$(`~${ACTION_LINK}`);
  }

  get dismissButton() {
    return this.element.$(`~${RECEIPT_DISMISS_ICON_BUTTON}`);
  }
}

module.exports = ReceiptTitleSO;
