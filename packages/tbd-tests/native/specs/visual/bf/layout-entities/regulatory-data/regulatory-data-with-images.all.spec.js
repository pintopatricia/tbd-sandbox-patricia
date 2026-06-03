const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { GenericScreenSO, RegulatoryHeaderSO } = require("../../../../../screen-objects");
const { startApp } = require("../../../../../helpers/urls");
const MockService = require("../../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();
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
            __typename: "RegulatoryImageItem",
            imageURL: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.spillemyndigheden.dk",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.spillemyndigheden.dk",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://ansvarligtspil.nxt.com.betfair/",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://ansvarligtspil.nxt.com.betfair/",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.stopspillet.dk/",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.stopspillet.dk/",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://ansvarligtspil.nxt.com.betfair/protecting-minors",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://ansvarligtspil.nxt.com.betfair/protecting-minors",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.rofus.nu/",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.rofus.nu/",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
        ],
      },
    ],
  },
  edges: [],
  partialEdges: [],
};

describe("Layout Entity - RegulatoryData with images", () => {
  describe("When a user is on a given screen And RegulatoryData is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await startApp("home");
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(regulatoryHeaderSO.element);
    });

    it("[PRPI-4840]regulatory-data_with_images[HMMR-267]_should_see_the_regulatory_header_logos", async () => {
      expect(
        (await browser.compareScreen(`regulatory-data_with_images[PRPI-4840]_should_see_the_regulatory_header_logos`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
});
