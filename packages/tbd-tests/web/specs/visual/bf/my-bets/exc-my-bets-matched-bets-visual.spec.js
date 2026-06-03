const { MyBetsPagePO, BetSelectionDetailsPO, CardPO } = require("../../../../page-objects");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const MarketBetSelectionCardGroupPO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.web.po");
const MarketBetSelectionCardPO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.web.po");
const MarketBetCardGroupPO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.web.po");

const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getIndexHTML } = require("../../mocks/webserver/webserver-controller");
const { getMockFonts } = require("../../mocks/fonts/fonts-controller");

const routes = require("../../../utils/routes");
const MockService = require("../../helpers/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const myBetsPO = new MyBetsPagePO();
const betCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[0]);
const marketBetCardGroupPO = new MarketBetCardGroupPO(betCardGroupPO.groupItems[1]);
const collapseCardPO = new CardPO(marketBetCardGroupPO.groupItems[1]);
const marketBetSelectionCardGroupPO = new MarketBetSelectionCardGroupPO();
const marketBetSelectionCardPO = new MarketBetSelectionCardPO(marketBetSelectionCardGroupPO.groupItems[0]);
const betDetailPO = new BetSelectionDetailsPO(marketBetSelectionCardPO.element);

const EXC_MATCHED_BETS_MOCK = [
  // IN-Play is not working
  {
    __aggregatorDesc: "Sporting Lisbon v Rio Ave",
    edges: [
      {
        __typename: "FixtureCard",
        homeName: "Sporting Lisbon",
        awayName: "Rio Ave",
        scheduledAt: "2023-05-18T18:30:00Z",
        duration: {
          period: "REGULAR",
          status: "INPLAY_SECOND_HALF",
          clock: {
            minute: 47,
            second: 38,
          },
          stoppageMinutes: null,
        },
        score: {
          home: 0,
          away: 0,
        },
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Match Odds",
            numOfOrders: 2,
            numOfUnmatched: 0,
            liability: 0.04,
          },
          {
            __typename: "MarketBetExpandableCardGroup",
            edges: [
              {
                __typename: "MarketBetSelectionCardGroup",
                edges: [
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "2222222222222",
                    price: 1.59,
                    runnerDesc: "Sporting Lisbon",
                    side: "LAY",
                    isCashout: true,
                    size: 0.96,
                    profit: 0.96,
                    priceMatched: 1.59,
                    isUnmatched: "false",
                  },
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "111111111111",
                    price: 1.55,
                    runnerDesc: "Sporting Lisbon",
                    side: "BACK",
                    size: 1,
                    profit: 0.55,
                    priceMatched: 1.55,
                    isUnmatched: "false",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Correct Score",
            numOfOrders: 1,
            numOfUnmatched: 0,
            liability: 1,
          },
          {
            __typename: "MarketBetExpandableCardGroup",
            edges: [
              {
                __typename: "MarketBetSelectionCardGroup",
                edges: [
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "555555555555",
                    price: 5,
                    runnerDesc: "0-1",
                    side: "BACK",
                    size: 1,
                    profit: 4,
                    selectionId: 333333333,
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

const VIEW_EXC_MATCHED_BETS_MOCK = getMyBetsEXCViewMock(EXC_MATCHED_BETS_MOCK, {
  isOpenMatched: true,
  hasFooter: true,
});

const MODULE_NAME = "my_bets_exc";

describe("My Bets Page - EXC Matched Bets", () => {
  describe("when the user opens my bets matched bets and has two market bets for a football in-play event", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(VIEW_EXC_MATCHED_BETS_MOCK.urn));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_EXC_MATCHED_BETS_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await browser.url(routes.getMyBetsViewUrl("open", { matchedStatus: "matched" }));
      await browser.waitUntilDisplayed(betCardGroupPO.element, "Bet Card Group not visible");
      await browser.waitUntilDisplayed(marketBetCardGroupPO.element, "Market Bet card not visible");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1422]_should_display_an_event_with_in_play_scoreboard_and_with_two_market_cards_with_collapsed_accordion`,
      );
    });

    describe("and the accordions are collapsed", () => {
      it("[PRPI-1422]_should_display_an_event_with_in_play_scoreboard_and_with_two_market_cards_with_collapsed_accordion", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1422]_should_display_an_event_with_in_play_scoreboard_and_with_two_market_cards_with_collapsed_accordion`,
          ),
        ).toBe(0);
      });
    });

    describe("and the first market accordion is expanded", () => {
      describe("and the market the first market was cashed out", () => {
        beforeAll(async () => {
          await collapseCardPO.element.waitForClickable();
          await collapseCardPO.element.click();
          await betCardGroupPO.element.scrollIntoView();
          await browser.waitUntilDisplayed(betDetailPO.element, "Bet details are not visible");
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1423]_should_display_the_cashout_info_label_and_all_bet_details_for_the_first_market`,
          );
        });

        it("[PRPI-1423]_should_display_the_cashout_info_label_and_all_bet_details_for_the_first_market", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1423]_should_display_the_cashout_info_label_and_all_bet_details_for_the_first_market`,
            ),
          ).toBe(0);
        });
      });
    });
  });
});
