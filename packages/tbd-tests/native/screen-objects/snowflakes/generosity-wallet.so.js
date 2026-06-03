const {
  BOTTOM_SHEET,
  HEADER_TITLE,
  CONTENT,
  HEADER_CONTENT,
  FOOTER_CONTENT,
  HEADER_BUTTON,
} = require("@ppb/the-wall-native/components/BottomSheet/BottomSheet.selectors");
const {
  PRIMARY_BUTTON,
} = require("@ppb/the-wall-native/components/ActionButton/PrimaryButton/PrimaryButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { ALERT } = require("@ppb/the-wall-native/components/Alert/Alert.selectors");

class GenerosityWalletSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BOTTOM_SHEET}`));
  }

  get content() {
    return this.element.$(`~${CONTENT}`);
  }

  get headerContent() {
    return this.element.$(`~${HEADER_CONTENT}`);
  }

  get footerContent() {
    return this.element.$(`~${FOOTER_CONTENT}`);
  }

  get headerTitle() {
    return this.element.$(`~${HEADER_TITLE}`);
  }

  get closeButton() {
    return this.element.$(`~${HEADER_BUTTON}`);
  }

  get applyButton() {
    return this.element.$(`~${PRIMARY_BUTTON}`);
  }

  get footerAlert() {
    return this.footerContent.$(`~${ALERT}`);
  }
}

module.exports = GenerosityWalletSO;
