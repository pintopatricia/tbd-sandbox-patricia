const {
  MAIN_LABEL,
  SECONDARY_LABEL,
  STAT_LABEL,
  TEST_ID,
} = require("@ppb/tbd-shared/components/ObbPvPCard/snowflakes/StatsGroup/StatsGroup.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class StatsGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get mainLabel() {
    return this.element.$(`~${MAIN_LABEL}`);
  }

  get secondaryLabel() {
    return this.element.$(`~${SECONDARY_LABEL}`);
  }

  get statsLabel() {
    return this.element.$$(`~${STAT_LABEL}`);
  }
}

module.exports = StatsGroupSO;
