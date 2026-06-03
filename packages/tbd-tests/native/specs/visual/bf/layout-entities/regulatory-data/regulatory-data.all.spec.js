const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { GenericScreenSO, RegulatoryHeaderSO } = require("../../../../../screen-objects");
const { startApp } = require("../../../../../helpers/urls");
const MockService = require("../../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const regulatoryHeaderSO = new RegulatoryHeaderSO();

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

describe("RegulatoryData", () => {
  describe("When an italian loggedIn user is on a given screen and RegulatoryData is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await startApp("home");
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(regulatoryHeaderSO.element);
    });

    it("[PRPI-4841]regulatory-data_[1048999]_should_see_the_regulatory_header_and_the_header_with_login", async () => {
      expect(
        (
          await browser.compareScreen(
            `regulatory-data_[PRPI-4841]_should_see_the_regulatory_header_and_the_header_with_login`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });
  });
});
