const {
  ACTION_BUTTON,
  LOADING_BAR,
} = require("@ppb/the-wall-web/components/bricks/ActionButton/ActionButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ActionButtonPO extends BasePO {
  constructor(lazyElement, defaultLazyElement = $(ACTION_BUTTON)) {
    super(lazyElement, defaultLazyElement);
  }

  get getLoadingBar() {
    return this.element.$(LOADING_BAR);
  }
}

module.exports = ActionButtonPO;
