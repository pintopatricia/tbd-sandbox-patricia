const { TEST_ID, FIRST_TEAM, SECOND_TEAM } = require("@ppb/the-wall-web/components/bricks/Teams/Teams.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class TeamsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get firstTeam() {
    return this.element.$(FIRST_TEAM);
  }

  get secondTeam() {
    return this.element.$(SECOND_TEAM);
  }
}

module.exports = TeamsPO;
