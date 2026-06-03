const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID: INFO_LABEL } = require("@ppb/the-wall-web/components/bricks/Indicators/InfoLabel/InfoLabel.selectors");
const {
  TEST_ID: BET_SELECTION_DETAILS,
} = require("@ppb/the-wall-web/components/walls/BetSelectionDetails/BetSelectionDetails.selectors");
const {
  TEST_ID: STATUS_LABEL,
} = require("@ppb/the-wall-web/components/bricks/Indicators/StatusLabel/StatusLabel.selectors");
const { TEST_ID: BET_SEGMENTS } = require("@ppb/the-wall-web/components/bricks/BetSegments/BetSegments.selectors");
const { TEST_ID } = require("./MarketBetSelectionCard.web.selectors");

module.exports = class MarketBetSelectionCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get infoLabel() {
    return this.element.$(INFO_LABEL);
  }

  get betSelectionDetails() {
    return this.element.$(BET_SELECTION_DETAILS);
  }

  get statusLabel() {
    return this.element.$(STATUS_LABEL);
  }

  get betSegments() {
    return this.element.$(BET_SEGMENTS);
  }
};
