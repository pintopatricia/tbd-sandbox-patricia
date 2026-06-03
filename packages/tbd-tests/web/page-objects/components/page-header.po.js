const {
  TEST_ID,
  ICON,
  TITLE,
  TITLE_CONTAINER,
  SUBTITLE,
} = require("@ppb/the-wall-web/components/bricks/PageHeader/PageHeader.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PageHeaderPO extends BasePO {
  /**
   * Creates a page header page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the icon
   * @return {HTMLElement} The icon
   */
  get icon() {
    return this.element.$(ICON);
  }

  /**
   * Gets the title
   * @return {HTMLElement} The title
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the title container (with title and icon)
   * @return {HTMLElement} The title container
   */
  get titleContainer() {
    return this.element.$(TITLE_CONTAINER);
  }

  /**
   * Gets the subtitle
   * @return {HTMLElement} The subtitle
   */
  get subtitle() {
    return this.element.$(SUBTITLE);
  }
}

module.exports = PageHeaderPO;
