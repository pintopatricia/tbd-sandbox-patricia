const {
  TEST_ID,
  TITLE,
  SUBTITLE,
  ACTION,
  EDIT,
  REMOVE,
  RUNNER_VISUAL,
  BOG,
  NINETY_MINUTE_ICON,
  SELECTION_TYPE_ICON,
} = require("@ppb/the-wall-web/components/walls/BetDetails/BetDetails.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetDetailsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get states() {
    return {
      back: "blueBg",
      lay: "pinkBg",
    };
  }

  static get actionTypes() {
    return {
      remove: "trash",
      edit: "edit",
    };
  }

  get title() {
    return this.element.$(TITLE);
  }

  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  get action() {
    return this.element.$(ACTION);
  }

  get edit() {
    return this.element.$(EDIT);
  }

  get remove() {
    return this.element.$(REMOVE);
  }

  get bog() {
    return this.element.$(BOG);
  }

  get runnerVisual() {
    return this.element.$(RUNNER_VISUAL);
  }

  get ninetyMinIcon() {
    return this.element.$(NINETY_MINUTE_ICON);
  }

  get selectionTypeIcon() {
    return this.element.$(SELECTION_TYPE_ICON);
  }
}

module.exports = BetDetailsPO;
