const styles = require("./Minimized.web.modules.json");

const TEST_ID = styles.titleContainer;

module.exports = {
  TEST_ID,
  TITLE: `${TEST_ID} > ${styles.title}`,
};
