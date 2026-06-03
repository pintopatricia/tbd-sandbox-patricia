const { MyBetsPagePO, BetInfoPO } = require("../../../../page-objects");
const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const BetInfoCollapsePO = require("@ppb/tbd-shared/components/BetInfoCollapse/BetInfoCollapse.web.po");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const betCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[0]);
const betInfoCollapsePO = new BetInfoCollapsePO(betCardGroupPO.element);
const betInfoPO = new BetInfoPO(betInfoCollapsePO.element);

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

describe("My Bets Page - Open Bets - Unmatched - Bet Details", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(UNMATCHED_FOOTBALL_EVENT_MOCK.urn, {
        products: ["exchange"],
        currencyCode: "BRL",
        countryCode: "BR",
        jurisdiction: "BRAZIL",
        exchangeEnabled: true,
        EXC_ALLOWED_JURISDICTION: { isActive: true },
      }),
    );

    await mockService.mockHttpRequest(getMyBetsLayout(UNMATCHED_FOOTBALL_EVENT_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

    await browser.url(routes.getMyBetsViewUrl("open"));

    await browser.waitUntilDisplayed(betCardGroupPO.element, "First Bet Card Group not visible");
  });

  it("[PRPI-11093] should display one bet card group", async () => {
    expect(await myBetsPO.betCardGroups.length).toBe(1);
  });

  it("[PRPI-11094] should display bet details for the unmatched bet", async () => {
    expect(await betInfoCollapsePO.element.isDisplayed()).toBe(true);
  });

  describe("and the user clicks the bet details header", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(betInfoCollapsePO.element, "Bet info collapse not visible");
      await betInfoCollapsePO.header.click();

      await browser.waitUntilDisplayed(betInfoPO.element, "BetInfoCollapse is not expanded");
    });

    it("[PRPI-11095] should display a bet info section with the correct number of items", async () => {
      expect(await betInfoPO.element.isDisplayed()).toBe(true);
      expect(await betInfoPO.infoItems.length).toBe(3);
    });

    it("[PRPI-11096] should display the correct text for each item", async () => {
      expect(await betInfoPO.infoItems[0].getText()).toBe("Betfair ID\n322311028610");
      expect(await betInfoPO.infoItems[1].getText()).toBe("Placed\nSeptember 25, 2023 at 17:44");
      expect(await betInfoPO.infoItems[2].getText()).toBe("Device\nweb-123");
    });
  });
});
