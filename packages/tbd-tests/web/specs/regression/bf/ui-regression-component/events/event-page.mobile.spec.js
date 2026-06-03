const { EventPagePO, AllMarketsPagePO, ScrollableSwimlanePO, CardPO, LinkPO } = require("../../../../../page-objects");
const { getGenericLayout, getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const allMarketsPagePO = new AllMarketsPagePO();
const eventPagePO = new EventPagePO();
const linkPO = new LinkPO(eventPagePO.quicklinkLinks[0]);
const firstMarketsSwimlane = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[0]);
const secondMarketsSwimlane = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[1]);
const thirdMarketsSwimlane = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[2]);
const fourthMarketsSwimlane = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[3]);
const fifthMarketsSwimlane = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[4]);
const sixthMarketsSwimlane = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[5]);

const firstMarketSwimlaneCard = new CardPO(firstMarketsSwimlane.scrollItems[0]);

const mockService = new MockService();

const EVENT_ID = "29359895";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup#29359895",
        cardGroupTitle: "Match Odds Markets",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170259755;924.228826155",
                cardTitle: "Match Odds",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170259755",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
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
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170259755;924.228826155",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:overUnderMarketGroup#29359895",
        cardGroupTitle: "Over/Under Goals Markets",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826435",
                cardTitle: "Over/Under Total Goals 0.5",
                viewLinks: [
                  {
                    viewUrn: "ppb:tbd:view:market:924.228826435",
                    viewUrl:
                      "/football/belarussian-premier-league/belshina-bobruisk-v-gorodeya/over/under-total-goals-05/m-924228826435",
                  },
                ],

                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826435",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826435/5851483",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.228826435/5851483" }],
                  },
                },
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826406",
                cardTitle: "Over/Under Total Goals 1.5",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826406",
                      name: "Over/Under Total Goals 1.5",
                      marketType: "OVER_UNDER_15",
                      liveData: { inplay: false },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:12149617",
                          name: "Belarussian Premier League",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29359895",
                          name: "Belshina Bobruisk v Gorodeya",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826406/1221386",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.228826406/1221386" }],
                  },
                },
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170259767;924.228826520",
                cardTitle: "Over/Under 2.5 Goals",
                viewLinks: [
                  {
                    viewUrn: "ppb:tbd:view:market:1.170259767",
                    viewUrl:
                      "/football/belarussian-premier-league/belshina-bobruisk-v-gorodeya/over/under-25-goals/m-1170259767",
                  },
                  {
                    viewUrn: "ppb:tbd:view:market:924.228826520",
                    viewUrl:
                      "/football/belarussian-premier-league/belshina-bobruisk-v-gorodeya/over/under-25-goals/m-924228826520",
                  },
                ],

                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170259767",
                      liveData: {
                        totalMatched: 32.98716270943271,
                        exchangeMarketStatus: "OPEN",
                        inplay: false,
                      },
                      name: "Over/Under 2.5 Goals",
                      marketType: "OVER_UNDER_25",
                      bettingType: "ODDS",
                      eachWayDivisor: null,
                      numberOfWinners: 1,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:12149617",
                          name: "Belarussian Premier League",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29359895",
                          name: "Belshina Bobruisk v Gorodeya",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170259767/47972/0",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:excRunner:1.170259767/47972/0" }],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826520",
                      name: "Over/Under 2.5 Goals",
                      marketType: "OVER_UNDER_25",
                      liveData: { inplay: false },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:12149617",
                          name: "Belarussian Premier League",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29359895",
                          name: "Belshina Bobruisk v Gorodeya",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826520/47972",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.228826520/47972" }],
                  },
                },
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826531",
                cardTitle: "Over/Under Total Goals 3.5",
                viewLinks: [
                  {
                    viewUrn: "ppb:tbd:view:market:924.228826531",
                    viewUrl:
                      "/football/belarussian-premier-league/belshina-bobruisk-v-gorodeya/over/under-total-goals-35/m-924228826531",
                  },
                ],

                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826531",
                      name: "Over/Under Total Goals 3.5",
                      marketType: "OVER_UNDER_35",
                      liveData: { inplay: false },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:12149617",
                          name: "Belarussian Premier League",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29359895",
                          name: "Belshina Bobruisk v Gorodeya",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826531/1222345",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.228826531/1222345" }],
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
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826435",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826406",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170259767;924.228826520",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826531",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826415",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826309",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826353",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup#29359895",
        cardGroupTitle: "Correct Score",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826420",
                cardTitle: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826420",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826420/1063100",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.228826420/1063100" }],
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
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826420",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup#293598951",
        cardGroupTitle: "Correct Score 2",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826420",
                cardTitle: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826420",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826420/1063100",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.228826420/1063100" }],
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
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826420",
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
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup#29359895",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:overUnderMarketGroup#29359895",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup#29359895",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup#293598951",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:bothTeamsToScoreMarketGroup#29359895",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:halfTimeFullTimeMarketGroup#29359895",
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allMarkets:1",
      },
    },
  ],
};

const BFF_ALL_MARKETS_VIEW_MOCK = {
  urn: `ppb:tbd:view:allMarkets:${EVENT_ID}`,
  title: "All Markets",
  pageInfo: null,
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:markets:xxx",
        links: [],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:markets:xxx",
      },
    },
  ],
};

const CARDS_MOCK = {
  cards: [
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:marketsByEventAndMarketType:bothTeamsToScoreMarketGroup#29359895",
      cardGroupTitle: "Both Teams to Score",
      full: {
        edges: [
          {
            node: {
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.228826594",
              cardTitle: "Both Teams to Score",
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.228826594",
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                  },
                  runners: [{ runnerURN: "urn" }],
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
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.228826594",
            },
          },
          {
            node: {
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.228826388",
            },
          },
          {
            node: {
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.228826521",
            },
          },
          {
            node: {
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.228826386",
            },
          },
          {
            node: {
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.228826624",
            },
          },
        ],
      },
    },
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:marketsByEventAndMarketType:halfTimeFullTimeMarketGroup#29359895",
      cardGroupTitle: "Half Time / Full Time",
      full: {
        edges: [
          {
            node: {
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.228826395",
              cardTitle: "Half Time / Full Time",
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.228826395",
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                  },
                  runners: [{ runnerURN: "urn" }],
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
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.228826395",
            },
          },
        ],
      },
    },
    {
      __typename: "QuickLinksCard",
      urn: "ppb:tbd:card:quickLinks:allMarkets:1",
      quickLinksTitle: "All Markets",
      links: [
        {
          label: "View All Markets",
          target: "_self",
          icon: null,
          viewLink: {
            viewUrl: routes.getAllMarketsViewUrl(EVENT_ID),
            viewUrn: `ppb:tbd:view:allMarkets:${EVENT_ID}`,
          },
        },
      ],
    },
  ],
};

describe("[634877] Given I am on a Football Event Page, And BFF retrieves 6 market main swimlanes (3 full and 6 partials)", () => {
  //And the swimlanes titles are: "Match Odds Markets", "Over/Under Goals Markets", "Correct Score", "Correct Score 2", "Both Teams to Score?" and "Half Time/Full Time"
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(BFF_ALL_MARKETS_VIEW_MOCK));
    await mockService.mockHttpRequest({ ...getCardResults(CARDS_MOCK), delay: 3000 });
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(firstMarketsSwimlane.element);
  });

  it("[PRPI-5728] Then I should see a total of 4 market main swimlanes at page load", async () => {
    expect(await eventPagePO.scrollableSwimlanes.length).toBe(4);
  });

  describe("When the first market main swimlane ('Match Odds Markets') has only 1 full and 1 partial card named 'Match Odds'", () => {
    it("[PRPI-5729] Then I should see the first market main swimlane title 'Match Odds Markets' on the viewport", async () => {
      expect(await firstMarketsSwimlane.title.getText()).toBe("Match Odds Markets");
    });

    it("[PRPI-5730] And I should see only one market named 'Match Odds'", async () => {
      expect(await firstMarketsSwimlane.scrollItems.length).toBe(1);
      expect(await firstMarketSwimlaneCard.title.getText()).toBe("Match Odds");
    });
  });

  describe("When the second market main swimlane ('Over/Under Goals Markets') has 4 full cards and 7 partial cards", () => {
    it("[PRPI-5731] Then I should the second market main swimlane with 'Over/Under Goals Markets' and with a total of 4 market cards at page load", async () => {
      expect(await secondMarketsSwimlane.title.getText()).toBe("Over/Under Goals Markets");
      expect(await secondMarketsSwimlane.scrollItems.length).toBe(7);
      expect(await secondMarketsSwimlane.scrollItemsPlaceholders.length).toBe(3);
    });
  });

  describe("When I scroll down till the fourth market main swimlane", () => {
    beforeAll(async () => {
      // scroll to 4th element to trigger request for next 4 items
      await eventPagePO.cardGroups[3].scrollIntoView({ block: "center" });
      await eventPagePO.cardGroups[4].scrollIntoView({ block: "center" });
      await browser.waitUntilDisplayed(fifthMarketsSwimlane.scrollItems[0]);
    });

    it("[PRPI-5732] Then I should see the fifth market main swimlane (Both Teams to Score) on the viewport", async () => {
      expect(await fifthMarketsSwimlane.element.isDisplayedInViewport()).toBe(true);
      expect(await fifthMarketsSwimlane.title.getText()).toBe("Both Teams to Score");
    });

    it("[PRPI-5733] And I should see the sixth market main swimlane ('Half Time / Full Time') is loaded on the page", async () => {
      expect(await sixthMarketsSwimlane.element.isDisplayed()).toBe(true);
      expect(await sixthMarketsSwimlane.title.getText()).toBe("Half Time / Full Time");
    });

    it("[PRPI-5734] And I should see a total of 6 main market swimlanes on the page", async () => {
      //"(info fetched by the scroll): Match Odds Markets", "Over/Under Goals Markets", "Correct Score", "Correct Score 2", "Both Teams to Score?" and "Half Time / Full Time"
      expect(await eventPagePO.scrollableSwimlanes.length).toBe(6);
      expect(await firstMarketsSwimlane.title.getText()).toBe("Match Odds Markets");
      expect(await secondMarketsSwimlane.title.getText()).toBe("Over/Under Goals Markets");
      expect(await thirdMarketsSwimlane.title.getText()).toBe("Correct Score");
      expect(await fourthMarketsSwimlane.title.getText()).toBe("Correct Score 2");
      expect(await fifthMarketsSwimlane.title.getText()).toBe("Both Teams to Score");
      expect(await sixthMarketsSwimlane.title.getText()).toBe("Half Time / Full Time");
    });
  });

  describe("When I scroll down till reach the footer area", () => {
    beforeAll(async () => {
      await eventPagePO.quicklinkTitle.scrollIntoView({ block: "center" });
      await browser.waitUntilDisplayed(eventPagePO.quicklinkTitle);
    });

    it("[PRPI-5735] Then I should see All Markets title", async () => {
      expect(await eventPagePO.quicklinkTitle.getText()).toBe("All Markets");
    });

    it("[PRPI-5736] And I should see View All Markets label on a link", async () => {
      expect(await linkPO.element.getText()).toBe("View All Markets");
    });

    it("[PRPI-5737] the link should go to the All Markets page", async () => {
      const url = await linkPO.element.getAttribute("href");

      expect(url).toContain(routes.getAllMarketsViewUrl(EVENT_ID));
    });

    describe("When I click on View All Markets link", () => {
      beforeAll(async () => {
        await linkPO.element.scrollIntoView({
          block: "center",
        });
        await linkPO.element.click();
        await browser.waitUntilDisplayed(allMarketsPagePO.element);
      });

      it("[PRPI-5738] Then I should see that All Markets page is shown'", async () => {
        expect(await allMarketsPagePO.title.getText()).toBe("All Markets");
      });
    });
  });
});
