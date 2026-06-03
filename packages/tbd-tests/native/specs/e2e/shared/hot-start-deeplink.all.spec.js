const { AcceptAllCookiesSO, SelectorSO } = require("../../../screen-objects");
const { executeDeeplinkCommand, startApp } = require("../../../helpers/urls");

const acceptAllCookiesSO = new AcceptAllCookiesSO();
const genericSwitcherCardSelectorSO = new SelectorSO();

describe("Deeplink (hot start)", () => {
  beforeAll(async () => {
    await startApp("home");
    await acceptAllCookiesSO.dismissCookieBanner();
    await browser.background(-1);
    await executeDeeplinkCommand("horse-racing/s-7");
  });

  describe("When deeplinking to racing page", () => {
    it("[PRPI-998] Should show the correct sport name in the generic switcher", async () => {
      await browser.waitUntilDisplayed(genericSwitcherCardSelectorSO.title, "Generic Switcher Card is not displayed");
      expect((await genericSwitcherCardSelectorSO.title.getText()).toLowerCase()).toBe("horse racing");
    });
  });
});
