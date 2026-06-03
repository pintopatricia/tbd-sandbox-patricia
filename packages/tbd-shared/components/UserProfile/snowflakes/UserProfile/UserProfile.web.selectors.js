const { TEST_ID: NAV_BUTTON } = require("../NavButton/NavButton.web.selectors");
const { MENU_LINK } = require("../UserMenu/UserMenu.web.selectors");
const styles = require("./UserProfile.web.modules.json");

const TEST_ID = styles.userProfile;

module.exports = {
  TEST_ID,
  TITLE: `${styles.title}`,
  LAST_LOGIN: `${styles.lastLogin}`,
  ACCOUNT_DETAILS_SECTION: `${TEST_ID} .ACCOUNT_DETAILS`,
  MY_WALLET_SECTION: `${TEST_ID} .PAYMENTS`,
  BETTING_ACTIVITY_SECTION: `${TEST_ID} .BETTING`,
  PROMOTIONS_SECTION: `${TEST_ID} .PROMOTIONS_REWARDS`,
  GROUP_SECTIONS: `${styles.sectionGroupMenu}`,
  QUICK_MENU_BUTTONS_LIST: `${TEST_ID} ${NAV_BUTTON}`,
  QUICK_MENU_REDIRECT_LIST: `${TEST_ID} ${NAV_BUTTON}`,
  LOG_OUT_BUTTON_LINK: `${TEST_ID} ${MENU_LINK}`,
  REWARDS_CONTAINER: `${styles.rewardsCardContainer} > *`,
};
