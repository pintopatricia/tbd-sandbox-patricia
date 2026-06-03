const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getGenericLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { swipeLeftElement } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");

const { GenericScreenSO, PrimaryButtonSO, PromotionCardSO } = require("../../../../screen-objects");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const genericScreenSO = new GenericScreenSO();

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
                label: "Bet Now",
                promotionName: "BET $20 ON MULTIPLES",
                promotionTitle: "kekw",
                termsAndConditions: {
                  summary: "Terms and conditions",
                  url: "https://promos.betfair.com/promotion?promoCode=sbkb20g5280720p",
                  label: { translationKey: "I18N.BETSLIP.ACCA_INSURANCE_TERMS_LABEL" },
                },
                urn: "ppb:tbd:card:promotion:1",
                viewLink: {
                  viewUrl: "https://www.betfair.com/betting/",
                  viewUrn: "ppb:tbd:view:external:external",
                },
              },
            },
            {
              node: {
                ...PROMO_CARD_PROPS,
                label: "Bet Now",
                promotionName: "BET $5 ON SINGLES",
                urn: "ppb:tbd:card:promotion:2",
                viewLink: {
                  viewUrl: "https://www.betfair.com/betting/",
                  viewUrn: "ppb:tbd:view:external:external",
                },
                termsAndConditions: null,
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

describe("Promotions", () => {
  describe("When user enters a view with promo swimlane", () => {
    const firstPromotionCardSO = new PromotionCardSO(genericScreenSO.promotionCards[0]);
    const firstPromoPrimaryButtonSO = new PrimaryButtonSO(firstPromotionCardSO.actionButton);

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

    it("[PRPI-2395] The first promotion card should be displayed", async () => {
      expect(await firstPromotionCardSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2396] The title should be displayed", async () => {
      expect(await firstPromotionCardSO.name.getText()).toBe("BET $20 ON MULTIPLES");
    });

    it("[PRPI-2397] The subtitle should be displayed", async () => {
      expect(await firstPromotionCardSO.title.getText()).toBe("KEKW");
    });

    it("[PRPI-2398] The T&C summary should be displayed", async () => {
      expect(await firstPromotionCardSO.termsSummary.getText()).toBe("Terms and conditions");
    });

    it("[PRPI-2399] The T&C link should be rendered with correct label", async () => {
      expect(await firstPromotionCardSO.termsLabel.getText()).toBe("T&C’s apply");
    });

    it("[PRPI-2400] The T&C link should be pressable", async () => {
      expect(await firstPromotionCardSO.termsPressable.isDisplayed()).toBe(true);
    });

    it("[PRPI-2401] The CTA label should be displayed", async () => {
      expect(await firstPromoPrimaryButtonSO.label.getText()).toBe("Bet Now");
    });

    describe("When user swipes to reveal second promotion card (with minimum required properties retrieved)", () => {
      let secondPromotionCardSO;
      let secondPromoPrimaryButtonSO;

      beforeAll(async () => {
        await swipeLeftElement(firstPromotionCardSO.termsLabel);

        const numberOfCards = await genericScreenSO.promotionCards.length;
        secondPromotionCardSO = new PromotionCardSO(genericScreenSO.promotionCards[numberOfCards - 1]);
        secondPromoPrimaryButtonSO = new PrimaryButtonSO(secondPromotionCardSO.actionButton);

        await browser.waitUntilDisplayed(secondPromotionCardSO.element);
        await browser.waitUntilEquals(secondPromoPrimaryButtonSO.label, "Bet Now");
      });

      it("[PRPI-2402] The second promotion card should be displayed", async () => {
        expect(await secondPromotionCardSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2403] The title should be displayed", async () => {
        expect(await secondPromotionCardSO.name.getText()).toBe("BET $5 ON SINGLES");
      });

      it("[PRPI-2404] The subtitle should not be displayed", async () => {
        expect(await secondPromotionCardSO.title.isDisplayed()).toBe(false);
      });

      it("[PRPI-2405] The T&C summary should not be displayed", async () => {
        expect(await secondPromotionCardSO.termsSummary.isDisplayed()).toBe(false);
      });

      it("[PRPI-2406] The T&C link should not be displayed", async () => {
        expect(await secondPromotionCardSO.termsPressable.isDisplayed()).toBe(false);
      });

      it("[PRPI-2407] The CTA label should be displayed", async () => {
        expect(await secondPromoPrimaryButtonSO.label.getText()).toBe("Bet Now");
      });
    });
  });
});
