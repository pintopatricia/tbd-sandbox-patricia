const {
  RACE_VIEW_LINK_CARD,
  RACE_VIEW_LINK_CARD_TITLE,
  RACE_VIEW_LINK_CARD_IMAGE,
} = require("./snowflakes/RaceViewLinkCard/RaceViewLinkCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

/**
 * Class that represents the Race View Link Card SO
 *
 */
class RaceViewLinkCardSO extends BaseSO {
  /**
   * Constructor for the  Race View Link Card SO
   * By default it sends the root element as lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${RACE_VIEW_LINK_CARD}`));
  }

  get countryFlag() {
    return this.element.$(`~${RACE_VIEW_LINK_CARD_IMAGE}`);
  }

  get venue() {
    return this.element.$(`~${RACE_VIEW_LINK_CARD_TITLE}`);
  }
}

module.exports = RaceViewLinkCardSO;
