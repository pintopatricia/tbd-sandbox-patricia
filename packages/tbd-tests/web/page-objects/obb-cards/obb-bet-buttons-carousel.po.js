const {
  CAROUSEL_CONTAINER,
  CAROUSEL_ARROW,
} = require("@ppb/tbd-shared/components/ObbSquadBetCard/snowflakes/BetButtonsCarousel/BetButtonsCarousel.web.selectors");

const {
  TEST_ID: BET_BUTTON,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ObbBetButtonsCarouselPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(CAROUSEL_CONTAINER));
  }

  get betButtons() {
    return this.element.$$(BET_BUTTON);
  }

  get carouselArrow() {
    return this.element.$$(CAROUSEL_ARROW);
  }
};
