const userProfileStyles = require("@ppb/tbd-shared/components/UserProfile/snowflakes/UserProfile/UserProfile.web.modules.json");
const cardStyles = require("@ppb/the-wall-web/components/bricks/Card/Card.modules.json");
const stylesRewardCard = require("@ppb/tbd-shared/components/UserProfile/snowflakes/RewardCard/RewardCard.web.modules.json");
const stylesRewardsStats = require("@ppb/tbd-shared/components/UserProfile/snowflakes/RewardStats/RewardsStats.web.modules.json");
const stylesQuickLink = require("@ppb/the-wall-web/components/walls/QuickLink/QuickLink.modules.json");
const stylesProgressBar = require("@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar.modules.json");

const TEST_ID = userProfileStyles.rewardsContainer;
const {
  NEXT_MONTH_SECTION,
  NEXT_MONTH_SECTION_LINK,
  NEXT_MONTH_SECTION_PROGRESS_MESSAGE,
  CURRENT_MONTH_SECTION,
  CURRENT_MONTH_SECTION_MONTH,
  CURRENT_MONTH_SECTION_PROGRESS_MESSAGE,
  CURRENT_MONTH_SECTION_PROGRESS_MESSAGE_CLICK_LINK,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/Rewards/Rewards.web.selectors");

module.exports = {
  TEST_ID,
  BASIC_PLAN_TITLE: `${TEST_ID} ${stylesQuickLink.quickLink} ${stylesQuickLink.text}`,
  CHOSEN_PLAN_TITLE: `${TEST_ID} ${cardStyles.card} ${cardStyles.title} `,
  NEXT_MONTH_SECTION_LINK,
  NEXT_MONTH_SECTION,
  NEXT_MONTH_SECTION_MONTH: `${TEST_ID} ${stylesRewardsStats.rewardsBar} ${stylesRewardsStats.monthRewards} h6`,
  NEXT_MONTH_SECTION_COUNTER: `${TEST_ID} ${stylesRewardsStats.rewardsBar} ${stylesRewardsStats.monthRewards} span`,
  NEXT_MONTH_SECTION_PROGRESS_BAR_BETS_NUMBER: `${TEST_ID} ${stylesProgressBar.defaultHomeColor}`,
  NEXT_MONTH_SECTION_PROGRESS_BAR: `${TEST_ID} ${stylesProgressBar.container}`,
  NEXT_MONTH_SECTION_PROGRESS_MESSAGE,
  CURRENT_MONTH_SECTION,
  CURRENT_MONTH_SECTION_MONTH,
  CURRENT_MONTH_SECTION_PROGRESS_MESSAGE,
  CURRENT_MONTH_SECTION_PROGRESS_MESSAGE_CLICK_LINK,
  REWARD_CARD_TITLE: stylesRewardCard.title,
  TITLE_CONTAINER: `${userProfileStyles.rewardsContainer} ${userProfileStyles.title}`,
  REWARDS_SWIMLANE: `${TEST_ID} ${userProfileStyles.rewardsCardContainer}`,
  REWARD_CARD_BENEFIT_LIST: `${stylesRewardCard.box} .typography-h152`,
};
