const {
  TAB_LABEL_TEXT,
} = require("@ppb/the-wall-native/components/TabsGroup/NavigationTabLabel/NavigationTabLabel.selectors");
const {
  GENERIC_VIEW_LINK_CARD,
} = require("@ppb/tbd-shared/components/GenericViewLinkCard/GenericViewLinkCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class GenericViewLinkCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${GENERIC_VIEW_LINK_CARD}`));
  }

  get link() {
    return this.element.$(`~${GENERIC_VIEW_LINK_CARD}`);
  }

  get linkText() {
    return this.element.$(`~${TAB_LABEL_TEXT}`);
  }
}

module.exports = GenericViewLinkCardSO;
