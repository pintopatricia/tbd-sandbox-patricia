const {
  TEST_ID,
} = require("@ppb/tbd-shared/components/PreferenceSingleChoiceCard/snowflakes/PreferenceCard/PreferenceCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PreferenceCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = PreferenceCardPO;
