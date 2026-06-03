const {
  EventPagePO,
  ExchangeMarketPO,
  CardPO,
  RunnerPO,
  MarketBlurbsPO,
  MarketStatusPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;

const { getMainMarkets } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const eventPagePO = new EventPagePO();

// Event Market Card Page Objects
const eventMarketCardPO = new CardPO(eventPagePO.markets[0]);
const eventMarketCardExchangeMarketPO = new ExchangeMarketPO(eventMarketCardPO.exchangeMarket);
const eventMarketCardFirstRunnerExchangePO = new RunnerPO(eventMarketCardExchangeMarketPO.runnerList[0]);
const eventMarketCardSecondRunnerExchangePO = new RunnerPO(eventMarketCardExchangeMarketPO.runnerList[1]);
const eventMarketCardThirdRunnerExchangePO = new RunnerPO(eventMarketCardExchangeMarketPO.runnerList[2]);

const marketBlurbsPO = new MarketBlurbsPO(eventMarketCardExchangeMarketPO.element);
const marketStatusSO = new MarketStatusPO(marketBlurbsPO.element);

const mockService = new MockService();

const EVENT_ID = 29359895;

const BFF_MAIN_MARKETS_EMPTY = { response: { data: { cards: [null] } } };

const BFF_VIEW_MOCK = {
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
                  viewUrl: routes.getEventViewUrl("29791283"),
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
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170386754/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170386754/2482528/0" },
                      { runnerURN: "ppb:excRunner:1.170386754/46949/0" },
                      { runnerURN: "ppb:excRunner:1.170386754/58805/0" },
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

const BFF_CARDS_MOCK = ({ exchange = true } = {}) => ({
  cards: [
    {
      __typename: "EventMarketCard",
      urn: "ppb:tbd:card:eventPrimaryMarket:29791283",
      eventViewLink: {
        viewUrn: "ppb:tbd:view:event:29791283",
        viewUrl: routes.getEventViewUrl("123456789"),
      },
      title: "Extra Time Result",
      runnerViewLinks: [
        {
          runnerUrn: "ppb:excRunner:1.170386755/2482528/0",
          viewUrl: "Not Implemented",
          viewUrn: "ppb:tbd:view:runner:1.170386755/2482528/0",
        },
      ],

      displayRunners: {
        exchange: exchange
          ? {
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
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:excRunner:1.170386755/58805/0",
                    name: "Extra Time Result Runner 3",
                    selectionId: 58805,
                  },
                ],
              },
              runners: [
                { runnerURN: "ppb:excRunner:1.170386755/2482528/0" },
                { runnerURN: "ppb:excRunner:1.170386755/46949/0" },
                { runnerURN: "ppb:excRunner:1.170386755/58805/0" },
              ],
            }
          : undefined,
      },
    },
  ],
});

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

const ERO_MOCK_NEW_MAIN_MARKET = [
  {
    marketId: "1.170386755",
    runners: [
      {
        selectionId: "58805",
        availableToBack: [{ price: 9.1, size: 100 }],
        availableToLay: [{ price: 1.9, size: 110 }],
      },
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

const LBR_MOCK = {
  marketPositions: [{ marketId: "1.170386755" }],
};

describe("EventMarketCard - Exchange Main Market", () => {
  describe("When the user is at a given page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK_OPEN));
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getMarketPositionViews(LBR_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(eventMarketCardPO.exchangeMarket);
    });

    describe("and an EventMarketCard is retrieved", () => {
      describe("And EXC market closes", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarkets(ERO_MOCK_CLOSED));
          await mockService.mockHttpRequest(getMainMarkets(BFF_CARDS_MOCK()));
          await mockService.mockHttpRequest(getMarkets(ERO_MOCK_NEW_MAIN_MARKET));
          await browser.tickFakeClock();
        });

        describe("And a new primary market is retrieved", () => {
          beforeAll(async () => {
            await browser.waitUntilEquals(eventMarketCardFirstRunnerExchangePO.exchangeBetButtons[0], "7.1\n$300");
          });

          it("[PRPI-5390] The 3 updated runners should be visible", async () => {
            expect(await eventMarketCardExchangeMarketPO.runnerList.length).toBe(3);
            expect(await eventMarketCardFirstRunnerExchangePO.runnerName.getText()).toBe("Extra Time Result Runner 1");

            expect(await eventMarketCardSecondRunnerExchangePO.runnerName.getText()).toBe("Extra Time Result Runner 2");

            expect(await eventMarketCardThirdRunnerExchangePO.runnerName.getText()).toBe("Extra Time Result Runner 3");
          });

          it("[PRPI-5391] The 3 EXC bet buttons should be visible with updated odds", async () => {
            expect(await eventMarketCardFirstRunnerExchangePO.exchangeBetButtons[0].getText()).toBe("7.1\n$300");

            expect(await eventMarketCardFirstRunnerExchangePO.exchangeBetButtons[1].getText()).toBe("1.7\n$310");

            expect(await eventMarketCardSecondRunnerExchangePO.exchangeBetButtons[0].getText()).toBe("8.1\n$200");

            expect(await eventMarketCardSecondRunnerExchangePO.exchangeBetButtons[1].getText()).toBe("1.8\n$210");

            expect(await eventMarketCardThirdRunnerExchangePO.exchangeBetButtons[0].getText()).toBe("9.1\n$100");

            expect(await eventMarketCardThirdRunnerExchangePO.exchangeBetButtons[1].getText()).toBe("1.9\n$110");
          });

          describe("And the new EXC market closes and no more primary markets are available", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getMarkets(ERO_MOCK_NEW_MAIN_MARKET_CLOSED));
              await browser.tickFakeClock();

              await mockService.mockHttpRequest(
                getMainMarkets(BFF_CARDS_MOCK({ exchange: false }), BFF_MAIN_MARKETS_EMPTY),
              );
              await browser.tickFakeClock();
              await browser.waitUntilEquals(marketStatusSO.label, "CLOSED");
            });

            it("[PRPI-5392] The EventMarketCard should be visible with closed status", async () => {
              expect(await marketStatusSO.label.getText()).toBe("CLOSED");
            });
          });
        });
      });
    });
  });
});
