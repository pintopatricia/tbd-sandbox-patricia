const {
  getEventLayout,
  getObbImply,
  getObbQuotes,
  getObbPlaceBets,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const {
  ObbBetButtonsCarouselPO,
  SportsbookBetButtonPO,
  BetDetailsPO,
  ScrollableSwimlanePO,
  BetslipDrawerPO,
  MinimizedPO,
  CardPO,
  SportsbookPlacePanelPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  ReceiptTitlePO,
} = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const obbBetButtonsCarouselPO = new ObbBetButtonsCarouselPO();
const bettingButtons = obbBetButtonsCarouselPO.betButtons;
const firstBetButton = new SportsbookBetButtonPO(bettingButtons[0]);
const lastBetButton = new SportsbookBetButtonPO(bettingButtons[4]);
const { carouselArrow } = obbBetButtonsCarouselPO;
const scrollableSwimlanePO = new ScrollableSwimlanePO();
const betslipDrawerPO = new BetslipDrawerPO();
const betDetailsPO = new BetDetailsPO();
const mockService = new MockService();
const minimizedPO = new MinimizedPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const multiplesCardPO = new CardPO(sportsbookPlacePanelPO.collapsableSections[0]);
const stakeInputField = new CurrencyNumberInputFieldPO();
const placeButton = new PrimaryButtonPO();
const receiptTitle = new ReceiptTitlePO().element;

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
                              title: {
                                __typename: "DisplayNameTitle",
                                name: "Stacked title 1",
                              },
                              urn: "ppb:obb:cardslayout:stacked:ZylnFBIAAB8AKIpz/obb_cards_layout$b65dbf9d-53fd-4969-83ee-f59b444ec72a/e/33755137",
                              cards: {
                                edges: [
                                  {
                                    node: {
                                      __typename: "ObbSquadBetCard",
                                      urn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/33755137",
                                      title: {
                                        __typename: "DisplayNameTitle",
                                        name: "Race To X Points",
                                      },
                                      outcomesLabel: {
                                        __typename: "DisplayNameTitle",
                                        name: "Race To X Points",
                                      },
                                      statsLabel: {
                                        __typename: "DisplayNameTitle",
                                        name: "Race To X Points",
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
                                            name: "Cristiano Ronaldo",
                                            position: null,
                                            seasonStats: {
                                              matchesPlayed: 45,
                                              averages: {
                                                goals: 0.9,
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
                                          urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                          player: {
                                            id: "55555",
                                            name: "Lionel Messi",
                                            position: null,
                                            seasonStats: {
                                              matchesPlayed: 45,
                                              averages: {
                                                goals: 0.9,
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
                                      ],

                                      squadParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                        },
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
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS"],
                                            value: 1,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 1.25,
                                              fractional: {
                                                numerator: 1,
                                                denominator: 200,
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
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS"],
                                            value: 2,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 3.5,
                                              fractional: {
                                                numerator: 5,
                                                denominator: 2,
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
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS"],
                                            value: 3,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 6.0,
                                              fractional: {
                                                numerator: 5,
                                                denominator: 1,
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
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS"],
                                            value: 4,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 10.0,
                                              fractional: {
                                                numerator: 9,
                                                denominator: 1,
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
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS"],
                                            value: 5,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 20,
                                              fractional: {
                                                numerator: 1,
                                                denominator: 200,
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
                                      ],

                                      defaultOutcomeIndex: 0,
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

const legsQuotes = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
      __typename: "EventId",
    },
    prices: [
      {
        id: "2fc2033c8e92bafe",
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
        id: "e45efc686003c720",
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

const firstImplyBetsResponse = {
  betDefinitions: [
    {
      id: "2fc2033c8e92bafe",
      details: {
        minStake: 0.1,
        maxStake: 200000,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        currency: "GBP",
        price: {
          decimal: 1.25,
          fractional: {
            numerator: 1,
            denominator: 200,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        __typename: "ImplyDetails",
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
        __typename: "ObbResult",
      },
      __typename: "BetDefinitionResult",
    },
  ],

  combinedBetDefinitions: [],
  __typename: "ImplyBetsResponse",
};

const secondImplyBetsResponse = {
  betDefinitions: [
    {
      id: "2fc2033c8e92bafe",
      details: {
        minStake: 0.1,
        maxStake: 11.83,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          fractional: {
            numerator: 21,
            denominator: 10,
          },
          decimal: 1.25,
        },
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
    {
      id: "e45efc686003c720",
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
              expressionTemplateId: "participantsCombined",
              __typename: "BaseExpressionTemplateDefinitions",
            },
            {
              expressionTemplateId: "participantsCombined",
              __typename: "BaseExpressionTemplateDefinitions",
            },
          ],

          expressionParams: {
            baseBets: [
              {
                params: {
                  outcomeIds: ["GOALS"],
                  timePeriodId: "MATCH",
                  participantIds: ["11111", "22222", "33333", "44444", "55555"],
                  value: 5,
                  quantifier: "AT_LEAST",
                },
                templateId: "participantsCombined",
                __typename: "BaseBet",
              },
              {
                params: {
                  outcomeIds: ["GOALS"],
                  timePeriodId: "MATCH",
                  participantIds: ["11111", "22222", "33333", "44444", "55555"],
                  value: 1,
                  quantifier: "AT_LEAST",
                },
                templateId: "participantsCombined",
                __typename: "BaseBet",
              },
            ],

            x: 2,
            __typename: "ExpressionParams",
          },
          betDefinitions: ["2fc2033c8e92bafe", "e45efc686003c720"],
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

const placeBetsResponse = {
  betPlacementsResult: [
    {
      id: "SINGLE:[96b40458f3ad64fb]",
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

function responseToTemplate(json) {
  return {
    urn: json.data.View.urn,
    url: json.data.View.url,
    sportevent: json.data.View.sportevent,
    edges: json.data.View.items.edges,
    partialEdges: json.data.View.partialItems.edges,
  };
}

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "20" }];

const BFF_MOCK = responseToTemplate(bffResponse);

describe("OBB - Squad Bet - Multiple Bet", () => {
  describe("when placing an OBB bet on a squad bet card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);

      await mockService.mockHttpRequest(eventLayout);
      await mockService.mockHttpRequest(getObbImply(firstImplyBetsResponse));
      await mockService.mockHttpRequest(getObbImply(secondImplyBetsResponse));
      await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
      await mockService.mockHttpRequest(getObbQuotes(legsQuotes));
      await mockService.mockHttpRequest(getObbPlaceBets(placeBetsResponse));

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);

      await browser.waitUntilDisplayed(obbBetButtonsCarouselPO.element);
      await browser.waitUntilDisplayed(firstBetButton.element);
    });

    describe("when I click on a bet button", () => {
      beforeAll(async () => {
        await firstBetButton.element.click();
        await browser.waitUntilDisplayed(betDetailsPO.element);
      });

      it("[PRPI-7127] should have the bet button in selected state", async () => {
        expect(await browser.containsClass(firstBetButton.element, SportsbookBetButtonPO.states.selected)).toBe(true);
      });

      it("[PRPI-7128] should have the player list with more then 4 players", async () => {
        expect(await betDetailsPO.title.getText()).toBe(
          "Cole Palmer, Nicolas Jackson, Radamel Falcao, Cristiano Ronaldo & Lionel Messi",
        );
      });
    });

    describe("when I scroll through the player list", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.click();
        await browser.waitUntilDisplayed(scrollableSwimlanePO.element);
        await scrollableSwimlanePO.scrollItems[4].scrollIntoView({ block: "center" });
        await scrollableSwimlanePO.scrollItems[4].isDisplayedInViewport();
      });

      it("[PRPI-7129] should have the list of players showing a new player on the right", async () => {
        expect(await scrollableSwimlanePO.scrollItems.length).toBeGreaterThan(4);
        expect(await scrollableSwimlanePO.scrollItems[4].isDisplayedInViewport()).toBe(true);
      });

      it("[PRPI-7130] should not have the first player on the list", async () => {
        expect(await scrollableSwimlanePO.scrollItems[0].isDisplayedInViewport()).toBe(false);
      });
    });

    describe("when I press the arrow on the bet buttons", () => {
      beforeAll(async () => {
        await carouselArrow[1].click();
        await browser.waitUntil(
          async () =>
            (await bettingButtons[4].isDisplayedInViewport()) && !(await bettingButtons[0].isDisplayedInViewport()),
          { timeout: 10000, timeoutMsg: "Betting buttons did not update correctly" },
        );
      });

      it("[PRPI-7131] should have a new bet button on the right", async () => {
        expect(await bettingButtons[4].isDisplayedInViewport()).toBe(true);
      });

      it("[PRPI-7132] should not have the first bet button on the list", async () => {
        expect(await bettingButtons[0].isDisplayedInViewport()).toBe(false);
      });
    });

    describe("when I click on other bet button and add a new selection to betslip", () => {
      beforeAll(async () => {
        await lastBetButton.element.click();
      });

      it("[PRPI-7133] should have the bet button with selected state", async () => {
        expect(await browser.containsClass(lastBetButton.element, SportsbookBetButtonPO.states.selected)).toBe(true);
      });

      it("[PRPI-7134] should add the selection to the betslip", async () => {
        await browser.waitUntilDisplayed(minimizedPO.element);
        await minimizedPO.title.click();
        const multiplesText = await multiplesCardPO.element.getText();

        expect(multiplesText).toContain(
          "Cole Palmer, Nicolas Jackson, Radamel Falcao, Cristiano Ronaldo & Lionel Messi",
        );

        expect(multiplesText).toContain("5+ Goals Between Them");
      });

      it("[PRPI-7135] should have the multiple section displayed", async () => {
        expect(await multiplesCardPO.header.getText()).toBe("MULTIPLES");
      });
    });

    describe("when I enter a stake and I click on the place button", () => {
      beforeAll(async () => {
        await stakeInputField.setValue("1");
        await placeButton.element.click();
        await browser.waitUntilDisplayed(receiptTitle);
      });

      it("[PRPI-7136] should place the bet successfully", async () => {
        const receiptTitleText = await receiptTitle.getText();

        expect(receiptTitleText).toBe("Bet Placed");
      });

      it("[PRPI-7137] should display the receipt", async () => {
        expect(await receiptTitle.isDisplayed()).toBe(true);
      });
    });
  });
});
