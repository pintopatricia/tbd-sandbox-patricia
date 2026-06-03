const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { AvBFixturePO, FootballScoreboardPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const avbFixturePO = new AvBFixturePO();
const footballScoreboardPO = new FootballScoreboardPO();

const mockService = new MockService();

const EVENT_ID = "29465861";

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
        urn: "ppb:tbd:card:fixture:29465861",
        away: "Portugal",
        home: "Ukraine",
        sportevent: {
          eventName: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
          competition: {
            urn: "ppb:competition:12345",
            name: "English Premier League",
          },
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
          duration: {},
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
  ],
};

const SCA_MOCK = {
  fixture: [
    {
      duration: {},
    },
  ],
};

describe("Fixture Card", () => {
  describe("When user lands on a football event", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(avbFixturePO.element);
    });

    it("[PRPI-5671] Then I should see the competition title: English Premier League", async () => {
      expect(await avbFixturePO.avbFixtureTitle.getText()).toBe("English Premier League");
    });

    it("[PRPI-5672] And I should see the Scoreboard displayed", async () => {
      expect(await footballScoreboardPO.element.isDisplayed()).toBe(true);
    });
  });
});
