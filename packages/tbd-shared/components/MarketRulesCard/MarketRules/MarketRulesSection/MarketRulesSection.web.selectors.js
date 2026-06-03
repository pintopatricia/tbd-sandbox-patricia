const styles = require("./MarketRulesSection.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  TITLE: `${TEST_ID} > ${styles.title}`,
  CONTENT: `${TEST_ID} > div:last-child`,
  PARAGRAPH: `${TEST_ID} > p`,
  SECTION_LINK: `${TEST_ID} > a`,
};
