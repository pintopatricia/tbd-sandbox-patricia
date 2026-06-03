const {
  TEST_ID,
  PERSISTENCE,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlineEdit/snowflakes/ExchangeInlineEditPanel/ExchangeInlineEditPanel.web.selectors");
const {
  TEST_ID: NUDGES_INPUT_ID,
} = require("@ppb/the-wall-web/components/walls/NudgesNumberInputField/NudgesNumberInputField.selectors");
const { TEST_ID: ALERTS } = require("@ppb/the-wall-web/components/walls/Alerts/Alerts.selectors");
const { SECONDARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/SecondaryButton/SecondaryButton.selectors");
const { PRIMARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ExchangeInlineEditPanelPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get inputs() {
    return this.element.$$(NUDGES_INPUT_ID);
  }

  get notifications() {
    return this.element.$(ALERTS);
  }

  get cancel() {
    return this.element.$(SECONDARY_BUTTON);
  }

  get place() {
    return this.element.$(PRIMARY_BUTTON);
  }

  get persistence() {
    return this.element.$(PERSISTENCE);
  }
}

module.exports = ExchangeInlineEditPanelPO;
