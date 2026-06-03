const { BaseSO } = require("@ppb/wdio-lazy-element");
const {
  BET_INFO_COLLAPSE,
  BET_INFO_COLLAPSE_HEADER,
  BET_INFO_COLLAPSE_HEADER_TITLE,
  BET_INFO_COLLAPSE_HEADER_ICON,
} = require("./BetInfoCollapse.native.selectors");

module.exports = class BetInfoCollapseSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_INFO_COLLAPSE}`));
  }

  get header() {
    return this.element.$(`~${BET_INFO_COLLAPSE_HEADER}`);
  }

  get headerTitle() {
    return this.header.$(`~${BET_INFO_COLLAPSE_HEADER_TITLE}`);
  }

  get headerIcon() {
    return this.header.$(`~${BET_INFO_COLLAPSE_HEADER_ICON}`);
  }
};
