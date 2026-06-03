const {
  getAppContext,
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const BetCardGroupSO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.native.so");
const MarketBetSelectionCardGroupSO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.native.so");
const MarketBetSelectionCardSO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.native.so");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { startApp } = require("../../../../helpers/urls");
const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { MyBetsScreenSO, BottomBarSO } = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();

const betCardGroupSO = new BetCardGroupSO(myBetsSO.betCardGroups[0]);
const marketBetSelectionCardGroupSO = new MarketBetSelectionCardGroupSO();
const marketBetSelectionCardSO = new MarketBetSelectionCardSO(marketBetSelectionCardGroupSO.groupItems[0]);

const EXC_UNMATCHED_BSP_BETS_MOCK = [
  {
    __aggregatorDesc: "Sporting Lisbon v Rio Ave",
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
                    id: "111111111111",
                    price: 21,
                    runnerDesc: "Porto",
                    side: "BACK",
                    size: 1,
                    profit: 20,
                    priceMatched: 21,
                    isUnmatched: "true",
                  },
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "2222222222222",
                    bspLiability: 1,
                    isBsp: true,
                    price: 0,
                    runnerDesc: "Porto",
                    side: "BACK",
                    size: 0,
                    profit: 0,
                    priceMatched: 0,
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

const VIEW_EXC_ONE_UNMATCHED_ONE_SP_MOCK = getMyBetsEXCViewMock(EXC_UNMATCHED_BSP_BETS_MOCK, {
  isOpen: true,
  hasFooter: true,
});

const EXC_UNMATCHED_BETS_MOCK = [
  {
    __aggregatorDesc: "Sporting Lisbon v Rio Ave",
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
            numOfUnmatched: 2,
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
                    id: "111111111111",
                    price: 21,
                    runnerDesc: "Porto",
                    side: "BACK",
                    size: 1,
                    profit: 20,
                    priceMatched: 21,
                    isUnmatched: "true",
                  },
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "2222222222222",
                    price: 22,
                    runnerDesc: "Porto",
                    side: "BACK",
                    size: 1,
                    profit: 21,
                    priceMatched: 22,
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

const VIEW_EXC_TWO_UNMATCHED_MOCK = getMyBetsEXCViewMock(EXC_UNMATCHED_BETS_MOCK, {
  isOpen: true,
  hasFooter: true,
});

const clickOnElement = async (element) => {
  await browser.waitUntilClickableNative(element, "Element is not clickable");
  await element.click();
};

const MODULE_NAME = "my_bets_exc";

describe("My Bets Page - Unmatched Bets", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  });

  describe("when the user opens My Bets Unmatched bets and has one BSP bet and one unmatched bet for the same market", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({}));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_EXC_ONE_UNMATCHED_ONE_SP_MOCK));

      const HOME_VIEW_LINK = getStartViewLink(routes.getMyBetsViewUrl("open"));
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));
      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(betCardGroupSO.element, "Bet Card Group not visible");
      await browser.waitUntilDisplayed(marketBetSelectionCardSO.element, "Market selection card not visible");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4842]_should_not_display_the_cancel_all_button_and_the_edit_and_cancel_buttons_for_bsp_bet`,
      );
    });

    it("[PRPI-4842]_should_not_display_the_cancel_all_button_and_the_edit_and_cancel_buttons_for_bsp_bet", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4842]_should_not_display_the_cancel_all_button_and_the_edit_and_cancel_buttons_for_bsp_bet`,
          )
        ).misMatchPercentage,
      ).toBe(0);
    });
  });

  describe("when the user opens the My Bets Unmatched bets and has two unmatched bets for the same market", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({}));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_EXC_TWO_UNMATCHED_MOCK));

      await clickOnElement(BottomBarSO.home);
      await browser.waitUntilNotDisplayed(myBetsSO.element, "My Bets Page is visible");
      await clickOnElement(BottomBarSO.myBets);
      await browser.waitUntilDisplayed(myBetsSO.element, "My Bets Page is not visible");

      await browser.waitUntilDisplayed(betCardGroupSO.element, "Bet Card Group not visible");
      await browser.waitUntilDisplayed(marketBetSelectionCardSO.element, "Market selection card not visible");
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4843]_should_display_the_cancel_all_button`);
    });

    it("[PRPI-4843]_should_display_the_cancel_all_button", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4843]_should_display_the_cancel_all_button`))
          .misMatchPercentage,
      ).toBe(0);
    });
  });
});
