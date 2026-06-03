const {
  SELECTIONS_BOARD,
  SELECTIONS_BOARD_TITLE,
} = require("@ppb/the-wall-native/components/Betslip/SelectionsBoard/SelectionsBoard.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SelectionsBoardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SELECTIONS_BOARD}`));
  }

  get title() {
    return this.element.$(`~${SELECTIONS_BOARD_TITLE}`);
  }
}

module.exports = SelectionsBoardSO;
