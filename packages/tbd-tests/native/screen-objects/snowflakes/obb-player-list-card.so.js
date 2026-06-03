const {
  SELECTED,
  FIRST_NAME,
  LAST_NAME,
  STATS_VALUE,
  TEST_ID,
  DISABLED,
} = require("@ppb/tbd-shared/components/ObbPlayersListCard/ObbPlayersListCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ObbPlayersListCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get playerCardContainerSelected() {
    return this.element.$(`~${SELECTED}`);
  }

  get playerFirstName() {
    return this.element.$(`~${FIRST_NAME}`);
  }

  get playerLastName() {
    return this.element.$(`~${LAST_NAME}`);
  }

  get statsValue() {
    return this.element.$(`~${STATS_VALUE}`);
  }

  get playerDisabled() {
    return this.element.$(`~${DISABLED}`);
  }
}

module.exports = ObbPlayersListCardSO;
