const {
  SCROLLABLE_SWIMLANE,
} = require("@ppb/the-wall-native/components/ScrollableSwimlane/ScrollableSwimlane.selectors");
const { ICON_BUTTON } = require("@ppb/the-wall-native/components/IconButton/IconButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SportRibbonCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SCROLLABLE_SWIMLANE}`));
  }

  get iconButtons() {
    return this.element.$$(`~${ICON_BUTTON}`);
  }
}

module.exports = SportRibbonCardGroupSO;
