const { BaseSO } = require("@ppb/wdio-lazy-element");
const { TIMES_BACKED, TIMES_BACKED_LABEL, TIMES_BACKED_ICON } = require("./TimesBacked.native.selectors");

class TimesBackedSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TIMES_BACKED}`));
  }

  get label() {
    return this.element.$(`~${TIMES_BACKED_LABEL}`);
  }

  get icon() {
    return this.element.$(`~${TIMES_BACKED_ICON}`);
  }
}

module.exports = TimesBackedSO;
