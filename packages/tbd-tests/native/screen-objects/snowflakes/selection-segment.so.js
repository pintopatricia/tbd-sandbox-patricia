const {
  BET_SEGMENTS_TERM,
} = require("@ppb/the-wall-native/components/BetReceipt/BetSegments/SelectionSegment/SelectionSegment.selectors");
const { ODDS_VALUE } = require("@ppb/the-wall-native/components/bricks/Indicators/Odds/Odds.selectors");
const { PNL_AND_WHAT_IF_PNL } = require("@ppb/the-wall-native/components/PNLAndWhatIf/PNLAndWhatIf.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SelectionSegmentSO extends BaseSO {
  constructor(lazyElement) {
    if (!lazyElement) {
      throw new Error("Selection segment selector is mandatory");
    }

    super(lazyElement);
  }

  get term() {
    return this.element.$(`~${BET_SEGMENTS_TERM}`);
  }

  get odd() {
    return this.element.$(`~${ODDS_VALUE}`);
  }

  get pnl() {
    return this.element.$(`~${PNL_AND_WHAT_IF_PNL}`);
  }
}

module.exports = SelectionSegmentSO;
