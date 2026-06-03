const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const {
  getEventLayout,
  getMainMarkets,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const {
  CardSO,
  RunnerSO,
  SportsbookBetButtonSO,
  MarketBlurbsSO,
  SportsbookMarketSO,
  ExchangeMarketSO,
  ExchangeBetButtonSO,
  MarketStatusSO,
  TabsGroupSO,
} = require("../../../../screen-objects");

const tabsSO = new TabsGroupSO();
const cardSO = new CardSO();
const eventMarketCardExchangeMarketSO = new ExchangeMarketSO();
const firstRunnerSO = new RunnerSO(eventMarketCardExchangeMarketSO.runnerList[0]);
const secondRunnerSO = new RunnerSO(eventMarketCardExchangeMarketSO.runnerList[1]);

const firstRunnerBackBetButtonSO = new ExchangeBetButtonSO(firstRunnerSO.betButtons[0]);
const firstRunnerLayBetButtonSO = new ExchangeBetButtonSO(firstRunnerSO.betButtons[1]);
const secondRunnerBackBetButtonSO = new ExchangeBetButtonSO(secondRunnerSO.betButtons[0]);
const secondRunnerLayBetButtonSO = new ExchangeBetButtonSO(secondRunnerSO.betButtons[1]);

const sbkMarketSO = new SportsbookMarketSO();
const firstSbkRunnerSO = new RunnerSO(sbkMarketSO.runnerList[0]);
const secondSbkRunnerSO = new RunnerSO(sbkMarketSO.runnerList[1]);

const firstSbkRunnerOddSO = new SportsbookBetButtonSO(firstSbkRunnerSO.sbkBetButtons[0]);
const secondSbkRunnerOddSO = new SportsbookBetButtonSO(secondSbkRunnerSO.sbkBetButtons[0]);

const sbkMarketBlurbsSO = new MarketBlurbsSO(sbkMarketSO.element);
const marketStatusSO = new MarketStatusSO(sbkMarketBlurbsSO.element);

const mockService = new MockService();

const EVENT_ID = 29682729;

const BFF_VIEW_MOCK = {
  __typename: "EventView",
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
  },
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:12345",
        cardGroupTitle: "Upcoming Matches",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29791283",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29791283",
                  viewUrl: "viewUrl",
                },
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12345",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170386754",
                      name: "Belarusian Premier League",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29791283",
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
                          runnerURN: "ppb:excRunner:1.170386754/2482528/0",
                          name: "Dinamo Brest",
                          selectionId: 2482528,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170386754/46949/0",
                          name: "BATE Borisov",
                          selectionId: 46949,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170386754/2482528/0" },
                      { runnerURN: "ppb:excRunner:1.170386754/46949/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.262429640",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29791283",
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
                          runnerURN: "ppb:sbkRunner:924.262429640/55190/0",
                          name: "Chelsea",
                          selectionId: 55190,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.262429640/2426/0",
                          name: "Real Madrid",
                          selectionId: 2426,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.262429640/55190/0",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.262429640/2426/0",
                      },
                    ],
                  },
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
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29791283",
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
        urn: "ppb:tbd:card:group:topEventsByCompetition:12345",
      },
    },
  ],

  sections: [
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
  ],
};

const BFF_CARDS_MOCK = (secondCallWithSbkOnly = false) => {
  const sbkMarketId = secondCallWithSbkOnly ? "924.262429643" : "924.262429642";
  const sbkMarketUrn = `ppb:sbkMarket:${sbkMarketId}`;
  return {
    cards: [
      {
        __typename: "EventMarketCard",
        urn: "ppb:tbd:card:eventPrimaryMarket:29791283",
        eventViewLink: {
          viewUrn: "ppb:tbd:view:event:29791283",
          viewUrl: "viewUrl",
        },
        title: secondCallWithSbkOnly ? "Extra Time Result 2" : "Extra Time Result",
        runnerViewLinks: [
          {
            runnerUrn: "ppb:excRunner:1.170386755/2482528/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.170386755/2482528/0",
          },
        ],

        displayRunners: {
          ...(secondCallWithSbkOnly
            ? {}
            : {
                exchange: {
                  market: {
                    __typename: "ExchangeMarket",
                    urn: "ppb:excMarket:1.170386755",
                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:29791283",
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
                        runnerURN: "ppb:excRunner:1.170386755/2482528/0",
                        name: "Extra Time Result Runner 1",
                        selectionId: 2482528,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:excRunner:1.170386755/46949/0",
                        name: "Extra Time Result Runner 2",
                        selectionId: 46949,
                      },
                    ],
                  },
                  runners: [
                    { runnerURN: "ppb:excRunner:1.170386755/2482528/0" },
                    { runnerURN: "ppb:excRunner:1.170386755/46949/0" },
                  ],
                },
              }),
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: sbkMarketUrn,
              name: secondCallWithSbkOnly ? "Extra Time Result 2" : "Extra Time Result",
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                sportevent: {
                  __typename: "SportsEvent",
                  urn: "ppb:event:29791283",
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
              ],
            },
            runners: [
              {
                runnerURN: `ppb:sbkRunner:${sbkMarketId}/55190`,
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

const ERO_MOCK_OPEN = [
  {
    marketId: "1.170386754",
    runners: [
      {
        selectionId: "2482528",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "46949",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
    ],

    state: { inplay: true, status: "OPEN" },
  },
];

const ERO_MOCK_CLOSED = [
  {
    marketId: "1.170386754",
    runners: [],
    state: { status: "CLOSED" },
  },
];

const SMP_MOCK_OPEN = {
  markets: [
    {
      marketId: "924.262429640",
      marketStatus: "OPEN",
      inplay: true,
      runnerDetails: [
        {
          selectionId: "58805",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2426",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
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

const ERO_MOCK_NEW_MAIN_MARKET = [
  {
    marketId: "1.170386755",
    runners: [
      {
        selectionId: "46949",
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

const SMP_MOCK_SECOND_NEW_MAIN_MARKET = {
  markets: [
    {
      marketId: "924.262429643",
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
      ],
    },
  ],
};

const ERO_MOCK_NEW_MAIN_MARKET_CLOSED = [
  {
    marketId: "1.170386755",
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

const BFF_MAIN_MARKETS_EMPTY = { response: { data: { cards: [null] } } };

describe("EventMarketCard - Main Market", () => {
  describe("When the user is at a given screen", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK_OPEN));
      const url = `football/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilEquals(tabsSO.tabsTitles[0], "Exchange");
    });

    describe("and an EventMarketCard is retrieved", () => {
      describe("And EXC tab is selected", () => {
        it("[PRPI-2252] The Exchange tab should be selected", async () => {
          expect(await tabsSO.tabsTitles[0].getText()).toEqual("Exchange");
        });

        describe("And EXC market closes", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_OPEN));
            await mockService.mockHttpRequest(getMarkets(ERO_MOCK_CLOSED));
          });

          it("[PRPI-2253] The EventMarketCard should be visible with 'Match Odds' title", async () => {
            expect(await cardSO.title.getText()).toBe("Match Odds");
          });

          describe("When SBK market closes", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getMarkets(ERO_MOCK_NEW_MAIN_MARKET));
              await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED("924.262429640")));
            });

            describe("And a new primary market is retrieved", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getMainMarkets(BFF_CARDS_MOCK()));
                await mockService.mockHttpRequest(getMarkets(ERO_MOCK_NEW_MAIN_MARKET));
                await browser.waitUntilEquals(cardSO.title, "Extra Time Result");
              });

              it("[PRPI-2254] The EventMarketCard should be visible with 'Extra Time Result' title", async () => {
                expect(await cardSO.title.getText()).toBe("Extra Time Result");
              });

              it("[PRPI-2255] The 2 updated runners should be visible", async () => {
                expect(await eventMarketCardExchangeMarketSO.runnerList.length).toBe(2);
                expect(await firstRunnerSO.runnerName.getText()).toBe("Extra Time Result Runner 1");
                expect(await secondRunnerSO.runnerName.getText()).toBe("Extra Time Result Runner 2");
              });

              it("[PRPI-2256] The 2 EXC bet buttons should be visible with updated odds", async () => {
                expect(await firstRunnerBackBetButtonSO.odd.getText()).toBe("7.1");
                expect(await firstRunnerLayBetButtonSO.odd.getText()).toBe("1.7");
                expect(await secondRunnerBackBetButtonSO.odd.getText()).toBe("8.1");
                expect(await secondRunnerLayBetButtonSO.odd.getText()).toBe("1.8");
              });

              describe("And SBK and EXC market closes", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED("924.262429642")));
                  await mockService.mockHttpRequest(getMarkets(ERO_MOCK_NEW_MAIN_MARKET_CLOSED));
                });

                describe("And a new primary market is retrieved with only SBK market available", () => {
                  beforeAll(async () => {
                    await mockService.mockHttpRequest(getMainMarkets(BFF_CARDS_MOCK(true)));
                    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_SECOND_NEW_MAIN_MARKET));
                    await browser.waitUntilEquals(firstSbkRunnerOddSO.odd, "2.1");
                    await browser.waitUntilEquals(cardSO.title, "Extra Time Result 2");
                  });

                  it("[PRPI-2257] The EventMarketCard should be visible with 'Extra Time Result 2' title", async () => {
                    expect(await cardSO.title.getText()).toBe("Extra Time Result 2");
                  });

                  it("[PRPI-2257] The 2 updated runners should be visible", async () => {
                    expect(await firstSbkRunnerSO.runnerName.getText()).toBe("Extra Time Result Runner A");
                    expect(await secondSbkRunnerSO.runnerName.getText()).toBe("Extra Time Result Runner B");
                  });

                  it("[PRPI-2257] The 2 SBK bet buttons should be visible with updated odds", async () => {
                    expect(await firstSbkRunnerOddSO.odd.getText()).toBe("2.1");
                    expect(await secondSbkRunnerOddSO.odd.getText()).toBe("2.2");
                  });

                  describe("And SBK market closes And no more primary markets are retrieved", () => {
                    beforeAll(async () => {
                      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED("924.262429643")));
                      await mockService.mockHttpRequest(getMainMarkets(BFF_CARDS_MOCK(true), BFF_MAIN_MARKETS_EMPTY));
                      await browser.waitUntilEquals(marketStatusSO.label, "CLOSED");
                    });

                    it("[PRPI-2257] The EventMarketCard should be visible with 'Extra Time Result 2' title with closed status", async () => {
                      expect(await cardSO.title.getText()).toBe("Extra Time Result 2");
                      expect(await marketStatusSO.label.getText()).toBe("CLOSED");
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
