const styles = require("./BubbleItem.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  DOT: `${TEST_ID} ${styles.dot}`,
  LINE: `${TEST_ID} ${styles.line}`,
  ENTRY_TEXT: `${TEST_ID} ${styles.entryText}`,
  TITLE_BOLD: `${TEST_ID} ${styles.entryText} > span:first-child`,
  TITLE_REGULAR: `${TEST_ID} ${styles.entryText} > span:nth-child(2)`,
  DESCRIPTION: `${TEST_ID} ${styles.description}`,
  SUB_DESCRIPTION: `${TEST_ID} ${styles.subDescription}`,
  ICON_CONTAINER: `${TEST_ID} ${styles.iconContainer}`,
  ICON: `${TEST_ID} ${styles.iconContainer} > img`,
  TITLE_TEXT: styles.titleText,
  REGULAR_TEXT: styles.regularText,
};
