const { TEST_ID: CARD_ID } = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors");
const styles = require("./SportsbookPlacePanel.web.modules.json");

module.exports = {
  TEST_ID: styles.sbkPlacePanel,
  COLLAPSABLE_SECTIONS: `${CARD_ID}`,
};
