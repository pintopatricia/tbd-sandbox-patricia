const {
  TAB_BUTTON,
  TAB_ICON,
  TAB_SELECT_BAR,
  TAB_TITLE,
} = require("@ppb/the-wall-web/components/bricks/SingleTab/SingleTab.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SingleTabPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TAB_BUTTON));
  }

  get icon() {
    return this.element.$(TAB_ICON);
  }

  get badge() {
    return this.element.$(TAB_BUTTON);
  }

  get selectBar() {
    return this.element.$(TAB_SELECT_BAR);
  }

  get title() {
    return this.element.$(TAB_TITLE);
  }
}

module.exports = SingleTabPO;
