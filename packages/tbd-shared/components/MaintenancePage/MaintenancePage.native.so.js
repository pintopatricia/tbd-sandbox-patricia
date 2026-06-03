const { BaseSO } = require("@ppb/wdio-lazy-element");
const { REFRESH_BUTTON, MAINTENANCE_PAGE } = require("./MaintenancePage.native.selectors");

class MaintenanceScreenSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MAINTENANCE_PAGE}`));
  }

  get refreshButton() {
    return this.element.$(`~${REFRESH_BUTTON}`);
  }
}

module.exports = MaintenanceScreenSO;
