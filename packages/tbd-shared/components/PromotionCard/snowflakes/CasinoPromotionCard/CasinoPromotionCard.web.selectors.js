const styles = require("./CasinoPromotionCard.web.modules.json");

const TEST_ID = styles.promotionCard;

module.exports = {
  TEST_ID,
  PROMOTION_TITLE: styles.title,
  PROMOTION_HEADLINE: styles.headline,
  PROMOTION_SUBTITLE: styles.subtitle,
  PROMOTION_IMAGE: `${styles.promotionImageContainer} img`,
  PROMOTION_SUMMARY: `${styles.summary}`,
  PROMOTION_ACTION_BUTTON: styles.promotionAction,
};
