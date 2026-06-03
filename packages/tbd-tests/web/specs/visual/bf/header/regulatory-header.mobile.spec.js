const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const mockService = new MockService();

const MODULE_NAME = "regulatory_header";

const BFF_MOCK = {
  __typename: "GenericView",
  url: "view/generic:home",
  urn: "ppb:tbd:view:generic:home",
  regulatoryData: {
    sections: [
      {
        sectionType: "GENERIC",
        __typename: "RegulatorySectionGeneric",
        items: [
          {
            __typename: "RegulatoryTextItem",
            type: "TEXT",
            alignment: "CENTER",
            text: "Il gioco è riservato ai maggiorenni e può creare dipendenza",
          },
        ],
      },
      {
        sectionType: "GENERIC",
        __typename: "RegulatorySectionGeneric",
        items: [
          {
            __typename: "RegulatoryLinkItem",
            type: "LINK",
            alignment: "CENTER",
            text: "Consulta le probabilità di vincita",
            viewLink: { viewUrl: "https://giocoresponsabile.betfair.it/" },
            target: "_blank",
          },
        ],
      },
    ],
  },
  edges: [],
  partialEdges: [],
};

describe("RegulatoryHeader", () => {
  describe("When an italian loggedIn user is on a given page and RegulatoryData is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { loggedIn: "true" }));

      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await browser.url(routes.getHomeViewUrl());
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1370]_should_see_the_regulatory_header_and_the_header_with_login`,
      );
    });

    it("[PRPI-1370]_should_see_the_regulatory_header_and_the_header_with_login", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1370]_should_see_the_regulatory_header_and_the_header_with_login`,
        ),
      ).toBe(0);
    });
  });
});
