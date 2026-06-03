const {
  FILTER_CRITERIA,
  CLOSE_BUTTON,
  HEADER_TITLE,
  HEADER_CONTENT,
} = require("@ppb/the-wall-native/components/FilterCriteria/FilterCriteria.selectors");

const { RADIO_LIST } = require("@ppb/the-wall-native/components/RadioList/RadioList.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FilterCriteriaSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${FILTER_CRITERIA}`));
  }

  /**
   * Returns the nativeElement of the title for filter criteria
   * Uses the `HEADER_TITLE` selector
   */
  get headerTitle() {
    return this.element.$(`~${HEADER_TITLE}`);
  }

  /**
   * Returns the nativeElement of the Close button element for filter criteria
   * Uses the `CLOSE_BUTTON` selector
   */
  get closeButton() {
    return this.element.$(`~${CLOSE_BUTTON}`);
  }

  /**
   * Returns the nativeElement of the Radio List for filter criteria
   * Uses the `RADIO_LIST` selector
   */
  get radioList() {
    return this.element.$(`~${RADIO_LIST}`);
  }

  /**
   * Returns the nativeElement of the header for filter criteria
   * Uses the `HEADER_CONTENT` selector
   */
  get headerContent() {
    return this.element.$(`~${HEADER_CONTENT}`);
  }
}

module.exports = FilterCriteriaSO;
