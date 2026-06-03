const { addFeature } = require("@wdio/allure-reporter");
const { BottomBarPO, FooterPO, AppPO, QuickLinkPO } = require("../../../page-objects");
const { openPageAndAcceptCookieConsent, scrollToBottomDesktop } = require("../../../helpers/helper.util");

const bottomBarPO = new BottomBarPO();
const footerPO = new FooterPO();
const quickLinkPO = new QuickLinkPO();
const appPO = new AppPO();

describe("Verify Header & Footer - Desktop Orientation", () => {
  beforeAll(async () => {
    await openPageAndAcceptCookieConsent();
    await appPO.element.waitForDisplayed();
  });

  it("[PRPI-651] Left and Right side panes should be displayed", async () => {
    addFeature("SHARED TESTS");

    expect(await appPO.container.isDisplayed()).toBe(true, "right side pane is not displayed");
    expect(await appPO.scrollableDiv.isDisplayed()).toBe(true, "left side pane is not displayed");
  });

  it("[PRPI-652] Bottom bar with tiles (Home, Browse, etc.) should not be displayed", async () => {
    addFeature("SHARED TESTS");

    expect(await bottomBarPO.element.isDisplayed()).toBe(false, "bottom bar is displayed");
  });

  it("[PRPI-653] Desktop header is displayed", async () => {
    addFeature("SHARED TESTS");

    expect(await appPO.desktopHeader.isDisplayed()).toBe(true, "header is not displayed");
  });

  it("[PRPI-653] My Bets is displayed", async () => {
    addFeature("SHARED TESTS");

    expect((await quickLinkPO.myBets).isDisplayed());
  });

  it("[PRPI-654] Desktop Footer is displayed", async () => {
    addFeature("SHARED TESTS");
    await scrollToBottomDesktop(99999);
    await footerPO.element.waitForDisplayed({ timeoutMsg: "Footer was not displayed" });

    expect(await footerPO.element.isDisplayed()).toBe(true, "footer is not displayed");
  });
});
