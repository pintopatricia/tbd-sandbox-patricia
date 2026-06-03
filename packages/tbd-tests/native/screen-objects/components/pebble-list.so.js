const { PEBBLE_LIST } = require("@ppb/the-wall-native/components/Pebbles/PebbleList/PebbleList.selectors");
const { PEBBLE } = require("@ppb/the-wall-native/components/Pebbles/Pebble/Pebble.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PebbleListSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PEBBLE_LIST}`));
  }

  get pebbleListElements() {
    return this.element.$$(`~${PEBBLE}`);
  }
}

module.exports = PebbleListSO;
