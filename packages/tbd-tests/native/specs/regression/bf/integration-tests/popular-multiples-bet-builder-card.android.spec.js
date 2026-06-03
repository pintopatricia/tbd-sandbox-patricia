const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const PopularBetBuilderSO = require("@ppb/tbd-shared/components/PopularBetBuilderCard/PopularBetBuilderCard.so");
const TimesBackedSO = require("@ppb/tbd-shared/components/TimesBacked/TimesBacked.so");
const PopularBetBuilderSelectionItemOddSO = require("@ppb/tbd-shared/components/PopularBetBuilderCard/PopularBetBuilderSelectionOdd/PopularBetBuilderSelectionOdd.so");
const { getSportsLayout, getMarkets, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  SportsbookBetButtonSO,
  BetSelectionDetailsSO,
  MultiBetBuilderSO,
  BetLegsSO,
  SportsbookPlacePanelSO,
  BubbleItemSO,
} = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const mockService = new MockService();

const popularBetBuilderSO = new PopularBetBuilderSO();
const timesBackedSO = new TimesBackedSO(popularBetBuilderSO.element);

const firstBubbleItemSO = new BubbleItemSO(popularBetBuilderSO.selections[0]);
const secondBubbleItemSO = new BubbleItemSO(popularBetBuilderSO.selections[1]);
const thirdBubbleItemSO = new BubbleItemSO(popularBetBuilderSO.selections[2]);

const firstSelectionItemOddSO = new PopularBetBuilderSelectionItemOddSO(firstBubbleItemSO.childrenContainer);
const secondSelectionItemOddSO = new PopularBetBuilderSelectionItemOddSO(secondBubbleItemSO.childrenContainer);
const thirdSelectionItemOddSO = new PopularBetBuilderSelectionItemOddSO(thirdBubbleItemSO.childrenContainer);

const sportsbookBetButtonSO = new SportsbookBetButtonSO(popularBetBuilderSO.betButtonContainer);

const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const multiBetBuilderSO = new MultiBetBuilderSO(sportsbookPlacePanelSO.element);
const betSelectionsSO = new BetLegsSO(multiBetBuilderSO.element);

const firstSelectionDetailSO = new BetSelectionDetailsSO(betSelectionsSO.selections[0]);
const secondSelectionDetailSO = new BetSelectionDetailsSO(betSelectionsSO.selections[1]);
const thirdSelectionDetailSO = new BetSelectionDetailsSO(betSelectionsSO.selections[2]);

const EVENT_TYPE_ID = 7;
const FIRST_MARKET_ID = 924.1;
const SECOND_MARKET_ID = 924.2;
const THIRD_MARKET_ID = 924.3;

const MEETING_MOCK = {
  __typename: "Meeting",
  urn: "ppb:meeting:30264302",
  name: "Kemp 3rd Feb",
  country: "GB",
  countryFlag: { vector: null },
  venue: "Kempton",
  date: "2021-02-03T16:55:00.000Z",
};

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        cardGroupTitle: "Popular Bets",
        full: {
          edges: [
            {
              node: {
                __typename: "PopularMultiplesBetBuilderCard",
                urn: "ppb:tbd:card:popularmultiplesbetbuilder:bo-1|1|0|0",
                popularbettingopportunity: {
                  urn: "ppb:bettingOpportunity:popular:bo-1|1|0|0",
                  count: 435,
                  selections: [
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                        name: "Anytime Goalscorer",
                        hierarchy: {
                          __typename: "RaceHierarchy",
                          race: {
                            __typename: "Race",
                            urn: "ppb:race:30264302.1755",
                            startTime: "2021-02-03T14:55:00.000Z",
                            name: "5f App Hcap",
                            meeting: MEETING_MOCK,
                          },
                          meeting: MEETING_MOCK,
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                            selectionId: 1,
                            name: "Mega Pinto",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                        selectionId: 1,
                      },
                      raceRunner: {
                        details: {
                          silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00004175.png",
                        },
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
                        name: "Missed Shots Over/Under 100.5",
                        hierarchy: {
                          __typename: "RaceHierarchy",
                          race: {
                            __typename: "Race",
                            urn: "ppb:race:30264302.1756",
                            startTime: "2021-02-03T17:55:00.000Z",
                            name: "5f Hcap",
                            meeting: MEETING_MOCK,
                          },
                          meeting: MEETING_MOCK,
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
                            selectionId: 2,
                            name: "Super Santos",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
                        selectionId: 2,
                      },
                      raceRunner: {
                        details: {
                          silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00004175.png",
                        },
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
                        name: "Third Market",
                        hierarchy: {
                          __typename: "RaceHierarchy",
                          race: {
                            __typename: "Race",
                            urn: "ppb:race:30264302.1757",
                            startTime: "2021-02-03T18:20:00.000Z",
                            name: "6f Mdn Stks",
                            meeting: MEETING_MOCK,
                          },
                          meeting: MEETING_MOCK,
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/3`,
                            selectionId: 3,
                            name: "Fastest Jorge",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/3`,
                        selectionId: 3,
                      },
                      raceRunner: {
                        details: {
                          silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00004175.png",
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "PopularMultiplesBetBuilderCard",
                urn: "ppb:tbd:card:popularmultiplesbetbuilder:bo-1|1|0|0",
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
      },
    },
  ],
};

const FIRST_RUNNER_SIB = {
  runner: { marketId: FIRST_MARKET_ID, selectionId: 1 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const SECOND_RUNNER_SIB = {
  runner: { marketId: SECOND_MARKET_ID, selectionId: 2 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.2 } },
    decimalDisplayOdds: { decimalOdds: 2.2 },
  },
};

const THIRD_RUNNER_SIB = {
  runner: { marketId: THIRD_MARKET_ID, selectionId: 3 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 3.3 } },
    decimalDisplayOdds: { decimalOdds: 3.3 },
  },
};

const POPULAR_MULTIPLES_BET_BUILDER_COMBINATION = {
  betType: "TREBLE",
  features: ["SGM"],
  averageOdds: 56.39,
  winAverageOdds: 56.39,
  legCombinations: [
    {
      runners: [FIRST_RUNNER_SIB.runner],
    },
    {
      runners: [SECOND_RUNNER_SIB.runner],
    },
    {
      runners: [THIRD_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 56.39 } },
    prettyDisplayOdds: {
      decimalOdds: { decimalOdds: 56.39 },
    },
  },
};

const SIB_MOCK = {
  betCombinations: [POPULAR_MULTIPLES_BET_BUILDER_COMBINATION],
  runnerOdds: [FIRST_RUNNER_SIB, SECOND_RUNNER_SIB, THIRD_RUNNER_SIB],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: `${FIRST_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: FIRST_RUNNER_SIB.runner.selectionId,
          runnerOdds: {
            decimalDisplayOdds: FIRST_RUNNER_SIB.odds.decimalDisplayOdds,
          },
        },
      ],
    },
    {
      marketId: `${SECOND_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: SECOND_RUNNER_SIB.runner.selectionId,
          runnerOdds: {
            decimalDisplayOdds: SECOND_RUNNER_SIB.odds.decimalDisplayOdds,
          },
        },
      ],
    },
    {
      marketId: `${THIRD_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: THIRD_RUNNER_SIB.runner.selectionId,
          runnerOdds: {
            decimalDisplayOdds: THIRD_RUNNER_SIB.odds.decimalDisplayOdds,
          },
        },
      ],
    },
  ],
};

const GET_MARKETS_MOCK = {
  markets: [
    { urn: `ppb:sbkMarket:${FIRST_MARKET_ID}` },
    { urn: `ppb:sbkMarket:${SECOND_MARKET_ID}` },
    { urn: `ppb:sbkMarket:${THIRD_MARKET_ID}` },
  ],
};

describe("PopularBetBuilder", () => {
  describe("Racing Bet Builder", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK, { ignoreLegsOrder: true }));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      const url = `horse-racing/s-${EVENT_TYPE_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilEquals(sportsbookBetButtonSO.odd, "Add to Betslip at 56.39");
    });

    it("[PRPI-3083] should be displayed", async () => {
      expect(await popularBetBuilderSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-3084] should display how many times it was backed", async () => {
      expect(await timesBackedSO.label.getText()).toBe("435 Times Backed");
    });

    it("[PRPI-3085] should display each element with selection, race time, local, silk and odd", async () => {
      expect(await firstBubbleItemSO.itemTitle.getText()).toBe("Mega Pinto");
      expect(await firstBubbleItemSO.description.getText()).toBe("14:55 Kempton • 5f App Hcap");
      expect(await firstBubbleItemSO.icon.isDisplayed()).toBe(true);
      expect(await firstSelectionItemOddSO.odd.getText()).toBe("1.1");

      expect(await secondBubbleItemSO.itemTitle.getText()).toBe("Super Santos");
      expect(await secondBubbleItemSO.description.getText()).toBe("17:55 Kempton • 5f Hcap");
      expect(await secondBubbleItemSO.icon.isDisplayed()).toBe(true);
      expect(await secondSelectionItemOddSO.odd.getText()).toBe("2.2");

      expect(await thirdBubbleItemSO.itemTitle.getText()).toBe("Fastest Jorge");
      expect(await thirdBubbleItemSO.description.getText()).toBe("18:20 Kempton • 6f Mdn Stks");
      expect(await thirdBubbleItemSO.icon.isDisplayed()).toBe(true);
      expect(await thirdSelectionItemOddSO.odd.getText()).toBe("3.3");
    });

    describe("when the bet button is clicked", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(sportsbookBetButtonSO.element);
        await sportsbookBetButtonSO.element.click();
        await browser.waitUntilDisplayed(multiBetBuilderSO.element);
      });

      it("[PRPI-3086] should display the selections in the betslip", async () => {
        expect(await firstSelectionDetailSO.title.getText()).toBe("Mega Pinto");
        expect(await firstSelectionDetailSO.subtitle.getText()).toBe("Match Odds - 14:55 Kempton");

        expect(await secondSelectionDetailSO.title.getText()).toBe("Super Santos");
        expect(await secondSelectionDetailSO.subtitle.getText()).toBe("Match Odds - 17:55 Kempton");

        expect(await thirdSelectionDetailSO.title.getText()).toBe("Fastest Jorge");
        expect(await thirdSelectionDetailSO.subtitle.getText()).toBe("Match Odds - 18:20 Kempton");
      });
    });
  });
});
