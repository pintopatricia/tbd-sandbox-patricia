const { addFeature } = require("@wdio/allure-reporter");
const { SportsbookBetButtonPO } = require("../../../page-objects");
const { loginWithSSOID } = require("../../../helpers/login.util");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");

const sbkBetButton = new SportsbookBetButtonPO();

describe("EXC Desktop Navigation", () => {
  describe("when a Phoenix migrated user tries to access EXC desktop version", () => {
    beforeAll(async () => {
      addFeature("BETFAIR TESTS");

      await openPageAndAcceptCookieConsent({}, "desktop=true");
      await loginWithSSOID("internationalExchangeAccount", "", "desktop=true");
    });

    it("[PRPI-4809] should be redirected to SBK", async () => {
      await browser.waitUntilDisplayed(sbkBetButton.sportsbookBetButton, "A SBK bet button was never displayed");
    });
  });
});
