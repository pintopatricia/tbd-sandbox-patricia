const {
  ObbPvpCardPO,
  SportsbookBetButtonPO,
  PrimaryButtonPO,
  BetslipDrawerPO,
  ObbCardGroupPO,
  ObbSectionPO,
  SportsbookPlacePanelPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  PNLAndWhatIfPO,
  MinimizedPO,
} = require("../../../../page-objects");
const {
  getEventLayout,
  getObbImply,
  getObbQuotes,
  getObbPlaceBets,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const routes = require("../../../../../utils/routes");

const cardGroupPO = new ObbCardGroupPO();
const obbSectionPO = new ObbSectionPO(cardGroupPO.sections[0]);
const shotsPvpCardPo = new ObbPvpCardPO(obbSectionPO.pvpCards[0]);
const goalsPvpCardPO = new ObbPvpCardPO(obbSectionPO.pvpCards[1]);
const betslipDrawerPO = new BetslipDrawerPO();
const minimizedPO = new MinimizedPO();

// OBB PLACE
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);

// OBB MULTIPLES
const multipleControlsPO = new BetControlsPO(sportsbookPlacePanelPO.collapsableSections[0]);
const stakeInputFieldPO = new CurrencyNumberInputFieldPO(multipleControlsPO.currencyInput);
const multipleReturnValuesPO = new PNLAndWhatIfPO(multipleControlsPO.returnsValueContainer);

// OBB PVP BET BUTTONS
const shotsPvpCardFirstBetButton = new SportsbookBetButtonPO(shotsPvpCardPo.firstBetButton);
const goalsPvpCardSecondBetButton = new SportsbookBetButtonPO(goalsPvpCardPO.secondBetButton);

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
                name: "North Macedonia v Latvia",
                openDate: "1985-02-05T19:30:00.000Z",
                eventId: 33755137,
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
                              maxCardsToDisplay: 5,
                              urn: "ppb:obb:cardslayout:stacked:ZylnFBIAAB8AKIpz/obb_cards_layout$b65dbf9d-53fd-4969-83ee-f59b444ec72a/e/33755137",
                              cards: {
                                edges: [
                                  {
                                    node: {
                                      __typename: "ObbPvpCard",
                                      urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU/e/33755137",
                                      title: { __typename: "DisplayNameTitle", name: "Title" },
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
                                          urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                          player: {
                                            id: "11111",
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
                                          urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                          player: {
                                            id: "22222",
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
                                          urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                          player: {
                                            id: "33333",
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
                                              urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                            },
                                            participantIdB: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                            },
                                            outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
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
                                            urn: "ppb:event:33755137",
                                            name: " North Macedonia v Latvia",
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
                                              urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                            },
                                            participantIdB: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                            },
                                            outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 1.67,
                                              fractional: {
                                                numerator: 4,
                                                denominator: 6,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "ObbOdds",
                                            },
                                          },
                                          event: {
                                            urn: "ppb:event:33755137",
                                            name: " North Macedonia v Latvia",
                                            __typename: "SportsEvent",
                                          },
                                        },
                                      ],
                                    },
                                    __typename: "ObbCardEdge",
                                  },
                                  {
                                    node: {
                                      __typename: "ObbPvpCard",
                                      urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdiU/e/33755137",
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
                                          urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                          player: {
                                            id: "11111",
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
                                          urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                          player: {
                                            id: "22222",
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
                                          urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                          player: {
                                            id: "33333",
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
                                      ],

                                      participantInfo: {
                                        name: "This season's average stats per game for the selected competition.",
                                        __typename: "DisplayNameTitle",
                                      },
                                      incidentType: {
                                        id: "GOALS_TIME_ADJUSTED",
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
                                              urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                            },
                                            participantIdB: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                            },
                                            outcomeId: "GOALS_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
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
                                            urn: "ppb:event:33755137",
                                            name: " North Macedonia v Latvia",
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
                                              urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                            },
                                            participantIdB: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                            },
                                            outcomeId: "GOALS_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 1.67,
                                              fractional: {
                                                numerator: 4,
                                                denominator: 6,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "ObbOdds",
                                            },
                                          },
                                          event: {
                                            urn: "ppb:event:33755137",
                                            name: " North Macedonia v Latvia",
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
        id: "3b87e9a4d983e8f8",
        price: {
          decimal: 9.1,
          fractional: {
            numerator: 21,
            denominator: 10,
            __typename: "FractionalOdds",
          },
          __typename: "SportsbookOdds",
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
    ],
  },
};

const firstImplyBetsResponse = {
  betDefinitions: [
    {
      id: "529aedc4c4fbc0b0",
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
          decimal: 9.1,
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

const secondImplyBetsResponse = {
  betDefinitions: [
    {
      id: "529aedc4c4fbc0b0",
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
          decimal: 9.1,
        },
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
    {
      id: "43776dd42d290040",
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
          decimal: 9.1,
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
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantIdA: "22222",
                  participantIdB: "11111",
                  __typename: "Params",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
              {
                params: {
                  outcomeId: "GOALS_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantIdA: "11111",
                  participantIdB: "22222",
                  __typename: "Params",
                },
                templateId: "playerVsPlayer",
                __typename: "BaseBet",
              },
            ],

            x: 2,
            __typename: "ExpressionParams",
          },
          betDefinitions: ["529aedc4c4fbc0b0", "43776dd42d290040"],
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
      id: "SINGLE:[a81efe0f6f5e410]",
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
        stake: 0.1,
        stakePerLine: 0.1,
        potentialPayout: 0.75,
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

const BFF_MOCK = {
  urn: bffResponse.data.View.urn,
  url: bffResponse.data.View.url,
  sportevent: bffResponse.data.View.sportevent,
  edges: bffResponse.data.View.items.edges,
  partialEdges: bffResponse.data.View.partialItems.edges,
};
const MODULE_NAME = "obb_pvp_betslip_multiples_place_receipt";

describe("OBB - Mutiples - Place and receipt", () => {
  describe("when placing a multiple bet with success", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(eventLayout);
      await mockService.mockHttpRequest(getObbQuotes(legsQuotes));
      await mockService.mockHttpRequest(getObbImply(firstImplyBetsResponse));
      await mockService.mockHttpRequest(getObbImply(secondImplyBetsResponse));
      await mockService.mockHttpRequest(getObbPlaceBets(placeBetsResponse));

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);

      // waiting for the first pvp card to show up
      await browser.waitUntilDisplayed(shotsPvpCardPo.playerContainer);

      // adding a selection from the first pvp card (shots)
      await shotsPvpCardFirstBetButton.element.click();
      await browser.waitUntilDisplayed(placeButtonPO.label);

      // closing betslip and adding a selection in the second pvp card (goals)
      await betslipDrawerPO.header.click();
      await goalsPvpCardSecondBetButton.element.scrollIntoView({ block: "center" });
      await goalsPvpCardSecondBetButton.element.click();

      // expanding betslip
      await minimizedPO.title.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
    });

    describe("and when I enter stake for the multiple", () => {
      beforeAll(async () => {
        await stakeInputFieldPO.element.waitForClickable();
        await stakeInputFieldPO.element.click();
        await stakeInputFieldPO.setValue("22");
      });

      it("[PRPI-1643] returns should be updated for the multiple bet", async () => {
        expect(await multipleReturnValuesPO.pnl.getText()).toBe("$165.00");
        expect(await placeButtonPO.label.getText()).toBe("Place $22.00 Bet");
      });

      describe("and when I place the multiple bet", () => {
        beforeAll(async () => {
          await placeButtonPO.element.click();
          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1479]_should_see_multiples_receipt`);
        });

        it("[PRPI-1479]_should_see_multiples_receipt", async () => {
          expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1479]_should_see_multiples_receipt`)).toBe(0);
        });
      });
    });
  });
});
