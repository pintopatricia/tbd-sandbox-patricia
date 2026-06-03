const styles = require("./PromotionCard.web.modules.json");

const TEST_ID = styles.promotionCard;

module.exports = {
  TEST_ID,
  PROMOTION_ACTION_BUTTON: styles.promotionAction,
  PROMOTION_CARD_LINK: styles.promotionCardLink,
  PROMOTION_BET_BUTTON: styles.betButton,
  PROMOTION_BODY: styles.promotionBody,
  PROMOTION_HEADER: styles.promotionHeader,
  PROMOTION_IMAGE: styles.promotionImage,
  PROMOTION_IMAGE_CONTAINER: styles.promotionImageContainer,
  PROMOTION_LINK_TAG: styles.linkTag,
  PROMOTION_MI_HREF: `${styles.promotionCardLink} a`,
  PROMOTION_ODDS_BOOST_TAG: styles.oddsBoostTag,
  PROMOTION_SUMMARY: styles.promotionSummary,
  PROMOTION_TERMS_AND_CONDITIONS_LINK: styles.promotionTermsAndConditionsLink,
};
