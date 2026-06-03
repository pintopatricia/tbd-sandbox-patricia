const {
  TEST_ID,
  MESSAGE,
  DETAIL,
  DETAIL_CLICKABLE_ACTION,
  ITEM,
  ICON_CONTAINER,
  ACTION,
  URL,
  DISMISS_LABEL_ACTION,
} = require("@ppb/the-wall-web/components/bricks/Alert/Alert.selectors");

const { TEST_ID: ACTION_LINK } = require("@ppb/the-wall-web/components/bricks/ActionLink/ActionLink.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

class AlertPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get message() {
    return this.element.$(MESSAGE);
  }

  get items() {
    return this.element.$$(ITEM);
  }

  get detail() {
    return this.element.$(DETAIL);
  }

  get detailAction() {
    return this.element.$(DETAIL_CLICKABLE_ACTION);
  }

  get icon() {
    return this.element.$(ICON_CONTAINER);
  }

  get action() {
    return this.element.$(ACTION);
  }

  get actionLink() {
    return this.element.$(ACTION_LINK);
  }

  get link() {
    return this.element.$(URL);
  }

  get dismissLabel() {
    return this.element.$(DISMISS_LABEL_ACTION);
  }
}

module.exports = AlertPO;
