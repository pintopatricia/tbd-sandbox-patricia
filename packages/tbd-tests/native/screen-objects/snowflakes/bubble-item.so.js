const {
  BUBBLE_ITEM,
  TEXT,
  TITLE,
  ICON_CONTAINER,
  DESCRIPTION,
  CHILDREN_CONTAINER,
} = require("@ppb/tbd-shared/components/PopularBetBuilderCard/snowflakes/BubbleItem/BubbleItem.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BubbleItemSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BUBBLE_ITEM}`));
  }

  /**
   * Returns the label of each item
   * Uses the `TEXT` selector
   */
  get itemText() {
    return this.element.$(`~${TEXT}`);
  }

  /**
   * Returns the label of each item
   * Uses the `TITLE` selector
   */
  get itemTitle() {
    return this.element.$(`~${TITLE}`);
  }

  get description() {
    return this.element.$(`~${DESCRIPTION}`);
  }

  /**
   * Returns the icon of each item
   * Uses the `ICON_CONTAINER` selector
   */
  get icon() {
    return this.element.$(`~${ICON_CONTAINER}`);
  }

  get childrenContainer() {
    return this.element.$(`~${CHILDREN_CONTAINER}`);
  }
}

module.exports = BubbleItemSO;
