const {
  TEST_ID,
  CAROUSEL_SLIDER,
  CAROUSEL_ITEMS,
} = require("@ppb/tbd-shared/components/GameInfo/snowflakes/GameInfo/components/GameInfoCarousel/GameInfoCarousel.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class GameInfoCarouselPO extends BasePO {
  /**
   * Creates a Game Info Carousel object instance
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the carousel slider
   * @return {HTMLElement} The carousel slider
   */
  get carouselSlider() {
    return this.element.$(CAROUSEL_SLIDER);
  }

  /**
   * Gets the carousel items
   * @return {HTMLElement} The carousel items
   */
  get carouselItems() {
    return this.element.$$(CAROUSEL_ITEMS);
  }
};
