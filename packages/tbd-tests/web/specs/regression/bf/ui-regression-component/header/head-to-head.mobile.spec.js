const { FootballScoreboardPO, HeadToHeadDetailedPO, HeadToHeadResultPO } = require("../../../../../page-objects");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const footballScoreboardPO = new FootballScoreboardPO();
const headToHeadDetailedPO = new HeadToHeadDetailedPO();
const firstResultDetailedPO = new HeadToHeadResultPO(headToHeadDetailedPO.results[0]);
const secondResultDetailedPO = new HeadToHeadResultPO(headToHeadDetailedPO.results[1]);
const thirdResultDetailedPO = new HeadToHeadResultPO(headToHeadDetailedPO.results[2]);

const mockService = new MockService();

const EVENT_ID = "29465861";

// TODO: Update the Mock with competition after implementation is done and we start to receive information from SCA
const HEAD_2_HEAD = {
  home: [
    {
      outcome: "LOSE",
      startAt: "2020-01-05T14:01:00Z",
      side: "AWAY",
      score: { home: 3, away: 0 },
      extraTimeScore: { home: 4, away: 2 },
    },
    {
      outcome: "WIN",
      startAt: "2019-08-21T18:45:00Z",
      side: "HOME",
      score: { home: 2, away: 0 },
      penaltyShootoutScore: { home: 3, away: 2 },
      extraTimeScore: { home: 3, away: 0 },
    },
    {
      outcome: "LOSE",
      startAt: "2019-04-13T14:00:00Z",
      side: "AWAY",
      score: { home: 6, away: 0 },
      penaltyShootoutScore: { home: 5, away: 4 },
    },
  ],

  away: [
    {
      outcome: "WIN",
      startAt: "2020-01-05T14:01:00Z",
      side: "HOME",
      score: { home: 3, away: 0 },
      extraTimeScore: { home: 4, away: 2 },
    },
    {
      outcome: "LOSE",
      startAt: "2019-08-21T18:45:00Z",
      side: "AWAY",
      score: { home: 2, away: 0 },
      penaltyShootoutScore: { home: 3, away: 2 },
      extraTimeScore: { home: 2, away: 0 },
    },
    {
      outcome: "WIN",
      startAt: "2019-04-13T14:00:00Z",
      side: "HOME",
      score: { home: 6, away: 0 },
      penaltyShootoutScore: { home: 5, away: 4 },
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29465861",
        away: "Portugal",
        home: "Ukraine",
        sportevent: {
          eventName: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
        },
        fixture: {
          urn: "ppb:fixture:29465861",
          home: {
            name: "Ukraine",
            color: "091453",
          },
          away: {
            name: "Portugal",
            color: "FC5002",
          },
          scheduledAt: "2010-10-14T18:45",
          duration: {
            period: "REGULAR",
            status: "PRE_MATCH",
            clock: {},
          },
          head2head: HEAD_2_HEAD,
        },
      },
    },
    {
      node: {
        __typename: "HeadToHeadCard",
        urn: "ppb:tbd:card:headToHead:29465861",
        contentTitle: "Head to Head",
        sportevent: {
          eventName: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
        },
        footballFixture: {
          urn: "ppb:fixture:29465861",
          home: {
            name: "Ukraine",
            color: "091453",
          },
          away: {
            name: "Portugal",
            color: "FC5002",
          },
          scheduledAt: "2010-10-14T18:45",
          duration: {
            period: "REGULAR",
            status: "PRE_MATCH",
          },
          head2head: HEAD_2_HEAD,
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
        __typename: "HeadToHeadCard",
        urn: "ppb:tbd:card:headToHead:29465861",
      },
    },
  ],
};

const SCA_PRE_MATCH_MOCK = {
  fixture: [
    {
      duration: {},
    },
  ],
};

describe("HeadToHead Card", () => {
  describe("[616891] When user lands on a football event in PRE_MATCH state and REGULAR period", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(footballScoreboardPO.element);
    });

    it("[PRPI-5930] Then the scoreboard should be displayed", async () => {
      expect(await footballScoreboardPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-5931] And the head to head detailed modal should be opened and displayed", async () => {
      expect(await headToHeadDetailedPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-5932] And the detailed container should have 3 results", async () => {
      expect(await headToHeadDetailedPO.results.length).toBe(3);
    });

    it("[PRPI-5933] And the date of the event should be: Jan 5,2020", async () => {
      expect(await firstResultDetailedPO.date.getText()).toBe("Jan 5, 2020");
    });

    it("[PRPI-5934] And the first result home team name should be: Portugal and away team name should be: Ukraine", async () => {
      expect(await firstResultDetailedPO.homeTeam.getText()).toBe("Portugal");
      expect(await firstResultDetailedPO.awayTeam.getText()).toBe("Ukraine");
    });

    it("[PRPI-5935] And the first result score should be: 4 - 2", async () => {
      expect(await firstResultDetailedPO.score.getText()).toBe("4 - 2");
    });

    it("[PRPI-5936] And the AET label should be displayed as: AET", async () => {
      expect(await firstResultDetailedPO.afterExtraTime.getText()).toBe("AET");
    });

    it("[PRPI-5937] And the date of the event should be: Aug 21, 2019", async () => {
      expect(await secondResultDetailedPO.date.getText()).toBe("Aug 21, 2019");
    });

    it("[PRPI-5938] And the second result home team name should be: Ukraine and away team name should be: Portugal", async () => {
      expect(await secondResultDetailedPO.homeTeam.getText()).toBe("Ukraine");
      expect(await secondResultDetailedPO.awayTeam.getText()).toBe("Portugal");
    });

    it("[PRPI-5939] And the second result score should be: 3 - 0", async () => {
      expect(await secondResultDetailedPO.score.getText()).toBe("3 - 0");
    });

    it("[PRPI-8376] And the second AET label should be displayed as: AET", async () => {
      expect(await secondResultDetailedPO.afterExtraTime.getText()).toBe("AET");
    });

    it("[PRPI-5940] And the penalties score should display: P 3 - 2", async () => {
      expect(await secondResultDetailedPO.penalties.getText()).toBe("P 3 - 2");
    });

    it("[PRPI-5941] And the date of the event should be: Apr 13, 2019", async () => {
      expect(await thirdResultDetailedPO.date.getText()).toBe("Apr 13, 2019");
    });

    it("[PRPI-5942] And the third result home team name should be: Portugal and away team name should be: Ukraine", async () => {
      expect(await thirdResultDetailedPO.homeTeam.getText()).toBe("Portugal");
      expect(await thirdResultDetailedPO.awayTeam.getText()).toBe("Ukraine");
    });

    it("[PRPI-5943] And the third result score should be: 6 - 0", async () => {
      expect(await thirdResultDetailedPO.score.getText()).toBe("6 - 0");
    });

    it("[PRPI-5944] And the penalties score should display: P 5 - 4", async () => {
      expect(await thirdResultDetailedPO.penalties.getText()).toBe("P 5 - 4");
    });

    it("[PRPI-5945] And the caption list should display the first element as: `AET:` ", async () => {
      expect(await headToHeadDetailedPO.captionContent[0].getText()).toBe("AET:");
    });

    it("[PRPI-5946] And the caption list should display the second element as: `After Extra Time` ", async () => {
      expect(await headToHeadDetailedPO.captionContent[1].getText()).toBe("After Extra Time");
    });

    it("[PRPI-5947] And the caption list should display the third element as: `P:` ", async () => {
      expect(await headToHeadDetailedPO.captionContent[2].getText()).toBe("P:");
    });

    it("[PRPI-5948] And the caption list should display the fourth element as: `Penalties` ", async () => {
      expect(await headToHeadDetailedPO.captionContent[3].getText()).toBe("Penalties");
    });
  });
});
