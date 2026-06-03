const {
  SEARCH_RESULTS,
  SEARCH_RESULTS_LIST,
  SEARCH_RESULTS_MEAN_LABEL,
  SEARCH_RESULTS_NO_RESULTS_LABEL,
  SEARCH_RESULTS_NUMBER_RESULTS_LABEL,
} = require("@ppb/the-wall-native/components/SearchResultsList/SearchResultsList.selectors");
const { QUICK_LINK } = require("@ppb/the-wall-native/components/QuickLink/QuickLink.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SearchResultsListSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SEARCH_RESULTS}`));
  }

  get searchResults() {
    return this.element.$(`~${SEARCH_RESULTS}`);
  }

  get noResults() {
    return this.element.$(`~${SEARCH_RESULTS_NO_RESULTS_LABEL}`);
  }

  get didYouMean() {
    return this.element.$(`~${SEARCH_RESULTS_MEAN_LABEL}`);
  }

  get numberOfResults() {
    return this.element.$(`~${SEARCH_RESULTS_NUMBER_RESULTS_LABEL}`);
  }

  get resultsList() {
    return this.element.$(`~${SEARCH_RESULTS_LIST}`);
  }

  get resultItems() {
    return this.element.$$(`~${QUICK_LINK}`);
  }
}

module.exports = SearchResultsListSO;
