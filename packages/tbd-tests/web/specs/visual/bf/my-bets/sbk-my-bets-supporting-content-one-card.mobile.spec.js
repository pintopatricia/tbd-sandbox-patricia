const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { CardPO } = require("../../../../page-objects");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const MODULE_NAME = "my_bets_sbk";
const mockService = new MockService();

const firstSbkBetCardPO = new CardPO();

const EVENT_ID = 100;

const SBK_BET_INFO_CARD_PARTIAL = {
  __typename: "SportsbookBetInfoCard",
  urn: "ppb:tbd:card:sbkBetInfo:1179447017",
};

const SBK_BET_LEG = {
  __typename: "BetLeg",
  urn: `ppb:sbkBetLeg:90/0`,
  leg: {
    type: "SS",
    result: "LOSING",
    resultType: "POTENTIAL",
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
        eventDescription: "AD Marco 09 v Vitória SC B",
        eventMarketDescription: "Match Odds",
        selectionName: "AD Marco 09",
        startTime: "2020-07-27T19:00:00.000Z",
        priceType: "LIVE",
      },
    ],
  },
};

const STATS_MATCH_CARD = {
  displayName: {
    translationKey: "I18N.INPLAY.COUPON.MATCH.STATS.PEBBLE",
    __typename: "DisplayNameTranslationKey",
  },
  node: {
    __typename: "StatsMatchStatsCard",
    urn: "ppb:tbd:stats:card:matchStats:1",
    fixture: {
      urn: "ppb:fixture:1",
      stats: [
        {
          periodStatus: "FULL",
          home: {
            attacks: 10,
            dangerousAttacks: 0,
            possession: 50,
            corners: 1,
            yellowCards: 0,
            redCards: 0,
            shotsOnTarget: 1,
            shotsOffTarget: 0,
            __typename: "FootballGameStats",
          },
          away: {
            attacks: 15,
            dangerousAttacks: 0,
            possession: 50,
            corners: 3,
            yellowCards: 0,
            redCards: 0,
            shotsOnTarget: 2,
            shotsOffTarget: 3,
            __typename: "FootballGameStats",
          },
          __typename: "FootballStats",
        },
      ],

      __typename: "FootballFixture",
    },
  },
  __typename: "StatsSupportingContentButtonsCardEdge",
};

const STATS_SUPPORTING_CONTENT_BUTTONS = {
  __typename: "StatsSupportingContentButtonsCardGroup",
  urn: "ppb:tbd:stats:cardgroup:supportingContentButtons:1|1|my-bets",
  full: {
    edges: [STATS_MATCH_CARD],
    __typename: "StatsSupportingContentButtonsLayoutItemsConnection",
  },
  partials: {
    edges: [STATS_MATCH_CARD],
    __typename: "StatsSupportingContentButtonsLayoutItemsConnection",
  },
};

const SBK_BET_CARDS_EXPANDABLE_PARTIAL_MOCK = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: `ppb:tbd:card:group:sbkExpandableLeg:${EVENT_ID}`,
  },
};

const SBK_BET_CARD_FULL_MOCK = {
  node: {
    __typename: "SportsbookBetCard",
    urn: `ppb:tbd:card:sbkBet:${EVENT_ID}`,
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.237747664",
      },
    ],

    bet: {
      urn: `ppb:sbkBet:${EVENT_ID}`,
      betReceiptId: "O/4275336/0021305",
      profitAndLoss: 0.22,
      isSettled: false,
      betType: "SGL",
      currentSize: 0.12,
      result: "CASHED_OUT",
      legs: [SBK_BET_LEG],
    },
  },
};

const SBK_BET_CARD_PARTIAL_MOCK = {
  node: {
    __typename: "SportsbookBetCard",
    urn: `ppb:tbd:card:sbkBet:${EVENT_ID}`,
  },
};

const SBK_BET_CARD_SCOREBOARD_FIXTURE_MOCK = {
  node: {
    __typename: "FixtureCard",
    urn: `ppb:tbd:card:fixture:${EVENT_ID}|viewLink|0`,
    sportevent: { urn: `ppb:event:${EVENT_ID}`, name: "AD Marco 09 v Vitória SC B" },
    scheduledAt: "2020-07-27T19:00:00Z",
    fixtureEventViewLink: {
      viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
      viewUrl: "football/argentinian-reserves/ca-lanus-(res)-v-ca-union-santa-fe-(res)/e-30744688",
    },
    fixture: {
      urn: `ppb:fixture:${EVENT_ID}`,
      home: { name: "AD Marco 09" },
      away: { name: "Vitória SC B" },
      score: {
        home: 1,
        away: 1,
      },
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
      },
    },
  },
};

const SBK_BET_CARD_SCOREBOARD_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: `ppb:tbd:card:group:sbkExpandableLeg:${EVENT_ID}`,
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: `ppb:tbd:card:sbkBetLeg:${EVENT_ID}/0`,
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: `ppb:tbd:card:sbkBetLeg:${EVENT_ID}/0`,
                    betUrn: `ppb:sbkBet:${EVENT_ID}`,
                    leg: SBK_BET_LEG,
                  },
                },
                SBK_BET_CARD_SCOREBOARD_FIXTURE_MOCK,
                { node: STATS_SUPPORTING_CONTENT_BUTTONS },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: `ppb:tbd:card:sbkBetLeg:${EVENT_ID}/0`,
                  },
                },
                {
                  node: {
                    __typename: "FixtureCard",
                    urn: `ppb:tbd:card:fixture:${EVENT_ID}|viewLink|0`,
                  },
                },
                {
                  node: {
                    __typename: "StatsSupportingContentButtonsCardGroup",
                    urn: `ppb:tbd:stats:cardgroup:supportingContentButtons:1|1|my-bets`,
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            ...SBK_BET_INFO_CARD_PARTIAL,
            betReceiptId: "O/4275336/0021305",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: `ppb:tbd:card:sbkBetLeg:${EVENT_ID}/0`,
          },
        },
        { node: SBK_BET_INFO_CARD_PARTIAL },
      ],
    },
  },
};

const BFF_MY_BETS_MOCK_SCOREBOARD = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [
    {
      node: {
        __typename: "BetCardGroup",
        urn: `ppb:tbd:card:bet:group:${EVENT_ID}|sbk`,
        full: {
          edges: [SBK_BET_CARD_FULL_MOCK, SBK_BET_CARD_SCOREBOARD_EXPANDABLE],
        },
        partials: {
          partialEdges: [SBK_BET_CARD_PARTIAL_MOCK, SBK_BET_CARDS_EXPANDABLE_PARTIAL_MOCK],
        },
      },
    },
  ],
  headerItems: HEADER_ITEMS_MOCK,
};

describe("My Bets Page (Open Bets) - Supporting Content", () => {
  describe("When the user has a Football open bet", () => {
    describe("and only stats are available for the event", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_MY_BETS_MOCK_SCOREBOARD.urn, { products: ["sportsbook"] }),
        );
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_SCOREBOARD));
        await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
        await browser.url(routes.getMyBetsViewUrl("open"));

        // open accordion
        await browser.waitUntilInViewport(firstSbkBetCardPO.header);
        await firstSbkBetCardPO.header.click();
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1471]_should_be_displayed_the_Stats_button_bellow_the_fixture_card`,
        );
      });

      it("[PRPI-1471]_should_be_displayed_the_Stats_button_bellow_the_fixture_card", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1471]_should_be_displayed_the_Stats_button_bellow_the_fixture_card`,
          ),
        ).toBe(0);
      });
    });
  });
});
