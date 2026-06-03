const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const GenericViewSO = require("@ppb/tbd-shared/components/GenericView/GenericView.so");
const { QuickLinkSO } = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const mockService = new MockService();
const MODULE_NAME = "non_implemented_cards";
const EVENT_TYPE_ID = 1;
const firstQuicklink = new QuickLinkSO();

const genericViewSO = new GenericViewSO();

const generateQuicklinksCard = (id, typename) => ({
  __typename: typename,
  urn: `ppb:tbd:card:quickLinks:${id}`,
  links: [
    {
      label: `Random Link ${id}`,
      viewLink: {
        viewUrn: `ppb:tbd:view:market:924.${id}`,
        viewUrl: `market/924.${id}`,
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
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));

      const HOME_VIEW_LINK = getStartViewLink(`sport/s-${EVENT_TYPE_ID}`);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilEquals(firstQuicklink.label, "Random Link 10");
      // ensure the not-implemented cardGroups are cleaned and the number of swimlanes is 2
      await browser.waitUntil(async () => (await genericViewSO.scrollableSwimlanes.length) === 2);
    });

    it("[PRPI-4503]_should_not_draw_the_second_and_third_swimlane", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4503]_should_not_draw_the_second_and_third_swimlane`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
});
