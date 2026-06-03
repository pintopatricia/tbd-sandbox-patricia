const {
  TEST_ID,
  ITEM_CONTENT,
  MENU_ICON,
} = require("@ppb/the-wall-web/components/bricks/DraggableListItem/DraggableListItem.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class DraggableListItemPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get content() {
    return this.element.$(ITEM_CONTENT);
  }

  get icon() {
    return this.element.$(MENU_ICON);
  }
}

module.exports = DraggableListItemPO;
