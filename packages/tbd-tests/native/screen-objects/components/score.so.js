const {
  SCORE,
  TEAM_A_LABEL,
  TEAM_B_LABEL,
} = require("@ppb/the-wall-native/components/Scoreboard/Score/Score.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ScoreSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SCORE}`));
  }

  get teamAScores() {
    return this.element.$$(`~${TEAM_A_LABEL}`);
  }

  get teamBScores() {
    return this.element.$$(`~${TEAM_B_LABEL}`);
  }
}

module.exports = ScoreSO;
