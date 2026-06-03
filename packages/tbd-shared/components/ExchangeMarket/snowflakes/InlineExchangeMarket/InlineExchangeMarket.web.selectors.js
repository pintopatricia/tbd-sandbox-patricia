const {
  TEST_ID: SCROLLABLE_SWIMLANE,
} = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.selectors");
const {
  TEST_ID: BET_BUTTON,
} = require("../../../ExchangeBetButtons/snowflakes/ExchangeBetButton/ExchangeBetButton.web.selectors");
const styles = require("./InlineExchangeMarket.web.modules.json");

const TEST_ID = styles.inlineExchangeMarket;
const BACK_SELECTIONS = `${styles.snapGroup}:first-child`;
const LAY_SELECTIONS = `${styles.snapGroup}:last-child`;

const SWIMLANE = `${TEST_ID} > ${SCROLLABLE_SWIMLANE}`;

module.exports = {
  TEST_ID,
  SWIMLANE,
  GROUPS: `${TEST_ID} ${styles.snapGroup}`,
  BACK_SELECTIONS: `${BACK_SELECTIONS}`,
  LAY_SELECTIONS: `${LAY_SELECTIONS}`,
  BACK_SELECTIONS_BET_BUTTON: `${BACK_SELECTIONS} ${BET_BUTTON}`,
  LAY_SELECTIONS_BET_BUTTON: `${LAY_SELECTIONS} ${BET_BUTTON}`,
  BET_BUTTONS: `${BET_BUTTON}`,
};
