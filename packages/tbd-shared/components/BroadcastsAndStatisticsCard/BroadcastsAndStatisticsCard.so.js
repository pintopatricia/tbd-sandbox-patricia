const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  SUPPORTING_CONTENT_BUTTON,
} = require("@ppb/the-wall-native/components/bricks/SupportingContentButton/SupportingContentButton.selectors");
const { BROADCASTS_AND_STATISTICS, LIVE_VIDEO_SECTION } = require("./BroadcastsAndStatisticsCard.native.selectors");

class BroadcastsAndStatisticsCardSO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BROADCASTS_AND_STATISTICS}`));
  }

  get liveVideoSection() {
    return this.element.$(`~${LIVE_VIDEO_SECTION}`);
  }

  get liveVideoAndStatisticsBroadcastsButtons() {
    return this.element.$$(`~${SUPPORTING_CONTENT_BUTTON}`);
  }
}

module.exports = BroadcastsAndStatisticsCardSO;
