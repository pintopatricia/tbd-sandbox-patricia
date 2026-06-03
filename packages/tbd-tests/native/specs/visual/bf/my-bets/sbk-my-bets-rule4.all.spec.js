const {
  getAppContext,
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { CardSO, EventHeaderSO, MyBetsScreenSO, BottomBarSO, MyBetsHeaderSO } = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const CARD_NAME = "my_bets_page";

const mockService = new MockService();
const myBetsScreenSO = new MyBetsScreenSO();
const cardSO = new CardSO();
const eventHeaderSO = new EventHeaderSO();
const myBetsHeaderSO = new MyBetsHeaderSO();

const BFF_MY_BETS_SBK_RULE4_WITH_ACCA_MOCK = [
  {
    isACCA: true,
    isOpen: false,
    isSettled: true,
    result: "CASHED_OUT",
    profitAndLoss: 0.1,
    edges: {
      legCardGroups: [
        {
          legs: [
            {
              result: "LOST",
              parts: [
                {
                  rule4Deductions: 5,
                },
              ],
            },
          ],

          eventHeader: {},
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
        settledDate: "2023-04-21T09:49:55.000Z",
      },
    },
  },
];

const BFF_MY_BETS_SBK_RULE4_WITH_EACH_WAY_MOCK = [
  {
    isOpen: false,
    isSettled: true,
    result: "CASHED_OUT",
    profitAndLoss: 0.1,
    edges: {
      legCardGroups: [
        {
          legs: [
            {
              result: "LOST",
              parts: [
                {
                  rule4Deductions: 5,
                  eachwayPlaces: 3,
                },
              ],
            },
          ],

          eventHeader: {},
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
        settledDate: "2023-04-21T09:49:55.000Z",
      },
    },
  },
];

const goToHomeAndBackToMyBets = async () => {
  await browser.waitUntilClickableNative(BottomBarSO.home, "Element is not clickable");
  await BottomBarSO.home.click();
  await browser.waitUntilNotDisplayed(myBetsScreenSO.element, "My Bets Page is visible");
  await browser.waitUntilClickableNative(BottomBarSO.myBets, "Element is not clickable");
  await BottomBarSO.myBets.click();
  await browser.waitUntilDisplayed(myBetsScreenSO.element, "My Bets Page is not visible");
  await browser.waitUntilDisplayed(myBetsHeaderSO.element, "My Bets Header is not visible");
};

const MY_BETS_SETTLED_URL = "mybets/settled/mb-736574746c6564";

describe("My Bets Page - Rule 4", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"] }));
  });

  describe("When the bet has both Rule 4 and ACCA Insurance", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(getMyBetsSBKViewMock(BFF_MY_BETS_SBK_RULE4_WITH_ACCA_MOCK)));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

      const HOME_VIEW_LINK = getStartViewLink(MY_BETS_SETTLED_URL);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");

      await browser.waitUntilClickableNative(cardSO.element);
      await cardSO.element.click();
      await browser.waitUntilDisplayed(cardSO.contentWrapper);

      await browser.waitUntilDisplayed(eventHeaderSO.element, "Event Header is not displayed");

      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4495]_the_bet_card_should_displayed_both_rule4_and_acca`);
    });

    it("[PRPI-4495]_the_bet_card_should_displayed_both_rule4_and_acca", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4495]_the_bet_card_should_displayed_both_rule4_and_acca`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });

  describe("When the bet has both Rule 4 and EACH WAY", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getMyBetsLayout(getMyBetsSBKViewMock(BFF_MY_BETS_SBK_RULE4_WITH_EACH_WAY_MOCK)),
      );
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

      await goToHomeAndBackToMyBets();

      await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");

      await browser.waitUntilClickableNative(cardSO.element);
      await cardSO.element.click();
      await browser.waitUntilDisplayed(cardSO.contentWrapper);

      await browser.waitUntilDisplayed(eventHeaderSO.element, "Event Header is not displayed");

      await browser.waitUntilImageEquals(
        `${CARD_NAME}_[PRPI-4496]_the_bet_card_selection_should_displayed_both_rule4_and_each_way`,
      );
    });

    it("[PRPI-4496]_the_bet_card_selection_should_displayed_both_rule4_and_each_way", async () => {
      expect(
        (
          await browser.compareScreen(
            `${CARD_NAME}_[PRPI-4496]_the_bet_card_selection_should_displayed_both_rule4_and_each_way`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });
  });
});
