const { addFeature } = require("@wdio/allure-reporter");
const { AppPO } = require("../../../page-objects");
const { loginWithSSOID } = require("../../../helpers/login.util");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");

const appPO = new AppPO();

describe("Exclusion Login: ", () => {
  it("[PRPI-684] should not display the virtuals while logging in as a user with virtuals disabled", async () => {
    addFeature("BETFAIR TESTS");
    await openPageAndAcceptCookieConsent();
    await loginWithSSOID("gamingExcludedCustomer");

    expect(await appPO.football.isExisting()).toBe(true, "Page has not loaded correctly");
    expect(await appPO.virtuals.isExisting()).toBe(false, "Virtuals are displayed for excluded user");
  });
});
