const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const GENERIC_VIEW_URL = "odds/euro-elite/cpn-Yysw5hAAACEA6hnA%2Fs%2F1?d=Y27UFxEAAPUhEoUO";
const BFF_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:coupon:YytEIxAAACEA6mgL/s/1?=d=Y0ALOREAAB8ARlzD",
  url: "odds/today-s-football/cpn-YytEIxAAACEA6mgL%2Fs%2F1?d=Y0ALOREAAB8ARlzD",
  title: null,
  category: "BETTING",
  viewHeader: {
    title: null,
    titleImage: null,
    subTitle: null,
    badge: null,
    __typename: "ViewHeader",
  },
  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:cardgroup:quicklinksGrid:Y27UFxEAAPUhEoUO/s/1",
        __typename: "QuicklinksGridCardGroup",
      },
      __typename: "NavigationTabItemsEdge",
    },
    {
      node: {
        urn: "ppb:tbd:cardgroup:quicklinksGrid:Y0ALUREAAB0ARl1L/s/1",
        __typename: "QuicklinksGridCardGroup",
      },
      __typename: "NavigationTabItemsEdge",
    },
    {
      node: {
        urn: "ppb:tbd:cardgroup:swimlane:ZU0BIhIAACYAW68q/s/1",
        __typename: "SwimlaneCardGroup",
      },
      __typename: "NavigationTabItemsEdge",
    },
    {
      node: {
        urn: "ppb:tbd:cardgroup:coupon:YfBEFRMAAB8Aodcj/s/1",
        __typename: "FilteredCouponCardGroup",
      },
      __typename: "NavigationTabItemsEdge",
    },
  ],
};

const BFF_CARDS = {
  cards: [],
};

const MODULE_NAME = "placeholders";

describe("Given that I'm on the Football Coupon Page and no card is yet loaded", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest({ ...getCardResults(BFF_CARDS, { statusCode: 404 }), delay: 100000 });
    await browser.url(routes.getGenericViewUrl(GENERIC_VIEW_URL));
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1497]_The_football_coupon_page_placeholders_are_displayed`,
    );
  });

  it("[PRPI-1497]_The_football_coupon_page_placeholders_are_displayed", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1497]_The_football_coupon_page_placeholders_are_displayed`),
    ).toBe(0);
  });
});
