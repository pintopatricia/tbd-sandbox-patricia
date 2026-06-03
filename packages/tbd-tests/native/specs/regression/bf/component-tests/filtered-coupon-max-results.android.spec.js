const { getGenericLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");

const { GenericScreenSO, AlertSO } = require("../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const alertSO = new AlertSO();

const BFF_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:allmatchesraces:1",
  url: "view/amc-1",
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YKUhHBAAACQA54Wr/s/1",
        filteredCouponTitle: null,
        filterOptions: {
          sortOption: {
            defaultOption: "RANK",
            availableOptions: ["RANK", "TIME"],
          },
          dateRangeFilter: {
            urn: "ppb:tbd:cardfilter:daterange:YKUhHBAAACQA54Wr/s/1",
            defaultOption: {
              urn: "ppb:tbd:daterangeoption:YKUhHBAAACQA54Wr/s/1|YKUgWhAAACMA54IP",
              name: "All Matches",
              title: {
                __typename: "DisplayNameTitle",
                name: "All Matches",
              },
            },
            availableOptions: [
              {
                urn: "ppb:tbd:daterangeoption:YKUhHBAAACQA54Wr/s/1|YKUgWhAAACMA54IP",
                name: "All Matches",
                title: {
                  __typename: "DisplayNameTitle",
                  name: "All Matches",
                },
              },
              {
                urn: "ppb:tbd:daterangeoption:YKUhHBAAACQA54Wr/s/1|YKUffBAAACEA533W",
                name: "Today",
                title: {
                  __typename: "DisplayNameTitle",
                  name: "Today",
                },
              },
            ],
          },
          marketTypeFilter: {
            urn: "ppb:tbd:cardfilter:markettype:YKUhHBAAACQA54Wr/s/1",
            defaultOption: null,
            availableOptions: [
              {
                marketType: {
                  urn: "ppb:marketType:BOTH_TEAMS_TO_SCORE",
                },
                name: "Both Teams To Score",
              },
              {
                marketType: {
                  urn: "ppb:marketType:MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE",
                },
                name: "Match Odds and Both Teams to Score",
              },
            ],
          },
          competitionsFilter: {
            urn: "ppb:tbd:cardfilter:competitions:YKUhHBAAACQA54Wr/s/1",
            defaultOptions: null,
            topCompetitions: [
              {
                __typename: "Competition",
                urn: "ppb:competition:11997260",
                name: "UEFA Euro 2020",
                competitionId: 11997260,
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:1",
                  name: "Football",
                  sportId: 1,
                },
              },
            ],
          },
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:30655393",
              },
            },
          ],

          pageInfo: {
            hasNextPage: true,
          },
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:30655393",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:30655393",
                  viewUrl: "football/uefa-euro-2020/switzerland-v-spain/e-30655393",
                },
                runnerViewLinks: [
                  {
                    runnerUrn: "ppb:excRunner:1.184879110/15293/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.184879110/15293/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.184879110/22/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.184879110/22/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.184879110/58805/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.184879110/58805/0",
                  },
                ],

                title: "Match Odds",
                sportevent: {
                  urn: "ppb:event:30655393",
                  eventId: 30655393,
                  name: "Switzerland v Spain",
                  openDate: "2021-07-02T16:00:00.000Z",
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:11997260",
                    name: "UEFA Euro 2020",
                    competitionId: 11997260,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                      sportId: 1,
                    },
                  },
                },
                fixture: {
                  __typename: "FootballFixture",
                  urn: "ppb:fixture:30655393",
                  home: {
                    name: "Switzerland",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Spain",
                    color: null,
                    crest: null,
                  },
                  scheduledAt: "2021-07-02T16:00:00Z",
                  startedAt: null,
                  score: null,
                  firstLegScore: null,
                  duration: {
                    period: "REGULAR",
                    status: "PRE_MATCH",
                    clock: null,
                    stoppageMinutes: null,
                  },
                  penaltyShootout: null,
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.268794321",
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
                      marketTypeName: null,
                      bettingType: "ODDS",
                      liveData: {
                        inplay: false,
                        turnInPlayEnabled: true,
                        // bspMarket: false,
                        runners: [
                          {
                            urn: "ppb:tbd:sbkRunnerLiveData:924.268794321/15293",
                            runnerURN: "ppb:sbkRunner:924.268794321/15293",
                            handicap: 0,
                          },
                          {
                            urn: "ppb:tbd:sbkRunnerLiveData:924.268794321/58805",
                            runnerURN: "ppb:sbkRunner:924.268794321/58805",
                            handicap: 0,
                          },
                          {
                            urn: "ppb:tbd:sbkRunnerLiveData:924.268794321/22",
                            runnerURN: "ppb:sbkRunner:924.268794321/22",
                            handicap: 0,
                          },
                        ],
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:11997260",
                          name: "UEFA Euro 2020",
                          competitionId: 11997260,
                          sport: {
                            __typename: "Sport",
                            urn: "ppb:eventType:1",
                            name: "Football",
                            sportId: 1,
                          },
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:30655393",
                          name: "Switzerland v Spain",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.268794321/15293",
                          name: "Switzerland",
                          selectionId: 15293,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.268794321/22",
                          name: "Spain",
                          selectionId: 22,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.268794321/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                          resultType: null,
                        },
                      ],

                      isOddsboostMarketType: false,
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.268794321/15293",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.268794321/22",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.268794321/58805",
                      },
                    ],
                  },
                },
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
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YKUhHBAAACQA54Wr/s/1",
      },
    },
  ],
};

describe("When the user is on a Generic View with all matches", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    const url = "view/amc-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(alertSO.detail);
  });

  it("[PRPI-1942] the view should render warning message", async () => {
    expect(await alertSO.detail.getText()).toBe("You can apply more filters to find what you are looking for");
  });
});
