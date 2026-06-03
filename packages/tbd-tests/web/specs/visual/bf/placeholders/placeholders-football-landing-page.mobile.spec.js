const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const BFF_MOCK = {
  __typename: "SportView",
  urn: "ppb:tbd:view:sport:1",
  title: null,
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:1",
    name: "Football",
    sportId: 1,
  },
  edges: [],
  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:genericswitcher:sport:1",
        __typename: "GenericSwitcherCard",
      },
      theme: null,
      __typename: "ViewItemEdge",
    },
    {
      node: {
        urn: "ppb:tbd:card:navigationTabsList:YKUnExAAACQA56IZ/s/1",
        __typename: "NavigationTabsList",
      },
      theme: null,
      __typename: "ViewItemEdge",
    },
    {
      node: {
        urn: "ppb:tbd:gaming:masterConfigElement:styw/0",
        __typename: "GamingPlayNewCard",
      },
      theme: null,
      __typename: "ViewItemEdge",
    },
    {
      node: {
        urn: "ppb:tbd:gaming:masterConfigElement:curated/1",
        __typename: "GamingCardGroup",
      },
      theme: null,
      __typename: "ViewItemEdge",
    },
    {
      node: {
        urn: "ppb:tbd:card:contentSummary:sport:1",
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

describe("Given that I'm on the Football Landing Page and no card is yet loaded", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest({ ...getCardResults(BFF_CARDS, { statusCode: 404 }), delay: 100000 });
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1499]_The_football_landing_placeholders_are_displayed`);
  });

  it("[PRPI-1499]_The_football_landing_placeholders_are_displayed", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1499]_The_football_landing_placeholders_are_displayed`),
    ).toBe(0);
  });
});
