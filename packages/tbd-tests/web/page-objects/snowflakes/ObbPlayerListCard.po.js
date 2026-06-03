const {
  HIGHLIGHTED,
  FIRST_NAME,
  LAST_NAME,
  STATS_VALUE,
  TEST_ID,
  DISABLED,
} = require("@ppb/tbd-shared/components/ObbPlayersListCard/ObbPlayersListCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ObbPlayersListCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get highlighted() {
    return this.element.$(HIGHLIGHTED);
  }

  get firstName() {
    return this.element.$(FIRST_NAME);
  }

  get lastName() {
    return this.element.$(LAST_NAME);
  }

  get statsValue() {
    return this.element.$(STATS_VALUE);
  }

  get disabled() {
    return this.element.$(DISABLED);
  }
}

module.exports = ObbPlayersListCardPO;
