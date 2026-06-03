const { CookieConsentBannerPO } = require("../page-objects");
const { browser } = require("@wdio/globals");
const { getHomeViewUrl } = require("./../../utils/routes");
const { openPage } = require("./navigation.util");

/**
 * Scroll to a specific position on the page in desktop view.
 * @param {number} scrollHeight - The height to scroll to within the scrollable container.
 */
async function scrollToBottomDesktop(scrollHeight) {
  await browser.execute((height) => {
    const scrollableContainer = document.getElementById("scrollable-desktop-container");
    if (scrollableContainer) {
      scrollableContainer.scrollTo(0, height);
    } else {
      console.error("Scrollable container not found!");
    }
  }, scrollHeight);
}

/**
 * Scroll to the bottom of the page (or by a multiplier) in mobile view.
 * @param {number} multiplier - The multiplier for scroll height (default is 2).
 */
async function scrollToBottomMobile(multiplier = 2) {
  await browser.execute((mult) => {
    window.scrollTo(0, mult * document.body.scrollHeight);
  }, multiplier);
}

async function openPageAndAcceptCookieConsent(throttleOptions = {}, customExtraParams) {
  await openPage(getHomeViewUrl(throttleOptions, customExtraParams));
  const cookieBanner = new CookieConsentBannerPO();
  await cookieBanner.acceptAllCookies();
}

module.exports = {
  scrollToBottomDesktop,
  scrollToBottomMobile,
  openPageAndAcceptCookieConsent,
};
