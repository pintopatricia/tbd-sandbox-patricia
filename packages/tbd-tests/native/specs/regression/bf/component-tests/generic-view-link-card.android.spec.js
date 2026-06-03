const {
  getSportsLayout,
  getGenericLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { GenericViewLinkCardSO, PageHeaderSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const mockService = new MockService();
const genericViewLinkCardSO = new GenericViewLinkCardSO();
const inplayHeaderSO = new PageHeaderSO();

const FOOTBALL_EVENT_TYPE_ID = 1;

const BFF_MOCK_FOOTBALL = {
  urn: `ppb:tbd:view:sport:${FOOTBALL_EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "GenericViewLinkCard",
        urn: "ppb:tbd:card:genericViewLink:generic:cHBiOnRiZDp2aWV3OmdlbmVyaWM6aW5wbGF5",
        viewLink: {
          viewUrl: "view/d-inplay",
          viewUrn: "ppb:tbd:view:generic:inplay",
        },
        badge: "INPLAY",
        genericViewLinkTitle: {
          __typename: "DisplayNameTitle",
          name: "Inplay",
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "GenericViewLinkCard",
        urn: "ppb:tbd:card:genericViewLink:generic:cHBiOnRiZDp2aWV3OmdlbmVyaWM6aW5wbGF5",
      },
    },
  ],
};

const BFF_MOCK_INPLAY = {
  urn: `ppb:tbd:view:generic:inplay`,
  title: "Inplay",
  edges: [],
  partialEdges: [],
};

describe("GenericViewLinkCard", () => {
  describe("When the user enters a page with Generic View Link Card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK_FOOTBALL));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_INPLAY));
      const url = "soccer/s-1";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(genericViewLinkCardSO.element);
    });

    it("[PRPI-2207] The card should have a title", async () => {
      expect(await genericViewLinkCardSO.linkText.getText()).toBe("Inplay");
    });

    describe("When the user taps on the card", () => {
      beforeAll(async () => {
        await genericViewLinkCardSO.element.click();
        await browser.waitUntilEquals(inplayHeaderSO.pageHeaderTitle, "Inplay");
      });

      it("[PRPI-2208] The destination page should be displayed", async () => {
        expect(await inplayHeaderSO.pageHeaderTitle.getText()).toBe("Inplay");
      });
    });
  });
});
