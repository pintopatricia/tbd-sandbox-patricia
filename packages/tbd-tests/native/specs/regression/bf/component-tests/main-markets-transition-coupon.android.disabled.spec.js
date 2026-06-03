const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const CouponSO = require("@ppb/tbd-shared/components/Coupon/Coupon.so");
const {
  getEventLayout,
  getMainMarkets,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const {
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  ExchangeBetButtonSO,
  InlineExchangeMarketSO,
} = require("../../../../screen-objects");

const eventMarketsCardCouponSO = new FilteredCouponCardGroupSO();

const couponSO = new CouponSO();
const inlineExchangeMarketSO = new InlineExchangeMarketSO(couponSO.element);
const firstExchangeBetButtonSO = new ExchangeBetButtonSO(inlineExchangeMarketSO.betButtons[0]);
const secondExchangeBetButtonSO = new ExchangeBetButtonSO(inlineExchangeMarketSO.betButtons[1]);
const thirdExchangeBetButtonSO = new ExchangeBetButtonSO(inlineExchangeMarketSO.betButtons[2]);

const inlineSportsbookMarketSO = new InlineSportsbookMarketSO(eventMarketsCardCouponSO.coupons[0]);
const firstSbkButton = new SportsbookBetButtonSO(inlineSportsbookMarketSO.sbkBetButtons[0]);
const secondSbkButton = new SportsbookBetButtonSO(inlineSportsbookMarketSO.sbkBetButtons[1]);
const thirdSbkButton = new SportsbookBetButtonSO(inlineSportsbookMarketSO.sbkBetButtons[2]);

const mockService = new MockService();

const EVENT_ID = "29682729";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
  },
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/c/12345",
        filteredCouponTitle: "Coupon Matches",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29791284",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29791284",
                },
                fixture: {
                  __typename: "FootballFixture",
                  urn: "ppb:fixture:29791283",
                  scheduledAt: "2021-05-28T00:30:00Z",
                  home: {
                    name: "Dinamo Brest",
                  },
                  away: {
                    name: "BATE Borisov",
                  },
                },
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170386745",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29791284",
                          name: "Dinamo Brest v Bate Borisov",
                        },
                        competition: {
                          urn: "ppb:competition:12345",
                          name: "Belarusian Premier League",
                          competitionId: 12345,
                          sport: {
                            urn: "ppb:sport:1",
                            name: "sportName",
                          },
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170386745/2482528/0",
                          name: "Dinamo Brest",
                          selectionId: 2482528,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170386745/46949/0",
                          name: "BATE Borisov",
                          selectionId: 46949,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170386745/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170386745/2482528/0" },
                      { runnerURN: "ppb:excRunner:1.170386745/46949/0" },
                      { runnerURN: "ppb:excRunner:1.170386745/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.262429631",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29791285",
                          name: "Dinamo Brest v Bate Borisov",
                        },
                        competition: {
                          urn: "ppb:competition:12345",
                          name: "Belarusian Premier League",
                          competitionId: 12345,
                          sport: {
                            urn: "ppb:sport:1",
                            name: "sportName",
                          },
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.262429631/55190/0",
                          name: "Chelsea",
                          selectionId: 55190,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.262429631/2426/0",
                          name: "Real Madrid",
                          selectionId: 2426,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.262429631/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.262429631/55190/0",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.262429631/2426/0",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.262429631/58805/0",
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29791284",
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
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/c/12345",
      },
    },
  ],
};

const BFF_CARDS_MOCK = (secondCallWithSbkOnly = false) => {
  const sbkMarketId = secondCallWithSbkOnly ? "924.262429623" : "924.262429622";
  const sbkMarketUrn = `ppb:sbkMarket:${sbkMarketId}`;
  return {
    cards: [
      {
        __typename: "EventMarketCard",
        urn: "ppb:tbd:card:eventPrimaryMarket:29791284",
        eventViewLink: {
          viewUrn: "ppb:tbd:view:event:29791284",
        },
        title: "Extra Time Result",
        sportevent: {
          name: "Home Team vs Away Team",
          urn: "ppb:event:12345",
          __typename: "SportsEvent",
          competition: {
            urn: "ppb:competition:12191691",
            name: "Competition Name",
          },
        },
        runnerViewLinks: [
          {
            runnerUrn: "ppb:excRunner:1.170386765/2482528/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.170386765/2482528/0",
          },
        ],

        displayRunners: {
          ...(secondCallWithSbkOnly
            ? {}
            : {
                exchange: {
                  market: {
                    __typename: "ExchangeMarket",
                    name: "Extra Time Result",
                    urn: "ppb:excMarket:1.170386765",
                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:29791284",
                        name: "Dinamo Brest v Bate Borisov",
                      },
                      competition: {
                        urn: "ppb:competition:12345",
                        name: "Belarusian Premier League",
                        competitionId: 12345,
                        sport: {
                          urn: "ppb:sport:1",
                          name: "sportName",
                        },
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:excRunner:1.170386765/2482528/0",
                        name: "Extra Time Result Runner 1",
                        selectionId: 2482528,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:excRunner:1.170386765/58805/0",
                        name: "Extra Time Result Runner 3",
                        selectionId: 58805,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:excRunner:1.170386765/46949/0",
                        name: "Extra Time Result Runner 2",
                        selectionId: 46949,
                      },
                    ],
                  },
                  runners: [
                    { runnerURN: "ppb:excRunner:1.170386765/2482528/0" },
                    { runnerURN: "ppb:excRunner:1.170386765/58805/0" },
                    { runnerURN: "ppb:excRunner:1.170386765/46949/0" },
                  ],
                },
              }),
          sportsbook: {
            market: {
              name: secondCallWithSbkOnly ? "Extra Time Result 2" : "Extra Time Result",
              __typename: "SportsbookMarket",
              urn: sbkMarketUrn,
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                sportevent: {
                  __typename: "SportsEvent",
                  urn: "ppb:event:29791284",
                  name: "Dinamo Brest v Bate Borisov",
                },
                competition: {
                  urn: "ppb:competition:12345",
                  name: "Belarusian Premier League",
                  competitionId: 12345,
                  sport: {
                    urn: "ppb:sport:1",
                    name: "sportName",
                  },
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${sbkMarketId}/55190`,
                  name: "Extra Time Result Runner A",
                  selectionId: 55190,
                },
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${sbkMarketId}/2426`,
                  name: "Extra Time Result Runner B",
                  selectionId: 2426,
                },
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${sbkMarketId}/58805`,
                  name: "Extra Time Result Runner C",
                  selectionId: 58805,
                },
              ],
            },
            runners: [
              {
                runnerURN: `ppb:sbkRunner:${sbkMarketId}/55190`,
              },
              {
                runnerURN: `ppb:sbkRunner:${sbkMarketId}/58805`,
              },
              {
                runnerURN: `ppb:sbkRunner:${sbkMarketId}/2426`,
              },
            ],
          },
        },
      },
    ],
  };
};

const ERO_MOCK_CLOSED = [
  {
    marketId: "1.170386745",
    runners: [],
    state: { status: "CLOSED" },
  },
];

const ERO_MOCK_NEW_MAIN_MARKET = [
  {
    marketId: "1.170386765",
    runners: [
      {
        selectionId: "46949",
        availableToBack: [{ price: 9.1, size: 100 }],
        availableToLay: [{ price: 1.9, size: 110 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 8.1, size: 200 }],
        availableToLay: [{ price: 1.8, size: 210 }],
      },
      {
        selectionId: "2482528",
        availableToBack: [{ price: 7.1, size: 300 }],
        availableToLay: [{ price: 1.7, size: 310 }],
      },
    ],

    state: { inplay: true, status: "OPEN" },
  },
];

const ERO_MOCK_NEW_MAIN_MARKET_CLOSED = [
  {
    marketId: "1.170386765",
    runners: [
      {
        selectionId: "46949",
        availableToBack: [{ price: 9.1, size: 100 }],
        availableToLay: [{ price: 1.9, size: 110 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 8.1, size: 200 }],
        availableToLay: [{ price: 1.8, size: 210 }],
      },
      {
        selectionId: "2482528",
        availableToBack: [{ price: 7.1, size: 300 }],
        availableToLay: [{ price: 1.7, size: 310 }],
      },
    ],

    state: { inplay: true, status: "CLOSED" },
  },
];

const SMP_MOCK_SECOND_NEW_MAIN_MARKET = {
  markets: [
    {
      marketId: "924.262429623",
      marketStatus: "OPEN",
      inplay: true,
      runnerDetails: [
        {
          selectionId: "55190",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 2, denominator: 1 },
          },
        },
        {
          selectionId: "2426",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
            fractionalDisplayOdds: { numerator: 2, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 3 },
          },
        },
      ],
    },
  ],
};

const SMP_MOCK_CLOSED = (marketId) => ({
  markets: [
    {
      marketId,
      noMarketInfo: true,
    },
  ],
});

describe("EventMarketCard - Main Market - Coupons", () => {
  describe("When the user is at a given screen", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
      const url = `football/whiskas/saquetas/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(inlineExchangeMarketSO.element);
    });

    describe("and a coupon card group is retrieved", () => {
      describe("And EXC tab is selected", () => {
        describe("When both EXC and SBK markets closes, and a new primary market is retrieved", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarkets(ERO_MOCK_CLOSED));
            await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED("924.262429631")));
            await mockService.mockHttpRequest(getMainMarkets(BFF_CARDS_MOCK()));
            await mockService.mockHttpRequest(getMarkets(ERO_MOCK_NEW_MAIN_MARKET));
            await browser.waitUntilEquals(firstExchangeBetButtonSO.odd, "7.1");
          });

          it("[PRPI-2250] The 3 EXC bet buttons should be visible with updated odds", async () => {
            expect(await firstExchangeBetButtonSO.odd.getText()).toBe("7.1");
            expect(await secondExchangeBetButtonSO.odd.getText()).toBe("9.1");
            expect(await thirdExchangeBetButtonSO.odd.getText()).toBe("8.1");
          });

          describe("And SBK and EXC market close", () => {
            describe("And a new primary market is retrieved with only SBK market available", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED("924.262429622")));
                await mockService.mockHttpRequest(getMarkets(ERO_MOCK_NEW_MAIN_MARKET_CLOSED));
                await mockService.mockHttpRequest(getMainMarkets(BFF_CARDS_MOCK(true)));
                await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_SECOND_NEW_MAIN_MARKET));
                await browser.waitUntilEquals(firstSbkButton.odd, "2.1");
                await browser.waitUntilEquals(secondSbkButton.odd, "2.2");
                await browser.waitUntilEquals(thirdSbkButton.odd, "2.3");
              });

              it("[PRPI-2251] The 3 SBK bet buttons should be visible with updated odds", async () => {
                expect(await firstSbkButton.odd.getText()).toBe("2.1");
                expect(await secondSbkButton.odd.getText()).toBe("2.2");
                expect(await thirdSbkButton.odd.getText()).toBe("2.3");
              });
            });
          });
        });
      });
    });
  });
});
