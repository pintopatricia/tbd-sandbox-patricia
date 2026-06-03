const { addFeature } = require("@wdio/allure-reporter");
const { AppPO, CardGroupPO, QuicklinksGridPO } = require("../../../page-objects");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");

const cardGroupPO = new CardGroupPO();
const quicklinksGridCardGrouPO = new QuicklinksGridPO();
const appPO = new AppPO();

describe("Verify Popular List- Desktop Orientation", () => {
  beforeAll(async () => {
    await openPageAndAcceptCookieConsent();
    await appPO.element.waitForDisplayed();
  });

  it("[PRPI-1674] Desktop Popular List is displayed", async () => {
    addFeature("BETFAIR TESTS");

    expect(await cardGroupPO.element.isDisplayed()).toBe(true, "Card Group is not displayed");
    expect(await cardGroupPO.title.getText()).toBe("Popular", "Card Group is not displayed");
    expect(await quicklinksGridCardGrouPO.element.isDisplayed());
  });
});
