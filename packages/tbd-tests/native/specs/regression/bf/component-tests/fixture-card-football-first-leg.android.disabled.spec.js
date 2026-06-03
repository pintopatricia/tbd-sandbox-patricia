const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { FootballScoreboardSO, ScoreSO, FootballScoreSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const footballScoreboardSO = new FootballScoreboardSO();
const footballScoreSO = new FootballScoreSO(footballScoreboardSO.element);
const scoreSO = new ScoreSO();

const mockService = new MockService();

const EVENT_ID = "29682729";

const BFF_VIEW_MOCK = {
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
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        away: "Portugal",
        home: "Ukraine",
        sportevent: {
          eventName: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45Z",
          urn: `ppb:event:${EVENT_ID}`,
          __typename: "SportsEvent",
          competition: { urn: "ppb:competition:12345", name: "English Premier League" },
        },
        fixture: {
          urn: `ppb:fixture:${EVENT_ID}`,
          home: { name: "Ukraine" },
          away: { name: "Portugal" },
          scheduledAt: "2010-10-14T18:45Z",
          duration: {},
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
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
      },
    },
  ],
};

const SCA_PRE_MATCH_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {},
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
        clock: null,
      },
      firstLegScore: {
        home: 1,
        away: 0,
      },
    },
  ],
};

const SCA_INPLAY_FIRST_HALF_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {
        home: 2,
        away: 2,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        clock: {
          minute: 0,
          second: 1,
        },
      },
    },
  ],
};

describe("Normal Scoreboard - 1st Leg", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
    const url = `football/whiskas/saquetas/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(footballScoreSO.element);
  });

  describe("When the user is in a pre-match event view with the first leg on the Scoreboard", () => {
    beforeAll(async () => {
      await browser.waitUntilEquals(footballScoreSO.firstLeg, "1ST LEG:  1-0");
    });

    it("[PRPI-2013] The first leg score should display:`1ST LEG: 1-0`", async () => {
      expect(await footballScoreSO.firstLeg.getText()).toBe("1ST LEG:  1-0");
    });

    describe("And when the event starts and goals are scored", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_MOCK));
        await browser.waitUntilEquals(scoreSO.teamAScores[0], "2");
      });

      it("[PRPI-2014] The score should display `2-2`", async () => {
        expect(await scoreSO.teamAScores[0].getText()).toBe("2");
        expect(await scoreSO.teamBScores[0].getText()).toBe("2");
      });

      it("[PRPI-2015] The aggregated home score displayed should be:`(3-2)`", async () => {
        expect(await footballScoreSO.aggregateScore.getText()).toBe("(3-2)");
      });
    });
  });
});
