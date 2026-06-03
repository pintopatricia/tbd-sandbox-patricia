const {
  PEBBLE_CARDGROUP,
  PEBBLE_CARDGROUP_TITLE_CONTAINER,
} = require("@ppb/tbd-shared/components/PebbleCardGroup/PebbleCardGroup.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PebbleCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PEBBLE_CARDGROUP}`));
  }

  get title() {
    return this.element.$(`~${PEBBLE_CARDGROUP_TITLE_CONTAINER}`);
  }
}

module.exports = PebbleCardGroupSO;
