const {
  TEST_ID,
  DATE,
} = require("@ppb/tbd-components-navigation/components/RaceSwitcherCard/view/RaceSwitcherCard.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RaceSwitcherCard extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get label() {
    return this.element.$(`~${DATE}`);
  }
}

module.exports = RaceSwitcherCard;
