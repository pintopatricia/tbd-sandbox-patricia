const { TEST_ID: BALANCE_TOGGLE } = require("@ppb/the-wall-web/components/bricks/ShowMore/ShowMore.selectors");
const {
  TEST_ID: CASH_BALANCE_DETAILED_VIEW,
} = require("../../../MarketGraph/MarketGraphContent/snowflakes/DetailedSummary/DetailedSummary.web.selectors");

const styles = require("./CashBalances.web.modules.json");
const { TEST_ID: CASH_BALANCE_SIMPLE_VIEW } = require("../CashBalancesSimpleView/CashBalancesSimpleView.web.selectors");

const TEST_ID = styles.cashBalances;

module.exports = {
  TEST_ID,
  BALANCE_TITLE: `${styles.title} span`,
  BALANCE_TOGGLE,
  ICON_CONTAINER: `${styles.eyeIcon}`,
  BALANCES_CONTAINER: `${styles.content}`,
  CASH_BALANCE_SIMPLE_VIEW,
  CASH_BALANCE_DETAILED_VIEW,
};
