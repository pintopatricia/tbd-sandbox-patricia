const { ACTION_LINK } = require("@ppb/the-wall-native/components/ActionLink/ActionLink.selectors");
const {
  SEARCH_BAR,
  SEARCH_BAR_CLEAN,
  SEARCH_BAR_ICON,
  SEARCH_BAR_INPUT,
} = require("@ppb/the-wall-native/components/SearchBar/SearchBar.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

const BACKSPACE_UNICODE = "\uE003";

class SearchBarSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SEARCH_BAR}`));
  }

  get searchContainer() {
    return this.element.$(`~${SEARCH_BAR}`);
  }

  get searchIcon() {
    return this.element.$(`~${SEARCH_BAR_ICON}`);
  }

  get searchInput() {
    return this.element.$(`~${SEARCH_BAR_INPUT}`);
  }

  get searchClean() {
    return this.element.$(`~${SEARCH_BAR_CLEAN}`);
  }

  get searchCancel() {
    return this.element.$(`~${ACTION_LINK}`);
  }

  /**
   * Sets the value to be used on the input element
   */
  async setValue(value) {
    const currentValue = await this.searchInput.getValue();

    if (currentValue) {
      await this.searchInput.addValue(Array(currentValue.length).fill(BACKSPACE_UNICODE));
    }
    await this.searchInput.addValue(value);
    await browser.waitUntil(async () => (await this.searchInput.getValue()) === value.toString(), {
      timeout: 5000,
      timeoutMsg: "Could not set value.",
    });
  }
}

module.exports = SearchBarSO;
