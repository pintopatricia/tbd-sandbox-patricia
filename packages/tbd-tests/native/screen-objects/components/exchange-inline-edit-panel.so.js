const {
  EXCHANGE_INLINE_EDIT_PANEL,
  EXCHANGE_INLINE_EDIT_PANEL_MENU_TITLE,
  INPUT,
  PLACE_BUTTON,
  NOTIFICATIONS,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlineEdit/snowflakes/ExchangeInlineEditPanel/ExchangeInlineEditPanel.native.selectors");
const {
  SECONDARY_BUTTON: CANCEL_ID,
} = require("@ppb/the-wall-native/components/ActionButton/SecondaryButton/SecondaryButton.selectors");
const { ACTION: DONE_ID } = require("@ppb/tbd-shared/components/Betslip/InlinePanel/InlinePanel.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ExchangeInlineEditPanelSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${EXCHANGE_INLINE_EDIT_PANEL}`));
  }

  get menuTitle() {
    return this.element.$(`~${EXCHANGE_INLINE_EDIT_PANEL_MENU_TITLE}`);
  }

  get done() {
    return this.element.$(`~${DONE_ID}`);
  }

  get inputs() {
    return this.element.$$(`~${INPUT}`);
  }

  get cancel() {
    return this.element.$(`~${CANCEL_ID}`);
  }

  get placeButton() {
    return this.element.$(`~${PLACE_BUTTON}`);
  }

  get notifications() {
    return this.element.$(`~${NOTIFICATIONS}`);
  }
}

module.exports = ExchangeInlineEditPanelSO;
