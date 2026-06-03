const {
  TEST_ID,
  NAME_CONTAINER,
  JERSEY,
  FALLBACK_JERSEY,
  REMOVE_PLAYER,
} = require("@ppb/tbd-shared/components/ObbMicroPlayer/ObbMicroPlayer.web.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class MicroPlayersCarouselPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get microPlayerNameContainer() {
    return this.element.$(NAME_CONTAINER);
  }

  get microPlayerJersey() {
    return this.element.$(JERSEY);
  }

  get microPlayerFallbackJersey() {
    return this.element.$(`[data-testid="${FALLBACK_JERSEY}"]`);
  }

  get microPlayerRemovePlayerButton() {
    return this.element.$(REMOVE_PLAYER);
  }
};
