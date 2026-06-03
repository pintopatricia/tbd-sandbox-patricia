const { BaseSO } = require("@ppb/wdio-lazy-element");
const { GAME_CARD } = require("./GameCard.native.selectors");

class GameCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${GAME_CARD}`));
  }

  get gameCardsList() {
    return this.element.$$(`~${GAME_CARD}`);
  }
}

module.exports = GameCardSO;
