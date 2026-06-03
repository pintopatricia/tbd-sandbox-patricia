const {
  TEST_ID,
  COMPETITION,
  OPPONENTS,
  HOME_TEAM,
  AWAY_TEAM,
  OUTCOME,
  SCORE,
  HOME_CREST,
  AWAY_CREST,
  HOME_SHIELD,
  AWAY_SHIELD,
  AET,
  PENALTIES,
  DATE,
} = require("@ppb/the-wall-web/components/bricks/HeadToHeadResult/HeadToHeadResult.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class HeadToHeadResultPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the competition name
   * @return {HTMLElement} HeadToHead competition name
   */
  get competition() {
    return this.element.$(COMPETITION);
  }

  /**
   * Gets the opponents
   * @return {HTMLElement} HeadToHead opponents
   */
  get opponents() {
    return this.element.$(OPPONENTS);
  }

  /**
   * Gets the home team
   * @return {HTMLElement} HeadToHead home team
   */
  get homeTeam() {
    return this.element.$(HOME_TEAM);
  }

  /**
   * Gets the away team
   * @return {HTMLElement} HeadToHead away team
   */
  get awayTeam() {
    return this.element.$(AWAY_TEAM);
  }

  /**
   * Gets the outcome
   * @return {HTMLElement} HeadToHead outcome
   */
  get outcome() {
    return this.element.$(OUTCOME);
  }

  /**
   * Gets the score
   * @return {HTMLElement} HeadToHead score
   */
  get score() {
    return this.element.$(SCORE);
  }

  /**
   * Gets the home team crest
   * @return {HTMLElement} HeadToHead home team crest
   */
  get homeCrest() {
    return this.element.$(HOME_CREST);
  }

  /**
   * Gets the away team crest
   * @return {HTMLElement} HeadToHead away team crest
   */
  get awayCrest() {
    return this.element.$(AWAY_CREST);
  }

  /**
   * Gets the home team shield
   * @return {HTMLElement} HeadToHead home team shield
   */
  get homeShield() {
    return this.element.$(HOME_SHIELD);
  }

  /**
   * Gets the away team shield
   * @return {HTMLElement} HeadToHead away team shield
   */
  get awayShield() {
    return this.element.$(AWAY_SHIELD);
  }

  /**
   * Gets the AET
   * @return {HTMLElement} HeadToHead AET
   */
  get afterExtraTime() {
    return this.element.$(AET);
  }

  /**
   * Gets the penalties score
   * @return {HTMLElement} HeadToHead penalties score
   */
  get penalties() {
    return this.element.$(PENALTIES);
  }

  /**
   * Gets the date of the event
   * @return {HTMLElement} HeadToHead event date
   */
  get date() {
    return this.element.$(DATE);
  }
};
