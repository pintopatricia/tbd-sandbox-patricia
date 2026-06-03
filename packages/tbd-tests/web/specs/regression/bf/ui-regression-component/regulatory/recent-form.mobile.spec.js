const {
  AvBFixturePO,
  FootballScoreboardPO,
  RecentFormCaptionPO,
  RecentFormIconPO,
  RecentFormDetailedPO,
  RecentFormResultPO,
} = require("../../../../../page-objects");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const footballScoreboardPO = new FootballScoreboardPO();
const avbFixturePO = new AvBFixturePO();
const recentFormDetailedPO = new RecentFormDetailedPO();
const recentFormCaptionPO = new RecentFormCaptionPO();
const firstHomeResultContainerPO = new RecentFormResultPO(recentFormDetailedPO.homeTeamResults[0]);
const secondHomeResultContainerPO = new RecentFormResultPO(recentFormDetailedPO.homeTeamResults[1]);
const lastAwayResultContainerPO = new RecentFormResultPO(recentFormDetailedPO.awayTeamResults[4]);
const firstHomeResultPO = new RecentFormResultPO(recentFormDetailedPO.results[0]);
const firstAwayResultPO = new RecentFormResultPO(recentFormDetailedPO.results[1]);

const mockService = new MockService();

const EVENT_ID = "29465861";

const RECENT_FORM = {
  home: [
    {
      opponent: "Man City",
      outcome: "WIN",
      startAt: "2020-02-02T16:30:00Z",
      side: "HOME",
      score: {
        home: 1,
        away: 0,
      },
      extraTimeScore: {
        home: 0,
        away: 1,
      },
      penaltyShootoutScore: {
        home: 5,
        away: 4,
      },
    },
    {
      opponent: "Arsenal",
      outcome: "LOSE",
      startAt: "2020-02-02T16:30:00Z",
      side: "HOME",
      score: {
        home: 0,
        away: 2,
      },
      extraTimeScore: null,
      penaltyShootoutScore: {
        home: 5,
        away: 4,
      },
    },
    {
      opponent: "Man Utd",
      outcome: "DRAW",
      startAt: "2020-02-02T16:30:00Z",
      side: "HOME",
      score: {
        home: 1,
        away: 1,
      },
      extraTimeScore: {
        home: 0,
        away: 1,
      },
      penaltyShootoutScore: null,
    },
    {
      opponent: "Barcelona",
      outcome: "WIN",
      startAt: "2020-02-02T16:30:00Z",
      side: "AWAY",
      score: {
        home: 0,
        away: 3,
      },
    },
    {
      opponent: "Wolves",
      outcome: "LOSE",
      startAt: "2020-02-02T16:30:00Z",
      side: "HOME",
      score: {
        home: 0,
        away: 3,
      },
      extraTimeScore: null,
      penaltyShootoutScore: null,
    },
  ],

  away: [
    {
      opponent: "Man City",
      outcome: "DRAW",
      startAt: "2020-02-02T16:30:00Z",
      side: "HOME",
      score: {
        home: 2,
        away: 2,
      },
      extraTimeScore: {
        home: 0,
        away: 1,
      },
      penaltyShootoutScore: {
        home: 5,
        away: 4,
      },
    },
    {
      opponent: "Arsenal",
      outcome: "LOSE",
      startAt: "2020-02-02T16:30:00Z",
      side: "HOME",
      score: {
        home: 1,
        away: 2,
      },
      extraTimeScore: null,
      penaltyShootoutScore: {
        home: 5,
        away: 4,
      },
    },
    {
      opponent: "Man Utd",
      outcome: "LOSE",
      startAt: "2020-02-02T16:30:00Z",
      side: "HOME",
      score: {
        home: 1,
        away: 3,
      },
      extraTimeScore: {
        home: 0,
        away: 1,
      },
      penaltyShootoutScore: null,
    },
    {
      opponent: "Liverpool",
      outcome: "WIN",
      startAt: "2020-02-02T16:30:00Z",
      side: "AWAY",
      score: {
        home: 0,
        away: 3,
      },
      extraTimeScore: null,
      penaltyShootoutScore: null,
    },
    {
      opponent: "Tottenham",
      outcome: "DRAW",
      startAt: "2020-05-03T16:30:00Z",
      side: "HOME",
      score: {
        home: 3,
        away: 3,
      },
      extraTimeScore: null,
      penaltyShootoutScore: null,
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Liverpool v Chelsea",
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        sportevent: {
          eventName: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
        },
        urn: "ppb:tbd:card:fixture:29465861",
        fixture: {
          urn: "ppb:fixture:29465861",
          home: {
            name: "Liverpool",
            color: "FC5002",
          },
          away: {
            name: "Chelsea",
            color: "091453",
          },
          recentForm: RECENT_FORM,
        },
      },
    },
    {
      node: {
        __typename: "TeamFormCard",
        urn: "ppb:tbd:card:teamForm:29465861",
        contentTitle: "Form",
        sportevent: {
          eventName: "Liverpool v Chelsea",
          openDate: "2010-10-14T18:45",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
        },
        footballFixture: {
          urn: "ppb:fixture:29465861",
          home: {
            name: "Liverpool",
            color: "FC5002",
          },
          away: {
            name: "Chelsea",
            color: "091453",
          },
          recentForm: RECENT_FORM,
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29465861",
      },
    },
    {
      node: {
        __typename: "TeamFormCard",
        urn: "ppb:tbd:card:teamForm:29465861",
      },
    },
  ],
};

describe("Recent Form", () => {
  describe("[604865] When user lands on a football event", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(avbFixturePO.element);
      await browser.waitUntilDisplayed(footballScoreboardPO.element);
      await browser.waitUntilDisplayed(recentFormDetailedPO.element);
    });

    it("[PRPI-7461] Then the scoreboard should be displayed", async () => {
      expect(await footballScoreboardPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-7462] And the recent form card should be displayed", async () => {
      expect(await recentFormDetailedPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-7463] And each team should have 5 recent results", async () => {
      expect(await recentFormDetailedPO.homeTeamResults.length).toBe(5);
      expect(await recentFormDetailedPO.awayTeamResults.length).toBe(5);
    });

    it("[PRPI-7464] And first home result should display a WIN result with extra time and penalties", async () => {
      expect(await firstHomeResultContainerPO.AET.isDisplayed()).toBe(true);
      const scoreText = (await firstHomeResultContainerPO.score.getText()).split("\n")[0];
      const aetText = (await firstHomeResultContainerPO.score.getText()).split("\n")[1];

      expect(aetText).toBe("AET");
      expect(scoreText).toBe("0 - 1");
      expect(await firstHomeResultContainerPO.opponent.getText()).toBe("Man City (H)");
      expect(await firstHomeResultContainerPO.date.getText()).toBe("Feb 2, 2020");
      expect(await browser.containsClass(firstHomeResultContainerPO.icon, RecentFormIconPO.iconTypes.WIN)).toBe(true);
    });

    it("[PRPI-7465] And second home result should display a LOSE result with penalties", async () => {
      expect(await secondHomeResultContainerPO.pen.isDisplayed()).toBe(true);
      const scoreText = (await secondHomeResultContainerPO.scorePenalties.getText()).split("\n")[0];
      const penText = (await secondHomeResultContainerPO.scorePenalties.getText()).split("\n")[1];

      expect(scoreText).toBe("5 - 4");
      expect(penText).toBe("PEN");
      expect(await secondHomeResultContainerPO.opponent.getText()).toBe("Arsenal (H)");
      expect(await secondHomeResultContainerPO.date.getText()).toBe("Feb 2, 2020");
      expect(await browser.containsClass(secondHomeResultContainerPO.icon, RecentFormIconPO.iconTypes.LOSE)).toBe(true);
    });

    it("[PRPI-7466] And last away result should display a DRAW result", async () => {
      expect(await lastAwayResultContainerPO.score.getText()).toBe("3 - 3");
      expect(await lastAwayResultContainerPO.opponent.getText()).toBe("Tottenham (H)");
      expect(await lastAwayResultContainerPO.date.getText()).toBe("May 3, 2020");
      expect(await browser.containsClass(lastAwayResultContainerPO.icon, RecentFormIconPO.iconTypes.DRAW)).toBe(true);
    });

    it("[PRPI-7467] And Home results should be on left side and Away results on right side", async () => {
      expect(await browser.containsClass(firstHomeResultPO.element, RecentFormResultPO.resultAlignments.RIGHT)).toBe(
        true,
      );

      expect(await browser.containsClass(firstAwayResultPO.element, RecentFormResultPO.resultAlignments.LEFT)).toBe(
        true,
      );
    });

    it("[PRPI-7468] And caption component should be displayed ", async () => {
      expect(await recentFormCaptionPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-7469] And W should be displayed with Winner label", async () => {
      expect(await recentFormCaptionPO.captionLabels[0].getText()).toBe("W:");
      expect(await recentFormCaptionPO.captionLabels[1].getText()).toBe("Winner");
    });

    it("[PRPI-7470] And D should be displayed with Draw label", async () => {
      expect(await recentFormCaptionPO.captionLabels[2].getText()).toBe("D:");
      expect(await recentFormCaptionPO.captionLabels[3].getText()).toBe("Draw");
    });

    it("[PRPI-7471] And L should be displayed with Lost label", async () => {
      expect(await recentFormCaptionPO.captionLabels[4].getText()).toBe("L:");
      expect(await recentFormCaptionPO.captionLabels[5].getText()).toBe("Loss");
    });

    it("[PRPI-7472] And A should be displayed with Away label", async () => {
      expect(await recentFormCaptionPO.captionLabels[6].getText()).toBe("A:");
      expect(await recentFormCaptionPO.captionLabels[7].getText()).toBe("Away");
    });

    it("[PRPI-7473] And H should be displayed with Home label", async () => {
      expect(await recentFormCaptionPO.captionLabels[8].getText()).toBe("H:");
      expect(await recentFormCaptionPO.captionLabels[9].getText()).toBe("Home");
    });

    it("[PRPI-7474] And AET should be displayed with After Extra Time label", async () => {
      expect(await recentFormCaptionPO.captionLabels[10].getText()).toBe("AET:");
      expect(await recentFormCaptionPO.captionLabels[11].getText()).toBe("After Extra Time");
    });

    it("[PRPI-7475] And PEN should be displayed with Penalties label", async () => {
      expect(await recentFormCaptionPO.captionLabels[12].getText()).toBe("PEN:");
      expect(await recentFormCaptionPO.captionLabels[13].getText()).toBe("Penalties");
    });
  });
});
