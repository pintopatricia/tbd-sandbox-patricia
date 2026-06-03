const {
  getSportsLayout,
  getCardResults,
  getGenericLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  PageHeaderSO,
  ScrollableSwimlaneSO,
  GenericScreenSO,
  SportPageScreenSO,
} = require("../../../../screen-objects");
const { swipe, swipeLeft } = require("../../../../helpers/gestures");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
const genericScreenSO = new GenericScreenSO();
const pageHeaderSO = new PageHeaderSO();
const sportSO = new SportPageScreenSO();

const mockService = new MockService();
const firstEventCard = sportSO.secondaryEventCards[0];
const secondEventCard = sportSO.secondaryEventCards[1];

const EVENT_TYPE_ID = 1;

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "UEFA Champions League",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventViewLinkCard",
                urn: "ppb:tbd:card:eventViewLink:29359890",
              },
            },
            {
              node: {
                __typename: "EventViewLinkCard",
                urn: "ppb:tbd:card:eventViewLink:29359891",
              },
            },
            {
              node: {
                __typename: "EventViewLinkCard",
                urn: "ppb:tbd:card:eventViewLink:29359894",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:eventViewLink:29359890",
                viewLink: {
                  viewUrn: "ppb:tbd:view:event:29359890",
                },
                __typename: "EventViewLinkCard",
                sportevent: {
                  urn: "ppb:event:29359890",
                  name: "Wolves v Man Utd",
                  sport: {
                    urn: "ppb:eventType:29359890",
                  },
                },
                eventViewLinkFixture: {
                  urn: "ppb:fixture:29359890",
                  scheduledAt: "2020-01-31T12:30Z",
                  startedAt: "2020-01-31T12:30Z",
                  home: { name: "Wolves" },
                  away: { name: "Man Utd" },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:eventViewLink:29359891",
                __typename: "EventViewLinkCard",
                sportevent: {
                  urn: "ppb:event:29359891",
                  name: "Wolves1 v Man Utd1",
                  sport: {
                    urn: "ppb:eventType:29359891",
                  },
                },
                eventViewLinkFixture: {
                  urn: "ppb:fixture:29359891",
                  scheduledAt: "2020-02-01T12:31Z",
                  startedAt: "2020-02-01T12:31Z",
                  home: { name: "Wolves1" },
                  away: { name: "Man Utd1" },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:eventViewLink:29359894",
                __typename: "EventViewLinkCard",
                sportevent: {
                  urn: "ppb:event:29359894",
                  name: "Benfica v Porto",
                  sport: {
                    urn: "ppb:eventType:29359894",
                  },
                },
                eventViewLinkFixture: {
                  urn: "ppb:fixture:29359894",
                  scheduledAt: "2020-02-04T12:34",
                  startedAt: "2020-02-04T12:34",
                  home: { name: "Benfica" },
                  away: { name: "Porto" },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "More Football",
          viewLink: { viewUrn: "ppb:tbd:view:allCompetitions:1", viewUrl: "soccer/allCompetitions:1" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const BFF_CARDS_MOCK = {
  cards: [
    {
      urn: "ppb:tbd:card:eventViewLink:29359894",
      __typename: "EventViewLinkCard",
      sportevent: {
        urn: "ppb:event:29359894",
        name: "Benfica v Porto",
        sport: {
          urn: "ppb:eventType:29359894",
        },
      },
      eventViewLinkFixture: {
        urn: "ppb:fixture:29359894",
        scheduledAt: "2020-02-04T12:34Z",
        startedAt: "2020-02-04T12:34Z",
        home: { name: "Benfica" },
        away: { name: "Porto" },
      },
    },
    {
      urn: "ppb:tbd:card:eventViewLink:29359895",
      __typename: "EventViewLinkCard",
      sportevent: {
        urn: "ppb:event:29359895",
        name: "Wolves5 v Man Utd5",
        sport: {
          urn: "ppb:eventType:29359895",
        },
      },
      eventViewLinkFixture: {
        urn: "ppb:fixture:29359895",
        scheduledAt: "2020-02-05T12:35Z",
        startedAt: "2020-02-05T12:35Z",
        home: { name: "Wolves5" },
        away: { name: "Man Utd5" },
      },
    },
  ],
};

const ALL_COMPETITIONS_MOCK = {
  title: "All Competitions",
  url: "soccer/allCompetitions:1",
  urn: "ppb:tbd:view:allCompetitions:1",
  __typename: "AllCompetitionsView",
  pageInfo: null,
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:competitions:12018068|11633637|803237",
        quickLinksTitle: null,
        links: [
          {
            label: "Liga NOS",
            viewLink: {
              viewUrn: "ppb:tbd:view:competition:1234",
              viewUrl: "soccer/liga-nos/c-1234",
            },
            target: null,
            icon: null,
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:competitions:12018068|11633637|803237",
      },
    },
  ],
};

describe("Component - Scrollable Swimlane Normal Football", () => {
  describe("When the user is on a NORMAL scrollablewimlanes with 6 elements", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));
      const url = "football/s-1";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilEquals(scrollableSwimlaneSO.title, "UEFA Champions League");
      swipeLeft(0.5);
    });

    it("[PRPI-4227] The swimlane should load 3 elements and all elements should be loaded", async () => {
      expect(await scrollableSwimlaneSO.title.getText()).toBe("UEFA Champions League");
      expect(await sportSO.secondaryEventCards.length).toBe(3);
    });

    it("[PRPI-4228] The swimlane should display all the 1st element with a part of the 2nd element", async () => {
      expect(await firstEventCard.isDisplayed()).toBe(true);
      expect(await secondEventCard.isDisplayed()).toBe(true);
    });

    describe("And the swimlane has a ViewAll button with 'More Football' link", () => {
      it("[PRPI-4229] The viewAll button should be displayed", async () => {
        expect(await scrollableSwimlaneSO.viewAllButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-4230] The viewAll button label should be 'More Football'", async () => {
        expect(await scrollableSwimlaneSO.viewAllButtonText.getText()).toBe("More Football");
      });
    });

    describe("When the user swipe till the last element", () => {
      beforeAll(async () => {
        // It will be refactored along with utils/gestures.
        swipe({ x: 375, y: 200 }, { x: 0, y: 200 });
        await browser.waitUntilDisplayed(sportSO.secondaryEventCards[2]);
      });
      it("[PRPI-4231] The swimlane should display the last element loaded", async () => {
        expect(await sportSO.secondaryEventCards.length).toBe(3);
        expect(await sportSO.secondaryEventCards[2].isDisplayed()).toBe(true);
        expect(await sportSO.homeName[2].getText()).toEqual("Benfica");
        expect(await sportSO.awayName[2].getText()).toEqual("Porto");
      });
    });

    describe("When user clicks on 'More Football' button", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(ALL_COMPETITIONS_MOCK));
        await browser.waitUntilDisplayed(scrollableSwimlaneSO.viewAllButton);
        await scrollableSwimlaneSO.viewAllButton.click();
        await browser.waitUntilEquals(pageHeaderSO.pageHeaderTitle, "All Competitions");
      });

      it("[PRPI-4232] The title 'All Competitions' should be displayed", async () => {
        expect(await pageHeaderSO.pageHeaderTitle.getText()).toBe("All Competitions");
      });
    });
  });
});
