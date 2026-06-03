const {
  ObbPvpCardPO,
  ObbCardGroupPO,
  ObbSectionPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  BetslipDrawerPO,
  ObbSingleCardPO,
  BetControlsPO,
  MinimizedPO,
  SportsbookPlacePanelPO,
  BetDetailsPO,
  SportsbookReceiptPanelPO,
} = require("../../../../page-objects");
const {
  getEventLayout,
  getObbImply,
  getObbPlaceBets,
  getObbQuotes,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { addStake } = require("../../../../helpers/betslip.util");

const cardGroupPO = new ObbCardGroupPO();
const obbSectionPO = new ObbSectionPO(cardGroupPO.sections[0]);
const shotsPvpCardPO = new ObbPvpCardPO(obbSectionPO.pvpCards[0]);
const goalsPvpCardPO = new ObbPvpCardPO(obbSectionPO.pvpCards[1]);
const betslipDrawerPO = new BetslipDrawerPO();
const minimizedPO = new MinimizedPO();

const receiptPanelPO = new SportsbookReceiptPanelPO();

// OBB PLACE

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);

const firstSingle = new ObbSingleCardPO(sportsbookPlacePanelPO.obbSingles[0]);
const secondSingle = new ObbSingleCardPO(sportsbookPlacePanelPO.obbSingles[1]);

const firstSingleDetails = new BetDetailsPO(firstSingle.element);
const secondSingleDetails = new BetDetailsPO(secondSingle.element);

const firstSingleBetControls = new BetControlsPO(firstSingle.element);
const firstSingleStakeInput = new CurrencyNumberInputFieldPO(firstSingleBetControls.currencyInput);

const secondBetControls = new BetControlsPO(secondSingle.element);
const secondSingleStakeInput = new CurrencyNumberInputFieldPO(secondBetControls.currencyInput);

const mockService = new MockService();
const EVENT_ID = "33755137";
const MODULE_NAME = "obb_betslip_receipt";

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
      __typename: "EventId",
    },
    prices: [
      {
        id: "5a9188dfc64ff8f1",
        price: {
          decimal: 9.1,
          fractional: {
            numerator: 21,
            denominator: 10,
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
        id: "16daf25ea036c128",
        price: {
          decimal: 1.1,
          fractional: {
            numerator: 21,
            denominator: 10,
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
        maxStake: 300,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          fractional: {
            numerator: 21,
            denominator: 1,
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
        maxStake: 500,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          fractional: {
            numerator: 21,
            denominator: 10,
          },
          decimal: 1.1,
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

const placeBetsResponse = {
  betPlacementsResult: [
    {
      id: "SINGLE:[529aedc4c4fbc0b0]",
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
        id: "urn:sbk:bet:bf:obb:01jdnwfwfql",
        receiptId: "o:2bhefbwef",
        betType: "SINGLE",
        placedDate: "2024-11-19T09:51:28.428386001Z",
        price: {
          fractional: {
            numerator: 21,
            denominator: 1,
            __typename: "FractionalOdds",
          },
          decimal: 9.1,
          __typename: "SportsbookOdds",
        },
        stake: 1,
        potentialPayout: 9.1,
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
                numerator: 21,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              decimal: 9.1,
              __typename: "ObbOdds",
            },
            __typename: "OutcomeBasedLeg",
          },
        ],

        __typename: "BetDetails",
      },
      __typename: "BetPlacementDetails",
    },
    {
      id: "SINGLE:[43776dd42d290040]",
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
        receiptId: "o:dwqjfqwifj3",
        betType: "SINGLE",
        placedDate: "2024-11-19T09:51:28.428386001Z",
        price: {
          fractional: {
            numerator: 21,
            denominator: 10,
            __typename: "FractionalOdds",
          },
          decimal: 1.1,
          __typename: "SportsbookOdds",
        },
        stake: 1,
        potentialPayout: 1.1,
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
                numerator: 21,
                denominator: 10,
                __typename: "FractionalOdds",
              },
              decimal: 1.1,
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

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "123" }];

const BFF_MOCK = {
  urn: bffResponse.data.View.urn,
  url: bffResponse.data.View.url,
  sportevent: bffResponse.data.View.sportevent,
  edges: bffResponse.data.View.items.edges,
  partialEdges: bffResponse.data.View.partialItems.edges,
};

describe("OBB Betslip", () => {
  describe("when adding two PvP obb bets", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);
      await mockService.mockHttpRequest(eventLayout);
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getObbQuotes(legsQuotes));
      await mockService.mockHttpRequest(getObbPlaceBets(placeBetsResponse));
      await mockService.mockHttpRequest(getObbImply(firstImplyBetsResponse));
      await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);

      await browser.waitUntilDisplayed(shotsPvpCardPO.playerContainer);

      // clicks on first PvP cards - Add to Betslip - button, waits for betslip to show up
      await shotsPvpCardPO.firstBetButton.click();
      await browser.waitUntilDisplayed(placeButtonPO.label);
      // closes betslip
      await betslipDrawerPO.header.click();
      await mockService.mockHttpRequest(getObbImply(secondImplyBetsResponse));
      // clicks on second Pvp Card - add to Betslip - button
      await goalsPvpCardPO.secondBetButton.scrollIntoView({ block: "center" });
      await goalsPvpCardPO.secondBetButton.click();
      // expands betslip again
      await minimizedPO.element.click(); // expand again betslip
      await browser.waitUntilDisplayed(placeButtonPO.label);
    });

    it("[PRPI-1638] should open betslip with both bets", async () => {
      expect(await firstSingleDetails.title.getText()).toBe("Nicolas Jackson");
      expect(await secondSingleDetails.title.getText()).toBe("Cole Palmer");
    });

    describe("and when filling stakes and hitting the place button", () => {
      beforeAll(async () => {
        await addStake(firstSingleStakeInput, "1");
        await addStake(secondSingleStakeInput, "1");
        await placeButtonPO.element.click();

        await browser.waitUntilDisplayed(receiptPanelPO.element);
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1476]_should_see_two_obb_bets`);
      });

      it("[PRPI-1476]_should_see_two_obb_bets", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1476]_should_see_two_obb_bets`)).toBe(0);
      });
    });
  });
});
