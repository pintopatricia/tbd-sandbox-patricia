 
const { BasePO } = require("@ppb/wdio-lazy-element");

const BANNER_ROOT = "#onetrust-consent-sdk";
const BANNER_ELEMENT = "#onetrust-banner-sdk";
const ACCEPT_BUTTON = "#onetrust-accept-btn-handler";
const COOKIES_SETTINGS = "#onetrust-pc-btn-handler";
const REJECT_ALL_BUTTON = ".ot-pc-refuse-all-handler";
const SBG_REJECT_ALL_BUTTON = "#onetrust-reject-all-handler";

class CookieConsentBannerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(BANNER_ROOT));
  }

  get bannerElement() {
    return this.element.$(BANNER_ELEMENT);
  }

  get acceptButton() {
    return this.element.$(ACCEPT_BUTTON);
  }

  get cookieSettingsButton() {
    return this.element.$(COOKIES_SETTINGS);
  }

  get rejectAllButton() {
    return this.element.$(REJECT_ALL_BUTTON);
  }

  get sbgRejectAllButton() {
    return this.element.$(SBG_REJECT_ALL_BUTTON);
  }

  async acceptCookieConsent() {
    await browser.waitUntil(
       
      async () => (await this.element.isDisplayed()) && (await this.bannerElement.isDisplayed()),
      {
        timeout: 5000,
        timeoutMsg: "Cookie banner was not displayed",
      },
    );
    await this.acceptButton.waitForClickable();
    await this.acceptButton.click();
    await this.acceptButton.waitForDisplayed({ reverse: true, timeout: 5000 });
  }

  async acceptAllCookies() {
    await browser.waitUntil(
      async () => {
        try {
          await this.acceptCookieConsent();
        } catch (e) {
          if (e.message.includes("Cookie banner was not displayed")) {
             
            console.warn("❗ Cookie banner not found, skipping dismiss.");
            return true;
          }
          return false;
        }
        return true;
      },
      {
        timeout: 10000,
        timeoutMsg: "Cookie banner not able to accept cookies within timeout",
      },
    );
  }

  async rejectAllCookies() {
    await this.bannerElement.waitForDisplayed();
    if (await this.sbgRejectAllButton.isDisplayed()) {
      await this.sbgRejectAllButton.click();
      await this.bannerElement.waitForDisplayed({ reverse: true, timeout: 5000 });
    } else {
      await this.cookieSettingsButton.waitForClickable();
      await this.cookieSettingsButton.click();
      await this.rejectAllButton.waitForClickable();
      await this.rejectAllButton.click();
      await this.bannerElement.waitForDisplayed({ reverse: true, timeout: 5000 });
    }
  }
}

module.exports = CookieConsentBannerPO;
