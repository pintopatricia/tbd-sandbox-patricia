const ExpandableMarketCardSO = require("@ppb/tbd-shared/components/ExpandableMarketCard/ExpandableMarketCard.native.so");
const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const { GenericViewSO, CardSO } = require("../../../../screen-objects");

const mockService = new MockService();

const genericViewSO = new GenericViewSO();
const firstExpandableMarketCardSO = new ExpandableMarketCardSO(genericViewSO.items[0]);
const secondExpandableMarketCardSO = new ExpandableMarketCardSO(genericViewSO.items[1]);
const firstExpandableCardCollapsible = new CardSO(firstExpandableMarketCardSO.element);
const secondExpandableCardCollapsible = new CardSO(secondExpandableMarketCardSO.element);

const EVENT_ID = "29682729";

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  url: "view/generic:home",
  edges: [
    {
      node: {
        __typename: "ExpandableMarketCard",
        urn: "ppb:tbd:card:expandableMarket:1.1;924.1",
        title: "Match Odds",
        marketCardURN: "ppb:tbd:card:market:1.1;924.1",
      },
    },
    {
      node: {
        __typename: "ExpandableMarketCard",
        urn: "ppb:tbd:card:expandableMarket:1.2;924.2",
        title: "Correct Score",
        marketCardURN: "ppb:tbd:card:market:1.2;924.2",
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "ExpandableMarketCard",
        urn: "ppb:tbd:card:expandableMarket:1.1;924.1",
      },
    },
    {
      node: {
        __typename: "ExpandableMarketCard",
        urn: "ppb:tbd:card:expandableMarket:1.2;924.2",
      },
    },
  ],
};

const BFF_CARDS_MOCK = {
  cards: [
    {
      __typename: "MarketCard",
      urn: "ppb:tbd:card:market:1.1;924.1",
      title: "Match Odds",
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.1",
            hierarchy: {
              __typename: "EventHierarchy",
              sportevent: {
                name: "Wolves v Man Utd",
                urn: `ppb:event:${EVENT_ID}`,
              },
            },
            runners: [
              {
                runnerURN: "ppb:excRunner:1.1/1/0",
                selectionId: 1,
                name: "Wolves",
              },
            ],
          },
          runners: [{ runnerURN: "ppb:excRunner:1.1/1/0" }],
        },
      },
    },
  ],
};

describe("Expandable market card", () => {
  describe("When the user is on a generic view with expandable market cards", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));
      await startApp("home");
      await browser.waitUntilDisplayed(genericViewSO.element);
      await browser.waitUntilDisplayed(firstExpandableMarketCardSO.element);
    });

    it("[PRPI-1937] The expandable market cards should be collapsed and no market cards should be displayed", async () => {
      expect(await firstExpandableCardCollapsible.exchangeMarket.isDisplayed()).toBe(false);
      expect(await secondExpandableCardCollapsible.exchangeMarket.isDisplayed()).toBe(false);
    });

    it("[PRPI-1938] The 1st expandable market card title should be Match Odds", async () => {
      expect(await firstExpandableMarketCardSO.title.getText()).toBe("Match Odds");
    });

    describe("When the user clicks on first expandable market card", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(firstExpandableMarketCardSO.element);
        await firstExpandableMarketCardSO.title.click();
        await browser.waitUntilDisplayed(firstExpandableCardCollapsible.contentWrapper);
        await browser.waitUntilDisplayed(firstExpandableCardCollapsible.exchangeMarket);
      });

      it("[PRPI-1939] The market card should be displayed on the first expandable market card", async () => {
        expect(await firstExpandableCardCollapsible.exchangeMarket.isDisplayed()).toBe(true);
        expect(await secondExpandableCardCollapsible.exchangeMarket.isDisplayed()).toBe(false);
      });

      it("[PRPI-1940] The market card title should not be visible", async () => {
        expect(await firstExpandableCardCollapsible.contentWrapper.isDisplayed()).toBe(true);
        const firstMarketCardSO = new CardSO(firstExpandableCardCollapsible.contentWrapper);

        expect(await firstMarketCardSO.title.isDisplayed()).toBe(false);
      });

      describe("When the user click again on first expandable market card", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(firstExpandableMarketCardSO.title);
          await firstExpandableMarketCardSO.title.click();
          await browser.waitUntilNotDisplayed(firstExpandableCardCollapsible.contentWrapper);
          await browser.waitUntilNotDisplayed(firstExpandableCardCollapsible.exchangeMarket);
        });

        it("[PRPI-1941] The market card should not be displayed anymore", async () => {
          expect(await firstExpandableCardCollapsible.exchangeMarket.isDisplayed()).toBe(false);
        });
      });
    });
  });
});
