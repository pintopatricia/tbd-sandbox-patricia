const { CompetitionPagePO, CircularImagePO, ScrollableSwimlanePO, LinkPO } = require("../../../../../page-objects");

const { getCompetitionsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const competitionPagePO = new CompetitionPagePO();
const outrightsSwimlanePO = new ScrollableSwimlanePO(competitionPagePO.scrollableSwimlanes[0]);
const secondSwimplane = new ScrollableSwimlanePO(competitionPagePO.scrollableSwimlanes[1]);
const topCompetitionsSwimlanePO = new ScrollableSwimlanePO(competitionPagePO.scrollableSwimlanes[2]);
const linkPO = new LinkPO(competitionPagePO.quicklinkLinks.element);
const circularImagePO = new CircularImagePO();
const mockService = new MockService();

const COMPETITION_SWITCHER_CARD = {
  __typename: "GenericSwitcherCard",
  urn: "ppb:tbd:card:genericswitcher:competition:10932509",
  filterTitle: {
    translated: null,
    translate: {
      key: "I18N.SWITCHER.COMPETITION.TITLE",
    },
  },
  selectedViewLink: {
    label: "Belarusian Premier League",
    viewLink: {
      viewUrn: "ppb:tbd:view:competition:12345",
      viewUrl: "football/belarusian-premier-league/c-12345",
    },
  },
};

const BFF_MOCK = {
  __typename: "CompetitionView",
  urn: "ppb:tbd:view:competition:12345",
  url: routes.getCompetitionViewUrl("12345"),
  competition: {
    urn: "ppb:competition:12345",
    competitionId: 12345,
    name: "Belarusian Premier League",
    sport: {
      urn: "ppb:sport:1",
      name: "sportName",
    },
  },
  edges: [
    {
      node: COMPETITION_SWITCHER_CARD,
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topOutrightMarketsByCompetition:12345",
        cardGroupTitle: "Outright Markets",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:924.229079084",
                market: {
                  __typename: "SportsbookMarket",
                  name: "Winner 19/20",
                  urn: "ppb:sbkMarket:924.229079084",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:12345`,
                    },
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:924.229079084",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:12345",
        cardGroupTitle: "Upcoming Matches",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29791283",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29791283",
                  viewUrl: routes.getEventViewUrl("29791283"),
                },
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170386754",
                      name: "Belarusian Premier League",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29791283",
                          name: "Dinamo Brest v Bate Borisov",
                        },
                        competition: {
                          urn: "ppb:competition:12345",
                          name: "Belarusian Premier League",
                          competitionId: 12345,
                          sport: {
                            urn: "ppb:sport:1",
                            name: "sportName",
                          },
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170386754/2482528/0",
                          name: "Dinamo Brest",
                          selectionId: 2482528,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170386754/46949/0",
                          name: "BATE Borisov",
                          selectionId: 46949,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170386754/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170386754/2482528/0" },
                      { runnerURN: "ppb:excRunner:1.170386754/46949/0" },
                      { runnerURN: "ppb:excRunner:1.170386754/58805/0" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29791283",
                  home: {
                    name: "Dinamo Brest",
                  },
                  away: {
                    name: "BATE Borisov",
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29807939",
                viewLink: {
                  viewUrn: "ppb:tbd:view:event:29807939",
                  viewUrl: routes.getEventViewUrl("29807939"),
                },
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170472231",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29807939",
                          name: "Neman Grodno v Torpedo BelAZ",
                        },
                        competition: {
                          urn: "ppb:competition:12345",
                          competitionId: 12345,
                          name: "Belarusian Premier League",
                          sport: {
                            urn: "ppb:sport:1",
                            name: "sportName",
                          },
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170472231/489079/0",
                          name: "Neman Grodno",
                          selectionId: 489079,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170472231/5606609/0",
                          name: "Torpedo BelAZ",
                          selectionId: 5606609,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170472231/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170472231/489079/0" },
                      { runnerURN: "ppb:excRunner:1.170472231/5606609/0" },
                      { runnerURN: "ppb:excRunner:1.170472231/58805/0" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29807939",
                  home: {
                    name: "Neman Grodno",
                  },
                  away: {
                    name: "Torpedo BelAZ",
                  },
                  scheduledAt: "2020-05-21T16:00:00Z",
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29791283",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29807939",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topCompetitionsInSport:1",
        cardGroupTitle: "Top Competitions",
        full: {
          edges: [
            {
              node: {
                __typename: "CompetitionViewLinkCard",
                urn: "ppb:tbd:card:competitionViewLink:59",
                viewLink: {
                  viewUrl: routes.getCompetitionViewUrl("59"),
                  viewUrn: "ppb:tbd:view:competition:59",
                },
                competition: {
                  competitionId: 59,
                  urn: "ppb:competition:59",
                  name: "German Bundesliga",
                  sport: {
                    urn: "ppb:sport:1",
                    name: "sportName",
                  },
                  logo: {
                    large: "http://example.test.com/mockedImage/image.png",
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "CompetitionViewLinkCard",
                urn: "ppb:tbd:card:competitionViewLink:59",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allCompetitions:1",
        quickLinksTitle: "All Competitions",
        links: [
          {
            label: "View All Competitions",
            target: "_self",
            icon: null,
            viewLink: {
              viewUrl: routes.getAllCompetitionsViewUrl("1"),
              viewUrn: "ppb:tbd:view:allCompetitions:1",
            },
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:competition:10932509",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topOutrightMarketsByCompetition:12345",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:12345",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topCompetitionsInSport:1",
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allCompetitions:1",
      },
    },
  ],
};

const BFF_CARDS_MOCK = { cards: [COMPETITION_SWITCHER_CARD] };

describe("When the user is on the Competition view", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getCompetitionsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));
    await mockService.mockHttpRequest(getScaResponse({}));
    await browser.url(routes.getCompetitionViewUrl(12345));
    await browser.waitUntilDisplayed(competitionPagePO.eventMarketCards[1]);
  });

  it("[PRPI-5691] The events related to this competition should be displayed", async () => {
    expect(await competitionPagePO.eventMarketCards.length).toBe(2);
  });

  it("[PRPI-5692] And the title with the name of the competition should be displayed", async () => {
    expect(await competitionPagePO.switcherContent.getText()).toBe("Belarusian Premier League");
  });

  it("[PRPI-5693] And the swimlane with the upcoming matches should be displayed", async () => {
    expect(await competitionPagePO.eventMarketCards[0].isDisplayed()).toBe(true);
    expect(await secondSwimplane.title.getText()).toBe("Upcoming Matches");
  });

  it("[PRPI-5694] And the swimlane with the outrights market should be displayed", async () => {
    expect(await outrightsSwimlanePO.element.isDisplayed()).toBe(true);
    expect(await outrightsSwimlanePO.title.getText()).toBe("Outright Markets");
  });

  it("[PRPI-5695] And the All competitions title and link should be displayed", async () => {
    const url = await linkPO.element.getAttribute("href");

    expect(url.endsWith("/ac-1")).toBe(true, `${url} does not end in All Competitions Page`);
    expect(await competitionPagePO.quicklinkTitle.getText()).toBe("All Competitions");
    expect(await linkPO.element.getText()).toBe("View All Competitions");
  });

  it("[PRPI-5696] The competitions swimlane should be displayed", async () => {
    expect(await topCompetitionsSwimlanePO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-5697] And the title 'Top Competitions' should be displayed", async () => {
    expect(await topCompetitionsSwimlanePO.title.getText()).toBe("Top Competitions");
  });

  it("[PRPI-5698] And the competition items composed by an image and a link name below should be displayed", async () => {
    expect(await topCompetitionsSwimlanePO.element.isDisplayed()).toBe(true);
    expect(await circularImagePO.image.isDisplayed()).toBe(true);
    expect(await circularImagePO.text.getText()).toBe("German Bundesliga");
  });

  it("[PRPI-5699] The related competition view should be displayed on the top competition", async () => {
    const url = await competitionPagePO.competitionViewLinks[0].getAttribute("href");

    expect(url).toContain(routes.getCompetitionViewUrl("59"));
  });

  it("[PRPI-5700] The related event view should be displayed", async () => {
    expect(await competitionPagePO.eventLinks[0].getAttribute("href")).toContain(routes.getEventViewUrl("29791283"));
  });
});
