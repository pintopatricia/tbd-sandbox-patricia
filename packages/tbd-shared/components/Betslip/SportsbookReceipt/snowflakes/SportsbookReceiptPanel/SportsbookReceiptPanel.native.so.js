const { SUB_HEADER: SUB_HEADER_ID } = require("@ppb/the-wall-native/components/Betslip/SubHeader/SubHeader.selectors");
const {
  CAST_BET,
  CAST_BET_TITLE,
  SUBTITLE: CAST_BET_SUBTITLE,
} = require("@ppb/the-wall-native/components/Betslip/CastBet/CastBet.selectors");
const { BET_INFO } = require("@ppb/the-wall-native/components/bricks/BetInfo/BetInfo.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const {
  SBK_RECEIPT,
  SINGLE,
  MULTIPLE,
  MULTIPLES_TITLE,
  CASTS_TITLE,
  SINGLES_TITLE,
  BET_BUILDER_TITLE,
  ODDS_MOVEMENT_DESCRIPTION,
  ODDS_MOVEMENT_LABEL,
  BET_BUILDER_SUMMARY,
  RE_USE_SELECTIONS_CONTAINER,
} = require("./SportsbookReceiptPanel.native.selectors");

class SportsbookReceiptPanelSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SBK_RECEIPT}`));
  }

  get singles() {
    return this.element.$$(`~${SINGLE}`);
  }

  get multiples() {
    return this.element.$$(`~${MULTIPLE}`);
  }

  get multiplesTitle() {
    return this.element.$(`~${MULTIPLES_TITLE}`);
  }

  get castsTitle() {
    return this.element.$(`~${CASTS_TITLE}`);
  }

  get betBuilderTitle() {
    return this.element.$(`~${BET_BUILDER_TITLE}`);
  }

  get betBuilderSummaries() {
    return this.element.$$(`~${BET_BUILDER_SUMMARY}`);
  }

  get casts() {
    return this.element.$$(`~${CAST_BET}`);
  }

  get castBetTitles() {
    return this.element.$$(`~${CAST_BET_TITLE}`);
  }

  get castBetSubtitles() {
    return this.element.$$(`~${CAST_BET_SUBTITLE}`);
  }

  get singlesTitle() {
    return this.element.$(`~${SINGLES_TITLE}`);
  }

  get oddsMovementDescription() {
    return this.element.$(`~${ODDS_MOVEMENT_DESCRIPTION}`);
  }

  get oddsMovementLabel() {
    return this.element.$(`~${ODDS_MOVEMENT_LABEL}`);
  }

  get reUseSelectionsContainer() {
    return this.element.$(`~${RE_USE_SELECTIONS_CONTAINER}`);
  }

  get sectionSubheaders() {
    return this.element.$$(`~${SUB_HEADER_ID}`);
  }

  get betInfo() {
    return this.element.$(`~${BET_INFO}`);
  }
}

module.exports = SportsbookReceiptPanelSO;
