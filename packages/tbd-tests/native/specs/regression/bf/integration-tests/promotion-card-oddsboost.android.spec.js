const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const { getGenericLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  GenericScreenSO,
  SportsbookPlacePanelSO,
  BetDetailsSO,
  FixedNumberInputFieldSO,
  SportsbookBetButtonSO,
  MinimizedSO,
  PromotionCardSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const genericScreenSO = new GenericScreenSO();

const firstPromotionCardSO = new PromotionCardSO(genericScreenSO.promotionCards[0].element);
const oddsBoostBetButtonSO = new SportsbookBetButtonSO();
const sportsbookSinglePlacePanelSO = new SportsbookPlacePanelSO();
const betDetailsSO = new BetDetailsSO(sportsbookSinglePlacePanelSO.element);

const minimizedSO = new MinimizedSO();

const sportsbookPriceInputSO = new FixedNumberInputFieldSO();

const PROMO_CARD_PROPS = {
  __typename: "PromotionCard",
  promotionContentType: "GENERIC",
  backgroundImage: [
    {
      url: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
      width: 456,
      height: 123,
    },
  ],
};
const MARKET_ID = "924.266233830";
const SELECTION_ID = "39879518";

const PROMO_ODDSBOOST_MARKET = {
  __typename: "SportsbookMarket",
  urn: `ppb:sbkMarket:${MARKET_ID}`,
  name: "Daily Treble Boost",
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
      name: "Ciro Immobile and Lorenzo Insigne to have 1 or more shots",
      selectionId: SELECTION_ID,
    },
  ],

  isOddsboostMarketType: true,
};

const PROMO_ODDSBOOST_RUNNER = {
  runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
  selectionId: SELECTION_ID,
};

const IMPLY_MOCK = {
  betCombinations: [
    {
      legCombinations: [
        {
          runners: [
            {
              marketId: MARKET_ID,
              selectionId: SELECTION_ID,
            },
          ],
        },
      ],
    },
  ],

  runnerOdds: [
    {
      runner: {
        marketId: MARKET_ID,
        selectionId: SELECTION_ID,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.3 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.3,
        },
      },
    },
  ],
};

const BFF_SPORT_PAGE_WITH_PROMOS_MOCK = {
  urn: "ppb:tbd:view:sport:1",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:435d2d3b",
        full: {
          edges: [
            {
              node: {
                ...PROMO_CARD_PROPS,
                displayPreviousOdd: true,
                market: PROMO_ODDSBOOST_MARKET,
                name: "Oddsboost Promotion Test",
                promotionContentType: "ODDSBOOST",
                promotionTitle: "Oddsboost Subtitle",
                runner: PROMO_ODDSBOOST_RUNNER,
                hasBetfairBoost: true,
                termsAndConditions: {
                  summary: "terms And Conditions Summary",
                  url: "https://promos.betfair.com/promotion?promoCode=sbkb20g5280720p",
                  label: { name: "Terms and Conditions Apply" },
                },
                urn: "ppb:tbd:card:promotion:1",
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
        urn: "ppb:tbd:cardgroup:swimlane:435d2d3b",
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

const SMP_MOCK_POLLING = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_ID,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.3 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 2.2 },
            },
          ],
        },
      ],
    },
  ],
};

const SMP_MOCK_SUSPENDED = {
  markets: [
    {
      ...SMP_MOCK_POLLING.markets[0],
      marketStatus: "SUSPENDED",
      runnerDetails: [
        {
          selectionId: SELECTION_ID,
          runnerOdds: { decimalDisplayOdds: { decimalOdds: 1.77 } },
          previousWinRunnerOdds: [{ decimalDisplayOdds: { decimalOdds: 1.66 } }],
        },
      ],
    },
  ],
};

const SMP_MOCK_CLOSED = {
  markets: [
    {
      ...SMP_MOCK_POLLING.markets[0],
      noMarketInfo: true,
    },
  ],
};

describe("Promotions", () => {
  describe("When user enters a view with a oddsboost promotion card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_SPORT_PAGE_WITH_PROMOS_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      const url = "football/s-1";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(firstPromotionCardSO.element);
    });

    it("[PRPI-3094] The oddsboost promo tag should be displayed", async () => {
      expect(await firstPromotionCardSO.oddsBoostIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-3095] The previous odd should be displayed in the oddsboost bet button", async () => {
      expect(await oddsBoostBetButtonSO.secondaryLabel.getText()).toBe("1.2");
    });

    it("[PRPI-3096] The boosted odd should be displayed in the oddsboost bet button", async () => {
      expect(await oddsBoostBetButtonSO.odd.getText()).toBe("1.3");
    });

    it("[PRPI-3097] The T&C link should be rendered with correct label", async () => {
      expect(await firstPromotionCardSO.termsLabel.getText()).toBe("Terms and Conditions Apply");
    });

    it("[PRPI-3098] The T&C link should be pressable", async () => {
      expect(await firstPromotionCardSO.termsPressable.isDisplayed()).toBe(true);
    });

    describe("When user clicks on bet button", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_MOCK));
        await browser.waitUntilClickableNative(oddsBoostBetButtonSO.element);
        await oddsBoostBetButtonSO.element.click();
        await browser.waitUntilDisplayed(betDetailsSO.element);
        await browser.waitUntilEquals(sportsbookPriceInputSO.numberField, "1.3");
      });

      it("[PRPI-3099] The betslip should exist", async () => {
        expect(await betDetailsSO.element.isExisting()).toBe(true);
      });

      it("[PRPI-3100] The betslip should be opened with correct title", async () => {
        expect(await betDetailsSO.title.getText()).toBe("Ciro Immobile and Lorenzo Insigne to have 1 or more shots");
      });

      it("[PRPI-3101] The betslip should be opened with correct subtitle", async () => {
        expect(await betDetailsSO.subtitle.getText()).toBe("Daily Treble Boost - OddsBoost");
      });

      it("[PRPI-3102] The betslip should be opened with correct oddsboost price", async () => {
        expect(await sportsbookPriceInputSO.numberField.getText()).toBe("1.3");
      });

      it("[PRPI-3103] The betslip should be opened with correct previous odd", async () => {
        expect(await sportsbookPriceInputSO.previousValue.getText()).toBe("1.2");
      });

      describe("When the user closes betslip and oddsboost price is updated", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(betDetailsSO.element);
          await betDetailsSO.remove.click();
          await browser.waitUntilNotDisplayed(sportsbookSinglePlacePanelSO.element);
          await browser.waitUntilNotDisplayed(minimizedSO.element);
          await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_POLLING, { ignoreRequestedMarketIdsMatch: true }));
          await browser.waitUntilEquals(oddsBoostBetButtonSO.odd, "2.3");
        });

        it("[PRPI-3104] The bet button price should have the previous odd", async () => {
          expect(await oddsBoostBetButtonSO.secondaryLabel.getText()).toBe("2.2");
        });

        it("[PRPI-3105] The bet button price should have the boosted odd", async () => {
          expect(await oddsBoostBetButtonSO.odd.getText()).toBe("2.3");
        });
      });

      describe("And the oddsboost market suspends", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getMarketPrices(SMP_MOCK_SUSPENDED, { ignoreRequestedMarketIdsMatch: true }),
          );
          await browser.waitUntilEquals(oddsBoostBetButtonSO.odd, "-");
        });

        it("[PRPI-3106] The oddsboost bet button should be disabled", async () => {
          expect(await sportsbookSinglePlacePanelSO.element.isDisplayed()).toBe(false);
        });
      });

      describe("And the oddsboost market closes", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED, { ignoreRequestedMarketIdsMatch: true }));
        });

        it("[PRPI-3107] The oddsboost bet button should be disabled", async () => {
          expect(await sportsbookSinglePlacePanelSO.element.isDisplayed()).toBe(false);
        });
      });
    });
  });
});
