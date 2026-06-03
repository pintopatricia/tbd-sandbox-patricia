const {
  TEST_ID,
} = require("@ppb/tbd-components-navigation/components/GenericSwitcherCard/view/GenericSwitcherCard.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class GenericSwitcherCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`[data-testid="${TEST_ID}"]`));
  }
};
