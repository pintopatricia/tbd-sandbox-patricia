const {
  RICH_TEXT,
  RICH_TEXT_PARAGRAPH,
  RICH_TEXT_LIST_ITEM,
  RICH_TEXT_LIST_ITEM_CONTAINER,
} = require("@ppb/the-wall-native/components/RichText/RichText.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class RichTextPO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RICH_TEXT}`));
  }

  /**
   * Gets list of paragraphs
   */
  get getParagraphsList() {
    return this.element.$(`~${RICH_TEXT_PARAGRAPH}`);
  }

  /**
   * Gets list of containers list item
   */
  get getContainersList() {
    return this.element.$(`~${RICH_TEXT_LIST_ITEM_CONTAINER}`);
  }

  /**
   * Gets list of list items
   */
  get getItemsList() {
    return this.element.$(`~${RICH_TEXT_LIST_ITEM}`);
  }
};
