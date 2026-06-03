const { GenericViewLinkCardPO } = require("../../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const genericViewLinkCardPO = new GenericViewLinkCardPO();

const mockService = new MockService();

const FOOTBALL_EVENT_TYPE_ID = 1;

const BFF_MOCK_FOOTBALL = {
  urn: `ppb:tbd:view:sport:${FOOTBALL_EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "GenericViewLinkCard",
        urn: "ppb:tbd:card:genericViewLink:generic:cHBiOnRiZDp2aWV3OmdlbmVyaWM6aW5wbGF5",
        viewLink: {
          viewUrl: "view/generic:inplay",
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

describe("Component - GenericViewLinkCard", () => {
  describe("When the user enters a page with Generic View Link Card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_FOOTBALL.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK_INPLAY));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK_FOOTBALL));
      await browser.url(routes.getSportViewUrl(FOOTBALL_EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(genericViewLinkCardPO.element);
    });

    it("[PRPI-5673] The card should have a title", async () => {
      expect(await genericViewLinkCardPO.element.getText()).toBe("Inplay");
    });
  });

  describe("When the user taps on the card", () => {
    beforeAll(async () => {
      await genericViewLinkCardPO.element.click();
    });

    it("[PRPI-5674] The destination page should be displayed", async () => {
      const url = await browser.getUrl();

      expect(url.endsWith("d-inplay")).toBe(true, `${url} generic view`);
    });
  });
});
