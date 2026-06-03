const { addFeature } = require("@wdio/allure-reporter");
const {
  HeaderPO,
  UserProfilePO,
  UserProfileHeaderPO,
  SectionElementsPO,
  RadioListPO,
  CookieConsentBannerPO,
  SportsbookBetButtonPO,
} = require("../../../page-objects");
const { extractJsonData } = require("../../../../utils/extractJsonData");
const { loginWithSSOID } = require("../../../helpers/login.util");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const { Weaver } = require("../../../../utils/weaver");
const { openPage } = require("../../../helpers/navigation.util");
const { getEventViewUrl } = require("../../../../utils/routes");

const userProfilePO = new UserProfilePO();
const headerPO = new HeaderPO();
const userProfileHeaderPO = new UserProfileHeaderPO();
const radioListPO = new RadioListPO();
const cookieBanner = new CookieConsentBannerPO();
const betButtonPO = new SportsbookBetButtonPO();
const brand = process.env.BRAND;
const pricepref = extractJsonData(`../../../packages/tbd-tests/web/specs/e2e/${brand}/config/settings.json`);
const weaver = new Weaver();

let fbEvent;
if (!pricepref || !pricepref.settings || !pricepref.settingsPosition) {
  throw new Error("Failed to load settings.json. Check the file path and format.");
}
const accountDetailsLinksSection = new SectionElementsPO(userProfilePO.groupSections[pricepref.settingsPosition]);
const settingsAndDetailsQuicklink = new SectionElementsPO(accountDetailsLinksSection.links[1]);

const baseUrl = process.env.BASE_URL;
const shouldSkip = baseUrl.includes("ie");

(shouldSkip ? xdescribe : describe)("Verify Price Format Settings - Mobile Orientation", () => {
  describe("when the user is logged in ", () => {
    beforeAll(async () => {
      fbEvent = await weaver.fetchSingleEventData({ eventTypeId: 1 });
    });
    beforeEach(async () => {
      addFeature("SHARED TESTS");
      // Reset the state of the browser before each run
      await openPageAndAcceptCookieConsent();
      await browser.execute("window.localStorage.clear()");
      await loginWithSSOID("gtaTestAccount");
      await browser.waitUntilDisplayed(headerPO.balanceIcon, { timeoutMsg: "Balance icon was not displayed" });
    });

    pricepref.settings.forEach(async ({ index, name, regex, testKey }) => {
      it(`[${testKey}] should update to price format ${name} once it is selected`, async () => {
        addFeature("SHARED TESTS");
        await headerPO.balanceIcon.click();
        await browser.waitUntilDisplayed(userProfileHeaderPO.element, "User profile header was not displayed");
        await browser.waitUntilDisplayed(accountDetailsLinksSection.title, "Settings & Details was not displayed");
        await cookieBanner.acceptAllCookies();
        await accountDetailsLinksSection.title.scrollIntoView();
        await settingsAndDetailsQuicklink.element.waitForDisplayed({
          timeout: 5000,
          timeoutMsg: "Settings and Details was not displayed",
        });
        await settingsAndDetailsQuicklink.element.click();
        await cookieBanner.acceptAllCookies();
        expect(await radioListPO.itemText[index].getText()).toBe(name);
        await radioListPO.itemInput[index].waitForDisplayed({
          timeout: 5000,
          timeoutMsg: "Format list was not displayed",
        });
        expect(await radioListPO.itemInput[index].click());
        await userProfileHeaderPO.closeButton.click();
        await openPage(getEventViewUrl(fbEvent.eventId));
        await betButtonPO.element.waitForDisplayed();
        await browser.waitUntilStopsMoving(betButtonPO.element);
        const finalText = await betButtonPO.odd.getText();
        expect(finalText).toMatch(regex);
      });
    });
  });
});
