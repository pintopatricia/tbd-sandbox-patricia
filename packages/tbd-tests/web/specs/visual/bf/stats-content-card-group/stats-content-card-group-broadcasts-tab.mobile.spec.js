const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const StatsContentCardGroupPO = require("@ppb/tbd-shared/components/StatsContentCardGroup/view/StatsContentCardGroup.po");
const { LiveStreamPO } = require("../../../../page-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const routes = require("../../../../../utils/routes");
const { getHtmlFilePuppeteer } = require("../../../../mock-essentials/controllers/html/html-controller");

const MODULE_NAME = "stats_content_card_group";
const mockService = new MockService();

const liveStreamPO = new LiveStreamPO();
const statsContentCardGroupPO = new StatsContentCardGroupPO();
const iFrame = liveStreamPO.iframeElements[0];

const LIVE_VIDEO_MOCK = `
  <div style="display: flex; align-items:center; justify-content: center; width: 100%; height: 100%; background: pink" id="livevideo">
    <span style="font-size: 30px">LIVE VIDEO</span>
  </div>
`;
const DATA_VIZ_MOCK = `
  <div style="display: flex; align-items:center; justify-content: center; width: 100%; height: 100%; background: cyan" id="dataviz">
    <span style="font-size: 30px">PITCH VIZ</span>
  </div>
`;

const MOCKED_LIVE_VIDEO = $("#livevideo");
const MOCKED_DATA_VIZ = $("#dataviz");

const EVENT_ID = "1";

const BFF_MOCK_EVENT_VIEW = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "StatsContentCardGroup",
        urn: `ppb:tbd:stats:cardgroup:statsContent:Zo_esxAAACIAftCe/e/${EVENT_ID}`,
        partials: {
          edges: [
            {
              displayName: {
                translationKey: "Live Video",
                __typename: "DisplayNameTranslationKey",
              },
              type: "LIVE_VIDEO",
              node: {
                urn: `ppb:tbd:stats:card:broadcasts:${EVENT_ID}|livevideo`,
                __typename: "StatsBroadcastsCard",
              },
              __typename: "StatsBroadcastsItemEdge",
            },
            {
              displayName: {
                translationKey: "Pitch",
                __typename: "DisplayNameTranslationKey",
              },
              type: "PITCH",
              node: {
                urn: `ppb:tbd:stats:card:broadcasts:${EVENT_ID}|dataviz`,
                __typename: "StatsBroadcastsCard",
              },
              __typename: "StatsBroadcastsItemEdge",
            },
          ],

          __typename: "StatsContentItemsConnection",
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "StatsContentCardGroup",
        urn: `ppb:tbd:stats:cardgroup:statsContent:Zo_esxAAACIAftCe/e/${EVENT_ID}`,
      },
    },
  ],
};

const BFF_MOCK_CARDS_WITH_LIVE_VIDEO = {
  cards: [
    {
      __typename: "StatsBroadcastsCard",
      urn: `ppb:tbd:stats:card:broadcasts:${EVENT_ID}|livevideo`,
      broadcasts: {
        liveVideoUrl: "https://dummy.com.betfair/livevideo",
        dataVizUrl: null,
      },
    },
  ],
};
const BFF_MOCK_CARDS_WITH_PITCH_VIZ = {
  cards: [
    {
      __typename: "StatsBroadcastsCard",
      urn: `ppb:tbd:stats:card:broadcasts:${EVENT_ID}|dataviz`,
      broadcasts: {
        liveVideoUrl: null,
        dataVizUrl: "https://dummy.com.betfair/dataviz",
      },
    },
  ],
};

describe("Football stats in Event Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getHtmlFilePuppeteer({ path: ".*livevideo.*", content: LIVE_VIDEO_MOCK, bodyStyle: "margin:0;" }),
    );
    await mockService.mockHttpRequest(
      getHtmlFilePuppeteer({ path: ".*dataviz.*", content: DATA_VIZ_MOCK, bodyStyle: "margin:0;" }),
    );

    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_EVENT_VIEW.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_EVENT_VIEW, { withBottomBar: false }));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
  });

  describe("when the user clicks on the live video tab", () => {
    const liveVideoTab = statsContentCardGroupPO.tabs[0];

    beforeAll(async () => {
      await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_LIVE_VIDEO));

      await liveVideoTab.waitForClickable();
      await liveVideoTab.click();
      await browser.waitUntilIframeReady(iFrame, MOCKED_LIVE_VIDEO);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1550]_should_correctly_display_live_video_iframe`);
    });

    it("[PRPI-1550]_should_correctly_display_live_video_iframe", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1550]_should_correctly_display_live_video_iframe`)).toBe(
        0,
      );
    });
  });

  describe("when the user clicks on the pitch viz tab", () => {
    const pitchVizTab = statsContentCardGroupPO.tabs[1];

    beforeAll(async () => {
      await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_PITCH_VIZ));

      await pitchVizTab.waitForClickable();
      await pitchVizTab.click();
      await browser.waitUntilIframeReady(iFrame, MOCKED_DATA_VIZ);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1551]_should_correctly_display_pitch_viz_iframe`);
    });

    it("[PRPI-1551]_should_correctly_display_pitch_viz_iframe", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1551]_should_correctly_display_pitch_viz_iframe`)).toBe(0);
    });
  });
});
