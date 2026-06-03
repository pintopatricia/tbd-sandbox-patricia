const styles = require("./PreferenceCard.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  TITLE: `${TEST_ID} > ${styles.header} > ${styles.title}`,
  INFO_BTN: `${TEST_ID} > ${styles.header} > button`,
  OPTION: `${TEST_ID} > ${styles.option}`,
  HINT: `${TEST_ID} > ${styles.option} > ${styles.hint}`,
  EXTRA_CONTENT: `${TEST_ID} > ${styles.extraContent}`,
};
