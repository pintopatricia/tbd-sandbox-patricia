const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const {
  RecentFormCaptionSO,
  FootballScoreboardSO,
  RecentFormDetailedSO,
  RecentFormResultSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const footballScoreboardSO = new FootballScoreboardSO();
const recentFormDetailedSO = new RecentFormDetailedSO();
const recentFormCaptionSO = new RecentFormCaptionSO();

const firstContainerResultsSO = new RecentFormDetailedSO(recentFormDetailedSO.containers[0]);
const firstAwayGameSO = new RecentFormDetailedSO(firstContainerResultsSO.detailedAway);
const firstAwayResultSO = new RecentFormResultSO(firstAwayGameSO.element);

const fifthContainerResultsSO = new RecentFormDetailedSO(recentFormDetailedSO.containers[4]);
const fifthHomeGameSO = new RecentFormDetailedSO(fifthContainerResultsSO.detailedHome);
const fifthHomeResultSO = new RecentFormResultSO(fifthHomeGameSO.element);

const winnerCaptionSO = new RecentFormCaptionSO(recentFormCaptionSO.items[0]);
const winnerCaptionRightLabelSO = new RecentFormCaptionSO(winnerCaptionSO.itemRightLabel);
const winnerCaptionLeftLabelSO = new RecentFormCaptionSO(winnerCaptionSO.itemLeftLabel);
const drawCaptionSO = new RecentFormCaptionSO(recentFormCaptionSO.items[1]);
const drawCaptionRightLabelSO = new RecentFormCaptionSO(drawCaptionSO.itemRightLabel);
const drawCaptionLeftLabelSO = new RecentFormCaptionSO(drawCaptionSO.itemLeftLabel);
const lossCaptionSO = new RecentFormCaptionSO(recentFormCaptionSO.items[2]);
const lossCaptionRightLabelSO = new RecentFormCaptionSO(lossCaptionSO.itemRightLabel);
const lossCaptionLeftLabelSO = new RecentFormCaptionSO(lossCaptionSO.itemLeftLabel);
const awayCaptionSO = new RecentFormCaptionSO(recentFormCaptionSO.items[3]);
const awayCaptionRightLabelSO = new RecentFormCaptionSO(awayCaptionSO.itemRightLabel);
const awayCaptionLeftLabelSO = new RecentFormCaptionSO(awayCaptionSO.itemLeftLabel);
const homeCaptionSO = new RecentFormCaptionSO(recentFormCaptionSO.items[4]);
const homeCaptionRightLabelSO = new RecentFormCaptionSO(homeCaptionSO.itemRightLabel);
const homeCaptionLeftLabelSO = new RecentFormCaptionSO(homeCaptionSO.itemLeftLabel);
const extraTimeCaptionSO = new RecentFormCaptionSO(recentFormCaptionSO.items[5]);
const extraTimeCaptionRightLabelSO = new RecentFormCaptionSO(extraTimeCaptionSO.itemRightLabel);
const extraTimeCaptionLeftLabelSO = new RecentFormCaptionSO(extraTimeCaptionSO.itemLeftLabel);
const penaltiesCaptionSO = new RecentFormCaptionSO(recentFormCaptionSO.items[6]);
const penaltiesCaptionRightLabelSO = new RecentFormCaptionSO(penaltiesCaptionSO.itemRightLabel);
const penaltiesCaptionLeftLabelSO = new RecentFormCaptionSO(penaltiesCaptionSO.itemLeftLabel);

const EVENT_ID = "29682729";

const RECENT_FORM = {
  home: [
    {
      opponent: "Benfica",
      outcome: "DRAW",
      startAt: "2021-04-24T21:30:00Z",
      side: "AWAY",
      score: {
        home: 3,
        away: 3,
      },
      extraTimeScore: null,
      penaltyShootoutScore: null,
    },
    {
      opponent: "Juventus",
      outcome: "WIN",
      startAt: "2021-02-17T20:00:00Z",
      side: "AWAY",
      score: {
        home: 2,
        away: 1,
      },
    },
    {
      opponent: "Arsenal",
      outcome: "LOSE",
      startAt: "2021-01-23T16:30:00Z",
      side: "HOME",
      score: {
        home: 3,
        away: 2,
      },
      extraTimeScore: null,
      penaltyShootoutScore: {
        home: 4,
        away: 1,
      },
    },
    {
      opponent: "Barcelona",
      outcome: "WIN",
      startAt: "2021-01-12T16:30:00Z",
      side: "HOME",
      score: {
        home: 0,
        away: 3,
      },
    },
    {
      opponent: "Man City",
      outcome: "LOSE",
      startAt: "2021-01-01T16:30:00Z",
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
  ],

  away: [
    {
      opponent: "Tottenham",
      outcome: "WIN",
      startAt: "2021-02-16T16:30:00Z",
      side: "HOME",
      score: {
        home: 1,
        away: 6,
      },
      extraTimeScore: null,
      penaltyShootoutScore: null,
    },
    {
      opponent: "Man Utd",
      outcome: "LOSE",
      startAt: "2021-02-03T16:30:00Z",
      side: "AWAY",
      score: {
        home: 1,
        away: 3,
      },
      extraTimeScore: {
        home: 1,
        away: 2,
      },
      penaltyShootoutScore: null,
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Porto v Braga",
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        sportevent: {
          eventName: "Porto v Braga",
          openDate: "2010-10-14T18:45Z",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
        },
        urn: "ppb:tbd:card:fixture:29465861",
        fixture: {
          urn: "ppb:fixture:29465861",
          home: {
            name: "Porto",
            color: "FC5002",
          },
          away: {
            name: "Braga",
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
          eventName: "Porto v Braga",
          openDate: "2010-10-14T18:45Z",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
        },
        footballFixture: {
          urn: "ppb:fixture:29465861",
          home: {
            name: "Porto",
            color: "FC5002",
          },
          away: {
            name: "Braga",
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

describe("Recent Form Component", () => {
  describe("When the user is in a football event with recent form available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      const url = `sport/competition/event/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(footballScoreboardSO.element);
    });

    it("[PRPI-2481] The scoreboard should be displayed on the recent form modal", async () => {
      expect(await footballScoreboardSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2482] The recent form detailed should have 5 containers", async () => {
      expect(await recentFormDetailedSO.containers.length).toBe(5);
    });

    it("[PRPI-2483] The first away result score should be a 1 - 6 win", async () => {
      expect(await firstAwayResultSO.score.getText()).toBe("1 - 6");
      expect(await firstAwayResultSO.result.getText()).toBe("W");
      expect(await firstAwayResultSO.extraTimeLabel.isDisplayed()).toBe(false);
      expect(await firstAwayResultSO.scorePenalties.isDisplayed()).toBe(false);
      expect(await firstAwayResultSO.penaltiesLabel.isDisplayed()).toBe(false);
      expect(await firstAwayResultSO.opponent.getText()).toBe("Tottenham (H)");
      expect(await firstAwayResultSO.date.getText()).toBe("Feb 16, 2021");
    });

    it("[PRPI-2484] The fifth home result score should be a 0 - 1 loss that went to extra time and penalties", async () => {
      expect(await fifthHomeResultSO.score.getText()).toBe("0 - 1");
      expect(await fifthHomeResultSO.result.getText()).toBe("L");
      expect(await fifthHomeResultSO.extraTimeLabel.getText()).toBe("AET");
      expect(await fifthHomeResultSO.scorePenalties.getText()).toBe("5 - 4");
      expect(await fifthHomeResultSO.penaltiesLabel.getText()).toBe("PEN");
      expect(await fifthHomeResultSO.opponent.getText()).toBe("Man City (H)");
      expect(await fifthHomeResultSO.date.getText()).toBe("Jan 1, 2021");
    });

    it("[PRPI-2485] The caption should be displayed", async () => {
      expect(await recentFormCaptionSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2486] The caption should have 7 elements", async () => {
      expect(await recentFormCaptionSO.items.length).toBe(7);
    });

    it("[PRPI-2487] The caption should display W: Winner", async () => {
      expect(await winnerCaptionRightLabelSO.element.getText()).toBe("Winner");
      expect(await winnerCaptionLeftLabelSO.element.getText()).toBe("W:");
    });

    it("[PRPI-2488] The caption should display D: Draw", async () => {
      expect(await drawCaptionRightLabelSO.element.getText()).toBe("Draw");
      expect(await drawCaptionLeftLabelSO.element.getText()).toBe("D:");
    });

    it("[PRPI-2489] The caption should display L: Loss", async () => {
      expect(await lossCaptionRightLabelSO.element.getText()).toBe("Loss");
      expect(await lossCaptionLeftLabelSO.element.getText()).toBe("L:");
    });

    it("[PRPI-2490] The caption should display A: Away", async () => {
      expect(await awayCaptionRightLabelSO.element.getText()).toBe("Away");
      expect(await awayCaptionLeftLabelSO.element.getText()).toBe("A:");
    });

    it("[PRPI-2491] The caption should display H: Home", async () => {
      expect(await homeCaptionRightLabelSO.element.getText()).toBe("Home");
      expect(await homeCaptionLeftLabelSO.element.getText()).toBe("H:");
    });

    it("[PRPI-2492] The caption should display AET: After Extra Time", async () => {
      expect(await extraTimeCaptionRightLabelSO.element.getText()).toBe("After Extra Time");
      expect(await extraTimeCaptionLeftLabelSO.element.getText()).toBe("AET:");
    });

    it("[PRPI-2493] The caption should display PEN: Penalties", async () => {
      expect(await penaltiesCaptionRightLabelSO.element.getText()).toBe("Penalties");
      expect(await penaltiesCaptionLeftLabelSO.element.getText()).toBe("PEN:");
    });
  });
});
