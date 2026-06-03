const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  ITEM,
  BADGE,
  MATCH_STAT_SELECTION,
  SHOW_MORE,
  TIMES_BACKED_LABEL,
  CONTEXTUAL_STATS,
  MATCH_STAT_SELECTION_TITLE,
  MATCH_STAT_SELECTION_SUBTITLE,
} = require("@ppb/tbd-shared/components/ObbEventPopularsCard/ObbEventPopularsCard.web.selectors");

module.exports = class ObbEventPopularsCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get item() {
    return this.element.$(ITEM);
  }

  get badge() {
    return this.element.$(BADGE);
  }

  get visibleBettingOpportunities() {
    return this.element.$$(MATCH_STAT_SELECTION);
  }

  get matchStatTitle() {
    return this.element.$$(MATCH_STAT_SELECTION_TITLE);
  }

  get matchStatSubtitle() {
    return this.element.$$(MATCH_STAT_SELECTION_SUBTITLE);
  }

  get showMore() {
    return this.element.$(SHOW_MORE);
  }

  get timesBackedLabel() {
    return this.element.$$(TIMES_BACKED_LABEL);
  }

  get contextualStats() {
    return this.element.$$(CONTEXTUAL_STATS);
  }
};
