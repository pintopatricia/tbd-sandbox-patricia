const {
  ODDS_MOVEMENT,
  ARROW_UP,
  ARROW_DOWN,
} = require("@ppb/the-wall-native/components/OddsMovement/OddsMovement.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class OddsMovementSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${ODDS_MOVEMENT}`));
  }

  get arrowUp() {
    return this.element.$(`~${ARROW_UP}`);
  }

  get arrowDown() {
    return this.element.$(`~${ARROW_DOWN}`);
  }
}

module.exports = OddsMovementSO;
