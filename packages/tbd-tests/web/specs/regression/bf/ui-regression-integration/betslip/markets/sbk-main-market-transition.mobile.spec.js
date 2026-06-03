const {
  EventPagePO,
  CardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getMainMarkets } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const routes = require("../../../../../../../utils/routes");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const eventPagePO = new EventPagePO();

// Event Market Card Page Objects
const eventMarketCardPO = new CardPO(eventPagePO.markets[0]);

const sbkMarketPO = new InlineSportsbookMarketPO(eventMarketCardPO.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(sbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(sbkMarketPO.betButtons[1]);
const thirdSbkRunnerPO = new SportsbookBetButtonPO(sbkMarketPO.betButtons[2]);

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
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.262429640/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
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
                      {
                        runnerURN: "ppb:sbkRunner:924.262429640/58805/0",
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

const BFF_CARDS_MOCK = ({ sportsbook = true, sbkMarketId = "924.262429643" } = {}) => {
  const sbkMarketUrn = `ppb:sbkMarket:${sbkMarketId}`;

  return {
    cards: [
      {
        __typename: "EventMarketCard",
        urn: "ppb:tbd:card:eventPrimaryMarket:29791283",
        eventViewLink: {
          viewUrn: "ppb:tbd:view:event:29791283",
          viewUrl: routes.getEventViewUrl("123456789"),
        },
        title: "Extra Time Result 2",
        runnerViewLinks: [
          {
            runnerUrn: "ppb:excRunner:1.170386755/2482528/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.170386755/2482528/0",
          },
        ],

        displayRunners: {
          sportsbook: sportsbook
            ? {
                market: {
                  __typename: "SportsbookMarket",
                  urn: sbkMarketUrn,
                  name: "Extra Time Result 2",
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
                    runnerURN: `ppb:sbkRunner:${sbkMarketId}/2426`,
                  },
                  {
                    runnerURN: `ppb:sbkRunner:${sbkMarketId}/58805`,
                  },
                ],
              }
            : undefined,
        },
      },
    ],
  };
};

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
        {
          selectionId: "55190",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
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

describe("EventMarketCard - Sportsbook Main Market", () => {
  describe("When the user is at a given page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_OPEN));
      await mockService.mockHttpRequest(getScaResponse({}));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.tickFakeClock();
      await browser.waitUntilDisplayed(eventMarketCardPO.inlineSportsbookMarket);
    });

    describe("and an EventMarketCard is retrieved", () => {
      describe("When SBK market closes", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED("924.262429640")));
          await mockService.mockHttpRequest(getMainMarkets(BFF_CARDS_MOCK()));
          await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_SECOND_NEW_MAIN_MARKET));
          await browser.tickFakeClock();
        });

        describe("And a new primary market is retrieved", () => {
          beforeAll(async () => {
            await browser.waitUntilEquals(firstSbkRunnerPO.secondaryLabel, "Extra Time Result Runner A");
          });

          it("[PRPI-7911] The 3 updated runners should be visible", async () => {
            expect(await firstSbkRunnerPO.secondaryLabel.getText()).toBe("Extra Time Result Runner A");
            expect(await secondSbkRunnerPO.secondaryLabel.getText()).toBe("Extra Time Result Runner B");
            expect(await thirdSbkRunnerPO.secondaryLabel.getText()).toBe("Extra Time Result Runner C");
          });

          it("[PRPI-7912] The 3 SBK bet buttons should be visible with updated odds", async () => {
            expect(await firstSbkRunnerPO.odd.getText()).toBe("2.1");
            expect(await secondSbkRunnerPO.odd.getText()).toBe("2.2");
            expect(await thirdSbkRunnerPO.odd.getText()).toBe("2.3");
          });

          describe("And SBK market closes And no more primary markets are retrieved", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED("924.262429643")));
              await mockService.mockHttpRequest(
                getMainMarkets(BFF_CARDS_MOCK({ sportsbook: false }), BFF_MAIN_MARKETS_EMPTY),
              );
              await browser.tickFakeClock();
              await browser.waitUntilEquals(firstSbkRunnerPO.odd, "-");
            });

            it("[PRPI-7913] The EventMarketCard should be visible with - status", async () => {
              expect(await firstSbkRunnerPO.odd.getText()).toBe("-");
              expect(await secondSbkRunnerPO.odd.getText()).toBe("-");
              expect(await thirdSbkRunnerPO.odd.getText()).toBe("-");
            });
          });
        });
      });
    });
  });
});
