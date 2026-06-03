const {
  CONTAINER_MOBILE_LAYOUT,
  EDIT_SQUAD_BUTTON_ICON,
} = require("@ppb/tbd-shared/components/ObbSquadBetCard/snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.web.selectors");

const { TEST_ID: MICRO_PLAYER } = require("@ppb/tbd-shared/components/ObbMicroPlayer/ObbMicroPlayer.web.selectors");

const {
  TEST_ID: SCROLLABLE_SWIMLANE,
} = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class MicroPlayersCarouselPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(CONTAINER_MOBILE_LAYOUT));
  }

  get microPlayersCarouselMobileContainer() {
    return this.element.$(CONTAINER_MOBILE_LAYOUT);
  }

  get microPlayers() {
    return this.element.$$(MICRO_PLAYER);
  }

  get scrollableSwimlane() {
    return this.element.$(SCROLLABLE_SWIMLANE);
  }

  get editSquadButtonIcon() {
    return this.element.$(EDIT_SQUAD_BUTTON_ICON);
  }
};
