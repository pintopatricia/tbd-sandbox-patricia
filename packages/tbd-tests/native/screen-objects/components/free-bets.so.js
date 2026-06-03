const { FREE_BETS } = require("@ppb/the-wall-native/components/FreeBets/FreeBets.selectors");
const {
  OPTION_TITLE: FREE_BETS_LABEL,
  OPTION_ICON: FREE_BETS_TAG,
} = require("@ppb/the-wall-native/components/Option/Option.selectors");

const {
  CHECKBOX_BUTTON,
  CHECKBOX_READONLY,
} = require("@ppb/the-wall-native/components/bricks/Checkbox/Checkbox.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FreeBetsSO extends BaseSO {
  /**
   * Creates a free bets page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${FREE_BETS}`));
  }

  get icon() {
    return this.element.$(`~${FREE_BETS_TAG}`);
  }

  get input() {
    return this.element.$(`~${CHECKBOX_BUTTON}`);
  }

  get checkboxReadonly() {
    return this.element.$(`~${CHECKBOX_READONLY}`);
  }

  get label() {
    return this.element.$(`~${FREE_BETS_LABEL}`);
  }

  async activateBonus(label) {
    await browser.waitUntilEquals(this.label, label, `Freebets label is not equal to '${label}'`);
    await this.element.click();
    await browser.waitUntilDisplayed(this.input, "Bonus not active");
  }
}

module.exports = FreeBetsSO;
