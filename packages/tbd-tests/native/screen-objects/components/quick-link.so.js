const {
  QUICK_LINK,
  QUICK_LINK_LABEL,
  QUICK_LINK_ICON,
  QUICK_LINK_ARROW_ICON,
} = require("@ppb/the-wall-native/components/QuickLink/QuickLink.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class QuickLinkSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${QUICK_LINK}`));
  }

  get label() {
    return this.element.$(`~${QUICK_LINK_LABEL}`);
  }

  get icon() {
    return this.element.$(`~${QUICK_LINK_ICON}`);
  }

  get arrowIcon() {
    return this.element.$(`~${QUICK_LINK_ARROW_ICON}`);
  }
}

module.exports = QuickLinkSO;
