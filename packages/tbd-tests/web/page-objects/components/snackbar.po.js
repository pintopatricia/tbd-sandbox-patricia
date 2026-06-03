const {
  TEST_ID,
  CONTAINER,
  TITLE,
  DESCRIPTION,
  CLOSE_BUTTON,
  ICON,
} = require("@ppb/the-wall-web/components/bricks/Snackbar/Snackbar.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SnackbarPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get closeButton() {
    return this.element.$(CLOSE_BUTTON);
  }

  get container() {
    return this.element.$(CONTAINER);
  }

  get title() {
    return this.element.$(TITLE);
  }

  get description() {
    return this.element.$(DESCRIPTION);
  }

  get icon() {
    return this.element.$(ICON);
  }
}

module.exports = SnackbarPO;
