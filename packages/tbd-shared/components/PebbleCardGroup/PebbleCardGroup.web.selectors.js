const styles = require("./PebbleCardGroup.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  HEADER_CONTAINER: `${TEST_ID} ${styles.header}`,
  OUTER_TITLE: `${TEST_ID} ${styles.outerTitle}`,
  SHELL: `${styles.shell}`,
};
