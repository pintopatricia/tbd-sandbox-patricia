const { FooterPO, HeaderPO, EmptyStatePO, QuickLinkPO } = require("../../../../../page-objects");
const NotFoundViewPO = require("@ppb/tbd-shared/components/NotFoundView/NotFoundView.po");
const { getGenericLayout, getNotFoundLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const emptyStatePO = new EmptyStatePO();
const footerPO = new FooterPO();
const notFoundViewPO = new NotFoundViewPO();
const quickLinksPO = new QuickLinkPO();
const headerPO = new HeaderPO();

const emptyStateTitlePO = new EmptyStatePO(emptyStatePO.title);
const emptyStateMessagePO = new EmptyStatePO(emptyStatePO.message);
const firstLink = notFoundViewPO.links[0];
const secondLink = notFoundViewPO.links[1];
const thirdLink = notFoundViewPO.links[2];

const BOTTOM_BAR = {
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        viewUrn: "ppb:tbd:view:generic:home",
        viewUrl: "",
      },
    },
    {
      tileType: "BROWSE",
      viewLink: {
        viewUrn: "ppb:tbd:view:browse:sports",
        viewUrl: "browse/browse:sports",
      },
    },
    {
      tileType: "MY_BETS",
      viewLink: {
        viewUrn: "ppb:tbd:view:myBets:open",
        viewUrl: "mybets/myBets-open",
      },
    },
    {
      tileType: "GAMING",
      viewLink: {
        viewUrn: "ppb:tbd:view:gaming:1",
        viewUrl: "casino/gm-1",
      },
    },
  ],
};

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: BOTTOM_BAR,
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse",
        quickLinksTitle: null,
        links: [
          {
            label: "404",
            viewLink: {
              viewUrn: "ppb:tbd:view:notfound:notfound",
              viewUrl: "notfound/notfound:notfound",
            },
            target: null,
            icon: null,
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse",
      },
    },
  ],
};

const BFF_MOCK_NOT_FOUND = {
  urn: "ppb:tbd:view:notfound:notfound",
  url: "notfound/notfound:notfound",
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

  bottomBar: BOTTOM_BAR,
};

describe("Not Found View", () => {
  describe("When the user lands on home page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_HOME_VIEW_MOCK.urn, { date: "2009-10-10T18:44" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
      await browser.url(routes.getHomeViewUrl());
      await browser.waitUntilDisplayed(quickLinksPO.element);
    });

    it("[PRPI-6225] The Home view should be rendered with 404 link", async () => {
      expect(await quickLinksPO.element.isDisplayed()).toBe(true);
    });

    describe("When the user clicks on 404 link", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getNotFoundLayout(BFF_MOCK_NOT_FOUND));
        await quickLinksPO.element.click();
        await browser.waitUntilDisplayed(emptyStateTitlePO.element);
      });

      it("[PRPI-6226] The back button should be displayed", async () => {
        expect(await headerPO.backButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-6227] The not found title should have correct text", async () => {
        expect(await emptyStateTitlePO.element.getText()).toBe("Oops, sorry about that");
      });

      it("[PRPI-6228] The not found message should have correct text", async () => {
        expect(await emptyStateMessagePO.element.getText()).toBe(
          "Unfortunately this page either doesn’t exist or has been moved.",
        );
      });

      it("[PRPI-6229] The first three links should be displayed", async () => {
        expect(await notFoundViewPO.links.length).toBe(3);
      });

      it("[PRPI-6230] The first link title should be 'Home'", async () => {
        expect(await firstLink.getText()).toBe("Home");
      });

      it("[PRPI-6231] The second link title should be 'My Bets'", async () => {
        expect(await secondLink.getText()).toBe("My Bets");
      });

      it("[PRPI-6232] The third link title should be 'In-Play'", async () => {
        expect(await thirdLink.getText()).toBe("In-play");
      });

      describe("When the user scrolls to reveal the footer", () => {
        beforeAll(async () => {
          await footerPO.element.scrollIntoView();
          await browser.waitUntilDisplayed(footerPO.element);
        });

        it("[PRPI-6233] The footer should be displayed", async () => {
          expect(await footerPO.element.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
