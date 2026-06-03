const SportRibbonCardGroupPO = require("@ppb/tbd-shared/components/SportRibbonCardGroup/SportRibbonCardGroup.po");
const { getGenericLayout, getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { IconButtonPO, ScrollableSwimlanePO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const sportRibbonCardGroupPO = new SportRibbonCardGroupPO();

const firstSportsRibbonCardPO = new IconButtonPO(sportRibbonCardGroupPO.items[0]);
const lastSportsRibbonCardPO = new IconButtonPO(sportRibbonCardGroupPO.items[8]);

const scrollableSwimlanePO = new ScrollableSwimlanePO();

const EVENT_TYPE_ID = 7;
const EVENT_ID = "29359895";

const BOTTOM_BAR_PROPERTY = {
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        viewUrn: "ppb:tbd:view:generic:home",
        viewUrl: "",
      },
    },
    {
      tileType: "BROWSE",
      viewLink: {
        viewUrn: "ppb:tbd:view:browse:sports",
        viewUrl: "browse/browse:sports",
      },
    },
    {
      tileType: "MY_BETS",
      viewLink: {
        viewUrn: "ppb:tbd:view:myBets:open",
        viewUrl: "mybets/myBets-open",
      },
    },
    {
      tileType: "GAMING",
      viewLink: {
        viewUrn: "ppb:tbd:view:gaming:1",
        viewUrl: "casino/gm-1",
      },
    },
  ],
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: BOTTOM_BAR_PROPERTY,
  edges: [
    {
      node: {
        __typename: "SportRibbonCardGroup",
        urn: "ppb:tbd:cardgroup:sportRibbon:123",
        full: {
          edges: [
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:1",
                viewLink: {
                  viewUrl: "football/sport:1",
                  viewUrn: "ppb:tbd:view:sport:1",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:1",
                  name: "Football",
                  sportId: 1,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:12",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:12",
                  viewUrl: "football/sport:12",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:12",
                  name: "Rowing",
                  sportId: 12,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:11",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:11",
                  viewUrl: "football/sport:11",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:11",
                  name: "Cycling",
                  sportId: 11,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:7511",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:7511",
                  viewUrl: "football/s-7511",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:7511",
                  name: "Baseball",
                  sportId: 7511,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:2",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:2",
                  viewUrl: "football/s-2",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:2",
                  name: "Tennis",
                  sportId: 2,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:4",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:4",
                  viewUrl: "football/s-4",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:4",
                  name: "Cricket",
                  sportId: 4,
                },
              },
            },
            {
              label: null,
              node: {
                __typename: "GenericViewLinkCard",
                urn: "ppb:tbd:card:genericViewLink:2",
                genericViewLinkTitle: {
                  __typename: "DisplayNameTitle",
                  name: "Inplay",
                },
                viewLink: {
                  viewUrl: "/inplay/d-inplay",
                  viewUrn: "ppb:tbd:view:generic:inplay",
                },
                badge: "Inplay",
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
                urn: "ppb:tbd:card:sportViewLink:7",
                viewLink: {
                  viewUrl: "horse-racing/s-7",
                  viewUrn: "ppb:tbd:view:sport:7",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:7",
                  name: "Horse Racing",
                  shortName: "Racing",
                  sportId: 7,
                },
              },
            },
          ],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:1",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:12",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:11",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:7511",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:2",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:4",
              },
            },
            {
              node: {
                __typename: "GenericViewLinkCard",
                urn: "ppb:tbd:card:genericViewLink:2",
              },
            },
            {
              node: {
                __typename: "GenericViewLinkCard",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:7",
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
        urn: "ppb:tbd:cardgroup:sportRibbon:123",
      },
    },
  ],

  sections: [
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
  ],
};

const BFF_SPORTS_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "Horse Racing",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                title: "Man Utd vs Wolves",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

describe("Sports Ribbon", () => {
  describe("When the user enters homepage with Sports Ribbon Swimlane", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await browser.url(routes.getGenericViewUrl("home"));
      await browser.waitUntilDisplayed(sportRibbonCardGroupPO.element);
    });

    it("[PRPI-4623] The Sports Ribbon swimlane should be displayed", async () => {
      expect(await sportRibbonCardGroupPO.element.isDisplayed()).toBe(true);
      expect(await sportRibbonCardGroupPO.items.length).toBe(9);
    });

    it("[PRPI-7600] The first sports ribbon card should be FOOTBALL", async () => {
      expect(await firstSportsRibbonCardPO.text.getText()).toEqual("FOOTBALL");
      expect(await firstSportsRibbonCardPO.iconContainer.isDisplayed()).toBe(true);
    });

    describe("When the user swipes to reveal the last sports ribbon card", () => {
      beforeAll(async () => {
        await lastSportsRibbonCardPO.element.scrollIntoView({
          block: "center",
        });
        await browser.waitUntilInViewport(lastSportsRibbonCardPO.element);
      });

      it("[PRPI-7601] The last Sports Ribbon card should display the short name - RACING", async () => {
        expect(await lastSportsRibbonCardPO.text.getText()).toEqual("RACING");
        expect(await lastSportsRibbonCardPO.iconContainer.isDisplayed()).toBe(true);
      });

      describe("When the user taps on the last Sports Ribbon card", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getSportsLayout(BFF_SPORTS_MOCK));
          await lastSportsRibbonCardPO.element.waitForClickable();
          await lastSportsRibbonCardPO.element.click();
          await browser.waitUntilEquals(scrollableSwimlanePO.title, "Horse Racing");
        });

        it("[PRPI-7602] The user should arrive at the correct sports view", async () => {
          expect(await browser.getUrl()).toContain("horse-racing/s-7");
        });
      });
    });
  });
});
