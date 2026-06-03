const {
  HEAD_TO_HEAD_RESULT,
  AWAY_CREST,
  HOME_CREST,
  TIME_LABEL,
  SCORE_ROW,
  INNER_CONTAINER,
  AWAY_TEAM_NAME,
  HOME_TEAM_NAME,
  CRESTS_AND_SCORE,
  SHIELD_CREST,
  SCORE,
  AET_LABEL,
  PENALTIES,
  PENALTIES_LABEL,
  PENALTIES_SCORE,
  PENALTIES_EMPTY,
} = require("@ppb/the-wall-native/components/HeadToHead/HeadToHeadResult/HeadToHeadResult.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class HeadToHeadResultSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${HEAD_TO_HEAD_RESULT}`));
  }

  get awayCrest() {
    return this.element.$(`~${AWAY_CREST}`);
  }

  get homeCrest() {
    return this.element.$(`~${HOME_CREST}`);
  }

  get timeLabel() {
    return this.element.$(`~${TIME_LABEL}`);
  }

  get scoreRow() {
    return this.element.$(`~${SCORE_ROW}`);
  }

  get innerContainer() {
    return this.element.$(`${INNER_CONTAINER}`);
  }

  get awayTeamName() {
    return this.element.$(`~${AWAY_TEAM_NAME}`);
  }

  get homeTeamName() {
    return this.element.$(`~${HOME_TEAM_NAME}`);
  }

  get crestsAndScore() {
    return this.element.$(`~${CRESTS_AND_SCORE}`);
  }

  get shieldCrests() {
    return this.element.$$(`~${SHIELD_CREST}`);
  }

  get score() {
    return this.element.$(`~${SCORE}`);
  }

  get aetLabel() {
    return this.element.$(`~${AET_LABEL}`);
  }

  get penalties() {
    return this.element.$(`~${PENALTIES}`);
  }

  get penaltiesLabel() {
    return this.element.$(`~${PENALTIES_LABEL}`);
  }

  get penaltiesScore() {
    return this.element.$(`~${PENALTIES_SCORE}`);
  }

  get penaltiesEmpty() {
    return this.element.$(`~${PENALTIES_EMPTY}`);
  }
}

module.exports = HeadToHeadResultSO;
