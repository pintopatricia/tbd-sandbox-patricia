const { SUB_HEADER } = require("@ppb/the-wall-native/components/Betslip/SubHeader/SubHeader.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SubHeaderSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SUB_HEADER}`));
  }
}

module.exports = SubHeaderSO;
