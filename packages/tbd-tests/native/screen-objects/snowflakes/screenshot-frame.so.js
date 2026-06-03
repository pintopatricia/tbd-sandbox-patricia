const {
  SCREENSHOT_FRAME,
} = require("@ppb/tbd-shared/components/BetSharingCardGroup/snowflakes/ScreenshotFrame/ScreenshotFrame.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ScreenshotFrameSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SCREENSHOT_FRAME}`));
  }
}

module.exports = ScreenshotFrameSO;
