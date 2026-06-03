const { getAppContext, getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const {
  MyBetsScreenSO,
  BottomBarSO,
  SportsbookBetPanelSO,
  CardSO,
  StatusLabelSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();

const sbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);

const betStatusLabelSO = new StatusLabelSO(sbkBetPanelSO.element);

const cardSO = new CardSO();

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const dateOptions = {
  day: "numeric",
  month: "numeric",
  year: "2-digit",
  timeZone: "Europe/London",
};

const SBK_MULTIPLE_BET_MOCK_OPEN = {
  betType: "TBL",
  isOpen: true,
  profitAndLoss: 0.52,
  currentSize: 0.1,
  betPrice: buildPrice(5.2),
  edges: {
    legCardGroups: [
      {
        footballFixture: {
          homeName: "Newcastle",
          awayName: "Brighton",
          scheduledAt: "2024-07-18T18:30:00.000Z",
        },
        legs: [
          {
            parts: [
              {
                price: buildPrice(1.95),
                originalPrice: buildPrice(1.95),
                eventDescription: "Newcastle v Brighton",
                eventMarketDescription: "Match Odds",
                selectionName: "Newcastle",
              },
            ],
          },
        ],
      },
      {
        footballFixture: {
          homeName: "Sevilla",
          awayName: "Juventus",
          scheduledAt: "2024-06-25T09:45:00.000Z",
        },
        legs: [
          {
            parts: [
              {
                price: buildPrice(2.4),
                originalPrice: buildPrice(2.4),
                eventDescription: "Sevilla v Juventus",
                eventMarketDescription: "Match Odds",
                selectionName: "Sevilla",
              },
            ],
          },
        ],
      },
    ],

    betInfo: {
      betReceiptId: "O/11037374/0002965",
      placedDate: "2023-04-21T09:45:41.000Z",
    },
  },
};

const browseToMyBets = async (MOCK, daysFromNow) => {
  await mockService.mockHttpRequest(
    getAppContext({
      products: ["SPORTSBOOK"],
      throttles: {
        MY_BETS_WIN_LOSE_VOID: {
          isActive: true,
        },
      },
      userdetails: {
        timezone: "Europe/London",
        localeCodeBcp47: "en-US",
      },
    }),
  );

  const lowestEventStartTime = new Date(Date.now());
  lowestEventStartTime.setDate(lowestEventStartTime.getDate() + daysFromNow);
  const expectedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(lowestEventStartTime);

  await mockService.mockHttpRequest(
    getMyBetsLayout(getMyBetsSBKViewMock([{ ...MOCK, lowestEventStartTime: lowestEventStartTime.toISOString() }])),
  );

  await startApp("home", { pullToRefresh: true });

  await browser.waitUntilClickableNative(BottomBarSO.myBets);
  await BottomBarSO.myBets.click();

  await browser.waitUntilDisplayed(cardSO.element);

  return expectedDate;
};

describe("My bets Page (Open Bets) - Status Label - Date Indicator", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  });

  describe("When the user has a bet and the most recent event start date is further than 2 days from now", () => {
    let EXPECTED_DATE;
    beforeAll(async () => {
      const daysFromNow = 5;
      EXPECTED_DATE = await browseToMyBets(SBK_MULTIPLE_BET_MOCK_OPEN, daysFromNow);
      await browser.waitUntilEquals(betStatusLabelSO.text, EXPECTED_DATE);
    });

    it("[PRPI-3663] should display the Status Label with the most recent date", async () => {
      expect(await betStatusLabelSO.element.isDisplayed()).toEqual(true);
      expect(await betStatusLabelSO.text.getText()).toEqual(EXPECTED_DATE);
    });
  });

  describe("When the user has a bet and the most recent event start date is tomorrow", () => {
    beforeAll(async () => {
      const lowestEventStartTime = new Date(Date.now());
      lowestEventStartTime.setDate(lowestEventStartTime.getDate() + 1);

      await mockService.mockHttpRequest(
        getMyBetsLayout(
          getMyBetsSBKViewMock([
            { ...SBK_MULTIPLE_BET_MOCK_OPEN, lowestEventStartTime: lowestEventStartTime.toISOString() },
          ]),
        ),
      );

      await swipeDownElementFullscreen(cardSO.header);
      await browser.waitUntilEquals(betStatusLabelSO.text, "Tomorrow");
    });

    it("[PRPI-3664] should display the Status Label with 'Tomorrow'", async () => {
      expect(await betStatusLabelSO.element.isDisplayed()).toEqual(true);
      expect(await betStatusLabelSO.text.getText()).toEqual("Tomorrow");
    });
  });

  describe("When the user has a bet and the most recent event start date is today", () => {
    beforeAll(async () => {
      const lowestEventStartTime = new Date(Date.now());
      lowestEventStartTime.setMinutes(lowestEventStartTime.getMinutes() + 2);

      await mockService.mockHttpRequest(
        getMyBetsLayout(
          getMyBetsSBKViewMock([
            { ...SBK_MULTIPLE_BET_MOCK_OPEN, lowestEventStartTime: lowestEventStartTime.toISOString() },
          ]),
        ),
      );

      await swipeDownElementFullscreen(cardSO.header);
      await browser.waitUntilEquals(betStatusLabelSO.text, "Today");
    });

    it("[PRPI-3665] should display the Status Label with 'Today'", async () => {
      expect(await betStatusLabelSO.element.isDisplayed()).toEqual(true);
      expect(await betStatusLabelSO.text.getText()).toEqual("Today");
    });
  });

  describe("When the user has a bet and the most recent event start date has already passed", () => {
    beforeAll(async () => {
      const lowestEventStartTime = new Date(Date.now());
      lowestEventStartTime.setDate(lowestEventStartTime.getDate() - 1);

      await mockService.mockHttpRequest(
        getMyBetsLayout(
          getMyBetsSBKViewMock([
            { ...SBK_MULTIPLE_BET_MOCK_OPEN, lowestEventStartTime: lowestEventStartTime.toISOString() },
          ]),
        ),
      );

      await swipeDownElementFullscreen(cardSO.header);
      await browser.waitUntilEquals(betStatusLabelSO.text, "In Progress");
    });

    it("[PRPI-3666] should display the Status Label with 'In Progress'", async () => {
      expect(await betStatusLabelSO.element.isDisplayed()).toEqual(true);
      expect(await betStatusLabelSO.text.getText()).toEqual("In Progress");
    });
  });
});
