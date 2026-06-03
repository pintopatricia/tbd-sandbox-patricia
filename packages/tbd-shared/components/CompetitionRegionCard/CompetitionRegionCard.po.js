const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID: CARD } = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors");
const { TEST_ID, COMPETITION_REGION_CARD_HEADER_CONTAINER } = require("./CompetitionRegionCard.web.selectors");

module.exports = class CompetitionRegionCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the competition region card header container
   * @return {HTMLElement} The competition region card header container
   */
  get competitionRegionCardHeaderContainer() {
    return this.element.$(COMPETITION_REGION_CARD_HEADER_CONTAINER);
  }

  /**
   * Gets all the collapsible Card elements inside the competition region card
   * @return {HTMLElement} All the collapsible Card inside the competition region card
   */
  get collapsibleCards() {
    return this.element.$$(CARD);
  }
};
