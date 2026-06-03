const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { swipeUpElement, swipeUp, hideKeyboard } = require("../../../../../helpers/gestures");

const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  SportsbookPlacePanelSO,
  GenericScreenSO,
  SinglesCardSO,
  SingleSO,
  CardSO,
  SportsbookMarketSO,
  RunnerSO,
  BetslipDrawerSO,
  MinimizedSO,
  CurrencyNumberInputFieldSO,
  OptionSO,
  BetControlsSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const firstSportsbookMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
const secondSportsbookMarketSO = new SportsbookMarketSO(secondCardSO.sportsbookMarket);
const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);
const thirdRunnerSO = new RunnerSO(secondSportsbookMarketSO.runnerList[0]);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const singlesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const secondSingleSO = new SingleSO(singlesCardSO.singles[1]);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);
const firstCardItemEachWayOptionSO = new OptionSO(firstSingleSO.element);
const secondCardItemEachWayOptionSO = new OptionSO(secondSingleSO.element);
const sizeInputField = new CurrencyNumberInputFieldSO(firstSingleControlsSO.currencyInput);

const EVENT_TYPE_ID = 1;
const FIRST_EVENT_ID = 1;
const SECOND_EVENT_ID = 2;
const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      numberOfPlaces: 3,
      placeFraction: { numerator: 1, denominator: 5 },
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
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
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      numberOfPlaces: 3,
      placeFraction: { numerator: 1, denominator: 5 },
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "4",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
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
          noOdds: true,
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
        cardGroupTitle: "First Card",
        urn: `ppb:tbd:card:group:topEventsInSport:1`,
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${FIRST_EVENT_ID}`,
                  home: {
                    name: "Sporting",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Sporting Bilbao v Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${FIRST_EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Sporting v Man Utd",
                          urn: `ppb:event:${FIRST_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                          selectionId: 1,
                          name: "Sporting",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                      },
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
        cardGroupTitle: "Second Card",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${SECOND_EVENT_ID}`,
                  home: {
                    name: "Porto",
                  },
                  away: {
                    name: "West Ham",
                  },
                },
                sportevent: {
                  name: "Porto v West Ham",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${SECOND_EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Porto v West Ham",
                          urn: `ppb:event:${SECOND_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/4`,
                          selectionId: 4,
                          name: "Porto",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/5`,
                          selectionId: 5,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/6`,
                          selectionId: 6,
                          name: "West Ham",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/4`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/5`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/6`,
                      },
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

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
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
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  canPlaceEachwayBet: true,
  eachwayAvgOdds: {
    trueOdds: {
      decimalOdds: {
        decimalOdds: 1.5,
      },
    },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  eachwayPlaces: 4,
  placeFraction: {
    numerator: 1,
    denominator: 4,
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: SECOND_MARKET_ID,
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
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  canPlaceEachwayBet: true,
  eachwayAvgOdds: {
    trueOdds: {
      decimalOdds: {
        decimalOdds: 1.5,
      },
    },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: 4,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: {
      decimalOdds: 2,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  eachwayPlaces: 4,
  placeFraction: {
    numerator: 1,
    denominator: 4,
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
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 1.23,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.23 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

// TODO - Please have a look this regression test when the migration to XCode 13 is fully completed US827653
describe("Betslip - SBK place multiple single each way bet", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when the user adds two combinable selections", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await swipeUp(0.5); // swipe to the bottom of the screen to reveal last card
      await thirdRunnerSO.sbkBetButtons[0].click();
      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilEquals(secondCardItemEachWayOptionSO.title, "Each Way");
    });

    it("[PRPI-3502] should show two singles cards with each way available", async () => {
      expect(await singlesCardSO.singles.length).toBe(2);

      expect(await firstCardItemEachWayOptionSO.title.getText()).toBe("Each Way");
      expect(await firstCardItemEachWayOptionSO.subtitle.getText()).toBe("1/4 Odds, 4 Places");
      expect(await firstCardItemEachWayOptionSO.checkbox.getAttribute("wdSelected")).toBe("false");

      expect(await secondCardItemEachWayOptionSO.title.getText()).toBe("Each Way");
      expect(await secondCardItemEachWayOptionSO.subtitle.getText()).toBe("1/4 Odds, 4 Places");
      expect(await secondCardItemEachWayOptionSO.checkbox.getAttribute("wdSelected")).toBe("false");
    });

    describe("when the user adds a $2 stake to the first selection and taps EW checkbox", () => {
      beforeAll(async () => {
        await sizeInputField.numberField.setValue(2);
        await hideKeyboard();
        await swipeUpElement(sizeInputField.numberField, 100);
        await browser.waitUntilDisplayed(firstCardItemEachWayOptionSO.checkbox, "Waiting for each way checkbox");
        await browser.waitUntilClickableNative(firstCardItemEachWayOptionSO.checkbox);
        await firstCardItemEachWayOptionSO.checkbox.click();
        await browser.waitUntilEquals(firstSingleControlsSO.returns, "Returns $6.00");
      });

      it("[PRPI-3503] should show a $6 returns", async () => {
        expect(await firstSingleControlsSO.returns.getText()).toBe("Returns $6.00");
      });

      it("[PRPI-3504] should show a each way option selected", async () => {
        expect(await firstCardItemEachWayOptionSO.checkbox.getAttribute("wdSelected")).toBe("true");
      });

      it("[PRPI-3505] should show a 2x multiplier", async () => {
        expect(await sizeInputField.multiplier.getText()).toBe("2x");
      });

      describe("when the user taps each way toggle again on the first single", () => {
        beforeAll(async () => {
          await firstCardItemEachWayOptionSO.checkbox.click();
          await browser.waitUntilEquals(firstSingleControlsSO.returns, "Returns $4.00");
        });

        it("[PRPI-3506] should show a $4 returns", async () => {
          expect(await firstSingleControlsSO.returns.getText()).toBe("Returns $4.00");
        });

        it("[PRPI-3506] should show each way option selected", async () => {
          expect(await firstCardItemEachWayOptionSO.checkbox.getAttribute("wdSelected")).toBe("false");
        });

        it("[PRPI-3506] should not show a multiplier", async () => {
          expect(await sizeInputField.multiplier.isDisplayed()).toBe(false);
        });
      });
    });
  });
});
