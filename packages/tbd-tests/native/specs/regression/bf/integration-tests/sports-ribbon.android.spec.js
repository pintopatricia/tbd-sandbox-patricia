const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { swipeLeftElement } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const {
  GenericScreenSO,
  HeaderSO,
  IconButtonSO,
  SportRibbonCardGroupSO,
  ScrollableSwimlaneSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const headerSO = new HeaderSO();
const sportRibbonCardGroupSO = new SportRibbonCardGroupSO();
const scrollableSwimlaneSO = new ScrollableSwimlaneSO();

const firstSportsRibbonCard = new IconButtonSO(sportRibbonCardGroupSO.iconButtons[0]);
const thirdSportsRibbonCard = new IconButtonSO(sportRibbonCardGroupSO.iconButtons[2]);
const fourthSportsRibbonCard = new IconButtonSO(sportRibbonCardGroupSO.iconButtons[3]);
const lastSportsRibbonCard = new IconButtonSO(sportRibbonCardGroupSO.iconButtons[4]);

const BFF_MOCK_HORSE_RACING = {
  urn: `ppb:tbd:view:sport:7`,
  edges: [
    {
      node: {
        __typename: "SportRibbonCardGroup",
        urn: "ppb:tbd:cardgroup:sportRibbon:YJlMQREAAHJJY7xU/cv/home",
        full: {
          edges: [
            {
              node: {
                __typename: "GenericViewLinkCard",
                urn: "ppb:tbd:card:genericViewLink:cHBiOnRiZDp2aWV3OmdlbmVyaWM6aW5wbGF5",
                viewLink: {
                  viewUrn: "ppb:tbd:view:generic:inplay",
                  viewUrl: "view/d-inplay",
                },
                badge: "INPLAY",
                genericViewLinkTitle: {
                  __typename: "DisplayNameTitle",
                  name: "In-Play Now",
                },
                sportIcon: null,
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:3",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:3",
                  viewUrl: "golf/s-3",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:3",
                  name: "Golf",
                  shortName: null,
                  sportId: 3,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:7",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:7",
                  viewUrl: "horse-racing/s-7",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:7",
                  name: "Horse Racing",
                  shortName: null,
                  sportId: 7,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:2",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:2",
                  viewUrl: "tennis/s-2",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:2",
                  name: "Tennis",
                  shortName: "Tênis SuperCotações",
                  sportId: 2,
                },
              },
            },
            {
              label: "NEW",
              node: {
                __typename: "GenericViewLinkCard",
                urn: "ppb:tbd:card:genericViewLink:external",
                genericViewLinkTitle: {
                  __typename: "DisplayNameTitle",
                  name: "SuperSpins",
                },
                viewLink: {
                  viewUrl: "https://www.google.com",
                  viewUrn: "ppb:tbd:view:external:external",
                },
                badge: null,
                icon: {
                  id: "icon-id",
                  category: "icon-category",
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:1",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:1",
                  viewUrl: "football/s-1",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:1",
                  name: "Football",
                  shortName: "All Football",
                  sportId: 1,
                },
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SportRibbonCardGroup",
        urn: "ppb:tbd:cardgroup:sportRibbon:YJlMQREAAHJJY7xU/cv/home",
      },
    },
  ],
};

const BFF_MOCK_FOOTBALL = {
  urn: `ppb:tbd:view:sport:1`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "Football",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventViewLinkCard",
                urn: "ppb:tbd:card:eventViewLink:29359890",
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

describe("Sports Ribbon", () => {
  describe("When the user enters horse racing page with Sports Ribbon Swimlane", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK_HORSE_RACING));
      const url = "horse-racing/s-7";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(genericScreenSO.element);
    });

    it("[PRPI-3239] The first sports ribbon card should have icon and title", async () => {
      expect(await firstSportsRibbonCard.text.getText()).toEqual("IN-PLAY NOW");
      expect(await firstSportsRibbonCard.iconWrapper.isDisplayed()).toBe(true);
    });

    it("[PRPI-3240] The fourth sports ribbon card should have icon and title with short name", async () => {
      expect(await fourthSportsRibbonCard.iconWrapper.isDisplayed()).toBe(true);
      expect(await fourthSportsRibbonCard.text.getText()).toEqual("TÊNIS SUPERCOTAÇÕES");
    });

    describe("When the user swipes to reveal the last sports ribbon card", () => {
      beforeAll(async () => {
        await swipeLeftElement(thirdSportsRibbonCard.element);
        await browser.waitUntilDisplayed(lastSportsRibbonCard.element);
      });

      it("[PRPI-3241] The last Sports Ribbon card should be displayed", async () => {
        expect(await lastSportsRibbonCard.element.isDisplayed()).toBe(true);
      });

      describe("When the user taps on the last Sports Ribbon card", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK_FOOTBALL));
          await lastSportsRibbonCard.element.click();
          await browser.waitUntilDisplayed(headerSO.backButton);
        });

        it("[PRPI-3242] The user should arrive at the correct sports view", async () => {
          await browser.waitUntilEquals(scrollableSwimlaneSO.title, "Football");
        });
      });
    });
  });
});
