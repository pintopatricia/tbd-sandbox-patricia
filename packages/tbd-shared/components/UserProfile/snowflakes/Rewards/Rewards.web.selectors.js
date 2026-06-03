const styles = require("./Rewards.web.modules.json");

const TEST_ID = styles.rewardsCard;
const NEXT_MONTH = `${TEST_ID} div:nth-child(1) ${styles.rewardsContainer}`;
const CURRENT_MONTH = `${TEST_ID} div:nth-child(2) ${styles.rewardsContainer}`;

module.exports = {
  TEST_ID,
  REWARDS_MESSAGE: styles.rewardsMessageComplete,
  MESSAGE_VALUE: styles.rewardsMessageValue,
  NEXT_MONTH_SECTION_LINK: `${TEST_ID} div:nth-child(1) a`,
  NEXT_MONTH_SECTION: NEXT_MONTH,
  NEXT_MONTH_SECTION_PROGRESS_MESSAGE: `${NEXT_MONTH} ${styles.rewardsMessageComplete}`,
  CURRENT_MONTH_SECTION: CURRENT_MONTH,
  CURRENT_MONTH_SECTION_MONTH: `${CURRENT_MONTH} h6`,
  CURRENT_MONTH_SECTION_PROGRESS_MESSAGE: `${CURRENT_MONTH} ${styles.rewardsMessageComplete}`,
  CURRENT_MONTH_SECTION_PROGRESS_MESSAGE_CLICK_LINK: `${CURRENT_MONTH} ${styles.rewardsMessageValue}`,
};
