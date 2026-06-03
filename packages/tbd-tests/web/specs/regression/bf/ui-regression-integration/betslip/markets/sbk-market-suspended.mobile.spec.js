const {
  CompetitionPagePO,
  MinimizedPO,
  SinglesCardPO,
  SinglePO,
  BetLegsPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  BetSelectionDetailsPO,
  CurrencyNumberInputFieldPO,
  FixedNumberInputFieldPO,
  AlertPO,
  BetDetailsPO,
  OddsMovementPO,
  BetControlsPO,
  HintPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getCompetitionsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const CouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const mockService = new MockService();

// page
const competitionPage = new CompetitionPagePO();
const sportsbookMinimizedBetslip = new MinimizedPO();
// page markets
const eventMarketsCardCoupon = new CouponCardGroupPO(competitionPage.element);
const inlineSportsbookMarket = new InlineSportsbookMarketPO(eventMarketsCardCoupon.eventCoupons[0]);
const firstRunnerButton = new SportsbookBetButtonPO(inlineSportsbookMarket.betButtons[0]);
const secondInlineSportsbookMarket = new InlineSportsbookMarketPO(eventMarketsCardCoupon.eventCoupons[1]);
const secondRunnerButton = new SportsbookBetButtonPO(secondInlineSportsbookMarket.betButtons[0]);
const thirdInlineSportsbookMarket = new InlineSportsbookMarketPO(eventMarketsCardCoupon.eventCoupons[2]);
const thirdRunnerButton = new SportsbookBetButtonPO(thirdInlineSportsbookMarket.betButtons[0]);
const fourthInlineSportsbookMarket = new InlineSportsbookMarketPO(eventMarketsCardCoupon.eventCoupons[3]);
const fourthRunnerButton = new SportsbookBetButtonPO(fourthInlineSportsbookMarket.betButtons[0]);
const fifthInlineSportsbookMarket = new InlineSportsbookMarketPO(eventMarketsCardCoupon.eventCoupons[4]);
const fifthRunnerButton = new SportsbookBetButtonPO(fifthInlineSportsbookMarket.betButtons[0]);
// betslip
const betslipDrawerPO = new BetslipDrawerPO();
const sbkPlacePanel = new SportsbookPlacePanelPO();
// place panel: singles
const placePanelSingles = new SinglesCardPO(sbkPlacePanel.element);
const placePanel3rdSingle = new SinglePO(placePanelSingles.singles[2]);
const placePanel4thSingle = new SinglePO(placePanelSingles.singles[3]);
const placePanel5thSingle = new SinglePO(placePanelSingles.singles[4]);
const placePanel3rdSingleControlsPO = new BetControlsPO(placePanel3rdSingle.element);
const placePanel4thSingleControlsPO = new BetControlsPO(placePanel4thSingle.element);
const placePanel5thSingleControlsPO = new BetControlsPO(placePanel5thSingle.element);
const placePanel3rdSingleHintPO = new HintPO(placePanel3rdSingleControlsPO.element);
const placePanel5thSingleHintPO = new HintPO(placePanel5thSingleControlsPO.element);
const single4thDetails = new BetDetailsPO(placePanel4thSingle.element);
const single5thDetails = new BetDetailsPO(placePanel5thSingle.element);
const placePanel3rdSingleStakeField = new CurrencyNumberInputFieldPO(placePanel3rdSingleControlsPO.currencyInput);
const placePanel5thSingleStakeField = new CurrencyNumberInputFieldPO(placePanel5thSingleControlsPO.currencyInput);

const placePanel4thSingleOddsField = new FixedNumberInputFieldPO(placePanel4thSingleControlsPO.fixedInput);
const singleOddsMovement = new OddsMovementPO(placePanel4thSingleOddsField.oddsMovement);
// place panel: multiples
const multiplesBetLegs = new BetLegsPO(sbkPlacePanel.element);
const multiples1stSelection = new BetSelectionDetailsPO(multiplesBetLegs.selections[0]);
const multiples3rdSelection = new BetSelectionDetailsPO(multiplesBetLegs.selections[2]);
const multiples4thSelection = new BetSelectionDetailsPO(multiplesBetLegs.selections[3]);
const multiples5thSelection = new BetSelectionDetailsPO(multiplesBetLegs.selections[4]);
const selectionOddsMovement = new OddsMovementPO(multiples4thSelection.oddsMovement);
// place panel: footer
const placeAlert = new AlertPO(sbkPlacePanel.element);

const COMPETITION_ID = "228";
const MARKET_A_ID = "924.1";
const SELECTION_A_ID = 1;
const SELECTION_A_ODDS = 2;
const MARKET_B_ID = "924.2";
const SELECTION_B_ID = 2;
const MARKET_C_ID = "924.3";
const SELECTION_C_ID = 3;
const MARKET_D_ID = "924.4";
const SELECTION_D_ID = 4;
const MARKET_E_ID = "924.5";
const SELECTION_E_ID = 5;
const MARKET_F_ID = "924.6";
const SELECTION_F_ID = 6;

const BFF_MOCK = {
  urn: "ppb:tbd:view:competition:228",
  url: routes.getCompetitionViewUrl(COMPETITION_ID),
  competition: {
    urn: "ppb:competition:228",
    name: "UEFA Champions League",
    competitionId: COMPETITION_ID,
  },
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:228",
        filteredCouponTitle: "UEFA Champions League",
        has90Min: false,
        filterOptions: {
          sortOption: {
            defaultOption: "RANK",
            availableOptions: ["RANK", "TIME"],
          },
          dateRangeFilter: {},
          marketTypeFilter: {},
          competitionsFilter: {},
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899897",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899897",
                  viewUrl: routes.getEventViewUrl("29899897"),
                },
                title: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_A_ID}`,
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: 228,
                        },
                        sportevent: {
                          urn: "ppb:event:29899897",
                          name: "Man City v Real Madrid",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_A_ID}`,
                          name: "Man City",
                          selectionId: SELECTION_A_ID,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/2426`,
                          name: "Real Madrid",
                          selectionId: 2426,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          resultType: "DRAW",
                        },
                      ],

                      status: "OPEN",
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/2426` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/58805` },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899897",
                  home: { name: "Man City" },
                  away: { name: "Real Madrid" },
                  scheduledAt: "2020-08-07T19:00:00Z",
                },
                sportevent: {
                  name: "Man City v Real Madrid",
                  urn: "ppb:event:29899897",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899869",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899869",
                  viewUrl: routes.getEventViewUrl("29899869"),
                },
                title: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_B_ID}`,
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: 228,
                        },
                        sportevent: {
                          urn: "ppb:event:29899869",
                          name: "Juventus v Lyon",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_B_ID}`,
                          name: "Juventus",
                          selectionId: SELECTION_B_ID,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/55271`,
                          name: "Lyon",
                          selectionId: 55271,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/55271` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/58805` },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899869",
                  home: { name: "Juventus" },
                  away: { name: "Lyon" },
                  scheduledAt: "2020-08-07T19:00:00Z",
                },
                sportevent: {
                  name: "Juventus v Lyon",
                  urn: "ppb:event:29899869",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899863",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899863",
                  viewUrl: routes.getEventViewUrl("29899863"),
                },
                title: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_C_ID}`,
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: COMPETITION_ID,
                        },
                        sportevent: {
                          urn: "ppb:event:29899863",
                          name: "Bayern Munich v Chelsea",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/${SELECTION_C_ID}`,
                          name: "Bayern Munich",
                          selectionId: SELECTION_C_ID,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/55190`,
                          name: "Chelsea",
                          selectionId: 55190,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/${SELECTION_C_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/55190` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/58805` },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899863",
                  home: { name: "Bayern Munich" },
                  away: { name: "Chelsea" },
                  scheduledAt: "2020-08-08T19:00:00Z",
                },
                sportevent: {
                  name: "Bayern Munich v Chelsea",
                  urn: "ppb:event:29899863",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899864",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899864",
                  viewUrl: routes.getEventViewUrl("29899864"),
                },
                title: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_D_ID}`,
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: COMPETITION_ID,
                        },
                        sportevent: {
                          urn: "ppb:event:29899864",
                          name: "AD Marco 09 v Lixa",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/${SELECTION_D_ID}`,
                          name: "AD Marco 09",
                          selectionId: SELECTION_D_ID,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/58811`,
                          name: "Lixa",
                          selectionId: 58811,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/58812`,
                          name: "The Draw",
                          selectionId: 58812,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/${SELECTION_D_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/58811` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/58812` },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899864",
                  home: { name: "AD Marco 09" },
                  away: { name: "Lixa" },
                  scheduledAt: "2020-08-08T19:00:00Z",
                },
                sportevent: {
                  name: "AD Marco 09 v Lixa",
                  urn: "ppb:event:29899864",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899865",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899865",
                  viewUrl: routes.getEventViewUrl("29899865"),
                },
                title: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_E_ID}`,
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: COMPETITION_ID,
                        },
                        sportevent: {
                          urn: "ppb:event:29899865",
                          name: "Wolves Paranhos v Canelas 2010",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_E_ID}/${SELECTION_E_ID}`,
                          name: "Wolves Paranhos",
                          selectionId: SELECTION_E_ID,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/58814`,
                          name: "Canelas 2010",
                          selectionId: 58814,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/58815`,
                          name: "The Draw",
                          selectionId: 58815,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_E_ID}/${SELECTION_E_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/58814` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/58815` },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899865",
                  home: { name: "Wolves Paranhos" },
                  away: { name: "Canelas 2010" },
                  scheduledAt: "2020-08-08T19:00:00Z",
                },
                sportevent: {
                  name: "Wolves 09 v Canelas",
                  urn: "ppb:event:29899865",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899875",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899875",
                  viewUrl: routes.getEventViewUrl("29899875"),
                },
                title: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_F_ID}`,
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: COMPETITION_ID,
                        },
                        sportevent: {
                          urn: "ppb:event:29899875",
                          name: "Blip v AGEAS",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_F_ID}/${SELECTION_F_ID}`,
                          name: "Blip",
                          selectionId: SELECTION_F_ID,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_F_ID}/58816`,
                          name: "AGEAS",
                          selectionId: 58816,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_F_ID}/58817`,
                          name: "The Draw",
                          selectionId: 58817,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_F_ID}/${SELECTION_F_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_F_ID}/58816` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_F_ID}/58817` },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899875",
                  home: { name: "Blip" },
                  away: { name: "AGEAS" },
                  scheduledAt: "2020-08-08T19:00:00Z",
                },
                sportevent: {
                  name: "Blip v AGEAS",
                  urn: "ppb:event:29899875",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
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
                urn: "ppb:tbd:card:eventPrimaryMarket:29899897",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899869",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899863",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899864",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899865",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899875",
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
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:228",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_A_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_A_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: SELECTION_A_ODDS },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: SELECTION_A_ODDS },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58807,
          noOdds: true,
        },
        {
          selectionId: 2426,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_B_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_B_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 55271,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_C_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_C_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58806,
          noOdds: true,
        },
        {
          selectionId: 55190,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_D_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_D_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58811,
          noOdds: true,
        },
        {
          selectionId: 58812,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_E_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_E_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58814,
          noOdds: true,
        },
        {
          selectionId: 58815,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_F_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_F_ID,
          noOdds: true,
        },
        {
          selectionId: 58814,
          noOdds: true,
        },
        {
          selectionId: 58815,
          noOdds: true,
        },
      ],
    },
  ],
};

// add selection A
const FIRST_SINGLE = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_A_ID,
          selectionId: SELECTION_A_ID,
        },
      ],
    },
  ],

  betType: "SINGLE",
};
const FIRST_SINGLE_ODDS = {
  runner: {
    marketId: MARKET_A_ID,
    selectionId: SELECTION_A_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: SELECTION_A_ODDS },
      fractionalDisplayOdds: { numerator: 2, denominator: 5 },
    },
    decimalDisplayOdds: { decimalOdds: SELECTION_A_ODDS },
    fractionalDisplayOdds: { numerator: 2, denominator: 5 },
  },
};
const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE],
  runnerOdds: [FIRST_SINGLE_ODDS],
};

// add selection B
const SECOND_SINGLE = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_B_ID,
          selectionId: SELECTION_B_ID,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  betType: "SINGLE",
};
const SECOND_SINGLE_ODDS = {
  runner: {
    marketId: MARKET_B_ID,
    selectionId: SELECTION_B_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3 },
      fractionalOdds: { numerator: 2, denominator: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 3 },
    fractionalDisplayOdds: { numerator: 2, denominator: 5 },
  },
};
const DOUBLE_ODDS = 6;
const DOUBLE_COMBINATION = {
  legCombinations: [],
  numLines: 1,
  averageOdds: DOUBLE_ODDS,
  winAverageOdds: DOUBLE_ODDS,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: DOUBLE_ODDS } },
    decimalDisplayOdds: { decimalOdds: DOUBLE_ODDS },
  },
  betType: "DOUBLE",
};
const DOUBLE_MOCK = {
  betCombinations: [FIRST_SINGLE, SECOND_SINGLE, DOUBLE_COMBINATION],
  runnerOdds: [FIRST_SINGLE_ODDS, SECOND_SINGLE_ODDS],
};

// add selection C
const THIRD_SINGLE = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_C_ID,
          selectionId: SELECTION_C_ID,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  betType: "SINGLE",
};
const THIRD_SINGLE_ODDS = {
  runner: {
    marketId: MARKET_C_ID,
    selectionId: SELECTION_C_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3 },
      fractionalOdds: { numerator: 2, denominator: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 3 },
    fractionalDisplayOdds: { numerator: 2, denominator: 5 },
  },
};
const DOUBLE_COMBINATION_X_LINES = {
  ...DOUBLE_COMBINATION,
  numLines: 3,
};
const TREBLE_ODDS = 18;
const TREBLE_COMBINATION = {
  legCombinations: [],
  numLines: 1,
  averageOdds: TREBLE_ODDS,
  winAverageOdds: TREBLE_ODDS,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: TREBLE_ODDS } },
    decimalDisplayOdds: { decimalOdds: TREBLE_ODDS },
  },
  betType: "TREBLE",
};
const TREBLE_MOCK = {
  betCombinations: [FIRST_SINGLE, SECOND_SINGLE, THIRD_SINGLE, DOUBLE_COMBINATION_X_LINES, TREBLE_COMBINATION],
  runnerOdds: [FIRST_SINGLE_ODDS, SECOND_SINGLE_ODDS, THIRD_SINGLE_ODDS],
};

// add selection D
const FOURTH_SINGLE = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_D_ID,
          selectionId: SELECTION_D_ID,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  betType: "SINGLE",
};
const FOURTH_SINGLE_ODDS = {
  runner: {
    marketId: MARKET_D_ID,
    selectionId: SELECTION_D_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3 },
      fractionalOdds: { numerator: 2, denominator: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 3 },
    fractionalDisplayOdds: { numerator: 2, denominator: 5 },
  },
};
const FOURFOLD_ODDS = 54;
const FOURFOLD_COMBINATION = {
  legCombinations: [],
  numLines: 1,
  averageOdds: FOURFOLD_ODDS,
  winAverageOdds: FOURFOLD_ODDS,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: FOURFOLD_ODDS } },
    decimalDisplayOdds: { decimalOdds: FOURFOLD_ODDS },
  },
  betType: "FOURFOLD",
};
const TREBLE_COMBINATION_X_LINES = {
  ...TREBLE_COMBINATION,
  numLines: 3,
};
const FOURFOLD_MOCK = {
  betCombinations: [
    FIRST_SINGLE,
    SECOND_SINGLE,
    THIRD_SINGLE,
    FOURTH_SINGLE,
    DOUBLE_COMBINATION_X_LINES,
    TREBLE_COMBINATION_X_LINES,
    FOURFOLD_COMBINATION,
  ],

  runnerOdds: [FIRST_SINGLE_ODDS, SECOND_SINGLE_ODDS, THIRD_SINGLE_ODDS, FOURTH_SINGLE_ODDS],
};

// add selection E
const FIFTH_SINGLE = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_E_ID,
          selectionId: SELECTION_E_ID,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  betType: "SINGLE",
};
const FIFTH_SINGLE_ODDS = {
  runner: {
    marketId: MARKET_E_ID,
    selectionId: SELECTION_E_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3 },
      fractionalOdds: { numerator: 2, denominator: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 3 },
    fractionalDisplayOdds: { numerator: 2, denominator: 5 },
  },
};
const FIVEFOLD_ODDS = 162;
const FIVEFOLD_COMBINATION = {
  legCombinations: [],
  numLines: 1,
  averageOdds: FIVEFOLD_ODDS,
  winAverageOdds: FIVEFOLD_ODDS,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: FIVEFOLD_ODDS } },
    decimalDisplayOdds: { decimalOdds: FIVEFOLD_ODDS },
  },
  betType: "FIVEFOLD",
};
const FOURFOLD_COMBINATION_X_LINES = {
  ...FOURFOLD_COMBINATION,
  numLines: 3,
};
const FIVEFOLD_MOCK = {
  betCombinations: [
    FIRST_SINGLE,
    SECOND_SINGLE,
    THIRD_SINGLE,
    FOURTH_SINGLE,
    FIFTH_SINGLE,
    DOUBLE_COMBINATION_X_LINES,
    TREBLE_COMBINATION_X_LINES,
    FOURFOLD_COMBINATION_X_LINES,
    FIVEFOLD_COMBINATION,
  ],

  runnerOdds: [FIRST_SINGLE_ODDS, SECOND_SINGLE_ODDS, THIRD_SINGLE_ODDS, FOURTH_SINGLE_ODDS, FIFTH_SINGLE_ODDS],
};

const SMP_MOCK_FIRST_UPDATE = {
  markets: [
    {
      marketId: MARKET_A_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_A_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: SELECTION_A_ODDS },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: SELECTION_A_ODDS },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58807,
          noOdds: true,
        },
        {
          selectionId: 2426,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_B_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_B_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 55271,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_C_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_C_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
          runnerStatus: "SUSPENDED",
        },
        {
          selectionId: 58806,
          noOdds: true,
        },
        {
          selectionId: 55190,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_D_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_D_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58811,
          noOdds: true,
        },
        {
          selectionId: 58812,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_E_ID,
      marketStatus: "CLOSED",
      runnerDetails: [
        {
          selectionId: SELECTION_E_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
          runnerStatus: "CLOSED",
        },
        {
          selectionId: 58814,
          noOdds: true,
        },
        {
          selectionId: 58815,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_F_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_F_ID,
          noOdds: true,
        },
        {
          selectionId: 58814,
          noOdds: true,
        },
        {
          selectionId: 58815,
          noOdds: true,
        },
      ],
    },
  ],
};

// selection C suspends, selection E closes
const MARKETS_FIRST_UPDATE = {
  betCombinations: [FIRST_SINGLE, SECOND_SINGLE, THIRD_SINGLE, DOUBLE_COMBINATION_X_LINES, TREBLE_COMBINATION],
  runnerOdds: [FIRST_SINGLE_ODDS, SECOND_SINGLE_ODDS, THIRD_SINGLE_ODDS, FOURTH_SINGLE_ODDS],
  betFailures: [
    {
      failedRunner: {
        marketId: MARKET_C_ID,
        selectionId: SELECTION_C_ID,
      },
      failureCode: "MARKET_SUSPENDED",
    },
    {
      failedRunner: {
        marketId: MARKET_E_ID,
        selectionId: SELECTION_E_ID,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
  ],
};

const SMP_MOCK_ODDS_UPDATE = {
  markets: [
    {
      marketId: MARKET_A_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_A_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: SELECTION_A_ODDS },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: SELECTION_A_ODDS },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58807,
          noOdds: true,
        },
        {
          selectionId: 2426,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_B_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_B_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 55271,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_C_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_C_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
          runnerStatus: "SUSPENDED",
        },
        {
          selectionId: 58806,
          noOdds: true,
        },
        {
          selectionId: 55190,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_D_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_D_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 4 },
              fractionalDisplayOdds: { numerator: 8, denominator: 11 },
            },
            decimalDisplayOdds: { decimalOdds: 4 },
            fractionalDisplayOdds: { numerator: 8, denominator: 11 },
          },
        },
        {
          selectionId: 58811,
          noOdds: true,
        },
        {
          selectionId: 58812,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_E_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_E_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 2, denominator: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
          runnerStatus: "SUSPENDED",
        },
        {
          selectionId: 58814,
          noOdds: true,
        },
        {
          selectionId: 58815,
          noOdds: true,
        },
      ],
    },
    {
      marketId: MARKET_F_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_F_ID,
          noOdds: true,
        },
        {
          selectionId: 58814,
          noOdds: true,
        },
        {
          selectionId: 58815,
          noOdds: true,
        },
      ],
    },
  ],
};

// selection D changes odds
const FOURTH_SINGLE_ODDS_MOVEMENT = {
  ...FOURTH_SINGLE_ODDS,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 4 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 4 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};
const TREBLE_COMBINATION_MOVEMENT = {
  ...TREBLE_COMBINATION,
  averageOdds: 15,
  winAverageOdds: 15,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 15 } },
    decimalDisplayOdds: { decimalOdds: 15 },
  },
};
const MARKETS_SECOND_UPDATE = {
  ...MARKETS_FIRST_UPDATE,
  betCombinations: [
    FIRST_SINGLE,
    SECOND_SINGLE,
    FOURTH_SINGLE,
    DOUBLE_COMBINATION_X_LINES,
    TREBLE_COMBINATION_MOVEMENT,
  ],

  runnerOdds: [FIRST_SINGLE_ODDS, SECOND_SINGLE_ODDS, FOURTH_SINGLE_ODDS_MOVEMENT],
};

// selection E removed
const MARKETS_THIRD_UPDATE = {
  betCombinations: [
    FIRST_SINGLE,
    SECOND_SINGLE,
    FOURTH_SINGLE,
    DOUBLE_COMBINATION_X_LINES,
    TREBLE_COMBINATION_MOVEMENT,
  ],

  runnerOdds: [FIRST_SINGLE_ODDS, SECOND_SINGLE_ODDS, THIRD_SINGLE_ODDS, FOURTH_SINGLE_ODDS_MOVEMENT],
  betFailures: [
    {
      failedRunner: {
        marketId: MARKET_C_ID,
        selectionId: SELECTION_C_ID,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

// selection D removed
const MARKETS_FOURTH_UPDATE = {
  betCombinations: [FIRST_SINGLE, SECOND_SINGLE, DOUBLE_COMBINATION],
  runnerOdds: [FIRST_SINGLE_ODDS, SECOND_SINGLE_ODDS],
  betFailures: [
    {
      failedRunner: {
        marketId: MARKET_C_ID,
        selectionId: SELECTION_C_ID,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

describe("Betslip - SBK", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getCompetitionsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await browser.url(routes.getCompetitionViewUrl(COMPETITION_ID));
    await browser.waitUntilEquals(firstRunnerButton.odd, `${SELECTION_A_ODDS}`);

    // add selection A
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await firstRunnerButton.element.click();
    await browser.waitUntilDisplayed(sbkPlacePanel.element);

    // close betslip
    await betslipDrawerPO.header.click();
    await browser.waitUntilNotDisplayed(sbkPlacePanel.element, "Single panel hasn't been minimized");

    // add selection B
    await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
    await secondRunnerButton.element.click();
    await browser.waitUntil(
      async () => {
        const title = await sportsbookMinimizedBetslip.title.getText();
        return title.includes("Double @");
      },
      {
        timeoutMsg: "2 legs multiple was not combined",
      },
    );

    // add selection C
    await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK, { ignoreLegsOrder: true }));
    await thirdRunnerButton.element.click();
    await browser.waitUntil(
      async () => {
        const title = await sportsbookMinimizedBetslip.title.getText();
        return title.includes("Treble @");
      },
      {
        timeoutMsg: "3 legs multiple was not combined",
      },
    );

    // add selection D
    await mockService.mockHttpRequest(getImplyBetsResponse(FOURFOLD_MOCK, { ignoreLegsOrder: true }));
    await fourthRunnerButton.element.click();
    await browser.waitUntil(
      async () => {
        const title = await sportsbookMinimizedBetslip.title.getText();
        return title.includes("4 Fold @");
      },
      {
        timeoutMsg: "4 legs multiple was not combined",
      },
    );

    // add selection E
    await mockService.mockHttpRequest(getImplyBetsResponse(FIVEFOLD_MOCK, { ignoreLegsOrder: true }));
    await fifthRunnerButton.element.click();
    await browser.waitUntil(
      async () => {
        const title = await sportsbookMinimizedBetslip.title.getText();
        return title.includes("5 Fold @");
      },
      {
        timeoutMsg: "5 legs multiple was not combined",
      },
    );

    // open betslip
    await sportsbookMinimizedBetslip.element.waitForClickable();
    await sportsbookMinimizedBetslip.element.click();
    await browser.waitUntilDisplayed(sbkPlacePanel.element, "Place panel hasn't been expanded");

    await browser.waitUntilEquals(multiples1stSelection.title, "Man City");
  });

  describe("market suspended notification", () => {
    describe("when market of selection C suspends and E closes", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getMarketPrices(SMP_MOCK_FIRST_UPDATE, { ignoreRequestedMarketIdsMatch: true }),
        );
        await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_FIRST_UPDATE, { ignoreLegsOrder: true }));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(placeAlert.message, "Availability of selections has changed");
      });

      it("[PRPI-7923] should display the availability notification", async () => {
        expect(await placeAlert.message.getText()).toBe("Availability of selections has changed");
      });

      it("[PRPI-7924] and display the 'suspended' information in the collapse on C selection", async () => {
        expect(await multiples3rdSelection.hintMessage.getText()).toBe("SUSPENDED");
        expect(await multiples3rdSelection.hintWarning.isDisplayed()).toBe(true);
      });

      it("[PRPI-7925] and display the 'suspended' information on selection C single", async () => {
        expect(await placePanel3rdSingleHintPO.message.getText()).toBe("SUSPENDED");
        expect(await placePanel3rdSingleHintPO.typeWarning.isDisplayed()).toBe(true);
      });

      it("[PRPI-7926] and have the stake input disabled on selection C single", async () => {
        expect(await placePanel3rdSingleStakeField.numberField.isEnabled()).toBe(false);
      });

      it("[PRPI-7927] and display the 'closed' information in the collapse on E selection", async () => {
        expect(await multiples5thSelection.hintMessage.getText()).toBe("CLOSED");
        expect(await multiples5thSelection.hintWarning.isDisplayed()).toBe(true);
      });

      it("[PRPI-7928] and display the 'closed' information on selection E single", async () => {
        expect(await placePanel5thSingleHintPO.message.getText()).toBe("CLOSED");
        expect(await placePanel5thSingleHintPO.typeWarning.isDisplayed()).toBe(true);
      });

      it("[PRPI-7929] and have the stake input disabled on selection E single", async () => {
        expect(await placePanel5thSingleStakeField.numberField.isEnabled()).toBe(false);
      });

      describe("when selection D changes odds", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getMarketPrices(SMP_MOCK_ODDS_UPDATE, { ignoreRequestedMarketIdsMatch: true }),
          );
          await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_SECOND_UPDATE, { ignoreLegsOrder: true }));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(placeAlert.message, "Odds and availability have changed");
        });

        it("[PRPI-7930] should display the odds and availability notification", async () => {
          expect(await placeAlert.message.getText()).toBe("Odds and availability have changed");
        });

        it("[PRPI-7931] and display the 'suspended' information in the collapse on C selection", async () => {
          expect(await multiples3rdSelection.hintMessage.getText()).toBe("SUSPENDED");
          expect(await multiples3rdSelection.hintWarning.isDisplayed()).toBe(true);
        });

        it("[PRPI-7932] and display the 'suspended' information on selection C single", async () => {
          expect(await placePanel3rdSingleHintPO.message.getText()).toBe("SUSPENDED");
          expect(await placePanel3rdSingleHintPO.typeWarning.isDisplayed()).toBe(true);
        });

        it("[PRPI-7933] and have the stake input disabled on selection C single", async () => {
          expect(await placePanel3rdSingleStakeField.numberField.isEnabled()).toBe(false);
        });

        it("[PRPI-7934] and display the 'closed' information in the collapse on E selection", async () => {
          expect(await multiples5thSelection.hintMessage.getText()).toBe("CLOSED");
          expect(await multiples5thSelection.hintWarning.isDisplayed()).toBe(true);
        });

        it("[PRPI-7935] and display the 'closed' information on selection E single", async () => {
          expect(await placePanel5thSingleHintPO.message.getText()).toBe("CLOSED");
          expect(await placePanel5thSingleHintPO.typeWarning.isDisplayed()).toBe(true);
        });

        it("[PRPI-7936] and have the stake input disabled on selection E single", async () => {
          expect(await placePanel5thSingleStakeField.numberField.isEnabled()).toBe(false);
        });

        it("[PRPI-7937] and display an arrow in the collapse for selection D", async () => {
          expect(await selectionOddsMovement.arrow.isDisplayed()).toBe(true);
        });

        it("[PRPI-7938] and display an arrow on selection D single", async () => {
          expect(await singleOddsMovement.arrow.isDisplayed()).toBe(true);
        });

        describe("when selection E is removed", () => {
          beforeAll(async () => {
            await placePanel5thSingle.element.scrollIntoView();
            await browser.waitUntilInViewport(placePanel5thSingle.element);

            await single5thDetails.remove.click();
            await browser.waitUntilNotInDOM(single5thDetails.element, "selection E wasn't removed");
            await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_THIRD_UPDATE, { ignoreLegsOrder: true }));
            await browser.tickFakeClock();
            await browser.waitUntilEquals(placeAlert.message, "Odds and availability have changed");
          });

          it("[PRPI-7939] should display the odds and availability notification", async () => {
            expect(await placeAlert.message.getText()).toBe("Odds and availability have changed");
          });

          it("[PRPI-7940] and display the 'suspended' information in the collapse on C selection", async () => {
            expect(await multiples3rdSelection.hintMessage.getText()).toBe("SUSPENDED");
            expect(await multiples3rdSelection.hintWarning.isDisplayed()).toBe(true);
          });

          it("[PRPI-7941] and display the 'suspended' information on selection C single", async () => {
            expect(await placePanel3rdSingleHintPO.message.getText()).toBe("SUSPENDED");
            expect(await placePanel3rdSingleHintPO.typeWarning.isDisplayed()).toBe(true);
          });

          it("[PRPI-7942] and display an arrow in the collapse for selection D", async () => {
            expect(await selectionOddsMovement.arrow.isDisplayed()).toBe(true);
          });

          it("[PRPI-7943] and display an arrow on selection D single", async () => {
            expect(await singleOddsMovement.arrow.isDisplayed()).toBe(true);
          });

          describe("when selection D is removed", () => {
            beforeAll(async () => {
              await placePanel4thSingle.element.scrollIntoView();
              await browser.waitUntilInViewport(placePanel4thSingle.element);

              await single4thDetails.remove.click();
              await browser.waitUntilNotInDOM(single4thDetails.element, "selection C wasn't removed");
              await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_FOURTH_UPDATE, { ignoreLegsOrder: true }));
              await browser.tickFakeClock();
              await browser.waitUntilEquals(placeAlert.message, "Market Suspended");
            });

            it("[PRPI-7944] should display the suspended notification", async () => {
              expect(await placeAlert.message.getText()).toBe("Market Suspended");
            });

            it("[PRPI-7945] and display the 'suspended' information in the collapse on C selection", async () => {
              expect(await multiples3rdSelection.hintMessage.getText()).toBe("SUSPENDED");
              expect(await multiples3rdSelection.hintWarning.isDisplayed()).toBe(true);
            });

            it("[PRPI-7946] and display the 'suspended' information on selection C single", async () => {
              expect(await placePanel3rdSingleHintPO.message.getText()).toBe("SUSPENDED");
              expect(await placePanel3rdSingleHintPO.typeWarning.isDisplayed()).toBe(true);
            });
          });
        });
      });
    });
  });
});
