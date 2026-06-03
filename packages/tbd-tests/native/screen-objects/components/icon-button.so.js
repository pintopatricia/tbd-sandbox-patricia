const {
  ICON_BUTTON,
  ICON_BUTTON_ICON_WRAPPER,
  ICON_BUTTON_TEXT,
  ICON_BUTTON_TEXT_SELECTED,
} = require("@ppb/the-wall-native/components/IconButton/IconButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class IconButton extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${ICON_BUTTON}`));
  }

  get iconWrapper() {
    return this.element.$(`~${ICON_BUTTON_ICON_WRAPPER}`);
  }

  get text() {
    return this.element.$(`~${ICON_BUTTON_TEXT}`);
  }

  get selectedText() {
    return this.element.$(`~${ICON_BUTTON_TEXT_SELECTED}`);
  }
}

module.exports = IconButton;
