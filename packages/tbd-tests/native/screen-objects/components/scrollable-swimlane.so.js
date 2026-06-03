const {
  SCROLLABLE_SWIMLANE,
  SCROLLABLE_SWIMLANE_TITLE,
  SCROLLABLE_SWIMLANE_FLATLIST,
} = require("@ppb/the-wall-native/components/ScrollableSwimlane/ScrollableSwimlane.selectors");
const { ACTION_LINK, ACTION_LINK_TEXT } = require("@ppb/the-wall-native/components/ActionLink/ActionLink.selectors");
const {
  HIGHLIGHTED_SELECTION_CARD,
} = require("@ppb/tbd-shared/components/HighlightedSelectionCard/snowflakes/HighlightedSelectionCard/HighlightedSelectionCard.native.selectors");
const {
  HIGHLIGHTED_LINK_CARD,
} = require("@ppb/the-wall-native/components/HighlightedLinkCard/HighlightedLinkCard.selectors");
const { ICON_BUTTON } = require("@ppb/the-wall-native/components/IconButton/IconButton.selectors");
const { CARD } = require("@ppb/the-wall-native/components/Card/Card.selectors");
const { PROMO_CARD } = require("@ppb/the-wall-native/components/PromoCard/PromoCard.selectors");
const { TEST_ID: PROMO_BANNER } = require("@ppb/the-wall-native/components/PromoBanner/PromoBanner.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ScrollableSwimlaneSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SCROLLABLE_SWIMLANE}`));
  }

  get title() {
    return this.element.$(`~${SCROLLABLE_SWIMLANE_TITLE}`);
  }

  get flatlist() {
    return this.element.$(`~${SCROLLABLE_SWIMLANE_FLATLIST}`);
  }

  get viewAllButton() {
    return this.element.$(`~${ACTION_LINK}`);
  }

  get viewAllButtonText() {
    return this.element.$(`~${ACTION_LINK_TEXT}`);
  }

  get highlightedSelectionCards() {
    return this.element.$$(`~${HIGHLIGHTED_SELECTION_CARD}`);
  }

  get highlightedLinkCards() {
    return this.element.$$(`~${HIGHLIGHTED_LINK_CARD}`);
  }

  get iconButtons() {
    return this.element.$$(`~${ICON_BUTTON}`);
  }

  get cards() {
    return this.element.$$(`~${CARD}`);
  }

  get promos() {
    return this.element.$$(`~${PROMO_CARD}`);
  }

  get promoBanners() {
    return this.element.$$(`~${PROMO_BANNER}`);
  }
}

module.exports = ScrollableSwimlaneSO;
