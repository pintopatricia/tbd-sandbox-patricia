const {
  PENALTIES,
  PENALTIES_HOME_KICKS,
  PENALTIES_AWAY_KICKS,
  PENALTIES_KICK,
  PENALTIES_SCORE,
  PENALTIES_SCORE_TEXT,
} = require("@ppb/the-wall-native/components/Scoreboard/FootballScoreboard/Penalties/Penalties.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PenaltiesSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PENALTIES}`));
  }

  get homeKicks() {
    return this.element.$(`~${PENALTIES_HOME_KICKS}`);
  }

  get awayKicks() {
    return this.element.$(`~${PENALTIES_AWAY_KICKS}`);
  }

  get kicks() {
    return this.element.$$(`~${PENALTIES_KICK}`);
  }

  get score() {
    return this.element.$(`~${PENALTIES_SCORE}`);
  }

  get scoreText() {
    return this.element.$(`~${PENALTIES_SCORE_TEXT}`);
  }
}

module.exports = PenaltiesSO;
