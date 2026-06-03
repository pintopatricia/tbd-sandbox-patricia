const {
  TAB_LABEL_CONTAINER,
  TAB_LABEL_COUNTER,
  TAB_LABEL_ICON,
  TAB_LABEL_ICON_COUNTER,
  TAB_LABEL_TEXT,
} = require("@ppb/the-wall-native/components/TabsGroup/NavigationTabLabel/NavigationTabLabel.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class NavigationTabLabelSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TAB_LABEL_CONTAINER}`));
  }

  get counter() {
    return this.element.$(`~${TAB_LABEL_COUNTER}`);
  }

  get icon() {
    return this.element.$(`~${TAB_LABEL_ICON}`);
  }

  get iconCounter() {
    return this.element.$(`~${TAB_LABEL_ICON_COUNTER}`);
  }

  get text() {
    return this.element.$(`~${TAB_LABEL_TEXT}`);
  }
}

module.exports = NavigationTabLabelSO;
