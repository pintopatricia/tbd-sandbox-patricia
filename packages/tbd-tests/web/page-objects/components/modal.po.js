const {
  BODY_CONTAINER,
  FOOTER_CONTAINER,
  HEADER_CLOSE_BTN,
  HEADER_CONTAINER,
  HEADER_TITLE,
  MODAL,
  OVERLAY,
} = require("@ppb/the-wall-web/components/bricks/Modal/Modal.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

class ModalPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(MODAL));
  }

  get overlay() {
    return this.element.$(OVERLAY);
  }

  get header() {
    return this.element.$(HEADER_CONTAINER);
  }

  get headerTitle() {
    return this.element.$(HEADER_TITLE);
  }

  get headerCloseBtn() {
    return this.element.$(HEADER_CLOSE_BTN);
  }

  get body() {
    return this.element.$(BODY_CONTAINER);
  }

  get footer() {
    return this.element.$(FOOTER_CONTAINER);
  }
}

module.exports = ModalPO;
