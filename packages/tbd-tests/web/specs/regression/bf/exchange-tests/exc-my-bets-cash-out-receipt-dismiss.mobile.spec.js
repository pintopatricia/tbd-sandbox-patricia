const {
  BottomBarPO,
  MyBetsPagePO,
  MyBetsHeaderPO,
  PrimaryButtonPO,
  SegmentedControlPO,
  TabsGroupPO,
} = require("../../../../page-objects");

const { getMyBetsLayout, getCardResults, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getQuote, getTakeCashoutResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;

const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const MarketBetCardGroupPO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.web.po");

const { getMyBetsEXCViewMock, getMyBetsEXCCardResults } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const routes = require("../../../../../utils/routes");
const { waitForClickable } = require("../../../../helpers/cashout.util");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();

const betCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[0]);
const marketBetCardGroupPO = new MarketBetCardGroupPO(betCardGroupPO.groupItems[1]);

const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPO.header);
const tabsPO = new TabsGroupPO(myBetsHeaderPO.orderTypeFilter);
const segmentedControlPO = new SegmentedControlPO(myBetsHeaderPO.orderStatusFilter);
const bottomBarPO = new BottomBarPO();

const primaryButtonPO = new PrimaryButtonPO();

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

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [],
};

const clickOnElement = async (element) => {
  await element.waitForClickable();
  await element.click();
};

describe("EXC My Bets - Cash Out Receipt Dismiss", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(VIEW_MATCHED_FOOTBALL_MOCK.urn));
    await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_MOCK));
    await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_NEUTRAL_PROFIT_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK, { withBottomBar: false }));

    await browser.url(routes.getMyBetsViewUrl("open", { matchedStatus: "matched" }));

    await browser.waitUntilEquals(segmentedControlPO.selectedOption, "Matched");
    await browser.waitUntilDisplayed(betCardGroupPO.element, "Bet card group wasn't displayed");
    await browser.waitUntilDisplayed(marketBetCardGroupPO.element, "Market bet card wasn't displayed");
    await browser.waitUntilDisplayed(primaryButtonPO.element, "Cash out button wasn't displayed");
    await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out: $1.00");

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

    await waitForClickable(primaryButtonPO.element);
    await primaryButtonPO.element.click();

    await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_UNAVAILABLE_MOCK));
    await browser.tickFakeClock();

    await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out Successful");
    expect(await primaryButtonPO.element.isEnabled()).toBe(false);
  });

  describe("when the user switches order status segments and back", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_UNMATCHED_MOCK));

      await clickOnElement(segmentedControlPO.options[0]);
      await browser.waitUntilEquals(segmentedControlPO.selectedOption, "Unmatched");

      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_AFTER_CASHOUT_MOCK));

      await clickOnElement(segmentedControlPO.options[1]);
      await browser.waitUntilEquals(segmentedControlPO.selectedOption, "Matched");
    });

    it("[PRPI-11514] should keep the cashout receipt displayed", async () => {
      await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out Successful");
      expect(await primaryButtonPO.element.isEnabled()).toBe(false);
    });
  });

  describe("when the user switches order type tabs and back", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(SETTLED_VIEW_MOCK));

      await clickOnElement(tabsPO.tabs[1]);
      await browser.waitUntilEquals(tabsPO.selectedTab, "Settled");
      await browser.waitUntilNotDisplayed(myBetsHeaderPO.orderStatusFilter, "Order Status filter is still displayed");

      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_AFTER_CASHOUT_MOCK));

      await clickOnElement(tabsPO.tabs[0]);
      await browser.waitUntilEquals(tabsPO.selectedTab, "Open");
      await browser.waitUntilDisplayed(myBetsHeaderPO.orderStatusFilter, "Order Status filter is not displayed");

      await browser.waitUntilDisplayed(primaryButtonPO.element, "Cash out button wasn't displayed");
    });

    it("[PRPI-11515] should keep the cashout receipt displayed", async () => {
      await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out Successful");
      expect(await primaryButtonPO.element.isEnabled()).toBe(false);
    });
  });

  describe("when the user navigates to another page and back", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_AFTER_CASHOUT_MOCK));

      await clickOnElement(bottomBarPO.tiles[0]);
      await browser.waitUntilNotDisplayed(myBetsPO.element, "My Bets Page is still visible");

      await clickOnElement(bottomBarPO.tiles[2]);
      await browser.waitUntilDisplayed(myBetsPO.element, "My Bets Page is not visible");
      await browser.waitUntilDisplayed(myBetsHeaderPO.element, "My Bets Header is not visible");
    });

    it("[PRPI-11516] should dismiss the cashout receipt", async () => {
      expect(await primaryButtonPO.element.isDisplayed()).toBe(false);
    });
  });
});
