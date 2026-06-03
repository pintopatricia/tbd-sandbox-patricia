const { TEST_ID: QUICKLINKS } = require("@ppb/the-wall-web/components/walls/QuickLink/QuickLink.selectors");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const CompetitionRegionCardPO = require("@ppb/tbd-shared/components/CompetitionRegionCard/CompetitionRegionCard.po");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");

const { QuickLinkPO, CardPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const routes = require("../../../../../../utils/routes");
const MockService = require("../../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const competitionRegionCardPO = new CompetitionRegionCardPO();
const firstCollapse = new CardPO(competitionRegionCardPO.collapsibleCards[1]);
const secondCollapse = new CardPO(competitionRegionCardPO.collapsibleCards[2]);
const thirdCollapse = new CardPO(competitionRegionCardPO.collapsibleCards[3]);
const fourthCollapse = new CardPO(competitionRegionCardPO.collapsibleCards[4]);
const secondCollapseFirstQuicklink = new QuickLinkPO(secondCollapse.element.$$(QUICKLINKS)[0]);
const EVENT_ID = "29682729";
const FOOTBALL_EVENT_TYPE_ID = 1;

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
              flag: { vector: "http://mock.betfair.com/mockedImage.svg" },
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
              flag: { vector: "http://mock.betfair.com/mockedImage.svg" },
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
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.svg", imageType: "svg" }));
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(competitionRegionCardPO.element);
  });

  it("[PRPI-5701] - The competition link card should display 4 countries", async () => {
    // expected 5 is due to 4 country Card + 1 Card from the wrapper
    expect(await competitionRegionCardPO.collapsibleCards.length).toEqual(5);
  });

  it("[PRPI-5702] - The first country should be Angola", async () => {
    expect(await firstCollapse.header.getText()).toBe("Angola");
  });

  it("[PRPI-5703] - The second country should be Argentina", async () => {
    expect(await secondCollapse.header.getText()).toBe("Argentina");
  });

  it("[PRPI-5704] - The second country should be collapsed", async () => {
    expect(await secondCollapse.content.isDisplayed()).toBe(false);
  });

  it("[PRPI-5705] - The third country should be Japan", async () => {
    expect(await thirdCollapse.header.getText()).toBe("Japan");
  });

  it("[PRPI-5706] - The fourth country should be Zambia", async () => {
    expect(await fourthCollapse.header.getText()).toBe("Zambia");
  });

  describe("When the user clicks on Argentina's card", () => {
    beforeAll(async () => {
      await secondCollapse.header.click();
      await browser.waitUntilDisplayed(secondCollapse.content);
    });

    it("[PRPI-5707] - The card should display 2 competition's quicklinks", async () => {
      expect(await secondCollapse.element.$$(QUICKLINKS).length).toBe(2);
    });

    it("[PRPI-5708] - The first quicklink should have a competition name", async () => {
      expect(await secondCollapseFirstQuicklink.title.getText()).toBe("Argentina League 1");
    });

    it("[PRPI-5709] - The first quicklink should have an arrow", async () => {
      expect(await secondCollapseFirstQuicklink.arrow.isDisplayed()).toBe(true);
    });
  });

  describe("When the user clicks again on Argentina's card", () => {
    beforeAll(async () => {
      await secondCollapse.header.click();
    });

    it("[PRPI-5710] - The card should be collapsed", async () => {
      expect(await secondCollapse.content.isDisplayed()).toBe(false);
    });

    it("[PRPI-5711] - The card should not display competitions inside", async () => {
      expect(await secondCollapse.element.$$(QUICKLINKS).length).toBe(0);
    });
  });
});
