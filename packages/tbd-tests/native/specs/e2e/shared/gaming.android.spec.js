const { BottomBarSO } = require("../../../screen-objects");
const GameCardSO = require("@ppb/tbd-shared/components/GameCard/GameCard.native.so");
const { startApp } = require("../../../helpers/urls");
const { swipeUp } = require("../../../helpers/gestures");

const { login } = require("../../../helpers/login");

const gameCardSO = new GameCardSO();

describe("Gaming", () => {
  describe("When user clicks on casino tile from bottom bar", () => {
    beforeAll(async () => {
      await startApp("home");
      await login("gtaAccount");

      await browser.waitUntilClickableNative(BottomBarSO.gaming, "BottomBar Games button was not clickable");
      await BottomBarSO.gaming.click();
      await swipeUp();
      await browser.waitUntilDisplayed(gameCardSO.element);
    });

    it("[PRPI-1001] User should be redirected to gaming page", async () => {
      expect(await gameCardSO.element.isDisplayed()).toBe(true);
    });
  });
});
