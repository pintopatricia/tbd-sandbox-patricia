const {
  BADGE,
  BADGE_TEXT,
  BADGE_TEXT_CONTAINER,
  BADGE_ROULETTE_NUMBER_CONTAINER,
} = require("@ppb/the-wall-native/components/GameTile/Badge/Badge.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BadgeSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BADGE}`));
  }

  get badgeText() {
    return this.element.$(`~${BADGE_TEXT}`);
  }

  get badgeTextContainer() {
    return this.element.$(`~${BADGE_TEXT_CONTAINER}`);
  }

  get rouletteContainer() {
    return this.element.$(`~${BADGE_ROULETTE_NUMBER_CONTAINER}`);
  }
}

module.exports = BadgeSO;
