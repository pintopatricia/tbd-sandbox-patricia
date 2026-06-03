const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { CardPO } = require("../../../../page-objects");
const routes = require("../../../../../utils/routes");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const MODULE_NAME = "my_bets_sbk";

const mockService = new MockService();
const cardPO = new CardPO();

const getMyBetsMock = ({ withACCA, withEachWay }) => {
  const SBK_BET_CARD_RULE4 = {
    node: {
      __typename: "SportsbookBetCard",
      urn: "ppb:tbd:card:sbkBet:1558777956",
      navigationLinks: [],
      bet: {
        urn: "ppb:sbkBet:1558777956",
        __typename: "SportsbookBet",
        betReceiptId: "O/11037374/0002965",
        id: "1558777956",
        isOpen: false,
        isSettled: true,
        profitAndLoss: 0.1,
        originalPotentialWin: null,
        isOddsBoosted: "false",
        betType: "DBL",
        isSGM: false,
        isSGMMulti: false,
        currentSize: 0.1,
        numLines: 1,
        betPrice: {
          decimal: 21.6,
          fractional: {
            numerator: 103,
            denominator: 5,
          },
        },
        legs: [
          {
            __typename: "BetLeg",
            urn: "ppb:sbkBetLeg:1558777956/2",
            type: "SS",
            result: "LOST",
            parts: [
              {
                marketBetUrn: "ppb:marketBet:924.357387136",
                price: {
                  decimal: 2.25,
                  fractional: {
                    numerator: 5,
                    denominator: 4,
                  },
                },
                originalPrice: {
                  decimal: 2.25,
                  fractional: {
                    numerator: 5,
                    denominator: 4,
                  },
                },
                priceType: "LIVE",
                eventDescription: "13:40 NOVICES' HURDLE 2m 3f 49y",
                eventMarketDescription: withEachWay ? "Each Way" : "Win",
                selectionName: "Gitche Gumee",
                startTime: "2023-04-21T12:40:00.000Z",
                handicap: null,
                eachwayPlaces: withEachWay ? 3 : null,
                eachwayFactor: withEachWay ? { numerator: 1, denominator: 5 } : null,
                rule4Deductions: 5,
              },
            ],
          },
        ],

        result: "CASHED_OUT",
        cashoutQuote: null,
        bonus: 0,
        edges: withACCA
          ? [
              {
                reason: "ACCA_INSURANCE",
                status: "VOIDED",
              },
            ]
          : [],
      },
    },
  };

  const SBK_EVENT_HEADER_CARD_RULE4 = {
    node: {
      __typename: "EventHeaderCard",
      urn: "ppb:tbd:card:eventHeader:1558777956/2",
      title: "13:40 NOVICES' HURDLE 2m 3f 49y",
      subtitle: null,
      tertiaryTitle: "FONTWELL",
      sportId: "7",
      date: "2023-04-21T12:40:00.000Z",
    },
  };

  const SBK_BET_LEG_CARD_RULE4 = {
    node: {
      __typename: "BetLegCard",
      urn: "ppb:tbd:card:sbkBetLeg:1558777956/2",
      betUrn: "ppb:sbkBet:1558777956",
      leg: SBK_BET_CARD_RULE4.node.bet.legs[0],
    },
  };

  const SBK_BET_LEG_CARD_GROUP_RULE4 = {
    node: {
      __typename: "SportsbookBetLegCardGroup",
      urn: "ppb:tbd:cardgroup:sbkBetLeg:1558777956/2",
      full: {
        edges: [SBK_BET_LEG_CARD_RULE4, SBK_EVENT_HEADER_CARD_RULE4],
      },
      partials: {
        partialEdges: [SBK_BET_LEG_CARD_RULE4, SBK_EVENT_HEADER_CARD_RULE4],
      },
    },
  };

  const SBK_EXPANDABLE_RULE4 = {
    node: {
      __typename: "SportsbookExpandableLegCardGroup",
      urn: "ppb:tbd:cardgroup:sbkExpandableLeg:1558777956",
      full: {
        edges: [
          SBK_BET_LEG_CARD_GROUP_RULE4,
          {
            node: {
              __typename: "SportsbookBetInfoCard",
              urn: "ppb:tbd:card:sbkBetInfo:1558777956",
              placedDate: "2023-04-21T09:45:41.000Z",
              settledDate: "2023-04-21T09:49:55.000Z",
              betReceiptId: "O/11037374/0002965",
              regulatorBetId: null,
            },
          },
        ],
      },
      partials: {
        partialEdges: [
          SBK_BET_LEG_CARD_GROUP_RULE4,
          {
            node: {
              __typename: "SportsbookBetInfoCard",
              urn: "ppb:tbd:card:sbkBetInfo:1558777956",
            },
          },
        ],
      },
    },
  };

  const BET_CARD_GROUP_RULE4 = {
    node: {
      __typename: "BetCardGroup",
      urn: "ppb:tbd:card:bet:group:1558777956|sbk",
      full: {
        edges: [SBK_BET_CARD_RULE4, SBK_EXPANDABLE_RULE4],
      },
      partials: {
        partialEdges: [SBK_BET_CARD_RULE4, SBK_EXPANDABLE_RULE4],
      },
    },
  };

  return {
    __typename: "MyBetsView",
    urn: "ppb:tbd:view:myBets:open",
    url: "mybets/myBets-open",
    filters: {
      orderType: {
        items: ["OPEN", "SETTLED"],
        defaultIndex: 1,
      },
      productType: {
        items: ["SPORTSBOOK"],
        defaultIndex: 0,
      },
    },
    edges: [BET_CARD_GROUP_RULE4],
    pageInfo: {
      hasNextPage: "true",
      endCursor: "NA==",
    },
    headerItems: HEADER_ITEMS_MOCK,
  };
};

describe("My Bets Page - Rule 4", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  });

  describe("When the bet has both Rule 4 and ACCA Insurance", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML("ppb:tbd:view:myBets:open", { products: ["sportsbook"] }));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getMyBetsLayout(getMyBetsMock({ withACCA: true })));
      await mockService.mockHttpRequest(getScaResponse({}));

      await browser.url(routes.getMyBetsViewUrl("open"));

      await cardPO.header.scrollIntoView({ block: "start" });
      await browser.waitUntilInViewport(cardPO.header);
      await cardPO.header.click();
      await browser.waitUntilDisplayed(cardPO.content);

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1467]_the_bet_card_should_displayed_both_rule4_and_acca`,
      );
    });

    it("[PRPI-1467]_the_bet_card_should_displayed_both_rule4_and_acca", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1467]_the_bet_card_should_displayed_both_rule4_and_acca`),
      ).toBe(0);
    });
  });

  describe("When the bet has both Rule 4 and EACH WAY", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML("ppb:tbd:view:myBets:open", { products: ["sportsbook"] }));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getMyBetsLayout(getMyBetsMock({ withEachWay: true })));
      await mockService.mockHttpRequest(getScaResponse({}));

      await browser.url(routes.getMyBetsViewUrl("open"));

      await cardPO.header.scrollIntoView({ block: "start" });
      await browser.waitUntilInViewport(cardPO.header);
      await cardPO.header.click();
      await browser.waitUntilDisplayed(cardPO.content);

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1468]_the_bet_card_selection_should_displayed_both_rule4_and_each_way`,
      );
    });

    it("[PRPI-1468]_the_bet_card_selection_should_displayed_both_rule4_and_each_way", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1468]_the_bet_card_selection_should_displayed_both_rule4_and_each_way`,
        ),
      ).toBe(0);
    });
  });
});
