const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/ActionLink/ActionLink.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ActionLinkPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = ActionLinkPO;
