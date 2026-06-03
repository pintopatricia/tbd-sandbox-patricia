const {
  CONFIRM_DRAWER,
  CONFIRM_DRAWER_TITLE,
  CONFIRM_DRAWER_SUBTITLE,
  CONFIRM_DRAWER_REFUSE_BUTTON,
  CONFIRM_DRAWER_ACCEPT_BUTTON,
  CONFIRM_DRAWER_REFUSE_LABEL,
  CONFIRM_DRAWER_ACCEPT_LABEL,
} = require("@ppb/the-wall-native/components/Drawer/ConfirmDrawer/ConfirmDrawer.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ConfirmDrawerSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CONFIRM_DRAWER}`));
  }

  get title() {
    return this.element.$(`~${CONFIRM_DRAWER_TITLE}`);
  }

  get subtitle() {
    return this.element.$(`~${CONFIRM_DRAWER_SUBTITLE}`);
  }

  get refuseButton() {
    return this.element.$(`~${CONFIRM_DRAWER_REFUSE_BUTTON}`);
  }

  get acceptButton() {
    return this.element.$(`~${CONFIRM_DRAWER_ACCEPT_BUTTON}`);
  }

  get refuseLabel() {
    return this.element.$(`~${CONFIRM_DRAWER_REFUSE_LABEL}`);
  }

  get acceptLabel() {
    return this.element.$(`~${CONFIRM_DRAWER_ACCEPT_LABEL}`);
  }
}

module.exports = ConfirmDrawerSO;
