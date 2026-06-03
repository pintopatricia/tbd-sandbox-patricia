const {
  TEST_ID: BET_BUTTON,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");

const { TEST_ID: MICRO_PLAYERS } = require("@ppb/tbd-shared/components/ObbMicroPlayer/ObbMicroPlayer.web.selectors");

const { TEST_ID: ACTION_LINK } = require("@ppb/the-wall-web/components/bricks/ActionLink/ActionLink.selectors");

const CardPO = require("../components/card.po");

module.exports = class ObbSquadVsSquadCardPO extends CardPO {
  get editSquadLinks() {
    return this.element.$$(ACTION_LINK);
  }

  get firstEditSquadLink() {
    return this.editSquadLinks[0];
  }

  get secondEditSquadLink() {
    return this.editSquadLinks[1];
  }

  get microPlayers() {
    return this.element.$$(MICRO_PLAYERS);
  }

  get firstMicroPlayer() {
    return this.microPlayers[0];
  }

  get secondMicroPlayer() {
    return this.microPlayers[1];
  }

  get betButtons() {
    return this.element.$$(BET_BUTTON);
  }

  get firstBetButton() {
    return this.betButtons[0];
  }

  get secondBetButton() {
    return this.betButtons[1];
  }
};
