const {
  ALERT,
  ICON_CONTAINER,
  MESSAGE,
  ITEM,
  DETAIL,
  ACTION,
  URL,
  ACTION_LABEL,
} = require("@ppb/the-wall-native/components/Alert/Alert.selectors");
const { ACTION_LINK_TEXT } = require("@ppb/the-wall-native/components/ActionLink/ActionLink.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class AlertSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${ALERT}`));
  }

  get message() {
    return this.element.$(`~${MESSAGE}`);
  }

  get detail() {
    return this.element.$(`~${DETAIL}`);
  }

  get items() {
    return this.element.$$(`~${ITEM}`);
  }

  get icon() {
    return this.element.$(`~${ICON_CONTAINER}`);
  }

  get action() {
    return this.element.$(`~${ACTION}`);
  }

  get actionLinkText() {
    return this.element.$(`~${ACTION_LINK_TEXT}`);
  }

  get actionLabel() {
    return this.element.$(`~${ACTION_LABEL}`);
  }

  get link() {
    return this.element.$(`~${URL}`);
  }
}

module.exports = AlertSO;
