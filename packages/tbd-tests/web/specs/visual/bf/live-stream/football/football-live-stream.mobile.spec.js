const { BroadcastsPO, SupportingContentButtonPO, LiveStreamPO } = require("../../../../../page-objects");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getHtmlFilePuppeteer } = require("../../../../../mock-essentials/controllers/html/html-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const broadcastsPO = new BroadcastsPO();
const liveStreamPO = new LiveStreamPO();
const broadcastsSupportingContentPO = new SupportingContentButtonPO(broadcastsPO.element);
const iFrame = liveStreamPO.iframeElements[0];
const secondIframeContainer = liveStreamPO.iframeContainers[1];
const MODULE_NAME = "football_live_stream";
const EVENT_ID = "29465861";

const BFF_MOCK_WITH_BROADCASTS = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        sportevent: {
          urn: `ppb:event:${EVENT_ID}`,
        },
        fixture: {
          home: {
            name: "Ukraine",
          },
          away: {
            name: "Portugal",
          },
        },
      },
    },
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
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
      },
    },
    {
      node: {
        __typename: "BroadcastsCard",
        urn: `ppb:tbd:card:eventBroadcasts:${EVENT_ID}`,
      },
    },
  ],
};

const SCA_MOCK = {
  fixture: [
    {
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
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
const MOCKED_DATA_VIZ = $("#dataviz");

describe("Football - live stream", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getHtmlFilePuppeteer({ path: ".*livevideo.*", content: LIVE_VIDEO_MOCK, bodyStyle: "margin:0;" }),
    );
    await mockService.mockHttpRequest(
      getHtmlFilePuppeteer({ path: ".*dataviz.*", content: DATA_VIZ_MOCK, bodyStyle: "margin:0;" }),
    );
  });

  describe("When the user is on a football event and live video and data viz are available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_WITH_BROADCASTS.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_WITH_BROADCASTS));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(broadcastsPO.icon);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1634]_the_broadcasts_card_should_be_displayed_with_the_broadcasts_icon_and_label`,
      );
    });

    it("[PRPI-1634]_the_broadcasts_card_should_be_displayed_with_the_broadcasts_icon_and_label", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1634]_the_broadcasts_card_should_be_displayed_with_the_broadcasts_icon_and_label`,
        ),
      ).toEqual(0);
    });

    describe("When the user clicks on broadcasts accordion", () => {
      beforeAll(async () => {
        await broadcastsSupportingContentPO.element.waitForClickable();
        await broadcastsSupportingContentPO.element.click();
        await browser.waitUntilIframeReady(iFrame, MOCKED_LIVE_VIDEO);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1635]_the_live_video_should_be_displayed_on_the_first_slot_with_first_dot_selected`,
        );
      });

      it("[PRPI-1635]_the_live_video_should_be_displayed_on_the_first_slot_with_first_dot_selected", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1635]_the_live_video_should_be_displayed_on_the_first_slot_with_first_dot_selected`,
          ),
        ).toEqual(0);
      });

      describe("When the user swipes to the second element", () => {
        beforeAll(async () => {
          await secondIframeContainer.scrollIntoView();
          await browser.waitUntilIframeReady(iFrame, MOCKED_DATA_VIZ);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1636]_the_data_viz_should_be_displayed_on_the_second_slot_with_second_dot_selected`,
          );
        });

        it("[PRPI-1636]_the_data_viz_should_be_displayed_on_the_second_slot_with_second_dot_selected", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1636]_the_data_viz_should_be_displayed_on_the_second_slot_with_second_dot_selected`,
            ),
          ).toEqual(0);
        });
      });
    });
  });
});
