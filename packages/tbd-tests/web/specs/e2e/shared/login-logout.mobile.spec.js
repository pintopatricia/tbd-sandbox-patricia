const { addFeature, addLabel } = require("@wdio/allure-reporter");
const { HeaderPO, UserProfilePO, UserProfileHeaderPO, CookieConsentBannerPO } = require("../../../page-objects");
const { loginWithSSOID } = require("../../../helpers/login.util");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const { clearCookies } = require("../../../helpers/cookie.util");

const userProfilePO = new UserProfilePO();
const headerPO = new HeaderPO();
const userProfileHeaderPO = new UserProfileHeaderPO();
const cookieConsentBannerPO = new CookieConsentBannerPO();

describe("Verify Logout - Mobile Orientation", () => {
  beforeAll(async () => {
    addFeature("SHARED TESTS");
    await openPageAndAcceptCookieConsent();
  });

  it("[PRPI-640] the login button should be displayed", async () => {
    expect(await headerPO.loginButton.isDisplayed()).toBe(true);
  });

  describe("when the user is logged in ", () => {
    addLabel("jira", "CRBRS-36");

    beforeAll(async () => {
      await loginWithSSOID("gtaTestAccount");
      await browser.waitUntilDisplayed(headerPO.balanceIcon, { timeoutMsg: "Balance icon was not displayed" });
    });

    it("[PRPI-641] the user icon should be displayed", async () => {
      expect(await headerPO.balanceIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-642] the balance should be displayed", async () => {
      expect(await headerPO.balanceLabel.isDisplayed()).toBe(true);
      expect(await headerPO.balanceLabel.getText()).not.toBe("NA");
      expect(await headerPO.balanceLabel.getText()).not.toBe("Loading");
    });

    describe("when clicking on the user icon", () => {
      beforeAll(async () => {
        await headerPO.balanceIcon.waitForDisplayed({ timeoutMsg: "Balance icon was not displayed" });
        await headerPO.balanceIcon.click();
        await userProfileHeaderPO.element.waitForDisplayed({ timeoutMsg: "User profile header was not displayed" });
      });

      it("[PRPI-643] the user should be redirected to the user profile page", async () => {
        expect(await userProfileHeaderPO.title.isDisplayed()).toBe(true);
      });

      if (!process.env.BASE_URL.includes("qa")) {
        describe("when clicking on the logout button and returns to home page", () => {
          addLabel("jira", "CRBRS-68");

          beforeAll(async () => {
            await userProfilePO.logOutButtonLink.scrollIntoView();
            await userProfilePO.logOutButtonLink.waitForDisplayed({ timeoutMsg: "Logout button was not displayed" });
            // set and delete cookies responsible of identitySSO as we set cookies for login we need to clear down for logout(domains are diferent between login code and loged out logic)
            await clearCookies();
            await userProfilePO.logOutButtonLink.click();
            await cookieConsentBannerPO.acceptAllCookies();
            await headerPO.logoContainer.isDisplayed();
            await headerPO.joinNowButton.waitForDisplayed({ timeoutMsg: "Join Now button was not displayed" });
          });

          it("[PRPI-644] the login button should be displayed", async () => {
            expect(await headerPO.loginButton.isDisplayed()).toBe(true);
          });

          it("[PRPI-645] the join now button should be displayed", async () => {
            expect(await headerPO.joinNowButton.isDisplayed()).toBe(true);
          });

          it("[PRPI-646] the user info should no longer be displayed", async () => {
            expect(await headerPO.balanceButton.isDisplayed()).toBe(false);
          });
        });
      }
    });
  });
});
