const { GenericScreenSO, BottomBarSO, MyBetsScreenSO, FooterSO } = require("../../../screen-objects");
const { startApp, openDeeplink } = require("../../../helpers/urls");
const { login } = require("../../../helpers/login");
const { swipeToBottom } = require("../../../helpers/gestures");
const { Weaver } = require("../../../../utils/weaver");

const genericScreenSO = new GenericScreenSO();
const myBetsScreenSO = new MyBetsScreenSO();
const footerSO = new FooterSO();

const weaver = new Weaver();

describe("Footer", () => {
  beforeAll(async () => {
    await startApp("home");
    await login("gtaAccount");
    await browser.waitUntilClickableNative(BottomBarSO.home, "BottomBar home button was not clickable");
  });

  describe("when in Home Screen", () => {
    beforeAll(async () => {
      await swipeToBottom();
      await browser.waitUntilDisplayed(footerSO.element, "Footer was not displayed");
    });

    it("[PRPI-999] Should show the Footer", async () => {
      expect(await footerSO.element.isDisplayed()).toBe(true);
    });
  });

  describe("when in MyBets Screen", () => {
    beforeAll(async () => {
      await BottomBarSO.myBets.click();
      await browser.waitUntilDisplayed(myBetsScreenSO.element, "MyBetsScreen was not displayed");

      await myBetsScreenSO.closeSnackbars();

      await swipeToBottom(0.95);
      await browser.waitUntilDisplayed(footerSO.element, "Footer was not displayed");
    });

    it("[PRPI-1018] Should show the Footer", async () => {
      expect(await footerSO.element.isDisplayed()).toBe(true);
    });
  });

  describe("when in Event Screen", () => {
    beforeAll(async () => {
      const eventData = await weaver.fetchSingleEventData();
      await openDeeplink(`sport/competititon/event/e-${eventData.eventId}`);
      await browser.waitUntilDisplayed(genericScreenSO.element, "GenericScreen was not displayed");
      await swipeToBottom(0.95);
      await browser.waitUntilDisplayed(footerSO.element, "Footer was not displayed");
    });

    it("[PRPI-1000] Should show the Footer", async () => {
      expect(await footerSO.element.isDisplayed()).toBe(true);
    });
  });
});
