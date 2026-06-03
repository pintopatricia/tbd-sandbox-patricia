const { ACTION_LINK, ACTION_LINK_TEXT } = require("@ppb/the-wall-native/components/ActionLink/ActionLink.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ActionLinkSo extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${ACTION_LINK}`));
  }

  get text() {
    return this.element.$(`~${ACTION_LINK_TEXT}`);
  }
}

module.exports = ActionLinkSo;
