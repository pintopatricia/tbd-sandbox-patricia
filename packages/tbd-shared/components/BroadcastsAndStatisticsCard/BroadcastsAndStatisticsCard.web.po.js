const { BasePO } = require("@ppb/wdio-lazy-element");

const {
  TEST_ID: SupportingContentButton,
} = require("@ppb/the-wall-web/components/bricks/SupportingContentButton/SupportingContentButton.selectors");
const { TEST_ID, LIVE_VIDEO_SECTION } = require("./BroadcastsAndStatisticsCard.web.selectors");

module.exports = class BroadcastsAndStatisticsCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get liveVideoSection() {
    return this.element.$(LIVE_VIDEO_SECTION);
  }

  get liveVideoAndStatisticsBroadcastsButtons() {
    return this.element.$$(SupportingContentButton);
  }
};
