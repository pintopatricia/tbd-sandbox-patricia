const { MyBetsPagePO, CardPO, BetInfoPO } = require("../../../../page-objects");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const MarketBetSelectionCardGroupPO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.web.po");
const MarketBetSelectionCardPO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.web.po");
const MarketBetCardGroupPO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.web.po");
const BetInfoCollapsePO = require("@ppb/tbd-shared/components/BetInfoCollapse/BetInfoCollapse.web.po");

const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();

const betCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[0]);
const marketBetCardGroupPO = new MarketBetCardGroupPO(betCardGroupPO.groupItems[1]);
const cardPO = new CardPO(marketBetCardGroupPO.groupItems[1]);
const marketBetSelectionCardGroupPO = new MarketBetSelectionCardGroupPO(marketBetCardGroupPO.groupItems[1]);
const marketBetSelectionCardPO = new MarketBetSelectionCardPO(marketBetSelectionCardGroupPO.groupItems[0]);
const betInfoCollapsePO = new BetInfoCollapsePO(betCardGroupPO.element);
const betInfoPO = new BetInfoPO(betInfoCollapsePO.element);

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

describe("My Bets Page - Open Bets - Matched - Bet Details", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(VIEW_MATCHED_FOOTBALL_MOCK.urn, {
        products: ["exchange"],
        currencyCode: "BRL",
        countryCode: "BR",
        jurisdiction: "BRAZIL",
        exchangeEnabled: true,
        EXC_ALLOWED_JURISDICTION: { isActive: true },
      }),
    );
    await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

    await browser.url(routes.getMyBetsViewUrl("open", { matchedStatus: "matched" }));

    await browser.waitUntilDisplayed(marketBetCardGroupPO.element, "Market Bet card not visible");
  });

  it("[PRPI-11229] should display one bet card group", async () => {
    expect(await myBetsPO.betCardGroups.length).toBe(1);
  });

  describe("and the user clicks on 'Show Selection Info'", () => {
    beforeAll(async () => {
      await cardPO.header.waitForClickable();
      await cardPO.header.click();

      await browser.waitUntilDisplayed(cardPO.content, "Collapse is not expanded");
      await browser.waitUntilDisplayed(marketBetSelectionCardPO.element, "First selection is not displayed");

      await marketBetSelectionCardPO.element.scrollIntoView();
    });

    describe("and the user clicks the bet details header", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(betInfoCollapsePO.element, "Bet info collapse not visible");
        await betInfoCollapsePO.header.click();

        await browser.waitUntilDisplayed(betInfoPO.element, "BetInfoCollapse is not expanded");
      });

      it("[PRPI-11230] should display a bet info section with the correct number of items", async () => {
        expect(await betInfoPO.element.isDisplayed()).toBe(true);
        expect(await betInfoPO.infoItems.length).toBe(4);
      });

      it("[PRPI-11231] should display the correct text for each item", async () => {
        expect(await betInfoPO.infoItems[0].getText()).toBe("Betfair ID\n322311028610");
        expect(await betInfoPO.infoItems[1].getText()).toBe("Placed\nSeptember 25, 2023 at 17:44");
        expect(await betInfoPO.infoItems[2].getText()).toBe("Matched\nSeptember 25, 2023 at 17:45");
        expect(await betInfoPO.infoItems[3].getText()).toBe("Device\nweb-123");
      });
    });
  });
});
