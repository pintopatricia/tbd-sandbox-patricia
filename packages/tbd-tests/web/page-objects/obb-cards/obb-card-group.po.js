const { TEST_ID: SECTION } = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors");
const { TEST_ID } = require("@ppb/tbd-shared/components/ObbCardGroup/ObbCardGroup.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ObbCardGroupPO extends BasePO {
  constructor() {
    super($(TEST_ID));
  }

  get sections() {
    return this.element.$$(`${SECTION}:has(> [role="button"])`);
  }
};
