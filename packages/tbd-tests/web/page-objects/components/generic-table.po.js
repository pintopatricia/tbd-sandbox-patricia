const {
  TABLE,
  TABLE_HEADER,
  TABLE_ROW,
  TABLE_CELL,
  TABLE_BODY,
  TABLE_HEAD,
} = require("@ppb/the-wall-web/components/bricks/GenericTable/GenericTable.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class GenericTablePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TABLE));
  }

  get tableHeader() {
    return this.element.$(TABLE_HEADER);
  }

  get tableRow() {
    return this.element.$(TABLE_ROW);
  }

  get tableCell() {
    return this.element.$(TABLE_CELL);
  }

  get tableBody() {
    return this.element.$(TABLE_BODY);
  }

  get tableHead() {
    return this.element.$(TABLE_HEAD);
  }
}

module.exports = GenericTablePO;
