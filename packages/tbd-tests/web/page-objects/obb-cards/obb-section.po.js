const {
  TEST_ID: SECTION,
  HEADER,
  CONTENT: SECTION_CONTENT,
} = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors.js");
const { TEST_ID: SHOW_MORE_BUTTON } = require("@ppb/the-wall-web/components/bricks/ShowMore/ShowMore.selectors.js");
const { TEST_ID: PEBBLES } = require("@ppb/the-wall-web/components/walls/PebbleList/PebbleList.selectors.js");
const { CONTAINER: CARDS_CONTAINER } = require("@ppb/tbd-shared/components/ObbCard/ObbCard.web.selectors.js");
const { TEST_ID: OBB_PVP_CARD_CONTAINER } = require("@ppb/tbd-shared/components/ObbPvPCard/ObbPvpCard.web.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ObbSectionPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, `${SECTION}:has(> [role="button"])`);
  }

  get header() {
    return this.element.$(HEADER);
  }

  get layouts() {
    return this.element.$$(`${PEBBLES} > button`);
  }

  get content() {
    return this.element.$(SECTION_CONTENT);
  }

  filterCards(cardType) {
    return this.content.$$(cardType);
  }

  get cards() {
    return this.filterCards(CARDS_CONTAINER);
  }

  get pvpCards() {
    return this.filterCards(OBB_PVP_CARD_CONTAINER);
  }

  get showMoreButton() {
    return this.element.$(SHOW_MORE_BUTTON);
  }
};
