const styles = require("./ForbiddenContent.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  ICON: `${styles.lock}`,
  LABEL: `${TEST_ID} ${styles.label}`,
};
