const { browser } = require("@wdio/globals");
const { addFeature } = require("@wdio/allure-reporter");
const { LanguageDropdownPO, AppPO } = require("../../../page-objects");
const { extractJsonData } = require("../../../../utils/extractJsonData");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const { loginWithSSOID } = require("../../../helpers/login.util");

const languageDropdown = new LanguageDropdownPO();
const baseUrl = process.env.BASE_URL;
const brand = process.env.BRAND;
const appPO = new AppPO();

const languageData = extractJsonData(`../../../packages/tbd-tests/web/specs/e2e/${brand}/config/languages.json`);

if (!languageData || !languageData.languages) {
  throw new Error("Failed to load languages.json. Check the file path and format.");
}

// skip this test for environments where multiple languages are not working
const shouldSkip = baseUrl.includes("qa") || baseUrl.includes("nxt") || languageData.languages.length === 0;
if (!shouldSkip) {
  describe("Verify multiple languages on the website", () => {
    beforeAll(async () => {
      await openPageAndAcceptCookieConsent();
      await loginWithSSOID("gtaMultiLanguage");
      await appPO.element.waitForDisplayed({
        timeoutMsg: "App was not displayed",
        timeout: 30000,
      });
    });

    languageData.languages.forEach(async ({ code, name, expectedUrl, sportsBook, testKey }) => {
      it(`[${testKey}] should change to ${name} once it is selected`, async () => {
        addFeature("SHARED TESTS");
        await languageDropdown.selectLanguageByName(code);

        const expectedNewUrl = `${baseUrl.split(".com/")[0]}.com${expectedUrl}`;

        await browser.waitUntil(async () => (await browser.getUrl()) === expectedNewUrl, {
          timeoutMsg: `URL ${await browser.getUrl()} did not change to expected: ${expectedNewUrl}`,
          timeout: 10000,
        });

        const sportsBookTitle = await languageDropdown.sportsBook.getAttribute("title");
        expect(await sportsBookTitle).toContain(
          sportsBook,
          `Sportsbook title did not change to: ${sportsBook} after selecting ${name}`,
        );
      });
    });
  });
}
