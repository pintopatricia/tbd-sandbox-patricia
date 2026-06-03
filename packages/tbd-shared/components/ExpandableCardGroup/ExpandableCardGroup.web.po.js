const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TITLE,
  TEST_ID: TEST_ID_CARD,
  CONTENT: CARD_CONTENT,
} = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors");
const { TEST_ID, EXPANDABLE_CARDGROUP_ITEM } = require("./ExpandableCardGroup.web.selectors");

module.exports = class ExpandableCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get headerTitle() {
    return this.element.$(TITLE);
  }

  get items() {
    return this.element.$$(EXPANDABLE_CARDGROUP_ITEM);
  }

  get card() {
    return this.element.$(TEST_ID_CARD);
  }

  get cardContent() {
    return this.element.$(CARD_CONTENT);
  }
};
