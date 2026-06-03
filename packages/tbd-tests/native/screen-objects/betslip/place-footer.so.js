const {
  PLACE_FOOTER,
  PLACE_FOOTER_REMOVE_ALL_BUTTON,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookPlace/snowflakes/PlaceFooter/PlaceFooter.native.selectors");
const { ALERT } = require("@ppb/the-wall-native/components/Alert/Alert.selectors");
const {
  PRIMARY_BUTTON,
} = require("@ppb/the-wall-native/components/ActionButton/PrimaryButton/PrimaryButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PlaceFooterSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PLACE_FOOTER}`));
  }

  get freeBetsWalletsAlert() {
    return this.element.$(`~${ALERT}`);
  }

  get removeAllButton() {
    return this.element.$(`~${PLACE_FOOTER_REMOVE_ALL_BUTTON}`);
  }

  get primaryButton() {
    return this.element.$(`~${PRIMARY_BUTTON}`);
  }
}

module.exports = PlaceFooterSO;
