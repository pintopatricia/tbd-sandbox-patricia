const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const EVENT_ID = "29359895";

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:coupon:YytEIxAAACEA6mgL/s/1?=d=Y0ALOREAAB8ARlzD",
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
  },
  edges: [],
  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:genericswitcher:coupon:YytEIxAAACEA6mgL/s/1?=d=Y0ALOREAAB8ARlzD%2Fs%2F1",
        __typename: "GenericSwitcherCard",
      },
      theme: null,
      __typename: "ViewItemEdge",
    },
    {
      node: {
        urn: "ppb:tbd:cardgroup:coupon:YytEIxAAACEA6mgL/s/1?=hideTitle=true",
        __typename: "FilteredCouponCardGroup",
      },
      theme: null,
      __typename: "ViewItemEdge",
    },
    {
      node: {
        urn: "ppb:tbd:card:contentSummary:coupon:YytEIxAAACEA6mgL/s/1?=d=Y0ALOREAAB8ARlzD%2Fs%2F1",
        __typename: "ContentSummaryCard",
      },
      theme: null,
      __typename: "ViewItemEdge",
    },
    {
      node: {
        urn: "ppb:tbd:card:preference:singleChoice:sportsbookOddsDisplay|SEGMENTED",
        __typename: "PreferenceSingleChoiceCard",
      },
      theme: null,
      __typename: "ViewItemEdge",
    },
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
      },
      theme: null,
      __typename: "ViewItemEdge",
    },
  ],
};

const BFF_CARDS = {
  cards: [],
};

const MODULE_NAME = "placeholders";

describe("Given that I'm on the Football Event Page and no card is yet loaded", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest({ ...getCardResults(BFF_CARDS, { statusCode: 404 }), delay: 100000 });
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1498]_The_football_event_page_placeholders_are_displayed`);
  });

  it("[PRPI-1498]_The_football_event_page_placeholders_are_displayed", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1498]_The_football_event_page_placeholders_are_displayed`),
    ).toBe(0);
  });
});
