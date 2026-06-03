const {
  SUPPORTING_CONTENT_BUTTON,
  SUPPORTING_CONTENT_BUTTON_TITLE,
  SUPPORTING_CONTENT_BUTTON_ICON,
  SUPPORTING_CONTENT_BUTTON_CHEVRON_EXPANDED,
  SUPPORTING_CONTENT_BUTTON_CHEVRON_COLLAPSED,
} = require("@ppb/the-wall-native/components/bricks/SupportingContentButton/SupportingContentButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SupportingContentButtonSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SUPPORTING_CONTENT_BUTTON}`));
  }

  get title() {
    return this.element.$(`~${SUPPORTING_CONTENT_BUTTON_TITLE}`);
  }

  get icon() {
    return this.element.$(`~${SUPPORTING_CONTENT_BUTTON_ICON}`);
  }

  get chevronCollapsed() {
    return this.element.$(`~${SUPPORTING_CONTENT_BUTTON_CHEVRON_COLLAPSED}`);
  }

  get chevronExpanded() {
    return this.element.$(`~${SUPPORTING_CONTENT_BUTTON_CHEVRON_EXPANDED}`);
  }
}

module.exports = SupportingContentButtonSO;
