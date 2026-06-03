const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { RegulatoryHeaderPO } = require("../../../../../page-objects");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const regulatoryHeaderPO = new RegulatoryHeaderPO();
const mockService = new MockService();

const BFF_MOCK = (loggedIn = false) => ({
  __typename: "GenericView",
  url: "view/generic:home",
  urn: "ppb:tbd:view:generic:home",
  regulatoryData: {
    sections: [
      {
        __typename: "RegulatorySectionGeneric",
        sectionType: "GENERIC",
        items: [
          {
            __typename: "RegulatoryImageItem",
            imageURL: "http://example.test.com/mockedImage/image.png",
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
            imageURL: "http://example.test.com/mockedImage/image.png",
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
            imageURL: "http://example.test.com/mockedImage/image.png",
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
            imageURL: "http://example.test.com/mockedImage/image.png",
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
            imageURL: "http://example.test.com/mockedImage/image.png",
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
          ...(loggedIn
            ? [
                {
                  __typename: "RegulatorySessionItem",
                  alignment: "CENTER",
                  sessionText: "Session:",
                  timeFormat: "HH:mm:ss",
                  time: "2020-01-01T16:01:56.244Z",
                },
              ]
            : []),
        ],
      },
    ],
  },
  edges: [],
  partialEdges: [],
  bottomBar: {},
});

describe("Layout Entity - RegulatoryData with images and session", () => {
  describe("When a danish loggedOut user is on a given screen And RegulatoryData is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK().urn, { loggedIn: "false" }));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK()));
      await browser.url(routes.getHomeViewUrl());
      await browser.waitUntilDisplayed(regulatoryHeaderPO.element);
    });

    it("[PRPI-7510] The 5 images should be displayed", async () => {
      expect(await regulatoryHeaderPO.headerImageItems.length).toBe(5);
    });

    it("[PRPI-7511] The session timer should not be visible", async () => {
      expect(await regulatoryHeaderPO.headerSessionItem.isDisplayed()).toBe(false);
    });
  });

  describe("When a danish loggedIn user is on a given screen And RegulatoryData is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK(true).urn, { loggedIn: "true", date: "2020-01-01T17:01:56.244Z" }),
      );
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK(true)));
      await browser.url(routes.getHomeViewUrl());
      await browser.waitUntilDisplayed(regulatoryHeaderPO.element);
    });

    it("[PRPI-7512] The 5 images should be displayed", async () => {
      expect(await regulatoryHeaderPO.headerImageItems.length).toBe(5);
    });

    it("[PRPI-7513] The session timer should be visible", async () => {
      const sessionItemLabel = await regulatoryHeaderPO.headerSessionItemLabel.getText();
      const sessionItemTime = await regulatoryHeaderPO.headerSessionItemTime.getText();

      expect(sessionItemLabel).toBe("Session:");
      expect(sessionItemTime).toBe("01:00:00");
    });
  });
});
