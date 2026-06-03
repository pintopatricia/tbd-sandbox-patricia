const { BasePO } = require("@ppb/wdio-lazy-element");
const SportsbookChatbotInputSelectors = require("@ppb/tbd-components-sports-betting/components/SportsbookChatbotInput/view/SportsbookChatbotInput.selectors");

const ROOT = `[data-testid="${SportsbookChatbotInputSelectors.TEST_ID}"]`;
const TEXT_INPUT = `[data-testid="${SportsbookChatbotInputSelectors.TEXT_INPUT}"]`;

class SportsbookChatbotInputPO extends BasePO {
  constructor() {
    super(undefined, $(ROOT));
  }

  // TODO: switch to dedicated data-testid when tbd-components are updated
  get expandButton() {
    return $(`${ROOT}:not(:has(${TEXT_INPUT})) button:not([data-testid])`);
  }

  // TODO: switch to dedicated data-testid when tbd-components are updated
  get sendButton() {
    return $(`${ROOT}:has(${TEXT_INPUT}) button:not([data-testid])`);
  }

  get textInput() {
    return this.element.$(`[data-testid="${SportsbookChatbotInputSelectors.TEXT_INPUT}"]`);
  }

  get clearButton() {
    return this.element.$(`[data-testid="${SportsbookChatbotInputSelectors.CLEAR_BUTTON}"]`);
  }
}

module.exports = SportsbookChatbotInputPO;
