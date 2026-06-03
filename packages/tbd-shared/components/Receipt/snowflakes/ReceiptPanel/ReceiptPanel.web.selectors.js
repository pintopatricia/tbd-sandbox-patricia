const {
  RECEIPT_TITLE,
  RECEIPT_TITLE_BUTTON,
  RECEIPT_TITLE_DISMISS_BUTTON,
  STATUS_COLOR,
} = require("@ppb/the-wall-web/components/walls/ReceiptTitle/ReceiptTitle.selectors");
const TEST_ID = require("./ReceiptPanel.web.modules.json").receipt;

module.exports = {
  TEST_ID,
  DONE: `${RECEIPT_TITLE_BUTTON}`,
  DISMISS_BUTTON: `${RECEIPT_TITLE_DISMISS_BUTTON}`,
  TITLE: `${RECEIPT_TITLE}`,
  STATUS_COLOR: `${STATUS_COLOR}`,
};
