const {
  AlertPO,
  AppPO,
  BetControlsPO,
  CardPO,
  EventPagePO,
  BetslipDrawerPO,
  ExtraWalletCardGroupPO,
  ExtraWalletCardPO,
  FreeBetsPO,
  GenerosityWalletPO,
  MinimizedPO,
  OptionPO,
  PlaceFooterPO,
  PromoButtonPO,
  PrimaryButtonPO,
  RunnerPO,
  SinglePO,
  SinglesCardPO,
  SportsbookMarketPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");

const {
  SIB: { getImplyBetsResponse },
  SMP: { getMarketPrices },
  WALLET: { getWallets },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const { TEST_ID: ALERT_TEST_ID } = require("@ppb/the-wall-web/components/bricks/Alert/Alert.selectors");
const {
  TEST_ID: BET_CONTROL_TEST_ID,
} = require("@ppb/the-wall-web/components/rooms/BetControls/BetControls.selectors");

const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const mockService = new MockService();

const eventPagePO = new EventPagePO();

const firstSportsbookMarketPO = new SportsbookMarketPO(eventPagePO.markets[0]);
const secondSportsbookMarketPO = new SportsbookMarketPO(eventPagePO.markets[1]);

const firstMarketFirstRunnerPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const secondMarketFirstRunnerPO = new RunnerPO(secondSportsbookMarketPO.runnerList[0]);

const betslipDrawerPO = new BetslipDrawerPO();
const minimizedBetslipPO = new MinimizedPO();

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const freeBetsPO = new FreeBetsPO();

const multiplesCardPO = new CardPO(sportsbookPlacePanelPO.collapsableSections[0]);
const singlesCardPO = new CardPO(sportsbookPlacePanelPO.collapsableSections[1]);

const multiplesSubHeaderPO = new CardPO(sportsbookPlacePanelPO.collapsableSections[0]);
const singlesSubHeaderPO = new CardPO(sportsbookPlacePanelPO.collapsableSections[1]);

const doubleBetControlsPO = new BetControlsPO(multiplesCardPO.element.$(BET_CONTROL_TEST_ID));
const doubleGenerosityButtonPO = new PromoButtonPO(doubleBetControlsPO.generosityWalletButton);
const doubleFreeBetsWalletsAlertPO = new AlertPO(multiplesCardPO.element.$(ALERT_TEST_ID));

const singlesCardContentPO = new SinglesCardPO(singlesCardPO.contentWrapper);
const firstSinglePO = new SinglePO(singlesCardContentPO.singles[0]);
const secondSinglePO = new SinglePO(singlesCardContentPO.singles[1]);

const firstSingleBetControlsPO = new BetControlsPO(firstSinglePO.element.$(BET_CONTROL_TEST_ID));
const firstSingleGenerosityButtonPO = new PromoButtonPO(firstSingleBetControlsPO.generosityWalletButton);
const firstSingleFreeBetsWalletsAlertPO = new AlertPO(firstSinglePO.element.$(ALERT_TEST_ID));

const secondSingleBetControlsPO = new BetControlsPO(secondSinglePO.element.$(BET_CONTROL_TEST_ID));
const secondSingleGenerosityButtonPO = new PromoButtonPO(secondSingleBetControlsPO.generosityWalletButton);
const secondSingleFreeBetsWalletsAlertPO = new AlertPO(secondSinglePO.element.$(ALERT_TEST_ID));

const placeFooterPO = new PlaceFooterPO();
const freeBetsWalletsAlertPO = new AlertPO(placeFooterPO.freeBetsWalletsAlert);

const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);

const generosityWalletPO = new GenerosityWalletPO();
const generosityWalletApplyButtonPO = new PrimaryButtonPO(generosityWalletPO.applyButton);

const extraWalletCardGroupPO = new ExtraWalletCardGroupPO();

const firstExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[0]);
const secondExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[1]);
const thirdExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[2]);
const fourthExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[3]);
const fifthExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[4]);
const sixthExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[5]);
const seventhExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[6]);

const freeBetsAmountOptionPO = new OptionPO(extraWalletCardGroupPO.generosityAmountOption);
const firstExtraWalletCardOptionPO = new OptionPO(firstExtraWalletCardPO.walletOption);
const secondExtraWalletCardOptionPO = new OptionPO(secondExtraWalletCardPO.walletOption);
const thirdExtraWalletCardOptionPO = new OptionPO(thirdExtraWalletCardPO.walletOption);

const EVENT_ID = "22222222";
const MARKET_ID_1 = "924.22222222";
const MARKET_ID_2 = "924.33333333";

const SELECTION_ID_1 = 11111;
const SELECTION_ID_2 = 22222;
const SELECTION_ID_3 = 33333;
const SELECTION_ID_4 = 44444;
const SELECTION_ID_5 = 55555;
const SELECTION_ID_6 = 66666;

const CURRENT_MOCKED_DATE = "2025-02-02T00:00:00.000Z";

const WALLETS = [
  { id: 20000000001, amount: 2, expirationDate: "2025-02-02T00:00:50.000Z" }, // 50 seconds
  { id: 20000000002, amount: 3, expirationDate: "2025-02-02T00:01:00.000Z" }, // 1 minute
  { id: 20000000003, amount: 5, expirationDate: "2025-02-02T01:01:00.000Z" }, // 1 hour
  { id: 20000000004, amount: 7, expirationDate: "2025-02-03T00:01:00.000Z" }, // 1 day
  { id: 20000000005, amount: 10, expirationDate: "2025-04-02T00:01:00.000Z" }, // 1 month
  { id: 20000000006, amount: 13, expirationDate: "2026-02-02T00:01:00.000Z" }, // 1 year
  { id: 20000000007, amount: 1 }, // no expiration date
  { id: 20000000008, amount: 20, expirationDate: "2027-02-02T00:01:00.000Z" }, // 2 years
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

describe("SBK Free Bets Wallets - Multiples", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_EVENT_PAGE_MOCK.urn, { date: CURRENT_MOCKED_DATE }));
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_1_RUNNER));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_2_RUNNERS));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.1,
      }),
    );
  });

  describe("when a user with available free bets wallets opens a betslip with two selections", () => {
    beforeAll(async () => {
      // Add First Selection
      await firstMarketFirstRunnerPO.sportsbookBetButton.waitForClickable();
      await firstMarketFirstRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Sportsbook single betslip not displayed");

      // Minimize the betslip
      await betslipDrawerPO.header.waitForClickable();
      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(minimizedBetslipPO.element, "Sportsbook minimized betslip not displayed");

      // Add Second Selection
      await secondMarketFirstRunnerPO.sportsbookBetButton.waitForClickable();
      await secondMarketFirstRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilEquals(minimizedBetslipPO.counter, "2", "Second Selection not added to betslip");

      // Expand the betslip
      await minimizedBetslipPO.element.waitForClickable();
      await minimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Sportsbook betslip not expanded");
    });

    it("[PRPI-7864] should not display the use bonus checkbox", async () => {
      expect(await freeBetsPO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-7865] should display the SINGLES and BET BUILDER sections", async () => {
      expect(await sportsbookPlacePanelPO.collapsableSections.length).toBe(2);

      expect(await singlesSubHeaderPO.element.isDisplayed()).toBe(true);
      expect(await singlesSubHeaderPO.title.getText()).toBe("SINGLES");

      expect(await multiplesSubHeaderPO.element.isDisplayed()).toBe(true);
      expect(await multiplesSubHeaderPO.title.getText()).toBe("BET BUILDER");
    });

    it("[PRPI-7866] should display the DOUBLE bet controls generosity wallet button unselected", async () => {
      expect(await doubleGenerosityButtonPO.element.isDisplayed()).toBe(true);
      expect(await browser.containsClass(doubleGenerosityButtonPO.element, PromoButtonPO.states.selected)).toBe(false);
    });

    it("[PRPI-7867] should not display the DOUBLE a generosity alert", async () => {
      expect(await doubleFreeBetsWalletsAlertPO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-7868] should display a disabled place bet button with the 'Place Bet' text", async () => {
      expect(await placeButtonPO.element.isDisplayed()).toBe(true);
      expect(await placeButtonPO.element.isEnabled()).toBe(false);
      expect(await placeButtonPO.element.getText()).toBe("Place Bet");
    });

    /* DOUBLE */
    describe("and clicks on the DOUBLE Generosity Wallets promo button", () => {
      beforeAll(async () => {
        await doubleGenerosityButtonPO.element.waitForClickable();
        await doubleGenerosityButtonPO.element.click();
        await browser.waitUntilDisplayed(generosityWalletPO.element, "Generosity Wallet Bottom Sheet is not displayed");
      });

      it("[PRPI-7869] should display the Generosity Wallet Bottom Sheet", async () => {
        expect(await generosityWalletPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7870] should display an option with an icon and 'You have $17.00 in Free Bets' label", async () => {
        expect(await freeBetsAmountOptionPO.element.isDisplayed()).toBe(true);
        expect(await freeBetsAmountOptionPO.icon.isDisplayed()).toBe(true);
        expect(await freeBetsAmountOptionPO.title.getText()).toBe("You have $17.00 in Free Bets");
      });

      it("[PRPI-7871] should display 4 wallets", async () => {
        expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(4);

        expect(await firstExtraWalletCardPO.element.isDisplayed()).toBe(true);
        expect(await secondExtraWalletCardPO.element.isDisplayed()).toBe(true);
        expect(await thirdExtraWalletCardPO.element.isDisplayed()).toBe(true);
        expect(await fourthExtraWalletCardPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7872] should display a disabled apply button with an 'Apply' label", async () => {
        expect(await generosityWalletPO.footerContent.isDisplayed()).toBe(true);
        expect(await generosityWalletApplyButtonPO.element.isDisplayed()).toBe(true);
        expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(false);
        expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply");
      });

      describe("and selects the first wallet", () => {
        beforeAll(async () => {
          await firstExtraWalletCardOptionPO.title.click();
          await browser.waitUntilResult(
            firstExtraWalletCardOptionPO.input.isSelected(),
            true,
            "First wallet was not selected",
          );
        });

        it("[PRPI-7873] should display an enabled apply button with 'Apply $2.00 Free Bet' label", async () => {
          expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
          expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply $2.00 Free Bet");
        });

        describe("and applies the selected wallets", () => {
          beforeAll(async () => {
            await generosityWalletApplyButtonPO.element.waitForClickable();
            await generosityWalletApplyButtonPO.element.click();
            await browser.waitUntilNotDisplayed(
              extraWalletCardGroupPO.element,
              "Free Bets Wallets are still displayed",
            );
          });

          it("[PRPI-7874] should not display the use bonus checkbox", async () => {
            expect(await freeBetsPO.element.isDisplayed()).toBe(false);
          });

          it("[PRPI-7874] should display the double bet controls generosity wallet button selected", async () => {
            expect(await doubleGenerosityButtonPO.element.isDisplayed()).toBe(true);
            expect(await browser.containsClass(doubleGenerosityButtonPO.element, PromoButtonPO.states.selected)).toBe(
              true,
            );
          });

          it("[PRPI-7874] should display a generosity alert on double with the correct amount of free bets and a remove action", async () => {
            expect(await doubleFreeBetsWalletsAlertPO.element.isDisplayed()).toBe(true);
            expect(await doubleFreeBetsWalletsAlertPO.message.getText()).toBe("Includes $2.00 in Free Bets");
            expect(await doubleFreeBetsWalletsAlertPO.actionLink.getText()).toBe("Remove");
          });

          it("[PRPI-7874] should display a generosity alert on place footer with the correct amount of free bets and a remove action", async () => {
            expect(await freeBetsWalletsAlertPO.element.isDisplayed()).toBe(true);
            expect(await freeBetsWalletsAlertPO.message.getText()).toBe("Includes $2.00 in Free Bets");
            expect(await freeBetsWalletsAlertPO.actionLink.getText()).toBe("Remove");
          });

          it("[PRPI-7874] should display an enabled place bet button with the 'Place $2.00 Bet' text", async () => {
            expect(await placeButtonPO.element.isEnabled()).toBe(true);
            expect(await placeButtonPO.element.getText()).toBe("Place $2.00 Bet");
          });

          describe("and collapses the BET BUILDER section", () => {
            beforeAll(async () => {
              await multiplesCardPO.headerWrapper.waitForClickable();
              await multiplesCardPO.headerWrapper.click();
              await browser.waitUntilNotDisplayed(multiplesCardPO.content, "BET BUILDER section is not collapsed");
            });

            it("[PRPI-7874] should display the both singles bet controls generosity wallet buttons unselected", async () => {
              expect(await firstSingleGenerosityButtonPO.element.isDisplayed()).toBe(true);
              expect(await secondSingleGenerosityButtonPO.element.isDisplayed()).toBe(true);

              expect(await browser.containsClass(firstSingleBetControlsPO.element, PromoButtonPO.states.selected)).toBe(
                false,
              );

              expect(
                await browser.containsClass(secondSingleBetControlsPO.element, PromoButtonPO.states.selected),
              ).toBe(false);
            });

            it("[PRPI-7874] should not display both singles generosity alerts", async () => {
              expect(await firstSingleFreeBetsWalletsAlertPO.element.isDisplayed()).toBe(false);
              expect(await secondSingleFreeBetsWalletsAlertPO.element.isDisplayed()).toBe(false);
            });

            /* FIRST SINGLE */
            describe("and clicks on the first Single Generosity Wallets promo button", () => {
              beforeAll(async () => {
                await firstSingleGenerosityButtonPO.element.waitForClickable();
                await firstSingleGenerosityButtonPO.element.click();
                await browser.waitUntilDisplayed(
                  generosityWalletPO.element,
                  "Generosity Wallet Bottom Sheet is not displayed",
                );
              });

              it("[PRPI-7874] should display the Generosity Wallet Bottom Sheet", async () => {
                expect(await generosityWalletPO.element.isDisplayed()).toBe(true);
              });

              it("[PRPI-7874] should display an option with an icon and 'You have $41.00 in Free Bets' label", async () => {
                expect(await freeBetsAmountOptionPO.element.isDisplayed()).toBe(true);
                expect(await freeBetsAmountOptionPO.icon.isDisplayed()).toBe(true);
                expect(await freeBetsAmountOptionPO.title.getText()).toBe("You have $41.00 in Free Bets");
              });

              it("[PRPI-7874] should display 7 wallets", async () => {
                expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(7);

                expect(await firstExtraWalletCardPO.element.isDisplayed()).toBe(true);
                expect(await secondExtraWalletCardPO.element.isDisplayed()).toBe(true);
                expect(await thirdExtraWalletCardPO.element.isDisplayed()).toBe(true);
                expect(await fourthExtraWalletCardPO.element.isDisplayed()).toBe(true);
                expect(await fifthExtraWalletCardPO.element.isDisplayed()).toBe(true);
                expect(await sixthExtraWalletCardPO.element.isDisplayed()).toBe(true);
                expect(await seventhExtraWalletCardPO.element.isDisplayed()).toBe(true);
              });

              it("[PRPI-7874] should display the first wallet as disabled", async () => {
                expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
              });

              describe("and selects the second wallet", () => {
                beforeAll(async () => {
                  await secondExtraWalletCardPO.element.waitForClickable();
                  await secondExtraWalletCardPO.element.click();
                  await browser.waitUntilResult(
                    secondExtraWalletCardOptionPO.input.isSelected(),
                    true,
                    "Second wallet was not selected",
                  );
                });

                it("[PRPI-7874] should display an enabled apply button with 'Apply $3.00 Free Bet' label", async () => {
                  expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
                  expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply $3.00 Free Bet");
                });

                describe("and applies the selected wallets", () => {
                  beforeAll(async () => {
                    await generosityWalletApplyButtonPO.element.waitForClickable();
                    await generosityWalletApplyButtonPO.element.click();
                    await browser.waitUntilNotDisplayed(
                      extraWalletCardGroupPO.element,
                      "Free Bets Wallets are still displayed",
                    );
                  });

                  it("[PRPI-7874] should display the first single bet controls Generosity wallet button selected", async () => {
                    expect(await firstSingleGenerosityButtonPO.element.isDisplayed()).toBe(true);
                    expect(
                      await browser.containsClass(firstSingleGenerosityButtonPO.element, PromoButtonPO.states.selected),
                    ).toBe(true);
                  });

                  it("[PRPI-7874] should display a generosity alert on first single with the correct amount of free bets and a remove action", async () => {
                    expect(await firstSingleFreeBetsWalletsAlertPO.element.isDisplayed()).toBe(true);
                    expect(await firstSingleFreeBetsWalletsAlertPO.message.getText()).toBe(
                      "Includes $3.00 in Free Bets",
                    );

                    expect(await firstSingleFreeBetsWalletsAlertPO.actionLink.getText()).toBe("Remove");
                  });

                  it("[PRPI-7874] should display a generosity alert on place footer with the correct amount of free bets and a remove action", async () => {
                    expect(await freeBetsWalletsAlertPO.element.isDisplayed()).toBe(true);
                    expect(await freeBetsWalletsAlertPO.message.getText()).toBe("Includes $5.00 in Free Bets");
                    expect(await freeBetsWalletsAlertPO.actionLink.getText()).toBe("Remove");
                  });

                  it("[PRPI-7874] should display an enabled place bet button with the 'Place $5.00 Bet' text", async () => {
                    expect(await placeButtonPO.element.isEnabled()).toBe(true);
                    expect(await placeButtonPO.element.getText()).toBe("Place $5.00 Bet");
                  });

                  /* SECOND SINGLE */
                  describe("and clicks on the second Single Generosity Wallets promo button", () => {
                    beforeAll(async () => {
                      await secondSingleGenerosityButtonPO.element.waitForClickable();
                      await secondSingleGenerosityButtonPO.element.click();
                      await browser.waitUntilDisplayed(
                        generosityWalletPO.element,
                        "Generosity Wallet Bottom Sheet is not displayed",
                      );
                    });

                    it("[PRPI-7874] should display the Generosity Wallet Bottom Sheet", async () => {
                      expect(await generosityWalletPO.element.isDisplayed()).toBe(true);
                    });

                    it("[PRPI-7874] should display an option with an icon and 'You have $27.00 in Free Bets' label", async () => {
                      expect(await freeBetsAmountOptionPO.element.isDisplayed()).toBe(true);
                      expect(await freeBetsAmountOptionPO.icon.isDisplayed()).toBe(true);
                      expect(await freeBetsAmountOptionPO.title.getText()).toBe("You have $27.00 in Free Bets");
                    });

                    it("[PRPI-7874] should display 5 wallets", async () => {
                      expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(5);

                      expect(await firstExtraWalletCardPO.element.isDisplayed()).toBe(true);
                      expect(await secondExtraWalletCardPO.element.isDisplayed()).toBe(true);
                      expect(await thirdExtraWalletCardPO.element.isDisplayed()).toBe(true);
                      expect(await fourthExtraWalletCardPO.element.isDisplayed()).toBe(true);
                      expect(await fifthExtraWalletCardPO.element.isDisplayed()).toBe(true);
                    });

                    it("[PRPI-7874] should display the first and second wallets as disabled", async () => {
                      expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
                      expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
                    });

                    describe("and selects the third wallet", () => {
                      beforeAll(async () => {
                        await thirdExtraWalletCardPO.element.waitForClickable();
                        await thirdExtraWalletCardPO.element.click();
                        await browser.waitUntilResult(
                          thirdExtraWalletCardOptionPO.input.isSelected(),
                          true,
                          "Third wallet was not selected",
                        );
                      });

                      it("[PRPI-7874] should display an enabled apply button with 'Apply $5.00 Free Bet' label", async () => {
                        expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
                        expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply $5.00 Free Bet");
                      });

                      describe("and applies the selected wallets", () => {
                        beforeAll(async () => {
                          await generosityWalletApplyButtonPO.element.waitForClickable();
                          await generosityWalletApplyButtonPO.element.click();
                          await browser.waitUntilNotDisplayed(
                            extraWalletCardGroupPO.element,
                            "Free Bets Wallets are still displayed",
                          );
                        });

                        it("[PRPI-7874] should display the second single bet controls generosity wallet button selected", async () => {
                          expect(await secondSingleGenerosityButtonPO.element.isDisplayed()).toBe(true);
                          expect(
                            await browser.containsClass(
                              secondSingleGenerosityButtonPO.element,
                              PromoButtonPO.states.selected,
                            ),
                          ).toBe(true);
                        });

                        it("[PRPI-7874] should display a generosity alert on second single with the correct amount of free bets and a remove action", async () => {
                          expect(await secondSingleFreeBetsWalletsAlertPO.element.isDisplayed()).toBe(true);
                          expect(await secondSingleFreeBetsWalletsAlertPO.message.getText()).toBe(
                            "Includes $5.00 in Free Bets",
                          );

                          expect(await secondSingleFreeBetsWalletsAlertPO.actionLink.getText()).toBe("Remove");
                        });

                        it("[PRPI-7874] should display a generosity alert on place footer with the correct amount of free bets and a remove action", async () => {
                          expect(await freeBetsWalletsAlertPO.element.isDisplayed()).toBe(true);
                          expect(await freeBetsWalletsAlertPO.message.getText()).toBe("Includes $10.00 in Free Bets");
                          expect(await freeBetsWalletsAlertPO.actionLink.getText()).toBe("Remove");
                        });

                        it("[PRPI-7874] should display an enabled place bet button with the 'Place $10.00 Bet' text", async () => {
                          expect(await placeButtonPO.element.isEnabled()).toBe(true);
                          expect(await placeButtonPO.element.getText()).toBe("Place $10.00 Bet");
                        });

                        describe("and removes all free bets wallets on place footer", () => {
                          beforeAll(async () => {
                            await freeBetsWalletsAlertPO.actionLink.waitForClickable();
                            await freeBetsWalletsAlertPO.actionLink.click();
                            await browser.waitUntilNotDisplayed(
                              freeBetsWalletsAlertPO.element,
                              "Place Footer Free Bets Wallets alert is still displayed",
                            );
                          });

                          it("[PRPI-7874] should not display any generosity alert on both footer and combinations", async () => {
                            expect(await freeBetsWalletsAlertPO.element.isDisplayed()).toBe(false);
                            expect(await firstSingleFreeBetsWalletsAlertPO.element.isDisplayed()).toBe(false);
                            expect(await secondSingleFreeBetsWalletsAlertPO.element.isDisplayed()).toBe(false);
                          });

                          it("[PRPI-7874] should display a disabled place bet button with the 'Place Bet' text", async () => {
                            expect(await placeButtonPO.element.isEnabled()).toBe(false);
                            expect(await placeButtonPO.element.getText()).toBe("Place Bet");
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
