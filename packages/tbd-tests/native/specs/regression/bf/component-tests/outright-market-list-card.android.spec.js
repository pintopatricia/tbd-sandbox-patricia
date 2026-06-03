const { getCompetitionsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const OutrightMarketListCardSO = require("@ppb/tbd-shared/components/OutrightMarketListCard/OutrightMarketListCard.native.so");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const { InlineSportsbookMarketSO, SportsbookBetButtonSO, ShowMoreSO } = require("../../../../screen-objects");

const mockService = new MockService();
const showMoreSO = new ShowMoreSO();
const outrightMarketListCardSO = new OutrightMarketListCardSO();

const firstMarketSO = new InlineSportsbookMarketSO(outrightMarketListCardSO.inlineSportsbookMarkets[0]);
const secondMarketSO = new InlineSportsbookMarketSO(outrightMarketListCardSO.inlineSportsbookMarkets[1]);
const thirdMarketSO = new InlineSportsbookMarketSO(outrightMarketListCardSO.inlineSportsbookMarkets[2]);

const firstMarketFirstBetButtonSO = new SportsbookBetButtonSO(firstMarketSO.sbkBetButtons[0]);
const firstMarketSecondBetButtonSO = new SportsbookBetButtonSO(firstMarketSO.sbkBetButtons[1]);
const firstMarketThirdBetButtonSO = new SportsbookBetButtonSO(firstMarketSO.sbkBetButtons[2]);

const secondMarketFirstBetButtonSO = new SportsbookBetButtonSO(secondMarketSO.sbkBetButtons[0]);
const secondMarketSecondBetButtonSO = new SportsbookBetButtonSO(secondMarketSO.sbkBetButtons[1]);

const thirdMarketFirstBetButtonSO = new SportsbookBetButtonSO(thirdMarketSO.sbkBetButtons[0]);
const thirdMarketSecondBetButtonSO = new SportsbookBetButtonSO(thirdMarketSO.sbkBetButtons[1]);
const thirdMarketThirdBetButtonSO = new SportsbookBetButtonSO(thirdMarketSO.sbkBetButtons[2]);

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
  url: "golf/the-ryder-cup-2023/c-1234",
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

describe("OutrightMarketList", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getCompetitionsLayout(BFF_MOCK));
    const url = "golf/the-ryder-cup-2023/c-1234";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(outrightMarketListCardSO.element);
  });

  it("[PRPI-2354] should display the expected title", async () => {
    expect(await outrightMarketListCardSO.collapseTitle.getText()).toEqual(BFF_MOCK.edges[0].node.title);
  });

  it("[PRPI-2355] should display the expected market titles", async () => {
    expect(await outrightMarketListCardSO.marketTitles[0].getText()).toBe("WINNER");

    expect(await outrightMarketListCardSO.marketTitles[1].getText()).toBe(
      "THREE BALLS AND ALSO TWO BALLS BUT WHAT IF WE HAD LIKE JUST ONE BALL TO SHOW THAT THIS CAN HAVE TWO LINES?",
    );
  });

  it("[PRPI-2356] should display the expected number of runners", async () => {
    await browser.waitUntilEquals(firstMarketFirstBetButtonSO.odd, "6.5");

    expect(await firstMarketSO.sbkBetButtons.length).toBe(3);
    expect(await secondMarketSO.sbkBetButtons.length).toBe(2);
  });

  it("[PRPI-2357] should display the expected runners", async () => {
    expect(await firstMarketFirstBetButtonSO.secondaryLabel.getText()).toBe(
      "UNITED STATES OF AMERICA WITH THE BIGGEST NAME THERE IS",
    );

    expect(await firstMarketSecondBetButtonSO.secondaryLabel.getText()).toBe("EUROPE");

    expect(await firstMarketThirdBetButtonSO.secondaryLabel.getText()).toBe("TIE");

    expect(await secondMarketFirstBetButtonSO.secondaryLabel.getText()).toBe("USA");

    expect(await secondMarketSecondBetButtonSO.secondaryLabel.getText()).toBe(
      "EUROPE THAT HAS AN EVEN BIGGER NAME THAN THE PREVIOUS MARKET",
    );
  });

  it("[PRPI-2358] should display the Show More", async () => {
    expect(await showMoreSO.element.isDisplayed()).toBe(true);
    expect(await showMoreSO.text.getText()).toBe("Show More");
  });

  describe("when user clicks on Show More", () => {
    beforeAll(async () => {
      await showMoreSO.element.click();
      await browser.waitUntilEquals(outrightMarketListCardSO.marketTitles[2], "TWO BALLS");
    });

    it("[PRPI-2359] should display the third market title", async () => {
      expect(await outrightMarketListCardSO.marketTitles[2].getText()).toBe("TWO BALLS");
    });

    it("[PRPI-2360] should display the expected number of runners in the third market", async () => {
      expect(await thirdMarketSO.sbkBetButtons.length).toBe(3);
    });

    it("[PRPI-2361] should display the expected runners in the third market", async () => {
      expect(await thirdMarketFirstBetButtonSO.secondaryLabel.getText()).toBe("USA");
      expect(await thirdMarketSecondBetButtonSO.secondaryLabel.getText()).toBe("EUROPE");
      expect(await thirdMarketThirdBetButtonSO.secondaryLabel.getText()).toBe("TIE");
    });

    it("[PRPI-2362] should display the Show More", async () => {
      expect(await showMoreSO.element.isDisplayed()).toBe(true);
    });
  });
});
