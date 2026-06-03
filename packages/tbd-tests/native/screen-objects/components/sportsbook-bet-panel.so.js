const {
  BET_SEGMENTS,
  BET_SEGMENTS_DOT,
  BET_SEGMENTS_LEFT_SEGMENT,
  BET_SEGMENTS_MID_SEGMENT,
  BET_SEGMENTS_RIGHT_SEGMENT,
} = require("@ppb/the-wall-native/components/BetReceipt/BetSegments/BetSegments.selectors");

const {
  BET_SEGMENTS_VALUE,
  BET_SEGMENTS_TERM,
  BET_SEGMENTS_PREVIOUS_VALUE,
} = require("@ppb/the-wall-native/components/BetReceipt/BetSegments/SelectionSegment/SelectionSegment.selectors");

const {
  PNL_AND_WHAT_IF_PNL,
  PNL_AND_WHAT_IF_PREVIOUS_PNL,
} = require("@ppb/the-wall-native/components/PNLAndWhatIf/PNLAndWhatIf.selectors");

const {
  INFO_LABEL_LABEL: SPORTSBOOK_BET_PANEL_ODDS_BOOST_LABEL,
  INFO_LABEL,
} = require("@ppb/the-wall-native/components/bricks/Indicators/InfoLabel/InfoLabel.selectors");

const {
  SPORTSBOOK_BET_PANEL,
  SPORTSBOOK_BET_PANEL_TITLE,
  SPORTSBOOK_BET_PANEL_SUBTITLE,
  SPORTSBOOK_BET_PANEL_SUPPORTING_TEXT,
  SPORTSBOOK_BET_PANEL_BUTTON,
  SPORTSBOOK_BET_PANEL_ODDS_BOOST_ICON,
  SPORTSBOOK_BET_PANEL_BOG_LABEL,
} = require("../../../../tbd-shared/components/SportsbookBetPanel/SportsbookBetPanel.native.selectors");

const { STATUS_LABEL } = require("@ppb/the-wall-native/components/bricks/Indicators/StatusLabel/StatusLabel.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SportsbookBetPanelSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SPORTSBOOK_BET_PANEL}`));
  }

  get dot() {
    return this.element.$(`~${BET_SEGMENTS_DOT}`);
  }

  get betOdds() {
    return this.element.$(`~${BET_SEGMENTS_LEFT_SEGMENT}`);
  }

  get betStake() {
    return this.element.$(`~${BET_SEGMENTS_MID_SEGMENT}`);
  }

  get betReturns() {
    return this.element.$(`~${BET_SEGMENTS_RIGHT_SEGMENT}`);
  }

  get panelTitle() {
    return this.element.$(`~${SPORTSBOOK_BET_PANEL_TITLE}`);
  }

  get buttons() {
    return this.element.$$(`~${SPORTSBOOK_BET_PANEL_BUTTON}`);
  }

  get sbkBetPanelSubtitle() {
    return this.element.$(`~${SPORTSBOOK_BET_PANEL_SUBTITLE}`);
  }

  get sbkBetPanelSupportingText() {
    return this.element.$(`~${SPORTSBOOK_BET_PANEL_SUPPORTING_TEXT}`);
  }

  get oddsLabel() {
    return this.betOdds.$(`~${BET_SEGMENTS_TERM}`);
  }

  get odds() {
    return this.betOdds.$(`~${BET_SEGMENTS_VALUE}`);
  }

  get previousOdds() {
    return this.betOdds.$(`~${BET_SEGMENTS_PREVIOUS_VALUE}`);
  }

  get stakeLabel() {
    return this.betStake.$(`~${BET_SEGMENTS_TERM}`);
  }

  get stake() {
    return this.betStake.$(`~${BET_SEGMENTS_VALUE}`);
  }

  get betReturnsLabel() {
    return this.betReturns.$(`~${BET_SEGMENTS_TERM}`);
  }

  get betReturnsValue() {
    return this.betReturns.$(`~${PNL_AND_WHAT_IF_PNL}`);
  }

  get betReturnsPreviousValue() {
    return this.betReturns.$(`~${PNL_AND_WHAT_IF_PREVIOUS_PNL}`);
  }

  get infoLabels() {
    return this.element.$$(`~${INFO_LABEL}`);
  }

  get oddsboost() {
    return this.element.$(`~${SPORTSBOOK_BET_PANEL_ODDS_BOOST_LABEL}`);
  }

  get oddsboostIcon() {
    return this.element.$(`~${SPORTSBOOK_BET_PANEL_ODDS_BOOST_ICON}`);
  }

  get bog() {
    return this.element.$(`~${SPORTSBOOK_BET_PANEL_BOG_LABEL}`);
  }

  get statusLabel() {
    return this.element.$(`~${STATUS_LABEL}`);
  }

  get betPlaceReturns() {
    return this.element.$$(`~${BET_SEGMENTS}`)[1];
  }
  get betPlaceReturnsLabel() {
    return this.betPlaceReturns.$(`~${BET_SEGMENTS_TERM}`);
  }

  get betPlaceReturnsValue() {
    return this.betPlaceReturns.$(`~${PNL_AND_WHAT_IF_PNL}`);
  }
}

module.exports = SportsbookBetPanelSO;
