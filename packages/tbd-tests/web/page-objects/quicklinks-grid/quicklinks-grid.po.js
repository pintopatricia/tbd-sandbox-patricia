const { BasePO } = require("@ppb/wdio-lazy-element");
const QUICKLINKS_GRID_SELECTORS = require("@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroup.selectors");
const QUICKLINKS_SELECTORS = require("@ppb/the-wall-web/components/walls/QuickLink/QuickLink.modules.json");

class QuicklinksGridPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`[data-testid="${QUICKLINKS_GRID_SELECTORS.TEST_ID}"]`));
  }

  get rows() {
    return this.element.$$(
      `[data-testid="${QUICKLINKS_GRID_SELECTORS.CONTENT}"] [data-testid="${QUICKLINKS_GRID_SELECTORS.ROW}"]`,
    );
  }

  get columns() {
    return this.element.$$(
      `[data-testid="${QUICKLINKS_GRID_SELECTORS.CONTENT}"] [data-testid="${QUICKLINKS_GRID_SELECTORS.COLUMN}"]`,
    );
  }

  get quicklinks() {
    return this.element.$$(`[data-testid="${QUICKLINKS_GRID_SELECTORS.CONTENT}"] ${QUICKLINKS_SELECTORS.quickLink}`);
  }

  get labels() {
    return this.element.$$(`[data-testid="${QUICKLINKS_GRID_SELECTORS.CONTENT}"] ${QUICKLINKS_SELECTORS.text}`);
  }
}

module.exports = QuicklinksGridPO;
