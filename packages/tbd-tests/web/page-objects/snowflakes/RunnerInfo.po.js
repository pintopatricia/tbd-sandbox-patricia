const {
  TEST_ID,
  SILK,
  DEFAULT_SILK,
  RUNNER,
  JOCKEY_NAME,
  JOCKEY_LABEL,
  TRAINER_LABEL,
  TRAINER_NAME,
} = require("@ppb/tbd-shared/components/RunnerInfoCard/snowflakes/RunnerInfo/RunnerInfo.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RunnerInfoPO extends BasePO {
  /**
   * Creates an RunnerInfo page object instance
   * @param {LazyElement} lazyElement
   */
  constructor() {
    super($(TEST_ID));
  }

  /**
   * Gets the silk image
   * @return {LazyElement} The silk
   */
  get silk() {
    return this.element.$(SILK);
  }

  /**
   * Gets the silk image
   * @return {LazyElement} The silk
   */
  get defaultSilk() {
    return this.element.$(DEFAULT_SILK);
  }

  /**
   * Gets the runner number and name
   * @return {LazyElement} Runner number and name
   */
  get runner() {
    return this.element.$(RUNNER);
  }

  /**
   * Gets the jockey label
   * @return {LazyElement} Jockey label
   */
  get jockeyLabel() {
    return this.element.$(JOCKEY_LABEL);
  }

  /**
   * Gets the jockey value
   * @return {LazyElement} Jockey value
   */
  get jockeyName() {
    return this.element.$(JOCKEY_NAME);
  }

  /**
   * Gets the Trainer label
   * @return {LazyElement} Trainer label
   */
  get trainerLabel() {
    return this.element.$(TRAINER_LABEL);
  }

  /**
   * Gets the Trainer value
   * @return {LazyElement} Trainer value
   */
  get trainerName() {
    return this.element.$(TRAINER_NAME);
  }
};
