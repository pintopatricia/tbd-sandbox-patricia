const { BaseSO } = require("@ppb/wdio-lazy-element");
const {
  SUPPORTING_CONTENT_CARD_GROUP_CONTAINER,
} = require("../snowflakes/SupportingContentCardGroup/SupportingContentCardGroup.native.selectors");

const {
  SUPPORTING_CONTENT_BUTTON,
} = require("@ppb/the-wall-native/components/bricks/SupportingContentButton/SupportingContentButton.selectors");

class StatsSupportingContentButtonsCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SUPPORTING_CONTENT_CARD_GROUP_CONTAINER}`));
  }

  get buttons() {
    return this.element.$$(`~${SUPPORTING_CONTENT_BUTTON}`);
  }
}

module.exports = StatsSupportingContentButtonsCardGroupSO;
