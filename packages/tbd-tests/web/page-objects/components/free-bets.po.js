const { TEST_ID } = require("@ppb/the-wall-web/components/walls/FreeBets/FreeBets.selectors");
const {
  CHECKBOX_ICON_READ_ONLY,
  CHECKBOX_INPUT,
  CHECKBOX_INPUT_SELECTED,
  TEST_ID: CHECKBOX_CONTAINER,
} = require("@ppb/the-wall-web/components/bricks/Checkbox/Checkbox.selectors");
const {
  ITEM_TITLE: ITEM_LABEL,
  ICON: BONUS_ICON,
} = require("@ppb/the-wall-web/components/walls/Option/Option.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class FreeBetsPO extends BasePO {
  /**
   * Creates a free bets page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get input() {
    return this.element.$(CHECKBOX_INPUT);
  }

  get label() {
    return this.element.$(ITEM_LABEL);
  }

  get iconContainer() {
    return this.element.$(CHECKBOX_CONTAINER);
  }

  get checkboxSelected() {
    return this.element.$(CHECKBOX_INPUT_SELECTED);
  }

  get checkboxReadonly() {
    return this.element.$(CHECKBOX_ICON_READ_ONLY);
  }

  get bonusIcon() {
    return this.element.$(BONUS_ICON);
  }

  async activateBonus(label) {
    await browser.waitUntilEquals(this.label, label, `Freebets label is not equal to '${label}'`);
    await this.element.waitForClickable();
    await this.element.click();
    await browser.waitUntilDisplayed(this.iconContainer, "Bonus not active");
  }
}

module.exports = FreeBetsPO;
