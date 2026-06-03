const { HeaderSO, BottomBarSO, AcceptAllCookiesSO } = require("../../../screen-objects");
const { startApp } = require("../../../helpers/urls");

const headerSO = new HeaderSO();
const acceptAllCookiesSO = new AcceptAllCookiesSO();

describe("My Bets Page - Logged Out", () => {
  describe("When the user opens My Bets page and is logged out", () => {
    beforeAll(async () => {
      await startApp("home");
      await acceptAllCookiesSO.dismissCookieBanner();
      await browser.waitUntilClickableNative(BottomBarSO.myBets, "The my bets button is not clickable");
      await BottomBarSO.myBets.click();
    });

    it("[PRPI-1013] The log in or join now info should be displayed", async () => {
      expect(await headerSO.joinNowButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-1014] The login button should be displayed", async () => {
      expect(await headerSO.loginButton.isDisplayed()).toBe(true);
    });
  });
});
