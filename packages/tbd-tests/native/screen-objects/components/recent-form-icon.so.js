const {
  RECENT_FORM_ICON,
} = require("@ppb/the-wall-native/components/RecentForm/RecentFormIcon/RecentFormIcon.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RecentFormIconSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RECENT_FORM_ICON}`));
  }
}

module.exports = RecentFormIconSO;
