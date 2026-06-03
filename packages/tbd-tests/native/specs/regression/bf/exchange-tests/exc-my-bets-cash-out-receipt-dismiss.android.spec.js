const {
  getAppContext,
  getMyBetsLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getQuote, getTakeCashoutResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;

const BetCardGroupSO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.native.so");
const MarketBetCardGroupSO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.native.so");

const { getMyBetsEXCViewMock, getMyBetsEXCCardResults } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { startApp } = require("../../../../helpers/urls");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");

const {
  BottomBarSO,
  MyBetsScreenSO,
  MyBetsHeaderSO,
  PrimaryButtonSO,
  SegmentedControlSO,
  TabsGroupSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();

const betCardGroupSO = new BetCardGroupSO(myBetsSO.betCardGroups[0]);
const marketBetCardGroupSO = new MarketBetCardGroupSO(betCardGroupSO.groupItems[1]);

const myBetsHeaderSO = new MyBetsHeaderSO(myBetsSO.header);
const tabsSO = new TabsGroupSO();
const openTab = new TabsGroupSO(tabsSO.tabButtons[0]);
const settledTab = new TabsGroupSO(tabsSO.tabButtons[1]);
const segmentedControlSO = new SegmentedControlSO(myBetsHeaderSO.orderStatusFilter);

const primaryButtonSO = new PrimaryButtonSO();

const CASHOUT_QUOTE_NEUTRAL_PROFIT_MOCK = [
  {
    marketId: "1.11111111",
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
    value: 1,
    currentLiability: 1,
    profit: "0",
  },
];

const CASHOUT_QUOTE_UNAVAILABLE_MOCK = [
  {
    marketId: "1.11111111",
    status: "UNAVAILABLE",
  },
];

const generateBetCardGroupMock = ({ numBets, isQuoteUnavailable }) => {
  const BETS = [
    {
      __typename: "MarketBetSelectionCard",
      id: "111111111111",
      handicap: 0,
      placedDate: "2023-09-25T16:44:09.000Z",
      settledDate: null,
      matchedDate: "2023-09-25T16:44:09.000Z",
      price: 2.0,
      runnerDesc: "Rio Ave",
      side: "BACK",
      size: 1,
      profit: 1,
      currentLiability: 1,
      selectionId: 44444444,
      isUnmatched: "false",
    },
    {
      __typename: "MarketBetSelectionCard",
      id: "2222222222222",
      handicap: 0,
      placedDate: "2023-09-25T16:44:09.000Z",
      settledDate: null,
      matchedDate: "2023-09-25T16:44:09.000Z",
      price: 2.0,
      runnerDesc: "Rio Ave",
      side: "LAY",
      size: 0.9,
      profit: 1.1,
      currentLiability: 1,
      selectionId: 44444444,
      isUnmatched: "false",
      isCashout: true,
    },
  ];

  return [
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
          edges:
            (numBets && [
              {
                __typename: "MarketBetCard",
                description: "Match Odds",
                numOfOrders: numBets,
                numOfUnmatched: 0,
                liability: isQuoteUnavailable ? 0 : 1,
                cashoutQuotes: isQuoteUnavailable ? CASHOUT_QUOTE_UNAVAILABLE_MOCK : CASHOUT_QUOTE_NEUTRAL_PROFIT_MOCK,
              },
              {
                __typename: "MarketBetExpandableCardGroup",
                isOpen: false,
                edges: [
                  {
                    __typename: "MarketBetSelectionCardGroup",
                    edges: BETS.slice(0, numBets),
                  },
                ],
              },
            ]) ||
            [],
        },
      ],
    },
  ];
};

const MATCHED_FOOTBALL_EVENT_1_BET_MOCK = generateBetCardGroupMock({ numBets: 1 });
const MATCHED_FOOTBALL_EVENT_2_BET_AFTER_CASHOUT_MOCK = generateBetCardGroupMock({
  numBets: 2,
  isQuoteUnavailable: true,
});

const VIEW_MATCHED_FOOTBALL_MOCK = getMyBetsEXCViewMock(MATCHED_FOOTBALL_EVENT_1_BET_MOCK, {
  isOpenMatched: true,
});

// Layout to be returned by the BFF on every refetch performed AFTER the cashout has been taken
// (segment / tab switches re-fetch the matched layout). Returning the UNAVAILABLE quote keeps the
// reducer on the RECEIPT step (no value change → no reset to DISPLAY).
const VIEW_MATCHED_FOOTBALL_AFTER_CASHOUT_MOCK = getMyBetsEXCViewMock(MATCHED_FOOTBALL_EVENT_2_BET_AFTER_CASHOUT_MOCK, {
  isOpenMatched: true,
});

const VIEW_UNMATCHED_MOCK = getMyBetsEXCViewMock([], { isOpenUnmatched: true });

const SETTLED_VIEW_MOCK = getMyBetsEXCViewMock([], {});

const MY_BETS_URL = routes.getMyBetsViewUrl("open", { matchedStatus: "matched" });
const MY_BETS_URN = routes.getMyBetsURN("open", { matchedStatus: "matched" });
const HOME_VIEW_LINK = getStartViewLink(MY_BETS_URL, MY_BETS_URN);

const clickOnElement = async (element) => {
  await browser.waitUntilClickableNative(element, "Element is not clickable");
  await element.click();
};

describe("EXC My Bets - Cash Out Receipt Dismiss", () => {
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
    await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_MOCK));
    await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_NEUTRAL_PROFIT_MOCK));
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, dismissOnboarding: true, pullToRefresh: true });

    await browser.waitUntilEquals(segmentedControlSO.selectedOptionText, "Matched");
    await browser.waitUntilDisplayed(betCardGroupSO.element, "Bet card group wasn't displayed");
    await browser.waitUntilDisplayed(marketBetCardGroupSO.element, "Market bet card wasn't displayed");
    await browser.waitUntilDisplayed(primaryButtonSO.element, "Cash out button wasn't displayed");
    await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out: $1.00");

    const [
      {
        edges: [, MARKET_BET_CARD_GROUP],
      },
    ] = MATCHED_FOOTBALL_EVENT_2_BET_AFTER_CASHOUT_MOCK;

    const BFF_CARDS_UPDATES = getMyBetsEXCCardResults([MARKET_BET_CARD_GROUP], {
      eventId: 1111111111,
      marketId: "1.11111111",
      isOpenMatched: true,
    });

    await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "SUCCESS" }));
    await mockService.mockHttpRequest(getCardResults(BFF_CARDS_UPDATES));

    await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_UNAVAILABLE_MOCK));

    await browser.waitUntilClickableNative(primaryButtonSO.element, "Cash out button wasn't clickable");
    await primaryButtonSO.element.click();

    await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out Successful");
  });

  describe("when the user switches order status segments and back", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_UNMATCHED_MOCK));

      await clickOnElement(segmentedControlSO.options[0]);
      await browser.waitUntilEquals(segmentedControlSO.selectedOptionText, "Unmatched");

      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_AFTER_CASHOUT_MOCK));

      await clickOnElement(segmentedControlSO.options[1]);
      await browser.waitUntilEquals(segmentedControlSO.selectedOptionText, "Matched");
    });

    it("[PRPI-11514] should keep the cashout receipt displayed", async () => {
      await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out Successful");
    });
  });

  describe("when the user switches order type tabs and back", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(SETTLED_VIEW_MOCK));

      await clickOnElement(settledTab.element);
      await browser.waitUntilEquals(settledTab.selectedTab, "Settled");
      await browser.waitUntilNotDisplayed(myBetsHeaderSO.orderStatusFilter, "Order Status filter is still displayed");

      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_AFTER_CASHOUT_MOCK));

      await clickOnElement(openTab.element);
      await browser.waitUntilEquals(openTab.selectedTab, "Open");
      await browser.waitUntilDisplayed(myBetsHeaderSO.orderStatusFilter, "Order Status filter is not displayed");

      await browser.waitUntilDisplayed(primaryButtonSO.element, "Cash out button wasn't displayed");
    });

    it("[PRPI-11515] should keep the cashout receipt displayed", async () => {
      await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out Successful");
    });
  });

  describe("when the user pulls to refresh", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_AFTER_CASHOUT_MOCK));

      await swipeDownElementFullscreen(myBetsSO.element);
      await browser.waitUntilDisplayed(myBetsSO.element, "My Bets Page is not visible after pull to refresh");
    });

    it("[PRPI-12741]should dismiss the cashout receipt", async () => {
      expect(await primaryButtonSO.element.isDisplayed()).toBe(false);
    });
  });

  describe("when the user navigates to another page and back", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_AFTER_CASHOUT_MOCK));

      await clickOnElement(BottomBarSO.home);
      await browser.waitUntilNotDisplayed(myBetsSO.element, "My Bets Page is still visible");

      await clickOnElement(BottomBarSO.myBets);
      await browser.waitUntilDisplayed(myBetsSO.element, "My Bets Page is not visible");
      await browser.waitUntilDisplayed(myBetsHeaderSO.element, "My Bets Header is not visible");
    });

    it("[PRPI-11516] should dismiss the cashout receipt", async () => {
      expect(await primaryButtonSO.element.isDisplayed()).toBe(false);
    });
  });
});
