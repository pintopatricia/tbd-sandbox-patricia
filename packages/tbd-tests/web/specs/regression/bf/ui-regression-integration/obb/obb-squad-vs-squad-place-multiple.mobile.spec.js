const {
  getEventLayout,
  getObbQuotes,
  getObbEventParticipants,
  getObbImply,
  getObbPlaceBets,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const {
  ObbSquadVsSquadCardPO,
  SportsbookBetButtonPO,
  ActionLinkPO,
  ObbSquadVsSquadPlayerPickerPO,
  PrimaryButtonPO,
  BetslipDrawerPO,
  MinimizedPO,
  SportsbookPlacePanelPO,
  CardPO,
  CurrencyNumberInputFieldPO,
  ReceiptTitlePO,
} = require("../../../../../page-objects");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const routes = require("../../../../../../utils/routes");

const obbSquadVsSquadCardPO = new ObbSquadVsSquadCardPO();
const firstBetButtonPO = new SportsbookBetButtonPO(obbSquadVsSquadCardPO.firstBetButton);
const firstEditSquadLinkPO = new ActionLinkPO(obbSquadVsSquadCardPO.firstEditSquadLink);
const obbSquadVsSquadPlayerPickerPO = new ObbSquadVsSquadPlayerPickerPO();

const saveChangeButtonPO = new PrimaryButtonPO();

const betslipDrawerPO = new BetslipDrawerPO();
const minimizedPO = new MinimizedPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();

const multiplesCardPO = new CardPO(sportsbookPlacePanelPO.collapsableSections[0]);
const stakeInputField = new CurrencyNumberInputFieldPO();
const placeButton = new PrimaryButtonPO();
const receiptTitle = new ReceiptTitlePO().element;

const mockService = new MockService();
const EVENT_ID = "33755137";

const bffResponse = {
  data: {
    View: {
      __typename: "EventView",
      urn: "ppb:tbd:view:event:33755137",
      url: "football/uefa-nations-league/north-macedonia-v-latvia/e-33755137",
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:33755137",
        eventId: 33755137,
        name: "North Macedonia v Latvia",
        openDate: "2024-11-14T19:45:00.000Z",
        competition: {
          __typename: "Competition",
          urn: "ppb:competition:11984200",
          name: "UEFA Nations League",
          competitionId: 11984200,
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            shortName: null,
            sportId: 1,
          },
          logo: {},
          country: {
            urn: "",
            code: "",
            flag: {
              vector: "",
            },
          },
        },
      },
      leftSidebar: {
        __typename: "LeftSidebar",
        items: {
          edges: [],
        },
        pageInfo: null,
      },
      items: {
        pageInfo: {
          nextPageCursor: "TUFUQ0hfT0REUyxDT1JSRUNUX1NDT1JFLE9WRVJfVU5ERVJfMDUsT1ZFUl9VTkRFUl8xNQ==",
        },
        edges: [
          {
            node: {
              __typename: "ObbCardGroup",
              urn: "ppb:obb:cardgroup:ZylnFBIAAB8AKIpz/e/33755137",
              obbCardGroupTitle: {
                __typename: "DisplayNameTitle",
                name: "Match Ups",
              },
              event: {
                urn: "ppb:event:33755137",
                eventId: 33755137,
                name: "North Macedonia v Latvia",
                openDate: "1985-02-05T19:30:00.000Z",
              },
              bettingWindowOffset: 24,
              moreInfoLabel: {
                name: "More Info",
                __typename: "DisplayNameTitle",
              },
              moreInfo: {
                moreInfoDetails: [
                  {
                    type: "heading5",
                    text: "Rich Content Heading",
                    spans: null,
                    __typename: "RichText",
                  },
                  {
                    type: "paragraph",
                    text: "Rich content paragraph",
                    spans: null,
                    __typename: "RichText",
                  },
                  {
                    type: "url_link",
                    text: "Some url",
                    spans: [
                      {
                        start: 0,
                        end: 25,
                        style: "undefined",
                        viewLink: {
                          viewUrn: "ppb:tbd:view:external:external",
                          viewUrl: "https://www.betfair.com/betting/",
                          viewDisplayMode: "BLANK_INAPP",
                          __typename: "ViewLink",
                        },
                        __typename: "RichTextSpan",
                      },
                    ],

                    __typename: "RichText",
                  },
                ],
              },
              obbCardGroupSections: {
                edges: [
                  {
                    node: {
                      __typename: "ObbSection",
                      icon: {
                        id: "Two-Up-Early-Payout",
                        category: "Value",
                      },
                      obbSectionTitle: {
                        __typename: "DisplayNameTitle",
                        name: "Section Title Test 1",
                      },
                      urn: "ppb:obb:section:aQne5RIAACUAl7iV/e/33755137",
                      layouts: {
                        edges: [
                          {
                            node: {
                              __typename: "ObbCardsStackedLayout",
                              title: null,
                              urn: "ppb:obb:cardslayout:stacked:ZylnFBIAAB8AKIpz/obb_cards_layout$b65dbf9d-53fd-4969-83ee-f59b444ec72a/e/33755137",
                              cards: {
                                edges: [
                                  {
                                    node: {
                                      __typename: "ObbSquadVsSquadCard",
                                      urn: "ppb:obb:card:squadVsSquad:aAZWeREAACAAel7O/e/33755137",
                                      showModalEntryPoint: true,
                                      title: {
                                        __typename: "DisplayNameTitle",
                                        name: "Race To X Points",
                                      },
                                      outcomesText: {
                                        __typename: "DisplayNameTitle",
                                        name: "How many goals between them?",
                                      },
                                      statsText: {
                                        __typename: "DisplayNameTitle",
                                        name: "Avg goals combined",
                                      },
                                      participantInfo: {
                                        __typename: "DisplayNameTitle",
                                        name: "This season's average stats per game for the selected competition. No stats available for the first match of each competition.",
                                      },
                                      event: {
                                        __typename: "SportsEvent",
                                        urn: "ppb:event:33755137",
                                        name: "North Macedonia v Latvia",
                                        eventId: 33755137,
                                      },
                                      eventParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                          player: {
                                            id: "11111",
                                            name: "Cole Palmer",
                                            position: null,
                                            seasonStats: {
                                              matchesPlayed: 25,
                                              averages: {
                                                goals: 0.61,
                                                redCards: 0,
                                                yellowCards: 0.23,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.31,
                                                totalShots: 3.31,
                                                fouls: 1.2,
                                                foulsWon: 0.8,
                                                assists: 0.3,
                                                passes: 42.5,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "56085",
                                            name: "North Macedonia",
                                            color: "#FF0000",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                          player: {
                                            id: "22222",
                                            name: "Nicolas Jackson",
                                            position: null,
                                            seasonStats: {
                                              matchesPlayed: 28,
                                              averages: {
                                                goals: 0.61,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.54,
                                                totalShots: 2.38,
                                                fouls: 1.5,
                                                foulsWon: 1.1,
                                                assists: 0.4,
                                                passes: 38.7,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "56085",
                                            name: "North Macedonia",
                                            color: "#FF0000",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                          player: {
                                            id: "33333",
                                            name: "Radamel Falcao",
                                            position: null,
                                            seasonStats: {
                                              matchesPlayed: 18,
                                              averages: {
                                                goals: 0.1,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.22,
                                                totalShots: 1.54,
                                                fouls: 0.9,
                                                foulsWon: 0.7,
                                                assists: 0.2,
                                                passes: 29.3,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "56085",
                                            name: "North Macedonia",
                                            color: "#FF0000",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                          player: {
                                            id: "44444",
                                            name: "Osmande Diomande",
                                            position: null,
                                            seasonStats: {
                                              matchesPlayed: 18,
                                              averages: {
                                                goals: 0.1,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.22,
                                                totalShots: 1.54,
                                                fouls: 0.9,
                                                foulsWon: 0.7,
                                                assists: 0.2,
                                                passes: 29.3,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "16085",
                                            name: "Latvia",
                                            color: "#FF0000",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                          player: {
                                            id: "55555",
                                            name: "Luis Suarez",
                                            position: null,
                                            seasonStats: {
                                              matchesPlayed: 18,
                                              averages: {
                                                goals: 0.1,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.22,
                                                totalShots: 1.54,
                                                fouls: 0.9,
                                                foulsWon: 0.7,
                                                assists: 0.2,
                                                passes: 29.3,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "16085",
                                            name: "Latvia",
                                            color: "#FF0000",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:66666/e/33755137",
                                          player: {
                                            id: "66666",
                                            name: "Geny Catamo",
                                            position: null,
                                            seasonStats: {
                                              matchesPlayed: 18,
                                              averages: {
                                                goals: 0.1,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.22,
                                                totalShots: 1.54,
                                                fouls: 0.9,
                                                foulsWon: 0.7,
                                                assists: 0.2,
                                                passes: 29.3,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "16085",
                                            name: "Latvia",
                                            color: "#FF0000",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                      ],

                                      firstSquadParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                        },
                                      ],

                                      secondSquadParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                        },
                                      ],

                                      incidentType: {
                                        id: "GOALS_TIME_ADJUSTED",
                                        __typename: "ObbIncidentType",
                                      },
                                      defaultLegs: [
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "squadVsSquad",
                                          templateParams: {
                                            __typename: "ObbSquadVsSquadParams",
                                            squadAParticipantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                            ],

                                            squadBParticipantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS_TIME_ADJUSTED"],
                                            timePeriodId: "MATCH",
                                            quantifier: "GREATER_THAN",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 2.22,
                                              fractional: {
                                                numerator: 4,
                                                denominator: 6,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "ObbOdds",
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
                                            eventId: 33755137,
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "squadVsSquad",
                                          templateParams: {
                                            __typename: "ObbSquadVsSquadParams",
                                            squadAParticipantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                            ],

                                            squadBParticipantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS_TIME_ADJUSTED"],
                                            timePeriodId: "MATCH",
                                            quantifier: "LESS_THAN",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              __typename: "ObbOdds",
                                              decimal: 6.5,
                                              fractional: {
                                                __typename: "FractionalOdds",
                                                numerator: 11,
                                                denominator: 2,
                                              },
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
                                            eventId: 33755137,
                                          },
                                        },
                                      ],
                                    },
                                    __typename: "ObbCardEdge",
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      partialItems: {
        pageInfo: null,
        edges: [
          {
            node: {
              __typename: "ObbCardGroup",
              urn: "ppb:obb:cardgroup:ZylnFBIAAB8AKIpz/e/33755137",
            },
          },
        ],
      },
      bottomBar: {
        __typename: "BottomBar",
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
        ],

        hasProductSwitcher: false,
      },
    },
  },
};

const eventParticipants = {
  eventParticipants: [
    {
      urn: "ppb:obb:footballPlayer:11111/e/33755137",
      incidentTypes: [
        {
          id: "GOALS_TIME_ADJUSTED",
          resultType: {
            max: 3,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:22222/e/33755137",
      incidentTypes: [
        {
          id: "GOALS_TIME_ADJUSTED",
          resultType: {
            max: 6,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:33333/e/33755137",
      incidentTypes: [
        {
          id: "GOALS_TIME_ADJUSTED",
          resultType: {
            max: 9,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:44444/e/33755137",
      incidentTypes: [
        {
          id: "GOALS_TIME_ADJUSTED",
          resultType: {
            max: 6,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:55555/e/33755137",
      incidentTypes: [
        {
          id: "GOALS_TIME_ADJUSTED",
          resultType: {
            max: 6,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:66666/e/33755137",
      incidentTypes: [
        {
          id: "GOALS_TIME_ADJUSTED",
          resultType: {
            max: 6,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
  ],

  __typename: "ObbQuery",
};

const cardQuotes = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
      __typename: "EventId",
    },
    prices: [
      {
        id: "69ed3a18d7937494",
        price: {
          decimal: 2.22,
          fractional: {
            numerator: 4,
            denominator: 6,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
      {
        id: "307667bc1f8dd9c4",
        price: {
          decimal: 6.5,
          fractional: {
            numerator: 11,
            denominator: 2,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
    ],
  },
};

const modalQuotes = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
      __typename: "EventId",
    },
    prices: [
      {
        id: "ff715c20d4544158",
        price: {
          decimal: 3.01,
          fractional: {
            numerator: 4,
            denominator: 6,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
      {
        id: "add090742b7f843b",
        price: {
          decimal: 1.5,
          fractional: {
            numerator: 11,
            denominator: 2,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
    ],
  },
};

const firstImplyBetsResponse = {
  betDefinitions: [
    {
      id: "69ed3a18d7937494",
      details: {
        minStake: 0.1,
        maxStake: 62.5,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        currency: "GBP",
        price: {
          decimal: 3.01,
          fractional: {
            numerator: 4,
            denominator: 6,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        __typename: "ImplyDetails",
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
  ],

  combinedBetDefinitions: [],
};

const secondImplyBetsResponse = {
  betDefinitions: [
    {
      id: "69ed3a18d7937494",
      details: {
        minStake: 0.1,
        maxStake: 11.83,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          decimal: 3.01,
          fractional: {
            numerator: 4,
            denominator: 6,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
    {
      id: "ff715c20d4544158",
      details: {
        minStake: 0.1,
        maxStake: 11.83,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          fractional: {
            numerator: 1,
            denominator: 200,
          },
          decimal: 20,
        },
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
  ],

  combinedBetDefinitions: [
    {
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
        __typename: "ObbResult",
      },
      legs: [
        {
          eventId: {
            supplier: "SPORTEX",
            id: "33755137",
            __typename: "EventId",
          },
          expressionTemplateId: "xOfN",
          baseExpressionTemplateDefinitions: [
            {
              expressionTemplateId: "squadVsSquad",
              __typename: "BaseExpressionTemplateDefinitions",
            },
            {
              expressionTemplateId: "squadVsSquad",
              __typename: "BaseExpressionTemplateDefinitions",
            },
          ],

          expressionParams: {
            baseBets: [
              {
                params: {
                  outcomeIds: ["GOALS_TIME_ADJUSTED"],
                  timePeriodId: "MATCH",
                  squadAParticipantIds: ["11111"],
                  squadBParticipantIds: ["44444", "55555"],
                  quantifier: "GREATER_THAN",
                },
                templateId: "squadVsSquad",
                __typename: "BaseBet",
              },
              {
                params: {
                  outcomeIds: ["GOALS_TIME_ADJUSTED"],
                  timePeriodId: "MATCH",
                  squadAParticipantIds: ["11111", "22222"],
                  squadBParticipantIds: ["44444", "55555"],
                  quantifier: "GREATER_THAN",
                },
                templateId: "squadVsSquad",
                __typename: "BaseBet",
              },
            ],

            x: 2,
            __typename: "ExpressionParams",
          },
          betDefinitions: ["69ed3a18d7937494", "ff715c20d4544158"],
          result: {
            errorDetails: null,
            resultCode: "SUCCESS",
            __typename: "ObbResult",
          },
          __typename: "CombinedBetLegsDefinitionResult",
        },
      ],

      details: {
        minStake: 0.1,
        maxStake: 46.15,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        currency: "GBP",
        price: {
          decimal: 7.5,
          fractional: {
            numerator: 13,
            denominator: 2,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        __typename: "ImplyDetails",
      },
      __typename: "CombinedBetDefinitionResult",
    },
  ],

  result: {
    resultCode: "SUCCESS",
    errorDetails: null,
  },
};

const legsQuotes = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
      __typename: "EventId",
    },
    prices: [
      {
        id: "69ed3a18d7937494",
        price: {
          decimal: 1.25,
          fractional: {
            numerator: 1,
            denominator: 200,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
      {
        id: "ff715c20d4544158",
        price: {
          decimal: 20,
          fractional: {
            numerator: 1,
            denominator: 200,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
      {
        id: "3b897d6fd5f6a2b",
        price: {
          decimal: 20,
          fractional: {
            numerator: 1,
            denominator: 200,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
    ],
  },
};

const placeBetsResponse = {
  betPlacementsResult: [
    {
      id: "SINGLE:[3b897d6fd5f6a2b]",
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
        legResults: [
          {
            resultCode: "SUCCESS",
            errorDetails: null,
            __typename: "ObbResult",
          },
        ],

        __typename: "Result",
      },
      betDetails: {
        id: "urn:sbk:bet:bf:obb:01jyr6nj5qeapajr6epefx3n9s",
        receiptId: "o:01jyr6nj5qesxtqsr70dybfvg1",
        betType: "SINGLE",
        placedDate: "2025-06-27T08:04:37.687096097Z",
        price: {
          decimal: 7.5,
          fractional: {
            numerator: 13,
            denominator: 2,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        stake: 1,
        stakePerLine: 1,
        potentialPayout: 7.5,
        currency: "EUR",
        outcomeBasedLegs: [
          {
            price: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "ObbOdds",
            },
            eventId: {
              id: "33755137",
              supplier: "SPORTEX",
              __typename: "EventId",
            },
            __typename: "OutcomeBasedLeg",
          },
        ],

        __typename: "BetDetails",
      },
      __typename: "BetPlacementDetails",
    },
  ],

  result: {
    resultCode: "SUCCESS",
    errorDetails: null,
    __typename: "ObbResult",
  },
  __typename: "PlaceBetResponse",
};

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "20" }];

function responseToTemplate(json) {
  return {
    urn: json.data.View.urn,
    url: json.data.View.url,
    sportevent: json.data.View.sportevent,
    edges: json.data.View.items.edges,
    partialEdges: json.data.View.partialItems.edges,
  };
}

const BFF_MOCK = responseToTemplate(bffResponse);

describe("OBB - Squad Vs Squad - Multiple", () => {
  describe("Given I'm on an event page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);
      await mockService.mockHttpRequest(eventLayout);
      await mockService.mockHttpRequest(getObbEventParticipants(eventParticipants));
      await mockService.mockHttpRequest(getObbQuotes(cardQuotes));
      await mockService.mockHttpRequest(getObbImply(firstImplyBetsResponse));
      await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
      await mockService.mockHttpRequest(getObbPlaceBets(placeBetsResponse));

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);
    });

    describe("When I click on the first bet button of the Squad vs Squad Card", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(obbSquadVsSquadCardPO.element);
        await browser.waitUntilDisplayed(obbSquadVsSquadCardPO.firstBetButton);

        await firstBetButtonPO.element.click();
      });

      it("[PRPI-7142] should have the bet button in selected state", async () => {
        expect(await browser.containsClass(firstBetButtonPO.element, SportsbookBetButtonPO.states.selected)).toBe(true);
      });
    });

    describe("When I add a new player to the Squad 1 and add the bet to the betslip", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.click();
        await browser.waitUntilDisplayed(obbSquadVsSquadCardPO.firstBetButton);
        await firstEditSquadLinkPO.element.click();
        await browser.waitUntilDisplayed(obbSquadVsSquadPlayerPickerPO.element);

        await mockService.mockHttpRequest(getObbQuotes(modalQuotes));
        await obbSquadVsSquadPlayerPickerPO.playersRows[1].click();

        await saveChangeButtonPO.element.click();
        await browser.waitUntilDisplayed(obbSquadVsSquadCardPO.firstBetButton);

        await mockService.mockHttpRequest(getObbQuotes(legsQuotes));
        await mockService.mockHttpRequest(getObbImply(secondImplyBetsResponse));
        await firstBetButtonPO.element.click();

        await browser.waitUntilDisplayed(minimizedPO.element);
        await minimizedPO.title.click();
      });

      it("[PRPI-7143] should have the multiple section displayed", async () => {
        expect(await multiplesCardPO.header.getText()).toBe("MULTIPLES");
      });

      it("[PRPI-7144] should have the correct multiples text", async () => {
        expect(await multiplesCardPO.element.getText()).toContain(
          "Cole Palmer\nTo Score More Goals Than Osmande Diomande & Luis Suarez",
        );

        expect(await multiplesCardPO.element.getText()).toContain(
          "Cole Palmer & Nicolas Jackson\nTo Score More Goals Than Osmande Diomande & Luis Suarez",
        );
      });
    });

    describe("when I enter a stake and I click on the place button", () => {
      beforeAll(async () => {
        await stakeInputField.setValue("1");
        await placeButton.element.click();
        await browser.waitUntilDisplayed(receiptTitle);
      });

      it("[PRPI-7145] should place the bet successfully", async () => {
        const receiptTitleText = await receiptTitle.getText();

        expect(receiptTitleText).toBe("Bet Placed");
      });

      it("[PRPI-7146] should display the receipt", async () => {
        expect(await receiptTitle.isDisplayed()).toBe(true);
      });
    });
  });
});
