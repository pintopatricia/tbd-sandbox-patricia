const { getAppContext } = require("@ppb/tbd-shared/mocks/app-context/app-context.controller");
const { getCardResults, getMyBetsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { startApp } = require("../../../../helpers/urls");
const { BottomBarSO, CardSO, MyBetsScreenSO, SportsbookBetPanelSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const MODULE_NAME = "my_bets_page";
const mockService = new MockService();
const myBetsScreenSO = new MyBetsScreenSO();
const firstSbkBetPanelSO = new SportsbookBetPanelSO(myBetsScreenSO.betCardGroups[0]);

// Open bets mock
const createSbkBetLeg = ({
  betId,
  selectionId,
  selectionName,
  startTime = "2027-06-15T20:00:00.000Z",
  index = 0,
  result,
}) => ({
  __typename: "BetLeg",
  urn: `ppb:sbkBetLeg:${betId}/0`,
  type: "SS",
  legNumber: index,
  result,
  parts: [
    {
      price: {
        decimal: 1.95,
        fractional: {
          numerator: 43,
          denominator: 50,
        },
      },
      marketType: "STANDARD_BET",
      selectionId,
      selectionName,
      startTime,
    },
  ],
});

const createSbkBetLegCard = ({ betId = "1111111111", result = null, selectionId = 35, index = 0 }) => {
  const selectionName = `${selectionId}`;
  return {
    __typename: "BetLegCard",
    urn: `ppb:tbd:card:sbkBetLeg:${betId}/${index}`,
    betUrn: `ppb:sbkBet:${betId}`,
    leg: createSbkBetLeg({ betId, selectionId, selectionName, result, index }),
  };
};

const SBK_BET_CARD_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1",
  },
};

const SBK_BET_CARD_OPEN = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1",
    navigationLinks: [],
    bet: {
      __typename: "SportsbookBet",
      urn: "ppb:sbkBet:1",
      betReceiptId: "O/11037374/1",
      profitAndLoss: 52,
      id: "1",
      isLotteries: true,
      betType: "DBL",
      numLines: 1,
      betPrice: {
        decimal: 5.2,
        fractional: {
          numerator: 520,
          denominator: 100,
        },
      },
      legs: [
        {
          ...createSbkBetLeg({
            betId: 1,
            selectionId: 35,
            selectionName: "35",
          }),
        },
        {
          ...createSbkBetLeg({
            betId: 1,
            selectionId: 36,
            selectionName: "36",
            index: 1,
          }),
        },
      ],
    },
  },
};

const SBK_BET_CARD_SETTLED = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1",
    navigationLinks: [],
    bet: {
      __typename: "SportsbookBet",
      urn: "ppb:sbkBet:1",
      betReceiptId: "O/11037374/1",
      profitAndLoss: 52,
      id: "1",
      isLotteries: true,
      isSettled: true,
      betType: "DBL",
      numLines: 1,
      betPrice: {
        decimal: 5.2,
        fractional: {
          numerator: 520,
          denominator: 100,
        },
      },
      legs: [
        {
          ...createSbkBetLeg({
            betId: 1,
            selectionId: 35,
            selectionName: "35",
            result: "WON",
          }),
        },
        {
          ...createSbkBetLeg({
            betId: 1,
            selectionId: 36,
            selectionName: "36",
            index: 1,
            result: "WON",
          }),
        },
      ],
    },
  },
};

const SBK_BET_CARDS_EXPANDABLE_PARTIAL = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:cardgroup:sbkExpandableLeg:1",
  },
};

const SBK_LOTTERIES_BET_LEG_OPEN = {
  node: {
    __typename: "SportsbookLotteriesBetLegCardGroup",
    urn: "ppb:tbd:cardgroup:sbkLotteriesBetLeg:1",
    full: {
      edges: [
        {
          node: createSbkBetLegCard({ betId: 1, selectionId: 35, index: 0 }),
        },
        {
          node: createSbkBetLegCard({ betId: 1, selectionId: 36, index: 1 }),
        },
        {
          node: {
            __typename: "EventHeaderCard",
            urn: "ppb:tbd:card:eventHeader:1",
            title: "Main",
            tertiaryTitle: "UK49s",
            sportId: "29125756",
            date: "2027-06-15T20:00:00Z",
          },
        },
      ],
    },
  },
};

const SBK_LOTTERIES_BET_LEG_SETTLED = {
  node: {
    __typename: "SportsbookLotteriesBetLegCardGroup",
    urn: "ppb:tbd:cardgroup:sbkLotteriesBetLeg:1",
    full: {
      edges: [
        {
          node: createSbkBetLegCard({ betId: 1, selectionId: 35, index: 0, result: "WON" }),
        },
        {
          node: createSbkBetLegCard({ betId: 1, selectionId: 36, index: 1, result: "WON" }),
        },
        {
          node: {
            __typename: "EventHeaderCard",
            urn: "ppb:tbd:card:eventHeader:1",
            title: "Main",
            tertiaryTitle: "UK49s",
            sportId: "29125756",
            date: "2027-06-15T20:00:00Z",
          },
        },
      ],
    },
  },
};

const SBK_BET_INFO_CARD = {
  node: {
    __typename: "SportsbookBetInfoCard",
    urn: "ppb:tbd:card:sbkBetInfo:1111111111",
    placedDate: "2023-04-21T09:45:41.000Z",
    betReceiptId: "O/11037374/1",
    settledDate: "",
    regulatorBetId: "",
    deviceId: "",
    selections: null,
    product: null,
  },
};

const SBK_BET_CARDS_EXPANDABLE_OPEN = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:cardgroup:sbkExpandableLeg:1",
    full: {
      edges: [SBK_LOTTERIES_BET_LEG_OPEN, SBK_BET_INFO_CARD],
    },
  },
};

const SBK_BET_CARDS_EXPANDABLE_SETTLED = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:cardgroup:sbkExpandableLeg:1",
    full: {
      edges: [SBK_LOTTERIES_BET_LEG_SETTLED, SBK_BET_INFO_CARD],
    },
  },
};

const BET_CARD_GROUP_OPEN = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1|sbk",
    full: {
      edges: [SBK_BET_CARD_OPEN, SBK_BET_CARDS_EXPANDABLE_OPEN],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_PARTIALS, SBK_BET_CARDS_EXPANDABLE_PARTIAL],
    },
  },
};

const BET_CARD_GROUP_SETTLED = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1|sbk",
    full: {
      edges: [SBK_BET_CARD_SETTLED, SBK_BET_CARDS_EXPANDABLE_SETTLED],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_PARTIALS, SBK_BET_CARDS_EXPANDABLE_PARTIAL],
    },
  },
};

const MY_BETS_OPENED_URL = "mybets/opened/mb-736574746c6564";

const BFF_MY_BETS_MOCK_OPEN = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: MY_BETS_OPENED_URL,
  edges: [BET_CARD_GROUP_OPEN],
  headerItems: HEADER_ITEMS_MOCK,
};

const MY_BETS_SETTLED_URL = "mybets/settled/mb-736574746c6564";

const BFF_MY_BETS_MOCK_SETTLED = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 1,
    },
  },
  url: MY_BETS_SETTLED_URL,
  edges: [BET_CARD_GROUP_SETTLED],
  headerItems: HEADER_ITEMS_MOCK,
};

const cardSO = new CardSO();

describe("My Bets Page (Lotteries)", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  });

  describe("When the user has an open bet in Lotteries", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({ products: ["sportsbook"] }));
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_OPEN));
      await mockService.mockHttpRequest(getCardResults({ cards: [SBK_LOTTERIES_BET_LEG_OPEN.node] }));

      await startApp("home");
      await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
      await BottomBarSO.myBets.click();
      await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");
      await browser.waitUntilDisplayed(firstSbkBetPanelSO.element);

      await browser.waitUntilClickableNative(cardSO.element, "Expandable card is not clickable");
      await cardSO.element.click();
      await browser.waitUntilDisplayed(cardSO.contentWrapper, "The card button is not expanded");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4484]_should_be_displayed_the_lotteries_with_open_state`,
      );
    });

    it("[PRPI-4484]_should_be_displayed_the_lotteries_with_open_state", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4484]_should_be_displayed_the_lotteries_with_open_state`))
          .misMatchPercentage,
      ).toBe(0);
    });
  });

  describe("When the user has a settled bet in Lotteries", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({ products: ["sportsbook"] }));
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_SETTLED));
      await mockService.mockHttpRequest(getCardResults({ cards: [SBK_LOTTERIES_BET_LEG_SETTLED.node] }));

      await startApp("home");
      await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
      await BottomBarSO.myBets.click();
      await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");
      await browser.waitUntilDisplayed(firstSbkBetPanelSO.element);

      await browser.waitUntilClickableNative(cardSO.element, "Expandable card is not clickable");
      await cardSO.element.click();
      await browser.waitUntilDisplayed(cardSO.contentWrapper, "The card button is not expanded");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4485]_should_be_displayed_the_lotteries_with_settled_state`,
      );
    });

    it("[PRPI-4485]_should_be_displayed_the_lotteries_with_settled_state", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4485]_should_be_displayed_the_lotteries_with_settled_state`))
          .misMatchPercentage,
      ).toBe(0);
    });
  });
});
