const {
  TEST_ID,
  PLAYERS_LIST,
  SQUAD_BET_CARD,
} = require("@ppb/tbd-shared/components/ObbSquadBetPlayerPicker/ObbSquadBetPlayerPicker.web.selectors");

const {
  TEST_ID: OBB_PLAYERS_ROW_CARD,
  PLAYER_SELECTED,
  DISABLED_FIRST_NAME,
} = require("@ppb/tbd-shared/components/ObbPlayersRowCard/ObbPlayersRowCard.web.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ObbSquadBetPlayerPickerPO extends BasePO {
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

  get squadBetCardContainer() {
    return this.element.$(SQUAD_BET_CARD);
  }
};
