const {
  TEST_ID,
  PLAYER_PARTICIPANTS_CONTAINER,
  PLAYER_PARTICIPANT_CONTAINER,
} = require("@ppb/tbd-shared/components/ObbPvPCard/ObbPvpCard.web.selectors");

const {
  BET_BUTTONS,
} = require("@ppb/the-wall-web/components/bricks/InlineSportsbookMarket/InlineSportsbookMarket.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ObbPvpCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get playerContainer() {
    return this.element.$(PLAYER_PARTICIPANTS_CONTAINER);
  }

  get playerParticipants() {
    return this.element.$$(PLAYER_PARTICIPANT_CONTAINER);
  }

  get betButtons() {
    return this.element.$$(BET_BUTTONS);
  }

  get firstBetButton() {
    return this.betButtons[0];
  }

  get secondBetButton() {
    return this.betButtons[1];
  }
};
