const { TEST_ID: BET_SUMMARY } = require("@ppb/the-wall-web/components/rooms/BetSummary/BetSummary.selectors");
const {
  TEST_ID: SPORTSBOOK_BET_BUTTON,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");
const styles = require("./SportsbookReceiptPanel.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  SINGLE: styles.single,
  MULTIPLE: `${styles.multiples} ${BET_SUMMARY}`,
  SCROLLABLE: styles.scrollable,
  MULTI_BET_BUILDER: styles.receiptContentContainer,
  MULTIPLES_TITLE: `${styles.receiptContentContainer}:has(${styles.multiples}) header`,
  SINGLES_TITLE: `${styles.receiptContentContainer}:has(${styles.single}) header`,
  CASTS_TITLE: `${styles.receiptContentContainer}:has(${styles.castBetContainer}) header`,
  BET_BUILDER: styles.betBuilder,
  BET_BUILDER_TITLE: `${styles.receiptContentContainer}:has(${styles.betBuilder}) header`,
  MULTI_BET_BUILDER_TITLE: `${styles.receiptContentContainer} header`,
  RECEIPT_SUMMARY: `${styles.summaryContainer}`,
  RE_USE_SELECTIONS_CONTAINER: `${styles.summary} ${SPORTSBOOK_BET_BUTTON}`,
  TOTAL_STAKE: `${styles.multiplesSummary}`,
};
