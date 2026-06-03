const {
  TEST_ID,
  BANNER_TEXT,
  TITLE_TEXT,
  FIRST_BUTTON,
  SECOND_BUTTON,
  CLOSE_ICON,
} = require("@ppb/the-wall-web/components/rooms/MessageBanner/MessageBanner.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BannersPo extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /*
  Returns the text in the banner
   */
  get bannerText() {
    return this.element.$(BANNER_TEXT);
  }

  /*
  Returns the title of the banner
   */
  get titleText() {
    return this.element.$(TITLE_TEXT);
  }

  /*
  Returns the first button of the banner
   */
  get firstButton() {
    return this.element.$(FIRST_BUTTON);
  }

  /*

  Returns the second button of the banner
   */
  get secondButton() {
    return this.element.$(SECOND_BUTTON);
  }

  /*
  Returns the close icon of the banner
   */
  get closeIcon() {
    return this.element.$(CLOSE_ICON);
  }
}
module.exports = BannersPo;
