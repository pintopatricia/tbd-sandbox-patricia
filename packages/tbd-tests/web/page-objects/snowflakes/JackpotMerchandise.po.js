const {
  TEST_ID,
  LOGO,
  JACKPOT_ITEM,
  BACKGROUND,
  BACKGROUND_HOT_DIAMOND,
} = require("@ppb/tbd-shared/components/GamingJackpotCard/snowflakes/JackpotMerchandise/JackpotMerchandise.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class JackpotElementPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the jackpot logo
   * @return {HTMLElement} Jackpot logo
   */
  get logo() {
    return this.element.$(LOGO);
  }

  /**
   * Gets the Jackpots
   * @return {HTMLElement} Jackpots
   */
  get jackpotItems() {
    return this.element.$$(JACKPOT_ITEM);
  }

  /**
   * Gets the Jackpot Background
   * @return {HTMLElement} Jackpot Background
   */
  get background() {
    return this.element.$(BACKGROUND);
  }

  /**
   * Gets the Jackpot Background (Hot Diamond)
   * @return {HTMLElement} Gets the Jackpot Background (Hot Diamond)
   */
  get backgroundHotDiamond() {
    return this.element.$(BACKGROUND_HOT_DIAMOND);
  }
};
