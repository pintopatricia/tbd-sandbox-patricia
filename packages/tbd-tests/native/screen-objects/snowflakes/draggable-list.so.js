const { DRAGGABLE_LIST } = require("@ppb/the-wall-native/components/DraggableList/List/List.selectors");
const {
  DRAGGABLE_ITEM,
  DRAGGABLE_ITEM_CHILD,
  DRAGGABLE_ITEM_ICON,
} = require("@ppb/the-wall-native/components/DraggableList/Item/Item.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class DraggableListSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${DRAGGABLE_LIST})`));
  }

  get items() {
    return this.element.$$(`~${DRAGGABLE_ITEM}`);
  }

  get itemsChild() {
    return this.element.$$(`~${DRAGGABLE_ITEM_CHILD}`);
  }

  get icons() {
    return this.element.$$(`~${DRAGGABLE_ITEM_ICON}`);
  }
}

module.exports = DraggableListSO;
