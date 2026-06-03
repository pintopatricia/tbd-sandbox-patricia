const { BaseSO } = require("@ppb/wdio-lazy-element");

const ALLOW_ALL_BUTTON_SELECTOR = driver.isIOS
  ? `//*[@label="Allow All Cookies"]`
  : `//*[contains(@resource-id, "id/btn_accept_cookies")]`;
class AcceptAllCookiesSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`${ALLOW_ALL_BUTTON_SELECTOR}`));
  }

  async dismissCookieBanner() {
    await browser.waitUntilDisplayed(this.element, "Cookie banner is not displayed");
    await this.element.click();
    await browser.waitUntilNotDisplayed(
      this.element,
      "Cookie banner is still displayed after clicking the accept button",
    );
  }
}

module.exports = AcceptAllCookiesSO;
