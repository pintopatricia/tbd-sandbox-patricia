const { ACTION_BUTTON } = require("@ppb/the-wall-native/components/ActionButton/ActionButton.selectors");
const {
  SBK_PLACE_PANEL,
  SBK_PLACE_PANEL_COLLAPSABLE_SECTION,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.native.selectors");

const { OBB_SINGLE } = require("@ppb/tbd-shared/components/Betslip/ObbSingle/ObbSingle.native.selectors");

const {
  PLACE_FOOTER_REMOVE_ALL_BUTTON,
  PLACE_FOOTER_BUTTON,
  PLACE_FOOTER_SECONDARY_BUTTON,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookPlace/snowflakes/PlaceFooter/PlaceFooter.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SportsbookPlacePanelSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SBK_PLACE_PANEL}`));
  }

  get collapsableSections() {
    return this.element.$$(`~${SBK_PLACE_PANEL_COLLAPSABLE_SECTION}`);
  }

  get removeAll() {
    return this.element.$(`~${PLACE_FOOTER_REMOVE_ALL_BUTTON}`);
  }

  get place() {
    return this.element.$(`~${PLACE_FOOTER_BUTTON}`);
  }

  get secondaryButton() {
    return this.element.$(`~${PLACE_FOOTER_SECONDARY_BUTTON}`);
  }

  get actions() {
    return this.element.$$(`~${ACTION_BUTTON}`);
  }

  get obbSingles() {
    return this.element.$$(`~${OBB_SINGLE}`);
  }
}

module.exports = SportsbookPlacePanelSO;
