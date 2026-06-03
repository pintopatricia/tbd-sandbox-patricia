const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const BFF_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:inplay",
  title: "In-Play",
  category: "BETTING",
  viewHeader: {
    title: "In-Play",
    titleImage: null,
    subTitle: null,
    badge: null,
    __typename: "ViewHeader",
  },
  edges: [],
  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:navigationTabsList:YUHy9hIAACMAOFWp/cv/inplay",
        __typename: "NavigationTabsList",
      },
      theme: null,
      __typename: "ViewItemEdge",
    },
    {
      node: {
        urn: "ppb:tbd:card:contentSummary:inplay:inplay",
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

describe("Given that I'm on the In Play Landing Page and no card is yet loaded", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest({ ...getCardResults(BFF_CARDS, { statusCode: 404 }), delay: 100000 });
    await browser.url(routes.getEventViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1501]_The_in_play_landing_placeholders_are_displayed`);
  });

  it("[PRPI-1501]_The_in_play_landing_placeholders_are_displayed", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1501]_The_in_play_landing_placeholders_are_displayed`)).toBe(
      0,
    );
  });
});
