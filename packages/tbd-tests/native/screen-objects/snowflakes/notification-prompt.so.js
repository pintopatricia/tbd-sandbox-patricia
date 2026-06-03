const {
  NOTIFICATION_PROMPT,
  TITLE,
  CLOSE_BUTTON,
  BELL_ICON_CONTAINER,
  DESCRIPTION,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
} = require("@ppb/the-wall-native/components/NotificationPrompt/NotificationPrompt.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class NotificationPromptSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${NOTIFICATION_PROMPT}`));
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }

  get closeButton() {
    return this.element.$(`~${CLOSE_BUTTON}`);
  }

  get bellIconContainer() {
    return this.element.$(`~${BELL_ICON_CONTAINER}`);
  }

  get description() {
    return this.element.$(`~${DESCRIPTION}`);
  }

  get primaryButton() {
    return this.element.$(`~${PRIMARY_BUTTON}`);
  }

  get secondaryButton() {
    return this.element.$(`~${SECONDARY_BUTTON}`);
  }
}

module.exports = NotificationPromptSO;
