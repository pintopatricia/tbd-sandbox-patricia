const {
  HIGHLIGHTED_SELECTION_CARD,
} = require("@ppb/tbd-shared/components/HighlightedSelectionCard/snowflakes/HighlightedSelectionCard/HighlightedSelectionCard.native.selectors");

const {
  EXPANDABLE_CARDGROUP,
  EXPANDABLE_CARDGROUP_HEADER_CONTAINER,
  EXPANDABLE_CARDGROUP_ITEM,
} = require("@ppb/tbd-shared/components/ExpandableCardGroup/ExpandableCardGroup.native.selectors");
const { CARD_TITLE } = require("@ppb/the-wall-native/components/Card/Card.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ExpandableCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${EXPANDABLE_CARDGROUP}`));
  }

  get headerContainer() {
    return this.element.$(`~${EXPANDABLE_CARDGROUP_HEADER_CONTAINER}`);
  }

  get headerTitle() {
    return this.element.$(`~${CARD_TITLE}`);
  }

  get items() {
    return this.element.$$(`~${EXPANDABLE_CARDGROUP_ITEM}`);
  }

  get highlightedSelectionCards() {
    return this.element.$$(`~${HIGHLIGHTED_SELECTION_CARD}`);
  }
}

module.exports = ExpandableCardGroupSO;
