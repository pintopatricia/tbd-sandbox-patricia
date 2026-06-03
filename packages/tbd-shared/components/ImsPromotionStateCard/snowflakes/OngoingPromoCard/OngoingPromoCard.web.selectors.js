const stylesProgressBar = require("@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar.modules.json");
const { TEST_ID: ACTION_LINK } = require("@ppb/the-wall-web/components/bricks/ActionLink/ActionLink.selectors");
const stylesOngoingBadge = require("../OngoingBadge/OngoingBadge.web.modules.json");
const styles = require("./OngoingPromoCard.web.modules.json");

const TEST_ID = styles.promoCard;

module.exports = {
  TEST_ID,
  TITLE: `${styles.promoCardContent} > h5`,
  TC_TEXT: `${styles.tcTextContainer}`,
  BADGE: `${stylesOngoingBadge.promoBadge}`,
  FOOTER_TEXT_CONTAINER: `${styles.footerTextContainer}`,
  REMAINING_HEADER: `${styles.remainingTextContainer} ${styles.remainingText} .typography-h180`,
  REMAINING_SUBHEADER: `${styles.remainingTextContainer} ${styles.remainingText} .typography-h120`,
  TIMELEFT_SECTION: `${styles.remainingTextContainer} ${styles.remainingTextFooter} .typography-h180`,
  TIMELEFT_TEXT: `${styles.footerTextContainer} .typography-h180`,
  REQUIREMENTS: `${styles.requirementsText}`,
  ADDITIONAL_MESSAGE: `${styles.promotionCompletedContainer}`,
  PROGRESS_BAR: `${TEST_ID} ${stylesProgressBar.container}`,
  BUTTON: `${ACTION_LINK} `,
};
