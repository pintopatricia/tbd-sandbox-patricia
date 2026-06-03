const { BaseSO } = require("@ppb/wdio-lazy-element");

const {
  NO_CONTENT_AVAILABLE,
  NO_CONTENT_AVAILABLE_FIRST_LABEL,
  NO_CONTENT_AVAILABLE_SECOND_LABEL,
} = require("./NoContentAvailableCard.native.selectors");

class NoContentAvailableCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${NO_CONTENT_AVAILABLE}`));
  }

  get firstLabel() {
    return this.element.$(`~${NO_CONTENT_AVAILABLE_FIRST_LABEL}`);
  }

  get secondLabel() {
    return this.element.$(`~${NO_CONTENT_AVAILABLE_SECOND_LABEL}`);
  }
}

module.exports = NoContentAvailableCardSO;
