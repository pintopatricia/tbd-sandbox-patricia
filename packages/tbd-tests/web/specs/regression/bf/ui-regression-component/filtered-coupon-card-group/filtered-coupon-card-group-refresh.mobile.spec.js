const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const {
  getGenericLayout,
  getQueryCardResponse,
  getFilteredCardResults,
  getQueryCardResponseByOperation,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const CouponListPO = require("@ppb/tbd-shared/components/CouponList/CouponList.web.po");
const NavigationTabsListPO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po");
const {
  OptionListPO,
  FilterByPO,
  InlineSportsbookMarketPO,
  CardPO,
  FilterCriteriaPO,
  PebblePO,
} = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const navigationTabsListPO = new NavigationTabsListPO();
const firstTabPO = navigationTabsListPO.tabs[0];
const secondTabPO = navigationTabsListPO.tabs[1];
const couponListPO = new CouponListPO();
const inlineSportsbookMarketPO = new InlineSportsbookMarketPO();

const filterByPO = new FilterByPO();
const sortPebblePO = new PebblePO(filterByPO.filters[0]);
const dateRangePebblePO = new PebblePO(filterByPO.filters[1]);
const competitionsPebblePO = new PebblePO(filterByPO.filters[2]);

const filterCriteriaPO = new FilterCriteriaPO();
const optionListPO = new OptionListPO(filterCriteriaPO.element);
const cardPO = new CardPO(filterCriteriaPO.element);

const EVENT_TYPE_ID = "1";

const FILTERED_CARD_MOCK = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
  filteredCouponTitle: "All Matches",
  filterOptions: {
    sortOption: {
      defaultOption: "RANK",
      availableOptions: ["RANK", "TIME"],
    },
    dateRangeFilter: {
      urn: "ppb:tbd:cardfilter:daterange:YIA8mBEAACMAMOhA/s/1",
      defaultOption: {
        urn: "ppb:tbd:daterangeoption:YIA8mBEAACMAMOhA/s/1|YIA8exEAACQAMOeu",
        title: {
          __typename: "DisplayNameTranslationKey",
          translationKey: "I18N.DATE.TODAY",
        },
      },
      availableOptions: [
        {
          urn: "ppb:tbd:daterangeoption:YIA8mBEAACMAMOhA/s/1|YIA8exEAACQAMOeu",
          title: {
            __typename: "DisplayNameTranslationKey",
            translationKey: "I18N.DATE.TODAY",
          },
        },
        {
          urn: "ppb:tbd:daterangeoption:YIA8mBEAACMAMOhA/s/1|YJFSZxQAACMATL6T",
          title: {
            __typename: "DisplayNameTitle",
            name: "In-Play Now",
          },
        },
      ],
    },
    marketTypeFilter: {
      urn: "ppb:tbd:cardfilter:markettype:YIA8mBEAACMAMOhA/s/1",
      defaultOption: null,
      availableOptions: [
        {
          name: "Match Odds",
          marketType: {
            urn: "ppb:marketType:MATCH_ODDS",
          },
        },
      ],
    },
    competitionsFilter: {
      urn: "ppb:tbd:cardfilter:competitions:YIA8mBEAACMAMOhA/s/1",
      defaultOptions: [],
      topCompetitions: [
        {
          __typename: "Competition",
          urn: "ppb:competition:228",
          name: "UEFA Champions League",
          competitionId: 228,
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            sportId: 1,
          },
        },
        {
          __typename: "Competition",
          urn: "ppb:competition:99",
          name: "Portuguese Primeira Liga",
          competitionId: 99,
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
  full: {
    edges: [
      {
        node: {
          __typename: "CouponHeaderCard",
          urn: "ppb:tbd:card:couponheader:YIA8mBEAACMAMOhA/s/1|228",
          competition: {
            __typename: "Competition",
            urn: "ppb:competition:228",
            name: "Friendly Matches",
            competitionId: 228,
            sport: {
              __typename: "Sport",
              urn: "ppb:eventType:1",
              name: "Football",
              sportId: 1,
            },
          },
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30464707/MATCH_ODDS",
          eventViewLink: {
            viewUrn: "ppb:tbd:view:event:30464707",
            viewUrl: "football/uefa-champions-league/chelsea-v-real-madrid/e-30464707",
          },
          runnerViewLinks: [
            {
              runnerUrn: "ppb:excRunner:1.182678271/55190/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182678271/55190/0",
            },
            {
              runnerUrn: "ppb:excRunner:1.182678271/2426/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182678271/2426/0",
            },
            {
              runnerUrn: "ppb:excRunner:1.182678271/58805/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182678271/58805/0",
            },
          ],

          title: "Match Odds",
          sportevent: {
            __typename: "SportsEvent",
            urn: "ppb:event:30464707",
            name: "Chelsea v Real Madrid",
          },
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.262429640",
                name: "Match Odds",
                hierarchy: {
                  __typename: "EventCompetitionHierarchy",
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:228",
                    name: "UEFA Champions League",
                    competitionId: 228,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                      sportId: 1,
                    },
                  },
                  sportevent: {
                    __typename: "SportsEvent",
                    urn: "ppb:event:30464707",
                    name: "Chelsea v Real Madrid",
                  },
                },
                runners: [
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.262429640/55190",
                    name: "Chelsea",
                    selectionId: 55190,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.262429640/2426",
                    name: "Real Madrid",
                    selectionId: 2426,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.262429640/58805",
                    name: "The Draw",
                    selectionId: 58805,
                    handicap: 0,
                    resultType: null,
                  },
                ],
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.262429640/55190",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.262429640/2426",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.262429640/58805",
                },
              ],
            },
          },
          fixture: {
            urn: "ppb:fixture:30464707",
            home: {
              name: "Chelsea",
            },
            away: {
              name: "Real Madrid",
            },
            scheduledAt: "2021-05-05T19:00:00Z",
          },
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30482022/MATCH_ODDS",
          eventViewLink: {
            viewUrn: "ppb:tbd:view:event:30482022",
            viewUrl: "football/portuguese-primeira-liga/braga-v-pacos-ferreira/e-30482022",
          },
          runnerViewLinks: [
            {
              runnerUrn: "ppb:excRunner:1.182896135/48799/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182896135/48799/0",
            },
            {
              runnerUrn: "ppb:excRunner:1.182896135/48787/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182896135/48787/0",
            },
            {
              runnerUrn: "ppb:excRunner:1.182896135/58805/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182896135/58805/0",
            },
          ],

          title: "Match Odds",
          sportevent: {
            __typename: "SportsEvent",
            urn: "ppb:event:30482022",
            name: "Braga v Pacos Ferreira",
          },
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.263003281",
                name: "Match Odds",
                marketType: "MATCH_ODDS",

                hierarchy: {
                  __typename: "EventCompetitionHierarchy",
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:99",
                    name: "Portuguese Primeira Liga",
                    competitionId: 99,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                      sportId: 1,
                    },
                  },
                  sportevent: {
                    __typename: "SportsEvent",
                    urn: "ppb:event:30482022",
                    name: "Braga v Pacos Ferreira",
                  },
                },
                runners: [
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.263003281/48799",
                    name: "Braga",
                    selectionId: 48799,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.263003281/48787",
                    name: "Pacos Ferreira",
                    selectionId: 48787,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.263003281/58805",
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
                  runnerURN: "ppb:sbkRunner:924.263003281/48799",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.263003281/48787",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.263003281/58805",
                },
              ],
            },
          },
          fixture: {
            urn: "ppb:fixture:30482022",
            home: {
              name: "Braga",
            },
            away: {
              name: "Pacos Ferreira",
            },
            scheduledAt: "2021-05-05T18:00:00Z",
          },
        },
      },
    ],
  },
  partials: {
    partialEdges: [
      {
        node: {
          __typename: "CouponHeaderCard",
          urn: "ppb:tbd:card:couponheader:YIA8mBEAACMAMOhA/s/1|228",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30464707/MATCH_ODDS",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30482022/MATCH_ODDS",
        },
      },
    ],
  },
};

const FILTERED_CARD_UPDATED_MOCK = {
  cards: [
    {
      __typename: "FilteredCouponCardGroup",
      urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      filteredCouponTitle: "All Matches",
      filterOptions: {
        sortOption: {
          defaultOption: "TIME",
          availableOptions: ["RANK", "TIME"],
        },
        dateRangeFilter: {
          urn: "ppb:tbd:cardfilter:daterange:YIA8mBEAACMAMOhA/s/1",
          defaultOption: {
            urn: "ppb:tbd:daterangeoption:YIA8mBEAACMAMOhA/s/1|YIA8exEAACQAMOeu",
            title: {
              __typename: "DisplayNameTranslationKey",
              translationKey: "I18N.DATE.TODAY",
            },
          },
          availableOptions: [
            {
              urn: "ppb:tbd:daterangeoption:YIA8mBEAACMAMOhA/s/1|YIA8exEAACQAMOeu",
              title: {
                __typename: "DisplayNameTranslationKey",
                translationKey: "I18N.DATE.TODAY",
              },
            },
            {
              urn: "ppb:tbd:daterangeoption:YIA8mBEAACMAMOhA/s/1|YJFSZxQAACMATL6T",
              title: {
                __typename: "DisplayNameTitle",
                name: "In-Play Now",
              },
            },
          ],
        },
        marketTypeFilter: {
          urn: "ppb:tbd:cardfilter:markettype:YIA8mBEAACMAMOhA/s/1",
          defaultOption: null,
          availableOptions: [
            {
              name: "Match Odds",
              marketType: {
                urn: "ppb:marketType:MATCH_ODDS",
              },
            },
          ],
        },
        competitionsFilter: {
          urn: "ppb:tbd:cardfilter:competitions:YIA8mBEAACMAMOhA/s/1",
          defaultOptions: [],
          topCompetitions: [
            {
              __typename: "Competition",
              urn: "ppb:competition:99",
              name: "Portuguese Primeira Liga",
              competitionId: 99,
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
      full: {
        edges: [
          {
            node: {
              __typename: "CouponHeaderCard",
              urn: "ppb:tbd:card:couponheader:YIA8mBEAACMAMOhA/s/1|228",
              competition: {
                __typename: "Competition",
                urn: "ppb:competition:228",
                name: "Friendly Matches",
                competitionId: 228,
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:1",
                  name: "Football",
                  sportId: 1,
                },
              },
            },
          },
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30464707/MATCH_ODDS",
              eventViewLink: {
                viewUrn: "ppb:tbd:view:event:30464707",
                viewUrl: "football/uefa-champions-league/chelsea-v-real-madrid/e-30464707",
              },
              runnerViewLinks: [
                {
                  runnerUrn: "ppb:excRunner:1.182678271/55190/0",
                  viewUrl: "Not Implemented",
                  viewUrn: "ppb:tbd:view:runner:1.182678271/55190/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182678271/2426/0",
                  viewUrl: "Not Implemented",
                  viewUrn: "ppb:tbd:view:runner:1.182678271/2426/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182678271/58805/0",
                  viewUrl: "Not Implemented",
                  viewUrn: "ppb:tbd:view:runner:1.182678271/58805/0",
                },
              ],

              title: "Match Odds",
              sportevent: {
                __typename: "SportsEvent",
                urn: "ppb:event:30464707",
                name: "Chelsea v Real Madrid",
              },
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.262429640",
                    name: "Match Odds",
                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:228",
                        name: "UEFA Champions League",
                        competitionId: 228,
                        sport: {
                          __typename: "Sport",
                          urn: "ppb:eventType:1",
                          name: "Football",
                          sportId: 1,
                        },
                      },
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:30464707",
                        name: "Chelsea v Real Madrid",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.262429640/55190",
                        name: "Chelsea",
                        selectionId: 55190,
                        handicap: 0,
                        resultType: null,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.262429640/2426",
                        name: "Real Madrid",
                        selectionId: 2426,
                        handicap: 0,
                        resultType: null,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.262429640/58805",
                        name: "The Draw",
                        selectionId: 58805,
                        handicap: 0,
                        resultType: null,
                      },
                    ],
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.262429640/55190",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.262429640/2426",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.262429640/58805",
                    },
                  ],
                },
              },
              fixture: {
                urn: "ppb:fixture:30464707",
                home: {
                  name: "Chelsea",
                },
                away: {
                  name: "Real Madrid",
                },
                scheduledAt: "2021-05-05T19:00:00Z",
              },
            },
          },
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30482022/MATCH_ODDS",
              eventViewLink: {
                viewUrn: "ppb:tbd:view:event:30482022",
                viewUrl: "football/portuguese-primeira-liga/braga-v-pacos-ferreira/e-30482022",
              },
              runnerViewLinks: [
                {
                  runnerUrn: "ppb:excRunner:1.182896135/48799/0",
                  viewUrl: "Not Implemented",
                  viewUrn: "ppb:tbd:view:runner:1.182896135/48799/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182896135/48787/0",
                  viewUrl: "Not Implemented",
                  viewUrn: "ppb:tbd:view:runner:1.182896135/48787/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182896135/58805/0",
                  viewUrl: "Not Implemented",
                  viewUrn: "ppb:tbd:view:runner:1.182896135/58805/0",
                },
              ],

              title: "Match Odds",
              sportevent: {
                __typename: "SportsEvent",
                urn: "ppb:event:30482022",
                name: "Braga v Pacos Ferreira",
              },
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.263003281",
                    name: "Match Odds",
                    marketType: "MATCH_ODDS",

                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:99",
                        name: "Portuguese Primeira Liga",
                        competitionId: 99,
                        sport: {
                          __typename: "Sport",
                          urn: "ppb:eventType:1",
                          name: "Football",
                          sportId: 1,
                        },
                      },
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:30482022",
                        name: "Braga v Pacos Ferreira",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003281/48799",
                        name: "Braga",
                        selectionId: 48799,
                        handicap: 0,
                        resultType: null,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003281/48787",
                        name: "Pacos Ferreira",
                        selectionId: 48787,
                        handicap: 0,
                        resultType: null,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003281/58805",
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
                      runnerURN: "ppb:sbkRunner:924.263003281/48799",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.263003281/48787",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.263003281/58805",
                    },
                  ],
                },
              },
              fixture: {
                urn: "ppb:fixture:30482022",
                home: {
                  name: "Braga",
                },
                away: {
                  name: "Pacos Ferreira",
                },
                scheduledAt: "2021-05-05T18:00:00Z",
              },
            },
          },
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30482023/MATCH_ODDS",
              eventViewLink: {
                viewUrn: "ppb:tbd:view:event:30482023",
                viewUrl: "football/portuguese-primeira-liga/new-team-1-v-new-team-2/e-30482023",
              },
              runnerViewLinks: [],
              title: "Match Odds",
              sportevent: {
                __typename: "SportsEvent",
                urn: "ppb:event:30482023",
                name: "New Team 1 v New Team 2",
              },
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.263003282",
                    name: "Match Odds",
                    marketType: "MATCH_ODDS",

                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:99",
                        name: "Portuguese Primeira Liga",
                        competitionId: 99,
                        sport: {
                          __typename: "Sport",
                          urn: "ppb:eventType:1",
                          name: "Football",
                          sportId: 1,
                        },
                      },
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:30482023",
                        name: "New Team 1 v New Team 2",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003282/48799",
                        name: "New Team 1",
                        selectionId: 48799,
                        handicap: 0,
                        resultType: null,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003282/48787",
                        name: "New Team 2",
                        selectionId: 48787,
                        handicap: 0,
                        resultType: null,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003282/58805",
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
                      runnerURN: "ppb:sbkRunner:924.263003282/48799",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.263003282/48787",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.263003282/58805",
                    },
                  ],
                },
              },
              fixture: {
                urn: "ppb:fixture:30482023",
                home: {
                  name: "New Team 1",
                },
                away: {
                  name: "New Team 2",
                },
                scheduledAt: "2021-05-05T18:00:00Z",
              },
            },
          },
        ],
      },
      partials: {
        partialEdges: [
          {
            node: {
              __typename: "CouponHeaderCard",
              urn: "ppb:tbd:card:couponheader:YIA8mBEAACMAMOhA/s/1|228",
            },
          },
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30464707/MATCH_ODDS",
            },
          },
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30482022/MATCH_ODDS",
            },
          },
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30482023/MATCH_ODDS",
            },
          },
        ],
      },
    },
  ],
};

const NAVIGATION_TABS_LIST_MOCK = {
  node: {
    __typename: "NavigationTabsList",
    urn: "ppb:tbd:card:navigationTabsList:##navigationTabsList##",
    tabsTitle: "All Football",
    full: {
      edges: [
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##monday##",
            tabTitle: {
              translate: {
                key: "I18N.DATE.MONDAY",
              },
            },
            full: {
              edges: [{ node: FILTERED_CARD_MOCK }],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "FilteredCouponCardGroup",
                    urn: FILTERED_CARD_MOCK.urn,
                  },
                },
              ],
            },
          },
        },
      ],
    },
    partials: {
      edges: [
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##monday##",
            tabTitle: {
              translate: {
                key: "I18N.DATE.MONDAY",
              },
            },
          },
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##tuesday##",
            tabTitle: {
              translate: {
                key: "I18N.DATE.TUESDAY",
              },
            },
            tabViewLink: {
              viewUrl: "football/e-29682729?tabId=YIGX-RAAACIAeejV",
              viewUrn: "ppb:tbd:view:event:29682729?=tabId=YIGX-RAAACIAeejV",
            },
          },
        },
      ],
    },
  },
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:allmatchesraces/1",
  url: "view/generic:allmatchesraces/1",
  title: null,
  pageInfo: null,
  edges: [NAVIGATION_TABS_LIST_MOCK],
  partialEdges: [
    {
      node: {
        __typename: "NavigationTabsList",
        urn: NAVIGATION_TABS_LIST_MOCK.node.urn,
      },
    },
  ],
};

const ALL_COMPETITIONS_MOCK = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
  filteredCouponTitle: "All Matches",
  filterOptions: {
    competitionsFilter: {
      allCompetitions: [
        {
          country: {
            code: "International",
            urn: "ppb:tbd:country:International",
          },
          competitions: [
            {
              __typename: "Competition",
              urn: "ppb:competition:228",
              name: "UEFA Champions League",
              competitionId: 228,
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:1",
                name: "Football",
                sportId: 1,
              },
            },
          ],
        },
        {
          country: {
            code: "PRT",
            urn: "ppb:tbd:country:PRT",
          },
          competitions: [
            {
              __typename: "Competition",
              urn: "ppb:competition:99",
              name: "Portuguese Primeira Liga",
              competitionId: 99,
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:1",
                name: "Football",
                sportId: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.262429640",
      runnerDetails: [
        {
          selectionId: 55190,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.0 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 2426,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.4 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
          },
          runnerStatus: "ACTIVE",
        },
      ],
    },
    {
      marketId: "924.263003281",
      runnerDetails: [
        {
          selectionId: 48799,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.0 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 48787,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.75 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.0 },
          },
          runnerStatus: "ACTIVE",
        },
      ],
    },
  ],
};

const BFF_EMPTY_TAB = {
  cards: [
    {
      __typename: "NavigationTab",
      urn: "ppb:tbd:view:navigationTab:##tuesday##",
      tabTitle: {
        translate: {
          key: "I18N.DATE.TUESDAY",
        },
      },
      full: {
        edges: [null],
      },
      partials: {
        partialEdges: [],
      },
    },
  ],
};

// TODO: AC - module is not updating because it's not considering any change on component visibility
// Need to investigate how can we force it on grid (locally it passes)
xdescribe("When user is on a Generic View with all matches with inplay information", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getQueryCardResponse("AllCompetitionsFilter", ALL_COMPETITIONS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    // Mock initial update for poller
    await mockService.mockHttpRequest(
      getQueryCardResponseByOperation("CouponRefreshCard", {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      }),
    );
    await mockService.mockHttpRequest(getFilteredCardResults(FILTERED_CARD_UPDATED_MOCK));
    await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
    await browser.waitUntilEquals(await inlineSportsbookMarketPO.betButtons[0], "5");
  });

  it("[PRPI-5749] the filters should be displayed", async () => {
    expect(await sortPebblePO.element.getText()).toBe("Rank");
    expect(await dateRangePebblePO.element.getText()).toBe("Today");
    expect(await competitionsPebblePO.element.getText()).toBe("Competitions");
    expect(await filterByPO.resetButton.isDisplayed()).toBeTruthy();
  });

  it("[PRPI-3622] the number of coupons displayed should be 2", async () => {
    expect(await couponListPO.filteredCoupons.length).toBe(2);
  });

  describe("when user clicks on the competitions filter", () => {
    beforeAll(async () => {
      await competitionsPebblePO.element.waitForClickable();
      await competitionsPebblePO.element.click();

      await browser.waitUntilDisplayed(filterCriteriaPO.element);
      await browser.waitUntilDisplayed(filterCriteriaPO.headerTitle, "Set Competitions");
      await browser.waitUntilDisplayed(cardPO.element, "Competitions card");
    });

    afterAll(async () => {
      await filterCriteriaPO.closeButton.click();
      await browser.waitUntilNotDisplayed(filterCriteriaPO.element);
    });

    it("[PRPI-5765] should have competition options", async () => {
      expect(await optionListPO.itemText[0].getText()).toEqual("UEFA Champions League");
      expect(await optionListPO.itemText[1].getText()).toEqual("Portuguese Primeira Liga");
      expect(await filterCriteriaPO.collapsibleCards[0].getText()).toEqual("International");
      expect(await filterCriteriaPO.collapsibleCards[1].getText()).toEqual("Portugal");
    });
  });

  describe("When coupon data refreshes", () => {
    beforeAll(async () => {
      // Mock update for poller
      await mockService.mockHttpRequest(
        getQueryCardResponseByOperation("CouponRefreshCard", {
          __typename: "FilteredCouponCardGroup",
          urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
        }),
      );

      await mockService.mockHttpRequest(getCardResults(BFF_EMPTY_TAB));

      await browser.tickFakeClock();
      await browser.tickFakeClock();

      await secondTabPO.click();
      await browser.containsClass(secondTabPO, NavigationTabsListPO.states.selected);

      await firstTabPO.click();
      await browser.containsClass(firstTabPO, NavigationTabsListPO.states.selected);

      await browser.minimizeWindow();
      await browser.maximizeWindow();
    });

    describe("when user clicks on the competitions filter", () => {
      beforeAll(async () => {
        await competitionsPebblePO.element.waitForClickable();
        await competitionsPebblePO.element.click();

        await browser.waitUntilDisplayed(filterCriteriaPO.element);
        await browser.waitUntilDisplayed(filterCriteriaPO.headerTitle, "Set Competitions");
        await browser.waitUntilDisplayed(cardPO.element, "Competitions card");
      });

      afterAll(async () => {
        await filterCriteriaPO.closeButton.click();
        await browser.waitUntilNotDisplayed(filterCriteriaPO.element);
      });

      it("[PRPI-3624] should have competition options updated", async () => {
        expect(await optionListPO.itemText[0].getText()).toEqual("Portuguese Primeira Liga");
      });
    });

    it("[PRPI-3625] the number of coupons displayed should be updated to 3", async () => {
      expect(await couponListPO.filteredCoupons.length).toBe(3);
    });
  });
});
