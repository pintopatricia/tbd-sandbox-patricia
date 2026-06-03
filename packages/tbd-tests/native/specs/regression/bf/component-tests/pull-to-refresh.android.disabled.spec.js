const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { GenericScreenSO, GenericSwitcherCardSO } = require("../../../../screen-objects");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const switcherCardSO = new GenericSwitcherCardSO();

const BFF_VIEW_MOCK = {
  __typename: "SportView",
  urn: "ppb:tbd:view:sport:1",
  title: "",
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:1",
        sport: {
          __typename: "Sport",
          urn: "ppb:eventType:1",
          name: "Football",
          sportId: 1,
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:nextRaces/s/7",
        cardGroupTitle: "Next Races",
        full: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                numberOfRunners: 2,
                urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
                title: "Win",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
                      name: "1m2f Nov Stks",
                      marketType: "WIN",
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:30061949.1335",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:29901908",
                            venue: "Windsor",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:29901908",
                          venue: "Windsor",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          name: "A",
                          selectionId: 1,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          name: "B",
                          selectionId: 2,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.1/1",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.1/2",
                      },
                    ],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1335",
                  startTime: "2020-07-13T14:30:00",
                  name: "14:30 Windsor",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    numberOfRunners: 3,
                  },
                  runners: [
                    {
                      selectionId: 1,
                      horse: {
                        name: "A",
                        sireName: "KODIAC",
                        damName: "SUPREME OCCASION (IRE)",
                        damSireName: "TEOFILO (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "COLT",
                      },
                      details: {
                        jockeyName: "John Velazquez",
                        trainerName: "Richard Hannon",
                        saddleCloth: 3,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 10,
                      },
                    },
                    {
                      selectionId: 2,
                      horse: {
                        name: "B",
                        sireName: "DUNADEN (FR)",
                        damName: "CEILIDH BAND",
                        damSireName: "CELTIC SWING",
                        age: 4,
                        color: "BAY",
                        sex: "FILLY",
                      },
                      details: {
                        jockeyName: "Sophie Ralston",
                        trainerName: "Dean Ivory",
                        saddleCloth: 5,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 2,
                      },
                    },
                  ],

                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901908",
                    name: "Wind 13th Jul",
                    country: "GB",
                    countryFlag: {
                      vector: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Windsor",
                  },
                },
                numberOfRunnersToDisplay: 2,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
              },
            },
          ],
        },
      },
    },
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
                  viewUrl: "ppb:tbd:view:event:29753184",
                },
                title: "Match Odds",
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
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:excRunner:1.170181973/198140/0",
                      },
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
                  scheduledAt: "2020-03-17T23:00:00Z",
                  startedAt: "2020-03-17T22:59:11Z",
                },
                sportevent: {
                  name: "Gama v Real Futebol Clube",
                  openDate: "2010-10-14T18:45Z",
                  urn: "ppb:event:29753184",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Brazilian Brasiliense Matches",
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
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:nextRaces/s/7",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
      },
    },
  ],
};

const BFF_VIEW_UPDATE_MOCK = {
  __typename: "SportView",
  urn: "ppb:tbd:view:sport:1",
  title: "",
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:1",
        sport: {
          __typename: "Sport",
          urn: "ppb:eventType:1",
          name: "Football",
          sportId: 1,
        },
      },
    },
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
                  viewUrl: "ppb:tbd:view:event:29753184",
                },
                title: "Match Odds",
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
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:excRunner:1.170181973/198140/0",
                      },
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
                  scheduledAt: "2020-03-17T23:00:00Z",
                  startedAt: "2020-03-17T22:59:11Z",
                },
                sportevent: {
                  name: "Gama v Real Futebol Clube",
                  openDate: "2010-10-14T18:45Z",
                  urn: "ppb:event:29753184",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Brazilian Brasiliense Matches",
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
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
      },
    },
  ],
};

describe("Navigation - Pull to Refresh", () => {
  describe("when loading a generic view", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      const url = "football/s-1";

      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });

      await browser.waitUntilDisplayed(switcherCardSO.element);
    });

    it("[PRPI-2408] should see content with two items", async () => {
      expect(await genericScreenSO.cards.length).toBe(2);
    });

    describe("when pulling to refresh", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_UPDATE_MOCK));
        await swipeDownElementFullscreen(genericScreenSO.cards[0]);
        await browser.waitUntil(async () => (await genericScreenSO.cards.length) === 1);
      });

      it("[PRPI-2409] should update the view content", async () => {
        expect(await genericScreenSO.cards.length).toBe(1);
      });
    });
  });
});
