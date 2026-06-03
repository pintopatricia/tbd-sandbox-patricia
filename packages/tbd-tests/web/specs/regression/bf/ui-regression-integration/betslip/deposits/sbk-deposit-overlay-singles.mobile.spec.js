const {
  CardPO,
  CurrencyNumberInputFieldPO,
  AlertPO,
  OverlayPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetControlsPO,
  SportPagePO,
  SportsbookReceiptPanelPO,
  SportsbookPlacePanelPO,
  SuccessfulDepositContentPO,
  UserProfileHeaderPO,
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
const placePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO(placePanelPO.element);
const stakeFieldPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const singleAlertPO = new AlertPO(placePanelPO.element);
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
        cardGroupTitle: "League",
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
                    name: "Team B",
                  },
                  away: {
                    name: "Team A",
                  },
                },
                sportevent: {
                  name: "Team A vs Team B ",
                  urn: "ppb:event:29359895",
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
                      urn: "ppb:sbkMarket:924.1",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B v Team A",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team B",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Team A",
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
            decimalDisplayOdds: { decimalOdds: 1.1 },
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
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
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

const SIB_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SPB_FAILURE_MOCK = {
  result: [
    {
      runners: [{ failureCode: "MARKET_SUSPENDED", runner: { marketId: "924.1", selectionId: 1 } }],
      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
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
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      totalPotentialWin: 2,
    },
  ],
};

describe("Betslip - Sportsbook Singles Successful Deposit Overlay", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getWallets(WAS_MOCK));
    await mockService.mockHttpRequest(getPaymentsWebGateway());
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));

    await browser.waitUntilDisplayed(sportPagePO.actionLink[0], "ActionLink not visible");
    await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");
  });

  describe("When the user has insufficient amount to place a bet and presses 'Deposit to Place Bet'", () => {
    beforeAll(async () => {
      await firstSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await firstSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "Sportsbook single Betslip not displayed");

      await stakeFieldPO.setValue(6);
      await browser.waitUntilDisplayed(singleAlertPO.icon, "Error notification not displayed");
      await browser.waitUntilEquals(placePanelPO.place, "Deposit to Place $6.00 Bet");

      await placePanelPO.place.waitForClickable();
      await placePanelPO.place.click();
      await browser.waitUntilDisplayed(overlayPO.element, "Overlay not displayed");
      await browser.waitUntilDisplayed(userProfileHeaderPO.element, "User profile not displayed");
    });

    it("[PRPI-7818] The User Profile overlay should be displayed", async () => {
      expect(await userProfileHeaderPO.element.isDisplayed()).toBe(true);
    });

    describe("When the user closes the overlay and opens it again", () => {
      beforeAll(async () => {
        await userProfileHeaderPO.closeButton.click();

        await browser.waitUntilDisplayed(placePanelPO.element, "Sportsbook single Betslip not displayed");

        await placePanelPO.place.waitForClickable();
        await placePanelPO.place.click();
        await browser.waitUntilDisplayed(userProfileHeaderPO.element, "User profile not displayed");
      });

      it("[PRPI-7819] The User Profile overlay should be displayed", async () => {
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

        it("[PRPI-7820] Should show an overlay with an icon", async () => {
          expect(await successfulDepositContentPO.icon.isDisplayed()).toBe(true);
        });

        it("[PRPI-7820] Should show an overlay title with 'Deposit Successful!'", async () => {
          expect(await successfulDepositContentPO.title.getText()).toBe("Deposit Successful!");
        });

        it("[PRPI-7820] Should show an overlay subtitle with 'Placing Bet...'", async () => {
          expect(await successfulDepositContentPO.subtitle.getText()).toBe("Placing Bet...");
        });

        describe("When the overlay is dismissed and the bet is not successfully placed", () => {
          beforeAll(async () => {
            await browser.waitUntilDisplayed(placePanelPO.element, "Sportsbook single Betslip not displayed");
          });

          it("[PRPI-7820] Should show the place panel with error notification", async () => {
            expect(await singleAlertPO.icon.isDisplayed()).toBe(true);
            expect(await singleAlertPO.message.getText()).toBe("Not enough money in your main wallet.");
          });

          describe("When the user tries to place another bet with insufficient funds and deposit and place bets are both successful", () => {
            beforeAll(async () => {
              await stakeFieldPO.numberField.click();
              await browser.waitUntil(() => stakeFieldPO.numberField.isFocused());

              await stakeFieldPO.setValue("1000");

              await browser.waitUntilDisplayed(singleAlertPO.icon, "Error notification not displayed");
              await browser.waitUntilEquals(placePanelPO.place, "Deposit to Place $1,000.00 Bet");

              await placePanelPO.place.waitForClickable();
              await placePanelPO.place.click();
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

            it("[PRPI-7820] Should show the receipt panel", async () => {
              expect(await sportsbookReceiptPanelPO.element.isDisplayed()).toBe(true);
            });
          });
        });
      });
    });
  });
});
