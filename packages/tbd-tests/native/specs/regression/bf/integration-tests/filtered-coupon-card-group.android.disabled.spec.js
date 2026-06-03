const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const CouponSO = require("@ppb/tbd-shared/components/Coupon/Coupon.so");
const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const {
  getGenericLayout,
  getFilteredCardResults,
  getHomeLayoutWithViewLink,
  getQueryCardResponse,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const CouponListSO = require("@ppb/tbd-shared/components/CouponList/CouponList.so");
const CompetitionFilterDrawerSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/CompetitionFilterDrawer/CompetitionFilterDrawer.native.so");

const MockService = require("../../../../mock-essentials/mocking-service");
const { swipeLeftElement, swipeRightElement } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const {
  GenericScreenSO,
  FilterBySO,
  FootballScoreboardSO,
  RadioListSO,
  OptionListSO,
  PrimaryButtonSO,
  AlertSO,
  ActionLinkSO,
  TeamSO,
  FilterCriteriaSO,
  PebbleSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const filteredCouponCardGroupSO = new FilteredCouponCardGroupSO();
const firstCoupon = new CouponSO(filteredCouponCardGroupSO.coupons[0]);
const filterBySO = new FilterBySO(filteredCouponCardGroupSO.element);
const filterByActionLinkSO = new ActionLinkSO(filterBySO.resetButton);
const couponListSO = new CouponListSO();
const alertSO = new AlertSO();
const filterCriteriaSO = new FilterCriteriaSO();
const competitionsFilteredSO = new CompetitionFilterDrawerSO(filterCriteriaSO.headerContent);
const competitionsFilterActionLinkSO = new ActionLinkSO(competitionsFilteredSO.resetButton);
const radioListSO = new RadioListSO();
const optionListSO = new OptionListSO();
const primaryButtonSO = new PrimaryButtonSO();
const footballScoreboardSO = new FootballScoreboardSO(firstCoupon.element);
const homeTeamSO = new TeamSO(footballScoreboardSO.homeTeam);
const pebbleSO = new PebbleSO();
const sortPebbleSO = new PebbleSO(filterBySO.filters[0]);
const dateRangePebbleSO = new PebbleSO(filterBySO.filters[1]);
const competitionsPebbleSO = new PebbleSO(filterBySO.filters[2]);

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
      defaultOptions: null,
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
  viewAll: {
    label: "View More",
    icon: null,
    viewLink: {
      viewUrn: "ppb:tbd:view:sport:1",
      viewUrl: "football/s-1",
    },
  },
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:allmatchesraces:1",
  url: "view/amc-1",
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
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:99",
                  name: "Portuguese Primeira Liga",
                  competitionId: 99,
                },
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
                startedAt: null,
                score: null,
                duration: {
                  period: "REGULAR",
                  status: "INPLAY_FIRST_HALF",
                  clock: null,
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
      viewAll: {
        icon: null,
        label: "View All",
        viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
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
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:99",
                  name: "Portuguese Primeira Liga",
                  competitionId: 99,
                },
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
                startedAt: null,
                score: null,
                duration: {
                  period: "REGULAR",
                  status: "INPLAY_FIRST_HALF",
                  clock: null,
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

  viewAll: {
    icon: null,
    label: "View All",
    viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
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

const ALL_COMPETITIONS_MOCK = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
  filteredCouponTitle: "All Matches",
  filterOptions: {
    __typename: "FilteredCouponOptions",
    competitionsFilter: {
      urn: "ppb:tbd:apollocriessilencer",
      allCompetitions: [
        {
          country: {
            urn: "ppb:tbd:country:international",
            code: "International",
            flag: null,
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
            urn: "ppb:tbd:country:PRT",
            code: "PRT",
            flag: null,
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

describe("FilteredCouponCardGroup", () => {
  describe("When the user is on a Generic View with all matches", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getQueryCardResponse("AllCompetitionsFilter", ALL_COMPETITIONS_MOCK));
      const url = "view/amc-1";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(genericScreenSO.element);
    });

    it("[PRPI-2913] the events should be displayed in coupons", async () => {
      expect(await couponListSO.coupons.length).toEqual(2);
    });

    it("[PRPI-2914] the filters and reset button should be displayed", async () => {
      expect(await sortPebbleSO.title.getText()).toBe("Rank");
      expect(await dateRangePebbleSO.title.getText()).toBe("Today");
      expect(await competitionsPebbleSO.title.getText()).toBe("Competitions");
      expect(await filterByActionLinkSO.text.getText()).toBe("Reset");
    });

    it("[PRPI-2915] the notification info should not be displayed", async () => {
      expect(await alertSO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-2916] the competitions filter should not display the counter", async () => {
      expect(await competitionsPebbleSO.counter.isDisplayed()).toBe(false);
    });

    describe("When the user clicks on sort filter icon", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(sortPebbleSO.element);
        await sortPebbleSO.element.click(); // ou .element, check

        await browser.waitUntilDisplayed(filterCriteriaSO.element);
      });

      it("[PRPI-2917] The pop-up should be displayed", async () => {
        expect(await filterCriteriaSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-2918] The title 'Sort Matches by' should be displayed.", async () => {
        expect(await filterCriteriaSO.headerTitle.getText()).toEqual("Sort Matches by");
      });

      it("[PRPI-2919] Should have SORT Filters", async () => {
        expect(await radioListSO.item.length).toEqual(2);
        expect(await radioListSO.itemText[0].getText()).toEqual("Rank");
        expect(await radioListSO.itemText[1].getText()).toEqual("Time");
      });

      describe("and when the user selects the 'Time' option", () => {
        beforeAll(async () => {
          await radioListSO.item[1].click();
          await browser.waitUntilNotDisplayed(filterCriteriaSO.element);
        });

        it("[PRPI-2920] the sort filter dropdown label should now display 'Time'", async () => {
          expect(await sortPebbleSO.title.getText()).toEqual("Time");
        });
      });

      describe("and when the user clicks on the sort filter icon again", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(pebbleSO.element);
          await pebbleSO.element.click();
          await browser.waitUntilDisplayed(filterCriteriaSO.element);
        });

        describe("when the user clicks on the close option", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(filterCriteriaSO.closeButton);
            await filterCriteriaSO.closeButton.click();

            await browser.waitUntilNotDisplayed(filterCriteriaSO.element);
          });

          it("[PRPI-2921] the pop-up should be closed", async () => {
            expect(await filterCriteriaSO.element.isDisplayed()).toBe(false);
          });
        });
      });
    });

    describe("When the user clicks on date range filter button title", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(dateRangePebbleSO.element);
        await dateRangePebbleSO.element.click();

        await browser.waitUntilDisplayed(filterCriteriaSO.element);
      });

      it("[PRPI-2922] The pop-up should be displayed", async () => {
        expect(await filterCriteriaSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-2923] The title 'Date Range' should be displayed.", async () => {
        expect(await filterCriteriaSO.headerTitle.getText()).toEqual("Set Date Range");
      });

      it("[PRPI-2924] Should have Date Range Filters", async () => {
        expect(await radioListSO.item.length).toEqual(2);
        expect(await radioListSO.itemText[0].getText()).toEqual("Today");
        expect(await radioListSO.itemText[1].getText()).toEqual("In-Play Now");
      });

      describe("when user selects the 'In-Play Now' option", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getFilteredCardResults(INPLAY_FILTERED_CARD_MOCK));

          await browser.waitUntilClickableNative(radioListSO.item[1]);
          await radioListSO.item[1].click();

          await browser.waitUntilNotDisplayed(filterCriteriaSO.element);
          await browser.waitUntilEquals(homeTeamSO.name, "Rio Ave");
        });

        it("[PRPI-2925] the pop-up should be closed", async () => {
          expect(await filterCriteriaSO.element.isDisplayed()).toBe(false);
        });

        it("[PRPI-2926] the time filter dropdown now displays 'In-Play Now'", async () => {
          expect(await dateRangePebbleSO.title.getText()).toEqual("In-Play Now");
        });

        it("[PRPI-2927] the events list should be updated", async () => {
          expect(await homeTeamSO.name.getText()).toEqual("Rio Ave");
        });
      });
    });

    describe("When the user clicks on competition filter", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(competitionsPebbleSO.element);
        await competitionsPebbleSO.element.click();

        await browser.waitUntilDisplayed(filterCriteriaSO.element);
      });

      it("[PRPI-2928] The pop-up should be displayed", async () => {
        expect(await filterCriteriaSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-2929] The title 'Set Competitions' should be displayed.", async () => {
        expect(await filterCriteriaSO.headerTitle.getText()).toEqual("Set Competitions");
      });

      it("[PRPI-2930] Should have competition options", async () => {
        expect(await optionListSO.optionsText.length).toEqual(2);
        expect(await optionListSO.optionsText[0].getText()).toEqual("UEFA Champions League");
        expect(await optionListSO.optionsText[1].getText()).toEqual("Portuguese Primeira Liga");
      });

      describe("When user selects a competition option", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getFilteredCardResults(COMPETITION_FILTERED_CARD_MOCK));

          await browser.waitUntilClickableNative(optionListSO.options[1]);
          await optionListSO.options[1].click();
          await browser.waitUntilClickableNative(primaryButtonSO.element);
          await browser.waitUntilClickableNative(competitionsFilterActionLinkSO.element);
        });

        it("[PRPI-2931] Should present a reset button", async () => {
          expect(await competitionsFilterActionLinkSO.element.isDisplayed()).toBe(true);
        });

        describe("when user apply the competition filter", () => {
          beforeAll(async () => {
            await primaryButtonSO.element.click();

            await browser.waitUntilNotDisplayed(filterCriteriaSO.element);
            await browser.waitUntilEquals(homeTeamSO.name, "Rio Ave");
          });

          it("[PRPI-2932] the pop-up should be closed", async () => {
            expect(await filterCriteriaSO.element.isDisplayed()).toEqual(false);
          });

          it("[PRPI-2933] the events list should be updated", async () => {
            expect(await homeTeamSO.name.getText()).toEqual("Rio Ave");
          });

          it("[PRPI-2934] the competitions filter should display a counter with '1'", async () => {
            expect(await competitionsPebbleSO.counter.getText()).toBe("1");
          });
        });

        describe("when selecting another competition option", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(competitionsPebbleSO.element);
            await competitionsPebbleSO.element.click();

            await browser.waitUntilDisplayed(filterCriteriaSO.element);
            await browser.waitUntilDisplayed(filterCriteriaSO.headerTitle, "Set Competitions");

            await browser.waitUntilClickableNative(optionListSO.options[0]);
            await optionListSO.options[0].click();
            await browser.waitUntilClickableNative(primaryButtonSO.element);
            await primaryButtonSO.element.click();

            await browser.waitUntilNotDisplayed(filterCriteriaSO.element);
          });

          it("[PRPI-2935] the competitions filter counter should be updated to '2'", async () => {
            expect(await competitionsPebbleSO.counter.getText()).toBe("2");
          });

          describe("When user click on reset button", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(competitionsPebbleSO.element);
              await competitionsPebbleSO.element.click();

              await browser.waitUntilDisplayed(filterCriteriaSO.element);

              await browser.waitUntilDisplayed(competitionsFilterActionLinkSO.element);
              await competitionsFilterActionLinkSO.element.click();
              await browser.waitUntilNotDisplayed(competitionsFilterActionLinkSO.element);
            });

            it("[PRPI-2936] should not appear the reset button", async () => {
              expect(await competitionsFilterActionLinkSO.element.isDisplayed()).toBe(false);
            });

            it("[PRPI-2936] there should no longer be any selected competitions", async () => {
              expect(await optionListSO.selectedOptions.length).toEqual(0);
            });

            afterAll(async () => {
              await filterCriteriaSO.closeButton.click();
              await browser.waitUntilEquals(homeTeamSO.name, "Rio Ave");
            });
          });
        });
      });
    });

    describe("When the user clicks on the reset button", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getFilteredCardResults(RESET_FILTERED_CARD_MOCK));
        await swipeLeftElement(sortPebbleSO.element);
        await browser.waitUntilClickableNative(filterByActionLinkSO.element);
        await filterByActionLinkSO.element.click();
        await browser.waitUntilEquals(homeTeamSO.name, "Chelsea");
        await swipeRightElement(filterByActionLinkSO.element);
      });

      it("[PRPI-2937] should update event list with default values", async () => {
        expect(await homeTeamSO.name.getText()).toEqual("Chelsea");
      });

      it("[PRPI-2938] the sort and time filters should now display the defaults: 'Rank' and 'Today'", async () => {
        expect(await sortPebbleSO.title.getText()).toEqual("Rank");
        expect(await dateRangePebbleSO.title.getText()).toEqual("Today");
      });

      it("[PRPI-2939] the competitions filter should no longer display the counter", async () => {
        expect(await competitionsPebbleSO.counter.isDisplayed()).toBe(false);
      });
    });
  });
});
