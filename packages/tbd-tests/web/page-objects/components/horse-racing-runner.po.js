const {
  TEST_ID,
  JOCKEY_NAME,
  TRAINER_NAME,
  DRAW_NUMBER,
  CLOTH_NUMBER,
  SILK,
  DEFAULT_SILK,
  FORM,
  EXPANDABLE_DETAILS,
  CHEVRON,
} = require("@ppb/the-wall-web/components/walls/HorseRacingRunner/HorseRacingRunner.selectors");
const {
  RUNNER_NAME,
  MIDDLE_CONTAINER,
  RIGHT_COLUMN,
} = require("@ppb/the-wall-web/components/walls/RacingRunner/RacingRunner.selectors");
const {
  TEST_ID: EXC_BET_BUTTONS,
} = require("@ppb/tbd-shared/components/ExchangeBetButtons/snowflakes/ExchangeBetButton/ExchangeBetButton.web.selectors");
const {
  TEST_ID: SBK_BET_BUTTON,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");
const { TEST_ID: PNL_AND_WHAT_IF } = require("@ppb/the-wall-web/components/bricks/PNLAndWhatIf/PNLAndWhatIf.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class HorseRacingRunner extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get runnerSilk() {
    return this.element.$(SILK);
  }

  get runnerDefaultSilk() {
    return this.element.$(DEFAULT_SILK);
  }

  getRunnerInformationContainers() {
    return this.element.$$(MIDDLE_CONTAINER);
  }

  get pnlAndWhatIf() {
    return this.element.$(PNL_AND_WHAT_IF);
  }

  get exchangeBetButtons() {
    return this.element.$$(EXC_BET_BUTTONS);
  }

  get sportsbookBetButton() {
    return this.element.$(SBK_BET_BUTTON);
  }

  get horseName() {
    return this.element.$(RUNNER_NAME);
  }

  get horseNumber() {
    return this.element.$(CLOTH_NUMBER);
  }

  get jockeyName() {
    return this.element.$(JOCKEY_NAME);
  }

  get trainerName() {
    return this.element.$(TRAINER_NAME);
  }

  get jockeyNumber() {
    return this.element.$(DRAW_NUMBER);
  }

  get form() {
    return this.element.$(FORM);
  }

  get chevron() {
    return this.element.$(CHEVRON);
  }

  get expandableDetails() {
    return this.element.$(EXPANDABLE_DETAILS);
  }

  get rightColumn() {
    return this.element.$(RIGHT_COLUMN);
  }
};
