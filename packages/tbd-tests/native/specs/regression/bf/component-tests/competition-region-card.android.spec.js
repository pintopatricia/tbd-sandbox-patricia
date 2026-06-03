const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const CompetitionRegionCardSO = require("@ppb/tbd-shared/components/CompetitionRegionCard/CompetitionRegionCard.so");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");

const { QUICK_LINK } = require("@ppb/the-wall-native/components/QuickLink/QuickLink.selectors");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const { GenericScreenSO, CardSO, QuickLinkSO } = require("../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();

const competitionRegionCardSO = new CompetitionRegionCardSO();

const firstCollapse = new CardSO(competitionRegionCardSO.collapsibleCards[0]);
const secondCollapse = new CardSO(competitionRegionCardSO.collapsibleCards[1]);
const thirdCollapse = new CardSO(competitionRegionCardSO.collapsibleCards[2]);
const fourthCollapse = new CardSO(competitionRegionCardSO.collapsibleCards[3]);

const firstQuickLink = new QuickLinkSO(competitionRegionCardSO.collapsibleCards[1]);

const EVENT_ID = "29682729";
const FOOTBALL_EVENT_TYPE_ID = 1;

const svgURLMock = `http://${mockService.getMockServerHost()}:${mockService.getMockServerPort()}/mockedImage.svg`;

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${FOOTBALL_EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "CompetitionRegionCard",
        urn: `ppb:tbd:card:competitionRegion:${EVENT_ID}`,
        competitionRegions: [
          {
            country: {
              urn: "ppb:tbd:country:arg",
              code: "ARG",
              flag: { vector: svgURLMock },
            },
            competitionViewLinks: [
              {
                urn: "ppb:tbd:competitionviewlink:1",
                viewLink: {
                  viewUrn: "urn:1",
                  viewUrl: "url:1",
                },
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:1",
                  name: "Argentina League 1",
                  competitionId: 1,
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 1,
                  },
                },
              },
              {
                urn: "ppb:tbd:competitionviewlink:2",
                viewLink: {
                  viewUrn: "urn:2",
                  viewUrl: "url:2",
                },
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:2",
                  name: "Argentina League 2",
                  competitionId: 2,
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 1,
                  },
                },
              },
            ],
          },
          {
            country: {
              urn: "ppb:tbd:country:ago",
              code: "AGO",
              flag: { vector: svgURLMock },
            },
            competitionViewLinks: [
              {
                urn: "ppb:tbd:competitionviewlink:3",
                viewLink: {
                  viewUrn: "urn:3",
                  viewUrl: "url:3",
                },
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:3",
                  name: "Angola League 3",
                  competitionId: 3,
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 1,
                  },
                },
              },
            ],
          },
          {
            country: {
              urn: "ppb:tbd:country:jpn",
              code: "JPN",
            },
            competitionViewLinks: [
              {
                urn: "ppb:tbd:competitionviewlink:4",
                viewLink: {
                  viewUrn: "urn:4",
                  viewUrl: "url:4",
                },
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:4",
                  name: "Japan League 4",
                  competitionId: 4,
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 1,
                  },
                },
              },
            ],
          },
          {
            country: {
              urn: "ppb:tbd:country:zmb",
              code: "ZMB",
            },
            competitionViewLinks: [
              {
                urn: "ppb:tbd:competitionviewlink:5",
                viewLink: {
                  viewUrn: "urn:5",
                  viewUrl: "url:5",
                },
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:5",
                  name: "Zambia League 5",
                  competitionId: 5,
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 1,
                  },
                },
              },
            ],
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "CompetitionRegionCard",
        urn: `ppb:tbd:card:competitionRegion:${EVENT_ID}`,
      },
    },
  ],
};

describe("When the user is on the Football Sports View", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*", imageType: "svg" }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    const url = "soccer/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(competitionRegionCardSO.element);
  });

  it("[PRPI-1903] - The competition link card should display 4 countries", async () => {
    // expected 5 is due to 4 country Card + 1 Card from the wrapper
    expect(await competitionRegionCardSO.collapsibleCards.length).toEqual(5);
  });

  it("[PRPI-1904] - The first country should be Angola", async () => {
    expect(await firstCollapse.title.getText()).toBe("Angola");
  });

  it("[PRPI-1905] - The second country should be Argentina", async () => {
    expect(await secondCollapse.title.getText()).toBe("Argentina");
  });

  it("[PRPI-1906] - The second country should be collapsed", async () => {
    expect(await secondCollapse.contentWrapper.isDisplayed()).toBe(false);
  });

  it("[PRPI-1907] - The third country should be Japan", async () => {
    expect(await thirdCollapse.title.getText()).toBe("Japan");
  });

  it("[PRPI-1908] - The fourth country should be Zambia", async () => {
    expect(await fourthCollapse.title.getText()).toBe("Zambia");
  });

  describe("When the user clicks on Argentina's card", () => {
    beforeAll(async () => {
      await secondCollapse.title.click();
      await browser.waitUntilDisplayed(secondCollapse.contentWrapper);
    });

    it("[PRPI-1909] - The card should display 2 competition's quicklinks", async () => {
      expect(await secondCollapse.contentWrapper.$$(`~${QUICK_LINK}`).length).toBe(2);
    });

    it("[PRPI-1910] - The first quicklink should have a competition name", async () => {
      expect(await firstQuickLink.label.getText()).toBe("Argentina League 1");
    });

    it("[PRPI-1911] - The first quicklink should have an arrow", async () => {
      expect(await firstQuickLink.arrowIcon.isDisplayed()).toBe(true);
    });

    describe("When the user clicks again on Argentina's card", () => {
      beforeAll(async () => {
        await secondCollapse.title.click();
      });

      it("[PRPI-1912] - The card should be collapsed", async () => {
        expect(await secondCollapse.contentWrapper.isDisplayed()).toBe(false);
      });

      it("[PRPI-1913] - The card should not display competitions inside", async () => {
        expect(await firstQuickLink.label.isDisplayed()).toBe(false);
      });
    });
  });
});
