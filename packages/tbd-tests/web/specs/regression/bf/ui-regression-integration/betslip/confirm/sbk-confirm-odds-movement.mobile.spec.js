const {
  MinimizedPO,
  SportPagePO,
  BetLegsPO,
  SportsbookConfirmPO,
  CardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  FixedNumberInputFieldPO,
  PrimaryButtonPO,
  SecondaryButtonPO,
  AlertPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const MultiLinesMultiplesPO = require("@ppb/tbd-shared/components/Betslip/MultiLinesMultiples/MultiLinesMultiples.web.po");
const OneLineMultiplePO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.web.po");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");
const { advanceToConfirmStep } = require("../../../../../../helpers/betslip.util");

const sportPagePO = new SportPagePO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[1]);
const thirdEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[2]);
const fourthEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[3]);
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const secondMatchOddsCard = new CardPO(secondEventMarketCardPO.market);
const thirdMatchOddsCard = new CardPO(thirdEventMarketCardPO.market);
const fourthMatchOddsCard = new CardPO(fourthEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const secondSbkMarketPO = new InlineSportsbookMarketPO(secondMatchOddsCard.inlineSportsbookMarket);
const thirdSbkMarketPO = new InlineSportsbookMarketPO(thirdMatchOddsCard.inlineSportsbookMarket);
const fourthSbkMarketPO = new InlineSportsbookMarketPO(fourthMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[0]);
const thirdSbkRunnerPO = new SportsbookBetButtonPO(thirdSbkMarketPO.betButtons[0]);
const fourthSbkRunnerPO = new SportsbookBetButtonPO(fourthSbkMarketPO.betButtons[0]);
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const sportsbookConfirmPO = new SportsbookConfirmPO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const betControlsPO = new BetControlsPO();
const oneLineMultiplePO = new OneLineMultiplePO(sportsbookPlacePanelPO.element);
const oneLineMultipleControlsPO = new BetControlsPO(oneLineMultiplePO.element);
const oneLineMultipleBetLegsPO = new BetLegsPO(oneLineMultiplePO.element);
const multiLinesMultiplesPO = new MultiLinesMultiplesPO();
const firstMultipleControlsPO = new BetControlsPO(multiLinesMultiplesPO.multiples[0]);
const secondMultipleControlsPO = new BetControlsPO(multiLinesMultiplesPO.multiples[1]);
const thirdMultipleControlsPO = new BetControlsPO(multiLinesMultiplesPO.multiples[2]);
const fourthMultipleControlsPO = new BetControlsPO(multiLinesMultiplesPO.multiples[3]);
const multiLinesMultiplesBetLegsPO = new BetLegsPO(multiLinesMultiplesPO.element);
const sportsbookPlacePanelCardPO = new CardPO(sportsbookPlacePanelPO.collapsableSections[0]);
const oneLineOddsPO = new FixedNumberInputFieldPO(oneLineMultipleControlsPO.fixedInput);

const firstMultiLineStakeInputField = new CurrencyNumberInputFieldPO(firstMultipleControlsPO.currencyInput);
const oneLineMultipleStakeInputField = new CurrencyNumberInputFieldPO(oneLineMultipleControlsPO.currencyInput);
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const editButtonPO = new SecondaryButtonPO(sportsbookConfirmPO.edit);
const placeNotification = new AlertPO(sportsbookPlacePanelPO.element);

const mockService = new MockService();

const confirmButtonsElements = {
  placeButtonElement: placeButtonPO.element,
  editButtonElement: editButtonPO.element,
};

const EVENT_TYPE_ID = 1;

const MARKET_A_ID = "924.1";
const MARKET_B_ID = "924.2";
const MARKET_C_ID = "924.3";
const MARKET_D_ID = "924.4";
const MARKET_E_ID = "924.5";
const MARKET_F_ID = "924.6";

const SELECTION_A_ID = 1;
const SELECTION_B_ID = 2;
const SELECTION_C_ID = 3;

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_A_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_B_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_C_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_D_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_E_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_F_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                title: "Team A vs Team B",
                fixture: {
                  urn: "ppb:fixture:29359895",
                  home: {
                    name: "Team B",
                  },
                  away: {
                    name: "Team A",
                  },
                },
                sportevent: {
                  name: "Team A vs Team B",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_A_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B v Team A",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_A_ID}`,
                          selectionId: SELECTION_A_ID,
                          name: "Team B",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_B_ID}`,
                          selectionId: SELECTION_B_ID,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_C_ID}`,
                          selectionId: SELECTION_C_ID,
                          name: "Team A",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_C_ID}` },
                    ],
                  },
                },
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        cardGroupTitle: "League 2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
                title: "Team A 2 vs Team B 2",
                fixture: {
                  urn: "ppb:fixture:29359896",
                  home: {
                    name: "Team B 2",
                  },
                  away: {
                    name: "Team A 2",
                  },
                },
                sportevent: {
                  name: "Team B 2 vs Team A 2",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_B_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 2 v Team A 2",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_A_ID}`,
                          selectionId: SELECTION_A_ID,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_B_ID}`,
                          selectionId: SELECTION_B_ID,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_C_ID}`,
                          selectionId: SELECTION_C_ID,
                          name: "Team A 2",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_C_ID}` },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
        cardGroupTitle: "League 3",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
                title: "Team A 3 vs Team B 3",
                fixture: {
                  urn: "ppb:fixture:29359897",
                  home: {
                    name: "Team B 3",
                  },
                  away: {
                    name: "Team A 3",
                  },
                },
                sportevent: {
                  name: "Team B vs Team A",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_C_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 3 v Team A 3",
                          urn: "ppb:event:29359897",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/${SELECTION_A_ID}`,
                          selectionId: SELECTION_A_ID,
                          name: "Team B 3",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/${SELECTION_B_ID}`,
                          selectionId: SELECTION_B_ID,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/${SELECTION_C_ID}`,
                          selectionId: SELECTION_C_ID,
                          name: "Team A 3",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/${SELECTION_C_ID}` },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:4",
        cardGroupTitle: "League 4",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
                title: "Team A 4 vs Team B 4",
                fixture: {
                  urn: "ppb:fixture:29359898",
                  home: {
                    name: "Team B 4",
                  },
                  away: {
                    name: "Team A 4",
                  },
                },
                sportevent: {
                  name: "Team B vs Team A",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_D_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 4 v Team A 4",
                          urn: "ppb:event:29359898",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/${SELECTION_A_ID}`,
                          selectionId: SELECTION_A_ID,
                          name: "Team B 4",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/${SELECTION_B_ID}`,
                          selectionId: SELECTION_B_ID,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/${SELECTION_C_ID}`,
                          selectionId: SELECTION_C_ID,
                          name: "Team A 4",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_D_ID}/${SELECTION_C_ID}` },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:5",
        cardGroupTitle: "League 5",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359899",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359899",
                title: "Team A 5 vs Team B 5",
                fixture: {
                  urn: "ppb:fixture:29359899",
                  home: {
                    name: "Team B 5",
                  },
                  away: {
                    name: "Team A 5",
                  },
                },
                sportevent: {
                  name: "Team B vs Team A",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_E_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 5 v Team A 5",
                          urn: "ppb:event:29359899",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_E_ID}/${SELECTION_A_ID}`,
                          selectionId: SELECTION_A_ID,
                          name: "Team B 5",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_E_ID}/${SELECTION_B_ID}`,
                          selectionId: SELECTION_B_ID,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_E_ID}/${SELECTION_C_ID}`,
                          selectionId: SELECTION_C_ID,
                          name: "Team A 5",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_E_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_E_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_E_ID}/${SELECTION_C_ID}` },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:6",
        cardGroupTitle: "League 6",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359800",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359800",
                title: "Team A 6 vs Team B 6",
                fixture: {
                  urn: "ppb:fixture:29359800",
                  home: {
                    name: "Team B 6",
                  },
                  away: {
                    name: "Team A 6",
                  },
                },
                sportevent: {
                  name: "Team B 6 vs Team A 6",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_F_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 6 v Team A 6",
                          urn: "ppb:event:29359800",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_F_ID}/${SELECTION_A_ID}`,
                          selectionId: SELECTION_A_ID,
                          name: "Team B 6",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_F_ID}/${SELECTION_B_ID}`,
                          selectionId: SELECTION_B_ID,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_F_ID}/${SELECTION_C_ID}`,
                          selectionId: SELECTION_C_ID,
                          name: "Team A 6",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_F_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_F_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_F_ID}/${SELECTION_C_ID}` },
                    ],
                  },
                },
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
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:4",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:5",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:6",
      },
    },
  ],
};

const FIRST_SINGLE_MOCK = {
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

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_A_ID,
    selectionId: SELECTION_A_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_B_ID,
          selectionId: SELECTION_A_ID,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_B_ID,
    selectionId: SELECTION_A_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_C_ID,
          selectionId: SELECTION_A_ID,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_C_ID,
    selectionId: SELECTION_A_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FOURTH_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_D_ID,
          selectionId: SELECTION_A_ID,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FOURTH_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_D_ID,
    selectionId: SELECTION_A_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const IMPLY_FOURFOLD_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    FOURTH_SINGLE_MOCK,
    {
      betType: "FOURFOLD",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 3.19,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 3.19 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      betType: "TREBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 4,
    },
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 6,
    },
    {
      betType: "YANKEE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 155.52,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 155.52 },
        },
        fractionalDisplayOdds: { numerator: 156.52, denominator: 1 },
      },
      numLines: 11,
    },
    {
      betType: "LUCKY_15",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 15,
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK, FOURTH_SINGLE_ODDS_MOCK],
};

const IMPLY_FOURFOLD_MOCK_FIRST_UPDATE = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    FOURTH_SINGLE_MOCK,
    {
      betType: "FOURFOLD",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 5.19,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 5.19 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      betType: "TREBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 4.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 4.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 4,
    },
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 6,
    },
    {
      betType: "YANKEE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 155.52,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 155.52 },
        },
        fractionalDisplayOdds: { numerator: 156.52, denominator: 1 },
      },
      numLines: 11,
    },
    {
      betType: "LUCKY_15",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 15,
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK, FOURTH_SINGLE_ODDS_MOCK],
};

const IMPLY_FOURFOLD_SUSPENDED_MOCK = {
  betCombinations: [
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    FOURTH_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 3,
    },
    {
      betType: "TREBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 27.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 27.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 1,
    },
    {
      betType: "TRIXIE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 37.1,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 37.1 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 4,
    },
    {
      betType: "PATENT",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 155.52,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 155.52 },
        },
        fractionalDisplayOdds: { numerator: 156.52, denominator: 1 },
      },
      numLines: 7,
    },
  ],

  runnerOdds: [SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK, FOURTH_SINGLE_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: MARKET_A_ID,
        selectionId: SELECTION_A_ID,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

const SMP_MOCK_FIRST_UPDATE = {
  markets: [
    {
      marketId: MARKET_A_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.1 },
            },
            decimalDisplayOdds: { decimalOdds: 12.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.2 },
            },
            decimalDisplayOdds: { decimalOdds: 12.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.3 },
            },
            decimalDisplayOdds: { decimalOdds: 12.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_B_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.1 },
            },
            decimalDisplayOdds: { decimalOdds: 12.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.3 },
            },
            decimalDisplayOdds: { decimalOdds: 12.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_C_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.1 },
            },
            decimalDisplayOdds: { decimalOdds: 12.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.2 },
            },
            decimalDisplayOdds: { decimalOdds: 12.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.3 },
            },
            decimalDisplayOdds: { decimalOdds: 12.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_D_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.1 },
            },
            decimalDisplayOdds: { decimalOdds: 12.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.2 },
            },
            decimalDisplayOdds: { decimalOdds: 12.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.3 },
            },
            decimalDisplayOdds: { decimalOdds: 12.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_E_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.1 },
            },
            decimalDisplayOdds: { decimalOdds: 12.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.2 },
            },
            decimalDisplayOdds: { decimalOdds: 12.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.3 },
            },
            decimalDisplayOdds: { decimalOdds: 12.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_F_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.1 },
            },
            decimalDisplayOdds: { decimalOdds: 12.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.2 },
            },
            decimalDisplayOdds: { decimalOdds: 12.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.3 },
            },
            decimalDisplayOdds: { decimalOdds: 12.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const SMP_MOCK_SECOND_UPDATE = {
  markets: [
    {
      marketId: MARKET_A_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          runnerStatus: "SUSPENDED",
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          runnerStatus: "SUSPENDED",
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          runnerStatus: "SUSPENDED",
        },
      ],
    },
  ],
};

describe("Confirm step - Odds movement", () => {
  describe("when adding multiple selections to betslip", () => {
    beforeAll(async () => {
      const indexHTML = await getIndexHTML(BFF_MOCK.urn, {
        products: ["sportsbook"],
        BET_CONFIRMATION_STEP: { isActive: true },
      });
      await Promise.all([
        mockService.mockHttpRequest(indexHTML),
        mockService.mockHttpRequest(getSportsLayout(BFF_MOCK)),
        mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
        mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK)),
      ]);

      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");

      await firstSbkRunnerPO.sportsbookBetButton.click();
      await betslipDrawerPO.header.click();
      await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");

      await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_FOURFOLD_MOCK));
      await secondSbkRunnerPO.sportsbookBetButton.click();

      await thirdSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await thirdSbkRunnerPO.sportsbookBetButton.click();

      await fourthSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(fourthSbkRunnerPO.sportsbookBetButton, "Fourth runner bet button not visible");

      await fourthSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntil(
        async () => {
          const title = await sportsbookMinimizedBetslipPO.title.getText();

          return title.includes("3.1");
        },
        {
          timeoutMsg: "4 Leg multiple was not combined",
        },
      );

      await sportsbookMinimizedBetslipPO.element.waitForClickable();
      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
    });

    describe("and the user inserts a stake value for treble and for one line multiple", () => {
      beforeAll(async () => {
        await oneLineMultipleStakeInputField.numberField.waitForClickable();
        await oneLineMultipleStakeInputField.numberField.setValue("0.12");

        await firstMultiLineStakeInputField.element.scrollIntoView();

        await firstMultiLineStakeInputField.numberField.waitForClickable();
        await firstMultiLineStakeInputField.numberField.setValue(0.12);
      });

      describe("when the user advances to confirm step", () => {
        beforeAll(async () => {
          await advanceToConfirmStep(confirmButtonsElements);

          await browser.waitUntilNotInDOM(secondMultipleControlsPO.element);
          await browser.waitUntilNotInDOM(thirdMultipleControlsPO.element);
          await browser.waitUntilNotInDOM(fourthMultipleControlsPO.element);
          await browser.waitUntilDisplayed(
            multiLinesMultiplesBetLegsPO.element,
            "Multi bet legs is not visible in confirm screen",
          );
        });

        it("[PRPI-7798] should display the confirm screen", async () => {
          expect(await sportsbookConfirmPO.element.isDisplayedInViewport()).toBe(true);
        });

        it("[PRPI-7799] should display one line multiple bet legs", async () => {
          expect(await oneLineMultipleBetLegsPO.element.isDisplayed()).toBe(true);
          expect(await oneLineMultipleBetLegsPO.selections.length).toBe(4);
          expect(await sportsbookPlacePanelCardPO.title.getText()).toBe("MULTIPLES");
        });

        it("[PRPI-7800] should display the odds value with '3.19' for the one line multiple", async () => {
          expect(await oneLineOddsPO.numberField.getValue()).toEqual("3.19");
        });

        it("[PRPI-7801] should display the returns with $0.38 for the one line multiple", async () => {
          expect(await oneLineMultipleControlsPO.returns.getText()).toEqual("Returns\n$0.38");
        });

        it("[PRPI-7802] should display a treble", async () => {
          expect(await betControlsPO.element.isDisplayedInViewport()).toBe(true);
          expect(await multiLinesMultiplesPO.multiples.length).toBe(1);
          expect(await firstMultipleControlsPO.lines.getText()).toBe("Treble (x4)");
        });

        it("[PRPI-7803] should display the returns with $1.15 for the treble", async () => {
          expect(await firstMultipleControlsPO.returns.getText()).toEqual("Returns\n$1.15");
        });
      });

      describe("and the odds change", () => {
        beforeAll(async () => {
          await Promise.all([
            mockService.mockHttpRequest(
              getMarketPrices(SMP_MOCK_FIRST_UPDATE, { ignoreRequestedMarketIdsMatch: true }),
            ),
            mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_FOURFOLD_MOCK_FIRST_UPDATE)),
          ]);
          await browser.tickFakeClock();
          await browser.waitUntilEquals(placeNotification.message, "Odds have changed");
        });

        it("[PRPI-7804] should display the odds value updated to '5.19'", async () => {
          expect(await oneLineOddsPO.numberField.getValue()).toEqual("5.19");
        });

        it("[PRPI-7805] should display the returns updated to $0.62 for the one line multiple", async () => {
          expect(await oneLineMultipleControlsPO.returns.getText()).toEqual("Returns\n$0.62");
        });

        it("[PRPI-7806] should display the returns updated to $2.11 for the treble", async () => {
          expect(await firstMultipleControlsPO.returns.getText()).toEqual("Returns\n$2.11");
        });
      });

      describe("and one of the runners gets suspended and odds change", () => {
        beforeAll(async () => {
          await Promise.all([
            mockService.mockHttpRequest(
              getMarketPrices(SMP_MOCK_SECOND_UPDATE, { ignoreRequestedMarketIdsMatch: true }),
            ),
            mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_FOURFOLD_SUSPENDED_MOCK)),
          ]);
          await browser.tickFakeClock();
          await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
        });

        it("[PRPI-7807] should disable the place button", async () => {
          expect(await placeButtonPO.element.isEnabled()).toBe(false);
        });

        it("[PRPI-7808] should display the odds value without changes for the one line multiple", async () => {
          expect(await oneLineOddsPO.numberField.getValue()).toEqual("5.19");
        });

        it("[PRPI-7809] should display the returns value without changes for the one line multiple", async () => {
          expect(await oneLineMultipleControlsPO.returns.getText()).toEqual("Returns\n$0.62");
        });

        it("[PRPI-7809] should display the returns value without changes for the treble", async () => {
          expect(await firstMultipleControlsPO.returns.getText()).toEqual("Returns\n$2.11");
        });

        describe("and the runner becomes active again", () => {
          beforeAll(async () => {
            await Promise.all([
              mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
              mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_FOURFOLD_MOCK)),
            ]);
            await browser.tickFakeClock();
            await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
          });

          it("[PRPI-7810] should display the last valid odds value for the one line multiple", async () => {
            expect(await oneLineOddsPO.numberField.getValue()).toEqual("5.19");
          });

          it("[PRPI-7810] should display the last valid returns value for the one line multiple", async () => {
            expect(await oneLineMultipleControlsPO.returns.getText()).toEqual("Returns\n$0.62");
          });

          it("[PRPI-7810] should display the last valid returns value for the treble", async () => {
            expect(await firstMultipleControlsPO.returns.getText()).toEqual("Returns\n$2.11");
          });
        });
      });
    });
  });
});
