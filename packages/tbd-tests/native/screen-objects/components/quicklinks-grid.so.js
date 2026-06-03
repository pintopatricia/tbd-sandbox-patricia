const QUICKLINKS_GRID_SELECTORS = require("@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroup.selectors");
const { TITLE } = require("@ppb/the-wall-native/components/CardGroup/CardGroup.selectors");
const { QUICK_LINK } = require("@ppb/the-wall-native/components/QuickLink/QuickLink.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class QuicklinksGridSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${QUICKLINKS_GRID_SELECTORS.TEST_ID}`));
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }

  get rows() {
    return this.element.$$(`~${QUICKLINKS_GRID_SELECTORS.ROW}`);
  }

  get columns() {
    return this.element.$$(`~${QUICKLINKS_GRID_SELECTORS.COLUMN}`);
  }

  get quicklinks() {
    return this.element.$$(`~${QUICK_LINK}`);
  }
}

module.exports = QuicklinksGridSO;
