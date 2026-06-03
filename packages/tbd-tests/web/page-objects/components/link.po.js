const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/Link/Link.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class LinkPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
};
