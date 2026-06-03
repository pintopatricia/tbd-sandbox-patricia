const { addFeature } = require("@wdio/allure-reporter");
const { SportsbookBetButtonPO, ExchangeBetButtonPO } = require("../../../page-objects");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const { loginWithSSOID } = require("../../../helpers/login.util");

const PHOENIX_ENABLED_COOKIE = "phoenixEnabled";
const EXC_ALLOWED_JURISDICTION_THROTTLE = "EXC_ALLOWED_JURISDICTION";

const sportsbookBetButton = new SportsbookBetButtonPO();
const exchangeBetButton = new ExchangeBetButtonPO();

describe("Product Deep Linking", () => {
  beforeAll(() => {
    addFeature("BETFAIR TESTS");
  });

  describe("when the EXC_ALLOWED_JURISDICTION throttle is ON", () => {
    describe("and the url includes the ?product=exc query parameter", () => {
      describe("and the user is logged out", () => {
        beforeAll(async () => {
          await openPageAndAcceptCookieConsent({ turnOn: [EXC_ALLOWED_JURISDICTION_THROTTLE] }, "product=exc");
        });

        it("[PRPI-11867]the user should be redirected to exchange", async () => {
          await browser.waitUntilDisplayed(exchangeBetButton.element, "An Exchange bet button was never displayed");
        });

        it("[PRPI-11868]the phoenixEnabled cookie should be set to true", async () => {
          await browser.waitUntilCookieEquals(PHOENIX_ENABLED_COOKIE, "true");
        });
      });

      describe("and the user is logged in and exchange eligible", () => {
        beforeAll(async () => {
          await loginWithSSOID("internationalExchangeAccount2", "", "product=exc", {
            turnOn: [EXC_ALLOWED_JURISDICTION_THROTTLE],
          });
        });

        it("[PRPI-11869]the user should be redirected to exchange", async () => {
          await browser.waitUntilDisplayed(exchangeBetButton.element, "An Exchange bet button was never displayed");
        });

        it("[PRPI-11870]the phoenixEnabled cookie should be set to true", async () => {
          await browser.waitUntilCookieEquals(PHOENIX_ENABLED_COOKIE, "true");
        });
      });

      describe("and the user is logged in and not exchange eligible", () => {
        beforeAll(async () => {
          await loginWithSSOID("gtaAccount", "", "product=exc", { turnOn: [EXC_ALLOWED_JURISDICTION_THROTTLE] });
        });

        it("[PRPI-11871]the user should be redirected to sportsbook", async () => {
          await browser.waitUntilDisplayed(
            sportsbookBetButton.sportsbookBetButton,
            "A Sportsbook bet button was never displayed",
          );
        });

        it("[PRPI-11872]the phoenixEnabled cookie should not be set to true", async () => {
          await browser.waitUntilCookieEquals(PHOENIX_ENABLED_COOKIE, "false");
        });
      });
    });

    describe("and the url includes the ?product=sbk query parameter", () => {
      describe("and the user is logged in and exchange migrated", () => {
        beforeAll(async () => {
          await loginWithSSOID("internationalExchangeAccount", "", "product=sbk", {
            turnOn: [EXC_ALLOWED_JURISDICTION_THROTTLE],
          });
        });

        it("[PRPI-11873]the user should be redirected to sportsbook", async () => {
          await browser.waitUntilDisplayed(
            sportsbookBetButton.sportsbookBetButton,
            "A Sportsbook bet button was never displayed",
          );
        });

        it("[PRPI-11874]the phoenixEnabled cookie should be set to true", async () => {
          await browser.waitUntilCookieEquals(PHOENIX_ENABLED_COOKIE, "true");
        });
      });
    });
  });

  describe("when the EXC_ALLOWED_JURISDICTION throttle is OFF", () => {
    describe("and the url includes the ?product=exc query parameter", () => {
      beforeAll(async () => {
        await loginWithSSOID("internationalExchangeAccount", "", "product=exc", {
          turnOff: [EXC_ALLOWED_JURISDICTION_THROTTLE],
        });
      });

      it("[PRPI-11875]the user should be redirected to sportsbook", async () => {
        await browser.waitUntilDisplayed(
          sportsbookBetButton.sportsbookBetButton,
          "A Sportsbook bet button was never displayed",
        );
      });
    });
  });
});
