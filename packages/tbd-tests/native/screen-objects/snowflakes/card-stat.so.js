const {
  CARD_STAT,
  CARD_STAT_TITLE,
  CARD_STAT_CONTENT,
  CARD_STAT_HOME,
  CARD_STAT_AWAY,
  CARD_STAT_ICON,
} = require("@ppb/the-wall-native/components/MatchStats/CardStat/CardStat.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class CardStatSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CARD_STAT}`));
  }

  get title() {
    return this.element.$(`~${CARD_STAT_TITLE}`);
  }

  get content() {
    return this.element.$(`~${CARD_STAT_CONTENT}`);
  }

  get homeStats() {
    return this.element.$(`~${CARD_STAT_HOME}`);
  }

  get awayStats() {
    return this.element.$(`~${CARD_STAT_AWAY}`);
  }

  get icon() {
    return this.element.$(`~${CARD_STAT_ICON}`);
  }
}

module.exports = CardStatSO;
