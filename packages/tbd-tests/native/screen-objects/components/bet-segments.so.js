const {
  BET_SEGMENTS,
  BET_SEGMENTS_LEFT_SEGMENT,
  BET_SEGMENTS_MID_SEGMENT,
  BET_SEGMENTS_MID_RIGHT_SEGMENT,
  BET_SEGMENTS_RIGHT_SEGMENT,
} = require("@ppb/the-wall-native/components/BetReceipt/BetSegments/BetSegments.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetSegmentsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_SEGMENTS}`));
  }

  get leftSegment() {
    return this.element.$(`~${BET_SEGMENTS_LEFT_SEGMENT}`);
  }

  get midSegment() {
    return this.element.$(`~${BET_SEGMENTS_MID_SEGMENT}`);
  }

  get midRightSegment() {
    return this.element.$(`~${BET_SEGMENTS_MID_RIGHT_SEGMENT}`);
  }

  get rightSegment() {
    return this.element.$(`~${BET_SEGMENTS_RIGHT_SEGMENT}`);
  }
}

module.exports = BetSegmentsSO;
