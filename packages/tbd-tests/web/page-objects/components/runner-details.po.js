const {
  TEST_ID,
  AGE_LABEL,
  AGE,
  WEIGHT_LABEL,
  WEIGHT,
  OFFICIAL_RATING_LABEL,
  OFFICIAL_RATING,
  EQUIPMENT_LABEL,
  EQUIPMENT,
  BRED_LABEL,
  BRED,
  GRAPHS,
  TIMEFORM_LOGO,
  RUNNER_COMMENT,
  PEDIGREE,
} = require("@ppb/the-wall-web/components/walls/RunnerDetails/RunnerDetails.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RunnerDetails extends BasePO {
  /**
   * Creates an RunnerDetails page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the runner Age label
   * @return {LazyElement} Age label
   */
  get ageLabel() {
    return this.element.$(AGE_LABEL);
  }

  /**
   * Gets the runner Age
   * @return {LazyElement} Age value
   */
  get age() {
    return this.element.$(AGE);
  }

  /**
   * Gets the runner Weight label
   * @return {LazyElement} Weight label
   */
  get weightLabel() {
    return this.element.$(WEIGHT_LABEL);
  }

  /**
   * Gets the runner Weight
   * @return {LazyElement} Weight value
   */
  get weight() {
    return this.element.$(WEIGHT);
  }

  /**
   * Gets the runner Official rating label
   * @return {LazyElement} Official rating label
   */
  get officialRatingLabel() {
    return this.element.$(OFFICIAL_RATING_LABEL);
  }

  /**
   * Gets the runner Official rating
   * @return {LazyElement} Official rating value
   */
  get officialRating() {
    return this.element.$(OFFICIAL_RATING);
  }

  /**
   * Gets the runner Equipment label
   * @return {LazyElement} Equipment label
   */
  get equipmentLabel() {
    return this.element.$(EQUIPMENT_LABEL);
  }

  /**
   * Gets the runner Equipment
   * @return {LazyElement} Equipment value
   */
  get equipment() {
    return this.element.$(EQUIPMENT);
  }

  /**
   * Gets the runner Bred
   * @return {LazyElement} Bred value
   */
  get bred() {
    return this.element.$(BRED);
  }

  /**
   * Gets the runner Bred label
   * @return {LazyElement} Bred label
   */
  get bredLabel() {
    return this.element.$(BRED_LABEL);
  }

  get graphs() {
    return this.element.$(GRAPHS);
  }

  get timeformLogo() {
    return this.element.$(TIMEFORM_LOGO);
  }

  get runnerComment() {
    return this.element.$(RUNNER_COMMENT);
  }

  get pedigree() {
    return this.element.$(PEDIGREE);
  }
};
