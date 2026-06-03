const { BroadcastsPO, SupportingContentButtonPO, LiveStreamPO } = require("../../../../../page-objects");
const { getRaceLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getHtmlFilePuppeteer } = require("../../../../../mock-essentials/controllers/html/html-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const broadcastsPO = new BroadcastsPO();
const liveStreamPO = new LiveStreamPO();
const broadcastsSupportingContentPO = new SupportingContentButtonPO(broadcastsPO.element);
const liveStreamIframePO = liveStreamPO.iframeElements[0];

const mockService = new MockService();

const RACE_ID = "RACE_ID";
const MEETING_ID = "MEETING_ID";

const BFF_WITH_BROADCASTS = {
  urn: `ppb:tbd:view:sport:7`,
  title: "DUMMY TITLE",
  race: {
    __typename: "Race",
    urn: `ppb:race:${RACE_ID}`,
    startTime: "2020-11-13T14:40:00Z",
    name: "Aintree",
    meeting: {
      __typename: "Meeting",
      urn: `ppb:meeting:${MEETING_ID}`,
      name: "Wind 13th Jul",
      country: "GB",
      venue: "Aintree",
    },
  },
  edges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: `ppb:tbd:card:raceDetails:${RACE_ID}`,
        numberOfRunners: 9,
        race: {
          __typename: "Race",
          urn: `ppb:race:${RACE_ID}`,
          startTime: "2020-11-13T14:40:00Z",
          name: "Aintree",
          details: {
            going: "GOOD_FIRM",
            type: "FLAT",
          },
          runners: [],
          meeting: {
            __typename: "Meeting",
            urn: `ppb:meeting:${MEETING_ID}`,
            name: "Wind 13th Jul",
            country: "GB",
            venue: "Aintree",
          },
        },
      },
    },
    {
      node: {
        __typename: "BroadcastsCard",
        urn: `ppb:tbd:card:raceBroadcasts:${RACE_ID}`,
        isCollapsed: true,
        broadcasts: {
          dataVizUrl: null,
          liveVideoUrl: "https://dummy.com.betfair/livevideo",
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: `ppb:tbd:card:raceDetails:${RACE_ID}`,
      },
    },
    {
      node: {
        __typename: "BroadcastsCard",
        urn: `ppb:tbd:card:raceBroadcasts:${RACE_ID}`,
      },
    },
  ],
};

const LIVE_VIDEO_MOCK = `
  <div style="display: flex; align-items:center; justify-content: center; width: 100%; height: 100%; background: pink" id="livevideo">
    <span style="font-size: 30px">LIVE VIDEO</span>
  </div>
`;

const MOCKED_LIVE_VIDEO = $("#livevideo");

const MODULE_NAME = "racing_live_stream";

describe("Racing - live stream", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getHtmlFilePuppeteer({ path: ".*livevideo.*", content: LIVE_VIDEO_MOCK, bodyStyle: "margin:0;" }),
    );
  });

  describe("When the user is on a race event and the live video is available for that race", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_WITH_BROADCASTS.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getRaceLayout(BFF_WITH_BROADCASTS));
      await browser.url(routes.getRaceViewUrl("7", RACE_ID));
      await browser.waitUntilDisplayed(broadcastsPO.icon);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1632]_the_broadcasts_card_should_be_displayed_with_the_live_stream_icon_and_label`,
      );
    });

    it("[PRPI-1632]_the_broadcasts_card_should_be_displayed_with_the_live_stream_icon_and_label", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1632]_the_broadcasts_card_should_be_displayed_with_the_live_stream_icon_and_label`,
        ),
      ).toBe(0);
    });

    describe("When the user clicks on broadcasts collapse", () => {
      beforeAll(async () => {
        await broadcastsSupportingContentPO.element.waitForClickable();
        await broadcastsSupportingContentPO.element.click();
        await browser.waitUntilIframeReady(liveStreamIframePO, MOCKED_LIVE_VIDEO);
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1633]_the_live_stream_iframe_should_be_displayed`);
      });

      it("[PRPI-1633]_the_live_stream_iframe_should_be_displayed", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1633]_the_live_stream_iframe_should_be_displayed`)).toBe(
          0,
        );
      });
    });
  });
});
