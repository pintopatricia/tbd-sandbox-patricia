const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MODULE_NAME = "header";

const mockService = new MockService(browser);

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
        cardGroupTitle: "Today",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753184",
                viewLink: {
                  viewUrn: "ppb:tbd:view:event:29753184",
                  viewUrl: routes.getEventViewUrl("29753184"),
                },
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Brazilian Brasiliense Matches",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170181973",
                      liveData: {
                        totalMatched: 21883.006497031536,
                        state: "SUSPENDED",
                        inplay: false,
                      },
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
                      bettingType: "ODDS",
                      eachWayDivisor: null,
                      numberOfWinners: 1,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:12191691",
                          name: "Brazilian Brasiliense Matches",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753184",
                          name: "Gama v Real Futebol Clube",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/198140/0",
                          name: "Gama",
                          selectionId: 198140,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/22242266/0",
                          name: "Real Futebol Clube",
                          selectionId: 22242266,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170181973/198140/0" },
                      { runnerURN: "ppb:excRunner:1.170181973/22242266/0" },
                      { runnerURN: "ppb:excRunner:1.170181973/58805/0" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753184",
                  home: {
                    name: "Gama",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Real Futebol Clube",
                    color: null,
                    crest: null,
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753184",
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
      },
    },
  ],
};

describe("Header - Logged Out Experience", () => {
  describe("When the user opens the app and is logged out", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_HOME_VIEW_MOCK.urn, { loggedIn: "false" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
      await browser.url(routes.getHomeViewUrl());
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1368]_should_see_the_header_with_login_and_join_now_buttons`,
      );
    });

    it("[PRPI-1368]_should_see_the_header_with_login_and_join_now_buttons", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1368]_should_see_the_header_with_login_and_join_now_buttons`),
      ).toBe(0);
    });

    describe("And the `SMART_APP_BANNER` throttle is active", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_HOME_VIEW_MOCK.urn, {
            loggedIn: "false",
            SMART_APP_BANNER: { isActive: true },
          }),
        );
        await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1369]_should_see_the_smart_app_banner_above_the_header_and_the_content_below_the_header_is_shifted_down`,
        );
      });

      it("[PRPI-1369]_should_see_the_smart_app_banner_above_the_header_and_the_content_below_the_header_is_shifted_down", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1369]_should_see_the_smart_app_banner_above_the_header_and_the_content_below_the_header_is_shifted_down`,
          ),
        ).toBe(0);
      });
    });
  });
});
