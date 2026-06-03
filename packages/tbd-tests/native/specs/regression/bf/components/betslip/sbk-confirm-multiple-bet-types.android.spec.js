const EventMarketCardSO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.so");
const MultiLinesMultiplesSO = require("@ppb/tbd-shared/components/Betslip/MultiLinesMultiples/MultiLinesMultiples.native.so");
const OneLineMultipleSO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.native.so");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const {
  getAppContext,
  getHomeLayoutWithViewLink,
  getSportsLayout,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const {
  hideKeyboard,
  swipeUpElement,
  swipeDownElement,
  getVerticalDistanceBetweenTwoElements,
} = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { advanceToConfirmStep } = require("../../../../../helpers/confirm-bets");

const {
  MinimizedSO,
  BetslipDrawerSO,
  SportsbookPlacePanelSO,
  BetLegsSO,
  SportPageScreenSO,
  CardSO,
  SportsbookBetButtonSO,
  BetControlsSO,
  CurrencyNumberInputFieldSO,
  PrimaryButtonSO,
  SecondaryButtonSO,
  AlertSO,
  InlineSportsbookMarketSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();
const sportScreenSO = new SportPageScreenSO();

const firstEventMarketCardSO = new EventMarketCardSO(sportScreenSO.eventMarketCards[0]);
const secondEventMarketCardSO = new EventMarketCardSO(sportScreenSO.eventMarketCards[1]);
const thirdEventMarketCardSO = new EventMarketCardSO(sportScreenSO.eventMarketCards[2]);
const fourthEventMarketCardSO = new EventMarketCardSO(sportScreenSO.eventMarketCards[3]);

const firstMatchOddsCard = new CardSO(firstEventMarketCardSO.element);
const secondMatchOddsCard = new CardSO(secondEventMarketCardSO.element);
const thirdMatchOddsCard = new CardSO(thirdEventMarketCardSO.element);
const fourthMatchOddsCard = new CardSO(fourthEventMarketCardSO.element);

const firstSbkMarketSO = new InlineSportsbookMarketSO(firstMatchOddsCard.contentWrapper);
const secondSbkMarketSO = new InlineSportsbookMarketSO(secondMatchOddsCard.contentWrapper);
const thirdSbkMarketSO = new InlineSportsbookMarketSO(thirdMatchOddsCard.contentWrapper);
const fourthSbkMarketSO = new InlineSportsbookMarketSO(fourthMatchOddsCard.contentWrapper);

const firstSbkRunnerSO = new SportsbookBetButtonSO(firstSbkMarketSO.sbkBetButtons[0]);
const secondSbkRunnerSO = new SportsbookBetButtonSO(secondSbkMarketSO.sbkBetButtons[0]);
const thirdSbkRunnerSO = new SportsbookBetButtonSO(thirdSbkMarketSO.sbkBetButtons[0]);
const fourthSbkRunnerSO = new SportsbookBetButtonSO(fourthSbkMarketSO.sbkBetButtons[0]);

const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();

const minimizedBetslipSO = new MinimizedSO();
const betslipDrawerSO = new BetslipDrawerSO();
const betControlsSO = new BetControlsSO();
const betLegs = new BetLegsSO(sportsbookPlacePanelSO.element);
const oneLineMultipleSO = new OneLineMultipleSO(sportsbookPlacePanelSO.element);
const multiLinesMultiplesSO = new MultiLinesMultiplesSO(sportsbookPlacePanelSO.element);
const firstMultipleControlsSO = new BetControlsSO(multiLinesMultiplesSO.multiples[0]);
const secondMultipleControlsSO = new BetControlsSO(multiLinesMultiplesSO.multiples[1]);
const thirdMultipleControlsSO = new BetControlsSO(multiLinesMultiplesSO.multiples[2]);
const fourthMultipleControlsSO = new BetControlsSO(multiLinesMultiplesSO.multiples[3]);
const oneLineMultipleControlsSO = new BetControlsSO(oneLineMultipleSO.element);
const oneLineMultipleCardSO = new CardSO(oneLineMultipleSO.element);

const oneLineMultiStakeInputField = new CurrencyNumberInputFieldSO(oneLineMultipleControlsSO.currencyInput);
const firstMultiLineStakeInputField = new CurrencyNumberInputFieldSO(firstMultipleControlsSO.currencyInput);
const secondMultiLineStakeInputField = new CurrencyNumberInputFieldSO(secondMultipleControlsSO.currencyInput);

const placeNotification = new AlertSO(sportsbookPlacePanelSO.element);
const placeButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.place);
const editButtonSO = new SecondaryButtonSO(sportsbookPlacePanelSO.actions[0]);
const confirmButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.actions[1]);

const confirmButtonsElements = {
  placeButtonElement: placeButtonSO.element,
  editButtonElement: editButtonSO.element,
};

const APP_CONTEXT_MOCK = {
  loggedIn: "true",
  products: ["sportsbook"],
  throttles: {
    BET_CONFIRMATION_STEP: { isActive: true },
  },
};

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
  urn: `ppb:tbd:view:sport:1`,
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

const FOURFOLD_MOCK = {
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
          decimalOdds: 3.1,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 3.1 },
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

const SMP_MOCK_FIRST_UPDATE = {
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

const MARKETS_FIRST_UPDATE_FAILURES = {
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
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
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
          decimalOdds: 3.1,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 3.1 },
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

/*
 * This function is used to collapse the one line multiple,
 * otherwise would be necessary to scroll down to see the other types
 * and in different devices the position of the elements can change
 */
const collapseOneLineMultiple = async () => {
  await oneLineMultipleCardSO.header.click();
  await browser.waitUntilDisplayed(oneLineMultipleCardSO.contentWrapper);
};

const findElementBySecondaryLabel = async (secondaryLabel) => {
  const elements = [firstSbkRunnerSO, secondSbkRunnerSO, thirdSbkRunnerSO, fourthSbkRunnerSO];

  return Promise.any(
    elements.map(async (item) => {
      if (await item.element.isDisplayed()) {
        const itemSecondaryLabel = await item.secondaryLabel.getText();
        if (itemSecondaryLabel === secondaryLabel) {
          return item;
        }
      }
      throw new Error("Element not found");
    }),
  ).catch(() => null);
};

describe("Betslip - Confirm SBK Multiples Bet Types", () => {
  beforeAll(async () => {
    const HOME_VIEW_LINK = getStartViewLink("football/s-1");
    await Promise.all([
      mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK)),
      mockService.mockHttpRequest(getSportsLayout(BFF_MOCK)),
      mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
      mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK)),
      mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK)),
    ]);

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(sportScreenSO.element);
  });

  describe("when adding multiple selections to betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilEquals(firstSbkRunnerSO.odd, "1.1");
      await firstSbkRunnerSO.element.click();

      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();

      await browser.waitUntilDisplayed(minimizedBetslipSO.counter, "Betslip was not minimized");
      await browser.waitUntilDisplayed(secondSbkRunnerSO.element, "Second runner bet button not visible");

      await mockService.mockHttpRequest(getImplyBetsResponse(FOURFOLD_MOCK));

      await secondSbkRunnerSO.element.click();

      await browser.waitUntilDisplayed(thirdSbkRunnerSO.element, "Third runner bet button not visible");
      await thirdSbkRunnerSO.element.click();

      const DISTANCE_BETWEEN_MARKETS = await getVerticalDistanceBetweenTwoElements(
        secondSbkRunnerSO.element,
        firstSbkRunnerSO.element,
      );
      await swipeUpElement(firstSbkRunnerSO.element, DISTANCE_BETWEEN_MARKETS);

      const fourthElement = await findElementBySecondaryLabel("Team B 4");
      await fourthElement.element.click();

      await browser.waitUntilEquals(minimizedBetslipSO.counter, "4");
      await minimizedBetslipSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element);
    });

    it("[PRPI-4048] should have one line multiple with 4 Fold", async () => {
      expect(await oneLineMultipleControlsSO.element.isDisplayed()).toBe(true);
      expect(await oneLineMultipleControlsSO.betType.getText()).toEqual("4 Fold");
    });

    it("[PRPI-4049] should display one line multiple with 4 bet legs", async () => {
      expect(await betLegs.selections.length).toEqual(4);
    });

    describe("and collapse one line multiple type before continue the journey", () => {
      beforeAll(async () => {
        await collapseOneLineMultiple();
      });

      it("[PRPI-4050] should display the collapsed chevron", async () => {
        expect(await oneLineMultipleCardSO.contentWrapper.isDisplayed()).toBe(true);
      });

      it("[PRPI-4051] should not display bet legs", async () => {
        expect(await betLegs.selections.length).toEqual(0);
      });
    });

    it("[PRPI-4052] should have 4 additional multiples", async () => {
      expect(await multiLinesMultiplesSO.multiples.length).toBe(4);
      expect(await firstMultipleControlsSO.lines.getText()).toBe("Treble (x4)");
      expect(await secondMultipleControlsSO.lines.getText()).toBe("Double (x6)");
      expect(await thirdMultipleControlsSO.lines.getText()).toBe("Yankee (x11)");
      expect(await fourthMultipleControlsSO.lines.getText()).toBe("Lucky 15 (x15)");
    });

    describe("and the user inserts a stake value in the multi line bet treble", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(firstMultiLineStakeInputField.numberField);

        await firstMultiLineStakeInputField.numberField.setValue(0.12);
        await hideKeyboard();
      });

      describe("when the user advances to confirm step", () => {
        beforeAll(async () => {
          await advanceToConfirmStep(confirmButtonsElements);

          await browser.waitUntilNotInDOM(secondMultipleControlsSO.element);
          await browser.waitUntilNotInDOM(thirdMultipleControlsSO.element);
          await browser.waitUntilNotInDOM(fourthMultipleControlsSO.element);
          await browser.waitUntilClickableNative(confirmButtonSO.element, "confirm button is not clickable");
        });

        it("[PRPI-4053] should display the confirm screen", async () => {
          expect(await confirmButtonSO.element.isDisplayed()).toBe(true);
          expect(await confirmButtonSO.element.isEnabled()).toBe(true);
        });

        it("[PRPI-4054] should display only a treble", async () => {
          expect(await oneLineMultipleCardSO.element.isDisplayed()).toBe(true);
          expect(await oneLineMultipleControlsSO.lines.getText()).toBe("Treble (x4)");
        });

        it("[PRPI-4055] should display one line multiples with 4 bet legs", async () => {
          expect(await betLegs.selections.length).toBe(4);
        });
      });

      describe("and one of the runners gets suspended", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getMarketPrices(SMP_MOCK_FIRST_UPDATE, { ignoreRequestedMarketIdsMatch: true }),
          );
          await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_FIRST_UPDATE_FAILURES));

          await browser.waitUntilDisplayed(placeNotification.element, "The notification is not displayed");
          await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
        });

        it("[PRPI-4056] should disable the confirm button", async () => {
          expect(await confirmButtonSO.element.isDisplayed()).toBe(true);
          expect(await confirmButtonSO.element.isEnabled()).toBe(false);
        });

        it("[PRPI-4057] should display availability notification", async () => {
          expect(await placeNotification.message.getText()).toBe("Odds and availability have changed");
        });
      });

      describe("and the user clicks the edit button", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(editButtonSO.element);

          await editButtonSO.element.click();
        });

        it("[PRPI-4058] should return to place potential step", async () => {
          await browser.waitUntilNotInDOM(confirmButtonSO.element, "confirm button still in DOM");
          await browser.waitUntilClickableNative(placeButtonSO.element);

          expect(await sportsbookPlacePanelSO.element.isDisplayed()).toBe(true);
          expect(await placeButtonSO.element.isDisplayed()).toBe(true);
          expect(await placeButtonSO.element.isEnabled()).toBe(true);
        });

        it("[PRPI-4059] should display market suspended notification", async () => {
          expect(await placeNotification.message.getText()).toBe("Market Suspended");
        });

        it("[PRPI-4060] should have one line multiple with a treble", async () => {
          expect(await oneLineMultipleControlsSO.element.isDisplayed()).toBe(true);
          expect(await oneLineMultipleControlsSO.betType.getText()).toEqual("Treble");
        });

        describe("and collapse one line multiple type before continue the journey", () => {
          beforeAll(async () => {
            await collapseOneLineMultiple();
          });

          it("[PRPI-4061] should display the collapsed chevron", async () => {
            expect(await oneLineMultipleCardSO.contentWrapper.isDisplayed()).toBe(true);
          });
        });

        it("[PRPI-4062] should have 3 additional multiples", async () => {
          expect(await multiLinesMultiplesSO.multiples.length).toBe(3);
          expect(await firstMultipleControlsSO.lines.getText()).toBe("Double (x3)");
          expect(await secondMultipleControlsSO.lines.getText()).toBe("Trixie (x4)");
          expect(await thirdMultipleControlsSO.lines.getText()).toBe("Patent (x7)");
        });

        describe("when the user adds a stake for another available bet", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(secondMultiLineStakeInputField.numberField);

            await secondMultiLineStakeInputField.numberField.setValue(1);
            await hideKeyboard();
          });

          describe("and the user advances to confirm step", () => {
            beforeAll(async () => {
              await advanceToConfirmStep(confirmButtonsElements);
            });

            it("[PRPI-4063] should display the confirm screen", async () => {
              await browser.waitUntilDisplayed(confirmButtonSO.element, "confirm button is not displayed");
              await browser.waitUntilClickableNative(confirmButtonSO.element, "confirm button is not clickable");

              expect(await editButtonSO.element.isDisplayed()).toBe(true);
              expect(await confirmButtonSO.element.isDisplayed()).toBe(true);
              expect(await confirmButtonSO.element.isEnabled()).toBe(true);
            });

            it("[PRPI-4063] should display only a trixie", async () => {
              expect(await betControlsSO.element.isDisplayed()).toBe(true);
              expect(await oneLineMultipleControlsSO.lines.getText()).toBe("Trixie (x4)");
            });

            it("[PRPI-4063] should display one line multiples with 3 bet legs", async () => {
              expect(await betLegs.selections.length).toEqual(3);
            });
          });

          describe("when the market opens again", () => {
            beforeAll(async () => {
              await Promise.all([
                mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
                mockService.mockHttpRequest(getImplyBetsResponse(FOURFOLD_MOCK)),
              ]);

              await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
            });

            it("[PRPI-4063] should disable confirm button and display availability notification", async () => {
              expect(await placeNotification.message.getText()).toBe("Odds and availability have changed");
              expect(await confirmButtonSO.element.isEnabled()).toBe(false);
            });
          });
        });
      });
    });

    describe("and the user clicks on edit button", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(editButtonSO.element, "edit button is not clickable");

        await editButtonSO.element.click();

        await browser.waitUntilNotInDOM(confirmButtonSO.element, "confirm button still in DOM");
        await browser.waitUntilClickableNative(placeButtonSO.element, "place button is not clickable");
      });

      it("[PRPI-4064] should return to place potential step", async () => {
        expect(await sportsbookPlacePanelSO.element.isDisplayed()).toBe(true);
        expect(await placeButtonSO.element.isDisplayed()).toBe(true);
        expect(await placeButtonSO.element.isEnabled()).toBe(true);
      });

      describe("and the user adds a stake value in one line multiple", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(
            oneLineMultiStakeInputField.numberField,
            "stake input field is not clickable",
          );
          await oneLineMultiStakeInputField.numberField.setValue(0.19);
          // await sportsbookPlacePanelSO.element
          await sportsbookPlacePanelSO.element.click();
          await swipeDownElement(sportsbookPlacePanelSO.element);
          await collapseOneLineMultiple();
        });

        describe("and the user adds a stake value in multi line multiple", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(
              firstMultiLineStakeInputField.numberField,
              "stake input field is not clickable",
            );
            await firstMultiLineStakeInputField.numberField.setValue(0.12);
            await hideKeyboard();
          });

          describe("and the user advances to confirm step", () => {
            beforeAll(async () => {
              await advanceToConfirmStep(confirmButtonsElements);

              await browser.waitUntilNotInDOM(secondMultipleControlsSO.element, "second multiple still in DOM");
              await browser.waitUntilNotInDOM(thirdMultipleControlsSO.element, "third multiple still in DOM");
              await browser.waitUntilNotInDOM(fourthMultipleControlsSO.element, "fourth multiple still in DOM");
              await browser.waitUntilClickableNative(confirmButtonSO.element, "confirm button is not clickable");
            });

            it("[PRPI-4065] should display the confirm screen", async () => {
              expect(await confirmButtonSO.element.isDisplayed()).toBe(true);
              expect(await confirmButtonSO.element.isEnabled()).toBe(true);
            });

            it("[PRPI-4065] should have one line multiple with 4 Fold", async () => {
              expect(await oneLineMultipleControlsSO.element.isDisplayed()).toBe(true);
              expect(await oneLineMultipleControlsSO.betType.getText()).toEqual("4 Fold");
            });

            it("[PRPI-4065] should display one line multiple bet legs only", async () => {
              expect(await betLegs.selections.length).toBe(4);
            });

            describe("and the user collapses one line multiple", () => {
              beforeAll(async () => {
                await collapseOneLineMultiple();
              });

              it("[PRPI-4065] should display the collapsed chevron", async () => {
                expect(await oneLineMultipleCardSO.contentWrapper.isDisplayed()).toBe(true);
              });

              it("[PRPI-4065] should display multi line multiple treble", async () => {
                expect(await multiLinesMultiplesSO.multiples.length).toBe(1);
                expect(await firstMultipleControlsSO.lines.getText()).toBe("Treble (x4)");
              });

              it("[PRPI-4065] should not display multi line multiple legs", async () => {
                expect(await betLegs.selections.length).toEqual(0);
              });
            });
          });
        });
      });
    });
  });
});
