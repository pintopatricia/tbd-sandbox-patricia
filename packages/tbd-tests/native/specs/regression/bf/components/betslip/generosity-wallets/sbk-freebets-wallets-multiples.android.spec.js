const {
  SIB: { getImplyBetsResponse },
  SMP: { getMarketPrices },
  WALLET: { getWallets },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const {
  getEventLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const {
  AlertSO,
  BetControlsSO,
  ExtraWalletCardGroupSO,
  ExtraWalletCardSO,
  FreeBetsSO,
  GenerosityWalletSO,
  OptionSO,
  PlaceFooterSO,
  PromoButtonSO,
  PrimaryButtonSO,
  RunnerSO,
  SportsbookMarketSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  MinimizedSO,
  GenericScreenSO,
  SportsbookPlacePanelSO,
  SinglesCardSO,
  SingleSO,
  CardSO,
} = require("../../../../../../screen-objects");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { getStartViewLink } = require("../../../../../../helpers/view-link-start");
const { startApp } = require("../../../../../../helpers/urls");
const { swipeUpElementFullscreen } = require("../../../../../../helpers/gestures");

const mockService = new MockService();

const eventPageSO = new GenericScreenSO();

const betslipDrawerSO = new BetslipDrawerSO();
const minimizedBetslipSO = new MinimizedSO();

const firstSportsbookMarketSO = new SportsbookMarketSO(eventPageSO.cards[0]);
const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);
const firstSbkRunnerButtonSO = new SportsbookBetButtonSO(firstRunnerSO.sbkBetButtons[0]);

const secondSportsbookMarketSO = new SportsbookMarketSO(eventPageSO.cards[1]);
const secondRunnerSO = new RunnerSO(secondSportsbookMarketSO.runnerList[0]);

const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const freeBetsSO = new FreeBetsSO();

const multiplesCardSO = new CardSO(sportsbookPlacePanelSO.collapsableSections[0]);
const singlesCardWrapperSO = new CardSO(sportsbookPlacePanelSO.collapsableSections[1]);

const doubleBetControlsSO = new BetControlsSO(multiplesCardSO.contentWrapper);
const doubleGenerosityWalletButtonSO = new PromoButtonSO(doubleBetControlsSO.generosityWalletButton);
const doubleFreeBetsWalletsAlertSO = new AlertSO(multiplesCardSO.alert);

const singlesCardSO = new SinglesCardSO();
const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const secondSingleSO = new SingleSO(singlesCardSO.singles[1]);

const firstSingleBetControlsSO = new BetControlsSO(firstSingleSO.element);
const firstSingleGenerosityWalletButtonSO = new PromoButtonSO(firstSingleBetControlsSO.generosityWalletButton);
const firstSingleFreeBetsWalletsAlertSO = new AlertSO(firstSingleSO.alert);

const secondSingleBetControlsSO = new BetControlsSO(secondSingleSO.element);
const secondSingleGenerosityWalletButtonSO = new PromoButtonSO(secondSingleBetControlsSO.generosityWalletButton);
const secondSingleFreeBetsWalletsAlertSO = new AlertSO(secondSingleSO.alert);

const placeFooterSO = new PlaceFooterSO();
const freeBetsWalletsAlertPlaceFooterSO = new AlertSO(placeFooterSO.freeBetsWalletsAlert);

const placeButtonSO = new PrimaryButtonSO();

const generosityWalletSO = new GenerosityWalletSO();
const generosityWalletApplyButtonSO = new PrimaryButtonSO();

const extraWalletCardGroupSO = new ExtraWalletCardGroupSO();

const firstExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[0]);
const secondExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[1]);
const thirdExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[2]);
const fourthExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[3]);
const fifthExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[4]);
const sixthExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[5]);
const seventhExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[6]);

const freeBetsAmountOptionSO = new OptionSO(extraWalletCardGroupSO.generosityAmountOption);
const firstExtraWalletCardOptionSO = new OptionSO(firstExtraWalletCardSO.walletOption);
const secondExtraWalletCardOptionSO = new OptionSO(secondExtraWalletCardSO.walletOption);
const thirdExtraWalletCardOptionSO = new OptionSO(thirdExtraWalletCardSO.walletOption);

const EVENT_ID = "22222222";
const MARKET_ID_1 = "924.22222222";
const MARKET_ID_2 = "924.33333333";

const SELECTION_ID_1 = 11111;
const SELECTION_ID_2 = 22222;
const SELECTION_ID_3 = 33333;
const SELECTION_ID_4 = 44444;
const SELECTION_ID_5 = 55555;
const SELECTION_ID_6 = 66666;

const WALLETS = [
  { id: 20000000001, amount: 2 },
  { id: 20000000002, amount: 3 },
  { id: 20000000003, amount: 5 },
  { id: 20000000004, amount: 7 },
  { id: 20000000005, amount: 10 },
  { id: 20000000006, amount: 13 },
  { id: 20000000007, amount: 1 },
  { id: 20000000008, amount: 20 },
];

const BFF_EVENT_PAGE_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}:MATCH_ODDS`,
        cardTitle: "Match Odds",
        displayRunners: {
          sportsbook: {
            runners: [
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/${SELECTION_ID_1}`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/${SELECTION_ID_2}`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/${SELECTION_ID_3}`,
              },
            ],

            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${MARKET_ID_1}`,
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/${SELECTION_ID_1}`,
                  selectionId: SELECTION_ID_1,
                  name: "Wolves",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/${SELECTION_ID_2}`,
                  selectionId: SELECTION_ID_2,
                  name: "The Draw",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/${SELECTION_ID_3}`,
                  selectionId: SELECTION_ID_3,
                  name: "Man Utd",
                },
              ],
            },
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}:MATCH_ODDS_V2`,
        cardTitle: "Match Odds",
        displayRunners: {
          sportsbook: {
            runners: [
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_4}`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_5}`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_6}`,
              },
            ],

            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${MARKET_ID_2}`,
              noLiveData: true,
              name: "Match Odds V2",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_4}`,
                  selectionId: SELECTION_ID_4,
                  name: "Wolves V2",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_5}`,
                  selectionId: SELECTION_ID_5,
                  name: "The Draw V2",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_6}`,
                  selectionId: SELECTION_ID_6,
                  name: "Man Utd V2",
                },
              ],
            },
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}:MATCH_ODDS`,
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}:MATCH_ODDS_V2`,
      },
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
        edges: WALLETS.map(({ id, amount, expirationDate }) => ({
          node: {
            __typename: "ExtraWalletCard",
            urn: `ppb:tbd:card:extraWalletCard:${id}`,
            badges: [],
            extraWallet: {
              __typename: "ExtraWallet",
              urn: `ppb:extraWallet:${id}`,
              walletId: `${id}`,
              indexedId: `${id}`,
              amount,
              expirationDate,
              walletType: "BONUS_CASH",
            },
            restrictions: {
              __typename: "WalletRestrictions",
              single: "false",
              acca: "false",
              sameGameMulti: "false",
            },
          },
          __typename: "ExtraWalletCardGroupEdge",
        })),
        __typename: "ExtraWalletCardGroupConnection",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID_1,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: SELECTION_ID_1,
        },
      ],
    },
    {
      marketId: MARKET_ID_1,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: SELECTION_ID_2,
        },
      ],
    },
    {
      marketId: MARKET_ID_1,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: SELECTION_ID_3,
        },
      ],
    },
    {
      marketId: MARKET_ID_2,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: SELECTION_ID_4,
        },
      ],
    },
    {
      marketId: MARKET_ID_2,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: SELECTION_ID_5,
        },
      ],
    },
    {
      marketId: MARKET_ID_2,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: SELECTION_ID_6,
        },
      ],
    },
  ],
};

const SINGLE_BET_COMBINATION_MARKET_1 = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID_1,
          selectionId: SELECTION_ID_1,
        },
      ],
    },
  ],

  winAverageOdds: 1.2,
  winAvgOdds: {
    decimalDisplayOdds: { decimalOdds: 1.2 },
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
  },
  averageOdds: 1.2,
  hasBonusMoney: true,
  applicableWallets: WALLETS.map(({ id }) => id).slice(0, WALLETS.length - 1),
};

const SINGLE_BET_COMBINATION_MARKET_2 = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID_2,
          selectionId: SELECTION_ID_4,
        },
      ],
    },
  ],

  winAverageOdds: 1.2,
  winAvgOdds: {
    decimalDisplayOdds: { decimalOdds: 1.2 },
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
  },
  averageOdds: 1.2,
  hasBonusMoney: true,
  applicableWallets: WALLETS.map(({ id }) => id).slice(0, WALLETS.length - 3),
};

const DOUBLE_BET_COMBINATION_MARKET_1_2 = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID_1,
          selectionId: SELECTION_ID_1,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
    {
      runners: [
        {
          marketId: MARKET_ID_2,
          selectionId: SELECTION_ID_4,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  winAverageOdds: 1.2,
  winAvgOdds: {
    decimalDisplayOdds: { decimalOdds: 1.2 },
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
  },
  averageOdds: 1.2,
  combinationGroup: 1,
  isSGM: true,
  features: ["SGM"],
  hasBonusMoney: true,
  applicableWallets: WALLETS.map(({ id }) => id).slice(0, WALLETS.length - 4),
  betType: "DOUBLE",
};

const FIRST_SELECTION_ODDS = {
  runner: {
    marketId: MARKET_ID_1,
    selectionId: SELECTION_ID_1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FOURTH_SELECTION_ODDS = {
  runner: {
    marketId: MARKET_ID_2,
    selectionId: SELECTION_ID_4,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SIB_MOCK_1_RUNNER = {
  betCombinations: [SINGLE_BET_COMBINATION_MARKET_1],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SELECTION_ODDS],
  wallets: WALLETS.map(({ id, amount }) => ({
    walletId: id,
    amount,
    redeemable: "false",
    type: "BONUS_CASH",
  })),
};

const SIB_MOCK_2_RUNNERS = {
  betCombinations: [
    DOUBLE_BET_COMBINATION_MARKET_1_2,
    SINGLE_BET_COMBINATION_MARKET_1,
    SINGLE_BET_COMBINATION_MARKET_2,
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SELECTION_ODDS, FOURTH_SELECTION_ODDS],
  wallets: WALLETS.map(({ id, amount }) => ({
    walletId: id,
    amount,
    redeemable: "false",
    type: "BONUS_CASH",
  })),
};

const WALLET_MOCK = [
  { amount: "100.00", walletName: "MAIN" },
  { amount: "61.00", walletName: "SPORTSBOOK_BONUS" },
];

describe("SBK Generosity Wallet - Multiples", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_1_RUNNER));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_2_RUNNERS));

    const HOME_VIEW_LINK = getStartViewLink(`sport/competition/event/e-${EVENT_ID}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));
    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when a user with available free bets wallets opens a betslip with two selections", () => {
    beforeAll(async () => {
      // Add First Selection
      await browser.waitUntilEquals(firstSbkRunnerButtonSO.odd, "1.1");
      await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Sportsbook betslip not displayed");

      // Minimize the betslip
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await browser.waitUntilDisplayed(minimizedBetslipSO.element, "Sportsbook minimized betslip not displayed");

      // Add Second Selection
      await browser.waitUntilClickableNative(secondRunnerSO.sbkBetButtons[0]);
      await secondRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilEquals(minimizedBetslipSO.counter, "2", "Second Selection not added to betslip");

      // Expand the betslip
      await browser.waitUntilClickableNative(minimizedBetslipSO.element);
      await minimizedBetslipSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Sportsbook betslip not expanded");
    });

    it("[PRPI-4168] should not display the use bonus checkbox", async () => {
      expect(await freeBetsSO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-4169] should display the SINGLES and BET BUILDER sections", async () => {
      expect(await sportsbookPlacePanelSO.collapsableSections.length).toBe(2);
      expect(await singlesCardWrapperSO.title.isDisplayed()).toBe(true);
      expect(await singlesCardWrapperSO.title.getText()).toBe("SINGLES");

      expect(await multiplesCardSO.title.isDisplayed()).toBe(true);
      expect(await multiplesCardSO.title.getText()).toBe("BET BUILDER");
    });

    it("[PRPI-4170] should display the DOUBLE bet controls generosity button unselected", async () => {
      expect(await doubleGenerosityWalletButtonSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-4171] should not display the DOUBLE a generosity alert", async () => {
      expect(await doubleFreeBetsWalletsAlertSO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-4172] should display a disabled place bet button with the 'Place Bet' text", async () => {
      expect(await placeButtonSO.element.isDisplayed()).toBe(true);
      expect(await placeButtonSO.element.isEnabled()).toBe(false);
      expect(await placeButtonSO.label.getText()).toBe("Place Bet");
    });

    /* DOUBLE */
    describe("and clicks on the DOUBLE Generosity Wallets promo button", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(doubleGenerosityWalletButtonSO.element);
        await doubleGenerosityWalletButtonSO.element.click();
        await browser.waitUntilDisplayed(
          generosityWalletSO.element,
          "Generosity Wallets Bottom Sheet is not displayed",
        );
      });

      it("[PRPI-4173] should display the Generosity Wallets Bottom Sheet", async () => {
        expect(await generosityWalletSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4174] should display an option with an icon and 'You have $17.00 in Free Bets' label", async () => {
        expect(await freeBetsAmountOptionSO.element.isDisplayed()).toBe(true);
        expect(await freeBetsAmountOptionSO.icon.isDisplayed()).toBe(true);
        expect(await freeBetsAmountOptionSO.title.getText()).toBe("You have $17.00 in Free Bets");
      });

      it("[PRPI-4175] should display 4 wallets", async () => {
        expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(4);

        expect(await firstExtraWalletCardSO.element.isDisplayed()).toBe(true);
        expect(await secondExtraWalletCardSO.element.isDisplayed()).toBe(true);
        expect(await thirdExtraWalletCardSO.element.isDisplayed()).toBe(true);
        expect(await fourthExtraWalletCardSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4176] should display a disabled apply button with an 'Apply' label", async () => {
        expect(await generosityWalletSO.footerContent.isDisplayed()).toBe(true);
        expect(await generosityWalletApplyButtonSO.element.isDisplayed()).toBe(true);
        expect(await generosityWalletApplyButtonSO.element.isEnabled()).toBe(false);
        expect(await generosityWalletApplyButtonSO.label.getText()).toBe("Apply");
      });

      describe("and selects the first wallet", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(firstExtraWalletCardOptionSO.checkbox);
          await firstExtraWalletCardOptionSO.checkbox.click();
          await browser.waitUntil(
            async () => (await firstExtraWalletCardOptionSO.checkbox.getAttribute("selected")) === "true",
          );
        });

        it("[PRPI-4177] should display an enabled apply button with 'Apply $2.00 Free Bet' label", async () => {
          expect(await generosityWalletApplyButtonSO.element.isEnabled()).toBe(true);
          expect(await generosityWalletApplyButtonSO.label.getText()).toBe("Apply $2.00 Free Bet");
        });

        describe("and applies the wallets", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(generosityWalletApplyButtonSO.element);
            await generosityWalletApplyButtonSO.element.click();
            await browser.waitUntilNotDisplayed(
              extraWalletCardGroupSO.element,
              "Free Bets Wallets are still displayed",
            );
          });

          it("[PRPI-4178] should not display the use bonus checkbox", async () => {
            expect(await freeBetsSO.element.isDisplayed()).toBe(false);
          });

          it("[PRPI-4178] should display the double bet controls generosity wallet button selected", async () => {
            expect(await doubleGenerosityWalletButtonSO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-4178] should display a generosity alert on double with the correct amount of free bets and a remove action", async () => {
            expect(await doubleFreeBetsWalletsAlertSO.element.isDisplayed()).toBe(true);
            expect(await doubleFreeBetsWalletsAlertSO.message.getText()).toBe("Includes $2.00 in Free Bets");
            expect(await doubleFreeBetsWalletsAlertSO.actionLinkText.getText()).toBe("Remove");
          });

          it("[PRPI-4178] should display a generosity alert on place footer with the correct amount of free bets and a remove action", async () => {
            expect(await freeBetsWalletsAlertPlaceFooterSO.element.isDisplayed()).toBe(true);
            expect(await freeBetsWalletsAlertPlaceFooterSO.message.getText()).toBe("Includes $2.00 in Free Bets");
            expect(await freeBetsWalletsAlertPlaceFooterSO.actionLinkText.getText()).toBe("Remove");
          });

          it("[PRPI-4178] should display an enabled place bet button with the 'Place $2.00 Bet' text", async () => {
            expect(await placeButtonSO.element.isEnabled()).toBe(true);
            expect(await placeButtonSO.label.getText()).toBe("Place $2.00 Bet");
          });

          describe("and collapses the BET BUILDER section", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(multiplesCardSO.header);
              await multiplesCardSO.header.click();
              await browser.waitUntilNotDisplayed(
                multiplesCardSO.contentWrapper,
                "BET BUILDER section is not collapsed",
              );
            });

            it("[PRPI-4179] should display the both singles bet controls generosity wallet buttons unselected", async () => {
              expect(await firstSingleGenerosityWalletButtonSO.element.isDisplayed()).toBe(true);
              expect(await secondSingleGenerosityWalletButtonSO.element.isDisplayed()).toBe(true);
            });

            it("[PRPI-4179] should not display both singles generosity alerts", async () => {
              expect(await firstSingleFreeBetsWalletsAlertSO.element.isDisplayed()).toBe(false);
              expect(await secondSingleFreeBetsWalletsAlertSO.element.isDisplayed()).toBe(false);
            });

            /* FIRST SINGLE */
            describe("and clicks on the first Single Free Bets Wallets promo button", () => {
              beforeAll(async () => {
                await browser.waitUntilClickableNative(firstSingleGenerosityWalletButtonSO.element);
                await firstSingleGenerosityWalletButtonSO.element.click();
                await browser.waitUntilDisplayed(
                  generosityWalletSO.element,
                  "Generosity Wallets Bottom Sheet is not displayed",
                );
              });

              it("[PRPI-4179] should display the Generosity Wallets Bottom Sheet", async () => {
                expect(await generosityWalletSO.element.isDisplayed()).toBe(true);
              });

              it("[PRPI-4179] should display an option with an icon and 'You have $41.00 in Free Bets' label", async () => {
                expect(await freeBetsAmountOptionSO.element.isDisplayed()).toBe(true);
                expect(await freeBetsAmountOptionSO.icon.isDisplayed()).toBe(true);
                expect(await freeBetsAmountOptionSO.title.getText()).toBe("You have $41.00 in Free Bets");
              });

              it("[PRPI-4179] should display 7 wallets", async () => {
                expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(7);

                expect(await firstExtraWalletCardSO.element.isDisplayed()).toBe(true);
                expect(await secondExtraWalletCardSO.element.isDisplayed()).toBe(true);
                expect(await thirdExtraWalletCardSO.element.isDisplayed()).toBe(true);
                expect(await fourthExtraWalletCardSO.element.isDisplayed()).toBe(true);
                expect(await fifthExtraWalletCardSO.element.isDisplayed()).toBe(true);
                expect(await sixthExtraWalletCardSO.element.isDisplayed()).toBe(true);
                expect(await seventhExtraWalletCardSO.element.isDisplayed()).toBe(true);
              });

              it("[PRPI-4179] should display the first wallet as disabled", async () => {
                expect(await firstExtraWalletCardOptionSO.checkbox.isEnabled()).toBe(false);
              });

              describe("and selects the second wallet", () => {
                beforeAll(async () => {
                  await browser.waitUntilClickableNative(secondExtraWalletCardOptionSO.checkbox);
                  await secondExtraWalletCardOptionSO.checkbox.click();
                  await browser.waitUntil(
                    async () => (await secondExtraWalletCardOptionSO.checkbox.getAttribute("selected")) === "true",
                  );
                });

                it("[PRPI-4179] should display an enabled apply button with 'Apply $3.00 Free Bet' label", async () => {
                  expect(await generosityWalletApplyButtonSO.element.isEnabled()).toBe(true);
                  expect(await generosityWalletApplyButtonSO.label.getText()).toBe("Apply $3.00 Free Bet");
                });

                describe("and applies the wallets", () => {
                  beforeAll(async () => {
                    await browser.waitUntilClickableNative(generosityWalletApplyButtonSO.element);
                    await generosityWalletApplyButtonSO.element.click();
                    await browser.waitUntilNotDisplayed(
                      extraWalletCardGroupSO.element,
                      "Free Bets Wallets are still displayed",
                    );
                  });

                  it("[PRPI-4179] should display the first single bet controls generosity wallet button selected", async () => {
                    expect(await firstSingleGenerosityWalletButtonSO.element.isDisplayed()).toBe(true);
                  });

                  it("[PRPI-4179] should display a generosity alert on first single with the correct amount of free bets and a remove action", async () => {
                    expect(await firstSingleFreeBetsWalletsAlertSO.element.isDisplayed()).toBe(true);
                    expect(await firstSingleFreeBetsWalletsAlertSO.message.getText()).toBe(
                      "Includes $3.00 in Free Bets",
                    );

                    expect(await firstSingleFreeBetsWalletsAlertSO.actionLinkText.getText()).toBe("Remove");
                  });

                  it("[PRPI-4179] should display a generosity alert on place footer with the correct amount of free bets and a remove action", async () => {
                    expect(await freeBetsWalletsAlertPlaceFooterSO.element.isDisplayed()).toBe(true);
                    expect(await freeBetsWalletsAlertPlaceFooterSO.message.getText()).toBe(
                      "Includes $5.00 in Free Bets",
                    );

                    expect(await freeBetsWalletsAlertPlaceFooterSO.actionLinkText.getText()).toBe("Remove");
                  });

                  it("[PRPI-4179] should display an enabled place bet button with the 'Place $5.00 Bet' text", async () => {
                    expect(await placeButtonSO.element.isEnabled()).toBe(true);
                    expect(await placeButtonSO.label.getText()).toBe("Place $5.00 Bet");
                  });

                  /* SECOND SINGLE */
                  describe("and clicks on the second Single Generosity Wallets button", () => {
                    beforeAll(async () => {
                      await browser.waitUntilClickableNative(secondSingleGenerosityWalletButtonSO.element);
                      await secondSingleGenerosityWalletButtonSO.element.click();
                      await browser.waitUntilDisplayed(
                        generosityWalletSO.element,
                        "Generosity Wallets Bottom Sheet is not displayed",
                      );
                    });

                    it("[PRPI-4179] should display the Generosity Wallets Bottom Sheet", async () => {
                      expect(await generosityWalletSO.element.isDisplayed()).toBe(true);
                    });

                    it("[PRPI-4179] should display an option with an icon and 'You have $27.00 in Free Bets' label", async () => {
                      expect(await freeBetsAmountOptionSO.element.isDisplayed()).toBe(true);
                      expect(await freeBetsAmountOptionSO.icon.isDisplayed()).toBe(true);
                      expect(await freeBetsAmountOptionSO.title.getText()).toBe("You have $27.00 in Free Bets");
                    });

                    it("[PRPI-4179] should display 5 wallets", async () => {
                      expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(5);

                      expect(await firstExtraWalletCardSO.element.isDisplayed()).toBe(true);
                      expect(await secondExtraWalletCardSO.element.isDisplayed()).toBe(true);
                      expect(await thirdExtraWalletCardSO.element.isDisplayed()).toBe(true);
                      expect(await fourthExtraWalletCardSO.element.isDisplayed()).toBe(true);
                      expect(await fifthExtraWalletCardSO.element.isDisplayed()).toBe(true);
                    });

                    it("[PRPI-4179] should display the first and second wallets as disabled", async () => {
                      expect(await firstExtraWalletCardOptionSO.checkbox.isEnabled()).toBe(false);
                      expect(await secondExtraWalletCardOptionSO.checkbox.isEnabled()).toBe(false);
                    });

                    describe("and selects the third wallet", () => {
                      beforeAll(async () => {
                        await browser.waitUntilClickableNative(thirdExtraWalletCardOptionSO.checkbox);
                        await thirdExtraWalletCardOptionSO.checkbox.click();
                        await browser.waitUntil(
                          async () => (await thirdExtraWalletCardOptionSO.checkbox.getAttribute("selected")) === "true",
                        );
                      });

                      it("[PRPI-4179] should display an enabled apply button with 'Apply $5.00 Free Bet' label", async () => {
                        expect(await generosityWalletApplyButtonSO.element.isEnabled()).toBe(true);
                        expect(await generosityWalletApplyButtonSO.label.getText()).toBe("Apply $5.00 Free Bet");
                      });

                      describe("and applies the wallets", () => {
                        beforeAll(async () => {
                          await browser.waitUntilClickableNative(generosityWalletApplyButtonSO.element);
                          await generosityWalletApplyButtonSO.element.click();
                          await browser.waitUntilNotDisplayed(
                            extraWalletCardGroupSO.element,
                            "Free Bets Wallets are still displayed",
                          );
                        });

                        it("[PRPI-4179] should display the second single bet controls generosity wallet button selected", async () => {
                          expect(await secondSingleGenerosityWalletButtonSO.element.isDisplayed()).toBe(true);
                        });

                        it("[PRPI-4179] should display a generosity alert on second single with the correct amount of free bets and a remove action", async () => {
                          // Swipe up to see the alert
                          await swipeUpElementFullscreen(secondSingleGenerosityWalletButtonSO.element);

                          await browser.waitUntilDisplayed(
                            secondSingleFreeBetsWalletsAlertSO.element,
                            "Second Single Free Bets Wallets alert is not displayed",
                          );

                          await expect(secondSingleFreeBetsWalletsAlertSO.message).toHaveText(
                            "Includes $5.00 in Free Bets",
                          );

                          await expect(secondSingleFreeBetsWalletsAlertSO.actionLinkText).toHaveText("Remove");
                        });

                        it("[PRPI-4179] should display a generosity alert on place footer with the correct amount of free bets and a remove action", async () => {
                          expect(await freeBetsWalletsAlertPlaceFooterSO.element.isDisplayed()).toBe(true);
                          expect(await freeBetsWalletsAlertPlaceFooterSO.message.getText()).toBe(
                            "Includes $10.00 in Free Bets",
                          );

                          expect(await freeBetsWalletsAlertPlaceFooterSO.actionLinkText.getText()).toBe("Remove");
                        });

                        it("[PRPI-4179] should display an enabled place bet button with the 'Place $10.00 Bet' text", async () => {
                          expect(await placeButtonSO.element.isEnabled()).toBe(true);
                          expect(await placeButtonSO.label.getText()).toBe("Place $10.00 Bet");
                        });

                        describe("and removes all free bets wallets on place footer", () => {
                          beforeAll(async () => {
                            await browser.waitUntilClickableNative(freeBetsWalletsAlertPlaceFooterSO.actionLinkText);
                            await freeBetsWalletsAlertPlaceFooterSO.actionLinkText.click();
                            await browser.waitUntilNotDisplayed(
                              freeBetsWalletsAlertPlaceFooterSO.element,
                              "Place Footer Free Bets Wallets alert is still displayed",
                            );
                          });

                          it("[PRPI-4179] should not display any generosity alert on both footer and combinations", async () => {
                            expect(await freeBetsWalletsAlertPlaceFooterSO.element.isDisplayed()).toBe(false);
                            expect(await firstSingleFreeBetsWalletsAlertSO.element.isDisplayed()).toBe(false);
                            expect(await secondSingleFreeBetsWalletsAlertSO.element.isDisplayed()).toBe(false);
                          });

                          it("[PRPI-4179] should display a disabled place bet button with the 'Place Bet' text", async () => {
                            expect(await placeButtonSO.element.isEnabled()).toBe(false);
                            expect(await placeButtonSO.label.getText()).toBe("Place Bet");
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
      });
    });
  });
});
