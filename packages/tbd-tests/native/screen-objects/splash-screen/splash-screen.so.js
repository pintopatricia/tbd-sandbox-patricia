const { BaseSO } = require("@ppb/wdio-lazy-element");
const { SPLASH_SCREEN } = require("./splash-screen.selectors");

class SplashScreenSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SPLASH_SCREEN}`));
  }
}

module.exports = SplashScreenSO;
