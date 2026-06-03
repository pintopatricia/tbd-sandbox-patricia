const {
  BroadcastsPO,
  GenericPagePO,
  ScrollableSwimlanePO,
  SupportingContentButtonPO,
  LiveStreamPO,
  PaginationPO,
} = require("../../../../page-objects");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");
const { getHtmlFilePuppeteer } = require("../../../../mock-essentials/controllers/html/html-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getHomeViewUrl } = require("../../../../../utils/routes");

const MODULE_NAME = "live_stream";
const genericPagePO = new GenericPagePO();
const scrollableSwimlanePO = new ScrollableSwimlanePO(genericPagePO.scrollableSwimlanes[0]);
const broadcastsPO = new BroadcastsPO();
const liveStreamPO = new LiveStreamPO();
const iFrame = liveStreamPO.iframeElements[0];
const secondIframeContainer = liveStreamPO.iframeContainers[1];
const broadcastsSupportingContentPO = new SupportingContentButtonPO(broadcastsPO.element);
const mockService = new MockService();
const EVENT_ID = "1";
const paginationPO = new PaginationPO();
const dotsContainer = paginationPO.dots[0];

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        __typename: "BroadcastsCard",
        urn: `ppb:tbd:card:eventBroadcasts:${EVENT_ID}`,
        isCollapsed: true,
        broadcasts: {
          dataVizUrl: "https://dummy.com.betfair/dataviz",
          liveVideoUrl: "https://dummy.com.betfair/livevideo",
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

const LIVE_VIDEO_MOCK = `
  <div style="display: flex; align-items:center; justify-content: center; width: 100%; height: 100%; background: pink" id="livevideo">
    <span style="font-size: 30px">LIVE VIDEO</span>
  </div>
`;

const DATA_VIZ_MOCK = `
  <div style="display: flex; align-items:center; justify-content: center; width: 100%; height: 100%; background: cyan" id="dataviz">
    <span style="font-size: 30px">DATA VIZ</span>
  </div>
`;

const MOCKED_LIVE_VIDEO = $("#livevideo");

describe("Live Stream", () => {
  describe("When BFF returns broadcasts card", () => {
    beforeAll(async () => {
      const url = getHomeViewUrl();

      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK, { withBottomBar: false }));
      await mockService.mockHttpRequest(getSSCHeaderCSS());
      await mockService.mockHttpRequest(getSSCv1Content());
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(
        getHtmlFilePuppeteer({ path: ".*livevideo.*", content: LIVE_VIDEO_MOCK, bodyStyle: "margin:0;" }),
      );
      await mockService.mockHttpRequest(
        getHtmlFilePuppeteer({ path: ".*dataviz.*", content: DATA_VIZ_MOCK, bodyStyle: "margin:0;" }),
      );

      await browser.url(url);
      await browser.waitUntilDisplayed(broadcastsPO.icon);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1391]_the_broadcasts_card_should_be_displayed`);
    });

    it("[PRPI-1391]_the_broadcasts_card_should_be_displayed", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1391]_the_broadcasts_card_should_be_displayed`)).toBe(0);
    });
  });

  describe("and the user clicks on broadcasts accordion", () => {
    beforeAll(async () => {
      await broadcastsSupportingContentPO.element.waitForClickable();
      await broadcastsSupportingContentPO.element.click();
      await browser.waitUntilIframeReady(iFrame, MOCKED_LIVE_VIDEO);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1392]_the_live_video_should_be_displayed`);
    });

    it("[PRPI-1392]_the_live_video_should_be_displayed", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1392]_the_live_video_should_be_displayed`)).toBe(0);
    });
  });

  describe("and the user hovers the livestream component", () => {
    beforeAll(async () => {
      await dotsContainer.moveTo();
      await browser.waitUntilDisplayed(scrollableSwimlanePO.arrowRight, "Arrow not displayed");
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1393]_the_arrow_right_should_be_displayed`);
    });

    it("[PRPI-1393]_the_arrow_right_should_be_displayed", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1393]_the_arrow_right_should_be_displayed`)).toBe(0);
    });
  });

  describe("and the user clicks on the right arrow", () => {
    beforeAll(async () => {
      await dotsContainer.moveTo();
      await scrollableSwimlanePO.arrowRight.waitForClickable();
      await scrollableSwimlanePO.arrowRight.click();
      await browser.waitUntilInViewport(secondIframeContainer);
      await browser.waitUntilNotDisplayed(scrollableSwimlanePO.arrowRight);
    });

    it("[PRPI-1394]_the_data_viz_and_left_arrow_should_be_displayed", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1394]_the_data_viz_and_left_arrow_should_be_displayed`),
      ).toBe(0);
    });
  });
});
