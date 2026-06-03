const {
  AppPO,
  EventPagePO,
  ExchangeMarketPO,
  CardPO,
  KeyboardPO,
  InlinePanelPO,
  RunnerPO,
  ExchangeInlinePlacePanelPO,
  NudgesNumberInputFieldPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);

const inlinePanelPO = new InlinePanelPO();
const exchangeInlinePlacePanelPO = new ExchangeInlinePlacePanelPO(inlinePanelPO.element);
const keyboardPO = new KeyboardPO();
const exchangePriceInputFieldPO = new NudgesNumberInputFieldPO(exchangeInlinePlacePanelPO.inputs[0]);
const exchangeSizeInputFieldPO = new NudgesNumberInputFieldPO(exchangeInlinePlacePanelPO.inputs[1]);

const mockService = new MockService();

const EVENT_ID = "29359895";

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
                  eventId: EVENT_ID,
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                  competition: { competitionId: 1 },
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

              noLiveData: true,
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

describe("Exchange Inline Betslip - Keyboard Interaction", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));

    await browser.waitUntil(
      AppPO.exchangeRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.01,
        betButtonIndex: 1,
      }),
    );
  });

  describe("When an EXC bet button is pressed", () => {
    beforeAll(async () => {
      await firstRunnerExchangePO.exchangeBetButtons[1].waitForClickable();
      await firstRunnerExchangePO.exchangeBetButtons[1].click();
      await browser.waitUntilDisplayed(keyboardPO.element);
    });

    it("[PRPI-5385] The inline betslip should appear", async () => {
      expect(await exchangeInlinePlacePanelPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-5386] And the keyboard should be displayed", async () => {
      expect(await keyboardPO.element.isDisplayedInViewport()).toBe(true);
    });

    describe("When a size of 2.50 is added", () => {
      beforeAll(async () => {
        await keyboardPO.two.waitForClickable();
        await keyboardPO.two.click();
        await keyboardPO.separator.click();
        await keyboardPO.five.click();
        await keyboardPO.zero.click();

        await browser.waitUntilEquals(exchangeSizeInputFieldPO.numberField, "2.50");
      });

      it("[PRPI-5387] The value 2.50 should appear in size input field", async () => {
        expect(await exchangeSizeInputFieldPO.numberField.getValue()).toEqual("2.50");
      });

      describe("When the backspace key is pressed one time", () => {
        beforeAll(async () => {
          await keyboardPO.delete.waitForClickable();
          await keyboardPO.delete.click();
        });

        it("[PRPI-5388] The size value should update to 2.5", async () => {
          expect(await exchangeSizeInputFieldPO.numberField.getValue()).toEqual("2.5");
        });

        describe("When the price field is focused and a price of 2.50 is added", () => {
          beforeAll(async () => {
            await exchangePriceInputFieldPO.numberField.waitForClickable();
            await exchangePriceInputFieldPO.numberField.click();
            await browser.waitUntilDisplayed(keyboardPO.element);

            await keyboardPO.clearInputField(exchangePriceInputFieldPO.numberField);
            await browser.waitUntilEquals(exchangePriceInputFieldPO.numberField, "");

            await keyboardPO.two.waitForClickable();
            await keyboardPO.two.click();
            await keyboardPO.separator.click();
            await keyboardPO.five.click();
            await keyboardPO.zero.click();

            await browser.waitUntilEquals(exchangePriceInputFieldPO.numberField, "2.50");
          });

          it("[PRPI-5389] The value 2.50 should stay in price input field", async () => {
            expect(await exchangePriceInputFieldPO.numberField.getValue()).toEqual("2.50");
          });
        });
      });
    });
  });
});
