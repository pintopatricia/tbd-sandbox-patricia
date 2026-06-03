const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const {
  getEventLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { swipeUpElement, swipeDownElement } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  MinimizedSO,
  PromoButtonSO,
  SportsbookPlacePanelSO,
  SportsbookReceiptPanelSO,
  GenericScreenSO,
  MultiplesCardSO,
  SinglesCardSO,
  SingleSO,
  CardSO,
  RunnerSO,
  SportsbookMarketSO,
  BetslipDrawerSO,
  BetControlsSO,
  AlertSO,
  PNLAndWhatIfSO,
  CurrencyNumberInputFieldSO,
  BetsSummarySO,
  ExtraWalletCardGroupSO,
  ExtraWalletCardSO,
  PrimaryButtonSO,
  OptionSO,
  GenerosityWalletSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const firstSportsbookMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
const secondSportsbookMarketSO = new SportsbookMarketSO(secondCardSO.sportsbookMarket);
const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);
const secondRunnerSO = new RunnerSO(secondSportsbookMarketSO.runnerList[0]);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const multiplesCardSO = new MultiplesCardSO(sportsbookPlacePanelSO.collapsableSections[0]);
const multipleControlsSO = new BetControlsSO(multiplesCardSO.element);
const multipleGenerosityWalletButtonSO = new PromoButtonSO(multipleControlsSO.generosityWalletButton);
const multipleGenerosityWalletAlertSO = new AlertSO(multipleControlsSO.generosityAlertMessage);
const multipleCurrencyNumberFieldSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const multipleControlsReturnValuesSO = new PNLAndWhatIfSO(multipleControlsSO.returnsValueContainer);
const singlesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);
const firstSingleGenerosityWalletButtonSO = new PromoButtonSO(firstSingleControlsSO.generosityWalletButton);
const secondSingleSO = new SingleSO(singlesCardSO.singles[1]);
const secondSingleControlsSO = new BetControlsSO(secondSingleSO.controls);
const secondSingleGenerosityWalletButtonSO = new PromoButtonSO(secondSingleControlsSO.generosityWalletButton);
const receiptPanel = new SportsbookReceiptPanelSO();
const multipleOddsBoostAlertSO = new AlertSO(receiptPanel.multiples[0]);
const sportsbookReceiptSummarySO = new BetsSummarySO(receiptPanel.summary);
const summarySO = new BetsSummarySO();
const extraWalletCardGroupSO = new ExtraWalletCardGroupSO();
const firstExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[0]);
const firstExtraWalletCardOptionSO = new OptionSO(firstExtraWalletCardSO.walletOption);
const generosityWalletApplyButtonSO = new PrimaryButtonSO();
const generosityWalletSO = new GenerosityWalletSO();
const multipleStartingPriceOptionSO = new OptionSO(multipleControlsSO.startingPrice);

const EVENT_TYPE_ID = 1;
const FIRST_EVENT_ID = 1;
const SECOND_EVENT_ID = 2;
const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
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
      runnerDetails: [
        {
          selectionId: "4",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.1 },
            },
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "5",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.2 },
            },
            decimalDisplayOdds: { decimalOdds: 2.2 },
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
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
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
                  name: "Home Team vs Away Team",
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
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/2`,
                          selectionId: 2,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/3`,
                          selectionId: 3,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/2`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/3`,
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
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
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
                  name: "Home Team vs Away Team",
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
  tokens: {
    priceBoostTokens: [
      {
        id: "11331122",
        numberOfTokens: 1,
        generosity: 2,
        boostPrice: {
          trueOdds: {
            decimalOdds: { decimalOdds: 1.2 },
          },
          decimalDisplayOdds: {
            decimalOdds: 2.2,
          },
          fractionalDisplayOdds: {
            numerator: 1,
            denominator: 2,
          },
        },
        maxStake: 10,
      },
    ],
  },
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
    marketId: FIRST_MARKET_ID,
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  availablePriceTypes: ["STARTING_PRICE"],
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
  averageOdds: 2.1,
  winAverageOdds: 2.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.1 },
    },
    decimalDisplayOdds: { decimalOdds: 2.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  tokens: {
    priceBoostTokens: [
      {
        id: "11331122",
        numberOfTokens: 1,
        generosity: 2,
        boostPrice: {
          trueOdds: {
            decimalOdds: { decimalOdds: 1.2 },
          },
          decimalDisplayOdds: {
            decimalOdds: 2.2,
          },
          fractionalDisplayOdds: {
            numerator: 1,
            denominator: 2,
          },
        },
        maxStake: 10,
      },
    ],
  },
  availablePriceTypes: ["STARTING_PRICE"],
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: 4,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 2.1,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  availablePriceTypes: ["STARTING_PRICE"],
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
      hasBonusMoney: true,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      tokens: {
        priceBoostTokens: [
          {
            id: "11331122",
            numberOfTokens: 1,
            generosity: 2,
            boostPrice: {
              trueOdds: {
                decimalOdds: { decimalOdds: 1.2 },
              },
              decimalDisplayOdds: {
                decimalOdds: 2.2,
              },
              fractionalDisplayOdds: {
                numerator: 1,
                denominator: 2,
              },
            },
            maxStake: 10,
          },
        ],
      },
      availablePriceTypes: ["STARTING_PRICE"],
    },
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      betModifiers: ["PRICE_BOOST"],
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
        },
        {
          runner: { marketId: "924.2", selectionId: 4 },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
          winOdds: { decimalDisplayOdds: { decimalOdds: 0.2 } },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.2", selectionId: 4 } }],
            winOdds: { decimalDisplayOdds: { decimalOdds: 0.4 } },
          },
        },
      ],

      betType: "DOUBLE",
      totalStake: 0.12,
      totalPotentialWin: 2.5,
      originalTotalPotentialWin: 0.29,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2.4 } },
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 2.0 } },
    },
  ],
};

const BFF_FETCH_CARDS_MOCK = {
  cards: [
    {
      __typename: "ExtraWalletCardGroup",
      urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
      amount: 10.0,
      helpUrl: "thisisahelpurl",
      full: {
        edges: [
          {
            node: {
              __typename: "ExtraWalletCard",
              urn: `ppb:tbd:card:extraWalletCard:11331122#1`,
              badges: [],
              extraWallet: {
                __typename: "ExtraWallet",
                urn: `ppb:extraWallet:11331122`,
                walletId: `11331122`,
                indexedId: `11331122#1`,
                amount: 1,
                walletType: "PRICE_BOOST_TOKEN",
              },
              restrictions: {
                __typename: "WalletRestrictions",
                single: "false",
                acca: "false",
                sameGameMulti: "false",
              },
            },
            __typename: "ExtraWalletCardGroupEdge",
          },
        ],

        __typename: "ExtraWalletCardGroupConnection",
      },
    },
  ],
};

describe("Betslip - SBK Price Boost Multiples", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));

    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("When the user adds 2 selections to the betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));

      await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );

      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));

      await swipeUpElement(firstRunnerSO.element, 700);

      await browser.waitUntilClickableNative(secondRunnerSO.sbkBetButtons[0]);
      await secondRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilEquals(minimizedSO.counter, "2");

      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Waiting for Sportsbook place panel element");
    });

    describe("and then the user has two Price Boosts", () => {
      it("[PRPI-4100] should display the generosity wallet button on the double", async () => {
        expect(await multipleGenerosityWalletButtonSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4101] should display the generosity wallet button on each single", async () => {
        await swipeUpElement(multipleGenerosityWalletButtonSO.element, 500);

        expect(await firstSingleGenerosityWalletButtonSO.element.isDisplayed()).toBe(true);
        await swipeUpElement(firstSingleSO.element, 500);

        expect(await secondSingleGenerosityWalletButtonSO.element.isDisplayed()).toBe(true);
      });

      describe("and then the user clicks on the generosity wallet button on the double and applies a price boost token", () => {
        beforeAll(async () => {
          await swipeDownElement(firstSingleSO.element, 500);
          await multipleGenerosityWalletButtonSO.element.click();
          await firstExtraWalletCardOptionSO.checkbox.click();
          await generosityWalletApplyButtonSO.element.click();

          await browser.waitUntil(
            async () => (await multipleGenerosityWalletButtonSO.element.getAttribute("selected")) === "true",
          );
        });

        it("[PRPI-4718] should display the generosity wallet button as selected on the double and the alert with the '2% Bet Boost Applied' label", async () => {
          await browser.waitUntilEquals(multipleGenerosityWalletAlertSO.message, "2% Bet Boost Applied");
          expect(await multipleGenerosityWalletButtonSO.element.getAttribute("selected")).toBe("true");
          expect(await multipleGenerosityWalletAlertSO.message.getText()).toBe("2% Bet Boost Applied");
        });

        it("[PRPI-4719] should display the generosity wallet button as not selected and enabled on the singles", async () => {
          expect(await firstSingleGenerosityWalletButtonSO.element.getAttribute("selected")).toBe("false");
          expect(await firstSingleGenerosityWalletButtonSO.element.isEnabled()).toBe(true);
        });

        describe("and then the user clicks on the starting price toggle", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(multipleStartingPriceOptionSO.checkbox);
            await multipleStartingPriceOptionSO.checkbox.click();
            await browser.waitUntil(
              async () => (await multipleGenerosityWalletButtonSO.element.getAttribute("selected")) === "false",
            );
          });

          it("[PRPI-4720] should deselect the promo button and select starting price", async () => {
            expect(await multipleGenerosityWalletButtonSO.element.getAttribute("selected")).toBe("false");
            expect(await multipleGenerosityWalletAlertSO.element.isDisplayed()).toBe(false);

            expect(await multipleStartingPriceOptionSO.checkbox.isSelected()).toBe(true);
            expect(await multipleStartingPriceOptionSO.checkbox.isEnabled()).toBe(true);
          });

          describe("and then the user tries to select price boost tokens again with starting price selected", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(multipleGenerosityWalletButtonSO.element);
              await multipleGenerosityWalletButtonSO.element.click();
            });

            it("[PRPI-4721] should display all the price boost token wallets as unselected and disabled", async () => {
              expect(await firstExtraWalletCardOptionSO.checkbox.isSelected()).toBe(false);
              expect(await firstExtraWalletCardOptionSO.checkbox.isEnabled()).toBe(false);
            });

            describe("and then the user deselects the starting price and applies a price boost token again", () => {
              beforeAll(async () => {
                // Close the generosity wallet
                await browser.waitUntilClickableNative(generosityWalletSO.closeButton);
                await generosityWalletSO.closeButton.click();

                // Deselect starting price
                await browser.waitUntilClickableNative(multipleStartingPriceOptionSO.checkbox);
                await multipleStartingPriceOptionSO.checkbox.click();

                // Apply price boost token again
                await multipleGenerosityWalletButtonSO.element.click();
                await firstExtraWalletCardSO.element.click();
                await generosityWalletApplyButtonSO.element.click();
              });

              it("[PRPI-4722] should display the generosity wallet button as selected on the double and the alert with the '2% Bet Boost Applied' label", async () => {
                await browser.waitUntilEquals(multipleGenerosityWalletAlertSO.message, "2% Bet Boost Applied");
                expect(await multipleGenerosityWalletButtonSO.element.getAttribute("selected")).toBe("true");
                expect(await multipleGenerosityWalletAlertSO.message.getText()).toBe("2% Bet Boost Applied");
              });

              describe("and then the user adds stake to the double", () => {
                beforeAll(async () => {
                  await browser.waitUntilClickableNative(multipleCurrencyNumberFieldSO.element);
                  await multipleCurrencyNumberFieldSO.element.click();
                  await multipleCurrencyNumberFieldSO.setValue("0.12");
                });

                it("[PRPI-4723] should update the returns values on the selection level", async () => {
                  expect(await multipleControlsReturnValuesSO.previousPnl.getText()).toBe("$0.29");
                  expect(await multipleControlsReturnValuesSO.pnl.getText()).toBe("$0.26");
                });

                it("[PRPI-4724] should update the returns values on the betslip level", async () => {
                  expect(await summarySO.totalReturnsValue.getText()).toBe("$0.26");
                });

                describe("and then the user places bets", () => {
                  beforeAll(async () => {
                    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
                    await sportsbookPlacePanelSO.place.click();
                    await browser.waitUntilDisplayed(receiptPanel.element);
                    await swipeUpElement(receiptPanel.element);
                  });

                  it("[PRPI-4104] should display that the multiple is place is Price Boost", async () => {
                    expect(await multipleOddsBoostAlertSO.message.getText()).toBe("Bet Boost Applied");
                  });

                  it("[PRPI-4105] should display the correct returns on the receipt panel", async () => {
                    expect(await sportsbookReceiptSummarySO.previousTotalReturnsValue.getText()).toBe("$0.29");
                    expect(await sportsbookReceiptSummarySO.totalReturnsValue.getText()).toBe("$2.50");
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
