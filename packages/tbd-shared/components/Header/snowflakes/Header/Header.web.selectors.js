const stylesButton = require("@ppb/the-wall-web/components/bricks/ActionButton/ActionButton.modules.json");
const styles = require("./Header.web.modules.json");

module.exports = {
  TEST_ID: `${styles.header}`,
  BACK_BUTTON: `${styles.backButton}`,
  BACK_BUTTON_ICON: `${styles.backButton} svg`,
  LOGO_CONTAINER: `${styles.logoLink}`,
  LOGO: `${styles.logoContainer} svg`,
  BALANCE_BUTTON: `${styles.accountContainer}`,
  BALANCE_LABEL: `${styles.balanceLabel}`,
  GENEROSITY_WALLET_BUTTON: `${styles.generosityWalletActionContainer}`,
  BALANCE_ICON: `${styles.userIconContainer}`,
  LOGIN_CONTAINER: `${styles.loginContainer}`,
  LOGIN_BUTTON: `${stylesButton.actionButton}:nth-child(1)`,
  JOIN_NOW_BUTTON: `${stylesButton.actionButton}:nth-child(2)`,
  MENU_BUTTON: `${styles.menuButton}`,
  NOTIFICATIONS_ICON_CONTAINER: `${styles.notificationIconContainer}`,
};
