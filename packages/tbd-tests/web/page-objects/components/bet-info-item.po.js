const {
  BET_INFO_ITEM,
  BET_INFO_ITEM_LABEL,
  BET_INFO_ITEM_CONTENT_TEXT,
} = require("@ppb/the-wall-web/components/bricks/BetInfo/BetInfo.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetInfoItemPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(BET_INFO_ITEM));
  }

  get label() {
    return this.element.$(BET_INFO_ITEM_LABEL);
  }

  // Use CopyToClipboardPO to get copy value
  get contentText() {
    return this.element.$(BET_INFO_ITEM_CONTENT_TEXT);
  }
}

module.exports = BetInfoItemPO;
