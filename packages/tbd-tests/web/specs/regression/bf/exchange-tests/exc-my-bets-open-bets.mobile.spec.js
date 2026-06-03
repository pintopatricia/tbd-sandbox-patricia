const { MyBetsPagePO, MyBetsHeaderPO, SegmentedControlPO, TabsGroupPO, AlertPO } = require("../../../../page-objects");
const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const tabsPO = new TabsGroupPO();
const myBetsHeaderPO = new MyBetsHeaderPO();
const alertPO = new AlertPO();
const firstBetCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[0]);
const secondBetCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[1]);
const segmentedControlPO = new SegmentedControlPO();

const ONE_EVENT_AGG_MOCK = [
  {
    aggregatorDesc: "Sporting Lisbon v Rio Ave",
    edges: [
      {
        __typename: "FixtureCard",
        homeName: "Sporting Lisbon",
        awayName: "Rio Ave",
        scheduledAt: "2023-09-25T19:15:00Z",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Double Chance",
            numOfOrders: 1,
            numOfUnmatched: 1,
          },
          {
            __typename: "MarketBetExpandableCardGroup",
            isOpen: true,
            edges: [
              {
                __typename: "MarketBetSelectionCardGroup",
                edges: [
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "322311028610",
                    handicap: 0,
                    placedDate: "2023-09-25T16:44:09.000Z",
                    settledDate: null,
                    matchedDate: "1970-01-01T00:00:00.000Z",
                    price: 9,
                    runnerDesc: "Home or Draw",
                    side: "BACK",
                    size: 1,
                    profit: 8,
                    selectionId: 6384646,
                    isUnmatched: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const TWO_EVENT_AGG_MOCK = [
  ...ONE_EVENT_AGG_MOCK,
  {
    aggregatorDesc: "Italy (W) v Sweden (W)",
    edges: [
      {
        __typename: "FixtureCard",
        homeName: "Italy (W)",
        awayName: "Sweden (W)",
        scheduledAt: "2023-09-26T15:45:00Z",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Match Odds",
            numOfOrders: 1,
            numOfUnmatched: 1,
          },
          {
            __typename: "MarketBetExpandableCardGroup",
            isOpen: true,
            edges: [
              {
                __typename: "MarketBetSelectionCardGroup",
                edges: [
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "322407484803",
                    handicap: 0,
                    placedDate: "2023-09-26T14:54:20.000Z",
                    settledDate: null,
                    matchedDate: "1970-01-01T00:00:00.000Z",
                    price: 6,
                    runnerDesc: "Sweden (W)",
                    side: "BACK",
                    size: 1,
                    profit: 5,
                    selectionId: 541860,
                    isUnmatched: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const UNMATCHED_FILTERED_FOOTBALL_EVENT_MOCK = getMyBetsEXCViewMock(ONE_EVENT_AGG_MOCK, {
  isOpen: true,
  isOpenBetsFiltered: true,
});

const UNMATCHED_UNFILTERED_FOOTBALL_EVENT_MOCK = getMyBetsEXCViewMock(TWO_EVENT_AGG_MOCK, {
  isOpen: true,
  isOpenBetsFiltered: false,
});

describe("My Bets Page - Open Bets", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(UNMATCHED_FILTERED_FOOTBALL_EVENT_MOCK.urn, { products: ["EXCHANGE"] }),
    );
    await mockService.mockHttpRequest(getMyBetsLayout(UNMATCHED_FILTERED_FOOTBALL_EVENT_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
    await browser.url(routes.getMyBetsViewUrl("open"));

    await browser.waitUntilDisplayed(firstBetCardGroupPO.element, "First Bet Card Group not visible");
  });

  describe("when the user opens the my bets page with marketIds filters (Open Bets)", () => {
    it("[PRPI-4814] should display the filtered view alert", async () => {
      await browser.waitUntilDisplayed(alertPO.element, "Filtered view alert not visible");
    });

    it("[PRPI-4815] the filtered view alert should display the info icon and label", async () => {
      expect(await alertPO.icon.isDisplayed()).toBe(true);
      expect(await alertPO.message.getText()).toBe("This is a filtered view");
    });

    it("[PRPI-4816] the filtered view should display the 'Show All My Bets' button", async () => {
      expect(await alertPO.actionLink.getText()).toBe("Show All My Bets");
    });

    it("[PRPI-5556] should not display the order type tabs", async () => {
      expect(await tabsPO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-5557] should display the matched status segmented control", async () => {
      expect(await segmentedControlPO.element.isDisplayed()).toEqual(true);
      expect(await segmentedControlPO.options[0].getText()).toEqual("Unmatched");
      expect(await segmentedControlPO.options[1].getText()).toEqual("Matched");
    });

    it("[PRPI-5558] should show 1 bet card group", async () => {
      expect(await myBetsPO.betCardGroups.length).toBe(1);
    });

    describe("when the user clicks on the show all my bets button", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMyBetsLayout(UNMATCHED_UNFILTERED_FOOTBALL_EVENT_MOCK));

        await alertPO.actionLink.waitForClickable();
        await alertPO.actionLink.click();

        await browser.waitUntilDisplayed(secondBetCardGroupPO.element, "Second Bet Card Group not visible");
        await browser.waitUntilDisplayed(myBetsHeaderPO.orderTypeFilter, "Order type filters not visible");
        await browser.waitUntilNotDisplayed(alertPO.element, "Alert is still visible");
      });

      it("[PRPI-5559] should display the order type tabs", async () => {
        expect(await tabsPO.element.isDisplayed()).toBe(true);
        expect(await tabsPO.tabs[0].getText()).toBe("Open");
        expect(await tabsPO.tabs[1].getText()).toBe("Settled");
      });

      it("[PRPI-5560] should display the matched status segmented", async () => {
        expect(await segmentedControlPO.element.isDisplayed()).toEqual(true);
        expect(await segmentedControlPO.options[0].getText()).toEqual("Unmatched");
        expect(await segmentedControlPO.options[1].getText()).toEqual("Matched");
      });

      it("[PRPI-5561] should display 2 bet cards groups", async () => {
        expect(await myBetsPO.betCardGroups.length).toBe(2);
      });
    });
  });
});
