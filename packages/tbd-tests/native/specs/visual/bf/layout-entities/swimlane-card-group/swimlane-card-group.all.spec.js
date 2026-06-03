const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const PopularBetBuilderCardSO = require("@ppb/tbd-shared/components/PopularBetBuilderCard/PopularBetBuilderCard.so");
const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");
const {
  PromotionCardSO,
  HighlightedSelectionCardSO,
  CompetitionViewLinkCardSO,
  GenericViewSO,
  ScrollableSwimlaneSO,
  CardSO,
} = require("../../../../../screen-objects");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { swipeDownElementFullscreen, swipeLeftElement } = require("../../../../../helpers/gestures");

const promotionCardSO = new PromotionCardSO();
const highlightedSelectionCardSO = new HighlightedSelectionCardSO();
const popularBetBuilderCardSO = new PopularBetBuilderCardSO();
const raceMarketCardSO = new RaceMarketCardSO();
const competitionViewLinkCardSO = new CompetitionViewLinkCardSO();

const genericViewSO = new GenericViewSO();
const firstScrollableSwimlaneSO = new ScrollableSwimlaneSO(genericViewSO.items[0]);
const lastSwimlaneElementSO = new CardSO(firstScrollableSwimlaneSO.cards[1]);

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const getCardGroupWithOneCard = (cardGroupMock) => ({
  ...cardGroupMock,
  urn: cardGroupMock.urn.replace("1", "2"),
  full: { edges: [cardGroupMock.full.edges[0]] },
  partials: { edges: [cardGroupMock.partials.edges[0]] },
});

const buildBFFMock = (cardGroup) => {
  const singleCardGroup = getCardGroupWithOneCard(cardGroup);

  return {
    __typename: "GenericView",
    urn: "ppb:tbd:view:generic:home",
    url: "",
    edges: [
      {
        node: cardGroup,
      },
      {
        node: singleCardGroup,
      },
    ],

    partialItems: [
      {
        node: {
          __typename: cardGroup.__typename,
          urn: cardGroup.urn,
        },
      },
      {
        node: {
          __typename: singleCardGroup.__typename,
          urn: singleCardGroup.urn,
        },
      },
    ],
  };
};

const PROMOTIONS_CARD_GROUP = {
  __typename: "SwimlaneCardGroup",
  urn: "ppb:tbd:cardgroup:swimlane:Promotions1",
  full: {
    edges: [
      {
        node: {
          __typename: "PromotionCard",
          urn: "ppb:tbd:card:promotion:PromotionsCard1",
          promotionContentType: "GENERIC",
          promotionName: "GET £2 FREE BET When you bet £10 worth of Accas or Bet Builders on Football",
          backgroundImage: [
            {
              url: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
              width: 456,
              height: 123,
              tag: "banner",
            },
          ],

          isImsPromo: false,
          label: "Opt In",
          viewLink: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl: "https://www.betfair.com/betting",
            viewDisplayMode: "BLANK_INAPP",
          },
          endDate: "2023-02-11T23:59:55.405Z",
          optInState: "NOT_OPTED_IN",
          tags: ["BetXGetY"],
          hasBetfairBoost: false,
        },
      },
      {
        node: {
          __typename: "PromotionCard",
          urn: "ppb:tbd:card:promotion:PromotionsCard2",
          promotionContentType: "GENERIC",
          promotionName: "WE'RE PAYING 4 PLACES INSTEAD OF 3",
          promotionTitle: "15:43 Ffos Las",
          backgroundImage: [
            {
              url: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
              width: 456,
              height: 123,
              tag: "banner",
            },
          ],

          isImsPromo: false,
          label: "Bet Here",
          viewLink: {
            viewUrn: "ppb:tbd:view:race:7|32089329.1543",
            viewUrl: "https://www.betfair.com/betting",
          },
          endDate: "2023-02-09T15:43:00.000Z",
          optInState: "NOT_OPTED_IN",
          tags: ["bfrb", "extra-places"],
          hasBetfairBoost: false,
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "PromotionCard",
          urn: "ppb:tbd:card:promotion:PromotionsCard1",
        },
      },
      {
        node: {
          __typename: "PromotionCard",
          urn: "ppb:tbd:card:promotion:PromotionsCard2",
        },
      },
    ],
  },
};

const HIGHLIGHTED_SELECTION_CARD_GROUP = {
  __typename: "SwimlaneCardGroup",
  urn: "ppb:tbd:cardgroup:swimlane:OddsBoost1",
  cardGroupTitle: "Football OddsBoosts",
  viewAll: {
    label: "View More",
    viewLink: {
      viewUrn: "ppb:tbd:view:generic:OddsBoost1",
      viewUrl: "view/d-X9D5ERIAACkAw11J%2Fcv%2Fhome",
    },
  },
  full: {
    edges: [
      {
        node: {
          __typename: "HighlightedSelectionCard",
          urn: "ppb:tbd:card:highlightedSelection:924.111111111/50000000",
          title: "Both teams to score in each of Lorient v Lens & Braga v Benfica",
          market: {
            __typename: "SportsbookMarket",
            urn: "ppb:sbkMarket:924.111111111",
            name: "Thursday's Featured OddsBoosts (90 minutes only)",
            marketType: "DAILY_POWER_PRICES",
            bettingType: "ODDS",
            runners: [
              {
                __typename: "Runner",
                runnerURN: "ppb:sbkRunner:924.111111111/50000000",
                name: "Both teams to score in each of Lorient v Lens & Braga v Benfica",
                selectionId: 50000000,
                handicap: 0,
              },
            ],

            isOddsboostMarketType: true,
          },
          runner: {
            runnerURN: "ppb:sbkRunner:924.111111111/50000000",
          },
          displayPreviousOdd: true,
        },
      },
      {
        node: {
          __typename: "HighlightedSelectionCard",
          urn: "ppb:tbd:card:highlightedSelection:924.111111111/50000001",
          title: "Ajax, PAOK & Casa Pia all to win",
          market: {
            __typename: "SportsbookMarket",
            urn: "ppb:sbkMarket:924.111111111",
            name: "Thursday's Featured OddsBoosts (90 minutes only)",
            marketType: "DAILY_POWER_PRICES",
            bettingType: "ODDS",
            runners: [
              {
                __typename: "Runner",
                runnerURN: "ppb:sbkRunner:924.111111111/50000001",
                name: "Both teams to score in each of Lorient v Lens & Braga v Benfica",
                selectionId: 50000001,
                handicap: 0,
              },
            ],

            isOddsboostMarketType: true,
          },
          runner: {
            runnerURN: "ppb:sbkRunner:924.111111111/50000001",
          },
          displayPreviousOdd: true,
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "HighlightedSelectionCard",
          urn: "ppb:tbd:card:highlightedSelection:924.111111111/50000000",
        },
      },
      {
        node: {
          __typename: "HighlightedSelectionCard",
          urn: "ppb:tbd:card:highlightedSelection:924.111111111/50000001",
        },
      },
    ],
  },
};

const BET_BUILDER_CARD_GROUP = {
  __typename: "SwimlaneCardGroup",
  urn: "ppb:tbd:cardgroup:swimlane:PopularBetBuilders1",
  cardGroupTitle: "Popular Bet Builders",
  full: {
    edges: [
      {
        node: {
          __typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:bo-90406992|POPULAR|1|0|0",
          sportevent: {
            __typename: "SportsEvent",
            urn: "ppb:event:30000000",
            eventId: 30000000,
            name: "FC Twente v Ajax",
            openDate: "2023-02-09T17:45:00.000Z",
            competition: {
              __typename: "Competition",
              urn: "ppb:competition:11111",
              name: "Dutch Cup",
              competitionId: 11111,
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
            urn: "ppb:fixture:30000000",
            home: {
              name: "FC Twente",
              color: "d10000",
            },
            away: {
              name: "Ajax",
              color: "233560",
            },
            scheduledAt: "2023-02-09T17:45:00Z",
            duration: {
              period: "REGULAR",
              status: "PRE_MATCH",
            },
          },
          popularbettingopportunity: {
            __typename: "PopularBettingOpportunity",
            urn: "ppb:bettingOpportunity:popular:bo-90406992|POPULAR|1|0|0",
            count: 80,
            selections: [
              {
                __typename: "BettingOpportunitySelection",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.300000002",
                  name: "Corners Over/Under 9.5",
                  marketType: "TOTAL_CORNERS_9.5",
                  bettingType: "ODDS",
                  hierarchy: {
                    __typename: "EventCompetitionHierarchy",
                    sportevent: {
                      __typename: "SportsEvent",
                      urn: "ppb:event:30000000",
                      eventId: 30000000,
                      name: "FC Twente v Ajax",
                      openDate: "2023-02-09T17:45:00.000Z",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:11111",
                        name: "Dutch Cup",
                        competitionId: 11111,
                        sport: {
                          __typename: "Sport",
                          urn: "ppb:eventType:1",
                          name: "Football",
                          sportId: 1,
                        },
                      },
                    },
                    competition: {
                      __typename: "Competition",
                      urn: "ppb:competition:11111",
                      name: "Dutch Cup",
                      competitionId: 11111,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                        sportId: 1,
                      },
                    },
                  },
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 1,
                  },
                  runners: [
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.300000002/6000000",
                      name: "Over 9.5 Corners",
                      selectionId: 6000000,
                      handicap: 0,
                    },
                  ],

                  isOddsboostMarketType: false,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.300000002/6000000",
                  selectionId: 6000000,
                },
              },
              {
                __typename: "BettingOpportunitySelection",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.300000003",
                  name: "Anytime Goalscorer",
                  marketType: "TO_SCORE",
                  bettingType: "ODDS",
                  hierarchy: {
                    __typename: "EventCompetitionHierarchy",
                    sportevent: {
                      __typename: "SportsEvent",
                      urn: "ppb:event:30000000",
                      eventId: 30000000,
                      name: "FC Twente v Ajax",
                      openDate: "2023-02-09T17:45:00.000Z",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:11111",
                        name: "Dutch Cup",
                        competitionId: 11111,
                        sport: {
                          __typename: "Sport",
                          urn: "ppb:eventType:1",
                          name: "Football",
                          sportId: 1,
                        },
                      },
                    },
                    competition: {
                      __typename: "Competition",
                      urn: "ppb:competition:11111",
                      name: "Dutch Cup",
                      competitionId: 11111,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                        sportId: 1,
                      },
                    },
                  },
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 1,
                  },
                  runners: [
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.300000003/16000000",
                      name: "Steven Bergwijn",
                      selectionId: 16000000,
                      handicap: 0,
                    },
                  ],

                  isOddsboostMarketType: false,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.300000003/16000000",
                  selectionId: 16000000,
                },
              },
            ],
          },
          viewLink: {
            viewUrn: "ppb:tbd:view:event:30000000",
            viewUrl: "football/dutch-cup/fc-twente-v-ajax/e-30000000",
          },
        },
      },
      {
        node: {
          __typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:bo-a6da5e3a|POPULAR|1|0|0",
          sportevent: {
            __typename: "SportsEvent",
            urn: "ppb:event:30000004",
            eventId: 30000004,
            name: "West Ham v Chelsea",
            openDate: "2023-02-11T12:30:00.000Z",
            competition: {
              __typename: "Competition",
              urn: "ppb:competition:10000009",
              name: "English Premier League",
              competitionId: 10000009,
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
            urn: "ppb:fixture:30000004",
            home: {
              name: "West Ham",
              color: "74112e",
            },
            away: {
              name: "Chelsea",
              color: "ffffff",
            },
            scheduledAt: "2023-02-11T12:30:00Z",
            duration: {
              period: "REGULAR",
              status: "PRE_MATCH",
            },
          },
          popularbettingopportunity: {
            __typename: "PopularBettingOpportunity",
            urn: "ppb:bettingOpportunity:popular:bo-a6da5e3a|POPULAR|1|0|0",
            count: 10,
            selections: [
              {
                __typename: "BettingOpportunitySelection",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.300000005",
                  name: "Anytime Goalscorer",
                  marketType: "TO_SCORE",
                  bettingType: "ODDS",
                  hierarchy: {
                    __typename: "EventCompetitionHierarchy",
                    sportevent: {
                      __typename: "SportsEvent",
                      urn: "ppb:event:30000004",
                      eventId: 30000004,
                      name: "West Ham v Chelsea",
                      openDate: "2023-02-11T12:30:00.000Z",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:10000009",
                        name: "English Premier League",
                        competitionId: 10000009,
                        sport: {
                          __typename: "Sport",
                          urn: "ppb:eventType:1",
                          name: "Football",
                          sportId: 1,
                        },
                      },
                    },
                    competition: {
                      __typename: "Competition",
                      urn: "ppb:competition:10000009",
                      name: "English Premier League",
                      competitionId: 10000009,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                        sportId: 1,
                      },
                    },
                  },
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 1,
                  },
                  runners: [
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.300000005/10000050",
                      name: "Kai Havertz",
                      selectionId: 10000050,
                      handicap: 0,
                    },
                  ],

                  isOddsboostMarketType: false,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.300000005/10000050",
                  selectionId: 10000050,
                },
              },
              {
                __typename: "BettingOpportunitySelection",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.300000099",
                  name: "Anytime Assist",
                  marketType: "ANYTIME_ASSIST",
                  bettingType: "ODDS",
                  hierarchy: {
                    __typename: "EventCompetitionHierarchy",
                    sportevent: {
                      __typename: "SportsEvent",
                      urn: "ppb:event:30000004",
                      eventId: 30000004,
                      name: "West Ham v Chelsea",
                      openDate: "2023-02-11T12:30:00.000Z",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:10000009",
                        name: "English Premier League",
                        competitionId: 10000009,
                        sport: {
                          __typename: "Sport",
                          urn: "ppb:eventType:1",
                          name: "Football",
                          sportId: 1,
                        },
                      },
                    },
                    competition: {
                      __typename: "Competition",
                      urn: "ppb:competition:10000009",
                      name: "English Premier League",
                      competitionId: 10000009,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                        sportId: 1,
                      },
                    },
                  },
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 1,
                  },
                  runners: [
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.300000099/26000000",
                      name: "Mykhailo Mudryk",
                      selectionId: 26000000,
                      handicap: 0,
                    },
                  ],

                  isOddsboostMarketType: false,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.300000099/26000000",
                  selectionId: 26000000,
                },
              },
            ],
          },
          viewLink: {
            viewUrn: "ppb:tbd:view:event:30000004",
            viewUrl: "football/english-premier-league/west-ham-v-chelsea/e-30000004",
          },
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:bo-90406992|POPULAR|1|0|0",
        },
      },
      {
        node: {
          __typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:bo-a6da5e3a|POPULAR|1|0|0",
        },
      },
    ],
  },
};

const RACE_MARKET_CARD_GROUP = {
  __typename: "SwimlaneCardGroup",
  urn: "ppb:tbd:cardgroup:swimlane:RaceMarketCard1",
  cardGroupTitle: "UK Racing",
  viewAll: {
    label: "View More",
    viewLink: {
      viewUrn: "ppb:tbd:view:sport:7",
      viewUrl: "horse-racing/s-7",
    },
  },
  full: {
    edges: [
      {
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:924.345763938|3|false",
          raceViewLink: {
            viewUrn: "ppb:tbd:view:race:7|32089324.1305",
            viewUrl: "horse-racing/doncaster-9th-feb/r-7%7C32089324.1305",
          },
          title: "Win",
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.345763938",
                name: "2m Hcap Hrd",
                marketType: "WIN",
                marketTypeName: "Win",
                bettingType: "ODDS",
                liveData: {
                  inplay: false,
                  turnInPlayEnabled: false,
                  sportsbookMarketStatus: "OPEN",
                  bspMarket: true,
                  runners: [
                    {
                      urn: "ppb:tbd:sbkRunnerLiveData:924.345763938/214740",
                      runnerURN: "ppb:sbkRunner:924.345763938/214740",
                      handicap: 0,
                    },
                  ],
                },
                hierarchy: {
                  __typename: "RaceHierarchy",
                  race: {
                    __typename: "Race",
                    urn: "ppb:race:32089324.1305",
                    startTime: "2023-02-09T13:05:00.000Z",
                    raceId: "32089324.1305",
                    name: "2m Hcap Hrd",
                    meeting: {
                      __typename: "Meeting",
                      urn: "ppb:meeting:32089324",
                      name: "Doncaster 9th Feb",
                      meetingId: "32089324",
                      country: "GB",
                      countryFlag: {
                        vector: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
                      },
                      venue: "Doncaster",
                      date: "2023-02-09T13:05:00.000Z",
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:7",
                        name: "Horse Racing",
                        sportId: 7,
                      },
                    },
                  },
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:32089324",
                    name: "Doncaster 9th Feb",
                    meetingId: "32089324",
                    country: "GB",
                    countryFlag: {
                      vector: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
                    },
                    venue: "Doncaster",
                    date: "2023-02-09T13:05:00.000Z",
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:7",
                      name: "Horse Racing",
                      sportId: 7,
                    },
                  },
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:7",
                  name: "Horse Racing",
                  sportId: 7,
                },
                runners: [
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.345763938/214740",
                    name: "Bashful",
                    selectionId: 214740,
                    handicap: 0,
                  },
                ],

                isOddsboostMarketType: false,
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.345763938/214740",
                },
              ],
            },
          },
          numberOfRunners: 8,
          race: {
            __typename: "Race",
            urn: "ppb:race:32089324.1305",
            startTime: "2023-02-09T13:05:00.000Z",
            name: "2m Hcap Hrd",
            raceId: "32089324.1305",
            verdict:
              "GLORY BRIDGE displayed more than previously over hurdles (on back of a wind op) when runner-up in a C&D novice 2 weeks ago and, with further progress anticipated now handicapping, he could be worth chancing to take another step forward now. Half The Freedom, a winner over C&D on the same card, is an obvious threat however, whilst Bashful is another making the shortlist.",
            winningTime: 0,
            details: {
              scheduledTime: "2023-02-09T13:05:00Z",
              distance: {
                miles: 2,
                furlongs: 0,
                yards: 132,
              },
              numberOfRunners: 8,
              numberOfNonRunners: 2,
              numberOfParticipants: 10,
              going: "GOOD",
              status: "DORMANT",
              type: "HURDLE",
            },
            runners: [
              {
                __typename: "RaceRunner",
                urn: "ppb:tbd:racerunner:32089324.1305/214740",
                raceURN: "ppb:race:32089324.1305",
                rating123: 3,
                ratingStars: 4,
                selectionId: 214740,
                form: "P44-01234",
                rating: 96,
                comments:
                  "Landed a Redcar seller (1m) in November and continued good work over hurdles, successful at Uttoxeter (15.8f) prior to a pair of solid placed efforts. Not disgraced when fourth at Kelso (2m, heavy) latest and return to less testing ground here a likely plus.",
                status: "NON_RUNNER",
                horse: {
                  name: "BASHFUL",
                  sireName: "MANDURO (GER)",
                  damName: "INHIBITION",
                  damSireName: "NAYEF (USA)",
                  age: 5,
                  color: "BAY",
                  sex: "GELDING",
                },
                details: {
                  jockeyName: "Dylan Johnston",
                  trainerName: "Iain Jardine",
                  saddleCloth: "1",
                  weight: {
                    stones: "12-0",
                  },
                  equipmentDescription: "hood and tongue strap",
                  silk: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
                },
              },
            ],

            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:32089324",
              name: "Doncaster 9th Feb",
              meetingId: "32089324",
              country: "GB",
              countryFlag: {
                vector: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
              },
              venue: "Doncaster",
              date: "2023-02-09T13:05:00.000Z",
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:7",
                name: "Horse Racing",
                sportId: 7,
              },
            },
          },
          runnerViewLinks: [],
        },
      },
      {
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:924.345764146|3|false",
          raceViewLink: {
            viewUrn: "ppb:tbd:view:race:7|32089330.1315",
            viewUrl: "horse-racing/huntingdon-9th-feb/r-7%7C32089330.1315",
          },
          title: "Win",
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.345764146",
                name: "2m7f Nov Hcap Chs",
                marketType: "WIN",
                marketTypeName: "Win",
                bettingType: "ODDS",
                liveData: {
                  inplay: false,
                  turnInPlayEnabled: false,
                  sportsbookMarketStatus: "OPEN",
                  bspMarket: true,
                  runners: [
                    {
                      urn: "ppb:tbd:sbkRunnerLiveData:924.345764146/38251355",
                      runnerURN: "ppb:sbkRunner:924.345764146/38251355",
                      handicap: 0,
                    },
                  ],
                },
                hierarchy: {
                  __typename: "RaceHierarchy",
                  race: {
                    __typename: "Race",
                    urn: "ppb:race:32089330.1315",
                    startTime: "2023-02-09T13:15:00.000Z",
                    raceId: "32089330.1315",
                    name: "2m7f Nov Hcap Chs",
                    meeting: {
                      __typename: "Meeting",
                      urn: "ppb:meeting:32089330",
                      name: "Huntingdon 9th Feb",
                      meetingId: "32089330",
                      country: "GB",
                      countryFlag: {
                        vector: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
                      },
                      venue: "Huntingdon",
                      date: "2023-02-09T13:15:00.000Z",
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:7",
                        name: "Horse Racing",
                        sportId: 7,
                      },
                    },
                  },
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:32089330",
                    name: "Huntingdon 9th Feb",
                    meetingId: "32089330",
                    country: "GB",
                    countryFlag: {
                      vector: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
                    },
                    venue: "Huntingdon",
                    date: "2023-02-09T13:15:00.000Z",
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:7",
                      name: "Horse Racing",
                      sportId: 7,
                    },
                  },
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:7",
                  name: "Horse Racing",
                  sportId: 7,
                },
                runners: [
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.345764146/38251355",
                    name: "Shiroccos Dream",
                    selectionId: 38251355,
                    handicap: 0,
                  },
                ],

                isOddsboostMarketType: false,
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.345764146/38251355",
                },
              ],
            },
          },
          numberOfRunners: 4,
          race: {
            __typename: "Race",
            urn: "ppb:race:32089330.1315",
            startTime: "2023-02-09T13:15:00.000Z",
            name: "2m7f Nov Hcap Chs",
            raceId: "32089330.1315",
            verdict:
              "Impossible to rule out any of the quartet but DO YOU THINK is fancied to put her chasing experience to good use and notch a second success over the larger obstacles. Moonamacaroona shades the vote over Merry Mistress for the forecast position.",
            winningTime: 0,
            details: {
              scheduledTime: "2023-02-09T13:15:00Z",
              distance: {
                miles: 2,
                furlongs: 7,
                yards: 132,
              },
              numberOfRunners: 4,
              numberOfNonRunners: 0,
              numberOfParticipants: 4,
              going: "GOOD",
              status: "DORMANT",
              type: "CHASE",
            },
            runners: [
              {
                __typename: "RaceRunner",
                urn: "ppb:tbd:racerunner:32089330.1315/38251355",
                raceURN: "ppb:race:32089330.1315",
                rating123: 0,
                ratingStars: 3,
                selectionId: 38251355,
                form: "3/116733-0",
                rating: 107,
                comments:
                  "£260,000 purchase who scored twice over hurdles last season but was below form after 7 months off at Exeter (21.6f, good to soft) in November, helping the winner force the pace but lacking race fitness. A point winner so no surprise should she feature on chase debut.",
                status: "RUNNER",
                horse: {
                  name: "SHIROCCO'S DREAM",
                  sireName: "SHIROCCO (GER)",
                  damName: "DREAM FUNCTION (IRE)",
                  damSireName: "KING'S THEATRE (IRE)",
                  age: 8,
                  color: "BAY",
                  sex: "FILLY",
                  bred: "IRE",
                },
                details: {
                  jockeyName: "Brendan Powell",
                  trainerName: "Joe Tizzard",
                  saddleCloth: "1",
                  weight: {
                    stones: "11-6",
                  },
                  equipmentDescription: "tongue strap",
                  silk: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
                },
              },
            ],

            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:32089330",
              name: "Huntingdon 9th Feb",
              meetingId: "32089330",
              country: "GB",
              countryFlag: {
                vector: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
              },
              venue: "Huntingdon",
              date: "2023-02-09T13:15:00.000Z",
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:7",
                name: "Horse Racing",
                sportId: 7,
              },
            },
          },
          runnerViewLinks: [],
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:924.345763938|3|false",
        },
      },
      {
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:924.345764146|3|false",
        },
      },
    ],
  },
};

const COMPETITION_VIEW_LINK_CARD_GROUP = {
  __typename: "SwimlaneCardGroup",
  urn: "ppb:tbd:cardgroup:swimlane:CompetitionViewLinkCard1",
  cardGroupTitle: "Top Competitions",
  full: {
    edges: [
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:10951364",
          viewLink: {
            viewUrn: "ppb:tbd:view:competition:10951364",
            viewUrl: "special-bets/bbc-sports-personality/c-10951364",
          },
          competition: {
            __typename: "Competition",
            urn: "ppb:competition:10951364",
            name: "BBC Sports Personality",
            competitionId: 10951364,
            sport: {
              __typename: "Sport",
              urn: "ppb:eventType:10",
              name: "Special Bets",
              sportId: 10,
            },
          },
        },
      },
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:59",
          competition: {
            urn: "ppb:competition:59",
            name: "German Bundesliga",
            logo: {
              large: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            },
          },
        },
      },
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:61",
          competition: {
            urn: "ppb:competition:61",
            name: "UEFA",
            country: {
              urn: "urn:usa",
              code: "USA",
              flag: {
                vector: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.svg`,
              },
            },
          },
        },
      },
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:12209550",
          competition: {
            urn: "ppb:competition:12209550",
            name: "Rugby Union Ellipsis",
            sport: {
              urn: "ppb:eventType:5",
              sportId: 5,
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
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:10951364",
        },
      },
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:59",
        },
      },
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:61",
        },
      },
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:12209550",
        },
      },
    ],
  },
};

const GENERIC_VIEW_SCROLLABLE_SWIMLANES_WITH_ICONS_AND_CARDS = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "UEFA Champions League",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29744375",
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
                      urn: "ppb:excMarket:1.169998771",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.227925260",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29744375",
                  scheduledAt: "2020-02-01T12:30",
                  startedAt: "2020-02-01T12:30",
                  home: { name: "1" },
                  away: { name: "2" },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29742063",
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
                      urn: "ppb:excMarket:1.169920811",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29742063",
                  scheduledAt: "2020-02-01T12:30",
                  startedAt: "2020-02-01T12:30",
                  home: { name: "3" },
                  away: { name: "4" },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:29744375" } },
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:29742063" } },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const MODULE_NAME = "swimlane_card_group_layout";

describe("Swimlane CardGroup Layout", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage/image.png*", imageType: "png" }));
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage/image.svg*", imageType: "svg" }));
  });

  describe("Promotions CardGroup", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(buildBFFMock(PROMOTIONS_CARD_GROUP)));
      await startApp("home", { pullToRefresh: true });
      await browser.waitUntilDisplayed(promotionCardSO.element);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4950]_should_render_the_promotion_swimlanes_whit_the_correct_layout`,
      );
    });

    it("[PRPI-4950]_should_render_the_promotion_swimlanes_whit_the_correct_layout", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4950]_should_render_the_promotion_swimlanes_whit_the_correct_layout`,
          )
        ).misMatchPercentage,
      ).toBe(0);
    });
  });

  describe("HighlightedSelection CardGroup", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(buildBFFMock(HIGHLIGHTED_SELECTION_CARD_GROUP)));
      await swipeDownElementFullscreen(promotionCardSO.element);
      await browser.waitUntilDisplayed(highlightedSelectionCardSO.element);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4951]_should_render_the_highlighted_selection_swimlanes_whit_the_correct_layout`,
      );
    });

    it("[PRPI-4951]_should_render_the_highlighted_selection_swimlanes_whit_the_correct_layout", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4951]_should_render_the_highlighted_selection_swimlanes_whit_the_correct_layout`,
          )
        ).misMatchPercentage,
      ).toBe(0);
    });
  });

  describe("PopularBetBuilder CardGroup", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(buildBFFMock(BET_BUILDER_CARD_GROUP)));
      await swipeDownElementFullscreen(highlightedSelectionCardSO.element);
      await browser.waitUntilDisplayed(popularBetBuilderCardSO.element);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4952]_should_render_the_popular_bet_builder_swimlanes_whit_the_correct_layout`,
      );
    });

    it("[PRPI-4952]_should_render_the_popular_bet_builder_swimlanes_whit_the_correct_layout", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4952]_should_render_the_popular_bet_builder_swimlanes_whit_the_correct_layout`,
          )
        ).misMatchPercentage,
      ).toBe(0);
    });
  });

  describe("RaceMarket CardGroup", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(buildBFFMock(RACE_MARKET_CARD_GROUP)));
      await swipeDownElementFullscreen(popularBetBuilderCardSO.element);
      await browser.waitUntilDisplayed(raceMarketCardSO.element);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4953]_should_render_the_race_markets_swimlanes_whit_the_correct_layout`,
      );
    });

    it("[PRPI-4953]_should_render_the_race_markets_swimlanes_whit_the_correct_layout", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4953]_should_render_the_race_markets_swimlanes_whit_the_correct_layout`,
          )
        ).misMatchPercentage,
      ).toBe(0);
    });
  });

  describe("CompetitionViewLink CardGroup", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(buildBFFMock(COMPETITION_VIEW_LINK_CARD_GROUP)));

      await swipeDownElementFullscreen(raceMarketCardSO.element);

      await browser.waitUntilDisplayed(competitionViewLinkCardSO.element);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4954]_should_render_the_competition_viewlink_swimlanes_whit_the_correct_layout`,
      );
    });

    it("[PRPI-4954]_should_render_the_competition_viewlink_swimlanes_whit_the_correct_layout", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4954]_should_render_the_competition_viewlink_swimlanes_whit_the_correct_layout`,
          )
        ).misMatchPercentage,
      ).toBe(0);
    });
  });

  describe("Swimlanes Layout", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(GENERIC_VIEW_SCROLLABLE_SWIMLANES_WITH_ICONS_AND_CARDS));
      await swipeDownElementFullscreen(competitionViewLinkCardSO.element);

      await browser.waitUntilDisplayed(lastSwimlaneElementSO.element);

      await swipeLeftElement(lastSwimlaneElementSO.element);

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_"[PRPI-4955]_should_render_the_last_cards_of_swimlanes_aligned_and_have_the_correct_margins"`,
      );
    });

    it("[PRPI-4955]_should_render_the_last_cards_of_swimlanes_aligned_and_have_the_correct_margins", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4955]_should_render_the_last_cards_of_swimlanes_aligned_and_have_the_correct_margins`,
          )
        ).misMatchPercentage,
      ).toBe(0);
    });
  });
});
