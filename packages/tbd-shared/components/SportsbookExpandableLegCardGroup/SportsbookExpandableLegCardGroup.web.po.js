const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID: CARD } = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors");
const {
  SBK_EXPANDABLE_LEG_CARD_GROUP,
  SBK_EXPANDABLE_LEG_CARD_GROUP_CARDS,
} = require("./SportsbookExpandableLegCardGroup.web.selectors");

module.exports = class SportsbookExpandableLegCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(SBK_EXPANDABLE_LEG_CARD_GROUP));
  }

  get collapsibleCard() {
    return this.element.$(CARD);
  }

  get cards() {
    return this.element.$$(SBK_EXPANDABLE_LEG_CARD_GROUP_CARDS);
  }
};
