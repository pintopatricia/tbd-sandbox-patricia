const {
  TEST_ID,
  SELECTABLE_ITEMS_CARDGROUP_TITLE,
} = require("@ppb/tbd-shared/components/SelectableItemsCardGroup/SelectableItemsCardGroup.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SelectableItemsCardGroupSo extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get title() {
    return this.element.$(`~${SELECTABLE_ITEMS_CARDGROUP_TITLE}`);
  }
}

module.exports = SelectableItemsCardGroupSo;
