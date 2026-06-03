const { SHARE } = require("@ppb/tbd-shared/components/BetSharingCardGroup/snowflakes/Share/Share.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ShareSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SHARE}`));
  }
}

module.exports = ShareSO;
