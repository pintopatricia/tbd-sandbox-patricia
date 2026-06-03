const { getMaintenanceLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { FooterPO } = require("../../../../page-objects");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getHtmlFilePuppeteer } = require("../../../../mock-essentials/controllers/html/html-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getHomeViewUrl } = require("../../../../../utils/routes");

const MODULE_NAME = "maintenance_view";
const mockService = new MockService();
const footerPO = new FooterPO();

const BFF_MOCK = {
  urn: "ppb:tbd:view:maintenance:maintenance",
  url: "view/maintenance-maintenance",
  __typename: "MaintenanceView",
  redirectUrl: "",
  products: [
    {
      product: "SPORTSBOOK",
      status: "OK",
      viewUrn: "ppb:tbd:view:generic:home",
      viewUrl: "",
      name: "I18N.SPORTSBOOK",
    },
    {
      product: "EXCHANGE",
      status: "SPLASHED",
      viewUrn: "ppb:tbd:view:generic:home",
      viewUrl: "",
      name: "I18N.EXCHANGE",
    },
    {
      product: "GAMES",
      status: "OK",
      viewUrn: "ppb:tbd:view:gaming:1",
      viewUrl: "",
      name: "I18N.GAMES",
    },
  ],

  twitterUrl: "https://twitter.com/BetfairCS",
  pageInfo: null,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
        sections: [
          {
            __typename: "RegulatorySectionGeneric",
            sectionType: "GENERIC",
            genericSectionTitle: null,
            items: [
              {
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "Warning: Although the current score, yada yada yada…",
              },
            ],
          },
          {
            __typename: "RegulatorySectionGeneric",
            sectionType: "GENERIC",
            genericSectionTitle: "Licensing",
            items: [
              {
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "Rules & Regulations",
                url: "https://www.betfair.com/en/aboutUs/Rules.and.Regulations/",
                target: "BLANK",
                viewLink: {
                  viewUrl: "https://www.betfair.com/en/aboutUs/Rules.and.Regulations/",
                  viewUrn: "ppb:tbd:view:external:external",
                  viewDisplayMode: "BLANK_INAPP",
                },
              },
            ],
          },
        ],
      },
    },
  ],

  regulatoryData: {
    sections: [],
  },
};
const TWITTER_MOCK = `
  <div style="display: flex; align-items:center; justify-content: center; width: 100%; height: 100%; background: royalblue" id="twitter">
    <span style="font-size: 30px">TWITTER MOCK</span>
  </div>
`;

describe("Maintenance View", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getMaintenanceLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getHtmlFilePuppeteer({ path: ".*/BetfairCS.*", content: TWITTER_MOCK }));
    await mockService.mockHttpRequest(getSSCHeaderCSS());
    await mockService.mockHttpRequest(getSSCv1Content());
    await browser.url(getHomeViewUrl());
  });

  describe("when BFF returns a maintenance view", () => {
    beforeAll(async () => {
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1395]_the_maintenancee_view_should_be_displayed`);
    });

    it("[PRPI-1395]_the_maintenancee_view_should_be_displayed", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1395]_the_maintenancee_view_should_be_displayed`)).toBe(0);
    });
  });

  describe("when scrolling down the view", () => {
    beforeAll(async () => {
      await footerPO.element.scrollIntoView();
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1396]_the_maintenance_view_should_correctly_scroll`);
    });

    it("[PRPI-1396]_the_maintenance_view_should_correctly_scroll", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1396]_the_maintenance_view_should_correctly_scroll`)).toBe(
        0,
      );
    });
  });
});
