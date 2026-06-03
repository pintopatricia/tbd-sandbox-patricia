const styles = require("./MultiLinesMultiples.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  MULTIPLE: `${TEST_ID} ${styles.multiple}`,
};
