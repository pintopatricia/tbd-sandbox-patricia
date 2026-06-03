const {
  SELF_EXCLUSION_DETAILS,
  SELF_EXCLUSION_DETAILS_EMPTY_STATE_MESSAGE,
  SELF_EXCLUSION_DETAILS_EMPTY_STATE_MESSAGE_TEXT,
  SELF_EXCLUSION_DETAILS_IMAGE,
  SELF_EXCLUSION_DETAILS_SAFER_GAMBLING,
  SELF_EXCLUSION_DETAILS_CONTACT,
} = require("@ppb/tbd-components-navigation/components/SelfExclusionCard/view/snowflakes/SelfExclusion/SelfExclusion.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class EmptyStateSO extends BaseSO {
  /**
   * Creates a secondary event card page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${SELF_EXCLUSION_DETAILS}`));
  }

  /**
   * @return {HTMLElement} The Empty State Component
   */
  get emptyStateMessage() {
    return this.element.$(`~${SELF_EXCLUSION_DETAILS_EMPTY_STATE_MESSAGE}`);
  }

  /**
   * @return {HTMLElement} The Empty State Message Text
   */
  get emptyStateMessageText() {
    return this.element.$(`~${SELF_EXCLUSION_DETAILS_EMPTY_STATE_MESSAGE_TEXT}`);
  }

  /**
   * @return {HTMLElement} The Image Component
   */
  get image() {
    return this.element.$(`~${SELF_EXCLUSION_DETAILS_IMAGE}`);
  }

  /**
   * @return {HTMLElement} The Safer Gambling button
   */
  get saferGambling() {
    return this.element.$(`~${SELF_EXCLUSION_DETAILS_SAFER_GAMBLING}`);
  }

  /**
   * @return {HTMLElement} The Contact link
   */
  get contact() {
    return this.element.$(`~${SELF_EXCLUSION_DETAILS_CONTACT}`);
  }
};
