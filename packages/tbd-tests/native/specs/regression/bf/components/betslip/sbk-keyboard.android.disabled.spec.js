const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const {
  getSportsLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  SingleSO,
  SinglesCardSO,
  BetControlsSO,
  CardSO,
  CurrencyNumberInputFieldSO,
  BetslipDrawerSO,
  KeyboardSO,
  SportsbookBetButtonSO,
  InlineSportsbookMarketSO,
  QuickStakesSO,
} = require("../../../../../screen-objects");

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const firstMarketSO = new InlineSportsbookMarketSO(firstCardSO.element);
const firstRunnerSO = new SportsbookBetButtonSO(firstMarketSO.sbkBetButtons[0]);

const keyboardSO = new KeyboardSO();

const placePanelSO = new SportsbookPlacePanelSO();

const singlesCardSO = new SinglesCardSO(placePanelSO.element);
const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);
const stakeInputFieldSO = new CurrencyNumberInputFieldSO(firstSingleControlsSO.currencyInput);
const quickStakesSO = new QuickStakesSO();

const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const secondMarketSO = new InlineSportsbookMarketSO(secondCardSO.element);
const secondRunnerSO = new SportsbookBetButtonSO(secondMarketSO.sbkBetButtons[0]);

const minimizedSO = new MinimizedSO();
const betslipDrawerSO = new BetslipDrawerSO();

const multipleControlsSO = new BetControlsSO(placePanelSO.multiples);
const multipleStakeSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const multiplesKeyboardSO = new KeyboardSO(placePanelSO.multiples);

const mockService = new MockService();

const EVENT_TYPE_ID = 7;
const FIRST_EVENT_ID = 1;
const SECOND_EVENT_ID = 2;
const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "First Card",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
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
                  home: { name: "FC Porto" },
                  away: { name: "FC Barcelona" },
                },
                sportevent: {
                  name: "FC Porto v FC Barcelona",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${FIRST_EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "Champions League",
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
                          name: "FC Porto v FC Barcelona",
                          urn: `ppb:event:${FIRST_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                          selectionId: 1,
                          name: "FC Porto",
                        },
                      ],
                    },
                    runners: [{ runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1` }],
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
                  home: { name: "FC Porto" },
                  away: { name: "Man Utd" },
                },
                sportevent: {
                  name: "FC Porto v Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${SECOND_EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "Champions League",
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
                          name: "FC Porto v Man Utd",
                          urn: `ppb:event:${SECOND_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/1`,
                          selectionId: 1,
                          name: "FC Porto",
                        },
                      ],
                    },
                    runners: [{ runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/1` }],
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

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.8 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [{ runners: [{ marketId: FIRST_MARKET_ID, selectionId: 1 }] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.8,
  winAverageOdds: 1.8,
  betType: "SINGLE",
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: { marketId: FIRST_MARKET_ID, selectionId: 1 },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.8 },
      fractionalDisplayOdds: { numerator: 1, denominator: 1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.8 },
    fractionalDisplayOdds: { numerator: 1, denominator: 1 },
  },
};

const SIB_SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [{ runners: [{ marketId: SECOND_MARKET_ID, selectionId: 1 }] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.2,
  winAverageOdds: 2.2,
  betType: "SINGLE",
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: { marketId: SECOND_MARKET_ID, selectionId: 1 },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.2 },
      fractionalDisplayOdds: { numerator: 1, denominator: 1 },
    },
    decimalDisplayOdds: { decimalOdds: 2.2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 1 },
  },
};

const SIB_MULTIPLES_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 3,
      winAverageOdds: 3,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: { decimalOdds: 3 },
        trueOdds: { decimalOdds: { decimalOdds: 3 } },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

describe("SBK Custom Keyboard", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));

    const url = "football/s-7";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when a selection is added to the betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstRunnerSO.element);
      await firstRunnerSO.element.click();
      await browser.waitUntilDisplayed(placePanelSO.element, "SportsbookPlacePanel not displayed");
      await browser.waitUntilDisplayed(keyboardSO.element, "Single keyboard not displayed");
    });

    it("[PRPI-3396] the single betslip is displayed", async () => {
      expect(await placePanelSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-3397] the keyboard is displayed", async () => {
      expect(await keyboardSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-3398] the quick stakes are displayed", async () => {
      expect(await quickStakesSO.element.isDisplayed()).toBe(true);
    });
  });

  describe("when a stake of 0.28 is added via keyboard", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(keyboardSO.zero);
      await keyboardSO.zero.click();
      await keyboardSO.separator.click();
      await keyboardSO.two.click();
      await keyboardSO.eight.click();
    });

    it("[PRPI-3399] the stake field should is populated with 0.28", async () => {
      expect(await stakeInputFieldSO.numberField.getText()).toBe("0.28");
    });
  });

  describe("when backspace is pressed once on the keyboard", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(keyboardSO.delete);
      await keyboardSO.delete.click();
      await browser.waitUntilEquals(stakeInputFieldSO.numberField, "0.2");
    });

    it("[PRPI-3400] the stake field is populated with 0.2", async () => {
      expect(await stakeInputFieldSO.numberField.getText()).toBe("0.2");
    });
  });

  describe("when adding another selection to the betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await browser.waitUntilDisplayed(minimizedSO.element, "Minimized Betslip not displayed");

      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MULTIPLES_MOCK));
      await secondRunnerSO.element.click();
      await browser.waitUntilEquals(minimizedSO.counter, "2");

      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(placePanelSO.element, "Place Panel not displayed");
    });

    describe("When multiples stake field is pressed", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(multipleStakeSO.numberField);
        await multipleStakeSO.numberField.click();
        await browser.waitUntilDisplayed(multiplesKeyboardSO.element, "Multiple keyboard not displayed");
      });

      it("[PRPI-3401] The keyboard should display", async () => {
        expect(await keyboardSO.element.isDisplayed()).toBe(true);
      });
    });

    describe("When a stake of 1.79 is added via keyboard", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(keyboardSO.one);
        await keyboardSO.one.click();
        await keyboardSO.separator.click();
        await keyboardSO.seven.click();
        await keyboardSO.nine.click();

        await browser.waitUntilEquals(multipleStakeSO.numberField, "1.79");
      });

      it("[PRPI-3402] The stake field is populated with 1.79", async () => {
        expect(await multipleStakeSO.numberField.getText()).toBe("1.79");
      });
    });
  });
});
