const {
  SCORE,
  AGGREGATE,
  VERSUS,
  FIRST_LEG,
} = require("@ppb/the-wall-native/components/Scoreboard/FootballScoreboard/FootballScore/FootballScore.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FootballScoreSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SCORE}`));
  }

  get aggregateScore() {
    return this.element.$(`~${AGGREGATE}`);
  }

  get firstLeg() {
    return this.element.$(`~${FIRST_LEG}`);
  }

  get versus() {
    return this.element.$(`~${VERSUS}`);
  }
}

module.exports = FootballScoreSO;
