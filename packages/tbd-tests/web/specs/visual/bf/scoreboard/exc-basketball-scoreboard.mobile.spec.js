const { ExchangeMarketPO } = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const exchangeMarketPO = new ExchangeMarketPO();

const MODULE_NAME = "basketball-scoreboard";

// Mock fragments
const EVENT_ID = 31237287;

const EXC_RUNNERS = new Array(15).fill({ runnerURN: "ppb:excRunner:1.160337366/1/0" });

const SPORT_EVENT = {
  urn: `ppb:event:${EVENT_ID}`,
  name: "Los Angeles Lakers @ Chicago Bulls",
  competition: { urn: "ppb:competition:11111", name: "NBA" },
};

const FIXTURE_AMERICAN_FORMAT = {
  __typename: "BasketballFixture",
  urn: `ppb:fixture:${EVENT_ID}`,
  isAmericanFormat: true,
  runnerNames: {
    home: "Chicago Bulls",
    away: "Los Angeles Lakers",
  },
};

const FIXTURE_NOT_AMERICAN_FORMAT = {
  ...FIXTURE_AMERICAN_FORMAT,
  isAmericanFormat: false,
};

const SCA_FIXTURE = {
  id: EVENT_ID,
  periodClock: "UNKNOWN_PERIOD",
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

// Mocks
const BFF_AMERICAN_FORMAT_MOCK = {
  __typename: "EventView",
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        fixture: FIXTURE_AMERICAN_FORMAT,
        sportevent: SPORT_EVENT,
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              runners: EXC_RUNNERS,
            },
            runners: EXC_RUNNERS,
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        __typename: "MarketCard",
      },
    },
  ],

  sportevent: SPORT_EVENT,
};

const BFF_NOT_AMERICAN_FORMAT_MOCK = {
  ...BFF_AMERICAN_FORMAT_MOCK,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        fixture: FIXTURE_NOT_AMERICAN_FORMAT,
        sportevent: SPORT_EVENT,
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              runners: EXC_RUNNERS,
            },
            runners: EXC_RUNNERS,
          },
        },
      },
    },
  ],
};

const ERO_MOCK = [{}];

const SMP_MOCK = {
  markets: [],
};

const SCA_MOCK = {
  fixture: [SCA_FIXTURE],
};

const SCA_UPDATE_MOCK = {
  fixture: [{ ...SCA_FIXTURE, periodClock: "PERIOD_1", segmentClock: "Q1" }],
};

const SCA_UPDATE_FULL_TIME_MOCK = {
  fixture: [{ ...SCA_FIXTURE, periodClock: "END", timeElapsedClock: 600 }],
};

describe("Basketball Scoreboards", () => {
  describe("When at the event view and the game is in pre match", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_AMERICAN_FORMAT_MOCK.urn, { disableCSSAnimations: true }),
      );
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getEventLayout(BFF_AMERICAN_FORMAT_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1539]_1should_display_basketball_default_scoreboard_with_start_date`,
      );
    });

    it("[PRPI-1539]_1should_display_basketball_default_scoreboard_with_start_date", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1539]_1should_display_basketball_default_scoreboard_with_start_date`,
        ),
      ).toEqual(0);
    });

    describe("and then the status changes to inplay", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_UPDATE_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1540]_2should_display_basketball_default_scoreboard_with_inplay_status`,
        );
      });

      it("[PRPI-1540]_2should_display_basketball_default_scoreboard_with_inplay_status", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1540]_2should_display_basketball_default_scoreboard_with_inplay_status`,
          ),
        ).toEqual(0);
      });

      xdescribe("and when scrolling", () => {
        beforeAll(async () => {
          await exchangeMarketPO.element.scrollIntoView({ behavior: "smooth", inline: "end" });
          await mockService.mockHttpRequest(getScaResponse(SCA_UPDATE_MOCK));
          await browser.tickFakeClock();

          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1541]_3should_display_sticky_basketball_small_scoreboard_with_inplay_status`,
          );
        });

        it("[PRPI-1541]_3should_display_sticky_basketball_small_scoreboard_with_inplay_status", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1541]_3should_display_sticky_basketball_small_scoreboard_with_inplay_status`,
            ),
          ).toEqual(0);
        });

        describe("and then the game ends", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getScaResponse(SCA_UPDATE_FULL_TIME_MOCK));
            await browser.tickFakeClock();
            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-1542]_4should_display_sticky_basketball_small_scoreboard_with_final_score_status`,
            );
          });

          it("[PRPI-1542]_4should_display_sticky_basketball_small_scoreboard_with_final_score_status", async () => {
            expect(
              await browser.checkScreen(
                `${MODULE_NAME}_[PRPI-1542]_4should_display_sticky_basketball_small_scoreboard_with_final_score_status`,
              ),
            ).toEqual(0);
          });
        });
      });
    });
  });

  describe("when a basketball fixture is not in american format", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_NOT_AMERICAN_FORMAT_MOCK.urn, { disableCSSAnimations: true }),
      );
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getEventLayout(BFF_NOT_AMERICAN_FORMAT_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_UPDATE_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1543]_should_not_display_inverted_scoreboard`);
    });

    it("[PRPI-1543]_should_not_display_inverted_scoreboard", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1543]_should_not_display_inverted_scoreboard`)).toEqual(0);
    });
  });
});
