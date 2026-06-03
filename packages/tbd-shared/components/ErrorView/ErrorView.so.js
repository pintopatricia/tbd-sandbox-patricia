const { BaseSO } = require("@ppb/wdio-lazy-element");
const {
  ERROR_VIEW,
  LOGO,
  ILLUSTRATION,
  RETRY_BUTTON,
  RETRY_BUTTON_LABEL,
  HELP_CENTER,
  HELP_CENTER_ICON,
  HELP_CENTER_LABEL,
} = require("./ErrorView.native.selectors");

class ErrorViewSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${ERROR_VIEW}`));
  }

  get logoContainer() {
    return this.element.$(`~${LOGO}`);
  }

  get illustrationContainer() {
    return this.element.$(`~${ILLUSTRATION}`);
  }

  get retryButtonContainer() {
    return this.element.$(`~${RETRY_BUTTON}`);
  }

  get retryButtonLabel() {
    return this.element.$(`~${RETRY_BUTTON_LABEL}`);
  }

  get helpCenterContainer() {
    return this.element.$(`~${HELP_CENTER}`);
  }

  get helpCenterIcon() {
    return this.element.$(`~${HELP_CENTER_ICON}`);
  }

  get helpCenterLabel() {
    return this.element.$(`~${HELP_CENTER_LABEL}`);
  }
}

module.exports = ErrorViewSO;
