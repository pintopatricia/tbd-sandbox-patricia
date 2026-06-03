const {
  TEST_ID,
  ICON_CONTAINER,
  TEXT,
  ACTIVE_CONTENT,
  NOTIFICATION_COUNT,
} = require("@ppb/the-wall-web/components/bricks/IconButton/IconButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class IconButton extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get iconContainer() {
    return this.element.$(ICON_CONTAINER);
  }

  get text() {
    return this.element.$(TEXT);
  }

  get activeContent() {
    return this.element.$(ACTIVE_CONTENT);
  }

  get notificationCount() {
    return this.element.$(NOTIFICATION_COUNT);
  }
}

module.exports = IconButton;
