const { SportPagePO } = require("../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const PebbleCardGroupPO = require("@ppb/tbd-shared/components/PebbleCardGroup/PebbleCardGroup.po");
const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const mockService = new MockService();
const MODULE_NAME = "non_implemented_cards";
const sportPagePO = new SportPagePO();
const firstPebbleCardGroup = new PebbleCardGroupPO(sportPagePO.pebbleCardGroups[0]);
const EVENT_TYPE_ID = 1;

const generateQuicklinksCard = (id, cardsTypename) => ({
  __typename: cardsTypename,
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
  urn: "ppb:tbd:view:event:1",
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
  describe("when the user opens a view with 4 PebbleCardGroups and the middle ones only have non-implemented cards", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn, { disableCSSAnimations: true }));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(firstPebbleCardGroup.element);
      await browser.tickFakeClock();
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1474]_should_not_draw_the_second_and_third_pebblecardgroup`,
      );
    });

    it("[PRPI-1474]_should_not_draw_the_second_and_third_pebblecardgroup", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1474]_should_not_draw_the_second_and_third_pebblecardgroup`),
      ).toBe(0);
    });
  });
});
