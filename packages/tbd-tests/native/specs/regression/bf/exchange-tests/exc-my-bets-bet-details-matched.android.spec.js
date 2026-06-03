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
const MarketBetSelectionCardGroupSO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.native.so");
const MarketBetSelectionCardSO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.native.so");
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
const marketBetSelectionCardGroupSO = new MarketBetSelectionCardGroupSO(marketBetCardGroupSO.groupItems[1]);
const marketBetSelectionCardSO = new MarketBetSelectionCardSO(marketBetSelectionCardGroupSO.groupItems[0]);
const betInfoCollapseSO = new BetInfoCollapseSO(betCardGroupSO.element);
const betInfoSO = new BetInfoSO(betInfoCollapseSO.element);
const betIdInfoItem = new BetInfoItemSO(betInfoSO.infoItems[0]);
const betIdInfoValue = new CopyToClipboardSO(betInfoSO.infoItems[0]);
const placedInfoItem = new BetInfoItemSO(betInfoSO.infoItems[1]);
const matchedInfoItem = new BetInfoItemSO(betInfoSO.infoItems[2]);
const deviceInfoItem = new BetInfoItemSO(betInfoSO.infoItems[3]);
const deviceInfoValue = new CopyToClipboardSO(betInfoSO.infoItems[3]);

const MATCHED_FOOTBALL_EVENT_BET_MOCK = [
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
            description: "Match Odds",
            numOfOrders: 2,
            numOfUnmatched: 0,
            liability: 1,
          },
          {
            __typename: "MarketBetExpandableCardGroup",
            isOpen: false,
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
                    matchedDate: "2023-09-25T16:45:10.000Z",
                    price: 2.0,
                    runnerDesc: "Rio Ave",
                    side: "BACK",
                    size: 1,
                    profit: 1,
                    selectionId: 44444444,
                    isUnmatched: "false",
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

const VIEW_MATCHED_FOOTBALL_MOCK = getMyBetsEXCViewMock(MATCHED_FOOTBALL_EVENT_BET_MOCK, {
  isOpenMatched: true,
  hasFooter: true,
});

const MY_BETS_URL = routes.getMyBetsViewUrl("open", { matchedStatus: "matched" });
const MY_BETS_URN = routes.getMyBetsURN("open", { matchedStatus: "matched" });
const HOME_VIEW_LINK = getStartViewLink(MY_BETS_URL, MY_BETS_URN);
describe("My Bets Page - Open Bets - Matched - Bet Details", () => {
  describe("When the user opens My Bets and has a Matched bet", () => {
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

      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, dismissOnboarding: true });

      await browser.waitUntilDisplayed(betCardGroupSO.element, "Bet Card Group not visible");

      await browser.waitUntilDisplayed(marketBetCardGroupSO.element, "Market Bet card not visible");
    });

    describe("and the user clicks on 'Show Selection Info'", () => {
      beforeAll(async () => {
        const [
          {
            edges: [, MARKET_BET_CARD_GROUP],
          },
        ] = MATCHED_FOOTBALL_EVENT_BET_MOCK;

        const BFF_CARDS_UPDATES = getMyBetsEXCCardResults([MARKET_BET_CARD_GROUP], {
          eventId: 1111111110,
          marketId: "1.11111111",
          isOpenMatched: true,
        });

        await mockService.mockHttpRequest(getCardResults(BFF_CARDS_UPDATES));

        await browser.waitUntilClickableNative(cardSO.header, "Collapse button is not clickable");

        await cardSO.header.click();

        await browser.waitUntilDisplayed(cardSO.contentWrapper, "Collapse is not expanded");
        await browser.waitUntilDisplayed(marketBetSelectionCardSO.element, "First selection is not displayed");
      });

      describe("and the user clicks the bet details header", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(betInfoCollapseSO.header, "Bet info collapse header is not clickable");

          await betInfoCollapseSO.header.click();

          await browser.waitUntilDisplayed(betInfoSO.element, "BetInfoCollapse is not expanded");
        });

        it("[PRPI-11230] should display a bet info section with the correct number of items", async () => {
          expect(await betInfoSO.element.isDisplayed()).toBe(true);
          expect(await betInfoSO.infoItems.length).toBe(4);
        });

        it("[PRPI-11231] should display the correct text for each item", async () => {
          expect(await betIdInfoItem.label.getText()).toBe("Betfair ID");
          expect(await betIdInfoValue.contentLabel.getText()).toBe("322311028610");

          expect(await placedInfoItem.label.getText()).toBe("Placed");
          expect(await placedInfoItem.contentText.getText()).toBe("September 25, 2023, 17:44");

          expect(await matchedInfoItem.label.getText()).toBe("Matched");
          expect(await matchedInfoItem.contentText.getText()).toBe("September 25, 2023, 17:45");

          expect(await deviceInfoItem.label.getText()).toBe("Device");
          expect(await deviceInfoValue.contentLabel.getText()).toBe("web-123");
        });
      });
    });
  });
});
