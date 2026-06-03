const { PrimaryButtonPO, SecondaryButtonPO, FreezeCardPO } = require("../../../../page-objects");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const routes = require("../../../../../utils/routes");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const primaryButtonPO = new PrimaryButtonPO();
const secondaryButtonPO = new SecondaryButtonPO();
const freezeCardPO = new FreezeCardPO();

const MODULE_NAME = "my_bets_sbk";

const BET_INFO_ID = {
  __typename: "SportsbookBetInfoCard",
  urn: "ppb:tbd:card:sbkBetInfo:1179447017",
};

const SBK_BET_CARD_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.237747664",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:926229536",
      betReceiptId: "O/4275336/0021305",
      profitAndLoss: 0.23,
      isSettled: false,
      betType: "ACC5",
      currentSize: 0.11,
      cashoutQuote: {
        urn: "ppb:sbkCashoutQuote:926229536",
        betUrn: "ppb:sbkBet:926229536",
        quote: 0.11,
        stake: 0.11,
        betDelay: 0,
        cashOutToken: "6Nad6",
        refreshRate: 10,
        status: "AVAILABLE",
      },
      mutations: {
        eligibility: [
          {
            mutation: "AccaFreeze",
            __typename: "BetMutationEligibility",
          },
        ],

        __typename: "BetMutation",
      },
      legs: [
        {
          urn: "ppb:sbkBetLeg:926229536/0",
          type: "SS",
          legNumber: 1,
          parts: [
            {
              price: {
                decimal: 1.86,
                fractional: {
                  numerator: 43,
                  denominator: 50,
                },
              },
              marketBetUrn: "ppb:marketBet:924.237747661",
              eventDescription: "Spezia v Entella1",
              eventMarketDescription: "Match Odds",
              eventUrn: "ppb:event:33818264",
              selectionName: "Spezia1",
              startTime: "2020-07-27T19:00:00Z",
            },
          ],

          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Available",
                details: {
                  homeTeamScore: 5,
                  awayTeamScore: 1,
                },
                __typename: "BetLegMutationEligibility",
              },
            ],

            details: [],
            __typename: "BetLegMutation",
          },
        },
        {
          urn: "ppb:sbkBetLeg:926229536/1",
          type: "SS",
          legNumber: 2,
          parts: [
            {
              price: {
                decimal: 1.86,
                fractional: {
                  numerator: 43,
                  denominator: 50,
                },
              },
              marketBetUrn: "ppb:marketBet:924.237747662",
              eventDescription: "Spezia v Entella2",
              eventMarketDescription: "Match Odds",
              eventUrn: "ppb:event:33818265",
              selectionName: "Spezia2",
              startTime: "2020-07-27T19:00:00Z",
            },
          ],

          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Unavailable",
                details: {
                  homeTeamScore: 5,
                  awayTeamScore: 1,
                },
                __typename: "BetLegMutationEligibility",
              },
            ],

            details: [],
            __typename: "BetLegMutation",
          },
        },
        {
          urn: "ppb:sbkBetLeg:926229536/2",
          type: "SS",
          legNumber: 3,
          parts: [
            {
              price: {
                decimal: 1.86,
                fractional: {
                  numerator: 43,
                  denominator: 50,
                },
              },
              marketBetUrn: "ppb:marketBet:924.237747663",
              eventDescription: "Spezia v Entella3",
              eventMarketDescription: "Match Odds",
              eventUrn: "ppb:event:33818266",
              selectionName: "Spezia3",
              startTime: "2020-07-27T19:00:00Z",
            },
          ],

          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Suspended",
                details: {
                  homeTeamScore: 5,
                  awayTeamScore: 1,
                },
                __typename: "BetLegMutationEligibility",
              },
            ],

            details: [],
            __typename: "BetLegMutation",
          },
        },
        {
          urn: "ppb:sbkBetLeg:926229536/3",
          type: "SS",
          legNumber: 4,
          parts: [
            {
              price: {
                decimal: 1.86,
                fractional: {
                  numerator: 43,
                  denominator: 50,
                },
              },
              marketBetUrn: "ppb:marketBet:924.237747664",
              eventDescription: "Spezia v Entella4",
              eventMarketDescription: "Match Odds",
              eventUrn: "ppb:event:33818267",
              selectionName: "Spezia4",
              startTime: "2020-07-27T19:00:00Z",
            },
          ],

          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Unavailable",
                details: {
                  homeTeamScore: 5,
                  awayTeamScore: 1,
                },
                __typename: "BetLegMutationEligibility",
              },
            ],

            details: [],
            __typename: "BetLegMutation",
          },
        },
        {
          urn: "ppb:sbkBetLeg:926229536/4",
          type: "SS",
          result: "PLACED",
          legNumber: 5,
          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Available",
                details: {
                  homeTeamScore: 5,
                  awayTeamScore: 1,
                },
                __typename: "BetLegMutationEligibility",
              },
            ],

            details: [],
            __typename: "BetLegMutation",
          },
          parts: [
            {
              price: {
                decimal: 1.86,
                fractional: {
                  numerator: 43,
                  denominator: 50,
                },
              },
              marketBetUrn: "ppb:marketBet:924.237747665",
              eventDescription: "Spezia v Entella5",
              eventMarketDescription: "Match Odds",
              eventUrn: "ppb:event:33818268",
              selectionName: "Spezia5",
              startTime: "2020-07-27T19:00:00Z",
            },
          ],
        },
      ],
    },
  },
};

const SBK_BET_CARD_PARTIAL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
  },
};

const SBK_BET_CARD_BET_LEG = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:926229536/0",
  ...SBK_BET_CARD_FULL.node.bet.legs[0],
};

const SBK_BET_CARD_BET_LEG2 = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:926229536/0",
  ...SBK_BET_CARD_FULL.node.bet.legs[1],
};

const SBK_BET_CARD_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:926229536",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                    betUrn: "ppb:sbkBet:926229536",
                    leg: SBK_BET_CARD_BET_LEG,
                  },
                },
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                    betUrn: "ppb:sbkBet:926229536",
                    leg: SBK_BET_CARD_BET_LEG2,
                  },
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                  },
                },
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                  },
                },
              ],
            },
          },
        },
        { node: BET_INFO_ID },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
          },
        },
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
          },
        },
        { node: BET_INFO_ID },
      ],
    },
  },
};

const SBK_BET_CARD_EXPANDABLE_PARTIAL = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:926229536",
  },
};

const EVENT_HEADER_CARDS_PARTIAL = [
  {
    node: {
      __typename: "EventHeaderCard",
      urn: "ppb:tbd:card:eventHeader:926229536/0",
    },
  },
  {
    node: {
      __typename: "EventHeaderCard",
      urn: "ppb:tbd:card:eventHeader:926229536/1",
    },
  },
  {
    node: {
      __typename: "EventHeaderCard",
      urn: "ppb:tbd:card:eventHeader:926229536/2",
    },
  },
  {
    node: {
      __typename: "EventHeaderCard",
      urn: "ppb:tbd:card:eventHeader:926229536/3",
    },
  },
  {
    node: {
      __typename: "EventHeaderCard",
      urn: "ppb:tbd:card:eventHeader:926229536/4",
    },
  },
];

const EVENT_HEADER_CARDS_FULL = [
  {
    node: {
      __typename: "EventHeaderCard",
      urn: "ppb:tbd:card:eventHeader:926229536/0",
      title: "Manchester United vs Stockport County",
      tertiaryTitle: "English Premier League",
      sportId: "1",
      date: "2021-03-24T17:05:00Z",
    },
  },
  {
    node: {
      __typename: "EventHeaderCard",
      urn: "ppb:tbd:card:eventHeader:926229536/1",
      title: "Manchester United2 vs Stockport County2",
      tertiaryTitle: "English Premier League",
      sportId: "1",
      date: "2021-03-24T17:05:00Z",
    },
  },
  {
    node: {
      __typename: "EventHeaderCard",
      urn: "ppb:tbd:card:eventHeader:926229536/2",
      title: "Manchester United3 vs Stockport County3",
      tertiaryTitle: "English Premier League",
      sportId: "1",
      date: "2021-03-24T17:05:00Z",
    },
  },
  {
    node: {
      __typename: "EventHeaderCard",
      urn: "ppb:tbd:card:eventHeader:926229536/3",
      title: "Manchester United4 vs Stockport County4",
      tertiaryTitle: "English Premier League",
      sportId: "1",
      date: "2021-03-24T17:05:00Z",
    },
  },
  {
    node: {
      __typename: "EventHeaderCard",
      urn: "ppb:tbd:card:eventHeader:926229536/4",
      title: "Manchester United5 vs Stockport County5",
      tertiaryTitle: "English Premier League",
      sportId: "1",
      date: "2021-03-24T17:05:00Z",
    },
  },
];

const FIXTURE_CARD_FULL = [
  {
    node: {
      __typename: "FixtureCard",
      urn: "ppb:tbd:card:fixture:33818264|viewLink|0",
      fixtureStatus: "IN_PLAY",
      fixture: {
        __typename: "FootballFixture",
        urn: "ppb:fixture:33818264",
        fixtureStatus: "IN_PLAY",
        status: "IN_PLAY",
        home: {
          name: "Sporting Lisbon",
          color: "ffffff",
          crest: null,
        },
        away: {
          name: "Rio Ave",
          color: "ffffff",
          crest: null,
        },
        isAmericanFormat: "false",
        runnerNames: null,
        scheduledAt: "2023-08-27T15:30:00Z",
        startedAt: "2023-08-27T15:30:00Z",
        score: {
          home: 5,
          away: 1,
        },
        firstLegScore: null,
        duration: {
          period: "REGULAR",
          status: "IN_PLAY",
          clock: null,
          stoppageMinutes: null,
        },
        penaltyShootout: null,
      },
      fixtureEventViewLink: {
        viewUrn: "ppb:tbd:view:event:33818264",
        viewUrl: "football/portuguese-primeira-liga/benfica-v-porto/match-odds/e-1111111111",
      },
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:33818264",
        eventId: 33818264,
        name: "Sporting Lisbon v Rio Ave",
        openDate: "2023-08-27T15:30:00.000Z",
        fixtureStatus: "IN_PLAY",
        competition: {
          __typename: "Competition",
          urn: "ppb:competition:10932509",
          name: "Sporting Lisbon v Rio Ave",
          competitionId: 10932509,
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            sportId: 1,
          },
        },
      },
      availableToSubscribe: "false",
    },
  },
  {
    node: {
      __typename: "FixtureCard",
      urn: "ppb:tbd:card:fixture:33818265|viewLink|0",
      fixtureStatus: "IN_PLAY",
      fixture: {
        __typename: "FootballFixture",
        urn: "ppb:fixture:33818265",
        fixtureStatus: "IN_PLAY",
        status: "IN_PLAY",
        home: {
          name: "Sporting Lisbon",
          color: "ffffff",
          crest: null,
        },
        away: {
          name: "Rio Ave",
          color: "ffffff",
          crest: null,
        },
        isAmericanFormat: "false",
        runnerNames: null,
        scheduledAt: "2023-08-27T15:30:00Z",
        startedAt: "2023-08-27T15:30:00Z",
        score: {
          home: 5,
          away: 1,
        },
        firstLegScore: null,
        duration: {
          period: "REGULAR",
          status: "IN_PLAY",
          clock: null,
          stoppageMinutes: null,
        },
        penaltyShootout: null,
      },
      fixtureEventViewLink: {
        viewUrn: "ppb:tbd:view:event:33818265",
        viewUrl: "football/portuguese-primeira-liga/benfica-v-porto/match-odds/e-1111111111",
      },
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:33818265",
        eventId: 33818264,
        name: "Sporting Lisbon v Rio Ave",
        openDate: "2023-08-27T15:30:00.000Z",
        fixtureStatus: "IN_PLAY",
        competition: {
          __typename: "Competition",
          urn: "ppb:competition:10932509",
          name: "Sporting Lisbon v Rio Ave",
          competitionId: 10932509,
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            sportId: 1,
          },
        },
      },
      availableToSubscribe: "false",
    },
  },
];

const FIXTURE_CARD_PARTIALS = [
  {
    node: {
      __typename: "FixtureCard",
      urn: "ppb:tbd:card:fixture:33818264|viewLink|0",
    },
  },
  {
    node: {
      __typename: "FixtureCard",
      urn: "ppb:tbd:card:fixture:33818265|viewLink|0",
    },
  },
];

const BETCARD_GROUP_CARDS_SBK_FULL = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1000000001",
    full: {
      edges: [SBK_BET_CARD_FULL, SBK_BET_CARD_EXPANDABLE, ...EVENT_HEADER_CARDS_FULL, ...FIXTURE_CARD_FULL],
    },
    partials: {
      partialEdges: [
        SBK_BET_CARD_PARTIAL,
        SBK_BET_CARD_EXPANDABLE_PARTIAL,
        ...EVENT_HEADER_CARDS_PARTIAL,
        ...FIXTURE_CARD_PARTIALS,
      ],
    },
  },
};

const BFF_MY_BETS_MOCK_SBK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [BETCARD_GROUP_CARDS_SBK_FULL],
  headerItems: HEADER_ITEMS_MOCK,
};

const SCA_RESPONSE = {
  fixture: [
    {
      eventId: "33818264",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 1,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 43,
          second: 56,
        },
      },
      penaltyShootout: null,
      stats: [
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          home: {
            goals: 1,
          },
          away: {
            goals: 0,
          },
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_SECOND_HALF",
          home: {
            goals: 1234,
          },
          away: {
            goals: 0,
          },
        },
      ],
    },
    {
      eventId: "33818265",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 1,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 43,
          second: 56,
        },
      },
      penaltyShootout: null,
      stats: [
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          home: {
            goals: 1,
          },
          away: {
            goals: 0,
          },
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_SECOND_HALF",
          home: {
            goals: 1234,
          },
          away: {
            goals: 0,
          },
        },
      ],
    },
  ],
};

describe("My Bets Page - Acca Freeze", () => {
  describe("when the user opens the my bets page and has an sbk card with acca freeze with selection available to freeze", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MY_BETS_MOCK_SBK.urn, { products: ["sportsbook"] }));
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_SBK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await mockService.mockHttpRequest(getScaResponse(SCA_RESPONSE));
      await browser.url(routes.getMyBetsViewUrl("open"));
      await browser.waitUntilDisplayed(primaryButtonPO.element);

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1431]_should_see_my_bets_page_with_acca_freeze_with_selection_to_freeze`,
      );
    });

    it("[PRPI-1431]_should_see_my_bets_page_with_acca_freeze_with_selection_to_freeze", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1431]_should_see_my_bets_page_with_acca_freeze_with_selection_to_freeze`,
        ),
      ).toBe(0);
    });

    it("[PRPI-1432]_should_show_freeze_drawer_when_freeze_selection_button_is_clicked", async () => {
      await secondaryButtonPO.element.click();
      await browser.waitUntilDisplayed(freezeCardPO.element);

      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1432]_should_show_freeze_drawer_when_freeze_selection_button_is_clicked`,
        ),
      ).toBe(0);
    });
  });
});
