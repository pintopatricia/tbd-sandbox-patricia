const {
  CARD_CONTAINER: TEST_ID,
} = require("@ppb/tbd-shared/components/ObbEventPopularsCard/ObbEventPopularsCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ObbEventPopularsCardSO extends BaseSO {
  constructor() {
    super($(`~${TEST_ID}`));
  }
}

module.exports = ObbEventPopularsCardSO;
