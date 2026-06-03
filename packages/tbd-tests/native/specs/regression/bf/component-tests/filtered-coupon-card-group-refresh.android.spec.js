const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const {
  getGenericLayout,
  getQueryCardResponse,
  getFilteredCardResults,
  getQueryCardResponseByOperation,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const CouponListSO = require("@ppb/tbd-shared/components/CouponList/CouponList.so");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const {
  InlineSportsbookMarketSO,
  FilterBySO,
  PebbleSO,
  FilterCriteriaSO,
  OptionListSO,
  SportsbookBetButtonSO,
  CardSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const inlineSportsbookMarketSO = new InlineSportsbookMarketSO();
const firstSbkButton = new SportsbookBetButtonSO(inlineSportsbookMarketSO.sbkBetButtons[0]);
const couponListSO = new CouponListSO();

const filterBySO = new FilterBySO();
const sortPebbleSO = new PebbleSO(filterBySO.filters[0]);
const dateRangePebbleSO = new PebbleSO(filterBySO.filters[1]);
const competitionsPebbleSO = new PebbleSO(filterBySO.filters[2]);

const filterCriteriaSO = new FilterCriteriaSO();
const optionListSO = new OptionListSO(filterCriteriaSO.element);
const cardSO = new CardSO(filterCriteriaSO.element);

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

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  url: "/view/generic:home",
  title: null,
  pageInfo: null,
  edges: [
    {
      node: FILTERED_CARD_MOCK,
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
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

describe("When user is on a Generic View with all matches with inplay information", () => {
  beforeAll(async () => {
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
    await startApp("home");

    await browser.waitUntilEquals(await firstSbkButton.odd, "5");
  });

  it("[PRPI-3621] the filters should be displayed", async () => {
    expect(await sortPebbleSO.title.getText()).toBe("Rank");
    expect(await dateRangePebbleSO.title.getText()).toBe("Today");
    expect(await competitionsPebbleSO.title.getText()).toBe("Competitions");
    expect(await filterBySO.resetButton.isDisplayed()).toBeTruthy();
  });

  it("[PRPI-3622] the number of coupons displayed should be 2", async () => {
    expect(await couponListSO.coupons.length).toEqual(2);
  });

  describe("when user clicks on the competitions filter", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(competitionsPebbleSO.element);
      await competitionsPebbleSO.element.click(); // ou .element, check

      await browser.waitUntilDisplayed(filterCriteriaSO.element);
      await browser.waitUntilDisplayed(filterCriteriaSO.headerTitle, "Set Competitions");
      await browser.waitUntilDisplayed(cardSO.element, "Competitions collapse");
    });

    afterAll(async () => {
      await filterCriteriaSO.closeButton.click();
      await browser.waitUntilNotDisplayed(filterCriteriaSO.element);
    });

    it("[PRPI-3623] should have competition options", async () => {
      expect(await optionListSO.optionsText.length).toEqual(2);
      expect(await optionListSO.optionsText[0].getText()).toEqual("UEFA Champions League");
      expect(await optionListSO.optionsText[1].getText()).toEqual("Portuguese Primeira Liga");
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

      // Mock the updated filtered card results that should appear after refresh
      await mockService.mockHttpRequest(getFilteredCardResults(FILTERED_CARD_UPDATED_MOCK));

      // Wait for the poller to process the hash change and hook to mark URN as fresh
      await browser.waitUntil(async () => true, { timeout: 2000, interval: 100 });

      // Temporarily increase timeouts for background command to allow 141 seconds
      const originalConnectionRetryTimeout = browser.options.connectionRetryTimeout;

      try {
        browser.options.connectionRetryTimeout = 150_000; // 150 seconds to allow 141s background command

        // Move app to background for 141 seconds to exceed the 140 seconds timeout
        await driver.background(141);
      } finally {
        // Restore original timeouts
        browser.options.connectionRetryTimeout = originalConnectionRetryTimeout;
      }
    });

    describe("when user clicks on the competitions filter", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(competitionsPebbleSO.element);
        await competitionsPebbleSO.element.click(); // ou .element, check

        await browser.waitUntilDisplayed(filterCriteriaSO.element);
        await browser.waitUntilDisplayed(filterCriteriaSO.headerTitle, "Set Competitions");
        await browser.waitUntilDisplayed(cardSO.element, "Competitions collapse");
      });

      afterAll(async () => {
        await filterCriteriaSO.closeButton.click();
        await browser.waitUntilNotDisplayed(filterCriteriaSO.element);
      });

      it("[PRPI-3624] should have competition options updated", async () => {
        await browser.waitUntilEquals(optionListSO.optionsText[0], "Portuguese Primeira Liga", {
          errorMessage: `Text is ${optionListSO.optionsText[0].getText()}`,
        });
      });
    });

    it("[PRPI-3625] the number of coupons displayed should be updated to 3", async () => {
      // Wait for the refresh to happen and coupons to be updated
      await browser.waitUntil(async () => (await couponListSO.coupons.length) === 3, {
        timeout: 10000,
        timeoutMsg: "Expected coupons to be updated to 3 after refresh",
      });

      expect(await couponListSO.coupons.length).toEqual(3);
    });
  });
});
