const stylesBetButton = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.modules.json");
const styles = require("./BettingOpportunityBetButton.web.modules.json");

const TEST_ID = styles.betButtonContainer;
const SPORTSBOOK_BET_BUTTON = stylesBetButton.button;

module.exports = {
  TEST_ID,
  SPORTSBOOK_BET_BUTTON: `${SPORTSBOOK_BET_BUTTON}`,
};
