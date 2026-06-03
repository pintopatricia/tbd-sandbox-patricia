const { TEST_ID: TEST_ID_MARKET } = require("../Market/Market.web.selectors");
const styles = require("./EventMarketCard.web.modules.json");
const stylesFootballFixture = require("../FootballFixture/FootballFixture.web.modules.json");

const TEST_ID = styles.eventMarketCard;

module.exports = {
  TEST_ID,
  ROUTER_LINK: `${TEST_ID} a`,
  FOOTBALL_FIXTURE_CARD: `${TEST_ID} a ${stylesFootballFixture.footballFixture}`,
  MARKET: TEST_ID_MARKET,
};
