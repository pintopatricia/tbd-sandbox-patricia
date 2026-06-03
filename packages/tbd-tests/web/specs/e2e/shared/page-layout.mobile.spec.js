const { browser } = require("@wdio/globals");
const { addFeature } = require("@wdio/allure-reporter");
const { BottomBarPO, FooterPO, HeaderPO, AppPO } = require("../../../page-objects");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");

const headerPO = new HeaderPO();
const bottomBarPO = new BottomBarPO();
const footerPO = new FooterPO();
const appPO = new AppPO();

describe("Verify Mobile Header & Footer - Mobile Orientation", () => {
  beforeAll(async () => {
    await openPageAndAcceptCookieConsent();
  });

  it("[PRPI-655] bottom bar with the tiles- home , browse etc should be displayed", async () => {
    addFeature("SHARED TESTS");
    const browseTile = await bottomBarPO.browseTile;

    expect(await browseTile.isDisplayed()).toBe(true, "bottom bar is not displayed");
  });

  it("[PRPI-656] Mobile header is displayed for the website", async () => {
    addFeature("SHARED TESTS");
    await headerPO.element.waitForDisplayed();

    expect(await headerPO.element.isDisplayed()).toBe(true, "header is not displayed");
  });

  it("[PRPI-657] Mobile footer is displayed for the website", async () => {
    addFeature("SHARED TESTS");
    await browser.waitUntil(
      async () => {
        await browser.execute("window.scrollBy(0, 300)");

        return (await footerPO.element.isDisplayed()) === true;
      },
      { timeoutMsg: "Footer was not displayed" },
    );

    expect(await footerPO.element.isDisplayed()).toBe(true, "footer is not displayed");
  });

  it("[PRPI-658] Left and Right side panes should not be displayed", async () => {
    addFeature("SHARED TESTS");

    expect(await appPO.container.isExisting()).toBe(false, "right side pane is displayed");
    expect(await appPO.scrollableDiv.isExisting()).toBe(false, "left side pane is displayed");
  });
});
