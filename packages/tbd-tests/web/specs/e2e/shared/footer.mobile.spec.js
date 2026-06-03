const { FooterPO } = require("../../../page-objects");
const { addLabel } = require("@wdio/allure-reporter");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const { loginWithSSOID } = require("../../../helpers/login.util");
const { Weaver } = require("../../../../utils/weaver");
const { getMyBetsViewUrl, getEventViewUrl, getHomeViewUrl, getBrowseViewUrl } = require("../../../../utils/routes");
const { openPage } = require("../../../helpers/navigation.util");

const footerPO = new FooterPO();
const weaver = new Weaver();

const shouldSkip = process.env.BASE_URL.includes("ie");

const swipeDownToFooter = async () => {
  await browser.waitUntil(
    async () => {
      await browser.execute("window.scrollBy(0, 600)");

      return (await footerPO.element.isDisplayedInViewport()) === true;
    },
    {
      timeout: 60000,
      timeoutMsg: "Footer was not displayed",
    },
  );
};

describe("Footer - E2E", () => {
  addLabel("jira", "CRBRS-67");

  beforeAll(async () => {
    await openPageAndAcceptCookieConsent();
  });

  describe("When user goes to Homepage", () => {
    beforeAll(async () => {
      await openPage(getHomeViewUrl());
      await swipeDownToFooter();
    });

    it("[PRPI-615] - footer sections should be displayed", async () => {
      expect(await footerPO.sections[0].isDisplayed()).toBe(true);
      expect(await footerPO.sections[1].isDisplayed()).toBe(true);
      expect(await footerPO.sections[2].isDisplayed()).toBe(true);
      expect(await footerPO.sections[3].isDisplayed()).toBe(true);
    });
  });

  describe("When user goes to Event page", () => {
    beforeAll(async () => {
      const eventData = await weaver.fetchSingleEventData();
      await openPage(getEventViewUrl(eventData.eventId));
      await swipeDownToFooter();
    });

    it("[PRPI-616] - footer sections should be displayed", async () => {
      expect(await footerPO.sections[0].isDisplayed()).toBe(true);
      expect(await footerPO.sections[1].isDisplayed()).toBe(true);
      expect(await footerPO.sections[2].isDisplayed()).toBe(true);
      expect(await footerPO.sections[3].isDisplayed()).toBe(true);
    });
  });

  describe("When user goes to Browse page", () => {
    beforeAll(async () => {
      await openPage(getBrowseViewUrl());
      await swipeDownToFooter();
    });

    it("[PRPI-617] - footer sections should be displayed", async () => {
      expect(await footerPO.sections[0].isDisplayed()).toBe(true);
      expect(await footerPO.sections[1].isDisplayed()).toBe(true);
      expect(await footerPO.sections[2].isDisplayed()).toBe(true);
      expect(await footerPO.sections[3].isDisplayed()).toBe(true);
    });
  });

  (shouldSkip ? xdescribe : describe)("When user goes to My Bets page", () => {
    beforeAll(async () => {
      await loginWithSSOID("gtaAccount");
      await openPage(getMyBetsViewUrl());
      await swipeDownToFooter();
    });

    it("[PRPI-618] - footer sections should be displayed", async () => {
      expect(await footerPO.sections[0].isDisplayed()).toBe(true);
      expect(await footerPO.sections[1].isDisplayed()).toBe(true);
      expect(await footerPO.sections[2].isDisplayed()).toBe(true);
      expect(await footerPO.sections[3].isDisplayed()).toBe(true);
    });
  });
});
