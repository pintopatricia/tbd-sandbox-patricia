const {
  CardPO,
  ExchangeInlinePlacePanelPO,
  NudgesNumberInputFieldPO,
  PrimaryButtonPO,
  InlinePanelPO,
  AppPO,
  ExchangeBetButtonPO,
  EventPagePO,
  ExchangeInlineConfirmPanelPO,
  ExchangeMarketPO,
  RunnerPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);

const exchangeInlinePlacePanelPO = new ExchangeInlinePlacePanelPO();
const inlinePanelPO = new InlinePanelPO();
const placeStakeInputFieldPO = new NudgesNumberInputFieldPO(exchangeInlinePlacePanelPO.inputs[1]);
const placeButtonPO = new PrimaryButtonPO(exchangeInlinePlacePanelPO.place);

const exchangeInlineConfirmPanelPO = new ExchangeInlineConfirmPanelPO();
const exchangeBetButtonPO = new ExchangeBetButtonPO(firstRunnerExchangePO.exchangeBetButtons[0]);

const mockService = new MockService();

const EVENT_ID = "29359895";

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
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

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
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
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        __typename: "MarketCard",
        cardTitle: "Correct Score",
        diplayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337366",
              name: "Correct Score",
              sportevent: {
                name: "Wolves v Man Utd",
                urn: `ppb:event:${EVENT_ID}`,
              },
              runners: [
                {
                  runnerURN: "ppb:excRunner:1.160337366/1/0",
                  selectionId: 1,
                  name: "0 - 0",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/4/0",
                  selectionId: 4,
                  name: "0 - 1",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/9/0",
                  selectionId: 9,
                  name: "0 - 2",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337366/1/0" },
              { runnerURN: "ppb:excRunner:1.160337366/4/0" },
              { runnerURN: "ppb:excRunner:1.160337366/9/0" },
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
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        __typename: "MarketCard",
      },
    },
  ],
};

const POSITION_VIEWS = {
  marketPositions: [],
};

describe("Exchange Inline Confirm Cancel", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { exchangeConfirmBetPlacement: true }));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);
    await browser.waitUntil(AppPO.exchangeRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));

    await firstRunnerExchangePO.exchangeBetButtons[0].waitForClickable();
    await firstRunnerExchangePO.exchangeBetButtons[0].click();
    await browser.waitUntilDisplayed(exchangeInlinePlacePanelPO.element);
  });

  describe("When user press place bet button on place panel", () => {
    beforeAll(async () => {
      await placeStakeInputFieldPO.setValue("2");

      await placeButtonPO.element.waitForClickable();
      await placeButtonPO.element.click();
      await browser.waitUntilDisplayed(exchangeInlineConfirmPanelPO.element);
    });

    it("[PRPI-5360] the confirm panel should be displayed", async () => {
      expect(await exchangeInlineConfirmPanelPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-5361] the 'Cancel' button should be displayed", async () => {
      expect(await inlinePanelPO.action.isDisplayed()).toEqual(true);
    });

    describe("When user press cancel button on confirm panel", () => {
      beforeAll(async () => {
        await exchangeInlineConfirmPanelPO.cancel.click();
        await browser.waitUntilNotDisplayed(exchangeInlineConfirmPanelPO.element);
      });

      it("[PRPI-5362] the betslip should close", async () => {
        expect(await inlinePanelPO.element.isExisting()).toBe(false);
      });

      it("[PRPI-5363] the bet button should stay unselected", async () => {
        expect(await browser.containsClass(exchangeBetButtonPO.element, ExchangeBetButtonPO.states.selected)).toBe(
          false,
        );
      });
    });
  });
});
