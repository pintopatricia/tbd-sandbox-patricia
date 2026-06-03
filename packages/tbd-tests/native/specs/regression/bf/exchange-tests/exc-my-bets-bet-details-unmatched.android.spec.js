const { MyBetsScreenSO, CardSO, BetInfoSO, BetInfoItemSO, CopyToClipboardSO } = require("../../../../screen-objects");

const {
  getAppContext,
  getMyBetsLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const BetCardGroupSO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.native.so");
const MarketBetCardGroupSO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.native.so");
const BetInfoCollapseSO = require("@ppb/tbd-shared/components/BetInfoCollapse/BetInfoCollapse.native.so");

const { getMyBetsEXCViewMock, getMyBetsEXCCardResults } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();

const betCardGroupSO = new BetCardGroupSO(myBetsSO.betCardGroups[0]);
const marketBetCardGroupSO = new MarketBetCardGroupSO(betCardGroupSO.groupItems[1]);
const cardSO = new CardSO(marketBetCardGroupSO.groupItems[1]);
const betInfoCollapseSO = new BetInfoCollapseSO(betCardGroupSO.element);
const betInfoSO = new BetInfoSO(betInfoCollapseSO.element);
const betIdInfoItem = new BetInfoItemSO(betInfoSO.infoItems[0]);
const betIdInfoValue = new CopyToClipboardSO(betInfoSO.infoItems[0]);
const placedInfoItem = new BetInfoItemSO(betInfoSO.infoItems[1]);
const deviceInfoItem = new BetInfoItemSO(betInfoSO.infoItems[2]);
const deviceInfoValue = new CopyToClipboardSO(betInfoSO.infoItems[2]);

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
                    deviceId: "web-123",
                    price: 9,
                    runnerDesc: "Home or Draw",
                    side: "BACK",
                    size: 1,
                    profit: 8,
                    selectionId: 6384646,
                    isUnmatched: "true",
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

const UNMATCHED_FOOTBALL_EVENT_MOCK = getMyBetsEXCViewMock(ONE_EVENT_AGG_MOCK, {
  isOpen: true,
  isOpenBetsFiltered: false,
});

const MY_BETS_URL = routes.getMyBetsViewUrl("open");
const MY_BETS_URN = routes.getMyBetsURN("open");
const HOME_VIEW_LINK = getStartViewLink(MY_BETS_URL, MY_BETS_URN);

describe("My Bets Page - Open Bets - Unmatched - Bet Details", () => {
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
        jurisdiction: "BRAZIL",
        countryCode: "BR",
        currencyCode: "BRL",
        loggedIn: true,
      }),
    );

    await mockService.mockHttpRequest(getMyBetsLayout(UNMATCHED_FOOTBALL_EVENT_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, dismissOnboarding: true });

    await browser.waitUntilDisplayed(betCardGroupSO.element, "Bet Card Group not visible");

    await browser.waitUntilDisplayed(marketBetCardGroupSO.element, "Market Bet card not visible");
  });

  it("[PRPI-11093] should display one bet card group", async () => {
    expect(await myBetsSO.betCardGroups.length).toBe(1);
  });

  describe("and the user clicks on 'Show Selection Info'", () => {
    beforeAll(async () => {
      const [
        {
          edges: [, MARKET_BET_CARD_GROUP],
        },
      ] = ONE_EVENT_AGG_MOCK;

      const BFF_CARDS_UPDATES = getMyBetsEXCCardResults([MARKET_BET_CARD_GROUP], {
        eventId: 1111111110,
        marketId: "1.11111111",
        isOpen: true,
        isOpenBetsFiltered: false,
      });

      await mockService.mockHttpRequest(getCardResults(BFF_CARDS_UPDATES));

      await browser.waitUntilClickableNative(cardSO.header, "Collapse button is not clickable");
    });

    it("[PRPI-11094] should display bet details for the unmatched bet", async () => {
      expect(await betInfoCollapseSO.element.isDisplayed()).toBe(true);
    });

    describe("and the user clicks the bet details header", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(betInfoCollapseSO.header, "Bet info collapse header is not clickable");

        await betInfoCollapseSO.header.click();

        await browser.waitUntilDisplayed(betInfoSO.element, "BetInfoCollapse is not expanded");
      });

      it("[PRPI-11095] should display a bet info section with the correct number of items", async () => {
        expect(await betInfoSO.element.isDisplayed()).toBe(true);
        expect(await betInfoSO.infoItems.length).toBe(3);
      });

      it("[PRPI-11096] should display the correct text for each item", async () => {
        expect(await betIdInfoItem.label.getText()).toBe("Betfair ID");
        expect(await betIdInfoValue.contentLabel.getText()).toBe("322311028610");

        expect(await placedInfoItem.label.getText()).toBe("Placed");
        expect(await placedInfoItem.contentText.getText()).toBe("September 25, 2023, 17:44");

        expect(await deviceInfoItem.label.getText()).toBe("Device");
        expect(await deviceInfoValue.contentLabel.getText()).toBe("web-123");
      });
    });
  });
});
