const PenaltyTakersCardSelectors = require("@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/PenaltyTakersCard.selectors");
const PlayerCarouselSelectors = require("@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/snowflakes/PlayerCarousel/PlayerCarousel.selectors");
const SlideSelectors = require("@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/snowflakes/Slide/Slide.selectors");
const ToScoreMarketsSelectors = require("@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/snowflakes/ToScoreMarkets/ToScoreMarkets.selectors");
const ToMissMarketsSelectors = require("@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/snowflakes/ToMissMarkets/ToMissMarkets.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PenaltyTakersCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PenaltyTakersCardSelectors.TEST_ID}`));
  }

  get title() {
    return this.element.$(`~${PenaltyTakersCardSelectors.TITLE}`);
  }

  get subtitle() {
    return this.element.$(`~${PenaltyTakersCardSelectors.SUBTITLE}`);
  }

  get footer() {
    return this.element.$(`~${PenaltyTakersCardSelectors.FOOTER}`);
  }

  get playerCarouselWrapper() {
    return this.element.$(`~${PlayerCarouselSelectors.SLIDES_WRAPPER}`);
  }

  get playerCarouselSlides() {
    return this.element.$$(`~${SlideSelectors.TEST_ID}`);
  }

  get toScoreMarkets() {
    return this.element.$(`~${ToScoreMarketsSelectors.TEST_ID}`);
  }

  get toScoreMarketTopLeft() {
    return this.element.$(`~${ToScoreMarketsSelectors.TOP_LEFT_SLOT}`);
  }

  get toScoreMarketTopCenter() {
    return this.element.$(`~${ToScoreMarketsSelectors.TOP_CENTER_SLOT}`);
  }

  get toScoreMarketTopRight() {
    return this.element.$(`~${ToScoreMarketsSelectors.TOP_RIGHT_SLOT}`);
  }

  get toScoreMarketBottomLeft() {
    return this.element.$(`~${ToScoreMarketsSelectors.BOTTOM_LEFT_SLOT}`);
  }

  get toScoreMarketBottomCenter() {
    return this.element.$(`~${ToScoreMarketsSelectors.BOTTOM_CENTER_SLOT}`);
  }

  get toScoreMarketBottomRight() {
    return this.element.$(`~${ToScoreMarketsSelectors.BOTTOM_RIGHT_SLOT}`);
  }

  get toMissMarkets() {
    return this.element.$(`~${ToMissMarketsSelectors.TEST_ID}`);
  }

  get toMissMarketLeftPostMiss() {
    return this.element.$(`~${ToMissMarketsSelectors.LEFT_POST_MISS_SLOT}`);
  }

  get toMissMarketSkyrocketCrossbar() {
    return this.element.$(`~${ToMissMarketsSelectors.SKYROCKET_CROSSBAR_SLOT}`);
  }

  get toMissMarketRightPostMiss() {
    return this.element.$(`~${ToMissMarketsSelectors.RIGHT_POST_MISS_SLOT}`);
  }

  get toMissMarketLeftSave() {
    return this.element.$(`~${ToMissMarketsSelectors.LEFT_SAVE_SLOT}`);
  }

  get toMissMarketCenterSave() {
    return this.element.$(`~${ToMissMarketsSelectors.CENTER_SAVE_SLOT}`);
  }

  get toMissMarketRightSave() {
    return this.element.$(`~${ToMissMarketsSelectors.RIGHT_SAVE_SLOT}`);
  }
}

module.exports = PenaltyTakersCardSO;
