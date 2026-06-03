const { BETS_SUMMARY } = require("@ppb/the-wall-native/components/Betslip/BetsSummary/BetsSummary.selectors");
const {
  PNL_AND_WHAT_IF_PNL,
  PNL_AND_WHAT_IF_PREVIOUS_PNL,
} = require("@ppb/the-wall-native/components/PNLAndWhatIf/PNLAndWhatIf.selectors");
const {
  BET_SEGMENTS_TERM,
} = require("@ppb/the-wall-native/components/BetReceipt/BetSegments/SelectionSegment/SelectionSegment.selectors");

const {
  BET_SEGMENTS_LEFT_SEGMENT,
  BET_SEGMENTS_RIGHT_SEGMENT,
} = require("@ppb/the-wall-native/components/BetReceipt/BetSegments/BetSegments.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetsSummarySO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BETS_SUMMARY}`));
  }

  // Receipts -> Total Stake
  // Betslip place footers -> Balance after bet
  get leftSegmentLabel() {
    return this.element.$(`~${BET_SEGMENTS_LEFT_SEGMENT}`).$(`~${BET_SEGMENTS_TERM}`);
  }

  // Receipts -> Total Stake
  // Betslip place footers -> Balance after bet
  get leftSegmentValue() {
    return this.element.$(`~${BET_SEGMENTS_LEFT_SEGMENT}`).$(`~${PNL_AND_WHAT_IF_PNL}`);
  }

  get totalReturnsLabel() {
    return this.element.$(`~${BET_SEGMENTS_RIGHT_SEGMENT}`).$(`~${BET_SEGMENTS_TERM}`);
  }

  get totalReturnsValue() {
    return this.element.$(`~${BET_SEGMENTS_RIGHT_SEGMENT}`).$(`~${PNL_AND_WHAT_IF_PNL}`);
  }

  get previousTotalReturnsValue() {
    return this.element.$(`~${BET_SEGMENTS_RIGHT_SEGMENT}`).$(`~${PNL_AND_WHAT_IF_PREVIOUS_PNL}`);
  }
}

module.exports = BetsSummarySO;
