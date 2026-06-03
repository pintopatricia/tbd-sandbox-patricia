const {
  TEST_ID,
  PM_CONTENT,
  PM_CONTENT_TEXT,
  PM_LOGO,
  PM_TITLE,
  PM_CTA,
  PM_CTA_LABEL,
  PM_TERMS,
  PM_CIRCLES,
  PM_CIRCLES_TURQUOISE,
  PM_CIRCLES_FUCHSIA,
  PM_CIRCLES_LIME,
  PM_NEONS,
  PM_TOP_IMAGE,
  PM_BOTTOM_LEFT_IMAGE,
  PM_BOTTOM_RIGHT_IMAGE,
  PM_POST_PLAY_WIDGET,
  PM_POST_PLAY_WIDGET_LINK,
} = require("@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/view/snowflakes/PrizeMachine/PrizeMachine.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class PrizeMachinePO extends BasePO {
  /**
   * Creates a Prize Machine page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(`[data-testid="${TEST_ID}"]`));
  }

  /**
   * Gets the prize machine content
   * @return {HTMLElement} The prize machine content
   */
  get pmContent() {
    return this.element.$(`[data-testid="${PM_CONTENT}"]`);
  }

  /**
   * Gets the prize machine content text
   * @return {HTMLElement} the prize machine content text
   */
  get pmContentText() {
    return this.element.$(`[data-testid="${PM_CONTENT_TEXT}"]`);
  }

  /**
   * Gets the prize machine logo
   * @return {HTMLElement} The prize machine logo
   */
  get pmLogo() {
    return this.element.$(`[data-testid="${PM_LOGO}"]`);
  }

  /**
   * Gets the prize machine title
   * @return {HTMLElement} The prize machine title
   */
  get pmTitle() {
    return this.element.$(`[data-testid="${PM_TITLE}"]`);
  }

  /**
   * Gets the prize machine CTA
   * @return {HTMLElement} The prize machine CTA
   */
  get pmCTA() {
    return this.element.$(`[data-testid="${PM_CTA}"]`);
  }

  /**
   * Gets the prize machine CTA label
   * @return {HTMLElement} The prize machine CTA label
   */
  get pmCTALabel() {
    return this.element.$(`[data-testid="${PM_CTA_LABEL}"]`);
  }

  /**
   * Gets the prize machine terms
   * @return {HTMLElement} The prize machine terms
   */
  get pmTerms() {
    return this.element.$(`[data-testid="${PM_TERMS}"]`);
  }

  /**
   * Gets the prize machine circles
   * @return {HTMLElement} The prize machine circles
   */
  get pmCircles() {
    return this.element.$(`[data-testid="${PM_CIRCLES}"]`);
  }

  /**
   * Gets the prize machine circle turquoise
   * @return {HTMLElement} The prize machine circle turqoise
   */
  get pmCircleTurquoise() {
    return this.element.$(`[data-testid="${PM_CIRCLES_TURQUOISE}"]`);
  }

  /**
   * Gets the prize machine circle fuchsia
   * @return {HTMLElement} The prize machine circle fuchsia
   */
  get pmCircleFuchsia() {
    return this.element.$(`[data-testid="${PM_CIRCLES_FUCHSIA}"]`);
  }

  /**
   * Gets the prize machine circle lime
   * @return {HTMLElement} The prize machine circle lime
   */
  get pmCircleLime() {
    return this.element.$(`[data-testid="${PM_CIRCLES_LIME}"]`);
  }

  /**
   * Gets the prize machine neons
   * @return {HTMLElement} The prize machine neons
   */
  get pmNeons() {
    return this.element.$(`[data-testid="${PM_NEONS}"]`);
  }

  /**
   * Gets the prize machine top left image
   * @return {HTMLElement} The prize machine top left image
   */
  get topLeftImage() {
    return this.element.$(`[data-testid="${PM_TOP_IMAGE}"]`);
  }

  /**
   * Gets the prize machine bottom left image
   * @return {HTMLElement} The prize machine bottom left image
   */
  get bottomLeftImage() {
    return this.element.$(`[data-testid="${PM_BOTTOM_LEFT_IMAGE}"]`);
  }

  /**
   * Gets the prize machine bottom right
   * @return {HTMLElement} The prize machine bottom right image
   */
  get bottomRightImage() {
    return this.element.$(`[data-testid="${PM_BOTTOM_RIGHT_IMAGE}"]`);
  }

  /**
   * Gets the post play widget
   * @return {HTMLElement} The post play widget
   */
  get postPlayWidget() {
    return this.element.$(`[data-testid="${PM_POST_PLAY_WIDGET}"]`);
  }

  /**
   * Gets the post play widget link
   * @return {HTMLElement} The post play widget link
   */
  get postPlayWidgetLink() {
    return this.element.$(`[data-testid="${PM_POST_PLAY_WIDGET_LINK}"]`);
  }
};
