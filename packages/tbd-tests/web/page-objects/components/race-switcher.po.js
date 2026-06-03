const {
  TEST_ID,
  DETAILS,
  ICON,
  DATE,
} = require("@ppb/tbd-components-navigation/components/RaceSwitcherCard/view/RaceSwitcherCard.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RaceSwitcherCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`[data-testid="${TEST_ID}"]`));
  }

  get details() {
    return this.element.$(`[data-testid="${DETAILS}"]`);
  }

  get icon() {
    return this.element.$(`[data-testid="${ICON}"]`);
  }

  get label() {
    return this.element.$(`[data-testid="${DATE}"]`);
  }
};
