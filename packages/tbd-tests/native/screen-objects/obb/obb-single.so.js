const { OBB_SINGLE } = require("@ppb/tbd-shared/components/Betslip/ObbSingle/ObbSingle.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ObbSingleSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${OBB_SINGLE}`));
  }
}

module.exports = ObbSingleSO;
