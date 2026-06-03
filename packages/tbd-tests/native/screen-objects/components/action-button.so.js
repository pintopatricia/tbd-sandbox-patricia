const { ACTION_BUTTON, LOADING_BAR } = require("@ppb/the-wall-native/components/ActionButton/ActionButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ActionButtonSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${ACTION_BUTTON}`));
  }

  get loadingBar() {
    return this.element.$(`~${LOADING_BAR}`);
  }
}

module.exports = ActionButtonSO;
