const { SportPagePO, PromotionCardPO, ScrollableSwimlanePO } = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const SPORT_ID = 1;

const sportPagePO = new SportPagePO();
const promotionsSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const promotionSecondCard = new PromotionCardPO(promotionsSwimlanePO.scrollItems[1]);

const PROMO_CARD_PROPS = {
  __typename: "PromotionCard",
  promotionName: "BET €20 ON MULTIPLES",
  promotionTitle: "kekw",
  hasBetfairBoost: true,
  backgroundImage: [
    {
      url: "http://example.test.com/mockedImage/image.png",
      width: 456,
      height: 123,
    },
  ],

  termsAndConditions: {
    url: "https://promos.betfair.com/promotion?promoCode=sbkb20g5280720p",
    summary: "Some Serious Terms And Conditions",
    label: { translationKey: "I18N.BETSLIP.ACCA_INSURANCE_TERMS_LABEL" },
  },
};

const BFF_SPORT_PAGE_MOCK_1_CARD = {
  urn: `ppb:tbd:view:sport:${SPORT_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:personalisedPromotions:435d2d3b#svp",
        full: {
          edges: [
            {
              node: {
                ...PROMO_CARD_PROPS,
                urn: "ppb:tbd:card:promotion:1",
                promotionContentType: "GENERIC",
                label: "Bet Now",
                viewLink: {
                  viewUrn: "ppb:tbd:view:external:external",
                  viewUrl: "https://www.betfair.com/betting/",
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "PromotionCard",
                urn: "ppb:tbd:card:promotion:1",
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:personalisedPromotions:435d2d3b#svp",
      },
    },
  ],
};

const MARKET_ID = "924.266233830";
const SELECTION_ID = "39879518";

const PROMO_ODDSBOOST_MARKET = {
  __typename: "SportsbookMarket",
  urn: `ppb:sbkMarket:${MARKET_ID}`,
  promotionName: "Daily Treble Boost",
  marketType: "COMMERCIAL_ODDSBOOST",
  hierarchy: {
    __typename: "EventCompetitionHierarchy",
    competition: {
      urn: "ppb:competition:2608550",
      name: "Specials",
      competitionId: 2608550,
    },
    sportevent: {
      urn: "ppb:event:26896160",
      name: "OddsBoost",
    },
  },
  runners: [
    {
      runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
      name: "Ciro Immobile, Lorenzo Insigne and Breel Embolo to have 1 or more shots on target each",
      selectionId: SELECTION_ID,
    },
  ],

  isOddsboostMarketType: true,
};

const PROMO_ODDSBOOST_RUNNER = {
  runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
  selectionId: SELECTION_ID,
};

const BFF_SPORT_PAGE_2_CARDS = {
  urn: `ppb:tbd:view:sport:${SPORT_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:personalisedPromotions:435d2d3b#svp",
        full: {
          edges: [
            {
              node: {
                ...PROMO_CARD_PROPS,
                urn: "ppb:tbd:card:promotion:1",
                promotionContentType: "GENERIC",
                label: "Bet Now",
                viewLink: {
                  viewUrn: "ppb:tbd:view:external:external",
                  viewUrl: "https://www.betfair.com/betting/",
                },
              },
            },
            {
              node: {
                ...PROMO_CARD_PROPS,
                urn: "ppb:tbd:card:promotion:2",
                promotionContentType: "ODDSBOOST",
                termsAndConditions: {
                  url: "https://promos.betfair.com/promotion?promoCode=sbkb20g5280720p",
                  summary: "Some Serious Terms And Conditions",
                  label: { name: "Terms and Conditions Apply" },
                },
                market: PROMO_ODDSBOOST_MARKET,
                runner: PROMO_ODDSBOOST_RUNNER,
                displayPreviousOdd: true,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "PromotionCard",
                urn: "ppb:tbd:card:promotion:1",
              },
            },
            {
              node: {
                __typename: "PromotionCard",
                urn: "ppb:tbd:card:promotion:2",
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:personalisedPromotions:435d2d3b#svp",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_ID,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.2 },
            },
          ],
        },
      ],
    },
  ],
};

const MODULE_NAME = "promotions";

describe("Promotions", () => {
  describe("When Promotion swimlane has one card", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_MOCK_1_CARD.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_1_CARD));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
      await browser.waitUntilDisplayed(sportPagePO.element);
      await browser.waitUntilDisplayed(promotionsSwimlanePO.element);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1519]_should_use_all_the_width_available_and_display_name_and_background_with_overlay_and_t&cs_and_action_button`,
      );
    });

    it("[PRPI-1519]_should_use_all_the_width_available_and_display_name_and_background_with_overlay_and_t&cs_and_action_button", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1519]_should_use_all_the_width_available_and_display_name_and_background_with_overlay_and_t&cs_and_action_button`,
        ),
      ).toEqual(0);
    });
  });

  describe("When Promotion swimlane has more than one card", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_2_CARDS.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_2_CARDS));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
      await browser.waitUntilDisplayed(sportPagePO.element);
      await browser.waitUntilDisplayed(promotionsSwimlanePO.element);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1520]_should_not_use_all_the_width_available_and_display_name_and_background_with_overlay_and_t&cs_and_action_button`,
      );
    });

    it("[PRPI-1520]_should_not_use_all_the_width_available_and_display_name_and_background_with_overlay_and_t&cs_and_action_button", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1520]_should_not_use_all_the_width_available_and_display_name_and_background_with_overlay_and_t&cs_and_action_button`,
        ),
      ).toEqual(0);
    });

    describe("When user swipes to last card and is oddsboost promo", () => {
      beforeAll(async () => {
        await promotionSecondCard.element.scrollIntoView();
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1521]_should_not_use_all_the_width_available_and_display_oddsboost_logo_and_bet_button`,
        );
      });

      it("[PRPI-1521]_should_not_use_all_the_width_available_and_display_oddsboost_logo_and_bet_button", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1521]_should_not_use_all_the_width_available_and_display_oddsboost_logo_and_bet_button`,
          ),
        ).toEqual(0);
      });
    });
  });
});
