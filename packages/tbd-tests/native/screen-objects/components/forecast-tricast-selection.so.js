const {
  FORECAST_TRICAST,
  SUPPORT_LABEL,
  SILK,
  LABEL,
} = require("@ppb/the-wall-native/components/ForecastTricastSelection/ForecastTricastSelection.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ForecastTricastSelectionSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${FORECAST_TRICAST}`));
  }

  get positionNumber() {
    return this.element.$(`~${SUPPORT_LABEL}`);
  }

  get horse() {
    return this.element.$(`~${LABEL}`);
  }

  get silk() {
    return this.element.$(`~${SILK}`);
  }
}

module.exports = ForecastTricastSelectionSO;
