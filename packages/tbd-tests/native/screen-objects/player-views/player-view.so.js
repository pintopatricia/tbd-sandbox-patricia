const SELECTORS = require("@ppb/tbd-shared/components/PlayerView/view/PlayerView.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class PopularBetBuilderCardPO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SELECTORS.PLAYER_VIEW_CONTAINER}`));
  }

  get playerName() {
    return this.element.$(`~${SELECTORS.PLAYER_VIEW_HEADER_NAME}`);
  }

  get playerShirtNumber() {
    return this.element.$(`~${SELECTORS.PLAYER_VIEW_HEADER_SHIRT_NUMBER}`);
  }

  get playerPosition() {
    return this.element.$(`~${SELECTORS.PLAYER_VIEW_HEADER_POSITION}`);
  }
};
