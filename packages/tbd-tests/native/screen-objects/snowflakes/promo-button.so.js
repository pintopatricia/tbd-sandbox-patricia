const {
  PROMO_BUTTON,
  PROMO_BUTTON_ICON,
} = require("@ppb/the-wall-native/components/InputsAndControls/PromoButton/PromoButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PromoButtonSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PROMO_BUTTON}`));
  }

  get icon() {
    return this.element.$(`~${PROMO_BUTTON_ICON}`);
  }
}

module.exports = PromoButtonSO;
