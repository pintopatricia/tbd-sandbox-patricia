const { TEST_ID: DIVIDER } = require("@ppb/the-wall-web/components/bricks/Divider/Divider.selectors");

const styles = require("./DetailedSummary.web.modules.json");

const TEST_ID = `${styles.detailed}`;

module.exports = {
  TEST_ID,
  GROUP_TITLE: `${styles.groupTitle}`,
  ITEM_TITLE: `${styles.itemTitle}`,
  ITEM_AMOUNT: `${styles.itemAmount}`,
  DIVIDER,
};
