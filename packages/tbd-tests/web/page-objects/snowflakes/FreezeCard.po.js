const {
  TEST_ID,
  TOP,
  BOTTOM,
  DIVIDER,
  CONTENT,
  DYNAMIC,
  ICON,
  LABEL,
  CONTENT_TEXT,
  STATUSLABEL,
} = require("@ppb/tbd-shared/components/Card/snowflakes/FreezeCard/FreezeCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class FreezeCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get top() {
    return this.element.$(TOP);
  }

  get bottom() {
    return this.element.$(BOTTOM);
  }

  get divider() {
    return this.element.$(DIVIDER);
  }

  get content() {
    return this.element.$(CONTENT);
  }

  get dynamic() {
    return this.element.$(DYNAMIC);
  }

  get icon() {
    return this.element.$(ICON);
  }

  get label() {
    return this.element.$(LABEL);
  }

  get contentText() {
    return this.element.$(CONTENT_TEXT);
  }

  get statusLabel() {
    return this.element.$(STATUSLABEL);
  }
}

module.exports = FreezeCardPO;
