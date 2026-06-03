const { BasePO } = require("@ppb/wdio-lazy-element");
const { INFO_ICON, LABEL, ODDS_RANGE } = require("./MatchMe.web.selectors");

module.exports = class MatchMePO extends BasePO {
  constructor(lazyElement) {
    if (!lazyElement) {
      throw Error("MatchMePO selector is mandatory");
    }

    super(lazyElement);
  }

  get infoIcon() {
    return this.element.$(INFO_ICON);
  }

  get label() {
    return this.element.$(LABEL);
  }

  get oddsRange() {
    return this.element.$(ODDS_RANGE);
  }
};
