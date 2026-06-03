const {
  getEventLayout,
  getHomeLayoutWithViewLink,
  getObbQuotes,
  getObbImply,
  getObbPlaceBets,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;

const {
  ObbPvpCardSO,
  SportsbookBetButtonSO,
  PrimaryButtonSO,
  BetslipDrawerSO,
  SportsbookPlacePanelSO,
  BetControlsSO,
  CurrencyNumberInputFieldSO,
  MinimizedSO,
  ObbPlayerGridSO,
  ObbPlayersListCardSO,
  SettlementConditionCardSO,
  SliderSO,
  SportsbookReceiptPanelSO,
} = require("../../../../screen-objects");

const { swipeUpElement, swipeDownElementFullscreen } = require("../../../../helpers/gestures");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
//OBB PVP CARD
const obbPvPCardSO = new ObbPvpCardSO();
const firstBetButtonSO = new SportsbookBetButtonSO(obbPvPCardSO.addButtons[0]);
const obbPlayersGridSO = new ObbPlayerGridSO();

// OBB OBB PLAYERS LIST
const firstObbPlayerListCardSO = new ObbPlayersListCardSO(obbPlayersGridSO.selectedPlayer[0]);
const fourthObbPlayerListCardSO = new ObbPlayersListCardSO(obbPlayersGridSO.selectedPlayer[3]);

// OBB PLACE
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const settlementConditionCardSO = new SettlementConditionCardSO();
const sliderSO = new SliderSO(settlementConditionCardSO.container);
const placeButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.place);
const receiptPanelSO = new SportsbookReceiptPanelSO();

// OBB MULTIPLE
const multipleControlsSO = new BetControlsSO(sportsbookPlacePanelSO.collapsableSections[0]);
const stakeInputFieldSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);

const MODULE_NAME = "obb_xofn_multiples_betslip_and_receipt";

const mockService = new MockService();

const EVENT_ID = "33755137";
const EVENT_OPEN_DATE = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

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
                name: "North Macedonia v Latvia",
                openDate: EVENT_OPEN_DATE,
                eventId: 33755137,
              },
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
                                      __typename: "ObbPvpCard",
                                      urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU/e/33755137",
                                      title: { name: "Title" },
                                      event: { urn: "ppb:event:33755137", __typename: "SportsEvent" },
                                      teams: {
                                        home: {
                                          id: 56085,
                                          name: "North Macedonia",
                                          color: null,
                                          crest: null,
                                          squad: null,
                                        },
                                        away: {
                                          id: 56086,
                                          name: "Latvia",
                                          color: null,
                                          crest: null,
                                          squad: null,
                                        },
                                      },
                                      participants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:86724/e/33755137",
                                          player: {
                                            id: "86724",
                                            name: "Cole Palmer",
                                            position: null,
                                            seasonStats: {
                                              averages: {
                                                goals: 0.61,
                                                redCards: 0,
                                                yellowCards: 0.23,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.31,
                                                totalShots: 3.31,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: 56085,
                                            name: "North Macedonia",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:102114/e/33755137",
                                          player: {
                                            id: "102114",
                                            name: "Nicolas Jackson",
                                            position: null,
                                            seasonStats: {
                                              averages: {
                                                goals: 0.61,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.54,
                                                totalShots: 2.38,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: 56085,
                                            name: "North Macedonia",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:102115/e/33755137",
                                          player: {
                                            id: "102115",
                                            name: "Radamel Falcao",
                                            position: null,
                                            seasonStats: {
                                              averages: {
                                                goals: 0.1,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.22,
                                                totalShots: 1.54,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: 56085,
                                            name: "North Macedonia",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:102198/e/33755137",
                                          player: {
                                            id: "102198",
                                            name: "Luis Suárez",
                                            position: null,
                                            seasonStats: {
                                              averages: {
                                                goals: 0.4,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 2,
                                                totalShots: 4,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: 56085,
                                            name: "North Macedonia",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                      ],

                                      participantInfo: {
                                        name: "This season's average stats per game for the selected competition.",
                                        __typename: "DisplayNameTitle",
                                      },
                                      incidentType: {
                                        id: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                                        __typename: "ObbIncidentType",
                                      },
                                      defaultLegs: [
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "playerVsPlayer",
                                          templateParams: {
                                            __typename: "ObbPvpParams",
                                            participantIdA: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:102114/e/33755137",
                                            },
                                            participantIdB: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:86724/e/33755137",
                                            },
                                            outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 2,
                                              fractional: {
                                                numerator: 1,
                                                denominator: 1,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "SportsbookOdds",
                                            },
                                          },
                                          event: {
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
                                            eventId: 33755137,
                                            __typename: "SportsEvent",
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "playerVsPlayer",
                                          templateParams: {
                                            __typename: "ObbPvpParams",
                                            participantIdA: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:86724/e/33755137",
                                            },
                                            participantIdB: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:102114/e/33755137",
                                            },
                                            outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 2,
                                              fractional: {
                                                numerator: 1,
                                                denominator: 1,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "SportsbookOdds",
                                            },
                                          },
                                          event: {
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
                                            eventId: 33755137,
                                            __typename: "SportsEvent",
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

const legsQuotes = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
    },
    prices: [
      {
        id: "6ea4f9a07f56312c",
        price: {
          decimal: 9.1,
          fractional: {
            numerator: 21,
            denominator: 10,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
    ],
  },
};

const playersQuotes = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
    },
    prices: [
      {
        id: "6ea4f9a07f56312c",
        price: {
          decimal: 9.1,
          fractional: {
            numerator: 21,
            denominator: 10,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
      {
        id: "254b317f53db4c67",
        price: {
          decimal: 2.0,
          fractional: {
            numerator: 2,
            denominator: 1,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
      {
        id: "919bcf38ef1eccda",
        result: {
          resultCode: "IMPOSSIBLE_OBB_CHOICE",
        },
      },
      {
        id: "919bcf38ef1eccda",
        result: {
          resultCode: "IMPOSSIBLE_OBB_CHOICE",
        },
      },
      {
        id: "ad3d62d335c39f60",
        price: {
          decimal: 1.1,
          fractional: {
            numerator: 11,
            denominator: 10,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
      {
        id: "4b035608d45cbb24",
        price: {
          decimal: 3,
          fractional: {
            numerator: 3,
            denominator: 1,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
      {
        id: "ee82a428afcfd878",
        price: {
          decimal: 7.3,
          fractional: {
            numerator: 73,
            denominator: 10,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
      {
        id: "c35ff564906e8f8f",
        price: {
          decimal: 2.7,
          fractional: {
            numerator: 27,
            denominator: 10,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
    ],
  },
};

const implyBetsResponse = {
  betDefinitions: [
    {
      id: "6ea4f9a07f56312c",
      details: {
        minStake: 0.1,
        maxStake: 200,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          decimal: 9.1,
          fractional: {
            numerator: 21,
            denominator: 10,
          },
        },
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
  ],

  combinedBetDefinitions: [],
  result: {
    resultCode: "SUCCESS",
    errorDetails: null,
  },
};

const implyBetsResponseWithTwoLegMultiple = {
  betDefinitions: [
    {
      id: "6ea4f9a07f56312c",
      details: {
        minStake: 0.1,
        maxStake: 200,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          decimal: 9.1,
          fractional: {
            numerator: 21,
            denominator: 10,
          },
        },
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
    {
      id: "ee82a428afcfd878",
      details: {
        minStake: 0.1,
        maxStake: 200,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          decimal: 7.3,
          fractional: {
            numerator: 73,
            denominator: 10,
          },
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
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
            {
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
          ],

          expressionParams: {
            baseBets: [
              {
                params: {
                  participantIdA: "102114",
                  participantIdB: "86724",
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
              {
                params: {
                  participantIdA: "102114",
                  participantIdB: "102198",
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
            ],

            x: 2,
            __typename: "ExpressionParams",
          },
          betDefinitions: ["6ea4f9a07f56312c", "ee82a428afcfd878"],
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
          decimal: 3.5,
          fractional: {
            numerator: 7,
            denominator: 2,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        __typename: "ImplyDetails",
      },
      __typename: "CombinedBetDefinitionResult",
    },
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
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
            {
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
          ],

          expressionParams: {
            baseBets: [
              {
                params: {
                  participantIdA: "102114",
                  participantIdB: "86724",
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
              {
                params: {
                  participantIdA: "102114",
                  participantIdB: "102198",
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
            ],

            x: 1,
            __typename: "ExpressionParams",
          },
          betDefinitions: ["6ea4f9a07f56312c", "ee82a428afcfd878"],
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
          decimal: 1.5,
          fractional: {
            numerator: 3,
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

const implyBetsResponseWithThreeLegMultiple = {
  betDefinitions: [
    {
      id: "6ea4f9a07f56312c",
      details: {
        minStake: 0.1,
        maxStake: 200,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          decimal: 9.1,
          fractional: {
            numerator: 21,
            denominator: 10,
          },
        },
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
    {
      id: "ee82a428afcfd878",
      details: {
        minStake: 0.1,
        maxStake: 200,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          decimal: 7.3,
          fractional: {
            numerator: 73,
            denominator: 10,
          },
        },
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
    {
      id: "ad3d62d335c39f60",
      details: {
        minStake: 0.1,
        maxStake: 200,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          decimal: 1.1,
          fractional: {
            numerator: 11,
            denominator: 10,
          },
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
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
            {
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
            {
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
          ],

          expressionParams: {
            baseBets: [
              {
                params: {
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantIdA: "102114",
                  participantIdB: "86724",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
              {
                params: {
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantIdA: "102114",
                  participantIdB: "102198",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
              {
                params: {
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantIdA: "102114",
                  participantIdB: "102115",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
            ],

            x: 3,
            __typename: "ExpressionParams",
          },
          betDefinitions: ["6ea4f9a07f56312c", "ee82a428afcfd878", "ad3d62d335c39f60"],
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
          decimal: 4.5,
          fractional: {
            numerator: 9,
            denominator: 2,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        __typename: "ImplyDetails",
      },
      __typename: "CombinedBetDefinitionResult",
    },
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
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
            {
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
            {
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
          ],

          expressionParams: {
            baseBets: [
              {
                params: {
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantIdA: "102114",
                  participantIdB: "86724",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
              {
                params: {
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantIdA: "102114",
                  participantIdB: "102198",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
              {
                params: {
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantIdA: "102114",
                  participantIdB: "102115",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
            ],

            x: 2,
            __typename: "ExpressionParams",
          },
          betDefinitions: ["6ea4f9a07f56312c", "ee82a428afcfd878", "ad3d62d335c39f60"],
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
          decimal: 3.5,
          fractional: {
            numerator: 7,
            denominator: 2,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        __typename: "ImplyDetails",
      },
      __typename: "CombinedBetDefinitionResult",
    },
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
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
            {
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
            {
              expressionTemplateId: "playerVsPlayer",
              __typename: "BaseExpressionTemplateDefinitions",
            },
          ],

          expressionParams: {
            baseBets: [
              {
                params: {
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantIdA: "102114",
                  participantIdB: "86724",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
              {
                params: {
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantIdA: "102114",
                  participantIdB: "102198",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
              {
                params: {
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantIdA: "102114",
                  participantIdB: "102115",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
            ],

            x: 1,
            __typename: "ExpressionParams",
          },
          betDefinitions: ["6ea4f9a07f56312c", "ee82a428afcfd878", "ad3d62d335c39f60"],
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
          decimal: 1.5,
          fractional: {
            numerator: 3,
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

const betslipQuotesResponse = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
    },
    prices: [
      {
        id: "6ea4f9a07f56312c",
        price: {
          decimal: 9.1,
          fractional: {
            numerator: 21,
            denominator: 10,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
      {
        id: "ee82a428afcfd878",
        price: {
          decimal: 7.3,
          fractional: {
            numerator: 73,
            denominator: 10,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
      {
        id: "ad3d62d335c39f60",
        price: {
          decimal: 1.1,
          fractional: {
            numerator: 11,
            denominator: 10,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
      {
        id: "7640fa2faf734197",
        price: {
          decimal: 4.5,
          fractional: {
            numerator: 9,
            denominator: 2,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
      {
        id: "178bc8e9d8e1b62e",
        price: {
          decimal: 3.5,
          fractional: {
            numerator: 7,
            denominator: 2,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
      {
        id: "7be207703fd64cbf",
        price: {
          decimal: 1.5,
          fractional: {
            numerator: 3,
            denominator: 2,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
    ],
  },
};

const placeBetsResponse = {
  betPlacementsResult: [
    {
      id: "SINGLE:[178bc8e9d8e1b62e]",
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
          decimal: 3.5,
          fractional: {
            numerator: 7,
            denominator: 2,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        stake: 1,
        stakePerLine: 1,
        potentialPayout: 3.5,
        currency: "EUR",
        outcomeBasedLegs: [
          {
            price: {
              decimal: 3.5,
              fractional: {
                numerator: 7,
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

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "123" }];

const BFF_MOCK = responseToTemplate(bffResponse);

describe("OBB - xOfN Multiples Betslip and Receipt", () => {
  describe("Given I'm on OBB Pvp Card and I add 3 selections to the betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getObbQuotes(legsQuotes));
      await mockService.mockHttpRequest(getObbImply(implyBetsResponse));
      await mockService.mockHttpRequest(getObbPlaceBets(placeBetsResponse));
      await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));

      const url = `sport/competition/event/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(obbPvPCardSO.playersContainer);

      // The first bet button is clicked to add a selection to the betslip
      await firstBetButtonSO.element.click();
      await browser.waitUntilDisplayed(betslipDrawerSO.element);

      // The betslip is minimized to be able to see the card again
      await betslipDrawerSO.header.click();

      // Now the second player is changed to create a new leg
      await mockService.mockHttpRequest(getObbQuotes(playersQuotes));
      await obbPvPCardSO.secondPlayerContainer.click();
      await browser.waitUntilDisplayed(firstObbPlayerListCardSO.element);
      await firstObbPlayerListCardSO.element.click();

      await browser.waitUntilDisplayed(obbPvPCardSO.playersContainer);

      // The first bet button is clicked to add the second selection to the betslip
      await mockService.mockHttpRequest(getObbImply(implyBetsResponseWithTwoLegMultiple));
      await firstBetButtonSO.element.click();
      await browser.waitUntil(async () => (await minimizedSO.counter.getText()) === "2");

      // Once again, the second player is changed to another one that was not selected yet
      await mockService.mockHttpRequest(getObbQuotes(playersQuotes));
      await obbPvPCardSO.secondPlayerContainer.click();
      await browser.waitUntilDisplayed(fourthObbPlayerListCardSO.element);
      await fourthObbPlayerListCardSO.element.click();

      // Finally, the third selection is added to the betslip
      await browser.waitUntilDisplayed(obbPvPCardSO.playersContainer);
      await mockService.mockHttpRequest(getObbImply(implyBetsResponseWithThreeLegMultiple));
      await firstBetButtonSO.element.click();
      await browser.waitUntil(async () => (await minimizedSO.counter.getText()) === "3");

      // The betslip is opened, having three single selections and a multiple with a slider
      await mockService.mockHttpRequest(getObbQuotes(betslipQuotesResponse));
      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(betslipDrawerSO.content);

      // The slider is changed to the second position, making it 2 of 3 selections
      await swipeDownElementFullscreen(settlementConditionCardSO.element);
      await browser.waitUntilClickableNative(sliderSO.minusButton);
      await sliderSO.minusButton.click();
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4873]_should_render_the_multiple_with_the_slider_in_the_correct_position`,
      );
    });

    it("[PRPI-4873]_should_render_the_multiple_with_the_slider_in_the_correct_position", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4873]_should_render_the_multiple_with_the_slider_in_the_correct_position`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });

    describe("And I place the multiple bet", () => {
      beforeAll(async () => {
        // Swipe up to see the stake input field
        await swipeUpElement(sportsbookPlacePanelSO.collapsableSections[0], 400);
        // The stake is added and the bet is placed
        await stakeInputFieldSO.numberField.setValue("1");
        await browser.waitUntilClickableNative(placeButtonSO.element);
        await placeButtonSO.element.click();
        await browser.waitUntilDisplayed(receiptPanelSO.element);
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4874]_should_render_the_receipt_with_the_multiple`);
      });

      it("[PRPI-4874]_should_render_the_receipt_with_the_multiple", async () => {
        expect(
          (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4874]_should_render_the_receipt_with_the_multiple`))
            .misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
