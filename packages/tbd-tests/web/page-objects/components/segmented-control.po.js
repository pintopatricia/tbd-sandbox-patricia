const {
  TEST_ID,
  SELECTABLE_OPTION,
  SELECTED_SELECTABLE_OPTION,
} = require("@ppb/the-wall-web/components/walls/SegmentedControl/SegmentedControl.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SegmentedControlPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get options() {
    return this.element.$$(SELECTABLE_OPTION);
  }

  get selectedOption() {
    return this.element.$(SELECTED_SELECTABLE_OPTION);
  }
}

module.exports = SegmentedControlPO;
