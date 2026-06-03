const { BaseSO } = require("@ppb/wdio-lazy-element");
const { NOT_FOUND_VIEW, LINKS_CONTAINER, LINK } = require("./NotFoundView.native.selectors");

class NotFoundViewSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${NOT_FOUND_VIEW}`));
  }

  get linkContainer() {
    return this.element.$(`~${LINKS_CONTAINER}`);
  }

  get links() {
    return this.element.$$(`~${LINK}`);
  }
}

module.exports = NotFoundViewSO;
