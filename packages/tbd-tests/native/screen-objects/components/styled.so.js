const { STYLED } = require("@ppb/the-wall-native/components/Styled/Styled.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class StyledSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${STYLED}`));
  }

  get title() {
    return this.element.$(`~${STYLED}`);
  }
}

module.exports = StyledSO;
