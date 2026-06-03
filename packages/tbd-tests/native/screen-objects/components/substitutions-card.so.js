const {
  SUBSTITUTIONS_CARD,
} = require("@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/snowflakes/SubstitutionsCard/SubstitutionsCard.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SubstitutionsCardSO extends BaseSO {
  constructor() {
    super($(`~${SUBSTITUTIONS_CARD}`));
  }
}

module.exports = SubstitutionsCardSO;
