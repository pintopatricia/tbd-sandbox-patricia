const { CardPO } = require("../../../../page-objects");
const { getCardResults, getMyBetsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const MODULE_NAME = "my_bets_sbk";
const mockService = new MockService();

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

const BFF_MY_BETS_MOCK_OPEN = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [BET_CARD_GROUP_OPEN],
  headerItems: HEADER_ITEMS_MOCK,
};

const BFF_MY_BETS_MOCK_SETTLED = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:settled",
  url: routes.getMyBetsViewUrl("settled"),
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 1,
    },
  },
  edges: [BET_CARD_GROUP_SETTLED],
  headerItems: HEADER_ITEMS_MOCK,
};

const cardPO = new CardPO();

describe("My Bets Page (Lotteries)", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  });

  describe("When the user has an open bet in Lotteries", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MY_BETS_MOCK_OPEN.urn, { products: ["sportsbook"] }));
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_OPEN));
      await mockService.mockHttpRequest(getCardResults({ cards: [SBK_LOTTERIES_BET_LEG_OPEN.node] }));
      await browser.url(routes.getMyBetsViewUrl("open"));

      await browser.waitUntilInViewport(cardPO.title);
      await cardPO.title.click();
      await browser.waitUntilDisplayed(cardPO.content);

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1456]_should_be_displayed_the_lotteries_with_open_state`,
      );
    });

    it("[PRPI-1456]_should_be_displayed_the_lotteries_with_open_state", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1456]_should_be_displayed_the_lotteries_with_open_state`),
      ).toBe(0);
    });
  });

  describe("When the user has a settled bet in Lotteries", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MY_BETS_MOCK_SETTLED.urn, { products: ["sportsbook"] }));
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_SETTLED));
      await mockService.mockHttpRequest(getCardResults({ cards: [SBK_LOTTERIES_BET_LEG_SETTLED.node] }));
      await browser.url(routes.getMyBetsViewUrl("settled"));

      await browser.waitUntilInViewport(cardPO.title);
      await cardPO.title.click();
      await browser.waitUntilDisplayed(cardPO.content);

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1457]_should_be_displayed_the_lotteries_with_settled_state`,
      );
    });

    it("[PRPI-1457]_should_be_displayed_the_lotteries_with_settled_state", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1457]_should_be_displayed_the_lotteries_with_settled_state`),
      ).toBe(0);
    });
  });
});
