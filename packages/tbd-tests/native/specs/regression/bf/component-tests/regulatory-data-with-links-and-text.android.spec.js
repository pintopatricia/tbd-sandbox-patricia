const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { GenericScreenSO, RegulatoryHeaderSO, HeaderSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const headerSO = new HeaderSO();
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
  describe("When an italian loggedIn user is on a given page and RegulatoryData is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await startApp("home");
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(regulatoryHeaderSO.element);
    });

    it("[PRPI-2518] the text 'Il gioco \xE8 riservato ai maggiorenni e pu\xF2 creare dipendenza' should be visible", async () => {
      expect(await regulatoryHeaderSO.headerTextItem.getText()).toContain(
        "Il gioco è riservato ai maggiorenni e può creare dipendenza",
      );
    });

    it("[PRPI-2519] The wallet amount should be visible on tbd header", async () => {
      expect(await headerSO.balance.isDisplayed()).toBe(true);
    });
  });
});
