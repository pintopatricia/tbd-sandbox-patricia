const { getGenericLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");

const { GenericScreenSO, PrimaryButtonSO, CasinoPromotionCardSO } = require("../../../../screen-objects");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const genericScreenSO = new GenericScreenSO();

const firstPromotionCardSO = new CasinoPromotionCardSO(genericScreenSO.casinoPromotionCards[0].element);
const firstPromoPrimaryButtonSO = new PrimaryButtonSO(firstPromotionCardSO.actionButton);

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
                promotionName: "Casino Promotion Test",
                promotionContentType: "CASINO",
                label: "Opt In",
                viewLink: {
                  viewUrl: "https://www.betfair.com/betting/",
                  viewUrn: "ppb:tbd:view:external:external",
                },
                promotionTitle: "Casino Subtitle",
                termsAndConditions: {
                  summary: "Terms And Conditions Summary",
                  url: "https://promos.betfair.com/promotion?promoCode=sbkb20g5280720p",
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

describe("Promotions", () => {
  describe("When user enters a view with a casino card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_SPORT_PAGE_WITH_PROMOS_MOCK));
      const url = "football/s-1";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(firstPromotionCardSO.element);
    });

    it("[PRPI-2385] The promotion card should be displayed", async () => {
      expect(await firstPromotionCardSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2386] The title should be displayed", async () => {
      expect(await firstPromotionCardSO.title.getText()).toBe("CASINO PROMOTION TEST");
    });

    it("[PRPI-2387] The subtitle should be displayed", async () => {
      expect(await firstPromotionCardSO.subtitle.isDisplayed()).toBe(true);
    });

    it("[PRPI-2388] The CTA label should be displayed", async () => {
      expect(await firstPromoPrimaryButtonSO.label.getText()).toBe("Opt In");
    });

    it("[PRPI-2389] The T&C summary should be displayed", async () => {
      expect(await firstPromotionCardSO.termsSummary.isDisplayed()).toBe(true);
    });
  });
});
