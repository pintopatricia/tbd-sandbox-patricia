const { TEST_ID } = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.selectors");
const styles = require("./GamingRibbonCard.web.modules.json");

module.exports = {
  TEST_ID,
  ITEM: `${TEST_ID} ${styles.container}`,
};
