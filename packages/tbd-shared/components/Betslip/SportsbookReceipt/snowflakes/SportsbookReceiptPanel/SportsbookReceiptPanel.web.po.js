const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  RECEIPT_TITLE,
  RECEIPT_TITLE_DISMISS_BUTTON,
} = require("@ppb/the-wall-web/components/walls/ReceiptTitle/ReceiptTitle.selectors");
const { TEST_ID: SWITCH_TEST_ID } = require("@ppb/the-wall-web/components/bricks/Switch/Switch.selectors");
const {
  TEST_ID: CAST,
  TITLE: CAST_BET_TITLE,
  SUBTITLE: CAST_BET_SUBTITLE,
} = require("@ppb/the-wall-web/components/rooms/CastBet/CastBet.selectors");
const { TEST_ID: BET_BUILDER_SUMMARY } = require("./snowflakes/BetBuilderSummary/BetBuilderSummary.web.selectors");
const {
  TEST_ID,
  SINGLE,
  MULTIPLE,
  MULTI_BET_BUILDER,
  BET_BUILDER_TITLE,
  CASTS_TITLE,
  MULTIPLES_TITLE,
  SINGLES_TITLE,
  ODDS_MOVEMENT_DESCRIPTION,
  ODDS_MOVEMENT_LABEL,
  RE_USE_SELECTIONS_CONTAINER,
  TOTAL_STAKE,
} = require("./SportsbookReceiptPanel.web.selectors");

class SportsbookReceiptPanelPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(RECEIPT_TITLE);
  }

  get dismissButton() {
    return this.element.$(RECEIPT_TITLE_DISMISS_BUTTON);
  }

  get singles() {
    return this.element.$$(SINGLE);
  }

  get multiples() {
    return this.element.$$(MULTIPLE);
  }

  get multipleBetBuilder() {
    return this.element.$$(MULTI_BET_BUILDER);
  }

  get casts() {
    return this.element.$$(CAST);
  }

  get betBuilderSummaries() {
    return this.element.$$(BET_BUILDER_SUMMARY);
  }

  get castsTitle() {
    return this.element.$(CASTS_TITLE);
  }

  get betBuilderTitle() {
    return this.element.$(BET_BUILDER_TITLE);
  }

  get multiplesTitle() {
    return this.element.$(MULTIPLES_TITLE);
  }

  get singlesTitle() {
    return this.element.$(SINGLES_TITLE);
  }

  get castBetTitles() {
    return this.element.$$(CAST_BET_TITLE);
  }

  get castBetSubtitles() {
    return this.element.$$(CAST_BET_SUBTITLE);
  }

  get oddsMovementDescription() {
    return this.element.$(ODDS_MOVEMENT_DESCRIPTION);
  }

  get oddsMovementLabel() {
    return this.element.$(ODDS_MOVEMENT_LABEL);
  }

  get oddsMovementSwitch() {
    return this.element.$(SWITCH_TEST_ID);
  }

  get reUseSelectionsContainer() {
    return this.element.$(RE_USE_SELECTIONS_CONTAINER);
  }

  get totalStakeValue() {
    return this.element.$(TOTAL_STAKE);
  }
}

module.exports = SportsbookReceiptPanelPO;
