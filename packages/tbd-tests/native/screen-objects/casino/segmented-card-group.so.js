const {
  SEGMENTED_CARD_GROUP,
  SEGMENTED_CARD_GROUP_CONTAINER,
} = require("@ppb/tbd-shared/components/SegmentedCardGroup/SegmentedCardGroup.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SegmentedCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SEGMENTED_CARD_GROUP_CONTAINER}`));
  }

  get segmentedCardGroupGames() {
    return this.element.$(`~${SEGMENTED_CARD_GROUP}`);
  }
}

module.exports = SegmentedCardGroupSO;
