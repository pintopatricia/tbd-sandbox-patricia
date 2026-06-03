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
  BetControlsSO,
  ExtraWalletCardGroupSO,
  ExtraWalletCardSO,
  GenerosityWalletSO,
  OptionSO,
  PrimaryButtonSO,
  RunnerSO,
  SportsbookMarketSO,
  SportsbookPlacePanelSO,
  SportsbookBetButtonSO,
} = require("../../../../../../screen-objects");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { getStartViewLink } = require("../../../../../../helpers/view-link-start");
const { startApp } = require("../../../../../../helpers/urls");

const mockService = new MockService();

const sportsbookMarketSO = new SportsbookMarketSO();
const firstRunnerSO = new RunnerSO(sportsbookMarketSO.runnerList[0]);
const firstSbkRunnerButtonSO = new SportsbookBetButtonSO(firstRunnerSO.sbkBetButtons[0]);
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const betControlsSO = new BetControlsSO();

const generosityWalletSO = new GenerosityWalletSO();
const generosityWalletApplyButtonSO = new PrimaryButtonSO();

const extraWalletCardGroupSO = new ExtraWalletCardGroupSO();

const firstExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[0]);
const secondExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[1]);

const firstExtraWalletCardOptionSO = new OptionSO(firstExtraWalletCardSO.walletOption);
const secondExtraWalletCardOptionSO = new OptionSO(secondExtraWalletCardSO.walletOption);

const EVENT_ID = "22222222";
const MARKET_ID_1 = "924.22222222";
const SELECTION_ID_1 = 11111;
const SELECTION_ID_2 = 22222;
const SELECTION_ID_3 = 33333;

const WALLETS = [
  // NO badges, NO restrictions
  { id: 20000000001, amount: 2, badges: [], restrictions: { single: false, acca: false, sameGameMulti: false } },
  // 1 badge, NO restrictions
  {
    id: 20000000002,
    amount: 3,
    badges: ["Football"],
    restrictions: { single: false, acca: false, sameGameMulti: false },
  },
  // 2 badges, NO restrictions
  {
    id: 20000000003,
    amount: 5,
    badges: ["Football", "Basketball"],
    restrictions: { single: false, acca: false, sameGameMulti: false },
  },
  // 1 badged, single
  {
    id: 20000000004,
    amount: 7,
    badges: ["Football"],
    restrictions: { single: true, acca: false, sameGameMulti: false },
  },
  // 1 badge, acca
  {
    id: 20000000005,
    amount: 10,
    badges: ["Football"],
    restrictions: { single: false, acca: true, sameGameMulti: false },
  },
  // NO badges, sameGameMulti
  { id: 20000000006, amount: 13, badges: [], restrictions: { single: false, acca: false, sameGameMulti: true } },
  // NO badges, acca and sameGameMulti
  { id: 20000000007, amount: 1, badges: [], restrictions: { single: false, acca: true, sameGameMulti: true } },
  // NO badges, NO restrictions
  {
    id: 20000000008,
    amount: 20,
    badges: ["Football"],
    restrictions: { single: false, acca: false, sameGameMulti: false },
  },
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
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}:MATCH_ODDS`,
      },
    },
  ],
};

const getExpirationDates = () => {
  const nowDate = new Date(Date.now());

  const firstExpirationDate = new Date(nowDate);
  firstExpirationDate.setSeconds(firstExpirationDate.getSeconds() + 50);

  const secondExpirationDate = new Date(nowDate);
  secondExpirationDate.setMinutes(secondExpirationDate.getMinutes() + 1);

  const thirdExpirationDate = new Date(nowDate);
  thirdExpirationDate.setHours(thirdExpirationDate.getHours() + 1, thirdExpirationDate.getMinutes() + 5);

  const fourthExpirationDate = new Date(nowDate);
  fourthExpirationDate.setDate(fourthExpirationDate.getDate() + 1);
  fourthExpirationDate.setMinutes(fourthExpirationDate.getMinutes() + 5);

  const fifthExpirationDate = new Date(nowDate);
  fifthExpirationDate.setDate(fifthExpirationDate.getDate() + 60);
  fifthExpirationDate.setMinutes(fifthExpirationDate.getMinutes() + 5);

  const sixthExpirationDate = new Date(nowDate);
  sixthExpirationDate.setDate(sixthExpirationDate.getDate() + 365);
  sixthExpirationDate.setMinutes(sixthExpirationDate.getMinutes() + 5);

  const seventhExpirationDate = undefined;

  const eighthExpirationDate = new Date(nowDate);
  eighthExpirationDate.setDate(eighthExpirationDate.getDate() + 2 * 365);
  eighthExpirationDate.setMinutes(eighthExpirationDate.getMinutes() + 1);

  return [
    firstExpirationDate,
    secondExpirationDate,
    thirdExpirationDate,
    fourthExpirationDate,
    fifthExpirationDate,
    sixthExpirationDate,
    seventhExpirationDate,
    eighthExpirationDate,
  ];
};

const getExtraWalletCardGroupBFFMock = (walletsWithExpirationDate) => ({
  cards: [
    {
      __typename: "ExtraWalletCardGroup",
      urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
      amount: 10.0,
      helpUrl: "thisisahelpurl",
      full: {
        edges: walletsWithExpirationDate.map(({ id, amount, expirationDate, badges, restrictions }) => ({
          node: {
            __typename: "ExtraWalletCard",
            urn: `ppb:tbd:card:extraWalletCard:${id}`,
            badges,
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
              single: `${restrictions?.single || false}`,
              acca: `${restrictions?.acca || false}`,
              sameGameMulti: `${restrictions?.sameGameMulti || false}`,
            },
          },
          __typename: "ExtraWalletCardGroupEdge",
        })),
        __typename: "ExtraWalletCardGroupConnection",
      },
    },
  ],
});

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
  ],
};

const SINGLE_BET_COMBINATION = {
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
  applicableWallets: WALLETS.map(({ id }) => id).slice(0, WALLETS.length - 2),
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

const SIB_MOCK = {
  betCombinations: [SINGLE_BET_COMBINATION],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SELECTION_ODDS],
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

describe("SBK Free Bets Wallets - Singles", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));

    const HOME_VIEW_LINK = getStartViewLink(`sport/competition/event/e-${EVENT_ID}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));
    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when a user with available free bets wallets opens a betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilEquals(firstSbkRunnerButtonSO.odd, "1.1");
      await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Sportsbook betslip not displayed");
    });

    it("[PRPI-4398]_should_display_the_free_bets_wallets_generosity_promo_button", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4398]_should_display_the_free_bets_wallets_generosity_promo_button`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });

    describe("and clicks on the Free Bets Wallets promo button", () => {
      beforeAll(async () => {
        const expirationDates = getExpirationDates();
        const walletsWithExpirationDate = WALLETS.map((wallet, index) => ({
          ...wallet,
          expirationDate: expirationDates[index],
        }));
        await mockService.mockHttpRequest(getCardResults(getExtraWalletCardGroupBFFMock(walletsWithExpirationDate)));
        await browser.waitUntilClickableNative(betControlsSO.generosityWalletButton);
        await betControlsSO.generosityWalletButton.click();
        await browser.waitUntilDisplayed(
          generosityWalletSO.element,
          "Generosity Wallets Bottom Sheet is not displayed",
        );
      });

      it("[PRPI-4963]_should_open_the_free_bets_wallets_bottom_sheet", async () => {
        expect(
          (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4963]_should_open_the_free_bets_wallets_bottom_sheet`))
            .misMatchPercentage,
        ).toEqual(0);
      });

      describe("and selects the first wallet", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(firstExtraWalletCardOptionSO.checkbox);
          await firstExtraWalletCardOptionSO.checkbox.click();
          await browser.waitUntil(
            async () => (await firstExtraWalletCardOptionSO.checkbox.getAttribute("selected")) === "true",
          );
        });

        it("[PRPI-4964]_should_display_the_free_bets_wallets_with_one_selected_wallet", async () => {
          expect(
            (
              await browser.compareScreen(
                `${MODULE_NAME}_[PRPI-4964]_should_display_the_free_bets_wallets_with_one_selected_wallet`,
              )
            ).misMatchPercentage,
          ).toEqual(0);
        });

        describe("and selects the second wallet", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(secondExtraWalletCardOptionSO.checkbox);
            await secondExtraWalletCardOptionSO.checkbox.click();
            await browser.waitUntil(
              async () => (await secondExtraWalletCardOptionSO.checkbox.getAttribute("selected")) === "true",
            );
          });

          it("[PRPI-4401]_should_display_the_free_bets_wallets_with_two_selected_wallet", async () => {
            expect(
              (
                await browser.compareScreen(
                  `${MODULE_NAME}_[PRPI-4401]_should_display_the_free_bets_wallets_with_two_selected_wallet`,
                )
              ).misMatchPercentage,
            ).toEqual(0);
          });

          describe("and applies the selected wallets", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(generosityWalletApplyButtonSO.element);
              await generosityWalletApplyButtonSO.element.click();
              await browser.waitUntilNotDisplayed(
                extraWalletCardGroupSO.element,
                "Generosity Wallets are still displayed",
              );
            });

            it("[PRPI-1365]_should_display_the_combination_with_selected_wallets_amount", async () => {
              expect(
                (
                  await browser.compareScreen(
                    `${MODULE_NAME}_[PRPI-1365]_should_display_the_combination_with_selected_wallets_amount`,
                  )
                ).misMatchPercentage,
              ).toEqual(0);
            });

            describe("and clicks again on the Free Bets Wallets promo button", () => {
              beforeAll(async () => {
                await browser.waitUntilClickableNative(betControlsSO.generosityWalletButton);
                await betControlsSO.generosityWalletButton.click();
                await browser.waitUntilDisplayed(
                  generosityWalletSO.element,
                  "Generosity Wallets Bottom Sheet is not displayed",
                );
              });

              it("[PRPI-1365]_should_display_the_free_bets_wallets_bottom_sheet_with_pre_selected_wallets_and_disabled_apply_button", async () => {
                expect(
                  (
                    await browser.compareScreen(
                      `${MODULE_NAME}_[PRPI-1365]_should_display_the_free_bets_wallets_bottom_sheet_with_pre_selected_wallets_and_disabled_apply_button`,
                    )
                  ).misMatchPercentage,
                ).toEqual(0);
              });

              describe("and deselects the second wallet", () => {
                beforeAll(async () => {
                  await browser.waitUntilClickableNative(secondExtraWalletCardOptionSO.checkbox);
                  await secondExtraWalletCardOptionSO.checkbox.click();
                  await browser.waitUntil(
                    async () => (await secondExtraWalletCardOptionSO.checkbox.getAttribute("selected")) !== "true",
                  );
                });

                it("[PRPI-1365]_should_display_the_free_bets_wallets_bottom_sheet_with_enabled_apply_button", async () => {
                  expect(
                    (
                      await browser.compareScreen(
                        `${MODULE_NAME}_[PRPI-1365]_should_display_the_free_bets_wallets_bottom_sheet_with_enabled_apply_button`,
                      )
                    ).misMatchPercentage,
                  ).toEqual(0);
                });

                describe("and selects the second wallet again", () => {
                  beforeAll(async () => {
                    await browser.waitUntilClickableNative(secondExtraWalletCardOptionSO.checkbox);
                    await secondExtraWalletCardOptionSO.checkbox.click();
                    await browser.waitUntil(
                      async () => (await secondExtraWalletCardOptionSO.checkbox.getAttribute("selected")) === "true",
                    );
                  });

                  it("[PRPI-1365]_should_display_the_free_bets_wallets_bottom_sheet_with_disabled_apply_button", async () => {
                    expect(
                      (
                        await browser.compareScreen(
                          `${MODULE_NAME}_[PRPI-1365]_should_display_the_free_bets_wallets_bottom_sheet_with_disabled_apply_button`,
                        )
                      ).misMatchPercentage,
                    ).toEqual(0);
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
