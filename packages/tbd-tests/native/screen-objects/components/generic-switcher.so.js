const {
  TEST_ID,
} = require("@ppb/tbd-components-navigation/components/GenericSwitcherCard/view/GenericSwitcherCard.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class GenericSwitcherCard extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }
}

module.exports = GenericSwitcherCard;
