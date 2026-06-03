const { CONTAINER: CARD } = require("@ppb/the-wall-native/components/SelectableItems/SelectableItems.selectors");
const { RACE_TIME_CONTAINER } = require("@ppb/the-wall-native/components/RaceTime/RaceTime.selectors");
const {
  ICON_BUTTON,
  ICON_BUTTON_TEXT_SELECTED,
} = require("@ppb/the-wall-native/components/IconButton/IconButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SelectableItemsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CARD}`));
  }

  get races() {
    return this.element.$$(`~${RACE_TIME_CONTAINER}`);
  }

  get statistics() {
    return this.element.$$(`~${ICON_BUTTON}`);
  }

  get activeStatisticContent() {
    return this.element.$(`~${ICON_BUTTON_TEXT_SELECTED}`);
  }
}

module.exports = SelectableItemsSO;
