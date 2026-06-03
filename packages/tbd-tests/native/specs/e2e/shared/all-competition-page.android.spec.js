const QuickLinksCardSO = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.native.so");
const {
  GenericViewSO,
  QuickLinkSO,
  SelectorSO,
  PageHeaderSO,
  HeaderSO,
  GenericSwitcherCardSO,
} = require("../../../screen-objects");

const { startApp, openDeeplink } = require("../../../helpers/urls");
const { login } = require("../../../helpers/login");

const headerSO = new HeaderSO();
const pageHeaderSO = new PageHeaderSO();
const genericViewSO = new GenericViewSO();
const quickLinksCardSO = new QuickLinksCardSO(genericViewSO.items[0]);
const quickLinkSO = new QuickLinkSO(quickLinksCardSO.links[0]);
const selectorSO = new SelectorSO();
const genericSwitcherCardSO = new GenericSwitcherCardSO();

let competitionText;
const competitionsTitle = process.env.BRAND === "sbg" ? "ALL COMPETITIONS" : "All Competitions";

describe("All competitions page", () => {
  beforeAll(async () => {
    await startApp("home");
    await login("gtaAccount");
    await openDeeplink("/football/ac-1");
    await browser.waitUntilDisplayed(pageHeaderSO.element, "All Competition Title is not displayed");
    await browser.waitUntilEquals(pageHeaderSO.pageHeaderTitle, competitionsTitle);
  });

  describe("When I click on first competition link", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(quickLinksCardSO.links[0], "First link is not clickable");
      competitionText = await quickLinkSO.label.getText();
      await quickLinksCardSO.links[0].click();
      await browser.waitUntilDisplayed(selectorSO.title, "Does not exist");
    });

    it("[PRPI-1015] Then competition page is shown", async () => {
      expect(await genericSwitcherCardSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-1016] The competition shown is the same selected before on All Competition page", async () => {
      expect((await selectorSO.title.getText()).toLowerCase()).toBe(competitionText.toLowerCase());
    });

    describe("and when I tap the back button", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(headerSO.backButton, "Back Button is not clickable");
        await headerSO.backButton.click();
        await browser.waitUntilDisplayed(quickLinksCardSO.links[0]);
        await browser.waitUntilEquals(pageHeaderSO.pageHeaderTitle, competitionsTitle);
      });

      it("[PRPI-1017] Then I should see that 'All Competitions' title page is displayed again", async () => {
        expect(await pageHeaderSO.pageHeaderTitle.getText()).toBe(competitionsTitle);
      });
    });
  });
});
