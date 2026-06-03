const { REFRESH_BUTTON } = require("@ppb/tbd-shared/components/MaintenancePage/MaintenancePage.native.selectors");
const {
  MAINTENANCE_SCREEN,
} = require("@ppb/tbd-shared/components/Navigation/screens/MaintenanceScreen.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MaintenanceScreenSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MAINTENANCE_SCREEN}`));
  }

  get refreshButton() {
    return this.element.$(`~${REFRESH_BUTTON}`);
  }
}

module.exports = MaintenanceScreenSO;
