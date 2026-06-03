const {
  TEST_ID,
  TITLE,
  SUBTITLE,
  SUPPORTING_TEXT,
  BUTTON,
  BOG,
  STAKE_LABEL,
  STAKE,
  POTENTIAL_RETURNS_LABEL,
  POTENTIAL_RETURNS,
  ODDS_BOOST_LABEL,
  ODDS_BOOST_ICON,
} = require("../../../../tbd-shared/components/SportsbookBetPanel/SportsbookBetPanel.web.selectors");
const {
  TEST_ID: INFO_LABEL_TEST_ID,
} = require("@ppb/the-wall-web/components/bricks/Indicators/InfoLabel/InfoLabel.selectors");
const {
  TEST_ID: STATUS_LABEL,
} = require("@ppb/the-wall-web/components/bricks/Indicators/StatusLabel/StatusLabel.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

const { PREVIOUS_PNL, PNL } = require("@ppb/the-wall-web/components/bricks/PNLAndWhatIf/PNLAndWhatIf.selectors");

class SportsbookBetPanelPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get stake() {
    return this.element.$(STAKE);
  }

  get stakeLabel() {
    return this.element.$(STAKE_LABEL);
  }

  get potentialReturns() {
    return this.element.$(POTENTIAL_RETURNS);
  }

  get potentialReturnsLabel() {
    return this.element.$(POTENTIAL_RETURNS_LABEL);
  }

  get potentialPlaceReturns() {
    return this.element.$$(POTENTIAL_RETURNS)[1];
  }

  get potentialPlaceReturnsLabel() {
    return this.element.$$(POTENTIAL_RETURNS_LABEL)[1];
  }

  get panelTitle() {
    return this.element.$(TITLE);
  }

  get panelSubTitle() {
    return this.element.$(SUBTITLE);
  }

  get panelSupportingText() {
    return this.element.$(SUPPORTING_TEXT);
  }

  get buttons() {
    return this.element.$$(BUTTON);
  }

  get bog() {
    return this.element.$(BOG);
  }

  get oddsBoostIcon() {
    return this.element.$(ODDS_BOOST_ICON);
  }

  get oddsBoostLabel() {
    return this.element.$(ODDS_BOOST_LABEL);
  }

  get statusLabel() {
    return this.element.$(STATUS_LABEL);
  }

  get infoLabels() {
    return this.element.$$(INFO_LABEL_TEST_ID);
  }

  get previousValue() {
    return this.element.$(PREVIOUS_PNL);
  }

  get boostedValue() {
    return this.element.$(PNL);
  }
}

module.exports = SportsbookBetPanelPO;
