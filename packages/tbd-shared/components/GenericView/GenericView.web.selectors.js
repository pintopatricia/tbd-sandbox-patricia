const styles = require("./GenericView.web.modules.json");

const TEST_ID = `${styles.genericViewContainer}`;
const GENERIC_VIEW_CARD = `${TEST_ID} ${styles.card}`;
const GENERIC_VIEW_HEADER = `${TEST_ID} ${styles.header}`;
const GENERIC_VIEW_THEME_DEFAULT_CONTAINER = `${TEST_ID} ${styles.default}`;
const GENERIC_VIEW_THEME_HIGHLIGHTED_CONTAINER = `${TEST_ID} ${styles.highlighted}`;

module.exports = {
  TEST_ID,
  GENERIC_VIEW_CARD,
  GENERIC_VIEW_HEADER,
  GROUP_CONTAINER: styles.emptyMargins,
  GENERIC_VIEW_THEME_DEFAULT_CONTAINER,
  GENERIC_VIEW_THEME_HIGHLIGHTED_CONTAINER,
};
