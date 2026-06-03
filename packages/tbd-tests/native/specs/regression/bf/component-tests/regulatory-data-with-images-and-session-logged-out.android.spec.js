const { getAppContext, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { GenericScreenSO, RegulatoryHeaderSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const MockService = require("../../../../mock-essentials/mocking-service");

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
          {
            __typename: "RegulatorySessionItem",
            alignment: "CENTER",
            sessionText: "Session:",
            timeFormat: "HH:mm:ss",
            time: "2020-01-01T16:01:56.244Z",
          },
        ],
      },
    ],
  },
  edges: [],
  partialEdges: [],
};

describe("Layout Entity - RegulatoryData with images and session logged out", () => {
  describe("When a danish loggedOut user is on a given screen And RegulatoryData is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({ loggedIn: "false" }));
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await startApp("home");
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(regulatoryHeaderSO.element);
      await browser.waitUntilDisplayed(regulatoryHeaderSO.headerImageItems[0]);
    });

    it("[PRPI-2516] The 5 images should be displayed", async () => {
      expect(await regulatoryHeaderSO.headerImageItems.length).toBe(5);
    });

    it("[PRPI-2517] The session timer should not be visible", async () => {
      expect(await regulatoryHeaderSO.headerSessionItem.isDisplayed()).toBe(false);
    });
  });
});
