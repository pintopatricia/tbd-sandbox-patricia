const { HeaderSectionTitleSO, LogOutButtonSO, HeaderSO } = require("../../../screen-objects");

const { swipeToBottom } = require("../../../helpers/gestures");

const { startApp } = require("../../../helpers/urls");
const { login } = require("../../../helpers/login");

const headerSO = new HeaderSO();
const headerSectionTitleSO = new HeaderSectionTitleSO();
const logOutButtonSO = new LogOutButtonSO();

describe("Log out", () => {
  describe("when a logged in user navigates to the homepage", () => {
    beforeAll(async () => {
      await startApp("home");
      await login("gtaAccount");
      await browser.waitUntilDisplayed(headerSO.element, "Header is not displayed");
      await browser.waitUntilDisplayed(headerSO.balanceButton, "Header balance is not displayed");
    });

    it("[PRPI-1006] The user icon should be displayed", async () => {
      expect(await headerSO.userProfile.isDisplayed()).toBe(true);
    });

    it("[PRPI-1007] The balance should be displayed", async () => {
      expect(await headerSO.balanceButton.isDisplayed()).toBe(true);
    });

    describe("when clicking on the user icon", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(headerSO.userProfile, "The user icon was not displayed");
        await headerSO.userProfile.click();
        await browser.waitUntilDisplayed(headerSectionTitleSO.element, "There is no header section title visible");
      });

      it("[PRPI-1008] The user should be redirected to the user profile page", async () => {
        expect(await headerSectionTitleSO.element.isDisplayed()).toBe(true);
      });

      describe("when clicking on the logout button and returns to home page", () => {
        beforeAll(async () => {
          await swipeToBottom(0.7);
          await browser.waitUntilDisplayed(logOutButtonSO.element, "There is no log out button visible");
          await logOutButtonSO.element.click();
          await browser.waitUntilDisplayed(headerSO.logo, "Logo was not displayed");
          await browser.waitUntilDisplayed(headerSO.loginButton, "Log In button was not displayed");
          await browser.waitUntilDisplayed(headerSO.joinNowButton, "Join Now button was not displayed");
          await browser.waitUntilNotDisplayed(headerSO.backButton, "Back button was displayed");
        });

        it("[PRPI-1009] The user should see the brand logo", async () => {
          expect(await headerSO.logo.isDisplayed()).toBe(true);
        });

        it("[PRPI-1010] The login button should be displayed", async () => {
          expect(await headerSO.loginButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-1011] The join now button should be displayed", async () => {
          expect(await headerSO.joinNowButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-1012] The user details should no longer be displayed", async () => {
          expect(await headerSO.balanceButton.isDisplayed()).toBe(false);
        });
      });
    });
  });
});
