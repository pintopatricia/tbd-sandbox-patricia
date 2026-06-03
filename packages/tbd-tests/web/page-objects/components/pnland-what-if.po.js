const {
  TEST_ID,
  PNL,
  WHAT_IF,
  SEPARATOR,
  PREVIOUS_PNL,
  PROFIT,
  LOSS,
  NEUTRAL,
} = require("@ppb/the-wall-web/components/bricks/PNLAndWhatIf/PNLAndWhatIf.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class PNLAndWhatIfPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get states() {
    return {
      loss: LOSS.replace(".", ""),
      profit: PROFIT.replace(".", ""),
      neutral: NEUTRAL.replace(".", ""),
    };
  }

  get pnl() {
    return this.element.$(PNL);
  }

  get whatIf() {
    return this.element.$(WHAT_IF);
  }

  get separator() {
    return this.element.$(SEPARATOR);
  }

  get previousPnl() {
    return this.element.$(PREVIOUS_PNL);
  }
};
