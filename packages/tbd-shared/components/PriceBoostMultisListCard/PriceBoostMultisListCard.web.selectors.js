const { TEST_ID: OPPORTUNITY_TEST_ID } = require("@ppb/the-wall-web/components/walls/Runner/Runner.selectors");
const styles = require("./PriceBoostMultisListCard.web.modules.json");

const TEST_ID = styles.packagedCreatedBetsContainer;

module.exports = {
  TEST_ID,
  OPPORTUNITY: `${TEST_ID} ${OPPORTUNITY_TEST_ID}`,
};
