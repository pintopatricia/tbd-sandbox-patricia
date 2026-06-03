const { TEST_ID } = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.selectors");
const {
  STATUS_LABEL_LABEL,
} = require("@ppb/the-wall-web/components/bricks/Indicators/StatusLabel/StatusLabel.selectors");
const { TEST_ID: CARD_SELECTION } = require("../ObbOnboardingCard/ObbOnboardingCard.web.selectors");

module.exports = {
  TEST_ID,
  CARD: `${TEST_ID} ${CARD_SELECTION}`,
  BADGE: `${TEST_ID} ${STATUS_LABEL_LABEL}`,
};
