const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const {
  getGenericLayout,
  getFilteredCardResults,
  getQueryCardResponse,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const CouponListPO = require("@ppb/tbd-shared/components/CouponList/CouponList.web.po");
const {
  OptionListPO,
  FilterByPO,
  InlineSportsbookMarketPO,
  AlertPO,
  PrimaryButtonPO,
  RadioListPO,
  ActionLinkPO,
  CardPO,
  FilterCriteriaPO,
  PebblePO,
} = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const alertPO = new AlertPO();
const couponListPO = new CouponListPO();
const inlineSportsbookMarketPO = new InlineSportsbookMarketPO();

const filterByPO = new FilterByPO();
const sortPebblePO = new PebblePO(filterByPO.filters[0]);
const dateRangePebblePO = new PebblePO(filterByPO.filters[1]);
const competitionsPebblePO = new PebblePO(filterByPO.filters[2]);

const filterCriteriaPO = new FilterCriteriaPO();
const radioListPO = new RadioListPO(filterCriteriaPO.element);
const optionListPO = new OptionListPO(filterCriteriaPO.element);
const actionLinkPO = new ActionLinkPO(filterCriteriaPO.actionLink);
const cardPO = new CardPO(filterCriteriaPO.element);
const primaryButtonPO = new PrimaryButtonPO();

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
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30482020/MATCH_ODDS",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30482021/MATCH_ODDS",
        },
      },
    ],
  },
};

const FILTERED_CARD_NO_DEFAULTS_MOCK = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
  filteredCouponTitle: "All Matches",
  filterOptions: {
    dateRangeFilter: {
      urn: "ppb:tbd:cardfilter:daterange:YIA8mBEAACMAMOhA/s/1",
      defaultOption: undefined,
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
    competitionsFilter: {
      urn: "ppb:tbd:cardfilter:competitions:YIA8mBEAACMAMOhA/s/1",
      defaultOptions: undefined,
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
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30482020/MATCH_ODDS",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30482021/MATCH_ODDS",
        },
      },
    ],
  },
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:allmatchesraces/1",
  url: "view/generic:allmatchesraces/1",
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

const BFF_NO_DEFAULTS_MOCK = {
  urn: "ppb:tbd:view:generic:allmatchesraces/1",
  url: "view/generic:allmatchesraces/1",
  title: null,
  pageInfo: null,
  edges: [
    {
      node: FILTERED_CARD_NO_DEFAULTS_MOCK,
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

const INPLAY_FILTERED_CARD_MOCK = {
  cards: [
    {
      __typename: "FilteredCouponCardGroup",
      urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      filteredCouponTitle: "All Matches",
      full: {
        edges: [
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30482021/MATCH_ODDS",
              eventViewLink: {
                viewUrn: "ppb:tbd:view:event:30482021",
                viewUrl: "football/portuguese-primeira-liga/rio-ave-v-sporting-lisbon/e-30482021",
              },
              runnerViewLinks: [
                {
                  runnerUrn: "ppb:excRunner:1.182896261/495321/0",
                  viewUrn: "ppb:tbd:view:runner:1.182896261/495321/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182896261/2506293/0",
                  viewUrn: "ppb:tbd:view:runner:1.182896261/2506293/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182896261/58805/0",
                  viewUrn: "ppb:tbd:view:runner:1.182896261/58805/0",
                },
              ],

              title: "Match Odds",
              sportevent: {
                __typename: "SportsEvent",
                urn: "ppb:event:30482021",
                name: "Rio Ave v Sporting Lisbon",
              },
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.263003261",
                    name: "Match Odds",
                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:99",
                        name: "Portuguese Primeira Liga",
                        competitionId: 99,
                      },
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:30482021",
                        name: "Rio Ave v Sporting Lisbon",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003261/495321",
                        name: "Rio Ave",
                        selectionId: 495321,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003261/2506293",
                        name: "Sporting Lisbon",
                        selectionId: 2506293,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003261/58805",
                        name: "The Draw",
                        selectionId: 58805,
                      },
                    ],
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.263003261/495321",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.263003261/2506293",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.263003261/58805",
                    },
                  ],
                },
              },
              fixture: {
                urn: "ppb:fixture:30482021",
                home: {
                  name: "Rio Ave",
                },
                away: {
                  name: "Sporting Lisbon",
                },
                scheduledAt: "2021-05-05T20:15:00Z",
                startedAt: "2021-05-05T20:15:36Z",
                score: {
                  home: 0,
                  away: 2,
                },
                duration: {
                  period: "REGULAR",
                  status: "INPLAY_SECOND_HALF",
                  clock: {
                    minute: 87,
                    second: 36,
                  },
                },
              },
            },
          },
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30473278/MATCH_ODDS",
              eventViewLink: {
                viewUrn: "ppb:tbd:view:event:30473278",
                viewUrl: "football/conmebol-copa-libertadores/racing-club-v-sao-paulo/e-30473278",
              },
              runnerViewLinks: [
                {
                  runnerUrn: "ppb:excRunner:1.182785141/198558/0",
                  viewUrn: "ppb:tbd:view:runner:1.182785141/198558/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182785141/198126/0",
                  viewUrn: "ppb:tbd:view:runner:1.182785141/198126/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182785141/58805/0",
                  viewUrn: "ppb:tbd:view:runner:1.182785141/58805/0",
                },
              ],

              title: "Match Odds",
              sportevent: {
                __typename: "SportsEvent",
                urn: "ppb:event:30473278",
                name: "Racing Club v Sao Paulo",
              },
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.262724222",
                    name: "Match Odds",
                    marketType: "MATCH_ODDS",
                    marketTypeName: null,
                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:12147796",
                        name: "CONMEBOL Copa Libertadores",
                        competitionId: 12147796,
                      },
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:30473278",
                        name: "Racing Club v Sao Paulo",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.262724222/198558",
                        name: "Racing Club",
                        selectionId: 198558,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.262724222/198126",
                        name: "Sao Paulo",
                        selectionId: 198126,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.262724222/58805",
                        name: "The Draw",
                        selectionId: 58805,
                      },
                    ],
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.262724222/198558",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.262724222/198126",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.262724222/58805",
                    },
                  ],
                },
              },
              fixture: {
                urn: "ppb:fixture:30473278",
                home: {
                  name: "Racing Club",
                  color: "ffffff",
                },
                away: {
                  name: "Sao Paulo",
                  color: "ff0000",
                },
                scheduledAt: "2021-05-05T22:00:00Z",
                startedAt: "2021-05-05T22:00:03Z",
                score: {
                  home: 0,
                  away: 0,
                },
                duration: {
                  period: "REGULAR",
                  status: "INPLAY_FIRST_HALF",
                  clock: {
                    minute: 5,
                    second: 43,
                  },
                },
              },
            },
          },
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30473260/MATCH_ODDS",
              eventViewLink: {
                viewUrn: "ppb:tbd:view:event:30473260",
                viewUrl:
                  "/football/conmebol-copa-libertadores/independiente-(ecu)-v-universitario-de-deportes/e-30473260",
              },
              runnerViewLinks: [
                {
                  runnerUrn: "ppb:excRunner:1.182785815/6432339/0",
                  viewUrn: "ppb:tbd:view:runner:1.182785815/6432339/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182785815/3636903/0",
                  viewUrn: "ppb:tbd:view:runner:1.182785815/3636903/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182785815/58805/0",
                  viewUrn: "ppb:tbd:view:runner:1.182785815/58805/0",
                },
              ],

              title: "Match Odds",
              sportevent: {
                __typename: "SportsEvent",
                urn: "ppb:event:30473260",
                name: "Independiente (Ecu) v Universitario de Deportes",
              },
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.262723691",
                    name: "Match Odds",
                    marketType: "MATCH_ODDS",
                    marketTypeName: null,
                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:12147796",
                        name: "CONMEBOL Copa Libertadores",
                        competitionId: 12147796,
                      },
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:30473260",
                        name: "Independiente (Ecu) v Universitario de Deportes",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.262723691/6432339",
                        name: "Independiente (Ecu)",
                        selectionId: 6432339,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.262723691/3636903",
                        name: "Universitario de Deportes",
                        selectionId: 3636903,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.262723691/58805",
                        name: "The Draw",
                        selectionId: 58805,
                      },
                    ],
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.262723691/6432339",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.262723691/3636903",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.262723691/58805",
                    },
                  ],
                },
              },
              fixture: {
                urn: "ppb:fixture:30473260",
                home: {
                  name: "Independiente (Ecu)",
                  color: "000000",
                },
                away: {
                  name: "Universitario de Deportes",
                  color: "ffffff",
                },
                scheduledAt: "2021-05-05T22:00:00Z",
                startedAt: "2021-05-05T22:00:38Z",
                score: {
                  home: 0,
                  away: 0,
                },
                duration: {
                  period: "REGULAR",
                  status: "INPLAY_FIRST_HALF",
                  clock: {
                    minute: 5,
                    second: 7,
                  },
                },
              },
            },
          },
        ],
      },
      partials: {
        partialEdges: [
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30482021/MATCH_ODDS",
            },
          },
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30473278/MATCH_ODDS",
            },
          },
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30473260/MATCH_ODDS",
            },
          },
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30484098/MATCH_ODDS",
            },
          },
        ],
      },
    },
  ],
};

const COMPETITION_FILTERED_CARD_MOCK = {
  cards: [
    {
      __typename: "FilteredCouponCardGroup",
      urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      filteredCouponTitle: "All Matches",
      full: {
        edges: [
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30482021/MATCH_ODDS",
              eventViewLink: {
                viewUrn: "ppb:tbd:view:event:30482021",
                viewUrl: "football/portuguese-primeira-liga/rio-ave-v-sporting-lisbon/e-30482021",
              },
              runnerViewLinks: [
                {
                  runnerUrn: "ppb:excRunner:1.182896261/495321/0",
                  viewUrn: "ppb:tbd:view:runner:1.182896261/495321/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182896261/2506293/0",
                  viewUrn: "ppb:tbd:view:runner:1.182896261/2506293/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182896261/58805/0",
                  viewUrn: "ppb:tbd:view:runner:1.182896261/58805/0",
                },
              ],

              title: "Match Odds",
              sportevent: {
                __typename: "SportsEvent",
                urn: "ppb:event:30482021",
                name: "Rio Ave v Sporting Lisbon",
              },
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.263003261",
                    name: "Match Odds",
                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:99",
                        name: "Portuguese Primeira Liga",
                        competitionId: 99,
                      },
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:30482021",
                        name: "Rio Ave v Sporting Lisbon",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003261/495321",
                        name: "Rio Ave",
                        selectionId: 495321,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003261/2506293",
                        name: "Sporting Lisbon",
                        selectionId: 2506293,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003261/58805",
                        name: "The Draw",
                        selectionId: 58805,
                      },
                    ],
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.263003261/495321",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.263003261/2506293",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.263003261/58805",
                    },
                  ],
                },
              },
              fixture: {
                urn: "ppb:fixture:30482021",
                home: {
                  name: "Rio Ave",
                },
                away: {
                  name: "Sporting Lisbon",
                },
                scheduledAt: "2021-05-05T20:15:00Z",
                startedAt: "2021-05-05T20:15:36Z",
                score: {
                  home: 0,
                  away: 2,
                },
                duration: {
                  period: "REGULAR",
                  status: "INPLAY_SECOND_HALF",
                  clock: {
                    minute: 87,
                    second: 36,
                  },
                },
              },
            },
          },
        ],
      },
      partials: {
        partialEdges: [
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30482021/MATCH_ODDS",
            },
          },
        ],
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

const RESET_FILTERED_CARD_MOCK = {
  cards: [FILTERED_CARD_MOCK],
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

describe("When user is on a Generic View with all matches", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getQueryCardResponse("AllCompetitionsFilter", ALL_COMPETITIONS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));

    await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
    await browser.waitUntilEquals(await inlineSportsbookMarketPO.betButtons[0], "5");
  });

  it("[PRPI-5748] the notification info should not be displayed", async () => {
    expect(await alertPO.element.isExisting()).toBe(false);
  });

  it("[PRPI-5749] the filters should be displayed", async () => {
    expect(await sortPebblePO.element.getText()).toBe("Rank");
    expect(await dateRangePebblePO.element.getText()).toBe("Today");
    expect(await competitionsPebblePO.element.getText()).toBe("Competitions");
    expect(await filterByPO.resetButton.isDisplayed()).toBeTruthy();
  });

  it("[PRPI-5750] the competitions filter should not be highlighted", async () => {
    expect(await browser.containsClass(competitionsPebblePO.element, "active")).toBe(false);
  });

  it("[PRPI-5751] the competitions filter should not display the counter", async () => {
    expect(await competitionsPebblePO.counter.isDisplayed()).toBe(false);
  });

  describe("when user clicks on SORT filter", () => {
    beforeAll(async () => {
      await sortPebblePO.element.waitForClickable();
      await sortPebblePO.element.click();

      await browser.waitUntilDisplayed(filterCriteriaPO.element);
    });

    it("[PRPI-5752] the pop-up should be displayed", async () => {
      expect(await filterCriteriaPO.element.isDisplayed()).toEqual(true);
    });

    it("[PRPI-5753] the title 'Sort by' should be displayed", async () => {
      expect(await filterCriteriaPO.headerTitle.getText()).toEqual("Sort Matches by");
    });

    it("[PRPI-5754] should have SORT filters", async () => {
      expect(await radioListPO.itemInput.length).toEqual(2);
      expect(await radioListPO.itemText[0].getText()).toEqual("Rank");
      expect(await radioListPO.itemText[1].getText()).toEqual("Time");
    });

    describe("and when clicking on the 'Time' option", () => {
      beforeAll(async () => {
        await radioListPO.itemInput[1].click();
        await browser.waitUntilNotDisplayed(filterCriteriaPO.element);
      });

      it("[PRPI-5755] the time filter dropdown label should now display 'Time'", async () => {
        expect(await filterByPO.filters[0].getText()).toEqual("Time");
      });
    });

    describe("and when clicking on the sort filter again", () => {
      beforeAll(async () => {
        await filterByPO.filters[0].click();
        await browser.waitUntilDisplayed(filterCriteriaPO.element);
      });

      describe("when the user clicks on the close option", () => {
        beforeAll(async () => {
          await filterCriteriaPO.closeButton.click();
          await browser.waitUntilNotDisplayed(filterCriteriaPO.element);
        });

        it("[PRPI-5756] the pop-up should be closed", async () => {
          expect(await filterCriteriaPO.element.isDisplayed()).toBe(false);
        });
      });
    });
  });

  describe("when user clicks on date range filter", () => {
    beforeAll(async () => {
      await dateRangePebblePO.element.waitForClickable();
      await dateRangePebblePO.element.click();

      await browser.waitUntilDisplayed(filterCriteriaPO.element);
    });

    it("[PRPI-5757] the pop-up should be displayed", async () => {
      expect(await filterCriteriaPO.element.isDisplayed()).toEqual(true);
    });

    it("[PRPI-5758] the title 'set data range' should be displayed", async () => {
      expect(await filterCriteriaPO.headerTitle.getText()).toEqual("Set Date Range");
    });

    it("[PRPI-5759] should have DATE filters", async () => {
      expect(await radioListPO.itemInput.length).toEqual(2);
      expect(await radioListPO.itemText[0].getText()).toEqual("Today");
      expect(await radioListPO.itemText[1].getText()).toEqual("In-Play Now");
    });

    describe("when user selects a time option", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getFilteredCardResults(INPLAY_FILTERED_CARD_MOCK));

        await radioListPO.itemInput[1].click();

        await browser.waitUntilNotDisplayed(filterCriteriaPO.element);
        await browser.waitUntil(async () => {
          const numCoupons = await couponListPO.filteredCoupons.length;
          return numCoupons === 3;
        });
      });

      it("[PRPI-5760] the pop-up should be closed", async () => {
        expect(await filterCriteriaPO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-5761] the date range filter dropdown should now display 'In-Play Now'", async () => {
        expect(await filterByPO.filters[1].getText()).toEqual("In-Play Now");
      });

      it("[PRPI-5762] the events list should be updated", async () => {
        expect(await couponListPO.filteredCoupons.length).toEqual(3);
      });
    });
  });

  describe("when user clicks on the competitions filter", () => {
    beforeAll(async () => {
      await competitionsPebblePO.element.waitForClickable();
      await competitionsPebblePO.element.click();

      await browser.waitUntilDisplayed(filterCriteriaPO.element);
      await browser.waitUntilDisplayed(filterCriteriaPO.headerTitle, "Set Competitions");
      await browser.waitUntilDisplayed(cardPO.element, "Competitions card");
    });

    it("[PRPI-5763] the pop-up should be displayed", async () => {
      expect(await filterCriteriaPO.element.isDisplayed()).toEqual(true);
    });

    it("[PRPI-5764] the title 'set competitions' should be displayed", async () => {
      expect(await filterCriteriaPO.headerTitle.getText()).toEqual("Set Competitions");
    });

    it("[PRPI-5765] should have competition options", async () => {
      expect(await optionListPO.itemText[0].getText()).toEqual("UEFA Champions League");
      expect(await optionListPO.itemText[1].getText()).toEqual("Portuguese Primeira Liga");
      expect(await filterCriteriaPO.collapsibleCards[0].getText()).toEqual("International");
      expect(await filterCriteriaPO.collapsibleCards[1].getText()).toEqual("Portugal");
    });

    describe("when user selects a competition option", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getFilteredCardResults(COMPETITION_FILTERED_CARD_MOCK));

        await optionListPO.itemText[0].waitForClickable();
        await optionListPO.itemText[0].click();
      });

      it("[PRPI-5766] should have a competition selected", async () => {
        expect(await optionListPO.itemSelected[0].isSelected()).toEqual(true);
      });

      it("[PRPI-5767] the reset button should be displayed", async () => {
        expect(await actionLinkPO.element.isDisplayed()).toEqual(true);
      });

      describe("and then when hitting the reset button", () => {
        beforeAll(async () => {
          await actionLinkPO.element.click();
        });

        it("[PRPI-5768] there should no longer be any selected competitions", async () => {
          expect(await optionListPO.itemSelected.length).toEqual(0);
        });
      });

      describe("and then when user selects another competition option", () => {
        beforeAll(async () => {
          await optionListPO.itemText[1].waitForClickable();
          await optionListPO.itemText[1].click();
          await primaryButtonPO.element.waitForClickable();
          await primaryButtonPO.element.click();

          await browser.waitUntilNotDisplayed(filterCriteriaPO.element);
          await browser.waitUntil(async () => {
            const numCoupons = await couponListPO.filteredCoupons.length;
            return numCoupons === 1;
          });
        });

        it("[PRPI-5769] the pop-up should be closed", async () => {
          expect(await filterCriteriaPO.element.isDisplayed()).toBe(false);
        });

        it("[PRPI-5770] the events list should be updated", async () => {
          expect(await couponListPO.filteredCoupons.length).toBe(1);
        });

        it("[PRPI-5771] the competitions filter should display a counter with '1'", async () => {
          expect(await competitionsPebblePO.counter.getText()).toBe("1");
        });

        describe("when selecting another competition option", () => {
          beforeAll(async () => {
            await competitionsPebblePO.element.waitForClickable();
            await competitionsPebblePO.element.click();
            await browser.waitUntilDisplayed(filterCriteriaPO.element);
            await browser.waitUntilDisplayed(filterCriteriaPO.headerTitle, "Set Competitions");

            await optionListPO.itemText[0].waitForClickable();
            await optionListPO.itemText[0].click();
            await primaryButtonPO.element.waitForClickable();
            await primaryButtonPO.element.click();

            await browser.waitUntilNotDisplayed(filterCriteriaPO.element);
          });

          it("[PRPI-5772] the competitions filter counter should be updated to '2'", async () => {
            expect(await competitionsPebblePO.counter.getText()).toBe("2");
          });
        });
      });
    });
  });

  describe("when user clicks on reset button", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getFilteredCardResults(RESET_FILTERED_CARD_MOCK));

      await browser.waitUntilDisplayed(filterByPO.resetButton, "Reset button");
      await filterByPO.resetButton.scrollIntoView({ block: "center" });
      await browser.waitUntilInViewport(filterByPO.resetButton);

      await filterByPO.resetButton.waitForClickable();
      await filterByPO.resetButton.click();
      await browser.waitUntil(async () => {
        const numCoupons = await couponListPO.filteredCoupons.length;
        return numCoupons === 3;
      });
    });

    it("[PRPI-5773] should update event list with default values", async () => {
      expect(await couponListPO.filteredCoupons.length).toBe(3);
    });

    it("[PRPI-5774] the sort and time filters should now display the defaults: 'Rank' and 'Today'", async () => {
      expect(await filterByPO.filters[0].getText()).toEqual("Rank");
      expect(await filterByPO.filters[1].getText()).toEqual("Today");
    });

    it("[PRPI-5775] the competitions filter should no longer display the counter", async () => {
      expect(await competitionsPebblePO.counter.isDisplayed()).toBe(false);
    });
  });

  describe("when there is no default", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_NO_DEFAULTS_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_NO_DEFAULTS_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
      await browser.waitUntilEquals(await inlineSportsbookMarketPO.betButtons[0], "5");
    });

    it("[PRPI-5776] the filter should display 'Date Range'", async () => {
      expect(await filterByPO.filters[0].getText()).toBe("Date Range");
    });
  });
});
