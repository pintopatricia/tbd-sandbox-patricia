const {
  TEST_ID,
  PARAGRAPH,
  LIST_ITEM,
  LIST_ITEM_CONTAINER,
} = require("@ppb/the-wall-web/components/walls/RichText/RichText.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RichTextPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets list of paragraphs
   * @return {HTMLElement} list of paragraphs
   */
  get getParagrphsList() {
    return this.element.$$(PARAGRAPH);
  }

  /**
   * Gets list of containers list item
   * @return {HTMLElement} list of containers list item
   */
  get getContainersList() {
    return this.element.$$(LIST_ITEM_CONTAINER);
  }

  /**
   * Gets list of list items
   * @return {HTMLElement} list of list item
   */
  get getItemsList() {
    return this.element.$$(LIST_ITEM);
  }
};
