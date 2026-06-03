const {
  TEST_ID,
  TITLE,
  SUBTITLE,
} = require("@ppb/tbd-shared/components/HalfTimeSpecialsSwimlaneCardGroup/HalfTimeSpecialsSwimlaneCardGroup.web.selectors");
const {
  TEST_ID: ANIMATED_ICON,
} = require("@ppb/tbd-shared/components/HalfTimeSpecialsSwimlaneCardGroup/snowflakes/AnimatedIcon/AnimatedIcon.web.selectors");
const {
  TEST_ID: SCROLLABLE_SWIMLANE,
} = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class HalfTimeSpecialsSwimlaneCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the half time specials swimlane card group title
   * @return {HTMLElement} The half time specials swimlane card group title
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the half time specials swimlane card group subtitle
   * @return {HTMLElement} The half time specials swimlane card group subtitle
   */
  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  /**
   * Gets the half time specials swimlane card group scrollable swimlane
   * @return {HTMLElement} The half time specials swimlane card group scrollable swimlane
   */
  get scrollableSwimlane() {
    return this.element.$(SCROLLABLE_SWIMLANE);
  }

  /**
   * Gets the half time specials swimlane card group animated icon
   * @return {HTMLElement} The half time specials swimlane card group animated icon
   */
  get animatedIcon() {
    return this.element.$(ANIMATED_ICON);
  }
};
