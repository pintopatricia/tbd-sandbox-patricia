const {
  RECEIPT_TITLE,
  RECEIPT_TITLE_DISMISS_BUTTON,
} = require("@ppb/the-wall-web/components/walls/ReceiptTitle/ReceiptTitle.selectors");
const {
  TEST_ID: CAST,
  TITLE: CAST_BET_TITLE,
  SUBTITLE: CAST_BET_SUBTITLE,
} = require("@ppb/the-wall-web/components/rooms/CastBet/CastBet.selectors");
const {
  TEST_ID,
  SINGLE,
  MULTIPLE,
  MULTI_BET_BUILDER,
  BET_BUILDER_TITLE,
  CASTS_TITLE,
  MULTIPLES_TITLE,
  SINGLES_TITLE,
  RE_USE_SELECTIONS_CONTAINER,
  TOTAL_STAKE,
  BET_BUILDER,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookReceipt/snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.web.selectors");
const {
  TEST_ID: BET_BUILDER_SUMMARY,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookReceipt/snowflakes/SportsbookReceiptPanel/snowflakes/BetBuilderSummary/BetBuilderSummary.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

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

  get betBuilders() {
    return this.element.$$(BET_BUILDER);
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

  get reUseSelectionsContainer() {
    return this.element.$(RE_USE_SELECTIONS_CONTAINER);
  }

  get totalStakeValue() {
    return this.element.$(TOTAL_STAKE);
  }
}

module.exports = SportsbookReceiptPanelPO;
