const NotFoundViewSO = require("@ppb/tbd-shared/components/NotFoundView/NotFoundView.so");
const QuickLinksCardSO = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.native.so");
const { getNotFoundLayout, getBrowseLayout, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp, openUrl } = require("../../../../helpers/urls");
const { swipeUp } = require("../../../../helpers/gestures");
const MockService = require("../../../../mock-essentials/mocking-service");

const { BottomBarSO, FooterSO, EmptyStateSO, QuickLinkSO, HeaderSO } = require("../../../../screen-objects");

const mockService = new MockService();
const emptyStateSO = new EmptyStateSO();
const notFoundViewSO = new NotFoundViewSO();
const quicklinksCardSO = new QuickLinksCardSO();
const footerSO = new FooterSO();
const headerSO = new HeaderSO();
const notFoundLink = new QuickLinkSO(quicklinksCardSO.links[0]);

const notFoundImage = emptyStateSO.defaultImage;
const notFoundTitle = emptyStateSO.title;
const notFoundMessage = emptyStateSO.message;
const firstLink = notFoundViewSO.links[0];
const secondLink = notFoundViewSO.links[1];
const thirdLink = notFoundViewSO.links[2];

const BFF_HOMEPAGE_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "/view/d-home",
  title: "Homepage",
  edges: [],
  partialEdges: [],
};

const BFF_BROWSE_MOCK = {
  urn: "ppb:tbd:view:browse:sports",
  url: "browse/b-sports",
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:azMenu:sports",
        quickLinksTitle: null,
        links: [
          {
            label: "404",
            viewLink: {
              viewUrn: "ppb:tbd:view:notfound:notfound",
              viewUrl: "notfound/404-notfound",
            },
            target: null,
            icon: null,
          },
        ],
      },
    },
  ],
};

const BFF_BROWSE_GAMING_MOCK = {
  urn: "ppb:tbd:view:browse:gaming",
  url: "browse/b-gaming",
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:azMenu:gaming",
        quickLinksTitle: null,
        links: [],
      },
    },
  ],
};

const BFF_MOCK_NOT_FOUND = {
  urn: "ppb:tbd:view:notfound:notfound",
  url: "notfound/notfound/404-notfound",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
        sections: [
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: "Responsible Gambling",
            title: "title",
            items: [
              {
                __typename: "RegulatoryImageItem",
                imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/over18.png",
                alignment: "LEFT",
                alt: null,
                target: "POPUP",
                link: "http://content.betfair.com/misc/?product=portal&sWhichKey=gamCare&locale=en_GB&region=GBR&brand=betfair&entrydomain=betfair.com",
              },
              {
                __typename: "RegulatoryImageItem",
                imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/gamCare.png",
                alignment: "LEFT",
                alt: null,
                target: "BLANK",
                link: "http://www.gamcare.org.uk/",
              },
              {
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "Text Item on Footer.",
              },
              {
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "Gambling can be addictive, please play responsibly",
                url: "http://responsiblegambling.betfair.com/",
                target: "BLANK",
              },
              {
                __typename: "RegulatorySessionItem",
                alignment: "LEFT",
                sessionText: "Some Session Text",
                timeFormat: "HH:mm",
              },
              {
                __typename: "RegulatoryLoggedInSinceItem",
                alignment: "LEFT",
                loggedInSinceText: "Some Logged In Text",
                timeFormat: "HH:mm",
              },
            ],
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
      },
    },
  ],
};

describe("Not Found View", () => {
  describe("When the user navigates to Browse view", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_HOMEPAGE_MOCK));
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_MOCK));
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_GAMING_MOCK));
      await startApp("home");
      await browser.waitUntilDisplayed(BottomBarSO.browse);
      await BottomBarSO.browse.click();
      await browser.waitUntilDisplayed(quicklinksCardSO.element);
    });

    it("[PRPI-2344] The Browse view should be rendered with 404 link", async () => {
      expect(await notFoundLink.label.isDisplayed()).toBe(true);
      expect(await notFoundLink.label.getText()).toEqual("404");
    });

    describe("When the user clicks on 404 link", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getNotFoundLayout(BFF_MOCK_NOT_FOUND));
        await notFoundLink.element.click();
        await browser.waitUntilDisplayed(notFoundTitle);
      });

      it("[PRPI-2345] The back button should be displayed", async () => {
        expect(await headerSO.backButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-2346] The not found image should be displayed", async () => {
        expect(await notFoundImage.isDisplayed()).toBe(true);
      });

      it("[PRPI-2347] The not found title should be displayed with correct text", async () => {
        expect(await notFoundTitle.getText()).toEqual("Oops, sorry about that");
      });

      it("[PRPI-2348] The not found message should be displayed with correct text", async () => {
        expect(await notFoundMessage.getText()).toEqual(
          "Unfortunately this page either doesn’t exist or has been moved.",
        );
      });

      it("[PRPI-2349] The first link should be displayed with correct text", async () => {
        expect(await firstLink.getText()).toEqual("Home");
      });

      it("[PRPI-2350] The second link should be displayed with correct text", async () => {
        expect(await secondLink.getText()).toEqual("My Bets");
      });

      it("[PRPI-2351] The third link should be displayed with correct text", async () => {
        expect(await thirdLink.getText()).toEqual("In-play");
      });

      describe("When the user swipes to reveal footer", () => {
        beforeAll(async () => {
          await swipeUp();
          await browser.waitUntilDisplayed(footerSO.element);
        });

        it("[PRPI-2352] The footer should be displayed", async () => {
          expect(await footerSO.element.isDisplayed()).toBe(true);
        });
      });
    });

    describe("When the user lands on 404 view", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getNotFoundLayout(BFF_MOCK_NOT_FOUND));
        await openUrl(`notfound/404-notfound`);
        await browser.waitUntilDisplayed(notFoundTitle);
      });

      it("[PRPI-2353] The not found page should be rendered", async () => {
        expect(await notFoundTitle.isDisplayed()).toBe(true);
      });
    });
  });
});
