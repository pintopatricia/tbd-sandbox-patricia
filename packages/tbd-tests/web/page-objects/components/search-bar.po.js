const {
  TEST_ID,
  SEARCH_ICON,
  SEARCH_INPUT,
  SEARCH_CLEAN,
  SEARCH_CANCEL,
} = require("@ppb/the-wall-web/components/walls/SearchBar/SearchBar.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class SearchBarPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the search icon
   * Uses the `SEARCH_ICON` selector
   */
  get searchIcon() {
    return this.element.$(SEARCH_ICON);
  }

  /**
   * Returns the search input
   * Uses the `SEARCH_INPUT` selector
   */
  get input() {
    return this.element.$(SEARCH_INPUT);
  }

  /**
   * Returns the clean button
   * Uses the `SEARCH_CLEAN` selector
   */
  get cleanButton() {
    return this.element.$(SEARCH_CLEAN);
  }

  /**
   * Returns the cancel button
   * Uses the `SEARCH_CANCEL` selector
   */
  get cancelButton() {
    return this.element.$(SEARCH_CANCEL);
  }

  /**
   * Sets the value to be used on the input element
   */
  async setValue(value) {
    const currentValue = await this.input.getValue();

    if (currentValue) {
      await this.cleanButton.click();
      await browser.waitUntil(async () => (await this.input.getValue()).length === 0, {
        timeout: 10000,
        timeoutMsg: "Failed to Delete all Characters.",
      });
    }
    await this.input.setValue(value);
    await browser.waitUntil(async () => (await this.input.getValue()) === value.toString(), {
      timeout: 10000,
      timeoutMsg: "Could not set value.",
    });
  }
};
