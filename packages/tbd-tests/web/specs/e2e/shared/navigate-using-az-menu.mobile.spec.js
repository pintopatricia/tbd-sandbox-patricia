const { BottomBarPO, GenericSwitcherCardPO } = require("../../../page-objects");
const { addFeature, addLabel } = require("@wdio/allure-reporter");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const QuickLinksCard = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.web.po");

const bottomBarPO = new BottomBarPO();
const quickLinksCardPO = new QuickLinksCard();
const genericSwitcherCardPO = new GenericSwitcherCardPO();

describe("Navigate to a sport page using AZ Menu - Mobile Orientation", () => {
  addLabel("jira", "CRBRS-65");
  beforeAll(async () => {
    addFeature("SHARED TESTS");
    await openPageAndAcceptCookieConsent();
  });

  it("[PRPI-687] User navigate to a sport page through AZ menu", async () => {
    addFeature("SHARED TESTS");
    await bottomBarPO.browseTile.click();
    await quickLinksCardPO.element.waitForDisplayed({
      timeoutMsg: "AZ Menu was not displayed",
    });
    const horseRacing = await $("=Horse Racing");
    await horseRacing.waitForClickable();
    await horseRacing.click();
    await genericSwitcherCardPO.element.waitForDisplayed();

    expect((await genericSwitcherCardPO.element.getText()).toLowerCase()).toBe("horse racing");
  });
});
