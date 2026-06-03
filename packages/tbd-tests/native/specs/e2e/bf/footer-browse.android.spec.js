const { BottomBarSO, FooterSO } = require("../../../screen-objects");
const { startApp } = require("../../../helpers/urls");
const { login } = require("../../../helpers/login");
const { swipeToBottom } = require("../../../helpers/gestures");

const footerSO = new FooterSO();

describe("Footer", () => {
  beforeAll(async () => {
    await startApp("home");
    await login("oddsMovementOn");
    await browser.waitUntilClickableNative(BottomBarSO.browse, "BottomBar browse button was not clickable");
  });

  describe("when in Browse Screen", () => {
    beforeAll(async () => {
      await BottomBarSO.browse.click();
      await browser.waitUntilClickableNative(BottomBarSO.myBets, "BottomBar myBets button was not clickable");
      await swipeToBottom();
      await browser.waitUntilDisplayed(footerSO.element, "Footer was not displayed");
    });

    it("[PRPI-926] Should show the Footer", async () => {
      expect(await footerSO.element.isDisplayed()).toBe(true);
    });
  });
});
