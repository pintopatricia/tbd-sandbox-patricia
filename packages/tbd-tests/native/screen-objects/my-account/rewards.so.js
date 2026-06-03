const { BaseSO } = require("@ppb/wdio-lazy-element");

const {
  REWARDS_SECTION,
  MONTH,
  COUNTER,
  PROGRESS_BAR,
  PROGRESS_MESSAGE,
  REWARD_TITLE,
} = require("./rewards.selectors");

class RewardsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${REWARDS_SECTION}`));
  }

  get month() {
    return this.element.$$(`~${MONTH}`);
  }

  get counter() {
    return this.element.$(`~${COUNTER}`);
  }

  get progressBar() {
    return this.element.$(`~${PROGRESS_BAR}`);
  }

  get progressMessage() {
    return this.element.$(`~${PROGRESS_MESSAGE}`);
  }

  get title() {
    return this.element.$(`~${REWARD_TITLE}`);
  }
}

module.exports = RewardsSO;
