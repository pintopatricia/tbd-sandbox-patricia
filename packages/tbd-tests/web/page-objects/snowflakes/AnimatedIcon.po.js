const {
  TEST_ID,
  TEXT,
} = require("@ppb/tbd-shared/components/HalfTimeSpecialsSwimlaneCardGroup/snowflakes/AnimatedIcon/AnimatedIcon.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class AnimatedIconPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the text of the icon
   * @return {HTMLElement} The text
   */
  get text() {
    return this.element.$(TEXT);
  }
};
