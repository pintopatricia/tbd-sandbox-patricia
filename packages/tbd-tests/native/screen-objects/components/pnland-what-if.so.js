const {
  PNL_AND_WHAT_IF_WHAT_IF,
  PNL_AND_WHAT_IF_SEPARATOR,
  PNL_AND_WHAT_IF_PNL,
  PNL_AND_WHAT_IF_PREVIOUS_PNL,
  PNL_AND_WHAT_IF,
} = require("@ppb/the-wall-native/components/PNLAndWhatIf/PNLAndWhatIf.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PNLAndWhatIfSO extends BaseSO {
  constructor(lazyElement) {
    if (!lazyElement) {
      throw Error("PNL and What If selector is mandatory");
    }

    super(lazyElement);
  }

  get pnlAndWhatIf() {
    return this.element.$(`~${PNL_AND_WHAT_IF}`);
  }

  get pnl() {
    return this.element.$(`~${PNL_AND_WHAT_IF_PNL}`);
  }

  get whatIf() {
    return this.element.$(`~${PNL_AND_WHAT_IF_WHAT_IF}`);
  }

  get separator() {
    return this.element.$(`~${PNL_AND_WHAT_IF_SEPARATOR}`);
  }

  get previousPnl() {
    return this.element.$(`~${PNL_AND_WHAT_IF_PREVIOUS_PNL}`);
  }
}

module.exports = PNLAndWhatIfSO;
