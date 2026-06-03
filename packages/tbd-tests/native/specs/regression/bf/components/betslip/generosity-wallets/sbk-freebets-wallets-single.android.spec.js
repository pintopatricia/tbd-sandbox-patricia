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
const { ALERT } = require("@ppb/the-wall-native/components/Alert/Alert.selectors");
const {
  AlertSO,
  BetControlsSO,
  BetsSummarySO,
  ExtraWalletCardGroupSO,
  ExtraWalletCardSO,
  FreeBetsSO,
  GenerosityWalletSO,
  OptionSO,
  PrimaryButtonSO,
  RunnerSO,
  SportsbookMarketSO,
  SportsbookPlacePanelSO,
  SportsbookBetButtonSO,
  CurrencyNumberInputFieldSO,
} = require("../../../../../../screen-objects");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { getStartViewLink } = require("../../../../../../helpers/view-link-start");
const { startApp } = require("../../../../../../helpers/urls");

const mockService = new MockService();

const sportsbookMarketSO = new SportsbookMarketSO();
const firstRunnerSO = new RunnerSO(sportsbookMarketSO.runnerList[0]);
const firstSbkRunnerButtonSO = new SportsbookBetButtonSO(firstRunnerSO.sbkBetButtons[0]);
const sportsbookPlaceSO = new SportsbookPlacePanelSO();
const freeBetsSO = new FreeBetsSO();
const betControlsSO = new BetControlsSO();
const stakeSO = new CurrencyNumberInputFieldSO(betControlsSO.currencyInput);

const firstAlertSO = new AlertSO(sportsbookPlaceSO.element.$$(`~${ALERT}`)[0]);
const secondAlertSO = new AlertSO(sportsbookPlaceSO.element.$$(`~${ALERT}`)[1]);

const betsSummarySO = new BetsSummarySO();
const placeButtonSO = new PrimaryButtonSO();

const generosityWalletSO = new GenerosityWalletSO();
const generosityWalletApplyButtonSO = new PrimaryButtonSO();
const generosityWalletAlertSO = new AlertSO(generosityWalletSO.element);

const extraWalletCardGroupSO = new ExtraWalletCardGroupSO();

const firstExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[0]);
const secondExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[1]);
const thirdExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[2]);
const fourthExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[3]);
const fifthExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[4]);
const sixthExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[5]);

const freeBetsAmountOptionSO = new OptionSO(extraWalletCardGroupSO.generosityAmountOption);
const firstExtraWalletCardOptionSO = new OptionSO(firstExtraWalletCardSO.walletOption);
const secondExtraWalletCardOptionSO = new OptionSO(secondExtraWalletCardSO.walletOption);
const thirdExtraWalletCardOptionSO = new OptionSO(thirdExtraWalletCardSO.walletOption);
const fourthExtraWalletCardOptionSO = new OptionSO(fourthExtraWalletCardSO.walletOption);
const fifthExtraWalletCardOptionSO = new OptionSO(fifthExtraWalletCardSO.walletOption);
const sixthExtraWalletCardOptionSO = new OptionSO(sixthExtraWalletCardSO.walletOption);

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
  thirdExpirationDate.setHours(thirdExpirationDate.getHours() + 1, thirdExpirationDate.getMinutes() + 1);

  const fourthExpirationDate = new Date(nowDate);
  fourthExpirationDate.setDate(fourthExpirationDate.getDate() + 1);
  fourthExpirationDate.setMinutes(fourthExpirationDate.getMinutes() + 5);

  const fifthExpirationDate = new Date(nowDate);
  fifthExpirationDate.setDate(fifthExpirationDate.getDate() + 60);
  fifthExpirationDate.setMinutes(fifthExpirationDate.getMinutes() + 5);

  const sixthExpirationDate = new Date(nowDate);
  sixthExpirationDate.setDate(sixthExpirationDate.getDate() + 365);
  sixthExpirationDate.setMinutes(sixthExpirationDate.getMinutes() + 1);

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

describe("SBK Generosity Wallet - Singles", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));

    const HOME_VIEW_LINK = getStartViewLink(`sport/competition/event/e-${EVENT_ID}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));
    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when a user with available promotions opens a betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilEquals(firstSbkRunnerButtonSO.odd, "1.1");
      await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(sportsbookPlaceSO.element, "Sportsbook betslip not displayed");
    });

    it("[PRPI-4181] should not display the use bonus checkbox", async () => {
      expect(await freeBetsSO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-4182] should display the bet controls generosity wallet button unselected", async () => {
      expect(await betControlsSO.generosityWalletButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-4183] should not display a generosity alert", async () => {
      expect(await sportsbookPlaceSO.element.$$(`~${ALERT}`).length).toEqual(0);
    });

    it("[PRPI-4184] should display the balance after bet with the correct amount", async () => {
      expect(await betsSummarySO.leftSegmentLabel.getText()).toBe("Balance After Bet");
      expect(await betsSummarySO.leftSegmentValue.getText()).toBe("$100.00");
    });

    it("[PRPI-4185] should display the total returns with the correct amount", async () => {
      expect(await betsSummarySO.totalReturnsLabel.getText()).toBe("Total Returns");
      expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$0.00");
    });

    it("[PRPI-4186] should display a disabled place bet button with the 'Place Bet' text", async () => {
      expect(await placeButtonSO.element.isDisplayed()).toBe(true);
      expect(await placeButtonSO.element.isEnabled()).toBe(false);
      expect(await placeButtonSO.label.getText()).toBe("Place Bet");
    });

    describe("and clicks on the Generosity Wallet promo button", () => {
      beforeAll(async () => {
        const expirationDates = getExpirationDates();
        const walletsWithExpirationDate = WALLETS.map((wallet, index) => ({
          ...wallet,
          expirationDate: expirationDates[index],
        }));
        await mockService.mockHttpRequest(getCardResults(getExtraWalletCardGroupBFFMock(walletsWithExpirationDate)));
        await browser.waitUntilClickableNative(betControlsSO.generosityWalletButton);
        await betControlsSO.generosityWalletButton.click();
        await browser.waitUntilDisplayed(generosityWalletSO.element, "Generosity Wallet Bottom Sheet is not displayed");
      });

      it("[PRPI-4187] should display the Generosity Wallet Bottom Sheet", async () => {
        expect(await generosityWalletSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4188] should display 'Your Bonuses' in the Bottom Sheet header", async () => {
        expect(await generosityWalletSO.headerTitle.getText()).toBe("Your Bonuses");
      });

      it("[PRPI-4189] should display a help alert", async () => {
        expect(await generosityWalletAlertSO.element.isDisplayed()).toBe(true);
        expect(await generosityWalletAlertSO.message.getText()).toBe("Bonuses are applied in the Betslip");
        expect(await generosityWalletAlertSO.actionLinkText.getText()).toBe("Help");
      });

      it("[PRPI-4190] should display an option with an icon and 'You have $40.00 in Free Bets' label", async () => {
        expect(await freeBetsAmountOptionSO.element.isDisplayed()).toBe(true);
        expect(await freeBetsAmountOptionSO.icon.isDisplayed()).toBe(true);
        expect(await freeBetsAmountOptionSO.title.getText()).toBe("You have $40.00 in Free Bets");
      });

      it("[PRPI-4191] should display 6 wallets", async () => {
        expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(6);

        expect(await firstExtraWalletCardSO.element.isDisplayed()).toBe(true);
        expect(await secondExtraWalletCardSO.element.isDisplayed()).toBe(true);
        expect(await thirdExtraWalletCardSO.element.isDisplayed()).toBe(true);
        expect(await fourthExtraWalletCardSO.element.isDisplayed()).toBe(true);
        expect(await fifthExtraWalletCardSO.element.isDisplayed()).toBe(true);
        expect(await sixthExtraWalletCardSO.element.isDisplayed()).toBe(true);
      });

      describe("and in the first wallet", () => {
        it("[PRPI-4192] should display the first wallet with '$2.00 Free Bet'", async () => {
          expect(await firstExtraWalletCardOptionSO.element.isDisplayed()).toBe(true);
          expect(await firstExtraWalletCardOptionSO.title.getText()).toBe("$2.00 Free Bet");
        });

        it("[PRPI-4193] should display the '1 min left' countdown", async () => {
          expect(await firstExtraWalletCardSO.countdown.isDisplayed()).toBe(true);
          expect(await firstExtraWalletCardSO.countdown.getText()).toBe("1 min left");
        });

        it("[PRPI-4194] should not display the restriction badges", async () => {
          expect(await firstExtraWalletCardSO.restrictionBadgesContainer.isDisplayed()).toBe(false);
        });
      });

      describe("and in the second wallet", () => {
        it("[PRPI-4195] should display the second wallet with '$3.00 Free Bet'", async () => {
          expect(await secondExtraWalletCardOptionSO.element.isDisplayed()).toBe(true);
          expect(await secondExtraWalletCardOptionSO.title.getText()).toBe("$3.00 Free Bet");
        });

        it("[PRPI-4196] should display the '1 min left' countdown", async () => {
          expect(await secondExtraWalletCardSO.countdown.isDisplayed()).toBe(true);
          expect(await secondExtraWalletCardSO.countdown.getText()).toBe("1 min left");
        });

        it("[PRPI-4197] should display the 'Football' restriction badge", async () => {
          expect(await secondExtraWalletCardSO.restrictionBadges.length).toBe(1);
          expect(await secondExtraWalletCardSO.restrictionBadges[0].getText()).toBe("Football");
        });
      });

      describe("and in the thrird wallet", () => {
        it("[PRPI-4198] should display the third wallet with '$5.00 Free Bet'", async () => {
          expect(await thirdExtraWalletCardOptionSO.element.isDisplayed()).toBe(true);
          expect(await thirdExtraWalletCardOptionSO.title.getText()).toBe("$5.00 Free Bet");
        });

        it("[PRPI-4199] should display the '1 hour left' countdown", async () => {
          expect(await thirdExtraWalletCardSO.countdown.isDisplayed()).toBe(true);
          expect(await thirdExtraWalletCardSO.countdown.getText()).toBe("1 hour left");
        });

        it("[PRPI-4200] should display the 'Football' and 'Basketball' restriction badges", async () => {
          expect(await thirdExtraWalletCardSO.restrictionBadges.length).toBe(2);
          expect(await thirdExtraWalletCardSO.restrictionBadges[0].getText()).toBe("Football");
          expect(await thirdExtraWalletCardSO.restrictionBadges[1].getText()).toBe("Basketball");
        });
      });

      describe("and in the fourth wallet", () => {
        it("[PRPI-4201] should display the fourth wallet with '$7.00 Free Bet'", async () => {
          expect(await fourthExtraWalletCardOptionSO.element.isDisplayed()).toBe(true);
          expect(await fourthExtraWalletCardOptionSO.title.getText()).toBe("$7.00 Free Bet");
        });

        it("[PRPI-4202] should display the '1 day left' countdown", async () => {
          expect(await fourthExtraWalletCardSO.countdown.isDisplayed()).toBe(true);
          expect(await fourthExtraWalletCardSO.countdown.getText()).toBe("1 day left");
        });

        it("[PRPI-4203] should display the 'Football' restriction badge", async () => {
          expect(await fourthExtraWalletCardSO.restrictionBadges.length).toBe(1);
          expect(await fourthExtraWalletCardSO.restrictionBadges[0].getText()).toBe("Football");
        });
      });

      describe("and in the fifth wallet", () => {
        it("[PRPI-4204] should display the fifth wallet with '$10.00 Free Bet'", async () => {
          expect(await fifthExtraWalletCardOptionSO.element.isDisplayed()).toBe(true);
          expect(await fifthExtraWalletCardOptionSO.title.getText()).toBe("$10.00 Free Bet");
        });

        it("[PRPI-4205] should display the '60 days left' countdown", async () => {
          expect(await fifthExtraWalletCardSO.countdown.isDisplayed()).toBe(true);
          expect(await fifthExtraWalletCardSO.countdown.getText()).toBe("60 days left");
        });

        it("[PRPI-4206] should display the 'Acca' and 'Football' restriction badges", async () => {
          expect(await fifthExtraWalletCardSO.restrictionBadges.length).toBe(2);
          expect(await fifthExtraWalletCardSO.restrictionBadges[0].getText()).toBe("Acca");
          expect(await fifthExtraWalletCardSO.restrictionBadges[1].getText()).toBe("Football");
        });
      });

      describe("and in the sixth wallet", () => {
        it("[PRPI-4207] should display the sixth wallet with '$13.00 Free Bet'", async () => {
          expect(await sixthExtraWalletCardOptionSO.element.isDisplayed()).toBe(true);
          expect(await sixthExtraWalletCardOptionSO.title.getText()).toBe("$13.00 Free Bet");
        });

        it("[PRPI-4208] should display the '365 days left' countdown", async () => {
          expect(await sixthExtraWalletCardSO.countdown.isDisplayed()).toBe(true);
          expect(await sixthExtraWalletCardSO.countdown.getText()).toBe("365 days left");
        });

        it("[PRPI-4209] should display the 'Bet Builder' restriction badge", async () => {
          expect(await sixthExtraWalletCardSO.restrictionBadges.length).toBe(1);
          expect(await sixthExtraWalletCardSO.restrictionBadges[0].getText()).toBe("Bet Builder");
        });
      });

      it("[PRPI-4210] should display a disabled apply button with an 'Apply' label", async () => {
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

        it("[PRPI-4211] should display an enabled apply button with 'Apply $2.00 Free Bet' label", async () => {
          expect(await generosityWalletApplyButtonSO.element.isEnabled()).toBe(true);
          expect(await generosityWalletApplyButtonSO.label.getText()).toBe("Apply $2.00 Free Bet");
        });

        describe("and selects the second wallet", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(secondExtraWalletCardOptionSO.checkbox);
            await secondExtraWalletCardOptionSO.checkbox.click();
            await browser.waitUntil(
              async () => (await secondExtraWalletCardOptionSO.checkbox.getAttribute("selected")) === "true",
            );
          });

          it("[PRPI-4212] should display an enabled apply button with 'Apply $5.00 Free Bet' label", async () => {
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

            it("[PRPI-4213] should not display the use bonus checkbox", async () => {
              expect(await freeBetsSO.element.isDisplayed()).toBe(false);
            });

            it("[PRPI-4214] should display the bet controls Generosity Wallet button selected", async () => {
              expect(await betControlsSO.generosityWalletButton.isDisplayed()).toBe(true);
            });

            it("[PRPI-4214] should display a generosity alert with the correct amount of free bets and a remove action", async () => {
              expect(await firstAlertSO.element.isDisplayed()).toBe(true);
              expect(await firstAlertSO.message.getText()).toBe("Includes $5.00 in Free Bets");
              expect(await firstAlertSO.actionLinkText.getText()).toBe("Remove");
            });

            it("[PRPI-4214] should display the same balance after bet amount", async () => {
              expect(await betsSummarySO.leftSegmentValue.getText()).toBe("$100.00");
            });

            it("[PRPI-4214] should display the total returns with the correct amount", async () => {
              expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$0.50");
            });

            it("[PRPI-4214] should display an enabled place bet button with the 'Place $5.00 Bet' text", async () => {
              expect(await placeButtonSO.element.isEnabled()).toBe(true);
              expect(await placeButtonSO.label.getText()).toBe("Place $5.00 Bet");
            });

            describe("and clicks again on the Generosity Wallet promo button", () => {
              beforeAll(async () => {
                await browser.waitUntilClickableNative(betControlsSO.generosityWalletButton);
                await betControlsSO.generosityWalletButton.click();
                await browser.waitUntilDisplayed(
                  generosityWalletSO.element,
                  "Generosity Wallets Bottom Sheet is not displayed",
                );
              });

              it("[PRPI-4215] should display the Generosity Wallet Bottom Sheet", async () => {
                expect(await generosityWalletSO.element.isDisplayed()).toBe(true);
              });

              it("[PRPI-4215] should display 6 wallets, with the first and second selected", async () => {
                expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(6);

                await browser.waitUntil(async () =>
                  Promise.all([
                    firstExtraWalletCardOptionSO.checkbox.getAttribute("selected") === "true",
                    secondExtraWalletCardOptionSO.checkbox.getAttribute("selected") === "true",
                    thirdExtraWalletCardOptionSO.checkbox.getAttribute("selected") === "false",
                    fourthExtraWalletCardOptionSO.checkbox.getAttribute("selected") === "false",
                    fifthExtraWalletCardOptionSO.checkbox.getAttribute("selected") === "false",
                    sixthExtraWalletCardOptionSO.checkbox.getAttribute("selected") === "false",
                  ]),
                );
              });

              it("[PRPI-4215] should display a disabled apply button with 'Apply $5.00 Free Bet' label", async () => {
                expect(await generosityWalletApplyButtonSO.element.isEnabled()).toBe(false);
                expect(await generosityWalletApplyButtonSO.label.getText()).toBe("Apply $5.00 Free Bet");
              });

              describe("and selects the third wallet", () => {
                beforeAll(async () => {
                  await browser.waitUntilClickableNative(thirdExtraWalletCardOptionSO.checkbox);
                  await thirdExtraWalletCardOptionSO.checkbox.click();
                  await browser.waitUntil(
                    async () => (await thirdExtraWalletCardOptionSO.checkbox.getAttribute("selected")) === "true",
                  );
                });

                it("[PRPI-4215] should display an enabled apply button with 'Apply $10.00 Free Bet' label", async () => {
                  expect(await generosityWalletApplyButtonSO.element.isEnabled()).toBe(true);
                  expect(await generosityWalletApplyButtonSO.label.getText()).toBe("Apply $10.00 Free Bet");
                });

                describe("and closes the generosity wallets without applying the changes", () => {
                  beforeAll(async () => {
                    await browser.waitUntilClickableNative(generosityWalletSO.closeButton);
                    await generosityWalletSO.closeButton.click();
                    await browser.waitUntilNotDisplayed(
                      extraWalletCardGroupSO.element,
                      "Generosity Wallets are still displayed",
                    );
                  });

                  it("[PRPI-4215] should display a generosity alert with the same amount of free bets", async () => {
                    expect(await firstAlertSO.message.getText()).toBe("Includes $5.00 in Free Bets");
                  });

                  it("[PRPI-4215] should display the same balance after bet amount", async () => {
                    expect(await betsSummarySO.leftSegmentValue.getText()).toBe("$100.00");
                  });

                  it("[PRPI-4215] should display the same total returns amount", async () => {
                    expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$0.50");
                  });

                  it("[PRPI-4215] should display the same place bet button message", async () => {
                    expect(await placeButtonSO.label.getText()).toBe("Place $5.00 Bet");
                  });

                  describe("and adds a stake to the combinations", () => {
                    beforeAll(async () => {
                      await browser.waitUntilClickableNative(stakeSO.numberField);
                      await stakeSO.numberField.click();
                      await stakeSO.setValue("2");
                    });

                    it("[PRPI-4215] should update balance after bet amount", async () => {
                      expect(await betsSummarySO.leftSegmentValue.getText()).toBe("$98.00");
                    });

                    it("[PRPI-4215] should display the total returns with the correct amount", async () => {
                      expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$2.70");
                    });

                    it("[PRPI-4215] should update place bet button message to 'Place $7.00 Bet'", async () => {
                      expect(await placeButtonSO.label.getText()).toBe("Place $7.00 Bet");
                    });

                    describe("and clicks on generosity alert remove action", () => {
                      beforeAll(async () => {
                        await secondAlertSO.actionLinkText.click();
                        await browser.waitUntil(
                          async () => (await sportsbookPlaceSO.element.$$(`~${ALERT}`).length) === 0,
                        );
                      });

                      it("[PRPI-4215] should remove the generosity alert", async () => {
                        expect(await sportsbookPlaceSO.element.$$(`~${ALERT}`).length).toEqual(0);
                      });

                      it("[PRPI-4215] should keep the balance after bet", async () => {
                        expect(await betsSummarySO.leftSegmentValue.getText()).toBe("$98.00");
                      });

                      it("[PRPI-4215] should reset the total returns to zero", async () => {
                        expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$2.20");
                      });

                      it("[PRPI-4215] should reset place bet button message to 'Place $2.00 Bet'", async () => {
                        expect(await placeButtonSO.element.isEnabled()).toBe(true);
                        expect(await placeButtonSO.label.getText()).toBe("Place $2.00 Bet");
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
