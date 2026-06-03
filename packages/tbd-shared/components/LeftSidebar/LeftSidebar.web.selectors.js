const styles = require("./LeftSidebar.web.modules.json");

const TEST_ID = styles.itemsList;

module.exports = {
  TEST_ID,
  SEARCH_BAR: `${TEST_ID} ${styles.searchBar}`,
  SEARCH_TITLE: `${TEST_ID} ${styles.searchTitle}`,
  QUICKLINK_CARD_GROUP: `${TEST_ID} ${styles.card}`,
};
