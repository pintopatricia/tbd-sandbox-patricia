const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/Styled/Styled.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class StyledPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = StyledPO;
