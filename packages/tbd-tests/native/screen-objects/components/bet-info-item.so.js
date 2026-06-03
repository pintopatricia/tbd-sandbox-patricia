const {
  BET_INFO_ITEM,
  BET_INFO_ITEM_LABEL,
  BET_INFO_ITEM_CONTENT_TEXT,
} = require("@ppb/the-wall-native/components/bricks/BetInfo/BetInfo.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetInfoItemSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_INFO_ITEM}`));
  }

  get label() {
    return this.element.$(`~${BET_INFO_ITEM_LABEL}`);
  }

  // Use CopyToClipboardPO to get copy value
  get contentText() {
    return this.element.$(`~${BET_INFO_ITEM_CONTENT_TEXT}`);
  }
}

module.exports = BetInfoItemSO;
