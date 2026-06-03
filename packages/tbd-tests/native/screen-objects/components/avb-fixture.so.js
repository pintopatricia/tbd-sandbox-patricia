const { AVB_FIXTURE, TITLE } = require("@ppb/the-wall-native/components/AvBFixture/AvBFixture.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class AvBFixtureSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${AVB_FIXTURE}`));
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }
}

module.exports = AvBFixtureSO;
