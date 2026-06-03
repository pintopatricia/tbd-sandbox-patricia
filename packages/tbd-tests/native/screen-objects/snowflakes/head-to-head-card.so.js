const { HEAD_TO_HEAD } = require("@ppb/the-wall-native/components/HeadToHead/HeadToHeadCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class HeadToHeadCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${HEAD_TO_HEAD}`));
  }
}

module.exports = HeadToHeadCardSO;
