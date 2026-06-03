const {
  SELECTIONS_BOARD_SECTION_CONTAINER,
  SELECTIONS_BOARD_SECTION_LABEL,
} = require("@ppb/the-wall-native/components/Betslip/SelectionsBoard/SelectionsBoardSection.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SelectionsBoardSectionSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SELECTIONS_BOARD_SECTION_CONTAINER}`));
  }

  get label() {
    return this.element.$(`~${SELECTIONS_BOARD_SECTION_LABEL}`);
  }
}

module.exports = SelectionsBoardSectionSO;
