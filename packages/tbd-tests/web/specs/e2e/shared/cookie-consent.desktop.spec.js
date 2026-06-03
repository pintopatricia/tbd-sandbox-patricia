const { browser } = require("@wdio/globals");
const { addFeature, addLabel } = require("@wdio/allure-reporter");
const { CookieConsentBannerPO } = require("../../../page-objects");
const { openPage } = require("../../../helpers/navigation.util");
const { clearCookies } = require("../../../helpers/cookie.util");
const { getHomeViewUrl } = require("../../../../utils/routes");

const baseUrl = process.env.BASE_URL;
const cookieConsentBannerPO = new CookieConsentBannerPO();

const shouldSkip = baseUrl.includes("ie");

(shouldSkip ? xdescribe : describe)("Cookie Consent Banner", () => {
  beforeAll(async () => {
    await openPage(baseUrl);
  });

  beforeEach(async () => {
    await clearCookies();
    await browser.refresh();
    // 2nd delete allows easier checking for when cookie is set
    await clearCookies();
  });

  it("[PRPI-622] Cookie consent banner should show when no cookies have been set", async () => {
    addFeature("SKYBET TESTS");
    addLabel("jira", "CRBRS-34");
    await cookieConsentBannerPO.bannerElement.waitForDisplayed();

    expect(await cookieConsentBannerPO.bannerElement.isDisplayed()).toBe(true, "Cookie consent banner is not visible");
  });

  it("[PRPI-623] Cookie consent banner does not show after being accepted and refreshing page", async () => {
    addFeature("SKYBET TESTS");
    addLabel("jira", "CRBRS-35");
    await cookieConsentBannerPO.acceptAllCookies();
    await openPage(getHomeViewUrl());

    expect(await cookieConsentBannerPO.bannerElement.isDisplayed()).toBe(
      false,
      "Cookie consent banner showing after page refresh",
    );
  });

  it("[PRPI-624] Accepting all cookies sets correct value in cookie and closes banner", async () => {
    addFeature("SKYBET TESTS");
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

  it("[PRPI-625] Rejecting all cookies sets correct value in cookie and closes banner", async () => {
    addFeature("SKYBET TESTS");
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
    // C0001 and BG638 are strictly necessary cookies and must always be active
    expect(consentCookie.value).toContain("groups=");
    expect(consentCookie.value).toContain("C0001%3A1");
    expect(consentCookie.value).toContain("C0002%3A0");
    expect(consentCookie.value).toContain("C0003%3A0");
    expect(consentCookie.value).toContain("C0004%3A0");
  });
});
