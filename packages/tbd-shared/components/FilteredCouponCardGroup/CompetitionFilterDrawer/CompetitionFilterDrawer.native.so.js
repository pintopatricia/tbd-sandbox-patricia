const { BaseSO } = require("@ppb/wdio-lazy-element");
const {
  COMPETITION_FILTERED,
  COMPETITION_FILTERED_HEADER_CONTENT,
} = require("./CompetitionFilterDrawer.native.selectors");

module.exports = class CompetitionFilterDrawerSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${COMPETITION_FILTERED}`));
  }

  get headerContent() {
    return this.element.$(`~${COMPETITION_FILTERED_HEADER_CONTENT}`);
  }
};
