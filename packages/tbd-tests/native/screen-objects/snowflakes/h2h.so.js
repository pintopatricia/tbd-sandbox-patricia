const {
  H2H_SELECTOR: H2H,
} = require("@ppb/tbd-components-rich-data/components/StatsHeadToHeadCard/view/snowflakes/H2H/H2H.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class H2HSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${H2H}`));
  }
}

module.exports = H2HSO;
