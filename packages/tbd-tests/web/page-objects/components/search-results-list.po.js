const {
  CONTAINER,
  NO_RESULTS_LABEL,
  DID_YOU_MEAN_LABEL,
  NUMBER_OF_RESULTS_LABEL,
  RESULTS_LIST,
  RESULTS_LIST_COMPETITIONS,
} = require("@ppb/the-wall-web/components/rooms/SearchResultsList/SearchResultsList.selectors");
const {
  TEST_ID: RESULTS_TEST_ID,
} = require("@ppb/the-wall-web/components/walls/SearchResultItem/SearchResultItem.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class SearchResultItemPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(CONTAINER));
  }

  get noResultsLabel() {
    return this.element.$(NO_RESULTS_LABEL);
  }

  get didYouMeanLabel() {
    return this.element.$(DID_YOU_MEAN_LABEL);
  }

  get numberOfResultsLabel() {
    return this.element.$(NUMBER_OF_RESULTS_LABEL);
  }

  get resultsList() {
    return this.element.$(RESULTS_LIST);
  }

  get results() {
    return this.element.$$(RESULTS_TEST_ID);
  }

  get resultsCompetitions() {
    return this.element.$$(RESULTS_LIST_COMPETITIONS);
  }
};
