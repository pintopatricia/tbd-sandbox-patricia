const StatsContentCardGroupSO = require("@ppb/tbd-shared/components/StatsContentCardGroup/view/StatsContentCardGroup.so");
const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { LiveStreamSO } = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");

const CARD_NAME = "stats_content_card_group";
const mockService = new MockService();

const liveStreamSO = new LiveStreamSO();
const statsContentCardGroupSO = new StatsContentCardGroupSO();

const EVENT_ID = "1";

const BFF_MOCK_HOME_VIEW = {
  urn: `ppb:tbd:view:generic:home`,
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
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_HOME_VIEW));

    await startApp("home");
    await browser.waitUntilDisplayed(statsContentCardGroupSO.element);
  });

  describe("when the user clicks on the live video tab", () => {
    const liveVideoTab = statsContentCardGroupSO.tabs[0];

    beforeAll(async () => {
      await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_LIVE_VIDEO));

      await browser.waitUntilClickableNative(liveVideoTab, "Live video Tab is not clickable");
      await liveVideoTab.click();
      await browser.waitUntilDisplayed(liveStreamSO.element);

      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4569]_should_correctly_display_live_video_iframe`);
    });

    it("[PRPI-4569]_should_correctly_display_live_video_iframe", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4569]_should_correctly_display_live_video_iframe`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });

  describe("when the user clicks on the pitch viz tab", () => {
    const pitchVizTab = statsContentCardGroupSO.tabs[1];

    beforeAll(async () => {
      await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_PITCH_VIZ));

      await browser.waitUntilClickableNative(pitchVizTab, "Pitch viz Tab is not clickable");
      await pitchVizTab.click();
      await browser.waitUntilDisplayed(liveStreamSO.element);

      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4570]_should_correctly_display_pitch_viz_iframe`);
    });

    it("[PRPI-4570]_should_correctly_display_pitch_viz_iframe", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4570]_should_correctly_display_pitch_viz_iframe`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
});
