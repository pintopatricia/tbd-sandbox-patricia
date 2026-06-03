const { LABEL } = require("@ppb/the-wall-native/components/bricks/Indicators/Label/Label.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class LabelPO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${LABEL}`));
  }
}

module.exports = LabelPO;
