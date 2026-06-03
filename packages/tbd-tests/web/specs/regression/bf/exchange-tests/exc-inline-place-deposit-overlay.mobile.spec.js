const {
  AppPO,
  CardPO,
  NudgesNumberInputFieldPO,
  InlinePanelPO,
  ExchangeInlinePlacePanelPO,
  AlertPO,
  AlertsPO,
  OverlayPO,
  EventPagePO,
  SuccessfulDepositContentPO,
  ExchangeMarketPO,
  UserProfileHeaderPO,
  RunnerPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getPaymentsWebGateway } = require("../../../../mock-essentials/controllers/html/html-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { triggerPaymentsWebEvent } = require("../../../../helpers/paymentsWeb.util");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);

const inlinePanelPO = new InlinePanelPO();
const exchangeInlinePlacePanelPO = new ExchangeInlinePlacePanelPO();
const placeStakeFieldPO = new NudgesNumberInputFieldPO(exchangeInlinePlacePanelPO.inputs[1]);
const alertsPO = new AlertsPO();
const alertPO = new AlertPO(alertsPO.items[0]);
const overlayPO = new OverlayPO();
const userProfileHeaderPO = new UserProfileHeaderPO(overlayPO.element);
const successfulDepositContentPO = new SuccessfulDepositContentPO(overlayPO.element);

const mockService = new MockService();

const EVENT_ID = "29359895";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      sport: {
        name: "Football",
        urn: "ppb:eventType:1",
      },
    },
  },
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        __typename: "MarketCard",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337355",
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
                  runnerURN: "ppb:excRunner:1.160337355/48044/0",
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337355/48351/0",
                  selectionId: 48351,
                  name: "Man Utd",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337355/58805/0",
                  selectionId: 58805,
                  name: "The Draw",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
              { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
              { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        __typename: "MarketCard",
      },
    },
  ],
};

const WAS_MOCK = [{ amount: "5.00", walletName: "MAIN" }];

const WAS_FIRST_DEPOSIT_MOCK = [{ amount: "10.00", walletName: "MAIN" }];

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.01, size: 110 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      { selectionId: "58805", availableToBack: [], availableToLay: [] },
    ],
  },
];

const ETX_FAILURE_MOCK = {
  marketId: "1.160337355",
  instructionReports: [
    {
      selectionId: 48044,
      status: "FAILURE",
      instructionErrorCode: "ERROR_IN_ORDER",
      side: "LAY",
    },
  ],

  status: "FAILURE",
};

const ETX_FAILURE_MOCK_WITH_INSUFFICIENT_FUNDS = {
  ...ETX_FAILURE_MOCK,
  orderErrorCode: "INSUFFICIENT_FUNDS",
};

describe("Betslip - Exchange Successful Deposit Overlay", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getWallets(WAS_MOCK));
    await mockService.mockHttpRequest(getPaymentsWebGateway());
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);
    await browser.waitUntil(
      AppPO.exchangeRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.1,
      }),
    );
  });

  describe("When the user has insufficient amount to place a bet and presses 'Deposit to Place Bet'", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getPlaceBetResponse(ETX_FAILURE_MOCK_WITH_INSUFFICIENT_FUNDS));
      await firstRunnerExchangePO.exchangeBetButtons[0].waitForClickable();
      await firstRunnerExchangePO.exchangeBetButtons[0].click();
      await browser.waitUntilDisplayed(inlinePanelPO.element, "Selection hasn't been added");

      await placeStakeFieldPO.setValue(6);

      await exchangeInlinePlacePanelPO.placeButton.waitForClickable();
      await exchangeInlinePlacePanelPO.placeButton.click();

      await browser.waitUntilDisplayed(alertPO.icon, "Error notification not displayed");
      await browser.waitUntilEquals(exchangeInlinePlacePanelPO.placeButton, "Deposit to Place Bet");

      await exchangeInlinePlacePanelPO.placeButton.waitForClickable();
      await exchangeInlinePlacePanelPO.placeButton.click();
      await browser.waitUntilDisplayed(overlayPO.element, "Overlay not displayed");
      await browser.waitUntilDisplayed(userProfileHeaderPO.element, "User profile not displayed");
    });

    it("[PRPI-5364] The User Profile overlay should be displayed", async () => {
      expect(await userProfileHeaderPO.element.isDisplayed()).toBe(true);
    });

    describe("When user does a successful deposit", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getWallets(WAS_FIRST_DEPOSIT_MOCK));
        await mockService.mockHttpRequest(getPlaceBetResponse(ETX_FAILURE_MOCK));
        await triggerPaymentsWebEvent({ action: "DEPOSIT_SUCCESS" });
        await browser.waitUntilDisplayed(
          successfulDepositContentPO.element,
          "Successful deposit content not displayed",
        );
      });

      it("[PRPI-5365] Should show an overlay with an icon", async () => {
        expect(await successfulDepositContentPO.icon.isDisplayed()).toBe(true);
      });

      it("[PRPI-5366] Should show an overlay title with 'Deposit Successful!'", async () => {
        expect(await successfulDepositContentPO.title.getText()).toBe("Deposit Successful!");
      });

      it("[PRPI-5367] Should show an overlay subtitle with 'Placing Bet...'", async () => {
        expect(await successfulDepositContentPO.subtitle.getText()).toBe("Placing Bet...");
      });
    });
  });
});
