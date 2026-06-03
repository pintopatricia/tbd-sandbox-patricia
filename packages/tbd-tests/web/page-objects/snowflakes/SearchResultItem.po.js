const {
  TEST_ID,
  NAME_LABEL,
  CONTEXT_LABEL,
  LOGO,
} = require("@ppb/the-wall-web/components/walls/SearchResultItem/SearchResultItem.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class SearchResultItemPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get name() {
    return this.element.$(NAME_LABEL);
  }

  get context() {
    return this.element.$(CONTEXT_LABEL);
  }

  get logo() {
    return this.element.$(LOGO);
  }
};
