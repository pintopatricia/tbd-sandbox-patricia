const { INFO_LABEL } = require("@ppb/the-wall-native/components/bricks/Indicators/InfoLabel/InfoLabel.selectors");
const {
  BET_SELECTION_DETAILS,
} = require("@ppb/the-wall-native/components/BetDetails/BetSelectionDetails/BetSelectionDetails.selectors");
const { STATUS_LABEL } = require("@ppb/the-wall-native/components/bricks/Indicators/StatusLabel/StatusLabel.selectors");
const { BET_SEGMENTS } = require("@ppb/the-wall-native/components/BetReceipt/BetSegments/BetSegments.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { MARKET_BET_SELECTION_CARD } = require("./MarketBetSelectionCard.native.selectors");

module.exports = class MarketBetSelectionCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET_BET_SELECTION_CARD}`));
  }

  get infoLabel() {
    return this.element.$(`~${INFO_LABEL}`);
  }

  get betSelectionDetails() {
    return this.element.$(`~${BET_SELECTION_DETAILS}`);
  }

  get statusLabel() {
    return this.element.$(`~${STATUS_LABEL}`);
  }

  get betSegments() {
    return this.element.$(`~${BET_SEGMENTS}`);
  }
};
