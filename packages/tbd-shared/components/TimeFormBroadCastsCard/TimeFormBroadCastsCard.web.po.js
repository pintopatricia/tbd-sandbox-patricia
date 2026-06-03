const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID: SupportingContentButton,
} = require("@ppb/the-wall-web/components/bricks/SupportingContentButton/SupportingContentButton.selectors");

const { TEST_ID } = require("./TimeFormBroadCastsCard.web.selectors");

module.exports = class TimeFormBroadCastsCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get timeformAndBroadcastsButtons() {
    return this.element.$$(SupportingContentButton);
  }
};
