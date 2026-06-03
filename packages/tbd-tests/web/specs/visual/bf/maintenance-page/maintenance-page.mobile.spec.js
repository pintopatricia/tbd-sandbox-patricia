const { getMaintenanceLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { FooterPO } = require("../../../../page-objects");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

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

  twitterUrl: "http://made-up-domain.betfair.com/twitter/BetfairCS",
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
  bottomBar: {
    __typename: "BottomBar",
    hasProductSwitcher: true,
    tiles: [
      { tileType: "HOME", viewLink: { viewUrn: "ppb:tbd:view:generic:home", viewUrl: "", viewDisplayMode: null } },
      {
        tileType: "GAMING",
        viewLink: { viewUrn: "ppb:tbd:view:gaming:1", viewUrl: "casino/gm-1", viewDisplayMode: null },
      },
    ],
  },
};

const MODULE_NAME = "maintenance_page";

describe("Maintenance page - rebuild partially splashed", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getMaintenanceLayout(BFF_MOCK));
    await mockService.mockHttpRequest({
      // catch with
      method: "GET",
      pathRegex: ".*twitter/BetfairCS.*",
      // respond with
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=UTF-8" },
      response: '<html><body style="background:coral;"><p>iframe not from Twitter</p></body></html>',
    });
    await browser.url(routes.getHomeViewUrl());
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4789]_should_show_products_maintenance_page`);
  });

  it("[PRPI-4789]_should_show_products_maintenance_page", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4789]_should_show_products_maintenance_page`)).toBe(0);
  });

  describe("when scrolling down the page", () => {
    beforeAll(async () => {
      await footerPO.element.scrollIntoView({ block: "center" });
      await browser.waitUntilDisplayed(footerPO.element);
    });

    it("[PRPI-4790]_should_show_regulatory_sections", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4790]_should_show_regulatory_sections`)).toBe(0);
    });
  });
});
