const {
  getEventLayout,
  getObbQuotes,
  getObbEventParticipants,
  getObbImply,
  getObbPlaceBets,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  ObbSquadVsSquadCardPO,
  SportsbookBetButtonPO,
  MicroPlayerPO,
  ActionLinkPO,
  ObbSquadVsSquadPlayerPickerPO,
  ObbPlayersRowCardPO,
  PrimaryButtonPO,
  BetDetailsPO,
  CurrencyNumberInputFieldPO,
  ReceiptTitlePO,
  SportsbookReceiptPanelPO,
} = require("../../../../../page-objects");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const routes = require("../../../../../../utils/routes");

const obbSquadVsSquadCardPO = new ObbSquadVsSquadCardPO();
const firstButtonPO = new SportsbookBetButtonPO(obbSquadVsSquadCardPO.firstBetButton);
const secondBetButtonPO = new SportsbookBetButtonPO(obbSquadVsSquadCardPO.secondBetButton);
const firstMicroPlayerPO = new MicroPlayerPO(obbSquadVsSquadCardPO.firstMicroPlayer);
const secondMicroPlayerPO = new MicroPlayerPO(obbSquadVsSquadCardPO.secondMicroPlayer);
const firstEditSquadLinkPO = new ActionLinkPO(obbSquadVsSquadCardPO.firstEditSquadLink);
const obbSquadVsSquadPlayerPickerPO = new ObbSquadVsSquadPlayerPickerPO();

const saveChangeButtonPO = new PrimaryButtonPO();

const firstHighlightedObbPlayersRowCard = new ObbPlayersRowCardPO(
  obbSquadVsSquadPlayerPickerPO.playersRowHighlighted[0],
);
const secondHighlightedObbPlayersRowCard = new ObbPlayersRowCardPO(
  obbSquadVsSquadPlayerPickerPO.playersRowHighlighted[1],
);
const thirdHighlightedObbPlayersRowCard = new ObbPlayersRowCardPO(
  obbSquadVsSquadPlayerPickerPO.playersRowHighlighted[2],
);

const firstDisabledObbPlayersRowCardFirstName = new ObbPlayersRowCardPO(
  obbSquadVsSquadPlayerPickerPO.playersRowDisabledFirstNames[0],
);
const secondDisabledObbPlayersRowCardFirstName = new ObbPlayersRowCardPO(
  obbSquadVsSquadPlayerPickerPO.playersRowDisabledFirstNames[1],
);

const betDetailsPO = new BetDetailsPO();
const stakeInputField = new CurrencyNumberInputFieldPO();
const placeButton = new PrimaryButtonPO();

const receiptTitle = new ReceiptTitlePO().element;
const betReceiptPO = new SportsbookReceiptPanelPO();
const singleSelectionPO = new BetDetailsPO(betReceiptPO.singles[0]);

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
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:22222/e/33755137",
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
        id: "ff715c20d4544158",
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
        id: "add090742b7f843b",
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
        id: "44bc1c1ca6d57280",
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
        id: "32a8ddb8dfe598c",
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

const implyBetsResponse = {
  betDefinitions: [
    {
      id: "44bc1c1ca6d57280",
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

const placeBetsResponse = {
  betPlacementsResult: [
    {
      id: "SINGLE:[44bc1c1ca6d57280]",
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
        id: "urn:sbk:bet:bf:obb:01jd1xb2ncfq0917rvzncw16sm",
        receiptId: "o:01jd1xb2ncf5bsfp02vx0qkw1v",
        betType: "SINGLE",
        placedDate: "2024-11-19T09:51:28.428386001Z",
        price: {
          fractional: {
            numerator: 21,
            denominator: 10,
            __typename: "FractionalOdds",
          },
          decimal: 3.22,
          __typename: "SportsbookOdds",
        },
        stake: 1,
        potentialPayout: 3.22,
        currency: "EUR",
        outcomeBasedLegs: [
          {
            eventId: {
              id: "33755137",
              supplier: "SPORTEX",
              __typename: "EventId",
            },
            price: {
              fractional: {
                numerator: 4,
                denominator: 6,
                __typename: "FractionalOdds",
              },
              decimal: 3.01,
              __typename: "ObbOdds",
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

describe("OBB - Squad vs Squad - Single", () => {
  describe("Given I'm on an event page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);
      await mockService.mockHttpRequest(eventLayout);
      await mockService.mockHttpRequest(getObbEventParticipants(eventParticipants));
      await mockService.mockHttpRequest(getObbQuotes(cardQuotes));
      await mockService.mockHttpRequest(getObbImply(implyBetsResponse));
      await mockService.mockHttpRequest(getObbPlaceBets(placeBetsResponse));

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);
    });

    describe("And I have a squad vs squad card", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(obbSquadVsSquadCardPO.element);
        await browser.waitUntilDisplayed(obbSquadVsSquadCardPO.firstBetButton);
      });

      it("[PRPI-7147] should have the correct players selected", async () => {
        expect(await firstMicroPlayerPO.microPlayerNameContainer.getText()).toBe("Cole Palmer, Nicolas Jackson");
        expect(await secondMicroPlayerPO.microPlayerNameContainer.getText()).toBe("Osmande Diomande, Luis Suarez");
      });

      it("[PRPI-7148] should display the bet buttons with the correct odds", async () => {
        expect(await firstButtonPO.secondaryLabel.getText()).toBe("Squad 1");
        expect(await firstButtonPO.odd.getText()).toBe("2.22");
        expect(await secondBetButtonPO.secondaryLabel.getText()).toBe("Squad 2");
        expect(await secondBetButtonPO.odd.getText()).toBe("6.5");
      });

      describe("When I click on Edit Squad 1 link", () => {
        beforeAll(async () => {
          await firstEditSquadLinkPO.element.click();
          await mockService.mockHttpRequest(getObbEventParticipants(eventParticipants));
          await browser.waitUntilDisplayed(obbSquadVsSquadPlayerPickerPO.element);
        });

        it("[PRPI-7149] should display the player picker modal", async () => {
          expect(await obbSquadVsSquadPlayerPickerPO.element.isDisplayed()).toBe(true);
        });

        it("[PRPI-7150] display a list of players", async () => {
          expect(await obbSquadVsSquadPlayerPickerPO.playersList.isDisplayed()).toBe(true);
          expect(await obbSquadVsSquadPlayerPickerPO.playersRows.length).toBe(6);
        });

        it("[PRPI-7151] should highlight the selected players for Squad 1", async () => {
          expect(await firstHighlightedObbPlayersRowCard.playerCardName.getText()).toBe("COLE\nPALMER");
          expect(await secondHighlightedObbPlayersRowCard.playerCardName.getText()).toBe("NICOLAS\nJACKSON");
        });

        it("[PRPI-7152] should disabled the selected players for Squad 2", async () => {
          expect(await firstDisabledObbPlayersRowCardFirstName.element.getText()).toBe("OSMANDE");
          expect(await secondDisabledObbPlayersRowCardFirstName.element.getText()).toBe("LUIS");
        });
      });

      describe("When I click on a unselected player", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getObbQuotes(modalQuotes));
          await obbSquadVsSquadPlayerPickerPO.playersRows[2].click();
          await browser.waitUntilDisplayed(thirdHighlightedObbPlayersRowCard.element);
        });

        it("[PRPI-7153] should select the player and update the quote", async () => {
          expect(await obbSquadVsSquadPlayerPickerPO.playersRowHighlighted.length).toBe(3);
          expect(await thirdHighlightedObbPlayersRowCard.playerCardName.getText()).toBe("RADAMEL\nFALCAO");
        });
      });

      describe("When I click on the save changes button", () => {
        beforeAll(async () => {
          await saveChangeButtonPO.element.click();
          await browser.waitUntilDisplayed(obbSquadVsSquadCardPO.firstBetButton);
        });

        it("[PRPI-7154] should update the squad 1 players", async () => {
          expect(await firstMicroPlayerPO.microPlayerNameContainer.getText()).toBe(
            "Cole Palmer, Nicolas Jackson, Radamel Falcao",
          );
        });

        it("[PRPI-7155] should update the odds on the bet buttons", async () => {
          expect(await firstButtonPO.odd.getText()).toBe("3.01");
          expect(await secondBetButtonPO.odd.getText()).toBe("1.5");
        });
      });

      describe("When I click on the Squad 1 bet button", () => {
        beforeAll(async () => {
          await firstButtonPO.element.click();
          await browser.waitUntilDisplayed(betDetailsPO.element);
        });

        it("[PRPI-7156] should add the selection to the bet slip", async () => {
          expect(await betDetailsPO.title.getText()).toBe("Cole Palmer, Nicolas Jackson & Radamel Falcao");
        });
      });

      describe("When I enter a stake and place bet", () => {
        beforeAll(async () => {
          await stakeInputField.setValue("1");
          await placeButton.element.click();
          await browser.waitUntilDisplayed(receiptTitle);
        });

        it("[PRPI-7157] then the bet is played successfully", async () => {
          expect(await receiptTitle.getText()).toContain("Bet Placed");
        });

        it("[PRPI-7158] and receipt is displayed", async () => {
          expect(await singleSelectionPO.title.getText()).toBe("Cole Palmer, Nicolas Jackson & Radamel Falcao");
          expect(await singleSelectionPO.subtitle.getText()).toContain(
            "To Score More Goals Than Osmande Diomande & Luis Suarez - North Macedonia v Latvia",
          );
        });
      });
    });
  });
});
