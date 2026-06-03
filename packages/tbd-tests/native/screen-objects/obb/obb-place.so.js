const {
  OBB_QUICK_BETSLIP,
  OBB_QUICK_BETSLIP_CONTAINER,
} = require("@ppb/tbd-shared/components/Betslip/ObbPlace/ObbPlace.native.selectors");

const {
  PRIMARY_BUTTON,
} = require("@ppb/the-wall-native/components/ActionButton/PrimaryButton/PrimaryButton.selectors");
const {
  PLACE_FOOTER,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookPlace/snowflakes/PlaceFooter/PlaceFooter.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ObbPlacePO extends BaseSO {
  constructor() {
    super($(`~${OBB_QUICK_BETSLIP}`));
  }

  get container() {
    return this.element.$(`~${OBB_QUICK_BETSLIP_CONTAINER}`);
  }

  get placeFooter() {
    return this.element.$(`~${PLACE_FOOTER}`);
  }

  get placeBetButton() {
    return this.placeFooter.$(`~${PRIMARY_BUTTON}`);
  }
}

module.exports = ObbPlacePO;
