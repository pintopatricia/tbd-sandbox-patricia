const {
  MinimizedPO,
  SportPagePO,
  SportsbookReceiptPanelPO,
  SuccessfulDepositContentPO,
  UserProfileHeaderPO,
  SportsbookBetButtonPO,
  BetControlsPO,
  CardPO,
  CurrencyNumberInputFieldPO,
  BetslipDrawerPO,
  AlertPO,
  OverlayPO,
  PrimaryButtonPO,
  InlineSportsbookMarketPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getPaymentsWebGateway } = require("../../../../../../mock-essentials/controllers/html/html-controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");
const { triggerPaymentsWebEvent } = require("../../../../../../helpers/paymentsWeb.util");

const sportPagePO = new SportPagePO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);

const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[1]);
const secondMatchOddsCard = new CardPO(secondEventMarketCardPO.market);
const secondSbkMarketPO = new InlineSportsbookMarketPO(secondMatchOddsCard.inlineSportsbookMarket);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[0]);

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const betControlsPO = new BetControlsPO(sportsbookPlacePanelPO.element);
const stakeFieldPO = new CurrencyNumberInputFieldPO(betControlsPO.currencyInput);
const minimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const alertPO = new AlertPO(sportsbookPlacePanelPO.element);
const primaryButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);

const overlayPO = new OverlayPO();
const userProfileHeaderPO = new UserProfileHeaderPO();
const successfulDepositContentPO = new SuccessfulDepositContentPO();

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League 1",
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
                    name: "Team A",
                  },
                  away: {
                    name: "Team B",
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
                          name: "Team A v Team B",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team A",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Team B",
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
                sportevent: {
                  name: "Team A vs Team B",
                  urn: "ppb:event:29359895",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
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
                title: "Team C vs Team D",
                fixture: {
                  urn: "ppb:fixture:29359896",
                  home: {
                    name: "Team C",
                  },
                  away: {
                    name: "Team D",
                  },
                },
                sportevent: {
                  name: "Team C vs Team D",
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
                          name: "Team C v Team D",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/4",
                          selectionId: 4,
                          name: "Team C",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/5",
                          selectionId: 5,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/6",
                          selectionId: 6,
                          name: "Team D",
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

const WAS_MOCK = [
  { amount: "5.00", walletName: "MAIN" },
  { amount: "0.00", walletName: "SPORTSBOOK_BONUS_WAGERING" },
];

const WAS_FIRST_DEPOSIT_MOCK = [
  { amount: "10.00", walletName: "MAIN" },
  { amount: "0.00", walletName: "SPORTSBOOK_BONUS_WAGERING" },
];

const WAS_SECOND_DEPOSIT_MOCK = [
  { amount: "15.00", walletName: "MAIN" },
  { amount: "0.00", walletName: "SPORTSBOOK_BONUS_WAGERING" },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
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
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
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
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: "4",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "5",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
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

const SIB_SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SIB_DOUBLE_MOCK = {
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

const SPB_FAILURE_MOCK = {
  result: [
    {
      runners: [
        {
          failureCode: "MARKET_SUSPENDED",
          runner: { marketId: "924.1", selectionId: 1 },
        },
        {
          failureCode: "MARKET_SUSPENDED",
          runner: { marketId: "924.2", selectionId: 4 },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
          winOdds: {},
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.2", selectionId: 4 } }],
          },
          winOdds: {},
        },
      ],

      resultCode: "BET_PLACEMENT_RUNNER_FAILURE",
    },
  ],

  respCode: "BET_PLACEMENT_FAILURE",
};

const SPB_SUCCESS_MOCK = {
  result: [
    {
      numLines: 1,
      totalStake: 0.6,
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
          winOdds: {},
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.2", selectionId: 4 } }],
          },
          winOdds: {},
        },
      ],

      totalPotentialWin: 2.31,
    },
  ],
};

describe("Betslip - Sportsbook Multiples Successful Deposit Overlay", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getWallets(WAS_MOCK));
    await mockService.mockHttpRequest(getPaymentsWebGateway());
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));

    await browser.waitUntilDisplayed(sportPagePO.actionLink[0], "ActionLink not visible");
    await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");
  });

  describe("When the user has insufficient amount to place a bet and presses 'Deposit to Place Bet'", () => {
    beforeAll(async () => {
      await firstSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await firstSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Sportsbook single Betslip not displayed");

      await betslipDrawerPO.header.waitForClickable();
      await betslipDrawerPO.header.click();
      await browser.waitUntilNotDisplayed(sportsbookPlacePanelPO.element, "Sportsbook single Betslip still displayed");

      await secondSbkRunnerPO.element.scrollIntoView();
      await browser.waitUntilDisplayed(secondSbkRunnerPO.element, "Second Sportsbook runner button not displayed");

      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK));
      await secondSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await secondSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilEquals(minimizedPO.counter, "2");

      await minimizedPO.element.waitForClickable();
      await minimizedPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Sportsbook multiples Betslip not displayed");

      await stakeFieldPO.setValue(6);
      await browser.waitUntilDisplayed(alertPO.icon, "Error notification not displayed");
      await browser.waitUntilEquals(primaryButtonPO.element, "Deposit to Place $6.00 Bet");

      await primaryButtonPO.element.waitForClickable();
      await primaryButtonPO.element.click();
      await browser.waitUntilDisplayed(overlayPO.element, "Overlay not displayed");
      await browser.waitUntilDisplayed(userProfileHeaderPO.element, "User profile not displayed");
    });

    it("[PRPI-7815] The User Profile overlay should be displayed", async () => {
      expect(await userProfileHeaderPO.element.isDisplayed()).toBe(true);
    });

    describe("When the user closes the overlay and opens it again", () => {
      beforeAll(async () => {
        await userProfileHeaderPO.closeButton.click();

        await browser.waitUntilEquals(primaryButtonPO.element, "Deposit to Place $6.00 Bet");

        await primaryButtonPO.element.waitForClickable();
        await primaryButtonPO.element.click();
        await browser.waitUntilDisplayed(overlayPO.element, "Overlay not displayed");
        await browser.waitUntilDisplayed(userProfileHeaderPO.element, "User profile not displayed");
      });

      it("[PRPI-7816] The User Profile overlay should be displayed", async () => {
        expect(await userProfileHeaderPO.element.isDisplayed()).toBe(true);
      });

      describe("When user does a successful deposit", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getWallets(WAS_FIRST_DEPOSIT_MOCK));
          await mockService.mockHttpRequest(getPlaceBet(SPB_FAILURE_MOCK));
          await triggerPaymentsWebEvent({
            action: "DEPOSIT_SUCCESS",
            payload: {
              currency: "eur",
              deposited: 10,
              transactionId: "123456",
              methodType: "type",
              firstDeposit: false,
              message: "message",
            },
          });
          await browser.waitUntilDisplayed(
            successfulDepositContentPO.element,
            "Successful deposit content not displayed",
          );
        });

        it("[PRPI-7817] Should show an overlay with an icon", async () => {
          expect(await successfulDepositContentPO.icon.isDisplayed()).toBe(true);
        });

        it("[PRPI-7817] Should show an overlay title with 'Deposit Successful!'", async () => {
          expect(await successfulDepositContentPO.title.getText()).toBe("Deposit Successful!");
        });

        it("[PRPI-7817] Should show an overlay subtitle with 'Placing Bet...'", async () => {
          expect(await successfulDepositContentPO.subtitle.getText()).toBe("Placing Bet...");
        });

        describe("When the overlay is dismissed and the bet is not successfully placed", () => {
          beforeAll(async () => {
            await browser.waitUntilDisplayed(
              sportsbookPlacePanelPO.element,
              "Sportsbook multiples Betslip not displayed",
            );
          });

          it("[PRPI-7817] Should show the place panel with error notification", async () => {
            expect(await alertPO.icon.isDisplayed()).toBe(true);
            expect(await alertPO.message.getText()).toBe("Not enough money in your main wallet.");
          });

          describe("When the user tries to place another bet with insufficient funds and both deposit and place are successful", () => {
            beforeAll(async () => {
              await stakeFieldPO.numberField.scrollIntoView();
              await browser.waitUntilDisplayed(stakeFieldPO.numberField, "Multiple stake filed not displayed");

              await stakeFieldPO.setValue(1000);
              await browser.waitUntilDisplayed(alertPO.icon, "Error notification not displayed");
              await browser.waitUntilEquals(primaryButtonPO.element, "Deposit to Place $1,000.00 Bet");

              await primaryButtonPO.element.waitForClickable();
              await primaryButtonPO.element.click();
              await browser.waitUntilDisplayed(overlayPO.element, "Overlay not displayed");
              await browser.waitUntilDisplayed(userProfileHeaderPO.element, "User profile not displayed");

              await mockService.mockHttpRequest(getWallets(WAS_SECOND_DEPOSIT_MOCK));
              await mockService.mockHttpRequest(getPlaceBet(SPB_SUCCESS_MOCK));
              await triggerPaymentsWebEvent({
                action: "DEPOSIT_SUCCESS",
                payload: {
                  currency: "eur",
                  deposited: 10,
                  transactionId: "123456",
                  methodType: "type",
                  firstDeposit: false,
                  message: "message",
                },
              });
              await browser.waitUntilDisplayed(
                successfulDepositContentPO.element,
                "Successful deposit content not displayed",
              );

              await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element, "Sportsbook receipt not displayed");
            });

            it("[PRPI-7817] Should show the receipt panel", async () => {
              expect(await sportsbookReceiptPanelPO.element.isDisplayed()).toBe(true);
            });
          });
        });
      });
    });
  });
});
