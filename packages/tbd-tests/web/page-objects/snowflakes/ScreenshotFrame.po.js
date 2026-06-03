const {
  TEST_ID,
} = require("@ppb/tbd-shared/components/BetSharingCardGroup/snowflakes/ScreenshotFrame/ScreenshotFrame.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ScreenshotFramePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = ScreenshotFramePO;
