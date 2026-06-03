const {
  AlertPO,
  AppPO,
  BetControlsPO,
  CardPO,
  EventPagePO,
  BetslipDrawerPO,
  ExtraWalletCardGroupPO,
  ExtraWalletCardPO,
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
} = require("../../../../page-objects");

const {
  SIB: { getImplyBetsResponse },
  SMP: { getMarketPrices },
  WALLET: { getWallets },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const {
  TEST_ID: BET_CONTROL_TEST_ID,
} = require("@ppb/the-wall-web/components/rooms/BetControls/BetControls.selectors");

const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const mockService = new MockService();

const eventPagePO = new EventPagePO();

const firstSportsbookMarketPO = new SportsbookMarketPO(eventPagePO.markets[0]);
const secondSportsbookMarketPO = new SportsbookMarketPO(eventPagePO.markets[1]);

const firstMarketFirstRunnerPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const secondMarketFirstRunnerPO = new RunnerPO(secondSportsbookMarketPO.runnerList[0]);

const betslipDrawerPO = new BetslipDrawerPO();
const minimizedBetslipPO = new MinimizedPO();

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();

const multiplesCardPO = new CardPO(sportsbookPlacePanelPO.collapsableSections[0]);
const singlesCardCollapsablePO = new CardPO(sportsbookPlacePanelPO.collapsableSections[1]);

const doubleBetControlsPO = new BetControlsPO(multiplesCardPO.element.$(BET_CONTROL_TEST_ID));
const doubleGenerosityButtonPO = new PromoButtonPO(doubleBetControlsPO.generosityWalletButton);

const singlesCardPO = new SinglesCardPO(singlesCardCollapsablePO.element);
const firstSinglePO = new SinglePO(singlesCardPO.singles[0]);

const firstSingleBetControlsPO = new BetControlsPO(firstSinglePO.element.$(BET_CONTROL_TEST_ID));
const firstSingleGenerosityButtonPO = new PromoButtonPO(firstSingleBetControlsPO.generosityWalletButton);

const placeFooterPO = new PlaceFooterPO();
const freeBetsWalletsAlertPO = new AlertPO(placeFooterPO.freeBetsWalletsAlert);

const generosityWalletPO = new GenerosityWalletPO();
const generosityWalletApplyButtonPO = new PrimaryButtonPO(generosityWalletPO.applyButton);

const extraWalletCardGroupPO = new ExtraWalletCardGroupPO();

const firstExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[0]);
const secondExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[1]);

const firstExtraWalletCardOptionPO = new OptionPO(firstExtraWalletCardPO.walletOption);
const secondExtraWalletCardOptionPO = new OptionPO(secondExtraWalletCardPO.walletOption);

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

const MODULE_NAME = "freebets_wallets";

describe("SBK Free Bets Wallets - Multiples", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
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

    it("[PRPI-1355]_should_display_the_multiples_free_bets_wallets_generosity_promo_button", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1355]_should_display_the_multiples_free_bets_wallets_generosity_promo_button`,
        ),
      ).toBe(0);
    });

    /* DOUBLE */
    describe("and clicks on the DOUBLE Free Bets Wallets promo button and selects the first wallet", () => {
      beforeAll(async () => {
        await doubleGenerosityButtonPO.element.waitForClickable();
        await doubleGenerosityButtonPO.element.click();
        await browser.waitUntilDisplayed(
          generosityWalletPO.element,
          "Generosity Wallets Bottom Sheet is not displayed",
        );

        await firstExtraWalletCardOptionPO.title.click();
        await browser.waitUntilResult(
          firstExtraWalletCardOptionPO.input.isSelected(),
          true,
          "First wallet was not selected",
        );
      });

      describe("and applies the selected wallets", () => {
        beforeAll(async () => {
          await generosityWalletApplyButtonPO.element.waitForClickable();
          await generosityWalletApplyButtonPO.element.click();
          await browser.waitUntilNotDisplayed(generosityWalletPO.element, "Generosity Wallets are still displayed");
        });

        it("[PRPI-1356]_should_display_the_multiples_combination_with_selected_wallets_amount", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1356]_should_display_the_multiples_combination_with_selected_wallets_amount`,
            ),
          ).toBe(0);
        });

        describe("and collapses the BET BUILDER section", () => {
          beforeAll(async () => {
            await multiplesCardPO.header.waitForClickable();
            await multiplesCardPO.header.click();
            await browser.waitUntilNotDisplayed(multiplesCardPO.content, "BET BUILDER section is not collapsed");
          });

          it("[PRPI-1356]_should_display_the_multiples_singles_combinations_with_unselected_promo_button", async () => {
            expect(
              await browser.checkScreen(
                `${MODULE_NAME}_[PRPI-1356]_should_display_the_multiples_singles_combinations_with_unselected_promo_button`,
              ),
            ).toBe(0);
          });

          /* FIRST SINGLE */
          describe("and clicks on the first Single Generosity Wallets promo button", () => {
            beforeAll(async () => {
              await firstSingleGenerosityButtonPO.element.waitForClickable();
              await firstSingleGenerosityButtonPO.element.click();
              await browser.waitUntilDisplayed(
                generosityWalletPO.element,
                "Generosity Wallets Bottom Sheet is not displayed",
              );
            });

            it("[PRPI-1356]_should_display_the_multiples_free_bets_wallets_with_one_disabled_selected_wallet", async () => {
              expect(
                await browser.checkScreen(
                  `${MODULE_NAME}_[PRPI-1356]_should_display_the_multiples_free_bets_wallets_with_one_disabled_selected_wallet`,
                ),
              ).toBe(0);
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

              it("[PRPI-1356]_should_display_the_multiples_free_bets_wallets_with_one_disabled_selected_wallet_and_other_selected_wallet", async () => {
                expect(
                  await browser.checkScreen(
                    `${MODULE_NAME}_[PRPI-1356]_should_display_the_multiples_free_bets_wallets_with_one_disabled_selected_wallet_and_other_selected_wallet`,
                  ),
                ).toBe(0);
              });

              describe("and applies the selected wallets", () => {
                beforeAll(async () => {
                  await generosityWalletApplyButtonPO.element.waitForClickable();
                  await generosityWalletApplyButtonPO.element.click();
                  await browser.waitUntilNotDisplayed(
                    generosityWalletPO.element,
                    "Generosity Wallets are still displayed",
                  );
                });

                it("[PRPI-1356]_should_display_the_multiples_combinations_with_new_selected_wallets_amount", async () => {
                  expect(
                    await browser.checkScreen(
                      `${MODULE_NAME}_[PRPI-1356]_should_display_the_multiples_combinations_with_new_selected_wallets_amount`,
                    ),
                  ).toBe(0);
                });

                describe("and removes all free bets wallets on place footer", () => {
                  beforeAll(async () => {
                    await freeBetsWalletsAlertPO.actionLink.waitForClickable();
                    await freeBetsWalletsAlertPO.actionLink.click();
                    await browser.waitUntilNotDisplayed(
                      placeFooterPO.freeBetsWalletsAlert,
                      "Place Footer Free Bets Wallets alert is still displayed",
                    );
                  });

                  it("[PRPI-1356]_should_delete_all_the_combination_selected_wallets", async () => {
                    expect(
                      await browser.checkScreen(
                        `${MODULE_NAME}_[PRPI-1356]_should_delete_all_the_combination_selected_wallets`,
                      ),
                    ).toBe(0);
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
