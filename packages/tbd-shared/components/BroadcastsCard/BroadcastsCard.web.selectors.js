const {
  TEST_ID: BROADCASTS_CARD_HEADER,
  TITLE,
  ICON,
} = require("@ppb/the-wall-web/components/bricks/SupportingContentButton/SupportingContentButton.selectors");
const styles = require("./BroadcastsCard.web.modules.json");

const TEST_ID = styles.container;
const BROADCAST_CONTAINER = TEST_ID;

module.exports = {
  TEST_ID,
  BROADCAST_CONTAINER,
  BROADCASTS_CARD_HEADER: `${BROADCAST_CONTAINER} ${BROADCASTS_CARD_HEADER}`,
  BROADCASTS_CARD_HEADER_ICON: `${BROADCAST_CONTAINER} ${ICON}`,
  BROADCASTS_CARD_HEADER_TITLE: `${BROADCAST_CONTAINER} ${TITLE}`,
  BROADCAST_LIVE_SCREAM_CONTAINER: `${styles.liveStreamContainer}`,
};
