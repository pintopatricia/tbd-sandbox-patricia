const {
  AlertPO,
  AlertsPO,
  AppPO,
  BetControlsPO,
  BetsSummaryPO,
  CurrencyNumberInputFieldPO,
  EventPagePO,
  ExtraWalletCardGroupPO,
  ExtraWalletCardPO,
  FreeBetsPO,
  GenerosityWalletPO,
  OptionPO,
  PromoButtonPO,
  PrimaryButtonPO,
  RunnerPO,
  SportsbookMarketPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");

const {
  SIB: { getImplyBetsResponse },
  SMP: { getMarketPrices },
  WALLET: { getWallets },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const mockService = new MockService();

const eventPagePO = new EventPagePO();
const sportsbookMarketPO = new SportsbookMarketPO();
const firstRunnerPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);
const placePanelPO = new SportsbookPlacePanelPO();
const freeBetsPO = new FreeBetsPO();
const betControlsPO = new BetControlsPO();
const freeBetsButtonPO = new PromoButtonPO(betControlsPO.generosityWalletButton);
const stakePO = new CurrencyNumberInputFieldPO(betControlsPO.currencyInput);

const alertsPO = new AlertsPO(placePanelPO.element);
const firstAlertPO = new AlertPO(alertsPO.items[0]);
const secondAlertPO = new AlertPO(alertsPO.items[1]);

const betsSummaryPO = new BetsSummaryPO();
const placeButtonPO = new PrimaryButtonPO(placePanelPO.place);

const generosityWalletPO = new GenerosityWalletPO();
const generosityWalletApplyButtonPO = new PrimaryButtonPO(generosityWalletPO.applyButton);
const generosityWalletAlertPO = new AlertPO(generosityWalletPO.element);

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
const fourthExtraWalletCardOptionPO = new OptionPO(fourthExtraWalletCardPO.walletOption);
const fifthExtraWalletCardOptionPO = new OptionPO(fifthExtraWalletCardPO.walletOption);
const sixthExtraWalletCardOptionPO = new OptionPO(sixthExtraWalletCardPO.walletOption);
const seventhExtraWalletCardOptionPO = new OptionPO(seventhExtraWalletCardPO.walletOption);

const EVENT_ID = "22222222";
const MARKET_ID_1 = "924.22222222";
const SELECTION_ID_1 = 11111;
const SELECTION_ID_2 = 22222;
const SELECTION_ID_3 = 33333;

const CURRENT_MOCKED_DATE = "2025-02-02T00:00:00.000Z";

const WALLETS = [
  {
    // 50 seconds, NO badges, NO restrictions
    id: 20000000001,
    amount: 2,
    expirationDate: "2025-02-02T00:00:50.000Z",
    badges: [],
    restrictions: { single: false, acca: false, sameGameMulti: false },
  },
  {
    // 1 minute, 1 badge, NO restrictions
    id: 20000000002,
    amount: 3,
    expirationDate: "2025-02-02T00:01:00.000Z",
    badges: ["Football"],
    restrictions: { single: false, acca: false, sameGameMulti: false },
  },
  {
    // 1 hour, 2 badges, NO restrictions
    id: 20000000003,
    amount: 5,
    expirationDate: "2025-02-02T01:01:00.000Z",
    badges: ["Football", "Basketball"],
    restrictions: { single: false, acca: false, sameGameMulti: false },
  },
  {
    // 1 day, 1 badged, single
    id: 20000000004,
    amount: 7,
    expirationDate: "2025-02-03T00:01:00.000Z",
    badges: ["Football"],
    restrictions: { single: true, acca: false, sameGameMulti: false },
  },
  {
    // 1 month, 1 badge, acca
    id: 20000000005,
    amount: 10,
    expirationDate: "2025-04-02T00:01:00.000Z",
    badges: ["Football"],
    restrictions: { single: false, acca: true, sameGameMulti: false },
  },
  {
    // 1 year, NO badges, sameGameMulti
    id: 20000000006,
    amount: 13,
    expirationDate: "2026-02-02T00:01:00.000Z",
    badges: [],
    restrictions: { single: false, acca: false, sameGameMulti: true },
  },
  {
    // no expiration date, NO badges, acca and sameGameMulti
    id: 20000000007,
    amount: 1,
    acca: true,
    badges: [],
    restrictions: { single: false, acca: true, sameGameMulti: true },
  },
  {
    // 2 years, NO badges, NO restrictions
    id: 20000000008,
    amount: 20,
    expirationDate: "2027-02-02T00:01:00.000Z",
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

const BFF_FETCH_CARDS_MOCK = {
  cards: [
    {
      __typename: "ExtraWalletCardGroup",
      urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
      amount: 10.0,
      helpUrl: "thisisahelpurl",
      full: {
        edges: WALLETS.map(({ id, amount, expirationDate, badges, restrictions }) => ({
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
  applicableWallets: WALLETS.map(({ id }) => id).slice(0, WALLETS.length - 1),
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

describe("SBK Generosity Wallet - Singles", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_EVENT_PAGE_MOCK.urn, { date: CURRENT_MOCKED_DATE }));
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));

    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.1,
      }),
    );
  });

  describe("when a user with available promotions opens a betslip", () => {
    beforeAll(async () => {
      await firstRunnerPO.sportsbookBetButton.waitForClickable();
      await firstRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "Sportsbook betslip not displayed");
    });

    it("[PRPI-4181] should not display the use bonus checkbox", async () => {
      expect(await freeBetsPO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-4182] should display the bet controls generosity wallet button unselected", async () => {
      expect(await betControlsPO.generosityWalletButton.isDisplayed()).toBe(true);
      expect(await browser.containsClass(freeBetsButtonPO.element, PromoButtonPO.states.selected)).toBe(false);
    });

    it("[PRPI-4183] should not display a generosity alert ", async () => {
      expect(await firstAlertPO.element.getElement()).toBe(undefined);
    });

    it("[PRPI-4184] should display the balance after bet with the correct amount", async () => {
      expect(await betsSummaryPO.leftSegmentLabel.getText()).toBe("Balance After Bet");
      expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("$100.00");
    });

    it("[PRPI-4185] should display the total returns with the correct amount", async () => {
      expect(await betsSummaryPO.totalReturnsLabel.getText()).toBe("Total Returns");
      expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$0.00");
    });

    it("[PRPI-4186] should display a disabled place bet button with the 'Place Bet' text", async () => {
      expect(await placeButtonPO.element.isDisplayed()).toBe(true);
      expect(await placeButtonPO.element.isEnabled()).toBe(false);
      expect(await placeButtonPO.element.getText()).toBe("Place Bet");
    });

    describe("and clicks on the Generosity Wallets promo button", () => {
      beforeAll(async () => {
        await betControlsPO.generosityWalletButton.waitForClickable();
        await betControlsPO.generosityWalletButton.click();
        await browser.waitUntilDisplayed(
          generosityWalletPO.element,
          "Generosity Wallets Bottom Sheet is not displayed",
        );
      });

      it("[PRPI-7880] should display the Generosity Wallet Bottom Sheet", async () => {
        expect(await generosityWalletPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7881] should display 'Your Bonuses' in the Bottom Sheet header", async () => {
        expect(await generosityWalletPO.headerTitle.getText()).toBe("Your Bonuses");
      });

      it("[PRPI-7882] should display a help alert", async () => {
        expect(await generosityWalletAlertPO.element.isDisplayed()).toBe(true);
        expect(await generosityWalletAlertPO.message.getText()).toBe("Bonuses are applied in the Betslip");
        expect(await generosityWalletAlertPO.actionLink.getText()).toBe("Help");
      });

      it("[PRPI-7883] should display an option with an icon and 'You have $41.00 in Free Bets' label", async () => {
        expect(await freeBetsAmountOptionPO.element.isDisplayed()).toBe(true);
        expect(await freeBetsAmountOptionPO.icon.isDisplayed()).toBe(true);
        expect(await freeBetsAmountOptionPO.title.getText()).toBe("You have $41.00 in Free Bets");
      });

      it("[PRPI-7884] should display 7 wallets", async () => {
        expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(7);

        expect(await firstExtraWalletCardPO.element.isDisplayed()).toBe(true);
        expect(await secondExtraWalletCardPO.element.isDisplayed()).toBe(true);
        expect(await thirdExtraWalletCardPO.element.isDisplayed()).toBe(true);
        expect(await fourthExtraWalletCardPO.element.isDisplayed()).toBe(true);
        expect(await fifthExtraWalletCardPO.element.isDisplayed()).toBe(true);
        expect(await sixthExtraWalletCardPO.element.isDisplayed()).toBe(true);
        expect(await seventhExtraWalletCardPO.element.isDisplayed()).toBe(true);
      });

      describe("and in the first wallet", () => {
        it("[PRPI-7885] should display the '$2.00 Free Bet' label", async () => {
          expect(await firstExtraWalletCardOptionPO.element.isDisplayed()).toBe(true);
          expect(await firstExtraWalletCardOptionPO.title.getText()).toBe("$2.00 Free Bet");
        });

        it("[PRPI-7886] should display the '1 min left' countdown", async () => {
          expect(await firstExtraWalletCardPO.countdown.isDisplayed()).toBe(true);
          expect(await firstExtraWalletCardPO.countdown.getText()).toBe("1 min left");
        });

        it("[PRPI-7887] should not display the restriction badges", async () => {
          expect(await firstExtraWalletCardPO.restrictionBadgesContainer.isDisplayed()).toBe(false);
        });
      });

      describe("and in the second wallet", () => {
        it("[PRPI-7888] should display the '$3.00 Free Bet' label", async () => {
          expect(await secondExtraWalletCardOptionPO.element.isDisplayed()).toBe(true);
          expect(await secondExtraWalletCardOptionPO.title.getText()).toBe("$3.00 Free Bet");
        });

        it("[PRPI-7889] should display the '1 min left' countdown", async () => {
          expect(await secondExtraWalletCardPO.countdown.isDisplayed()).toBe(true);
          expect(await secondExtraWalletCardPO.countdown.getText()).toBe("1 min left");
        });

        it("[PRPI-7890] should display the 'Football' restriction badge", async () => {
          expect(await secondExtraWalletCardPO.restrictionBadges.length).toBe(1);
          expect(await secondExtraWalletCardPO.restrictionBadges[0].getText()).toBe("Football");
        });
      });

      describe("and in the third wallet", () => {
        it("[PRPI-7891] should display the '$5.00 Free Bet' label", async () => {
          expect(await thirdExtraWalletCardOptionPO.element.isDisplayed()).toBe(true);
          expect(await thirdExtraWalletCardOptionPO.title.getText()).toBe("$5.00 Free Bet");
        });

        it("[PRPI-7892] should display the '1 hour left' countdown", async () => {
          expect(await thirdExtraWalletCardPO.countdown.isDisplayed()).toBe(true);
          expect(await thirdExtraWalletCardPO.countdown.getText()).toBe("1 hour left");
        });

        it("[PRPI-7893] should display the 'Football' and 'Basketball' restriction badges", async () => {
          expect(await thirdExtraWalletCardPO.restrictionBadges.length).toBe(2);
          expect(await thirdExtraWalletCardPO.restrictionBadges[0].getText()).toBe("Football");
          expect(await thirdExtraWalletCardPO.restrictionBadges[1].getText()).toBe("Basketball");
        });
      });

      describe("and in the fourth wallet", () => {
        it("[PRPI-7894] should display the '$7.00 Free Bet' label", async () => {
          expect(await fourthExtraWalletCardOptionPO.element.isDisplayed()).toBe(true);
          expect(await fourthExtraWalletCardOptionPO.title.getText()).toBe("$7.00 Free Bet");
        });

        it("[PRPI-7895] should display the '1 day left' countdown", async () => {
          expect(await fourthExtraWalletCardPO.countdown.isDisplayed()).toBe(true);
          expect(await fourthExtraWalletCardPO.countdown.getText()).toBe("1 day left");
        });

        it("[PRPI-7896] should display the 'Football' restriction badge", async () => {
          expect(await fourthExtraWalletCardPO.restrictionBadges.length).toBe(1);
          expect(await fourthExtraWalletCardPO.restrictionBadges[0].getText()).toBe("Football");
        });
      });

      describe("and in the fifth wallet", () => {
        it("[PRPI-7897] should display the '$10.00 Free Bet' label", async () => {
          expect(await fifthExtraWalletCardOptionPO.element.isDisplayed()).toBe(true);
          expect(await fifthExtraWalletCardOptionPO.title.getText()).toBe("$10.00 Free Bet");
        });

        it("[PRPI-7898] should display the '59 days left' countdown", async () => {
          expect(await fifthExtraWalletCardPO.countdown.isDisplayed()).toBe(true);
          expect(await fifthExtraWalletCardPO.countdown.getText()).toBe("59 days left");
        });

        it("[PRPI-7899] should display the 'Acca' and 'Football' restriction badges", async () => {
          expect(await fifthExtraWalletCardPO.restrictionBadges.length).toBe(2);
          expect(await fifthExtraWalletCardPO.restrictionBadges[0].getText()).toBe("Acca");
          expect(await fifthExtraWalletCardPO.restrictionBadges[1].getText()).toBe("Football");
        });
      });

      describe("and in the sixth wallet", () => {
        it("[PRPI-7900] should display the '$13.00 Free Bet' label", async () => {
          expect(await sixthExtraWalletCardOptionPO.element.isDisplayed()).toBe(true);
          expect(await sixthExtraWalletCardOptionPO.title.getText()).toBe("$13.00 Free Bet");
        });

        it("[PRPI-7901] should display the '365 days left' countdown", async () => {
          expect(await sixthExtraWalletCardPO.countdown.isDisplayed()).toBe(true);
          expect(await sixthExtraWalletCardPO.countdown.getText()).toBe("365 days left");
        });

        it("[PRPI-7902] should display the 'Bet Builder' restriction badge", async () => {
          expect(await sixthExtraWalletCardPO.restrictionBadges.length).toBe(1);
          expect(await sixthExtraWalletCardPO.restrictionBadges[0].getText()).toBe("Bet Builder");
        });
      });

      describe("and in the seventh wallet", () => {
        it("[PRPI-7903] should display the '$1.00 Free Bet' label", async () => {
          expect(await seventhExtraWalletCardOptionPO.element.isDisplayed()).toBe(true);
          expect(await seventhExtraWalletCardOptionPO.title.getText()).toBe("$1.00 Free Bet");
        });

        it("[PRPI-7904] should not display the countdown", async () => {
          expect(await seventhExtraWalletCardPO.countdown.isDisplayed()).toBe(false);
        });

        it("[PRPI-7905] should display the 'Bet Builder' restriction badge", async () => {
          expect(await seventhExtraWalletCardPO.restrictionBadges.length).toBe(1);
          expect(await seventhExtraWalletCardPO.restrictionBadges[0].getText()).toBe("Bet Builder");
        });
      });

      it("[PRPI-7906] should display a disabled apply button with an 'Apply' label", async () => {
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

        it("[PRPI-7907] should display an enabled apply button with 'Apply $2.00 Free Bet' label", async () => {
          expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
          expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply $2.00 Free Bet");
        });

        describe("and selects the second wallet", () => {
          beforeAll(async () => {
            await secondExtraWalletCardOptionPO.title.click();
            await browser.waitUntilResult(
              secondExtraWalletCardOptionPO.input.isSelected(),
              true,
              "Second wallet was not selected",
            );
          });

          it("[PRPI-7908] should display an enabled apply button with 'Apply $5.00 Free Bet' label", async () => {
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

            it("[PRPI-7909] should not display the use bonus checkbox", async () => {
              expect(await freeBetsPO.element.isDisplayed()).toBe(false);
            });

            it("[PRPI-7909] should display the bet controls generosity wallet button selected", async () => {
              expect(await betControlsPO.generosityWalletButton.isDisplayed()).toBe(true);
              expect(await browser.containsClass(freeBetsButtonPO.element, PromoButtonPO.states.selected)).toBe(true);
            });

            it("[PRPI-7909] should display a generosity alert with the correct amount of free bets and a remove action", async () => {
              expect(await firstAlertPO.element.isDisplayed()).toBe(true);
              expect(await firstAlertPO.message.getText()).toBe("Includes $5.00 in Free Bets");
              expect(await firstAlertPO.actionLink.getText()).toBe("Remove");
            });

            it("[PRPI-7909] should display the same balance after bet amount", async () => {
              expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("$100.00");
            });

            it("[PRPI-7909] should display the total returns with the correct amount", async () => {
              expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$0.50");
            });

            it("[PRPI-7909] should display an enabled place bet button with the 'Place $5.00 Bet' text", async () => {
              expect(await placeButtonPO.element.isEnabled()).toBe(true);
              expect(await placeButtonPO.element.getText()).toBe("Place $5.00 Bet");
            });

            describe("and clicks again on the Generosity Wallet promo button", () => {
              beforeAll(async () => {
                await betControlsPO.generosityWalletButton.waitForClickable();
                await betControlsPO.generosityWalletButton.click();
                await browser.waitUntilDisplayed(
                  generosityWalletPO.element,
                  "Generosity Wallets Bottom Sheet is not displayed",
                );
              });

              it("[PRPI-7909] should display the Generosity Wallet Bottom Sheet", async () => {
                expect(await generosityWalletPO.element.isDisplayed()).toBe(true);
              });

              it("[PRPI-7909] should display 7 wallets, with the first and second selected", async () => {
                expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(7);

                expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                expect(await thirdExtraWalletCardOptionPO.input.isSelected()).toBe(false);
                expect(await fourthExtraWalletCardOptionPO.input.isSelected()).toBe(false);
                expect(await fifthExtraWalletCardOptionPO.input.isSelected()).toBe(false);
                expect(await sixthExtraWalletCardOptionPO.input.isSelected()).toBe(false);
                expect(await seventhExtraWalletCardOptionPO.input.isSelected()).toBe(false);
              });

              it("[PRPI-7909] should display a disabled apply button with 'Apply $5.00 Free Bet' label", async () => {
                expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(false);
                expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply $5.00 Free Bet");
              });

              describe("and selects the third wallet", () => {
                beforeAll(async () => {
                  await thirdExtraWalletCardOptionPO.title.click();
                  await browser.waitUntilResult(
                    thirdExtraWalletCardOptionPO.input.isSelected(),
                    true,
                    "Third wallet was not selected",
                  );
                });

                it("[PRPI-7909] should display an enabled apply button with 'Apply $10.00 Free Bet' label", async () => {
                  expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
                  expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply $10.00 Free Bet");
                });

                describe("and closes the free bets wallets without applying the changes", () => {
                  beforeAll(async () => {
                    await generosityWalletPO.closeButton.waitForClickable();
                    await generosityWalletPO.closeButton.click();
                    await browser.waitUntilNotDisplayed(
                      extraWalletCardGroupPO.element,
                      "Free Bets Wallets are still displayed",
                    );
                  });

                  it("[PRPI-7909] should display a generosity alert with the same amount of free bets", async () => {
                    expect(await firstAlertPO.message.getText()).toBe("Includes $5.00 in Free Bets");
                  });

                  it("[PRPI-7909] should display the same balance after bet amount", async () => {
                    expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("$100.00");
                  });

                  it("[PRPI-7909] should display the same total returns amount", async () => {
                    expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$0.50");
                  });

                  it("[PRPI-7909] should display the same place bet button message", async () => {
                    expect(await placeButtonPO.element.getText()).toBe("Place $5.00 Bet");
                  });

                  describe("and adds a stake to the combination", () => {
                    beforeAll(async () => {
                      await stakePO.numberField.click();
                      await stakePO.setValue("2");
                    });

                    it("[PRPI-7909] should update balance after bet amount", async () => {
                      expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("$98.00");
                    });

                    it("[PRPI-7909] should display the total returns with the correct amount", async () => {
                      expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$2.70");
                    });

                    it("[PRPI-7909] should update place bet button message to 'Place $7.00 Bet'", async () => {
                      expect(await placeButtonPO.element.getText()).toBe("Place $7.00 Bet");
                    });

                    describe("and clicks on generosity alert remove action", () => {
                      beforeAll(async () => {
                        await secondAlertPO.actionLink.click();
                        await browser.waitUntilNotInDOM(secondAlertPO.element, "Generosity alert is still displayed");
                      });

                      it("[PRPI-7909] should remove the generosity alert", async () => {
                        expect(await firstAlertPO.element.getElement()).toBe(undefined);
                        expect(await secondAlertPO.element.getElement()).toBe(undefined);
                      });

                      it("[PRPI-7909] should reset the bet controls free bets button to be unselected", async () => {
                        expect(
                          await browser.containsClass(freeBetsButtonPO.element, PromoButtonPO.states.selected),
                        ).toBe(false);
                      });

                      it("[PRPI-7909] should keep the balance after bet", async () => {
                        expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("$98.00");
                      });

                      it("[PRPI-7909] should update the total returns", async () => {
                        expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$2.20");
                      });

                      it("[PRPI-7909] should update place bet button message to 'Place $2.00 Bet'", async () => {
                        expect(await placeButtonPO.element.getText()).toBe("Place $2.00 Bet");
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
