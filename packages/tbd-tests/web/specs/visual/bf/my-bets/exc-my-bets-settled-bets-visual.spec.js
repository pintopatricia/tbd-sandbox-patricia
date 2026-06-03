const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const MarketBetSelectionCardGroupPO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.web.po");
const MarketBetSelectionCardPO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.web.po");
const { BetSelectionDetailsPO, CardPO } = require("../../../../page-objects");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getIndexHTML } = require("../../mocks/webserver/webserver-controller");
const { getMockFonts } = require("../../mocks/fonts/fonts-controller");

const routes = require("../../../utils/routes");
const MockService = require("../../helpers/mocking-service");
const MarketBetCardGroupPO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.web.po");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const betCardGroupPO = new BetCardGroupPO();
const marketBetCardGroupPO = new MarketBetCardGroupPO(betCardGroupPO.groupItems[1]);
const collapseCardPO = new CardPO(marketBetCardGroupPO.groupItems[1]);
const marketBetSelectionCardGroupPO = new MarketBetSelectionCardGroupPO();
const marketBetSelectionCardPO = new MarketBetSelectionCardPO(marketBetSelectionCardGroupPO.groupItems[0]);
const betDetailPO = new BetSelectionDetailsPO(marketBetSelectionCardPO.element);

const EXC_SETTLED_FOOTBALL_EVENT_MOCK = [
  {
    aggregatorDesc: "Benfica v Porto",
    edges: [
      {
        __typename: "FixtureCard",
        homeName: "Benfica",
        awayName: "Porto",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Match Odds",
            commission: 5,
            profit: 20,
            netProfit: 15,
          },
          {
            __typename: "MarketBetExpandableCardGroup",
            edges: [
              {
                __typename: "MarketBetSelectionCardGroup",
                edges: [
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "322688455269",
                    price: 21,
                    runnerDesc: "Porto",
                    side: "BACK",
                    size: 1,
                    profit: 20,
                    result: "WON",
                    priceMatched: 21,
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

const VIEW_EXC_SETTLED_WON_MOCK = getMyBetsEXCViewMock(EXC_SETTLED_FOOTBALL_EVENT_MOCK, {
  isOpen: false,
  hasFooter: true,
});

const EXC_SETTLED_EVENT_HEADER_MOCK = [
  {
    aggregatorDesc: "USA - Presidential Election 2024",
    edges: [
      {
        __typename: "EventHeaderCard",
        title: "USA - Presidential Election 2024",
        date: "2023-04-15T15:50:00.000Z",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Match Odds",
            commission: "0",
            profit: -1,
            netProfit: -1,
          },
          {
            __typename: "MarketBetExpandableCardGroup",
            edges: [
              {
                __typename: "MarketBetSelectionCardGroup",
                edges: [
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "322688455269",
                    price: 2,
                    runnerDesc: "Porto",
                    side: "LAY",
                    size: 1,
                    profit: -1,
                    result: "LOST",
                    priceMatched: 2,
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

const VIEW_EXC_SETTLED_LOST_MOCK = getMyBetsEXCViewMock(EXC_SETTLED_EVENT_HEADER_MOCK, {
  isOpen: false,
  hasFooter: true,
});

const EXC_SETTLED_RACING_MOCK = [
  // ver mock não aparece direito o race details
  {
    aggregatorDesc: "Aintre",
    edges: [
      {
        __typename: "RaceDetailsCard",
        race: {
          __typename: "Race",
          raceName: "Aintre",
          meeting: {
            meetingName: "Wind 13th Jul",
            venue: "Aintree",
          },
        },
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Match Odds",
            commission: "0",
            profit: 0,
            netProfit: 0,
          },
          {
            __typename: "MarketBetExpandableCardGroup",
            edges: [
              {
                __typename: "MarketBetSelectionCardGroup",
                edges: [
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "322688455269",
                    price: 2,
                    runnerDesc: "Porto",
                    side: "BACK",
                    size: 1,
                    profit: 1,
                    result: "WON",
                    priceMatched: 2,
                    isUnmatched: "false",
                  },
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "322688455270",
                    price: 2,
                    runnerDesc: "Porto",
                    side: "LAY",
                    isCashout: true,
                    size: 1,
                    profit: -1,
                    result: "LOST",
                    priceMatched: 2,
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

const VIEW_EXC_SETTLED_NO_PROFIT_MOCK = getMyBetsEXCViewMock(EXC_SETTLED_RACING_MOCK, {
  isOpen: false,
  hasFooter: true,
});

const MODULE_NAME = "my_bets_exc";

describe("My Bets Page - Settled Bets", () => {
  describe("when the user opens My Bets Settled bets and has won a football market bet", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(VIEW_EXC_SETTLED_WON_MOCK.urn));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_EXC_SETTLED_WON_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await browser.url(routes.getMyBetsViewUrl("settled"));
      await browser.waitUntilDisplayed(betCardGroupPO.element, "Bet Card Group not visible");
      await collapseCardPO.element.waitForClickable();
      await collapseCardPO.element.click();
      await browser.waitUntilDisplayed(betDetailPO.element, "Bet details are not visible");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1425]_should_display_the_net_profit_with_green_colour_and_the_won_status_label_on_bet_selection_details`,
      );
    });

    it("[PRPI-1425]_should_display_the_net_profit_with_green_colour_and_the_won_status_label_on_bet_selection_details", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1425]_should_display_the_net_profit_with_green_colour_and_the_won_status_label_on_bet_selection_details`,
        ),
      ).toBe(0);
    });
  });

  describe("when the user opens My Bets Settled bets and has lost a special market bet", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(VIEW_EXC_SETTLED_LOST_MOCK.urn));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_EXC_SETTLED_LOST_MOCK));
      await browser.url(routes.getMyBetsViewUrl("settled"));
      await browser.waitUntilDisplayed(betCardGroupPO.element, "Bet Card Group not visible");
      await collapseCardPO.element.waitForClickable();
      await collapseCardPO.element.click();
      await browser.waitUntilDisplayed(betDetailPO.element, "Bet details are not visible");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1426]_should_not_display_gross_and_commission_values_and_the_net_profit_should_be_red_and_the_lost_status_label_on_bet_selection_details`,
      );
    });

    it("[PRPI-1426]_should_not_display_gross_and_commission_values_and_the_net_profit_should_be_red_and_the_lost_status_label_on_bet_selection_details", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1426]_should_not_display_gross_and_commission_values_and_the_net_profit_should_be_red_and_the_lost_status_label_on_bet_selection_details`,
        ),
      ).toBe(0);
    });
  });

  describe("when the user opens My Bets Settled bets and has a racing market with net profit equal to `0`", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(VIEW_EXC_SETTLED_NO_PROFIT_MOCK.urn));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_EXC_SETTLED_NO_PROFIT_MOCK));
      await browser.url(routes.getMyBetsViewUrl("settled"));
      await browser.waitUntilDisplayed(betCardGroupPO.element, "Bet Card Group not visible");
      await collapseCardPO.element.waitForClickable();
      await collapseCardPO.element.click();
      await browser.waitUntilDisplayed(betDetailPO.element, "Bet details are not visible");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1427]_should_not_display_gross_and_commission_values_and_the_net_profit_should_be_grey`,
      );
    });

    it("[PRPI-1427]_should_not_display_gross_and_commission_values_and_the_net_profit_should_be_grey", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1427]_should_not_display_gross_and_commission_values_and_the_net_profit_should_be_grey`,
        ),
      ).toBe(0);
    });
  });
});
