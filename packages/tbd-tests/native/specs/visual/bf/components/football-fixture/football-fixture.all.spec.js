const {
  getAppContext,
  getGenericLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getNSSRegister, getNSSSubscribe } = require("@ppb/tbd-shared/mocks/nss/nss.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { AvBFixtureSO, ScoreSO, PebbleListSO, SnackbarSO } = require("../../../../../screen-objects");

const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const MockService = require("../../../../../mock-essentials/mocking-service");

const scoreSO = new ScoreSO();
const notificationSO = new PebbleListSO();

const mockService = new MockService();

const avbFixtureSO = new AvBFixtureSO();

const snackbarSO = new SnackbarSO();

const CARD_NAME = "football-fixture";
const EVENT_ID = "29682729";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
    competition: { urn: "ppb:competition:12345", name: "English Premier League" },
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        availableToSubscribe: true,
        urn: `ppb:tbd:card:fixture:${EVENT_ID}|0|availableToSubscribe`,
        away: "Portugal",
        home: "Ukraine",
        sportevent: {
          __typename: "SportsEvent",
          name: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45Z",
          urn: `ppb:event:${EVENT_ID}`,
          competition: { urn: "ppb:competition:12345", name: "English Premier League" },
        },
        fixture: {
          __typename: "FootballFixture",
          urn: `ppb:fixture:${EVENT_ID}`,
          home: { name: "Ukraine" },
          away: { name: "Portugal" },
          scheduledAt: "2010-10-14T18:45Z",
          duration: {
            period: "REGULAR",
            status: "INPLAY_FIRST_HALF",
            clock: {
              minute: 20,
              second: 4,
            },
          },
          score: {
            home: 2,
            away: 1,
          },
          stats: [
            {
              periodStatus: "FULL",
              period: null,
              home: {
                redCards: 2,
              },
              away: {
                redCards: 1,
              },
            },
            {
              periodStatus: "INPLAY_FIRST_HALF",
              period: "REGULAR",
              home: {
                redCards: 1,
              },
              away: {
                redCards: 1,
              },
            },
            {
              periodStatus: "FULL",
              period: "REGULAR",
              home: {
                redCards: 0,
              },
              away: {
                redCards: 1,
              },
            },
          ],

          firstLegScore: {
            home: 1,
            away: 0,
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}|0|availableToSubscribe`,
      },
    },
  ],
};

const SCA_PENALTY_SHOOTOUT_INPLAY_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {
        home: 4,
        away: 4,
      },
      duration: {
        period: "EXTRA",
        status: "PENALTY_SHOOTOUT",
        clock: {
          minute: 120,
          second: 0,
        },
      },
      penaltyShootout: {
        firstTeamToShoot: "HOME",
        nextTeamToShoot: "HOME",
        penaltyScores: [
          {
            penaltyNumber: 1,
            side: "HOME",
            shotResult: "SCORE",
          },
          {
            penaltyNumber: 1,
            side: "AWAY",
            shotResult: "MISS",
          },
        ],
      },
      stats: [
        {
          periodStatus: "FULL",
          period: null,
          home: {
            redCards: 5,
          },
          away: {
            redCards: 4,
          },
        },
        {
          periodStatus: "INPLAY_FIRST_HALF",
          period: "REGULAR",
          home: {
            redCards: 2,
          },
          away: {
            redCards: 3,
          },
        },
        {
          periodStatus: "FULL",
          period: "REGULAR",
          home: {
            redCards: 4,
          },
          away: {
            redCards: 1,
          },
        },
      ],
    },
  ],
};

describe("FootballFixture", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({}));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getNSSRegister());
    await mockService.mockHttpRequest(getNSSSubscribe({}));

    const HOME_VIEW_LINK = getStartViewLink("sport/competition/event/e-29682729");
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(snackbarSO.element);
    await snackbarSO.closeButton.click();
    await browser.waitUntilDisplayed(avbFixtureSO.element);
  });

  describe("When the user open the app on an event", () => {
    beforeAll(async () => {
      await notificationSO.element.waitForDisplayed({ reverse: true, withinViewport: true });

      await browser.pause(2000); // wait for app to stabilise
      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4913]_should_render_football_fixture`);
    });

    it("[PRPI-4913]_should_render_football_fixture", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4913]_should_render_football_fixture`)).misMatchPercentage,
      ).toEqual(0);
    });

    describe("Then game goes into penalty shootout state", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_PENALTY_SHOOTOUT_INPLAY_MOCK));
        await browser.waitUntilEquals(scoreSO.teamAScores[0], "4");
        await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4914]_should_render_football_fixture_with_penalties`);
      });

      it("[PRPI-4914]_should_render_football_fixture_with_penalties", async () => {
        expect(
          (await browser.compareScreen(`${CARD_NAME}_[PRPI-4914]_should_render_football_fixture_with_penalties`))
            .misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
