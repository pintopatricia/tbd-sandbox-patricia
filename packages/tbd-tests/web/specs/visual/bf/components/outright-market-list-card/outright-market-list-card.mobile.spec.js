const { ShowMorePO } = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getCompetitionsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const showMorePO = new ShowMorePO();

const COMPETITION_ID = "1234";

const SPORTSBOOK_MARKET_ID_1 = "924.123";
const SPORTSBOOK_MARKET_ID_2 = "924.124";
const SPORTSBOOK_MARKET_ID_3 = "924.125";

const SELECTION_ID_1 = 13528450;
const SELECTION_ID_2 = 14041984;
const SELECTION_ID_3 = 13485007;

const SPORT_MOCK = { __typename: "Sport", urn: "ppb:eventType:3", name: "Golf", sportId: 3 };

const COMPETITION_MOCK = {
  __typename: "Competition",
  urn: `ppb:competition:${COMPETITION_ID}`,
  name: "The Ryder Cup 2023",
  competitionId: COMPETITION_ID,
  sport: SPORT_MOCK,
};

const EVENT_COMPETITION_HIERARCHY_MOCK = {
  __typename: "EventCompetitionHierarchy",
  sportevent: {
    __typename: "SportsEvent",
    urn: "ppb:event:30951668",
    eventId: 30951668,
    name: "The Ryder Cup 2023",
    openDate: "2023-09-29T11:00:00.000Z",
    competition: COMPETITION_MOCK,
  },
  competition: COMPETITION_MOCK,
};

const BFF_MOCK = {
  __typename: "CompetitionView",
  urn: `ppb:tbd:view:competition:${COMPETITION_ID}`,
  url: routes.getCompetitionViewUrl(COMPETITION_ID),
  competition: COMPETITION_MOCK,
  edges: [
    {
      node: {
        __typename: "OutrightMarketListCard",
        urn: "ppb:tbd:card:outrightMarketList:Y1FoEBEAADtSDlBF/c/1234",
        title: "Golf",
        numberOfRowsToDisplay: 2,
        markets: [
          {
            __typename: "SportsbookMarket",
            urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID_1}`,
            name: "Winner",
            hierarchy: EVENT_COMPETITION_HIERARCHY_MOCK,
            sport: SPORT_MOCK,
            runners: [
              {
                __typename: "Runner",
                runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_1}/${SELECTION_ID_1}`,
                name: "United States of America with the biggest name there is",
                selectionId: SELECTION_ID_1,
              },
              {
                __typename: "Runner",
                runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_1}/${SELECTION_ID_2}`,
                name: "Europe",
                selectionId: SELECTION_ID_2,
              },
              {
                __typename: "Runner",
                runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_1}/${SELECTION_ID_3}`,
                name: "Tie",
                selectionId: SELECTION_ID_3,
              },
            ],
          },
          {
            __typename: "SportsbookMarket",
            urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID_2}`,
            name: "Three Balls and also Two Balls but what if we had like just One Ball to show that this can have two lines?",
            hierarchy: EVENT_COMPETITION_HIERARCHY_MOCK,
            sport: SPORT_MOCK,
            runners: [
              {
                __typename: "Runner",
                runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_2}/${SELECTION_ID_1}`,
                name: "USA",
                selectionId: SELECTION_ID_1,
              },
              {
                __typename: "Runner",
                runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_2}/${SELECTION_ID_2}`,
                name: "Europe that has an even bigger name than the previous market",
                selectionId: SELECTION_ID_2,
              },
            ],
          },
          {
            __typename: "SportsbookMarket",
            urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID_3}`,
            name: "Two Balls",
            hierarchy: EVENT_COMPETITION_HIERARCHY_MOCK,
            sport: SPORT_MOCK,
            runners: [
              {
                __typename: "Runner",
                runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_3}/${SELECTION_ID_1}`,
                name: "USA",
                selectionId: SELECTION_ID_1,
              },
              {
                __typename: "Runner",
                runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_3}/${SELECTION_ID_2}`,
                name: "Europe",
                selectionId: SELECTION_ID_2,
              },
              {
                __typename: "Runner",
                runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_3}/${SELECTION_ID_3}`,
                name: "Tie",
                selectionId: SELECTION_ID_3,
              },
            ],
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "OutrightMarketListCard",
        urn: "ppb:tbd:card:outrightMarketList:Y1FoEBEAADtSDlBF/c/1234",
      },
    },
  ],
};

const SMP_MARKET_SELECTIONS = [
  {
    selectionId: SELECTION_ID_1,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 6.5 },
    },
  },
  {
    selectionId: SELECTION_ID_2,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 1.2 },
    },
  },
  {
    selectionId: SELECTION_ID_3,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 2.9 },
    },
  },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID_1,
      runnerDetails: SMP_MARKET_SELECTIONS,
    },
    {
      marketId: SPORTSBOOK_MARKET_ID_2,
      runnerDetails: SMP_MARKET_SELECTIONS,
    },
    {
      marketId: SPORTSBOOK_MARKET_ID_3,
      runnerDetails: SMP_MARKET_SELECTIONS,
    },
  ],
};

const MODULE_NAME = "outright-market-list-card";

describe("Outright Market List Card", () => {
  describe("When the user enters a page with Outright Market List Card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getCompetitionsLayout(BFF_MOCK));
      await browser.url(routes.getCompetitionViewUrl(COMPETITION_ID));
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1613]_should_show_two_markets_with_show_more`);
    });

    it("[PRPI-1613]_should_show_two_markets_with_show_more", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1613]_should_show_two_markets_with_show_more`)).toBe(0);
    });

    describe("And clicks in the show more button", () => {
      beforeAll(async () => {
        showMorePO.element.click();

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1614]_should_show_three_markets_with_correct_information`,
        );
      });

      it("[PRPI-1614]_should_show_three_markets_with_correct_information", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1614]_should_show_three_markets_with_correct_information`),
        ).toBe(0);
      });
    });
  });
});
