const {
  TAB_HOME,
  TAB_BROWSE,
  TAB_MY_BETS,
  TAB_GAMING,
  TAB_SWITCHER,
  TAB_SWITCHER_LABEL,
  TAB_PROMOTIONS,
} = require("./bottom-bar.selectors");

class BottomBarSO {
  static get home() {
    return $(`~${TAB_HOME}`);
  }

  static get browse() {
    return $(`~${TAB_BROWSE}`);
  }

  static get myBets() {
    return $(`~${TAB_MY_BETS}`);
  }

  static get gaming() {
    return $(`~${TAB_GAMING}`);
  }

  static get switcher() {
    return $(`~${TAB_SWITCHER}`);
  }

  static get switcherLabel() {
    return $(`~${TAB_SWITCHER_LABEL}`);
  }

  static get promotions() {
    return $(`~${TAB_PROMOTIONS}`);
  }
}

module.exports = BottomBarSO;
