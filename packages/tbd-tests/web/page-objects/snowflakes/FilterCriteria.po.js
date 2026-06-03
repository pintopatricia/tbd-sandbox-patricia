const {
  TEST_ID,
  CLOSE_BUTTON,
  APPLY_BUTTON,
  HEADER_TITLE,
} = require("@ppb/the-wall-web/components/walls/FilterCriteria/FilterCriteria.selectors");

const { TEST_ID: OPTION_LIST } = require("@ppb/the-wall-web/components/bricks/OptionList/OptionList.selectors");

const { TEST_ID: RADIO_LIST } = require("@ppb/the-wall-web/components/bricks/RadioList/RadioList.selectors");

const { TEST_ID: ACTION_LINK } = require("@ppb/the-wall-web/components/bricks/ActionLink/ActionLink.selectors");

const { TEST_ID: CARD } = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

class FilterCriteriaPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the webElement of the root element for filter criteria
   * Uses the `TEST_ID` selector
   */
  get root() {
    return this.element.$(TEST_ID);
  }

  /**
   * Returns the webElement of the title for filter criteria
   * Uses the `HEADER_TITLE` selector
   */
  get headerTitle() {
    return this.element.$(HEADER_TITLE);
  }

  /**
   * Returns the webElement of the Reset button element for filter criteria
   * Uses the `ACTION_LINK` selector
   */
  get actionLink() {
    return this.element.$(ACTION_LINK);
  }

  /**
   * Returns the webElement of the Close button element for filter criteria
   * Uses the `CLOSE_BUTTON` selector
   */
  get closeButton() {
    return this.element.$(CLOSE_BUTTON);
  }

  /**
   * Returns the webElement of the Apply button element for filter criteria
   * Uses the `APPLY_BUTTON` selector
   */
  get applyButton() {
    return this.element.$(APPLY_BUTTON);
  }

  /**
   * Returns the webElement of the Option List for filter criteria
   * Uses the `OPTION_LIST` selector
   */
  get optionList() {
    return this.element.$(OPTION_LIST);
  }

  /**
   * Returns the webElement of the Radio List for filter criteria
   * Uses the `RADIO_LIST` selector
   */
  get radioList() {
    return this.element.$(RADIO_LIST);
  }

  /**
   * Returns the webElements for the various collapsible cards on filter criteria.
   * Uses the `CARD` selector
   */
  get collapsibleCards() {
    return this.element.$$(CARD);
  }
}

module.exports = FilterCriteriaPO;
