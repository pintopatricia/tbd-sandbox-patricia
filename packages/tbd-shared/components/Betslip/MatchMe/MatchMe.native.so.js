const { BaseSO } = require("@ppb/wdio-lazy-element");

const {
  MATCH_ME,
  MATCH_ME_INFO_ICON,
  MATCH_ME_LABEL,
  MATCH_ME_ODDS_RANGE,
  MATCH_ME_TOGGLE,
} = require("./MatchMe.native.selectors");

class MatchMeSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MATCH_ME}`));
  }

  get infoIcon() {
    return this.element.$(`~${MATCH_ME_INFO_ICON}`);
  }

  get label() {
    return this.element.$(`~${MATCH_ME_LABEL}`);
  }

  get oddsRange() {
    return this.element.$(`~${MATCH_ME_ODDS_RANGE}`);
  }

  get toggle() {
    return this.element.$(`~${MATCH_ME_TOGGLE}`);
  }
}

module.exports = MatchMeSO;
