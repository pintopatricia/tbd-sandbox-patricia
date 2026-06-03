const { TABLE, HEADER, BODY } = require("@ppb/the-wall-native/components/Table/Table.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class TableSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TABLE}`));
  }

  get tableHeader() {
    return this.element.$(`~${HEADER}`);
  }

  get tableBody() {
    return this.element.$(`~${BODY}`);
  }
}

module.exports = TableSO;
