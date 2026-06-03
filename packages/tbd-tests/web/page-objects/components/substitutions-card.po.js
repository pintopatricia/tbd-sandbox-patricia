const {
  SUBSTITUTIONS_CARD,
} = require("@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/snowflakes/SubstitutionsCard/SubstitutionsCard.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class SubstitutionsCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`[data-testid="${SUBSTITUTIONS_CARD}"]`));
  }
};
