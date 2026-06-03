const {
  TEST_ID,
  FIRST_PLAYER_PARTICIPANT_CONTAINER,
  SECOND_PLAYER_PARTICIPANT_CONTAINER,
  PLAYER_PARTICIPANTS_CONTAINER,
  OBB_SPORTSBOOK_BET_BUTTON,
  AGGREGATOR_TEXT,
} = require("@ppb/tbd-shared/components/ObbPvPCard/ObbPvpCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ObbPvpCardSO extends BaseSO {
  constructor() {
    super($(`~${TEST_ID}`));
  }

  get firstPlayerContainer() {
    return this.element.$(`~${FIRST_PLAYER_PARTICIPANT_CONTAINER}`);
  }

  get secondPlayerContainer() {
    return this.element.$(`~${SECOND_PLAYER_PARTICIPANT_CONTAINER}`);
  }

  get playersContainer() {
    return this.element.$(`~${PLAYER_PARTICIPANTS_CONTAINER}`);
  }

  get addButtons() {
    return this.element.$$(`~${OBB_SPORTSBOOK_BET_BUTTON}`);
  }

  get aggregator() {
    return this.element.$(`~${AGGREGATOR_TEXT}`);
  }
}

module.exports = ObbPvpCardSO;
