const BetCardGroupSO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.native.so");

const {
  getAppContext,
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");

const {
  MyBetsScreenSO,
  SegmentedControlSO,
  MyBetsHeaderSO,
  TabsGroupSO,
  AlertSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
let tabsSO = new TabsGroupSO();
const myBetsHeaderSO = new MyBetsHeaderSO();
const alertSO = new AlertSO();
const firstBetCardGroupSO = new BetCardGroupSO(myBetsSO.betCardGroups[0]);
const secondBetCardGroupSO = new BetCardGroupSO(myBetsSO.betCardGroups[1]);
let segmentedControlSO = new SegmentedControlSO();

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

const MY_BETS_URL = routes.getMyBetsViewUrl("open");

describe("My Bets Page - Open Bets", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getAppContext({
        selectedDefaultProduct: "EXCHANGE",
        selectedExchangeDefaultProduct: "NEME",
        products: ["EXCHANGE"],
        phoenixMigratedUser: true,
        throttles: {
          EXC_ALLOWED_JURISDICTION: { isActive: true },
        },
      }),
    );
    await mockService.mockHttpRequest(getMyBetsLayout(UNMATCHED_FILTERED_FOOTBALL_EVENT_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

    const HOME_VIEW_LINK = getStartViewLink(MY_BETS_URL);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, dismissOnboarding: true });
    await browser.waitUntilDisplayed(firstBetCardGroupSO.element, "First Bet Card Group not visible");
  });

  describe("when the user opens the my bets page with marketIds filters (Open Bets)", () => {
    it("[PRPI-4814] should display the filtered view alert", async () => {
      await browser.waitUntilDisplayed(alertSO.element, "Filtered view alert not visible");
    });

    it("[PRPI-4815] the filtered view alert should display the info icon and label", async () => {
      expect(await alertSO.icon.isDisplayed()).toBe(true);
      expect(await alertSO.message.getText()).toBe("This is a filtered view");
    });

    it("[PRPI-4816] the filtered view should display the 'Show All My Bets' button", async () => {
      expect(await alertSO.actionLinkText.getText()).toBe("Show All My Bets");
    });

    it("[PRPI-1849] should not display the order type tabs", async () => {
      expect(await tabsSO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-1850] should display the matched status segmented control", async () => {
      expect(await segmentedControlSO.element.isDisplayed()).toEqual(true);
      expect(await segmentedControlSO.selectedOptionText.getText()).toEqual("Unmatched");
      expect(await segmentedControlSO.optionText.getText()).toEqual("Matched");
    });

    it("[PRPI-1851] should show 1 bet card group", async () => {
      expect(await myBetsSO.betCardGroups.length).toBe(1);
    });

    describe("when the user clicks on the show all my bets button", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMyBetsLayout(UNMATCHED_UNFILTERED_FOOTBALL_EVENT_MOCK));

        await browser.waitUntilClickableNative(alertSO.action, "Show All My Bets button is not clickable");
        await alertSO.action.click();

        await browser.waitUntilDisplayed(secondBetCardGroupSO.element, "Second Bet Card Group not visible");
        await browser.waitUntilDisplayed(myBetsHeaderSO.orderTypeFilter, "Order type filters not visible");
        await browser.waitUntilNotDisplayed(alertSO.element, "Alert is still visible");
      });

      it("[PRPI-1853] should display the order type tabs", async () => {
        tabsSO = new TabsGroupSO();

        expect(await tabsSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-1854] should display the matched status segmented", async () => {
        segmentedControlSO = new SegmentedControlSO(myBetsHeaderSO.orderStatusFilter);

        expect(await segmentedControlSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-1855] should display 2 bet cards groups", async () => {
        expect(await myBetsSO.betCardGroups.length).toBe(2);
      });
    });
  });
});
