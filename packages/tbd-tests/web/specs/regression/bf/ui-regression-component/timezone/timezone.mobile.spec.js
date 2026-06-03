const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { AvBFixturePO, DurationPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const routes = require("../../../../../../utils/routes");

const avbFixturePO = new AvBFixturePO();
const scoreboardDurationPO = new DurationPO(avbFixturePO.element);

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
          openDate: "2022-06-02T16:00:00Z",
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
          scheduledAt: "2022-06-02T16:00:00Z",
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
      scheduledAt: "2022-06-02T16:00:00Z",
    },
  ],
};

describe("[1018621] When the user is logged out and the preloadedState timezone is 'Europe/London'", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, {
        timezone: "Europe/London",
      }),
    );
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));

    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(scoreboardDurationPO.element);
  });

  it("[PRPI-7662] The starting hour of the event should be Jun 2, 17:00", async () => {
    expect(await scoreboardDurationPO.datetime.getText()).toEqual("Jun 2,\n17:00");
  });

  describe("[1018621] And when the reloads the window and the userDetails timezone is set to 'Australia/Sydney' (GMT+10)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, {
          timezone: "Australia/Sydney",
        }),
      );

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(scoreboardDurationPO.element);
    });

    it("[PRPI-7663] The starting hour of the event should be Jun 3, 02:00", async () => {
      expect(await scoreboardDurationPO.datetime.getText()).toEqual("Jun 3,\n02:00");
    });
  });
});
