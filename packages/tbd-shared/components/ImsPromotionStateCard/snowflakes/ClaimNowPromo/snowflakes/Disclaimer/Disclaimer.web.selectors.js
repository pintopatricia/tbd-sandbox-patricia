const styles = require("./Disclaimer.web.modules.json");

const TEST_ID = styles.disclaimer;

module.exports = {
  TEST_ID,
  TITLE: `${TEST_ID} > :nth-child(1)`,
  LIST_TITLE: `${TEST_ID} > :nth-child(2)`,
  ITEM_ONE: `${TEST_ID} > :nth-child(3) :nth-child(1)`,
  ITEM_TWO: `${TEST_ID} > :nth-child(3) :nth-child(2)`,
  FOOTER: `${TEST_ID} > :last-child`,
};
