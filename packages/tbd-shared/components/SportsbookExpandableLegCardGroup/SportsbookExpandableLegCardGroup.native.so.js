const { BaseSO } = require("@ppb/wdio-lazy-element");
const { CARD } = require("@ppb/the-wall-native/components/Card/Card.selectors");
const {
  SBK_EXPANDABLE_LEG_CARD_GROUP,
  SBK_EXPANDABLE_LEG_CARD_GROUP_CARDS,
} = require("./SportsbookExpandableLegCardGroup.native.selectors");

class SportsbookExpandableLegCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SBK_EXPANDABLE_LEG_CARD_GROUP}`));
  }

  get collapsibleCard() {
    return this.element.$(`~${CARD}`);
  }

  get cards() {
    return this.element.$$(`~${SBK_EXPANDABLE_LEG_CARD_GROUP_CARDS}`);
  }
}

module.exports = SportsbookExpandableLegCardGroupSO;
