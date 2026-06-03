const styles = require("@ppb/tbd-shared/components/GenericView/GenericView.web.modules.json");
const stylesQuickLinks = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.web.modules.json");
const { TEST_ID: TEST_ID_MARKET } = require("@ppb/tbd-shared/components/Market/Market.web.selectors");
const {
  TEST_ID: TEST_FOOTBALL_FIXTURE,
} = require("@ppb/tbd-shared/components/FootballFixture/FootballFixture.web.selectors");
const stylesCard = require("@ppb/the-wall-web/components/bricks/Card/Card.modules.json");
const stylesMarketBlurbs = require("@ppb/the-wall-web/components/bricks/MarketBlurbs/MarketBlurbs.modules.json");
const stylesButton = require("@ppb/tbd-shared/components/SportsbookRunner/SportsbookRunner.web.modules.json");

const TEST_ID = `${styles.genericViewContainer}`;

module.exports = {
  TEST_ID,
  QUICK_LINK: `${TEST_ID} ${stylesQuickLinks.container} a`,
  FOOTBALL_FIXTURE_CARD: TEST_FOOTBALL_FIXTURE,
  MARKET: TEST_ID_MARKET,
  TITLE: `${stylesCard.title}`,
  MARKET_RULES: `${TEST_ID} ${stylesMarketBlurbs.marketBlurbsButtonsButton}`,
  COLLAPSE_TITLE: `${TEST_ID} ${stylesCard.title}`,
  SELECTION_BUTTON: `${stylesButton.sportsbookButtonsContainer}`,
};
