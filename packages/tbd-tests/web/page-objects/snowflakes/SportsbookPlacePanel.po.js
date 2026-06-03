const {
  TEST_ID,
  COLLAPSABLE_SECTIONS,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.web.selectors");

const {
  REMOVE_ALL_BTN,
  TERMS_CONTAINER,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookPlace/snowflakes/PlaceFooter/PlaceFooter.web.selectors");

const { TEST_ID: OBB_SINGLE_TEST_ID } = require("@ppb/tbd-shared/components/Betslip/ObbSingle/ObbSingle.web.selectors");

const { TEST_ID: SUMMARY_ID } = require("@ppb/the-wall-web/components/bricks/BetsSummary/BetsSummary.selectors");
const { PRIMARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");
const { ACTION_BUTTON } = require("@ppb/the-wall-web/components/bricks/ActionButton/ActionButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SportsbookPlacePanelPO extends BasePO {
  /**
   * Creates a sbk place panel page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get collapsableSections() {
    return this.element.$$(COLLAPSABLE_SECTIONS);
  }

  get summary() {
    return this.element.$(SUMMARY_ID);
  }

  get actions() {
    return this.element.$$(ACTION_BUTTON);
  }

  get place() {
    return this.element.$(PRIMARY_BUTTON);
  }

  get removeAll() {
    return this.element.$(REMOVE_ALL_BTN);
  }

  get termsContainer() {
    return this.element.$(TERMS_CONTAINER);
  }

  get obbSingles() {
    return this.element.$$(OBB_SINGLE_TEST_ID);
  }
}

module.exports = SportsbookPlacePanelPO;
