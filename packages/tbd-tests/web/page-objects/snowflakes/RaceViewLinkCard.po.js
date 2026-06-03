const {
  TEST_ID,
  TITLE,
  SUBTITLE,
  SUBTITLE_LABEL,
  IMAGE,
  ARROW,
} = require("@ppb/tbd-shared/components/RaceViewLinkCard/snowflakes/RaceViewLinkCard/RaceViewLinkCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RaceViewLinkCardPO extends BasePO {
  /**
   * Creates a race view link card page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the title of the card
   * @return {HTMLElement} The title
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the subtitle of the card
   * @return {HTMLElement} The subtitle
   */
  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  /**
   * Gets the subtitle label of the card
   * @return {HTMLElement} The subtitle label
   */
  get subtitleLabel() {
    return this.element.$(SUBTITLE_LABEL);
  }

  /**
   * Gets the image of the card
   * @return {Image} The image
   */
  get image() {
    return this.element.$(IMAGE);
  }

  /**
   * Gets the arrow icon of the card
   * @return {HTMLElement} The arrow
   */
  get arrow() {
    return this.element.$(ARROW);
  }
};
