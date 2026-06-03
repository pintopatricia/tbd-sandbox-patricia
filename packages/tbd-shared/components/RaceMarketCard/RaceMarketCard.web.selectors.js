const stylesRaceDetails = require("@ppb/the-wall-web/components/bricks/RaceDetails/RaceDetails.modules.json");
const { TEST_ID: TEST_ID_MARKET } = require("../Market/Market.web.selectors");
const styles = require("./RaceMarketCard.web.modules.json");
const stylesPlaceholder = require("./RaceMarketCardPlaceholder.web.modules.json");

const TEST_ID = styles.raceMarketCardContainer;

module.exports = {
  TEST_ID,
  RACE_MARKET_CARD_LINK: `${TEST_ID} > a`,
  RACE_DETAILS: stylesRaceDetails.raceDetails,
  MARKET: TEST_ID_MARKET,
  PLACEHOLDER: stylesPlaceholder.container,
};
