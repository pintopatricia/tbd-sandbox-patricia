const {
  SQUAD_BET_CARD,
} = require("@ppb/tbd-shared/components/ObbSquadBetPlayerPicker/ObbSquadBetPlayerPicker.web.selectors");

const {
  CAROUSEL_CONTAINER: BET_BUTTONS_CAROUSEL_CONTAINER,
} = require("@ppb/tbd-shared/components/ObbSquadBetCard/snowflakes/BetButtonsCarousel/BetButtonsCarousel.web.selectors");

const {
  CONTAINER_MOBILE_LAYOUT: MICRO_PLAYERS_CAROUSEL_CONTAINER,
} = require("@ppb/tbd-shared/components/ObbSquadBetCard/snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.web.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class PlayerPickerSquadBetCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(SQUAD_BET_CARD));
  }

  get betButtonsCarouselContainer() {
    return this.element.$(BET_BUTTONS_CAROUSEL_CONTAINER);
  }

  get microPlayerCarouselContainer() {
    return this.element.$(MICRO_PLAYERS_CAROUSEL_CONTAINER);
  }
};
