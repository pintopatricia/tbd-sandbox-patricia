const {
  HORSE_RUNNER,
  HORSE_RUNNER_SILK,
  HORSE_RUNNER_SILK_DEFAULT,
  HORSE_RUNNER_CLOTH_NUMBER,
  HORSE_RUNNER_JOCKEY_NAME,
  HORSE_RUNNER_TRAINER_NAME,
  HORSE_RUNNER_DRAW_NUMBER,
  HORSE_RUNNER_INFORMATION_CONTAINER,
  HORSE_RUNNER_FORM,
  HORSE_RUNNER_CHEVRON,
  HORSE_RUNNER_EXPANDABLE_DETAILS,
} = require("@ppb/the-wall-native/components/Runner/HorseRacingRunner/HorseRacingRunner.selectors");
const { TITLE, RIGHT_COLUMN } = require("@ppb/the-wall-native/components/Runner/RacingRunner/RacingRunner.selectors");
const {
  TEST_ID: SPORTSBOOK_BET_BUTTONS,
} = require("@ppb/the-wall-native/components/SportsbookBetButton/SportsbookBetButton.selectors");
const {
  BET_BUTTON_TEST_ID,
} = require("@ppb/tbd-shared/components/ExchangeBetButtons/snowflakes/BetButton/BetButton.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class HorseRacingRunnerSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${HORSE_RUNNER}`));
  }

  get container() {
    return this.element.$(`~${HORSE_RUNNER_INFORMATION_CONTAINER}`);
  }

  get silk() {
    return this.element.$(`~${HORSE_RUNNER_SILK}`);
  }

  get defaultSilk() {
    return this.element.$(`~${HORSE_RUNNER_SILK_DEFAULT}`);
  }

  get runnerHorseName() {
    return this.element.$(`~${TITLE}`);
  }

  get clothNumber() {
    return this.element.$(`~${HORSE_RUNNER_CLOTH_NUMBER}`);
  }

  get jockeyName() {
    return this.element.$(`~${HORSE_RUNNER_JOCKEY_NAME}`);
  }

  get trainerName() {
    return this.element.$(`~${HORSE_RUNNER_TRAINER_NAME}`);
  }

  get drawNumber() {
    return this.element.$(`~${HORSE_RUNNER_DRAW_NUMBER}`);
  }

  get form() {
    return this.element.$(`~${HORSE_RUNNER_FORM}`);
  }

  get sbkBetButtons() {
    return this.element.$$(`~${SPORTSBOOK_BET_BUTTONS}`);
  }

  get rightColumn() {
    return this.element.$(`~${RIGHT_COLUMN}`);
  }

  get betButtons() {
    return this.element.$$(`~${BET_BUTTON_TEST_ID}`);
  }

  get expandableDetails() {
    return this.element.$(`~${HORSE_RUNNER_EXPANDABLE_DETAILS}`);
  }

  get chevron() {
    return this.element.$(`~${HORSE_RUNNER_CHEVRON}`);
  }

  get innerContainer() {
    return this.element.$(`~${TITLE}`);
  }
}

module.exports = HorseRacingRunnerSO;
