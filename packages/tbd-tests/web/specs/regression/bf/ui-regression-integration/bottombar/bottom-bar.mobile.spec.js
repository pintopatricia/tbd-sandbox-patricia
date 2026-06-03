const {
  EventPagePO,
  GenericPagePO,
  MarketPagePO,
  MyBetsPagePO,
  SectionHeaderPO,
  ScrollableSwimlanePO,
  HeaderPO,
  CardPO,
  BottomBarPO,
  BottomBarTilePO,
  SearchResultsListPO,
  SearchBarPO,
  SearchResultItemPO,
} = require("../../../../../page-objects");
const {
  getEventLayout,
  getSearchResults,
  getGenericLayout,
  getMarketLayout,
  getSportsLayout,
  getMyBetsLayout,
  getBrowseLayout,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../helpers/mybets.util");

const eventPagePO = new EventPagePO();
const browsePO = new SectionHeaderPO();
const myBetsPO = new MyBetsPagePO();
const marketPagePO = new MarketPagePO();

const bottomBarPO = new BottomBarPO();
const firstBottomBarTilePO = new BottomBarTilePO(bottomBarPO.tiles[0]);
const secondBottomBarTilePO = new BottomBarTilePO(bottomBarPO.tiles[1]);
const thirdBottomBarTilePO = new BottomBarTilePO(bottomBarPO.tiles[2]);
const fourthBottomBarTilePO = new BottomBarTilePO(bottomBarPO.tiles[3]);
const fifthBottomBarTilePO = new BottomBarTilePO(bottomBarPO.tiles[4]);
const headerPO = new HeaderPO();
const searchBarPO = new SearchBarPO();
const searchResultsListPO = new SearchResultsListPO();
const firstSearchResult = new SearchResultItemPO(searchResultsListPO.results[0]);
const genericPagePO = new GenericPagePO();

const firstPrimarySwimlane = new ScrollableSwimlanePO(genericPagePO.scrollableSwimlanes[0]);

const marketCardPO = new CardPO(eventPagePO.markets[0]);

const mockService = new MockService();

const EVENT_ID = "29465861";
const SPORTSBOOK_MARKET_ID = "924.1";

const BOTTOM_BAR = {
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        viewUrn: "ppb:tbd:view:generic:home",
        viewUrl: "",
      },
    },
    {
      tileType: "BROWSE",
      viewLink: {
        viewUrn: "ppb:tbd:view:browse:sports",
        viewUrl: "browse/b-sports",
      },
    },
    {
      tileType: "MY_BETS",
      viewLink: {
        viewUrn: "ppb:tbd:view:myBets:open",
        viewUrl: "mybets/mybets-open",
      },
    },
    {
      tileType: "GAMING",
      viewLink: {
        viewUrn: "ppb:tbd:view:gaming:1",
        viewUrl: "casino/gm-1",
      },
    },
    {
      tileType: "PROMOTIONS",
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/promotions/offers",
        viewDisplayMode: "BLANK_WEBVIEW",
      },
    },
  ],
};

const BFF_MOCK = {
  url: `football/spanish-la-liga/real-madrid-v-atletico-madrid/e-${EVENT_ID}`,
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup|29359895",
        cardGroupTitle: "Match Odds Markets",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170259755;924.228826155",
                viewLinks: [
                  {
                    viewUrn: "ppb:tbd:view:market:1.170259755",
                    viewUrl: routes.getMarketViewUrl("1.170259755"),
                  },
                ],

                cardTitle: "Match Odds",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170259755",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: "ppb:event:29359895",
                        },
                      },
                    },
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
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170259755;924.228826155",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:overUnderMarketGroup|29359895",
        cardGroupTitle: "Over/Under Goals Markets",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826435",
                cardTitle: "Over/Under Total Goals 0.5",
                viewLinks: [
                  {
                    viewUrn: "ppb:tbd:view:market:924.228826435",
                    viewUrl:
                      "/football/belarussian-premier-league/belshina-bobruisk-v-gorodeya/over/under-total-goals-05/m-924228826435",
                  },
                ],

                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826435",
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826435/5851483",
                        },
                      ],

                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: "ppb:event:29359895",
                        },
                      },
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.228826435/5851483" }],
                  },
                },
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826406",
                cardTitle: "Over/Under Total Goals 1.5",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826406",
                      name: "Over/Under Total Goals 1.5",
                      marketType: "OVER_UNDER_15",
                      liveData: { inplay: false },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:12149617",
                          name: "Belarussian Premier League",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29359895",
                          name: "Belshina Bobruisk v Gorodeya",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826406/1221386",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.228826406/1221386" }],
                  },
                },
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170259767;924.228826520",
                cardTitle: "Over/Under 2.5 Goals",
                viewLinks: [
                  {
                    viewUrn: "ppb:tbd:view:market:1.170259767",
                    viewUrl:
                      "/football/belarussian-premier-league/belshina-bobruisk-v-gorodeya/over/under-25-goals/m-1170259767",
                  },
                  {
                    viewUrn: "ppb:tbd:view:market:924.228826520",
                    viewUrl:
                      "/football/belarussian-premier-league/belshina-bobruisk-v-gorodeya/over/under-25-goals/m-924228826520",
                  },
                ],

                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170259767",
                      liveData: {
                        totalMatched: 32.98716270943271,
                        exchangeMarketStatus: "OPEN",
                        inplay: false,
                      },
                      name: "Over/Under 2.5 Goals",
                      marketType: "OVER_UNDER_25",
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
                          urn: "ppb:competition:12149617",
                          name: "Belarussian Premier League",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29359895",
                          name: "Belshina Bobruisk v Gorodeya",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170259767/47972/0",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:excRunner:1.170259767/47972/0" }],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826520",
                      name: "Over/Under 2.5 Goals",
                      marketType: "OVER_UNDER_25",
                      liveData: { inplay: false },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:12149617",
                          name: "Belarussian Premier League",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29359895",
                          name: "Belshina Bobruisk v Gorodeya",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826520/47972",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.228826520/47972" }],
                  },
                },
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826531",
                cardTitle: "Over/Under Total Goals 3.5",
                viewLinks: [
                  {
                    viewUrn: "ppb:tbd:view:market:924.228826531",
                    viewUrl:
                      "/football/belarussian-premier-league/belshina-bobruisk-v-gorodeya/over/under-total-goals-35/m-924228826531",
                  },
                ],

                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826531",
                      name: "Over/Under Total Goals 3.5",
                      marketType: "OVER_UNDER_35",
                      liveData: { inplay: false },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:12149617",
                          name: "Belarussian Premier League",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29359895",
                          name: "Belshina Bobruisk v Gorodeya",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826531/1222345",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.228826531/1222345" }],
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
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826435",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826406",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170259767;924.228826520",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826531",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826415",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826309",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826353",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup|29359895",
        cardGroupTitle: "Correct Score",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826420",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826420",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826420/1063100",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.228826420/1063100" }],
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
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826420",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup|293598951",
        cardGroupTitle: "Correct Score 2",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826420",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826420",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: "ppb:event:293598951",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826420/1063100",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.228826420/1063100" }],
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
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826420",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "RegulatoryCard",
        urn: "ppb:tbd:card:regulatory",
        sections: [
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: "Responsible Gambling",
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup|29359895",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:overUnderMarketGroup|29359895",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup|29359895",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup|293598951",
      },
    },
    {
      node: {
        __typename: "RegulatoryCard",
        urn: "ppb:tbd:card:regulatory",
      },
    },
  ],

  bottomBar: BOTTOM_BAR,
};

const BFF_MY_BETS_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: "mybets/mybets-open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 0,
    },
    productType: {
      items: ["EXCHANGE", "SPORTSBOOK"],
      defaultIndex: 1,
    },
  },
  edges: [],
  pageInfo: {
    hasNextPage: "true",
    endCursor: "Mw==",
  },
  headerItems: HEADER_ITEMS_MOCK,
};

const BFF_BROWSE_MOCK = {
  urn: "ppb:tbd:view:browse:sports",
  url: "browse/b-sports",
  edges: [],
};

const BFF_MOCK_MARKET = {
  url: "football/spanish-la-liga/real-madrid-v-atletico-madrid/anytime-correct-score/m-1.170259755",
  urn: `ppb:tbd:view:market:1.170259755`,
  mainMarket: { urn: `ppb:excMarket:1.170259755` },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29682729",
        sportevent: {
          __typename: "SportsEvent",
          urn: "ppb:event:29682729",
        },
        fixture: {
          urn: "ppb:fixture:29682729",
          home: {
            name: "Chelsea",
            color: null,
            crest: null,
          },
          away: {
            name: "Tottenham",
            color: null,
            crest: null,
          },
          scheduledAt: "2020-02-22T12:30",
          duration: {
            period: "REGULAR",
            status: "PRE_MATCH",
          },
          penaltyShootout: null,
        },
      },
    },
  ],

  bottomBar: BOTTOM_BAR,
};

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: BOTTOM_BAR,
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
                  viewUrl: "football/brazilian-brasiliense-matches/gama-v-real-futebol-clube/e-29753184",
                },
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topInplayEventsInSport:1",
      },
    },
  ],
};

const BFF_HOME_VIEW_MOCK_UPDATE = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: BOTTOM_BAR,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:833222",
        cardGroupTitle: "Turkish 2 Lig",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753358",
                viewLink: {
                  viewUrn: "ppb:tbd:view:event:29753358",
                  viewUrl: "football/turkish-2-lig/hekimoglu-trabzon-v-kirklarelispor/e-29753358",
                },
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170184696",
                      liveData: {
                        totalMatched: 1156.3838597477095,
                        state: "OPEN",
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
                          urn: "ppb:competition:833222",
                          name: "Turkish 2 Lig",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753358",
                          name: "Hekimoglu Trabzon v Kirklarelispor",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170184696/21174821/0",
                          name: "Hekimoglu Trabzon",
                          selectionId: 21174821,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170184696/5340310/0",
                          name: "Kirklarelispor",
                          selectionId: 5340310,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170184696/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170184696/21174821/0" },
                      { runnerURN: "ppb:excRunner:1.170184696/5340310/0" },
                      { runnerURN: "ppb:excRunner:1.170184696/58805/0" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753358",
                  home: {
                    name: "Hekimoglu Trabzon",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Kirklarelispor",
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
                urn: "ppb:tbd:card:eventPrimaryMarket:29753358",
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
        urn: "ppb:tbd:card:group:topEventsByCompetition:833222",
      },
    },
  ],
};

const SEARCH_MOCK = [
  {
    __typename: "EventView",
    urn: `ppb:tbd:view:event:${EVENT_ID}`,
    url: `/football/spanish-la-liga/real-madrid-v-atletico-madrid/e-${EVENT_ID}`,
    sportevent: {
      name: "Real Madrid v Atletico Madrid",
      openDate: "2009-10-10T22:00",
      competition: {
        name: "Spanish La Liga",
      },
    },
  },
];

const BFF_DISPLAY_RUNNERS_EXC = {
  exchange: {
    market: {
      __typename: "ExchangeMarket",
      urn: "ppb:excMarket:1.170181973",
      liveData: {
        totalMatched: 21883.006497031536,
        state: "SUSPENDED",
        inplay: false,
      },
      name: "Match Odds Exchange",
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
};

const BFF_DISPLAY_RUNNERS_SBK = {
  sportsbook: {
    market: {
      __typename: "SportsbookMarket",
      eventId: EVENT_ID,
      urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
      name: "Match Odds Sportsbook",
      liveData: {
        inplay: false,
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
          runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190`,
          name: "Gama",
          selectionId: 55190,
          handicap: 0,
        },
        {
          __typename: "Runner",
          runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224`,
          name: "Real Futebol Clube",
          selectionId: 48224,
          handicap: 0,
        },
        {
          __typename: "Runner",
          runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805`,
          name: "The Draw",
          selectionId: 58805,
          handicap: 0,
        },
      ],
    },
    runners: [
      { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190` },
      { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224` },
      { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805` },
    ],
  },
};

const BFF_FIXTURE = {
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
};

const BOTTOM_BAR_WITH_PRODUCT_SWICTHER = {
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        viewUrn: "ppb:tbd:view:generic:home",
        viewUrl: routes.getHomeViewUrl(),
      },
    },
    {
      tileType: "BROWSE",
      viewLink: {
        viewUrn: "ppb:tbd:view:browse:sports",
        viewUrl: routes.getBrowseViewUrl(),
      },
    },
    {
      tileType: "MY_BETS",
      viewLink: {
        viewUrn: "ppb:tbd:view:myBets:open",
        viewUrl: routes.getMyBetsViewUrl("open"),
      },
    },
    {
      tileType: "GAMING",
      viewLink: {
        viewUrn: "ppb:tbd:view:gaming:1",
        viewUrl: routes.getGamingViewUrl("1"),
      },
    },
  ],

  hasProductSwitcher: true,
};

const BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_EXC = {
  urn: "ppb:tbd:view:sport:1",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
        cardGroupTitle: null,
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
                title: "Match Odds Sportsbook",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: BFF_DISPLAY_RUNNERS_SBK,
                fixture: BFF_FIXTURE,
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

  bottomBar: BOTTOM_BAR_WITH_PRODUCT_SWICTHER,
  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
      },
    },
  ],
};

const BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_SBK = {
  urn: "ppb:tbd:view:sport:1",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
        cardGroupTitle: null,
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
                title: "Match Odds Exchange",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: BFF_DISPLAY_RUNNERS_EXC,
                fixture: BFF_FIXTURE,
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

  bottomBar: BOTTOM_BAR_WITH_PRODUCT_SWICTHER,
  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
      },
    },
  ],
};

const BFF_BROWSE_PRODUCT_WITH_PRODUCT_SWITCHER_MOCK = {
  urn: "ppb:tbd:view:browse:sports",
  url: "browse/b-sports",
  bottomBar: BOTTOM_BAR_WITH_PRODUCT_SWICTHER,
  edges: [],
};

describe("Bottom Bar", () => {
  describe("BFF is retrieving 5 tiles for Bottom Bar ordered as home, browse, my bets, casino, promotions", () => {
    // "Home", with viewURL: "/"
    // "Browse", with viewURL: "/browse/b-sports"
    // "My Bets", with viewURL: "/mybets/mybets-open"
    // "Casino", with viewURL: "casino/gm-1"
    // "Promotions, with viewURL: "https://www.betfair.com/promotions/offers"`, () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, {
          PRODUCT_SWITCHER: { isActive: true },
        }),
      );
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(eventPagePO.scrollableSwimlanes[0]);
    });

    it("[PRPI-8440] Then I should see the bottom bar is visible on the page and has 5 tiles", async () => {
      await browser.waitUntilDisplayed(bottomBarPO.element);
      expect(await bottomBarPO.element.isDisplayed()).toBe(true);
      expect(await bottomBarPO.tiles.length).toBe(5);
    });

    it("[PRPI-8441] And I should see the first tile with Home title", async () => {
      expect(await firstBottomBarTilePO.title.getText()).toBe("Home");
    });

    it("[PRPI-8442] And I should see the second tile with Browse title", async () => {
      expect(await secondBottomBarTilePO.title.getText()).toBe("Browse");
    });

    it("[PRPI-8443] And I should see the third tile with My Bets title", async () => {
      expect(await thirdBottomBarTilePO.title.getText()).toBe("My Bets");
    });

    it("[PRPI-8444] And I should see the fourth tile with Casino title", async () => {
      expect(await fourthBottomBarTilePO.title.getText()).toBe("Casino");
    });

    it("[PRPI-8445] And I should see the fitth tile with Promotions title and the proper href", async () => {
      expect(await fifthBottomBarTilePO.title.getText()).toBe("Promotions");
      expect(await fifthBottomBarTilePO.link.getAttribute("href")).toBe("https://www.betfair.com/promotions/offers");
    });

    describe("When I tap the My Bets tile", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK));
        await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
        await thirdBottomBarTilePO.element.click();
        await browser.waitUntilDisplayed(myBetsPO.element);
      });

      it("[PRPI-8446] Then I should see that I am redirected to the My Bets page", async () => {
        expect(await browser.getUrl()).toContain("mybets/mybets-open");
      });

      it("[PRPI-8447] And I should see the My Bets tile with a selected state", async () => {
        expect(await bottomBarPO.activeTileTitle.getText()).toBe("My Bets");
      });
    });

    describe("When I tap the Home tile", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
        await firstBottomBarTilePO.element.click();
        await browser.waitUntilDisplayed(await genericPagePO.scrollableSwimlanes[0]);
      });

      it("[PRPI-8448] Then I should see that I am redirected to the Home page", async () => {
        const url = await browser.getUrl();

        expect(url.endsWith("betting/")).toBe(true);
      });

      it("[PRPI-8449] And I should see that 1st swimlane has 'Today' as title", async () => {
        expect(await firstPrimarySwimlane.title.getText()).toBe("Today");
      });

      it("[PRPI-8450] And I should see the Home tile with a selected state", async () => {
        expect(await bottomBarPO.activeTileTitle.getText()).toBe("Home");
      });

      describe("When I scroll down and tap again the 'Home' tile", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK_UPDATE));
          await firstBottomBarTilePO.element.click();
          await browser.waitUntilDisplayed(await firstPrimarySwimlane.element);
        });

        it("[PRPI-8451] Then I should see the 'Home' tile with a selected state", async () => {
          expect(await bottomBarPO.activeTileTitle.getText()).toBe("Home");
        });
      });
    });

    describe("When I tap the Browse tile", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_MOCK));
        await mockService.mockHttpRequest(getSearchResults({ query: "real", results: SEARCH_MOCK }));
        await secondBottomBarTilePO.element.click();
        await browser.waitUntilDisplayed(browsePO.element);
      });

      it("[PRPI-8452] Then I should see that I am redirected to the Browse page", async () => {
        expect(await browser.getUrl()).toContain("browse/b-sports");
      });

      it("[PRPI-8453] And I should see the Browse tile with a selected state", async () => {
        expect(await bottomBarPO.activeTileTitle.getText()).toBe("Browse");
      });

      describe("When I navigate to a Football event page from the Browse Page", () => {
        beforeAll(async () => {
          await browser.waitUntilDisplayed(searchBarPO.element);
          await searchBarPO.input.setValue("real");
          await browser.waitUntilDisplayed(searchResultsListPO.resultsList);
          await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
          await browser.waitUntilDisplayed(firstSearchResult.element);
          await firstSearchResult.element.click();
          await browser.waitUntilDisplayed(eventPagePO.scrollableSwimlanes[0]);
        });

        it("[PRPI-8454] Then I should see I am redirected to an Event View", async () => {
          expect(await browser.getUrl()).toContain("football/spanish-la-liga/real-madrid-v-atletico-madrid/e-29465861");
        });

        it("[PRPI-8455] And no tile should be selected", async () => {
          expect(await bottomBarPO.activeTileTitle.element).toBe(undefined);
        });

        describe("When then I navigate to a market page from the previous event page", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK_MARKET));
            await marketCardPO.title.click();
            await marketPagePO.footballFixtureCard.isDisplayed();
          });

          it("[PRPI-8456] Then I should see I am redirected to a Market View", async () => {
            expect(await browser.getUrl()).toContain("m-1.170259755");
          });

          it("[PRPI-8456] And no tile should be selected", async () => {
            expect(await bottomBarPO.activeTileTitle.element).toBe(undefined);
          });
        });

        describe("When I tap the browser back button", () => {
          beforeAll(async () => {
            await browser.back();
            await browser.waitUntilDisplayed(marketCardPO.element);
          });

          it("[PRPI-8457] Then I should see I am redirected to the Event View", async () => {
            expect(await browser.getUrl()).toContain(
              "football/spanish-la-liga/real-madrid-v-atletico-madrid/e-29465861",
            );
          });

          it("[PRPI-8458] And no tile should be selected", async () => {
            expect(await bottomBarPO.activeTileTitle.element).toBe(undefined);
          });
        });

        describe("When I tap the browser back button again", () => {
          beforeAll(async () => {
            await browser.back();
            await browser.waitUntilDisplayed(searchBarPO.element);
          });

          it("[PRPI-8459] Then I should see I am redirected to the Search Page", async () => {
            expect(await browser.getUrl()).toContain("browse/b-sports");
          });

          it("[PRPI-8459] And I should see the 'Browse' tile with a selected state", async () => {
            expect(await bottomBarPO.activeTileTitle.getText()).toBe("Browse");
          });

          it("[PRPI-8459] And I should see that the 'Cancel' and 'X' button are visible", async () => {
            expect(await searchBarPO.cancelButton.isDisplayed()).toBe(true);
            expect(await searchBarPO.cleanButton.isDisplayed()).toBe(true);
          });

          it("[PRPI-8459] And I should see that the search input field is populated with 'real'", async () => {
            expect(await searchBarPO.input.getAttribute("value")).toBe("real");
          });

          it("[PRPI-8459] And I should see the results for 'real' are shown", async () => {
            expect(await searchResultsListPO.element.isDisplayedInViewport()).toBe(true);
          });
        });

        describe("When I tap the browser back button again", () => {
          beforeAll(async () => {
            await browser.back();
            await browser.waitUntilDisplayed(await genericPagePO.scrollableSwimlanes[0]);
          });

          it("[PRPI-8459] Then I should see I am redirected to the Home Page", async () => {
            const url = await browser.getUrl();

            expect(url.endsWith("betting/")).toBe(true);
          });

          it("[PRPI-8459] And I should see the 'Home' tile with a selected state", async () => {
            expect(await bottomBarPO.activeTileTitle.getText()).toBe("Home");
          });
        });

        describe("When I tap the browser forward button", () => {
          beforeAll(async () => {
            await browser.forward();
            await browser.waitUntilDisplayed(searchBarPO.element);
          });

          it("[PRPI-8460] Then I should see I am redirected to the Search Page", async () => {
            expect(await browser.getUrl()).toContain("browse/b-sports");
          });

          it("[PRPI-8460] And I should see the 'Browse' tile with a selected state", async () => {
            expect(await bottomBarPO.activeTileTitle.getText()).toBe("Browse");
          });

          it("[PRPI-8460] And I should see that the 'Cancel' and 'X' button are visible", async () => {
            expect(await searchBarPO.cancelButton.isDisplayed()).toBe(true);
            expect(await searchBarPO.cleanButton.isDisplayed()).toBe(true);
          });

          it("[PRPI-8460] And I should see that the search input field is populated with 'real'", async () => {
            expect(await searchBarPO.input.getAttribute("value")).toBe("real");
          });

          it("[PRPI-8460] And I should see the results for 'real' are shown", async () => {
            expect(await searchResultsListPO.element.isDisplayedInViewport()).toBe(true);
          });
        });
      });
    });

    describe("Tap the browse input field and search for 'real', scroll to footer, see results, tap browse again", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await mockService.mockHttpRequest(getSearchResults({ query: "real", results: SEARCH_MOCK }));
        await secondBottomBarTilePO.element.click();
        await searchBarPO.input.setValue("real");
        await browser.waitUntilDisplayed(browsePO.element);
        await browser.waitUntilDisplayed(searchResultsListPO.resultsList);
        await secondBottomBarTilePO.element.click();
        await browser.waitUntilDisplayed(browsePO.element);
      });

      it("[PRPI-8461] Then I should see the 'Browse' tile with a selected state", async () => {
        expect(await bottomBarPO.activeTileTitle.getText()).toBe("Browse");
      });

      it("[PRPI-8462] And I should see that the 'Cancel' and 'X' button are no longer visible", async () => {
        expect(await searchBarPO.cancelButton.isDisplayed()).toBe(false);
        expect(await searchBarPO.cleanButton.isDisplayed()).toBe(false);
      });

      it("[PRPI-8463] And I should see that the input field is populated with the default text: 'Search Teams or Events'", async () => {
        expect(await searchBarPO.input.getAttribute("placeholder")).toBe("Search Teams or Events");
      });

      it("[PRPI-8464] And I should see that the results are no longer shown", async () => {
        expect(await searchResultsListPO.element.isDisplayed()).toBe(false);
      });
    });

    describe("When I tap the Betfair logo", () => {
      beforeAll(async () => {
        await headerPO.logoContainer.click();
        const url = await browser.getUrl();
        await browser.waitUntil(() => url.endsWith("betting/"));
      });

      it("[PRPI-8465] Then I should see that I am redirected to the Home page", async () => {
        const url = await browser.getUrl();

        expect(url.endsWith("betting/")).toBe(true);
      });

      it("[PRPI-8466] And I should see the 'Home' tile with a selected state", async () => {
        expect(await bottomBarPO.activeTileTitle.getText()).toBe("Home");
      });
    });
  });

  describe("when PRODUCT_SWITCHER throttle is on", () => {
    describe("and the user is a single usage Sportsbook user on a Sports Page", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_EXC.urn, {
            products: ["sportsbook", "games"],
            PRODUCT_SWITCHER: { isActive: true },
          }),
        );
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_EXC));
        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await browser.waitUntilEquals(fifthBottomBarTilePO.title, "Exchange");
      });

      it("[PRPI-6046] The bottom bar should display 5 tiles", async () => {
        expect(await bottomBarPO.element.isDisplayed()).toBe(true);
        expect(await bottomBarPO.tiles.length).toBe(5);
      });

      it("[PRPI-6047] The last tile should display an icon and the title 'Exchange'", async () => {
        expect(await bottomBarPO.productSwitcherIcon.isDisplayed()).toBe(true);
        expect(await fifthBottomBarTilePO.title.getText()).toBe("Exchange");
      });

      describe("And when the Sportsbook single usage user taps on the Product Switcher", () => {
        beforeAll(async () => {
          await bottomBarPO.productSwitcherTile.click();
        });

        it("[PRPI-6048] The user is redirected to the exchange route", async () => {
          expect(await browser.getUrl()).toContain("/exchange/");
        });
      });
    });

    describe("and the user is a single usage Exchange user", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_SBK.urn, {
            products: ["exchange", "games"],
            PRODUCT_SWITCHER: { isActive: true },
          }),
        );
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_SBK));
        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await browser.waitUntilEquals(fifthBottomBarTilePO.title, "Sportsbook");
      });

      it("[PRPI-6049] The bottom bar should display 5 tiles", async () => {
        expect(await bottomBarPO.element.isDisplayed()).toBe(true);
        expect(await bottomBarPO.tiles.length).toBe(5);
      });

      it("[PRPI-6050] The last tile should display an icon and the title 'Sportsbook'", async () => {
        expect(await bottomBarPO.productSwitcherIcon.isDisplayed()).toBe(true);
        expect(await fifthBottomBarTilePO.title.getText()).toBe("Sportsbook");
      });

      describe("And when the Exchange single usage user taps on the Product Switcher", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            await getIndexHTML(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_EXC.urn, {
              products: ["sportsbook", "games"],
              PRODUCT_SWITCHER: { isActive: true },
            }),
          );
          await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_EXC));
          await bottomBarPO.productSwitcherTile.click();
          await browser.waitUntilEquals(fifthBottomBarTilePO.title, "Exchange");
        });

        it("[PRPI-6051] The last tile should display an icon and the title 'Exchange'", async () => {
          expect(await bottomBarPO.productSwitcherIcon.isDisplayed()).toBe(true);
          expect(await fifthBottomBarTilePO.title.getText()).toBe("Exchange");
        });

        describe("And when the Exchange single usage user taps on the Product Switcher again", () => {
          beforeAll(async () => {
            await bottomBarPO.productSwitcherTile.click();
          });

          it("[PRPI-6052] The user is redirected to the exchange route", async () => {
            expect(await browser.getUrl()).toContain("/exchange/");
          });
        });
      });
    });

    describe("and the user is a single usage Sportsbook that navigates to the browse page", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_SBK.urn, {
            products: ["exchange", "games"],
            PRODUCT_SWITCHER: { isActive: true },
          }),
        );
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_SBK));
        await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_PRODUCT_WITH_PRODUCT_SWITCHER_MOCK));
        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await browser.waitUntilDisplayed(bottomBarPO.browseTile);
        await bottomBarPO.browseTile.click();
        await browser.waitUntilDisplayed(browsePO.element);
        await searchBarPO.setValue("Porto");
        await browser.waitUntilEquals(searchBarPO.input, "Porto");
      });

      it("[PRPI-6053] the input field should have 'Porto'", async () => {
        expect(await searchBarPO.input.getValue()).toBe("Porto");
      });

      it("[PRPI-6054] the product switcher should display 'Sportsbook'", async () => {
        expect(await bottomBarPO.productSwitcherTitle.getText()).toBe("Sportsbook");
      });

      describe("and user clicks on the product switcher", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            await getIndexHTML(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_EXC.urn, {
              products: ["sportsbook", "games"],
              PRODUCT_SWITCHER: { isActive: true },
            }),
          );
          await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_EXC));
          await bottomBarPO.productSwitcherTile.click();
          await browser.waitUntilEquals(fifthBottomBarTilePO.title, "Exchange");
        });

        it("[PRPI-6055] the product switcher should display 'Exchange'", async () => {
          expect(await fifthBottomBarTilePO.title.getText()).toBe("Exchange");
        });

        describe("and the user navigates back to Browse", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_PRODUCT_WITH_PRODUCT_SWITCHER_MOCK));
            await secondBottomBarTilePO.element.click();
            await browser.waitUntilDisplayed(browsePO.element);
          });

          it("[PRPI-6055] the search input should be empty", async () => {
            expect(await searchBarPO.input.getValue()).toBe("");
          });
        });
      });
    });

    describe("and the user is a single usage Sportsbook user on a Sports Page with exchange experience active", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_EXC.urn, {
            products: ["sportsbook", "games"],
            exchangeEnabled: true,
            PRODUCT_SWITCHER: { isActive: true },
          }),
        );
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_EXC));
        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await browser.waitUntilEquals(fifthBottomBarTilePO.title, "Exchange");
      });

      it("[PRPI-6056] The bottom bar should display 5 tiles", async () => {
        expect(await bottomBarPO.element.isDisplayed()).toBe(true);
        expect(await bottomBarPO.tiles.length).toBe(5);
      });

      it("[PRPI-6057] The last tile should display an icon and the title 'Exchange'", async () => {
        expect(await bottomBarPO.productSwitcherIcon.isDisplayed()).toBe(true);
        expect(await fifthBottomBarTilePO.title.getText()).toBe("Exchange");
      });

      describe("And when the Sportsbook single usage user taps on the Product Switcher", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            await getIndexHTML(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_SBK.urn, {
              products: ["exchange", "games"],
              PRODUCT_SWITCHER: { isActive: true },
            }),
          );
          await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_WITH_PRODUCT_SWITCHER_TO_SBK));
          await bottomBarPO.productSwitcherTile.click();
          await browser.waitUntilEquals(fifthBottomBarTilePO.title, "Sportsbook");
        });

        it("[PRPI-6058] The last tile should display an icon and the title 'Sportsbook'", async () => {
          expect(await bottomBarPO.productSwitcherIcon.isDisplayed()).toBe(true);
          expect(await fifthBottomBarTilePO.title.getText()).toBe("Sportsbook");
        });
      });
    });
  });
});
