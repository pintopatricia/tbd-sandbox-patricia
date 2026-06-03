const {
  PEBBLE,
  PEBBLE_TITLE,
  PEBBLE_COUNTER,
  PEBBLE_ICON,
} = require("@ppb/the-wall-native/components/Pebbles/Pebble/Pebble.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PebbleSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PEBBLE}`));
  }

  get title() {
    return this.element.$(`~${PEBBLE_TITLE}`);
  }

  get counter() {
    return this.element.$(`~${PEBBLE_COUNTER}`);
  }

  get icon() {
    return this.element.$(`~${PEBBLE_ICON}`);
  }
}

module.exports = PebbleSO;
