const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout, getGenericLayout, getAppContext } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { swipeUp } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  CardSO,
  BetslipDrawerSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  PrimaryButtonSO,
  StyledSO,
  BetControlsSO,
  CurrencyNumberInputFieldSO,
} = require("../../../../../screen-objects");

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const firstSbkMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const secondSbkMarketSO = new InlineSportsbookMarketSO(secondCardSO.contentWrapper);
const firstSbkRunnerSO = new SportsbookBetButtonSO(firstSbkMarketSO.sbkBetButtons[0]);
const secondSbkRunnerSO = new SportsbookBetButtonSO(secondSbkMarketSO.sbkBetButtons[0]);
const minimizedSO = new MinimizedSO();
const accaTitleSO = new StyledSO(minimizedSO.element);
const betslipDrawerSO = new BetslipDrawerSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const placeButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.element);
const betControlsSO = new BetControlsSO();
const sportsbookStakeInputField = new CurrencyNumberInputFieldSO(betControlsSO.currencyInput);

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: "4",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "5",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "6",
          runnerOdds: {
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
                  name: "Team A vs Team B ",
                  urn: "ppb:event:29359895",
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
                      urn: "ppb:sbkMarket:924.1",
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
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team B",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Team A",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.1/1" },
                      { runnerURN: "ppb:sbkRunner:924.1/2" },
                      { runnerURN: "ppb:sbkRunner:924.1/3" },
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
                  name: "Team A 2 vs Team B 2",
                  urn: "ppb:event:29359896",
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
                      urn: "ppb:sbkMarket:924.2",
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
                          runnerURN: "ppb:sbkRunner:924.2/4",
                          selectionId: 4,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/5",
                          selectionId: 5,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/6",
                          selectionId: 6,
                          name: "Team A 2",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.2/4" },
                      { runnerURN: "ppb:sbkRunner:924.2/5" },
                      { runnerURN: "ppb:sbkRunner:924.2/6" },
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
  ],
};

const HOME_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "/view/generic:home",
  edges: [...BFF_MOCK.edges],
  partialEdges: [...BFF_MOCK.partialEdges],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.1,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 4,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.2",
    selectionId: 4,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.1,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      numLines: 1,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const APP_CONTEXT_MOCK = {
  loggedIn: "false",
};

const MODULE_NAME = "betslip_sbk_user_logged_out";

describe("Betslip - Sportsbook Logged Out Experience", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await startApp("home");
  });

  describe("When a logged out user clicks on a bet button", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstSbkRunnerSO.element);
      await firstSbkRunnerSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Selection hasn't been added");
      await browser.waitUntilDisplayed(placeButtonSO.element, "Place button is not visible");
    });

    it("[PRPI-4888]_should_display_single_betslip_with_place_button_with_please_enter_stake_text", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4888]_should_display_single_betslip_with_place_button_with_please_enter_stake_text`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });

    describe("and the user adds a stake", () => {
      beforeAll(async () => {
        await sportsbookStakeInputField.numberField.setValue(2);
        await browser.waitUntilEquals(sportsbookStakeInputField.numberField, "2");
        await browser.waitUntilEquals(
          placeButtonSO.label,
          "Login to Place Bet",
          "Place button label is not equal to 'Login to Place Bet'",
        );
      });

      it("[PRPI-4889]_should_display_single_betslip_with_place_button_with_login_to_place_bet_text", async () => {
        expect(
          (
            await browser.compareScreen(
              `${MODULE_NAME}_[PRPI-4889]_should_display_single_betslip_with_place_button_with_login_to_place_bet_text`,
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });

      afterAll(async () => {
        await sportsbookStakeInputField.numberField.setValue(0);
        await browser.waitUntilEquals(
          placeButtonSO.label,
          "Please Enter Stake",
          "Place button label is not equal to 'Please Enter Stake'",
        );
      });
    });
  });

  describe("When the user clicks on another bet button and expands the betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();

      await browser.waitUntilNotDisplayed(sportsbookPlacePanelSO.element, "Singles panel hasn't been minimized");

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await swipeUp(0.5); // swipe to the bottom of the screen to reveal last card

      await browser.waitUntilClickableNative(secondSbkRunnerSO.element);
      await secondSbkRunnerSO.element.click();

      await browser.waitUntilEquals(
        accaTitleSO.title,
        "$10.00 Double @ 2.4 returns $24.00",
        "2 Leg multiple was not combined",
      );

      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Multiples panel hasn't been expanded");
      await browser.waitUntilEquals(
        placeButtonSO.label,
        "Please Enter Stake",
        "Place button label is not equal to 'Please Enter Stake'",
      );
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4890]_should_display_multiple_betslip_with_place_button_with_please_enter_stake_text`,
      );
    });

    it("[PRPI-4890]_should_display_multiple_betslip_with_place_button_with_please_enter_stake_text", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4890]_should_display_multiple_betslip_with_place_button_with_please_enter_stake_text`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });

    describe("and the user adds a stake", () => {
      beforeAll(async () => {
        await sportsbookStakeInputField.numberField.setValue(0.21);
        await browser.waitUntilEquals(sportsbookStakeInputField.numberField, "0.21");
        await browser.waitUntilEquals(
          placeButtonSO.label,
          "Login to Place Bet",
          "Place button label is not equal to 'Login to Place Bet'",
        );
      });

      it("[PRPI-4891]_should_display_multiple_betslip_with_place_button_with_login_to_place_bet_text", async () => {
        expect(
          (
            await browser.compareScreen(
              `${MODULE_NAME}_[PRPI-4891]_should_display_multiple_betslip_with_place_button_with_login_to_place_bet_text`,
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
