const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const { HighlightedLinkCardSO, BottomBarSO, ScrollableSwimlaneSO } = require("../../../../screen-objects");

const mockService = new MockService();
const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
const highlightedLinkCardSO = new HighlightedLinkCardSO();
const allHighlightedLinkCards = scrollableSwimlaneSO.highlightedLinkCards;
const firstHighlightedLinkSO = new HighlightedLinkCardSO(allHighlightedLinkCards[0]);
const secondHighlightedLinkSO = new HighlightedLinkCardSO(allHighlightedLinkCards[1]);

const BFF_GAMING_HIGHLIGHTED_LINKS_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:gamingCategoryLinks:categoryLinksZoneCode",
        cardGroupTitle: "Casino Categories",
        full: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:1",
                __typename: "GamingLinkCard",
                link: {
                  label: "New Slots",
                  viewLink: {
                    viewUrn: "ppb:tbd:card:gamingCategory:slots",
                    viewUrl: "",
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:2",
                __typename: "GamingLinkCard",
                link: {
                  label: "Live Table Game",
                  viewLink: {},
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:1",
                __typename: "GamingLinkCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:2",
                __typename: "GamingLinkCard",
              },
            },
          ],
        },
      },
    },
  ],
};

describe("Category Links Swimlane", () => {
  describe("When user lands on gaming view with a category links swimlane", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_HIGHLIGHTED_LINKS_MOCK));
      await startApp("home");
      await browser.waitUntilClickableNative(BottomBarSO.gaming);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(scrollableSwimlaneSO.title);
      await browser.waitUntilEquals(scrollableSwimlaneSO.title, "Casino Categories");
    });

    it("[PRPI-2748] And user should see a swimlane with title: Casino Categories", async () => {
      expect(await scrollableSwimlaneSO.title.getText()).toBe("Casino Categories");
    });

    it("[PRPI-2749] And two HighlightedLinkCards should be present in a swimlane", async () => {
      expect(await allHighlightedLinkCards.length).toBe(2);
      expect(await firstHighlightedLinkSO.element.isDisplayed()).toBe(true);
      expect(await secondHighlightedLinkSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2750] And the card should have an icon", async () => {
      expect(await highlightedLinkCardSO.highlightedLinkCardIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-2751] And the card should have an arrow icon", async () => {
      expect(await highlightedLinkCardSO.highlightedLinkCardArrowIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-2752] And the first card should have New Slots label", async () => {
      expect(await highlightedLinkCardSO.highlightedLinkCardMarketName.getText()).toBe("New Slots");
    });

    it("[PRPI-2753] And the second card should have Live Table Game label", async () => {
      expect(await secondHighlightedLinkSO.highlightedLinkCardMarketName.getText()).toBe("Live Table Game");
    });
  });
});
