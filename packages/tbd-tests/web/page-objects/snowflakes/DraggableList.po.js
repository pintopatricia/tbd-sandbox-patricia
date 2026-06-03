const { TEST_ID } = require("@ppb/the-wall-web/components/walls/DraggableList/DraggableList.selectors");
const { TEST_ID: ITEM } = require("@ppb/the-wall-web/components/bricks/DraggableListItem/DraggableListItem.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class DraggableListPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get items() {
    return this.element.$$(ITEM);
  }
}

module.exports = DraggableListPO;
