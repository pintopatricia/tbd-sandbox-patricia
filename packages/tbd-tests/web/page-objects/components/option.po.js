const {
  TEST_ID,
  ITEM_TITLE,
  ITEM_SUBTITLE,
  ICON,
} = require("@ppb/the-wall-web/components/walls/Option/Option.selectors");

const {
  TEST_ID: CHECKBOX_CONTAINER,
  CHECKBOX_INPUT,
  CHECKBOX_INPUT_SELECTED,
  CHECKBOX_ICON_READ_ONLY,
} = require("@ppb/the-wall-web/components/bricks/Checkbox/Checkbox.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class OptionPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(ITEM_TITLE);
  }

  get subtitle() {
    return this.element.$(ITEM_SUBTITLE);
  }

  get input() {
    return this.element.$(CHECKBOX_INPUT);
  }

  get icon() {
    return this.element.$(ICON);
  }

  get iconContainer() {
    return this.element.$(CHECKBOX_CONTAINER);
  }

  get selectedCheckMark() {
    return this.element.$(CHECKBOX_INPUT_SELECTED);
  }

  get selectedCheckMarkReadOnly() {
    return this.element.$(CHECKBOX_ICON_READ_ONLY);
  }
}

module.exports = OptionPO;
