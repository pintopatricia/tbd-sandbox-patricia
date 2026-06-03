const { TEAMS } = require("@ppb/the-wall-native/components/Scoreboard/Teams/Teams.selectors");
const { SCORE } = require("@ppb/the-wall-native/components/Scoreboard/Score/Score.selectors");

const {
  AVB_SCOREBOARD,
  DATE_TIME,
} = require("@ppb/the-wall-native/components/Scoreboard/AvBScoreboard/AvBScoreboard.selectors");
const {
  STATUS_LABEL_LABEL,
} = require("@ppb/the-wall-native/components/bricks/Indicators/StatusLabel/StatusLabel.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class AvBScoreboardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${AVB_SCOREBOARD}`));
  }

  get teams() {
    return this.element.$(`~${TEAMS}`);
  }

  get score() {
    return this.element.$(`~${SCORE}`);
  }

  get matchInfo() {
    return this.element.$(`~${STATUS_LABEL_LABEL}`);
  }

  get dateTime() {
    return this.element.$(`~${DATE_TIME}`);
  }
}

module.exports = AvBScoreboardSO;
