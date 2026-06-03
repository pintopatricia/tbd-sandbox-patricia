const { PrimaryButtonPO, CardPO } = require("../../../../page-objects");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const routes = require("../../../../../utils/routes");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const primaryButtonPO = new PrimaryButtonPO();
const cardPO = new CardPO();

const MODULE_NAME = "my_bets_sbk";

const BET_INFO_ID = {
  __typename: "SportsbookBetInfoCard",
  urn: "ppb:tbd:card:sbkBetInfo:1179447017",
};

const SBK_BET_CARD_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.237747664",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:926229536",
      betReceiptId: "O/4275336/0021305",
      profitAndLoss: 0.23,
      isSettled: false,
      betType: "ACC5",
      currentSize: 0.11,
      cashoutQuote: {
        urn: "ppb:sbkCashoutQuote:926229536",
        betUrn: "ppb:sbkBet:926229536",
        quote: 0.11,
        stake: 0.11,
        betDelay: 0,
        cashOutToken: "6Nad6",
        refreshRate: 10,
        status: "AVAILABLE",
      },
      mutations: {
        eligibility: [
          {
            mutation: "AccaFreeze",
            __typename: "BetMutationEligibility",
          },
        ],

        __typename: "BetMutation",
      },
      legs: [
        {
          urn: "ppb:sbkBetLeg:926229536/0",
          type: "SS",
          legNumber: 1,
          parts: [
            {
              price: {
                decimal: 1.86,
                fractional: {
                  numerator: 43,
                  denominator: 50,
                },
              },
              marketBetUrn: "ppb:marketBet:924.237747661",
              eventDescription: "Spezia v Entella1",
              eventMarketDescription: "Match Odds",
              selectionName: "Spezia1",
              startTime: "2020-07-27T19:00:00Z",
            },
          ],

          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Unavailable",
                details: {
                  homeTeamScore: 5,
                  awayTeamScore: 1,
                },
                __typename: "BetLegMutationEligibility",
              },
            ],

            details: [
              {
                freezeDetails: {
                  homeTeamName: "Spezia",
                  awayTeamName: "Entella1",
                  homeTeamScore: 5,
                  awayTeamScore: 1,
                  minute: 69,
                },
              },
            ],

            __typename: "BetLegMutation",
          },
        },
        {
          urn: "ppb:sbkBetLeg:926229536/1",
          type: "SS",
          legNumber: 2,
          parts: [
            {
              price: {
                decimal: 1.86,
                fractional: {
                  numerator: 43,
                  denominator: 50,
                },
              },
              marketBetUrn: "ppb:marketBet:924.237747662",
              eventDescription: "Spezia v Entella2",
              eventMarketDescription: "Match Odds",
              selectionName: "Spezia2",
              startTime: "2020-07-27T19:00:00Z",
            },
          ],

          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Unavailable",
                details: {
                  homeTeamScore: 5,
                  awayTeamScore: 1,
                },
                __typename: "BetLegMutationEligibility",
              },
            ],

            __typename: "BetLegMutation",
          },
        },
        {
          urn: "ppb:sbkBetLeg:926229536/2",
          type: "SS",
          legNumber: 3,
          parts: [
            {
              price: {
                decimal: 1.86,
                fractional: {
                  numerator: 43,
                  denominator: 50,
                },
              },
              marketBetUrn: "ppb:marketBet:924.237747663",
              eventDescription: "Spezia v Entella3",
              eventMarketDescription: "Match Odds",
              selectionName: "Spezia3",
              startTime: "2020-07-27T19:00:00Z",
            },
          ],

          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Suspended",
                details: {
                  homeTeamScore: 5,
                  awayTeamScore: 1,
                },
                __typename: "BetLegMutationEligibility",
              },
            ],

            __typename: "BetLegMutation",
          },
        },
        {
          urn: "ppb:sbkBetLeg:926229536/3",
          type: "SS",
          legNumber: 4,
          parts: [
            {
              price: {
                decimal: 1.86,
                fractional: {
                  numerator: 43,
                  denominator: 50,
                },
              },
              marketBetUrn: "ppb:marketBet:924.237747664",
              eventDescription: "Spezia v Entella4",
              eventMarketDescription: "Match Odds",
              selectionName: "Spezia4",
              startTime: "2020-07-27T19:00:00Z",
            },
          ],

          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Available",
                details: {
                  homeTeamScore: 5,
                  awayTeamScore: 1,
                },
                __typename: "BetLegMutationEligibility",
              },
            ],

            __typename: "BetLegMutation",
          },
        },
        {
          urn: "ppb:sbkBetLeg:926229536/4",
          type: "SS",
          result: "PLACED",
          legNumber: 5,
          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Available",
                details: {
                  homeTeamScore: 5,
                  awayTeamScore: 1,
                },
                __typename: "BetLegMutationEligibility",
              },
            ],

            details: [],
            __typename: "BetLegMutation",
          },
          parts: [
            {
              price: {
                decimal: 1.86,
                fractional: {
                  numerator: 43,
                  denominator: 50,
                },
              },
              marketBetUrn: "ppb:marketBet:924.237747665",
              eventDescription: "Spezia v Entella5",
              eventMarketDescription: "Match Odds",
              selectionName: "Spezia5",
              startTime: "2020-07-27T19:00:00Z",
            },
          ],
        },
      ],
    },
  },
};

const SBK_BET_CARD_PARTIAL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
  },
};

const SBK_BET_CARD_BET_LEG = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:926229536/0",
  ...SBK_BET_CARD_FULL.node.bet.legs[0],
};

const SBK_BET_CARD_BET_LEG2 = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:926229536/0",
  ...SBK_BET_CARD_FULL.node.bet.legs[1],
};

const SBK_BET_CARD_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:926229536",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                    betUrn: "ppb:sbkBet:926229536",
                    leg: SBK_BET_CARD_BET_LEG,
                  },
                },
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/1",
                    betUrn: "ppb:sbkBet:926229536",
                    leg: SBK_BET_CARD_BET_LEG2,
                  },
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                  },
                },
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            ...BET_INFO_ID,
            betReceiptId: "O/4275336/0021305",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
          },
        },
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
          },
        },
        { node: BET_INFO_ID },
      ],
    },
  },
};

const SBK_BET_CARD_EXPANDABLE_PARTIAL = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:926229536",
  },
};

const BETCARD_GROUP_CARDS_SBK_FULL = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1000000001",
    full: {
      edges: [SBK_BET_CARD_FULL, SBK_BET_CARD_EXPANDABLE],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_PARTIAL, SBK_BET_CARD_EXPANDABLE_PARTIAL],
    },
  },
};

const BFF_MY_BETS_MOCK_SBK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [BETCARD_GROUP_CARDS_SBK_FULL],
  headerItems: HEADER_ITEMS_MOCK,
};

describe("My Bets Page - Acca Freeze", () => {
  describe("when the user opens the my bets page and has an sbk card with acca freeze that has been frozen", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MY_BETS_MOCK_SBK.urn, { products: ["sportsbook"] }));
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_SBK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await browser.url(routes.getMyBetsViewUrl("open"));
      await browser.waitUntilDisplayed(primaryButtonPO.element);
      await cardPO.element.click();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1433]_should_see_my_bets_page_with_frozen_acca_freeze`);
    });

    it("[PRPI-1433]_should_see_my_bets_page_with_frozen_acca_freeze", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1433]_should_see_my_bets_page_with_frozen_acca_freeze`),
      ).toBe(0);
    });
  });
});
