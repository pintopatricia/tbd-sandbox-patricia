const { HeaderSectionTitleSO, RewardsSO, MyAccountSO, HeaderSO } = require("../../../screen-objects");
const { startApp } = require("../../../helpers/urls");
const { swipeDownElement, swipeUp } = require("../../../helpers/gestures");
const { login } = require("../../../helpers/login");

const headerSO = new HeaderSO();
const rewardsSO = new RewardsSO();
const headerSectionTitleSO = new HeaderSectionTitleSO();
const myAccountSO = new MyAccountSO();

describe("Rewards", () => {
  describe("When the user open the app ", () => {
    beforeAll(async () => {
      await startApp("home");
      await login("oddsMovementOn");
      await browser.waitUntilDisplayed(headerSO.element, "Header is not displayed");
    });

    it("[PRPI-927] The user icon should be displayed", async () => {
      expect(await headerSO.userProfile.isDisplayed()).toBe(true);
    });

    it("[PRPI-928] The balance should be displayed", async () => {
      expect(await headerSO.balanceButton.isDisplayed()).toBe(true);
    });

    describe("When taps on the MyAccount icon", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(headerSO.userProfile, "The user icon was not displayed");
        await headerSO.userProfile.click();
        await browser.waitUntilDisplayed(headerSectionTitleSO.element, "There is no header section title visible");
        await browser.waitUntilDisplayed(myAccountSO.title[1], "My Betfair Rewards Section Title is not displayed");
        await browser.waitUntilEquals(myAccountSO.title[1], "My Betfair Rewards");
        await swipeDownElement(rewardsSO.month[1], 600); // to the top

        await browser.waitUntilDisplayed(rewardsSO.title, "Rewards does not exist");
      });

      it("[PRPI-929] Should see the Rewards section and he's chosen reward plan", async () => {
        expect(await rewardsSO.title.getText()).toBe("REWARDS");
      });

      it("[PRPI-930] And the next month progress section", async () => {
        expect(await rewardsSO.month[0].isDisplayed()).toBe(true);
        expect(await rewardsSO.counter.isDisplayed()).toBe(true);
        expect(await rewardsSO.progressBar.isDisplayed()).toBe(true);
        expect(await rewardsSO.progressMessage.isDisplayed()).toBe(true);
      });

      it("[PRPI-931] And the current month rewards result section", async () => {
        expect(await rewardsSO.month[1].isDisplayed()).toBe(true);
        expect(await rewardsSO.progressMessage.isDisplayed()).toBe(true);
      });

      describe("and when it taps the next month progress", () => {
        beforeAll(async () => {
          await swipeUp(0.5);
          await rewardsSO.month[0].click();
        });

        // At this point we can only validate that we're on a webview but was impossible to verify any element
        it("[PRPI-932] And the correct rewards page opened", async () => {
          await browser.waitUntil(
            async () => {
              const contexts = await driver.getContexts();
              return contexts.length > 1;
            },
            {
              timeout: 100000,
              timeoutMsg: "Get context is smaller than 2",
            },
          );
          const contexts = await driver.getContexts();

          expect(contexts.length).toBeGreaterThan(1);

          const webviewContext = contexts.find((context) => context.includes("WEBVIEW"));

          expect(webviewContext).toBeDefined();
        });
      });
    });
  });
});
