const {
  SNACKBAR,
  SNACKBAR_ICON,
  SNACKBAR_TITLE,
  SNACKBAR_DESCRIPTION,
  SNACKBAR_CLOSE_BUTTON,
} = require("@ppb/the-wall-native/components/Betslip/Snackbar/Snackbar.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SnackbarSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SNACKBAR}`));
  }

  get icon() {
    return this.element.$(`~${SNACKBAR_ICON}`);
  }

  get title() {
    return this.element.$(`~${SNACKBAR_TITLE}`);
  }

  get description() {
    return this.element.$(`~${SNACKBAR_DESCRIPTION}`);
  }

  get closeButton() {
    return this.element.$(`~${SNACKBAR_CLOSE_BUTTON}`);
  }
}

module.exports = SnackbarSO;
