const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");
const { ScrollableSwimlanePO, GenericPagePO } = require("../../../../page-objects");
const QuickLinksCardPO = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.web.po");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getHomeViewUrl } = require("../../../../../utils/routes");

const MODULE_NAME = "swimlanes";
const mockService = new MockService();
const genericPagePO = new GenericPagePO();
const firstScrollableSwimlanePO = new ScrollableSwimlanePO(genericPagePO.scrollableSwimlanes[0]);
const secondScrollableSwimlanePO = new ScrollableSwimlanePO(genericPagePO.scrollableSwimlanes[1]);

const generateQuicklinksCard = (id, key) => ({
  __typename: "QuickLinksCard",
  urn: `ppb:tbd:card:quickLinks:${id}-${key}`,
  links: [
    {
      label: `Random Link ${key}`,
      viewLink: {
        viewUrn: `ppb:tbd:view:market:924.${key}`,
        viewUrl: `market/924.${key}`,
      },
    },
  ],
});

const generateSwimlaneCardGroup = (id, numberOfItems) => ({
  __typename: "SwimlaneCardGroup",
  urn: `ppb:tbd:cardgroup:swimlane:${id}`,
  cardGroupTitle: `Swimlane ${id}`,
  full: {
    edges: [...Array(numberOfItems).keys()].map((key) => ({
      node: generateQuicklinksCard(id, key),
    })),
  },
  partials: {
    edges: [...Array(numberOfItems).keys()].map((key) => ({
      node: {
        __typename: "QuickLinksCard",
        urn: `ppb:tbd:card:quickLinks:${id}-${key}`,
      },
    })),
  },
});

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: generateSwimlaneCardGroup(1, 1),
    },
    {
      node: generateSwimlaneCardGroup(2, 15),
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
  ],
};

describe("Swimlanes", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK, { withBottomBar: false }));
    await mockService.mockHttpRequest(getSSCHeaderCSS());
    await mockService.mockHttpRequest(getSSCv1Content());
    await mockService.mockFonts(getMockFonts());
    await browser.url(getHomeViewUrl());
  });

  describe("when BFF returns two simwlanes, one with 1 item and another with 15", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstScrollableSwimlanePO.element);
      await browser.waitUntilDisplayed(secondScrollableSwimlanePO.element);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1579]_should_only_display_dots_on_the_second_swimlane`);
    });

    it("[PRPI-1579]_should_only_display_dots_on_the_second_swimlane", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1579]_should_only_display_dots_on_the_second_swimlane`),
      ).toBe(0);
    });
  });

  describe("and a quicklink in the second swimlane is hovered", () => {
    beforeAll(async () => {
      const fistQuickLinkCardPO = new QuickLinksCardPO(secondScrollableSwimlanePO.scrollItems[0]);

      await fistQuickLinkCardPO.element.moveTo();
      await browser.waitUntilDisplayed(secondScrollableSwimlanePO.arrowRight);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1580]_should_also_display_right_arrow`);
    });

    it("[PRPI-1580]_should_also_display_right_arrow", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1580]_should_also_display_right_arrow`)).toBe(0);
    });
  });

  describe("and the right arrow is clicked", () => {
    beforeAll(async () => {
      await secondScrollableSwimlanePO.arrowRight.waitForClickable();
      await secondScrollableSwimlanePO.arrowRight.click();
      await browser.waitUntilDisplayed(secondScrollableSwimlanePO.arrowLeft);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1581]_should_display_both_arrows`);
    });

    it("[PRPI-1581]_should_display_both_arrows", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1581]_should_display_both_arrows`)).toBe(0);
    });
  });

  describe("and the swimlane is at the last element", () => {
    beforeAll(async () => {
      const quickLinksLength = await secondScrollableSwimlanePO.scrollItems.length;
      const lastQuickLinkCardPO = new QuickLinksCardPO(secondScrollableSwimlanePO.scrollItems[quickLinksLength - 1]);
      await lastQuickLinkCardPO.element.scrollIntoView();

      await browser.waitUntilNotDisplayed(secondScrollableSwimlanePO.arrowRight);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1582]_should_display_only_left_arrow`);
    });

    it("[PRPI-1582]_should_display_only_left_arrow", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1582]_should_display_only_left_arrow`)).toBe(0);
    });
  });
});
