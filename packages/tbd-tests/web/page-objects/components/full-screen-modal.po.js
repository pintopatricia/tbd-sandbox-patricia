const {
  MODAL,
  CONTENT,
  HEADER,
  TITLE,
  CLOSE_BTN,
} = require("@ppb/the-wall-web/components/bricks/FullScreenModal/FullScreenModal.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class FullScreenModalPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(MODAL));
  }

  get header() {
    return this.element.$(HEADER);
  }

  get headerTitle() {
    return this.element.$(TITLE);
  }

  get closeBtn() {
    return this.element.$(CLOSE_BTN);
  }

  get content() {
    return this.element.$(CONTENT);
  }
}

module.exports = FullScreenModalPO;
