const { SnackbarPO } = require("../../../../../page-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const mockService = new MockService();
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const routes = require("../../../../../../utils/routes");
const { getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

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
            label: "429",
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

const BFF_CARDS = {
  cards: [],
};

const snackbarPO = new SnackbarPO();

describe("When BFF returns error 429", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest({
      ...getCardResults(BFF_CARDS, {
        statusCode: 429,
      }),
    });
    await mockService.mockHttpRequest(await getIndexHTML(BFF_HOME_VIEW_MOCK.urn));
    await browser.url(routes.getHomeViewUrl());
  });

  describe("and user is logged in", () => {
    it("[PRPI-6320] should display the appropriate error message", async () => {
      await browser.waitUntilDisplayed(snackbarPO.element);
      expect(await snackbarPO.element.isDisplayed()).toBe(true);
      expect(await snackbarPO.title.getText()).toBe("Too many requests in a short time period");
      expect(await snackbarPO.description.getText()).toBe("Please contact support");
    });
  });

  describe("and user is logged out", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_HOME_VIEW_MOCK.urn, {
          loggedIn: "false",
        }),
      );
      await browser.url(routes.getHomeViewUrl());
    });

    it("[PRPI-6321] should display the appropriate error message", async () => {
      await browser.waitUntilDisplayed(snackbarPO.element);

      expect(await snackbarPO.element.isDisplayed()).toBe(true);
      expect(await snackbarPO.title.getText()).toBe("Too many requests in a short time period");
      expect(await snackbarPO.description.getText()).toBe("Please login to continue");
    });
  });
});
