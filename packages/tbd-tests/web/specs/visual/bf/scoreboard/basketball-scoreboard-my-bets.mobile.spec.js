const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const MODULE_NAME = "basketball-scoreboard";

const EVENT_ID = 31237287;
const ERO = [{}];
const SMP = {
  markets: [],
};

const SBK_BET_LEG_CARD_GROUP = {
  node: {
    __typename: "SportsbookBetLegCardGroup",
    urn: `ppb:tbd:card:sbkBetLeg:${EVENT_ID}/0`,
    full: {
      edges: [
        {
          node: {
            __typename: "FixtureCard",
            urn: `ppb:tbd:card:fixture:${EVENT_ID}|viewLink|0`,
            sportevent: {
              urn: `ppb:event:${EVENT_ID}`,
              name: "Chicago Bulls v Los Angeles Lakers with long name!",
              competition: { name: "NBA" },
            },
            fixture: {
              id: EVENT_ID,
              __typename: "BasketballFixture",
              urn: `ppb:fixture:${EVENT_ID}`,
              isAmericanFormat: true,
              runnerNames: {
                home: "Chicago Bulls",
                away: "Los Angeles Lakers with long name!",
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
            __typename: "FixtureCard",
            urn: `ppb:tbd:card:fixture:${EVENT_ID}|viewLink|0`,
          },
        },
      ],
    },
  },
};

const BFF = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  edges: [
    {
      node: {
        __typename: "BetCardGroup",
        urn: `ppb:tbd:card:bet:group:${EVENT_ID}|sbk`,
        full: {
          edges: [SBK_BET_LEG_CARD_GROUP],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "SportsbookBetLegCardGroup",
                urn: `ppb:tbd:card:group:sbkBetLeg:${EVENT_ID}`,
              },
            },
          ],
        },
      },
    },
  ],
  headerItems: HEADER_ITEMS_MOCK,
};

const FIXTURE = {
  id: EVENT_ID,
  segmentClock: "OT",
  periodClock: "OVERTIME",
  timeElapsedClock: 100,
  timeRemainingClock: 0,
  periodScores: [
    {
      score: { home: 13, away: 20 },
      period: "PERIOD_1",
      segment: null,
    },
    {
      score: { home: 26, away: 32 },
      period: "PERIOD_2",
      segment: null,
    },
    {
      score: { home: 20, away: 27 },
      period: "PERIOD_3",
      segment: null,
    },
    {
      score: { home: 21, away: 26 },
      period: "PERIOD_4",
      segment: null,
    },
  ],

  homeScore: 80,
  awayScore: 105,
};

const SCA = {
  fixture: [FIXTURE],
};

const SCA_UPDATE = {
  fixture: [{ ...FIXTURE, periodClock: "END", segmentClock: "Q1" }],
};
describe("Basketball Scoreboards", () => {
  describe("When at my bets page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF.urn, { disableCSSAnimations: true }));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMyBetsLayout(BFF));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await mockService.mockHttpRequest(getMarkets(ERO));
      await mockService.mockHttpRequest(getMarketPrices(SMP));
      await mockService.mockHttpRequest(getScaResponse(SCA));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1537]_my-bets-1should_display_basketball_small_scoreboard_with_overtime_status`,
      );
    });

    describe("and the game is in overtime", () => {
      it("[PRPI-1537]_my-bets-1should_display_basketball_small_scoreboard_with_overtime_status", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1537]_my-bets-1should_display_basketball_small_scoreboard_with_overtime_status`,
          ),
        ).toEqual(0);
      });

      describe("and then the game ends", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_UPDATE));
          await browser.tickFakeClock();
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1538]_my-bets-2should_display_basketball_small_scoreboard_with_final_score_status`,
          );
        });

        it("[PRPI-1538]_my-bets-2should_display_basketball_small_scoreboard_with_final_score_status", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1538]_my-bets-2should_display_basketball_small_scoreboard_with_final_score_status`,
            ),
          ).toEqual(0);
        });
      });
    });
  });
});
