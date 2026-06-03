const styles = require("./ViewZone.web.modules.json");

const TEST_ID = styles.viewZoneContainer;

module.exports = {
  TEST_ID,
  TITLE: `${TEST_ID} ${styles.title}`,
  CHILDREN: `${TEST_ID} :not(:nth-child(1))`,
};
