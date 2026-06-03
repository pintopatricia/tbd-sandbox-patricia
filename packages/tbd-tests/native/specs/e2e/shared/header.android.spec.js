const { HeaderSO } = require("../../../screen-objects");

const { Weaver } = require("../../../../utils/weaver");
const { startApp, openDeeplink } = require("../../../helpers/urls");
const { login } = require("../../../helpers/login");

const weaver = new Weaver();
const headerSO = new HeaderSO();

describe("Header", () => {
  beforeAll(async () => {
    const eventData = await weaver.fetchSingleEventData({
      productTypes: ["SPORTSBOOK"],
    });

    await startApp("home");
    await login("gtaAccount");
    await openDeeplink(`sport/competititon/event/e-${eventData.eventId}`);
    await browser.waitUntilDisplayed(headerSO.element, "Header is not displayed");
    await browser.waitUntilDisplayed(headerSO.backButton, "Header backButton was not displayed");
    await browser.waitUntilDisplayed(headerSO.balanceButton, "Header balance is not displayed");
  });

  describe("When the user opens the event page and is logged in", () => {
    it("[PRPI-1002] Then I should see the header logo", async () => {
      expect(await headerSO.betfairLogo.isDisplayed()).toBe(true);
    });

    it("[PRPI-1003] And I should see the account icon", async () => {
      expect(await headerSO.balanceButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-1004] Then I should see the header back button", async () => {
      expect(await headerSO.backButton.isDisplayed()).toBe(true);
    });
  });

  describe("When user clicks on the betfair logo and returns to home page", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(headerSO.logo, "logo was not clickable");
      await headerSO.logo.click();
      await browser.waitUntilNotDisplayed(headerSO.backButton, "Header back Button is still displayed");
    });

    it("[PRPI-1005] And I shouldn't see the header back button", async () => {
      expect(await headerSO.backButton.isDisplayed()).toBe(false);
    });
  });
});
