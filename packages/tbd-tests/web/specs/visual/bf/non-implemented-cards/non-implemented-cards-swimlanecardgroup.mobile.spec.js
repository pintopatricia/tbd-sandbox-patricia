const { SportPagePO, ScrollableSwimlanePO } = require("../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const mockService = new MockService();
const MODULE_NAME = "non_implemented_cards";
const EVENT_TYPE_ID = 1;
const sportPagePO = new SportPagePO();
const firstSwimlane = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);

const generateQuicklinksCard = (id, typename) => ({
  __typename: typename,
  urn: `ppb:tbd:card:quickLinks:${id}`,
  links: [
    {
      label: `Random Link ${id}`,
      viewLink: {
        viewUrn: `ppb:tbd:view:market:924.${id}`,
        viewUrl: routes.getMarketViewUrl(`924.${id}`),
      },
    },
  ],
});

const generateSwimlaneCardGroup = (id, typename = "QuickLinksCard") => ({
  __typename: "SwimlaneCardGroup",
  urn: `ppb:tbd:cardgroup:swimlane:${id}`,
  cardGroupTitle: `Swimlane ${id}`,
  full: {
    edges: [
      {
        node: generateQuicklinksCard(`${id}0`, typename),
      },
      {
        node: generateQuicklinksCard(`${id}1`, typename),
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "QuickLinksCard",
          urn: `ppb:tbd:card:quickLinks:${id}0`,
        },
      },
      {
        node: {
          __typename: "QuickLinksCard",
          urn: `ppb:tbd:card:quickLinks:${id}1`,
        },
      },
    ],
  },
});

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: generateSwimlaneCardGroup(1),
    },
    {
      node: generateSwimlaneCardGroup(2, "not-implemented"),
    },
    {
      node: generateSwimlaneCardGroup(3, "not-implemented"),
    },
    {
      node: generateSwimlaneCardGroup(4),
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:2",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:3",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:4",
      },
    },
  ],
};

describe("Non implemented cards - SwimlaneCardGroup", () => {
  describe("when the user opens a view with 4 swimlanes and the middle ones only have non-implemented cards", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(firstSwimlane.element);
      await browser.tickFakeClock();
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1475]_should_not_draw_the_second_and_third_swimlane`);
    });

    it("[PRPI-1475]_should_not_draw_the_second_and_third_swimlane", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1475]_should_not_draw_the_second_and_third_swimlane`),
      ).toBe(0);
    });
  });
});
