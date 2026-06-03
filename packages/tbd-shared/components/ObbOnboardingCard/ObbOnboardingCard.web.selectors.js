const {
  TEST_ID: CARD_BET_BUTTON,
  LABEL: CARD_BET_BUTTON_LABEL,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");

const styles = require("./ObbOnboardingCard.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  BET_BUTTON: CARD_BET_BUTTON,
  BET_BUTTON_LABEL: `${CARD_BET_BUTTON} ${CARD_BET_BUTTON_LABEL}`,
};
