const { BET_INFO, BET_INFO_ITEM } = require("@ppb/the-wall-native/components/bricks/BetInfo/BetInfo.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetInfo extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_INFO}`));
  }

  get infoItems() {
    return this.element.$$(`~${BET_INFO_ITEM}`);
  }
}

module.exports = BetInfo;
