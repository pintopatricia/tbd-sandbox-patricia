const { NAV_BAR_BACK_BUTTON } = require("./navbar.selectors");

class NavBarSO {
  static get backButton() {
    // Not necessary to have the `~` because this is not a Test ID selector
    return $(NAV_BAR_BACK_BUTTON);
  }

  static async tap() {
    const button = await $(NAV_BAR_BACK_BUTTON);
    await button.click();
  }
}

module.exports = NavBarSO;
