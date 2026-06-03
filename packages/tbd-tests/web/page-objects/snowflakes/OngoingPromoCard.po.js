const {
  TEST_ID,
  BUTTON,
  TITLE,
  ADDITIONAL_MESSAGE,
  PROGRESS_BAR,
  BADGE,
  FOOTER_TEXT_CONTAINER,
  REMAINING_HEADER,
  REMAINING_SUBHEADER,
  REQUIREMENTS,
  TC_TEXT,
  TIMELEFT_SECTION,
  TIMELEFT_TEXT,
} = require("@ppb/tbd-shared/components/ImsPromotionStateCard/snowflakes/OngoingPromoCard/OngoingPromoCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class OngoingPromoCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get additionalMessage() {
    return this.element.$(ADDITIONAL_MESSAGE);
  }

  get badge() {
    return this.element.$(BADGE);
  }

  get footerTex() {
    return this.element.$(FOOTER_TEXT_CONTAINER);
  }

  get remainingHeader() {
    return this.element.$(REMAINING_HEADER);
  }

  get requirements() {
    return this.element.$(REQUIREMENTS);
  }

  get remainingSubheader() {
    return this.element.$(REMAINING_SUBHEADER);
  }

  get tcText() {
    return this.element.$(TC_TEXT);
  }

  get progressBar() {
    return this.element.$(PROGRESS_BAR);
  }

  get timeLeftSection() {
    return this.element.$(TIMELEFT_SECTION);
  }

  get timeLeftText() {
    return this.element.$(TIMELEFT_TEXT);
  }

  get buttons() {
    return this.element.$$(BUTTON);
  }
}

module.exports = OngoingPromoCardPO;
