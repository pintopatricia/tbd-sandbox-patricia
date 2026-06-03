const {
  MODAL_HEADER,
  MODAL_HEADER_TITLE,
  MODAL_HEADER_CLOSE_BUTTON,
} = require("@ppb/the-wall-native/components/ModalHeader/ModalHeader.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ModalHeaderSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MODAL_HEADER}`));
  }

  get title() {
    return this.element.$(`~${MODAL_HEADER_TITLE}`);
  }

  get close() {
    return this.element.$(`~${MODAL_HEADER_CLOSE_BUTTON}`);
  }
}

module.exports = ModalHeaderSO;
