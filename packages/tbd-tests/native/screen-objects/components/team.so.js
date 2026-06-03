const {
  TEAM,
  NAME,
  CREST,
  CREST_PLACEHOLDER,
  RANK,
  SERVING,
} = require("@ppb/the-wall-native/components/Scoreboard/Team/Team.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class TeamSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEAM}`));
  }

  get crest() {
    return this.element.$(`~${CREST}`);
  }

  get crestPlaceholder() {
    return this.element.$(`~${CREST_PLACEHOLDER}`);
  }

  get name() {
    return this.element.$(`~${NAME}`);
  }

  get serving() {
    return this.element.$(`~${SERVING}`);
  }

  get rank() {
    return this.element.$(`~${RANK}`);
  }
}

module.exports = TeamSO;
