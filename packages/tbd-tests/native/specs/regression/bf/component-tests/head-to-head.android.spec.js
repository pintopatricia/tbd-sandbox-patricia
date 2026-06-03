const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const { HeadToHeadResultSO, RecentFormCaptionSO, HeadToHeadDetailedSO } = require("../../../../screen-objects");

const mockService = new MockService();

const headToHeadDetailedSO = new HeadToHeadDetailedSO();
const lastDetailedResultSO = new HeadToHeadResultSO(headToHeadDetailedSO.headToHeadDetailedResults[2]);
const captionSO = new RecentFormCaptionSO(headToHeadDetailedSO.headToHeadDetailedCaption);
const extraTimeCaptionSO = new RecentFormCaptionSO(captionSO.items[0]);
const penaltiesCaptionSO = new RecentFormCaptionSO(captionSO.items[1]);

const EVENT_ID = "29682729";

const HEAD_2_HEAD = {
  home: [
    {
      outcome: "LOSE",
      startAt: "2018-01-05T14:01:00Z",
      side: "AWAY",
      score: { home: 3, away: 0 },
      extraTimeScore: { home: 4, away: 2 },
    },
    {
      outcome: "WIN",
      startAt: "2019-08-21T18:45:00Z",
      side: "HOME",
      score: { home: 2, away: 1 },
    },
    {
      outcome: "LOSE",
      startAt: "2019-04-13T14:00:00Z",
      side: "HOME",
      score: { home: 2, away: 2 },
      penaltyShootoutScore: { home: 5, away: 4 },
      extraTimeScore: { home: 3, away: 2 },
    },
  ],

  away: [
    {
      outcome: "WIN",
      startAt: "2018-01-05T14:01:00Z",
      side: "HOME",
      score: { home: 3, away: 0 },
      extraTimeScore: { home: 4, away: 2 },
    },
    {
      outcome: "LOSE",
      startAt: "2019-08-21T18:45:00Z",
      side: "AWAY",
      score: { home: 2, away: 1 },
    },
    {
      outcome: "WIN",
      startAt: "2019-04-13T14:00:00Z",
      side: "AWAY",
      score: { home: 2, away: 2 },
      penaltyShootoutScore: { home: 5, away: 4 },
      extraTimeScore: { home: 3, away: 2 },
    },
  ],
};

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
        __typename: "HeadToHeadCard",
        home: "Wolves",
        away: "Real Madrid",
        sportevent: {
          eventName: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45Z",
          urn: `ppb:event:${EVENT_ID}`,
          __typename: "SportsEvent",
        },
        urn: `ppb:tbd:card:headToHead:${EVENT_ID}`,
        contentTitle: `Head to Head`,
        footballFixture: {
          urn: `ppb:fixture:${EVENT_ID}`,
          home: { name: "Ukraine" },
          away: { name: "Portugal" },
          scheduledAt: "2010-10-14T18:45Z",
          duration: {},
          head2head: HEAD_2_HEAD,
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "HeadToHeadCard",
        urn: `ppb:tbd:card:headToHead:${EVENT_ID}`,
      },
    },
  ],
};

const SCA_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {},
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
        clock: null,
      },
    },
  ],
};

describe("Head to Head card", () => {
  describe("When the user is on a football event with head to head results available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));
      const url = `sport/competition/event/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(headToHeadDetailedSO.element);
    });

    it("[PRPI-2216] The H2H modal should display 3 results", async () => {
      expect(await headToHeadDetailedSO.headToHeadDetailedResults.length).toBe(3);
    });

    it("[PRPI-2217] The last result date should be: 'Apr 13, 2019'", async () => {
      expect(await lastDetailedResultSO.timeLabel.getText()).toBe("Apr 13, 2019");
    });

    it("[PRPI-2218] The last result should be Ukraine against Portugal", async () => {
      expect(await lastDetailedResultSO.homeTeamName.getText()).toBe("Ukraine");
      expect(await lastDetailedResultSO.awayTeamName.getText()).toBe("Portugal");
    });

    it("[PRPI-2219] The last result should display the team shield for both teams", async () => {
      expect(await lastDetailedResultSO.shieldCrests.length).toBe(2);
    });

    it("[PRPI-2220] The last result score should be 3-2", async () => {
      expect(await lastDetailedResultSO.score.getText()).toBe("3 - 2");
    });

    it("[PRPI-2221] The last result should display extra time label: 'AET'", async () => {
      expect(await lastDetailedResultSO.aetLabel.getText()).toBe("AET");
    });

    it("[PRPI-2222] The last result should display the penalties information: 'P 5-4'", async () => {
      expect(await lastDetailedResultSO.penaltiesLabel.getText()).toBe("P");
      expect(await lastDetailedResultSO.penaltiesScore.getText()).toBe("5 - 4");
    });

    it("[PRPI-2223] The caption should be displayed at the bottom of the page", async () => {
      expect(await headToHeadDetailedSO.headToHeadDetailedCaption.isDisplayed()).toBe(true);
    });

    it("[PRPI-2224] The extra time label should be displayed in the caption: 'AET: After Extra Time'", async () => {
      expect(await extraTimeCaptionSO.itemLeftLabel.getText()).toBe("AET:");
      expect(await extraTimeCaptionSO.itemRightLabel.getText()).toBe("After Extra Time");
    });

    it("[PRPI-2225] The penalties label should be displayed in the caption: 'P: Penalties'", async () => {
      expect(await penaltiesCaptionSO.itemLeftLabel.getText()).toBe("P:");
      expect(await penaltiesCaptionSO.itemRightLabel.getText()).toBe("Penalties");
    });
  });
});
