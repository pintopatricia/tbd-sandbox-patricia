const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const mockService = new MockService();
const MODULE_NAME = "non_implemented_cards";
const EVENT_TYPE_ID = 1;

const generateQuicklinksCard = (id, cardsTypename) => ({
  __typename: cardsTypename,
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

const generatePebbleCardGroup = (id, cardsTypename = "QuickLinksCard") => ({
  __typename: "PebbleCardGroup",
  urn: `ppb:tbd:cardgroup:pebble:quicklinks/${id}`,
  pebbleCardGroupTitle: { translated: `Pebble ${id}` },
  selectedItemUrn: `ppb:tbd:card:quickLinks:${id}`,
  full: {
    edges: [
      {
        name: `Quick ${id}`,
        node: generateQuicklinksCard(id, cardsTypename),
      },
    ],
  },
  partials: {
    edges: [
      {
        name: `Quick ${id}`,
        node: {
          __typename: cardsTypename,
          urn: `ppb:tbd:card:quickLinks:${id}`,
        },
      },
    ],
  },
});

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  title: "Football",
  edges: [
    {
      node: generatePebbleCardGroup(1),
    },
    {
      node: generatePebbleCardGroup(2, "not-implemented"),
    },
    {
      node: generatePebbleCardGroup(3, "really-not-implemented"),
    },
    {
      node: generatePebbleCardGroup(4),
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:cardgroup:pebble:quicklinks/1",
      },
    },
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:cardgroup:pebble:quicklinks/2",
      },
    },
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:cardgroup:pebble:quicklinks/3",
      },
    },
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:cardgroup:pebble:quicklinks/4",
      },
    },
  ],
};

describe("Non implemented cards - PebbleCardGroup", () => {
  describe("when the user opens a view with 4 pebblecardgroups and the middle ones only have non-implemented cards", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      const HOME_VIEW_LINK = getStartViewLink("football/s-1");
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));
      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4502]_should_not_draw_the_second_and_third_pebblecardgroup`,
      );
    });

    it("[PRPI-4502]_should_not_draw_the_second_and_third_pebblecardgroup", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4502]_should_not_draw_the_second_and_third_pebblecardgroup`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
});
