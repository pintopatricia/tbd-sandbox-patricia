const {
  SCROLLABLE_SWIMLANE,
} = require("@ppb/the-wall-native/components/ScrollableSwimlane/ScrollableSwimlane.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { GENERIC_VIEW } = require("./GenericView.native.selectors");

class GenericView extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${GENERIC_VIEW}`));
  }

  get scrollableSwimlanes() {
    return this.element.$$(`~${SCROLLABLE_SWIMLANE}`);
  }
}

module.exports = GenericView;
