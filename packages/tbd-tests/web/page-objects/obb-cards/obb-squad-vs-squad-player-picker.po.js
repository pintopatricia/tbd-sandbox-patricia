const { TEST_ID } = require("@ppb/the-wall-web/components/walls/BottomSheet/BottomSheet.selectors");
const {
  PLAYERS_LIST,
  SQUAD_VS_SQUAD_CARD,
} = require("@ppb/tbd-shared/components/ObbSquadVsSquadPlayerPicker/ObbSquadVsSquadPlayerPicker.web.selectors");

const {
  TEST_ID: OBB_PLAYERS_ROW_CARD,
  PLAYER_SELECTED,
  DISABLED_FIRST_NAME,
} = require("@ppb/tbd-shared/components/ObbPlayersRowCard/ObbPlayersRowCard.web.selectors");

const { TEST_ID: MICRO_PLAYERS } = require("@ppb/tbd-shared/components/ObbMicroPlayer/ObbMicroPlayer.web.selectors");

const {
  TEST_ID: BET_BUTTON,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ObbSquadVsSquadPlayerPickerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get playersList() {
    return this.element.$(PLAYERS_LIST);
  }

  get playersRows() {
    return this.element.$$(OBB_PLAYERS_ROW_CARD);
  }

  get playersRowHighlighted() {
    return this.element.$$(PLAYER_SELECTED);
  }

  get playersRowDisabledFirstNames() {
    return this.element.$$(DISABLED_FIRST_NAME);
  }

  get squadVsSquadCardContainer() {
    return this.element.$(SQUAD_VS_SQUAD_CARD);
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
