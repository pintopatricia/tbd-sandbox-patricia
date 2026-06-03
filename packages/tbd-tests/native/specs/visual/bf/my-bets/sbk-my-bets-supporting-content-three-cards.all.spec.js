const { getAppContext, getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { CardSO, BottomBarSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const MODULE_NAME = "my_bets_page";
const mockService = new MockService();

const firstSbkBetCardSO = new CardSO();

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

const INCIDENTS_CARD = {
  displayName: {
    translationKey: "I18N.STATS.EVENTS_PEBBLE",
    __typename: "DisplayNameTranslationKey",
  },
  node: {
    __typename: "IncidentsCard",
    urn: "ppb:tbd:card:incidents:1|pebble",
    showEmptyState: true,
    fixture: {
      urn: "ppb:fixture:1",
      incidents: [],
      __typename: "FootballFixture",
    },
  },
  __typename: "StatsSupportingContentButtonsCardEdge",
};

const LIVE_VIDEO_CARD = {
  displayName: {
    translationKey: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
    __typename: "DisplayNameTranslationKey",
  },
  node: {
    __typename: "StatsBroadcastsCard",
    urn: "ppb:tbd:stats:card:broadcasts:1|1|livevideo",
  },
  __typename: "StatsSupportingContentButtonsCardEdge",
};

const STATS_SUPPORTING_CONTENT_BUTTONS = {
  __typename: "StatsSupportingContentButtonsCardGroup",
  urn: "ppb:tbd:stats:cardgroup:supportingContentButtons:1|1|my-bets",
  full: {
    edges: [STATS_MATCH_CARD, INCIDENTS_CARD],
    __typename: "StatsSupportingContentButtonsLayoutItemsConnection",
  },
  partials: {
    edges: [STATS_MATCH_CARD, INCIDENTS_CARD, LIVE_VIDEO_CARD],
    __typename: "StatsSupportingContentButtonsLayoutItemsConnection",
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
  url: "mybets/myBets-open",
  edges: [
    {
      node: {
        __typename: "BetCardGroup",
        urn: `ppb:tbd:card:bet:group:${EVENT_ID}|sbk`,
        full: {
          edges: [SBK_BET_CARD_FULL_MOCK, SBK_BET_CARD_SCOREBOARD_EXPANDABLE],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "SportsbookBetCard",
                urn: `ppb:tbd:card:sbkBet:${EVENT_ID}`,
              },
            },
            {
              node: {
                __typename: "SportsbookExpandableLegCardGroup",
                urn: `ppb:tbd:card:group:sbkExpandableLeg:${EVENT_ID}`,
              },
            },
          ],
        },
      },
    },
  ],
  headerItems: HEADER_ITEMS_MOCK,
};

describe("My Bets Page (Open Bets) - Supporting Content", () => {
  describe("When the user has a Football open bet", () => {
    describe("and the stats, incidents events and live video are available for the event", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"] }));
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_SCOREBOARD));
        await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
        await startApp("home");
        await BottomBarSO.myBets.waitForDisplayed();
        await BottomBarSO.myBets.click();
        // open accordion
        await browser.waitUntilClickableNative(firstSbkBetCardSO.header, "First Bet Card is not clickable");
        await firstSbkBetCardSO.header.click();
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-4864]_should_be_displayed_the_Stats_Events_and_Live_Video_buttons_bellow_the_fixture_card`,
        );
      });

      it("[PRPI-4864]_should_be_displayed_the_Stats_Events_and_Live_Video_buttons_bellow_the_fixture_card", async () => {
        expect(
          (
            await browser.compareScreen(
              `${MODULE_NAME}_[PRPI-4864]_should_be_displayed_the_Stats_Events_and_Live_Video_buttons_bellow_the_fixture_card`,
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
