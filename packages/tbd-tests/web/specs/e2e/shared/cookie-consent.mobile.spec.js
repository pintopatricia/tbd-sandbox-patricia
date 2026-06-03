const { browser } = require("@wdio/globals");
const { addFeature, addLabel } = require("@wdio/allure-reporter");
const { CookieConsentBannerPO } = require("../../../page-objects");
const { getHomeViewUrl } = require("../../../../utils/routes");
const { clearCookies } = require("../../../helpers/cookie.util");
const { openPage } = require("../../../helpers/navigation.util");

const cookieConsentBannerPO = new CookieConsentBannerPO();

const shouldSkip = process.env.BASE_URL.includes("ie") || process.env.BASE_URL.includes("qa");

(shouldSkip ? xdescribe : describe)("Cookie Consent Banner", () => {
  beforeAll(async () => {
    await openPage(getHomeViewUrl());
  });

  beforeEach(async () => {
    await clearCookies();
    await browser.refresh();
    // 2nd delete allows easier checking for when cookie is set
    await clearCookies();
  });

  it("[PRPI-626] Cookie consent banner should show when no cookies have been set", async () => {
    addLabel("jira", "CRBRS-34");
    addFeature("BETFAIR TESTS");
    await cookieConsentBannerPO.bannerElement.waitForDisplayed();

    expect(await cookieConsentBannerPO.bannerElement.isDisplayed()).toBe(true, "Cookie consent banner is not visible");
  });

  it("[PRPI-627] Cookie consent banner does not show after being accepted and refreshing page", async () => {
    addFeature("BETFAIR TESTS");
    addLabel("jira", "CRBRS-35");
    await cookieConsentBannerPO.acceptAllCookies();
    await browser.refresh();

    expect(await cookieConsentBannerPO.bannerElement.isDisplayed()).toBe(
      false,
      "Cookie consent banner showing after page refresh",
    );
  });

  it("[PRPI-628] Accepting all cookies sets correct value in cookie and closes banner", async () => {
    addFeature("BETFAIR TESTS");
    await cookieConsentBannerPO.acceptAllCookies();
    let consentCookie;
    await browser.waitUntil(
      async () => {
        const cookies = await browser.getCookies();
        consentCookie = cookies.find((cookie) => cookie.name === "OptanonConsent");
        return consentCookie !== undefined;
      },
      { timeoutMsg: "Consent cookie was not set after click accept on banner" },
    );

    // Groups C0001, C0002 etc refer to cookie types, 1 means active
    expect(consentCookie.value).toContain("groups=");
    expect(consentCookie.value).toContain("C0001%3A1");
    expect(consentCookie.value).toContain("C0002%3A1");
    expect(consentCookie.value).toContain("C0003%3A1");
    expect(consentCookie.value).toContain("C0004%3A1");
  });

  it("[PRPI-629] Rejecting all cookies sets correct value in cookie and closes banner", async () => {
    addFeature("BETFAIR TESTS");
    await cookieConsentBannerPO.rejectAllCookies();
    let consentCookie;
    await browser.waitUntil(
      async () => {
        const cookies = await browser.getCookies();
        consentCookie = cookies.find((cookie) => cookie.name === "OptanonConsent");
        return consentCookie !== undefined;
      },
      { timeoutMsg: "Consent cookie was not set after click reject on banner" },
    );

    // Groups C0001, C0002 etc refer to cookie types, 0 means inactive
    // C0001 are strictly necessary cookies and must always be active
    expect(consentCookie.value).toContain("groups=");
    expect(consentCookie.value).toContain("C0001%3A1");
    expect(consentCookie.value).toContain("C0002%3A0");
    expect(consentCookie.value).toContain("C0003%3A0");
    expect(consentCookie.value).toContain("C0004%3A0");
  });
});
