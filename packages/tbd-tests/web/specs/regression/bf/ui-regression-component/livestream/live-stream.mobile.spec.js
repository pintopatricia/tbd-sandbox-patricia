const { BroadcastsPO, SupportingContentButtonPO, LiveStreamPO, PaginationPO } = require("../../../../../page-objects");
const { getRaceLayout, getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getHtmlFilePuppeteer } = require("../../../../../mock-essentials/controllers/html/html-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const broadcastsPO = new BroadcastsPO();
const liveStreamPO = new LiveStreamPO();
const broadcastsSupportingContentPO = new SupportingContentButtonPO(broadcastsPO.element);
const iFramePO = liveStreamPO.iframeElements[0];
const firstIframeContainerPO = liveStreamPO.iframeContainers[0];
const secondIframeContainerPO = liveStreamPO.iframeContainers[1];
const paginationPO = new PaginationPO();

const RACE_ID = "30378014.1310";
const EVENT_ID = "29465861";

const BFF_RACING = {
  urn: `ppb:tbd:view:race:7|${RACE_ID}`,
  title: "DUMMY TITLE",
  race: {
    urn: `ppb:tbd:race:${RACE_ID}`,
    meeting: {
      urn: "30378014",
    },
  },
  edges: [
    {
      node: {
        __typename: "BroadcastsCard",
        urn: `ppb:tbd:card:raceBroadcasts:${RACE_ID}`,
        isCollapsed: true,
        broadcasts: {
          dataVizUrl: null,
          liveVideoUrl: "http://dummy.livevideo.com",
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "BroadcastsCard",
        urn: `ppb:tbd:card:raceBroadcasts:${RACE_ID}`,
      },
    },
  ],
};

const BASE_BFF_FOOTBALL_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
  },
};

const BFF_FOOTBALL_VIZ_MOCK = {
  ...BASE_BFF_FOOTBALL_MOCK,
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

  partialEdges: [
    {
      node: {
        __typename: "BroadcastsCard",
        urn: `ppb:tbd:card:eventBroadcasts:${EVENT_ID}`,
      },
    },
  ],
};

const BFF_FOOTBALL_LIVE_VIDEO_AND_VIZ_MOCK = {
  ...BASE_BFF_FOOTBALL_MOCK,
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

  partialEdges: [
    {
      node: {
        __typename: "BroadcastsCard",
        urn: `ppb:tbd:card:eventBroadcasts:${EVENT_ID}`,
      },
    },
  ],
};

const DATA_VIZ_MOCK = `
  <div style="display: flex; align-items:center; justify-content: center; width: 100%; height: 100%; background: pink">
    <span style="font-size: 30px">DATA VIZ</span>
  </div>
`;

const LIVE_VIDEO_MOCK = `
  <div style="display: flex; align-items:center; justify-content: center; width: 100%; height: 100%; background: cyan">
    <span style="font-size: 30px">LIVE VIDEO</span>
  </div>
`;

describe("Live stream", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getHtmlFilePuppeteer({ path: ".*dataviz.*", content: DATA_VIZ_MOCK }));
    await mockService.mockHttpRequest(getHtmlFilePuppeteer({ path: ".*livevideo.*", content: LIVE_VIDEO_MOCK }));
  });

  describe("When the user is on a race event and the live video is available for that race", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_RACING.urn));
      await mockService.mockHttpRequest(getRaceLayout(BFF_RACING));
      await browser.url(routes.getRaceViewUrl("7", RACE_ID));
      await browser.waitUntilDisplayed(broadcastsPO.icon);
    });

    it("[PRPI-4639] the broadcasts card should be displayed", async () => {
      expect(await broadcastsPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-6100] the live stream icon should be displayed", async () => {
      expect(await broadcastsPO.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-6101] the live stream title should display 'Live Video'", async () => {
      expect(await broadcastsPO.title.getText()).toBe("Live Video");
    });

    it("[PRPI-6102] the expand icon should be displayed", async () => {
      expect(await broadcastsSupportingContentPO.expandIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-6103] the live stream iframe should not be displayed", async () => {
      expect(await liveStreamPO.element.isExisting()).toBe(false);
    });

    describe("When the user clicks on broadcasts accordion", () => {
      beforeAll(async () => {
        await broadcastsSupportingContentPO.element.waitForClickable();
        await broadcastsSupportingContentPO.element.click();
        await browser.waitUntilDisplayed(iFramePO);
      });

      it("[PRPI-6104] the live stream iframe should be displayed", async () => {
        expect(await iFramePO.isDisplayed()).toBe(true);
      });

      it("[PRPI-6105] the pagination should not be displayed", async () => {
        expect(await paginationPO.element.isExisting()).toBe(false);
      });

      describe("When the user clicks on expand icon", () => {
        beforeAll(async () => {
          await broadcastsSupportingContentPO.expandIcon.waitForClickable();
          await broadcastsSupportingContentPO.expandIcon.click();
        });

        it("[PRPI-6106] the live stream iframe should not be displayed", async () => {
          expect(await liveStreamPO.element.isExisting()).toBe(false);
        });
      });
    });
  });

  describe("When the user is on a football event and only data viz is available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_FOOTBALL_VIZ_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_FOOTBALL_VIZ_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(broadcastsPO.icon);
    });

    it("[PRPI-6107] the broadcasts icon should be displayed", async () => {
      expect(await broadcastsPO.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-6108] the broadcasts title should display 'Match View'", async () => {
      expect(await broadcastsPO.title.getText()).toBe("Match View");
    });

    it("[PRPI-6109] the iframe should not be displayed", async () => {
      expect(await liveStreamPO.element.isExisting()).toBe(false);
    });

    describe("When the user clicks on broadcasts accordion", () => {
      beforeAll(async () => {
        await broadcastsSupportingContentPO.element.waitForClickable();
        await broadcastsSupportingContentPO.element.click();
        await browser.waitUntilDisplayed(iFramePO);
      });

      it("[PRPI-6110] the iframe should be displayed", async () => {
        expect(await iFramePO.isDisplayed()).toBe(true);
        expect(await iFramePO.getAttribute("title")).toBe("Betfair live data vizualisation");
      });

      it("[PRPI-6111] the pagination should not be displayed", async () => {
        expect(await paginationPO.element.isExisting()).toBe(false);
      });

      describe("When the user clicks on expand icon", () => {
        beforeAll(async () => {
          await broadcastsSupportingContentPO.expandIcon.waitForClickable();
          await broadcastsSupportingContentPO.expandIcon.click();
        });

        it("[PRPI-6112] the iframe should not be displayed", async () => {
          expect(await liveStreamPO.element.isExisting()).toBe(false);
        });
      });
    });
  });

  describe("When the user is on a football event and live video and data viz are available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_FOOTBALL_LIVE_VIDEO_AND_VIZ_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_FOOTBALL_LIVE_VIDEO_AND_VIZ_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(broadcastsPO.icon);
    });

    it("[PRPI-6113] the broadcasts icon should be displayed", async () => {
      expect(await broadcastsPO.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-6114] the broadcasts title should display 'Live Video'", async () => {
      expect(await broadcastsPO.title.getText()).toBe("Live Video");
    });

    it("[PRPI-6115] the pagination should not be displayed", async () => {
      expect(await paginationPO.element.isExisting()).toBe(false);
    });

    describe("When the user clicks on broadcasts accordion", () => {
      beforeAll(async () => {
        await broadcastsSupportingContentPO.element.waitForClickable();
        await broadcastsSupportingContentPO.element.click();
        await browser.waitUntilDisplayed(iFramePO);
      });

      it("[PRPI-6116] the broadcasts should have 1 loaded iframe", async () => {
        expect(await liveStreamPO.iframeElements.length).toBe(1);
      });

      it("[PRPI-4637] the live video should be displayed on the first slot", async () => {
        expect(await firstIframeContainerPO.isDisplayedInViewport()).toBe(true);
        expect(await iFramePO.isDisplayedInViewport()).toBe(true);
        expect(await iFramePO.getAttribute("title")).toBe("Betfair live video streaming");
      });

      it("[PRPI-6117] the pagination should be displayed", async () => {
        expect(await paginationPO.element.isDisplayed()).toBe(true);
      });

      describe("When the user swipes to the second element", () => {
        beforeAll(async () => {
          await secondIframeContainerPO.scrollIntoView();
          await browser.waitUntilDisplayed(iFramePO);
          await browser.waitUntilInViewport(iFramePO);
        });

        it("[PRPI-6118] the data viz should be displayed on the second slot", async () => {
          expect(await secondIframeContainerPO.isDisplayedInViewport()).toBe(true);
          expect(await iFramePO.isDisplayedInViewport()).toBe(true);
          expect(await iFramePO.getAttribute("title")).toBe("Betfair live data vizualisation");
        });

        it("[PRPI-6119] the pagination should be displayed", async () => {
          expect(await paginationPO.element.isDisplayed()).toBe(true);
        });

        describe("When the user clicks on expand icon", () => {
          beforeAll(async () => {
            await broadcastsSupportingContentPO.expandIcon.waitForClickable();
            await broadcastsSupportingContentPO.expandIcon.click();
          });

          it("[PRPI-6120] the iframe should not be displayed", async () => {
            expect(await liveStreamPO.element.isExisting()).toBe(false);
          });

          it("[PRPI-6121] the pagination should not be displayed", async () => {
            expect(await paginationPO.element.isDisplayed()).toBe(false);
          });
        });
      });
    });
  });
});
