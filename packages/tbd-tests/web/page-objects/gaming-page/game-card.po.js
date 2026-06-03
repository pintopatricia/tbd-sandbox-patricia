const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID } = require("@ppb/tbd-shared/components/GameCard/GameCard.web.selectors");
const { TEST_ID: LINK_ID } = require("@ppb/the-wall-web/components/bricks/Link/Link.selectors");

class GameCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get link() {
    return this.element.$(LINK_ID);
  }
}

module.exports = GameCardPO;
