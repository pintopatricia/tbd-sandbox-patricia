const {
  TEST_ID,
  SUBTITLE,
  BTTS_ICON,
} = require("@ppb/the-wall-web/components/bricks/RecentFormIcon/RecentFormIcon.selectors");
const styles = require("@ppb/the-wall-web/components/bricks/RecentFormIcon/RecentFormIcon.modules.json");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RecentFormResultPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get iconTypes() {
    return {
      WIN: styles.win.replace(".", ""),
      LOSE: styles.lose.replace(".", ""),
      DRAW: styles.draw.replace(".", ""),
    };
  }

  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  get bttsIcon() {
    return this.element.$(BTTS_ICON);
  }
};
