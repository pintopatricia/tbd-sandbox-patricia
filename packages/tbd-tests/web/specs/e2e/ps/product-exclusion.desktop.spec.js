const { addFeature } = require("@wdio/allure-reporter");
const { AppPO } = require("../../../page-objects");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");

const appPO = new AppPO();

describe("Exclusion Login: ", () => {
  it("[PRPI-660] should not display virtuals", async () => {
    addFeature("POKERSTAR TESTS");
    await openPageAndAcceptCookieConsent();

    expect(await appPO.football.isExisting()).toBe(true, "Page has not loaded correctly");
    expect(await appPO.virtuals.isExisting()).toBe(false, "Virtuals are displayed for excluded user");
  });
});
