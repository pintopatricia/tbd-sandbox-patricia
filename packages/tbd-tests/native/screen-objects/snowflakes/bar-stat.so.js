const {
  BAR_STAT,
  BAR_STAT_HEADER,
  BAR_STAT_LABEL,
  BAR_STAT_AWAY_LABEL,
  BAR_STAT_HOME_LABEL,
} = require("@ppb/the-wall-native/components/MatchStats/BarStat/BarStat.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BarStatSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BAR_STAT}`));
  }

  get header() {
    return this.element.$(`~${BAR_STAT_HEADER}`);
  }

  get label() {
    return this.element.$(`~${BAR_STAT_LABEL}`);
  }

  get awayStats() {
    return this.element.$(`~${BAR_STAT_AWAY_LABEL}`);
  }

  get homeStats() {
    return this.element.$(`~${BAR_STAT_HOME_LABEL}`);
  }
}

module.exports = BarStatSO;
