const { SHOW_MORE, SHOW_MORE_TEXT } = require("@ppb/the-wall-native/components/bricks/ShowMore/ShowMore.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ShowMoreSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SHOW_MORE}`));
  }

  get text() {
    return this.element.$(`~${SHOW_MORE_TEXT}`);
  }
}

module.exports = ShowMoreSO;
