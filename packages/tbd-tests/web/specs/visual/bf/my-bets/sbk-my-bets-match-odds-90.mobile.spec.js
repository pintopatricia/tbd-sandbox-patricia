const { CardPO, TabsGroupPO } = require("../../../../page-objects");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const MODULE_NAME = "my_bets_sbk";
const mockService = new MockService();
const tabsGroupPO = new TabsGroupPO();
const firstSbkBetCardPO = new CardPO();

const SBK_BET_INFO_CARD_PARTIAL = {
  __typename: "SportsbookBetInfoCard",
  urn: "ppb:tbd:card:sbkBetInfo:1179447017",
};

// OPEN BETS - Single
const SBK_BET_LEG_DATA = {
  type: "SS",
  result: "PLACED",
  parts: [
    {
      price: { decimal: 1001, fractional: {} },
      marketBetUrn: "ppb:marketBet:924.1",
      eventDescription: "Alberto v Silva",
      eventMarketDescription: "Match Odds 90",
      marketType: "MATCH_ODDS_90",
      selectionName: "Alberto",
      startTime: "2029-07-27T19:00:00.000Z",
    },
  ],
};

const SBK_BET_LEG = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:90/0",
  ...SBK_BET_LEG_DATA,
};

const SBK_BET = {
  urn: "ppb:sbkBet:90",
  betReceiptId: "O/90/90",
  profitAndLoss: 0.22,
  isSettled: false,
  betType: "SGL",
  currentSize: 0.12,
  result: null,
  legs: [SBK_BET_LEG_DATA],
};

const SBK_BET_CARD_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:90",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.90",
      },
    ],

    bet: SBK_BET,
  },
};

const SBK_BET_CARDS_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:90",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:90/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:90/0",
                    betUrn: "ppb:sbkBet:90",
                    leg: SBK_BET_LEG,
                  },
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:90/0",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            ...SBK_BET_INFO_CARD_PARTIAL,
            betReceiptId: "O/90/90",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:90/0",
          },
        },
        { node: SBK_BET_INFO_CARD_PARTIAL },
      ],
    },
  },
};

const SBK_BET_CARDS_EXPANDABLE_PARTIAL = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:90",
  },
};

const SBK_BET_CARD_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:90",
  },
};

const BETCARD_GROUP_CARDS_SBK_BET = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:90|sbk",
    full: {
      edges: [SBK_BET_CARD_FULL, SBK_BET_CARDS_EXPANDABLE],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_PARTIALS, SBK_BET_CARDS_EXPANDABLE_PARTIAL],
    },
  },
};

const BFF_MY_BETS_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [BETCARD_GROUP_CARDS_SBK_BET],
  headerItems: HEADER_ITEMS_MOCK,
};

// SETTLED BETS - Multiple
const SBK_BET_CARDS_MULTIPLE_LEGS = [
  {
    __typename: "BetLeg",
    urn: "ppb:sbkBetLeg:90/0",
    type: "DBL",
    result: "WON",
    parts: [
      {
        price: {
          decimal: 999,
          fractional: {},
        },
        marketBetUrn: "ppb:marketBet:924.90",
        eventDescription: "Alberto v Silva",
        eventMarketDescription: "Match Odds 90",
        marketType: "MATCH_ODDS_90",
        selectionName: "Alberto",
        startTime: "2020-07-27T19:00:00Z",
      },
    ],
  },
  {
    __typename: "BetLeg",
    urn: "ppb:sbkBetLeg:90/1",
    type: "SS",
    result: "WON",
    parts: [
      {
        price: {
          decimal: 1.1,
          fractional: {},
        },
        priceType: "GUARANTEED",
        marketBetUrn: "ppb:marketBet:924.91",
        eventDescription: "Alberto v Silva",
        eventMarketDescription: "Alberto injured during warmup",
        marketType: "TO_BE_INJURED",
        selectionName: "Yes",
        startTime: "2020-07-27T19:00:00Z",
      },
    ],
  },
];

const SBK_BET_CARDS_MULTIPLE_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:90",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.90",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:90",
      betReceiptId: "O/90/90",
      profitAndLoss: 500,
      id: "90",
      isSettled: false,
      betType: "TBL",
      currentSize: 1,
      result: "WON",
      has90MinBet: true,
      betPrice: {
        decimal: 1001,
        fractional: {},
      },
      legs: SBK_BET_CARDS_MULTIPLE_LEGS,
    },
  },
};

const SBK_BET_CARDS_MULTIPLE_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:90",
  },
};

const SBK_BET_CARDS_MULTIPLE_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:90",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:90/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:90/0",
                    betUrn: "ppb:sbkBet:90",
                    leg: SBK_BET_CARDS_MULTIPLE_LEGS[0],
                  },
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:90/0",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:90/1",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:90/1",
                    betUrn: "ppb:sbkBet:90",
                    leg: SBK_BET_CARDS_MULTIPLE_LEGS[1],
                  },
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:90/1",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            ...SBK_BET_INFO_CARD_PARTIAL,
            betReceiptId: "O/90/90",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:90/0",
          },
        },
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:90/1",
          },
        },
        { node: SBK_BET_INFO_CARD_PARTIAL },
      ],
    },
  },
};

const SBK_BET_CARDS_EXPANDABLE_MULTIPLE_PARTIALS = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:90",
  },
};

const BETCARD_GROUP_CARDS_MULTIPLE = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1145047264",
    full: { edges: [SBK_BET_CARDS_MULTIPLE_FULL, SBK_BET_CARDS_MULTIPLE_EXPANDABLE] },
    partials: { partialEdges: [SBK_BET_CARDS_MULTIPLE_PARTIALS, SBK_BET_CARDS_EXPANDABLE_MULTIPLE_PARTIALS] },
  },
};

const BFF_MY_BETS_MOCK_MULTIPLE = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:settled",
  url: routes.getMyBetsViewUrl("settled"),
  edges: [BETCARD_GROUP_CARDS_MULTIPLE],
  headerItems: HEADER_ITEMS_MOCK,
};

describe("My Bets Page - SBK Bets - 90 Minute Payout", () => {
  describe("when the user opens the my bets page in the open tab", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MY_BETS_MOCK.urn, { products: ["sportsbook"] }));
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await browser.url(routes.getMyBetsViewUrl("open"));
    });

    describe("and expands the accordion", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(firstSbkBetCardPO.header);
        await firstSbkBetCardPO.header.click();
        await browser.waitUntilDisplayed(firstSbkBetCardPO.content);
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1458]_should_see_the_bet_with_the_90_min_payout_icon`);
      });

      it("[PRPI-1458]_should_see_the_bet_with_the_90_min_payout_icon", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1458]_should_see_the_bet_with_the_90_min_payout_icon`),
        ).toBe(0);
      });

      xdescribe("and clicks on the settled tab", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_MULTIPLE));
          await tabsGroupPO.tabs[1].click();
        });

        describe("and expands the accordion", () => {
          beforeAll(async () => {
            await browser.waitUntilInViewport(firstSbkBetCardPO.header);
            await firstSbkBetCardPO.header.click();
            await browser.waitUntilDisplayed(firstSbkBetCardPO.content);
            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-1459]_should_see_the_multiple_bet_with_the_90_min_payout_icon_and_label`,
            );
          });

          it("[PRPI-1459]_should_see_the_multiple_bet_with_the_90_min_payout_icon_and_label", async () => {
            expect(
              await browser.checkScreen(
                `${MODULE_NAME}_[PRPI-1459]_should_see_the_multiple_bet_with_the_90_min_payout_icon_and_label`,
              ),
            ).toBe(0);
          });
        });
      });
    });
  });
});
