const BroadcastsCardSO = require("@ppb/tbd-shared/components/BroadcastsCard/BroadcastsCard.so");
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const { LiveStreamSO, SupportingContentButtonSO, PaginationSO } = require("../../../../screen-objects");

const mockService = new MockService(driver.capabilities.deviceName);

const broadcastsCardSO = new BroadcastsCardSO();
const liveStreamSO = new LiveStreamSO();
const broadcastsSupportingContentSO = new SupportingContentButtonSO(broadcastsCardSO.element);
const firstIframeSO = liveStreamSO.webviews[0];
let secondIframeSO = liveStreamSO.webviews[1];
const paginationSO = new PaginationSO();

const EVENT_ID = "29682729";

const BASE_BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
  },
  partialEdges: [
    {
      node: {
        __typename: "BroadcastsCard",
        urn: `ppb:tbd:card:eventBroadcasts:${EVENT_ID}`,
      },
    },
  ],
};

const BFF_LIVE_VIDEO = {
  ...BASE_BFF_MOCK,
  edges: [
    {
      node: {
        __typename: "BroadcastsCard",
        urn: `ppb:tbd:card:eventBroadcasts:${EVENT_ID}`,
        isCollapsed: true,
        broadcasts: {
          dataVizUrl: null,
          liveVideoUrl: "https://dummy.livevideo.com",
        },
      },
    },
  ],
};

const BFF_VIZ_MOCK = {
  ...BASE_BFF_MOCK,
  edges: [
    {
      node: {
        __typename: "BroadcastsCard",
        urn: `ppb:tbd:card:eventBroadcasts:${EVENT_ID}`,
        isCollapsed: true,
        broadcasts: {
          dataVizUrl: "https://dummy.dataviz.com",
          liveVideoUrl: null,
        },
      },
    },
  ],
};

const BFF_LIVE_VIDEO_AND_VIZ_MOCK = {
  ...BASE_BFF_MOCK,
  edges: [
    {
      node: {
        __typename: "BroadcastsCard",
        urn: `ppb:tbd:card:eventBroadcasts:${EVENT_ID}`,
        isCollapsed: true,
        broadcasts: {
          dataVizUrl: "https://dummy.dataviz.com",
          liveVideoUrl: "https://dummy.livevideo.com",
        },
      },
    },
  ],
};

describe("Broadcasts Card - Live Stream", () => {
  describe("When the user is in a view and the live video is available on broadcasts card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_LIVE_VIDEO));
      const url = `sport/competition/event/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });
      await browser.waitUntilEquals(broadcastsCardSO.title, "Live Video");
    });

    it("[PRPI-1882] the broadcasts card should be displayed", async () => {
      expect(await broadcastsCardSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-1883] the live stream icon should be displayed", async () => {
      expect(await broadcastsCardSO.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-1884] the live stream title should display 'Live Video'", async () => {
      expect(await broadcastsCardSO.title.getText()).toBe("Live Video");
    });

    it("[PRPI-1885] the collapsed chevron should be displayed", async () => {
      expect(await broadcastsSupportingContentSO.chevronCollapsed.isDisplayed()).toBe(true);
    });

    it("[PRPI-1886] the live stream iframe should not be displayed", async () => {
      expect(await liveStreamSO.element.isExisting()).toBe(false);
    });

    describe("When the user clicks on broadcasts accordion", () => {
      beforeAll(async () => {
        await broadcastsSupportingContentSO.chevronCollapsed.click();
        await browser.waitUntilDisplayed(firstIframeSO);
      });

      it("[PRPI-1887] the chevron should be expanded", async () => {
        expect(await broadcastsSupportingContentSO.chevronExpanded.isDisplayed()).toBe(true);
      });

      it("[PRPI-1888] the live stream iframe should be displayed", async () => {
        expect(await liveStreamSO.webviews.length).toBe(1);
        expect(await firstIframeSO.isDisplayed()).toBe(true);
      });

      it("[PRPI-1889] the pagination should not be displayed", async () => {
        expect(await paginationSO.element.isExisting()).toBe(false);
      });
    });
  });

  describe("When the user is in a view and only data viz is available on broadcasts card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_VIZ_MOCK));
      await swipeDownElementFullscreen(broadcastsSupportingContentSO.chevronExpanded);
      await browser.waitUntilEquals(broadcastsCardSO.title, "Match View");
    });

    it("[PRPI-1890] the broadcasts icon should be displayed", async () => {
      expect(await broadcastsCardSO.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-1891] the broadcasts title should display 'Match View'", async () => {
      expect(await broadcastsCardSO.title.getText()).toBe("Match View");
    });

    it("[PRPI-1892] the live stream iframe should not be displayed", async () => {
      expect(await liveStreamSO.element.isExisting()).toBe(false);
    });

    describe("When the user clicks on broadcasts accordion", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(broadcastsSupportingContentSO.chevronCollapsed);
        await broadcastsSupportingContentSO.chevronCollapsed.click();
        await browser.waitUntilDisplayed(firstIframeSO);
      });

      it("[PRPI-1893] the live stream iframe should be displayed", async () => {
        expect(await liveStreamSO.webviews.length).toBe(1);
        expect(await firstIframeSO.isDisplayed()).toBe(true);
      });

      it("[PRPI-1894] the pagination should not be displayed", async () => {
        expect(await paginationSO.element.isExisting()).toBe(false);
      });
    });
  });

  describe("When the user is in a view and live video and data viz are available on broadcasts card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_LIVE_VIDEO_AND_VIZ_MOCK));
      await swipeDownElementFullscreen(broadcastsSupportingContentSO.chevronExpanded);
      await browser.waitUntilEquals(broadcastsCardSO.title, "Live Video");
    });

    it("[PRPI-1895] the broadcasts icon should be displayed", async () => {
      expect(await broadcastsCardSO.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-1896] the broadcasts title should display 'Live Video'", async () => {
      expect(await broadcastsCardSO.title.getText()).toBe("Live Video");
    });

    describe("When the user clicks on broadcasts accordion", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(broadcastsSupportingContentSO.chevronCollapsed);
        await broadcastsSupportingContentSO.chevronCollapsed.click();
        await browser.waitUntilDisplayed(firstIframeSO);
      });

      it("[PRPI-1897] the broadcasts should have 2 live stream iframes", async () => {
        /* It is supposed for the broadcasts to render 2 live stream iframes and the second one should not be visible.
        However in Android testing, it only counts for the ones visible in viewport which in this case is 1 live
        stream iframe. */
        if (driver.isAndroid) {
          expect(await liveStreamSO.webviews.length).toBe(1);
        }
        if (driver.isIOS) {
          expect(await liveStreamSO.webviews.length).toBe(2);
        }
      });

      it("[PRPI-1898] the 1st iframe should be displayed on the first slot and the 2nd should not be visible", async () => {
        expect(await firstIframeSO.isDisplayed()).toBe(true);
        if (driver.isIOS) {
          expect(await secondIframeSO.isDisplayed()).toBe(false);
        }
      });

      it("[PRPI-1899] the pagination should be displayed with two dots", async () => {
        expect(await paginationSO.dots.length).toBe(2);
      });

      describe("When the user swipes to the second iframe", () => {
        let numberOfLiveStreamCards;
        beforeAll(async () => {
          await liveStreamSO.webviews[1].click();

          numberOfLiveStreamCards = await liveStreamSO.webviews.length;
          secondIframeSO = liveStreamSO.webviews[numberOfLiveStreamCards - 1];

          await browser.waitUntilDisplayed(secondIframeSO);
        });

        it("[PRPI-1900] the 2nd iframe should be displayed on the second slot and the 1st should not be visible", async () => {
          expect(await secondIframeSO.isDisplayed()).toBe(true);
          if (driver.isIOS) {
            expect(await firstIframeSO.isDisplayed()).toBe(false);
          }
        });

        it("[PRPI-1901] the pagination should be displayed with two dots", async () => {
          expect(await paginationSO.dots.length).toBe(2);
        });

        describe("When the user clicks on expanded chevron", () => {
          beforeAll(async () => {
            await browser.waitUntilDisplayed(broadcastsSupportingContentSO.chevronExpanded);
            await broadcastsSupportingContentSO.chevronExpanded.click();
            await browser.waitUntilDisplayed(broadcastsSupportingContentSO.chevronCollapsed);
          });

          it("[PRPI-1902] the live stream iframes should not be displayed", async () => {
            expect(await liveStreamSO.element.isExisting()).toBe(false);
          });

          it("[PRPI-1902] the pagination should not be displayed", async () => {
            expect(await paginationSO.element.isDisplayed()).toBe(false);
          });
        });
      });
    });
  });
});
