const PenaltyTakersCardSelectors = require("@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/PenaltyTakersCard.selectors");
const PlayerCarouselSelectors = require("@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/snowflakes/PlayerCarousel/PlayerCarousel.selectors");
const SlideSelectors = require("@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/snowflakes/Slide/Slide.selectors");
const ToScoreMarketsSelectors = require("@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/snowflakes/ToScoreMarkets/ToScoreMarkets.selectors");
const ToMissMarketsSelectors = require("@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/snowflakes/ToMissMarkets/ToMissMarkets.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PenaltyTakersCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`[data-testid="${PenaltyTakersCardSelectors.TEST_ID}"]`));
  }

  get title() {
    return this.element.$(`[data-testid="${PenaltyTakersCardSelectors.TITLE}"]`);
  }

  get subtitle() {
    return this.element.$(`[data-testid="${PenaltyTakersCardSelectors.SUBTITLE}"]`);
  }

  get footer() {
    return this.element.$(`[data-testid="${PenaltyTakersCardSelectors.FOOTER}"]`);
  }

  get playerCarouselWrapper() {
    return this.element.$(`[data-testid="${PlayerCarouselSelectors.SLIDES_WRAPPER}"]`);
  }

  get playerCarouselSlides() {
    return this.playerCarouselWrapper.$$(`[data-testid="${SlideSelectors.SLIDE}"]`);
  }

  get toScoreMarkets() {
    return this.element.$(`[data-testid="${ToScoreMarketsSelectors.TEST_ID}"]`);
  }

  get toScoreMarketTopLeft() {
    return this.toScoreMarkets.$(`[data-testid="${ToScoreMarketsSelectors.TOP_LEFT_SLOT}"]`);
  }

  get toScoreMarketTopCenter() {
    return this.toScoreMarkets.$(`[data-testid="${ToScoreMarketsSelectors.TOP_CENTER_SLOT}"]`);
  }

  get toScoreMarketTopRight() {
    return this.toScoreMarkets.$(`[data-testid="${ToScoreMarketsSelectors.TOP_RIGHT_SLOT}"]`);
  }

  get toScoreMarketBottomLeft() {
    return this.toScoreMarkets.$(`[data-testid="${ToScoreMarketsSelectors.BOTTOM_LEFT_SLOT}"]`);
  }

  get toScoreMarketBottomCenter() {
    return this.toScoreMarkets.$(`[data-testid="${ToScoreMarketsSelectors.BOTTOM_CENTER_SLOT}"]`);
  }

  get toScoreMarketBottomRight() {
    return this.toScoreMarkets.$(`[data-testid="${ToScoreMarketsSelectors.BOTTOM_RIGHT_SLOT}"]`);
  }

  get toMissMarkets() {
    return this.element.$(`[data-testid="${ToMissMarketsSelectors.TEST_ID}"]`);
  }

  get toMissMarketLeftPostMiss() {
    return this.toMissMarkets.$(`[data-testid="${ToMissMarketsSelectors.LEFT_POST_MISS_SLOT}"]`);
  }

  get toMissMarketSkyrocketCrossbar() {
    return this.toMissMarkets.$(`[data-testid="${ToMissMarketsSelectors.SKYROCKET_CROSSBAR_SLOT}"]`);
  }

  get toMissMarketRightPostMiss() {
    return this.toMissMarkets.$(`[data-testid="${ToMissMarketsSelectors.RIGHT_POST_MISS_SLOT}"]`);
  }

  get toMissMarketLeftSave() {
    return this.toMissMarkets.$(`[data-testid="${ToMissMarketsSelectors.LEFT_SAVE_SLOT}"]`);
  }

  get toMissMarketCenterSave() {
    return this.toMissMarkets.$(`[data-testid="${ToMissMarketsSelectors.CENTER_SAVE_SLOT}"]`);
  }

  get toMissMarketRightSave() {
    return this.toMissMarkets.$(`[data-testid="${ToMissMarketsSelectors.RIGHT_SAVE_SLOT}"]`);
  }

  get playerCarouselArrowLeft() {
    return this.element.$(`[data-testid="${PlayerCarouselSelectors.ARROW_LEFT}"]`);
  }

  get playerCarouselArrowRight() {
    return this.element.$(`[data-testid="${PlayerCarouselSelectors.ARROW_RIGHT}"]`);
  }

  async clickArrowLeft() {
    await this.playerCarouselArrowLeft.click();
  }

  async clickArrowRight() {
    await this.playerCarouselArrowRight.click();
  }

  async swipeRight() {
    await this._swipe("right");
  }

  async swipeLeft() {
    await this._swipe("left");
  }

  async _swipe(direction) {
    const wrapper = await this.playerCarouselWrapper;
    const { x, y } = await wrapper.getLocation();
    const { width, height } = await wrapper.getSize();

    const midY = Math.floor(y + height / 2);
    const startX = direction === "left" ? Math.floor(x + width * 0.75) : Math.floor(x + width * 0.25);
    const endX = direction === "left" ? Math.floor(x + width * 0.25) : Math.floor(x + width * 0.75);

    if (!browser.isW3C) {
      await browser.touchDown(startX, midY);
      await browser.touchMove(endX, midY);
      await browser.touchUp(endX, midY);
    } else {
      await browser.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "mouse" },
          actions: [
            { type: "pointerMove", x: startX, y: midY },
            { type: "pointerDown", button: 0 },
            { type: "pause", duration: 10 },
            { type: "pointerMove", x: endX, y: midY },
            { type: "pointerUp", button: 0 },
            { type: "pause", duration: 10 },
          ],
        },
      ]);
      await browser.releaseActions();
    }
  }
}

module.exports = PenaltyTakersCardPO;
