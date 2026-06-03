const { CookieConsentBannerPO, AppPO, SscPO } = require("../../../page-objects");
const { addLabel } = require("@wdio/allure-reporter");
const { loginWithSSOID } = require("../../../helpers/login.util");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const { clearCookies } = require("../../../helpers/cookie.util");

const appPO = new AppPO();
const sscPO = new SscPO(appPO.desktopHeader);
const cookieConsentBannerPO = new CookieConsentBannerPO();

describe("Verify Logout - Desktop Orientation", () => {
  describe("when the user is logged in ", () => {
    addLabel("jira", "CRBRS-36");

    beforeAll(async () => {
      await openPageAndAcceptCookieConsent();
      await appPO.element.waitForDisplayed({
        timeoutMsg: "App  was not displayed",
      });
      await sscPO.element.waitForDisplayed({
        timeoutMsg: "Desktop Header was not displayed",
      });
      await loginWithSSOID("gtaTestAccount");
    });

    it("[PRPI-632] My Account should be displayed", async () => {
      expect(await sscPO.myAccount.isDisplayed()).toBe(true);
    });

    it("[PRPI-633] My Rewards should be displayed", async () => {
      expect(await sscPO.myRewards.isDisplayed()).toBe(true);
    });

    it("[PRPI-634] Deposit should be displayed", async () => {
      expect(await sscPO.myDeposit.isDisplayed()).toBe(true);
    });

    it("[PRPI-635] The main wallet should be displayed and have a value different = require(NA or Loading)", async () => {
      expect(await sscPO.myMainWallet.isDisplayed()).toBe(true);
      expect(await sscPO.myMainWallet.getText()).not.toBe("NA");
      expect(await sscPO.myMainWallet.getText()).not.toBe("Loading");
    });

    describe("when clicking on My Account", () => {
      beforeAll(async () => {
        await sscPO.myAccount.click();
        await sscPO.myAccountMenu.waitForDisplayed({
          timeoutMsg: "My Account menu  was not displayed",
        });
      });

      it("[PRPI-636] the user should see the Log Out button on my account menu", async () => {
        expect(await sscPO.logoutButton.isDisplayed()).toBe(true);
      });

      if (!process.env.BASE_URL.includes("qa")) {
        describe("when clicking on the logout button and returns to home page", () => {
          addLabel("jira", "CRBRS-68");

          beforeAll(async () => {
            await clearCookies();
            await sscPO.logoutButton.click();
            await cookieConsentBannerPO.acceptAllCookies();
            await appPO.desktopHeader.waitForDisplayed({
              timeoutMsg: "Desktop Header was not displayed",
            });
          });

          it("[PRPI-637] the Desktop header is displayed", async () => {
            expect(await appPO.desktopHeader.isDisplayed()).toBe(true, "header is not displayed");
          });

          it("[PRPI-638] the Sign Up button should be displayed", async () => {
            expect(await sscPO.signUpButton.isDisplayed()).toBe(true);
          });

          it("[PRPI-639] the Log In button should be displayed", async () => {
            expect(await sscPO.logInButton.isDisplayed()).toBe(true);
          });
        });
      }
    });
  });
});
