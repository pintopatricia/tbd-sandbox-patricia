const {
  TEST_ID: SELECTIONS_BOARD_TEST_ID,
} = require("@ppb/the-wall-web/components/rooms/SelectionsBoard/SelectionsBoard.selectors");
const styles = require("./MultiBetBuilderCard.web.modules.json");

const TEST_ID = styles.multiBetBuilderCard;

module.exports = {
  TEST_ID,
  SELECTIONS: `${SELECTIONS_BOARD_TEST_ID}`,
};
