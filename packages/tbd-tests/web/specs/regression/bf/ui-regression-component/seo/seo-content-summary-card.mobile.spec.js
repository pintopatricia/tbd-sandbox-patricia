const { SportPagePO, SectionElementsPO, CardPO } = require("../../../../../page-objects");
const { getSportsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const contentSummaryFirstSection = new SectionElementsPO(sportPagePO.contentSummaryCards[0]);
const contentSummaryFirstCard = new CardPO(contentSummaryFirstSection.element);
const contentSummaryFourthSection = new SectionElementsPO(sportPagePO.contentSummaryCards[3]);
const contentSummaryFourthCard = new CardPO(contentSummaryFourthSection.element);
const contentSummarySectionsTitle = contentSummaryFourthSection.sectionTitles;
const contentSummaryFirstSectionTitle = contentSummarySectionsTitle[0];
const contentSummaryFirstSectionFirstLinkTitle = contentSummaryFourthSection.linkLabels[0];
const contentSummaryFirstSectionSecondLinkTitle = contentSummaryFourthSection.linkLabels[1];

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
        cardGroupTitle: "Today",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753184",
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
                      urn: "ppb:excMarket:1.170181973",
                      liveData: {
                        totalMatched: 21883.006497031536,
                        state: "SUSPENDED",
                        inplay: false,
                      },
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
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
                          urn: "ppb:competition:12191691",
                          name: "Brazilian Brasiliense Matches",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753184",
                          name: "Gama v Real Futebol Clube",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/198140/0",
                          name: "Gama",
                          selectionId: 198140,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/22242266/0",
                          name: "Real Futebol Clube",
                          selectionId: 22242266,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170181973/198140/0" },
                      { runnerURN: "ppb:excRunner:1.170181973/22242266/0" },
                      { runnerURN: "ppb:excRunner:1.170181973/58805/0" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753184",
                  home: {
                    name: "Gama",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Real Futebol Clube",
                    color: null,
                    crest: null,
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
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753184",
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
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetitionLink:2079376",
      },
    },
    {
      node: {
        __typename: "ContentSummaryCard",
        urn: "ppb:tbd:card:contentSummary:sport:1",
      },
    },
  ],

  bottomBar: {},
};

const CONTENT_SUMMARY_CARD_EMPTY = {
  __typename: "ContentSummaryCard",
  urn: "ppb:tbd:card:contentSummary:sport:1",
  sections: [],
};
const CARDS_MOCK_EMPTY = {
  cards: [
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:topEventsByCompetitionLink:2079376",
      cardGroupTitle: "Costa Rican Primera Division",
      full: {
        edges: [
          {
            node: {
              __typename: "EventViewLinkCard",
              urn: "ppb:tbd:card:eventViewLink:29753837",
              viewLink: {},
              sportevent: {
                urn: "ppb:event:29753837",
                name: "Guadalupe F.C v Limon",
                eventId: 29753837,
                openDate: "2020-03-18T22:00:00.000Z",
                sport: { urn: "ppb:eventType:1", name: "Football" },
                competition: {
                  urn: "ppb:competition:2079376",
                  name: "Costa Rican Primera Division",
                },
              },
              fixture: {
                urn: "ppb:fixture:29753837",
                scheduledAt: "2020-03-18T22:00:00Z",
                startedAt: null,
                duration: {
                  period: "REGULAR",
                  status: "PRE_MATCH",
                  clock: null,
                  stoppageMinutes: null,
                },
                home: { name: "Guadalupe F.C" },
                away: { name: "Limon" },
              },
            },
          },
        ],
      },
      partials: {
        edges: [
          {
            node: {
              __typename: "EventViewLinkCard",
              urn: "ppb:tbd:card:eventViewLink:29753837",
            },
          },
        ],
      },
    },
    { ...CONTENT_SUMMARY_CARD_EMPTY },
  ],
};

const CONTENT_SUMMARY_CARD = {
  __typename: "ContentSummaryCard",
  urn: "ppb:tbd:card:contentSummary:sport:1",
  sections: [
    {
      sectionType: "ACCORDION",
      title: "Where can I find great Football betting odds?",
      items: [
        {
          __typename: "ContentSummaryTextItem",
          text: "Bet on Football, your way...",
        },
      ],
    },
    {
      sectionType: "ACCORDION",
      title: "What markets are available for Football betting?",
      items: [
        {
          __typename: "ContentSummaryTextItem",
          text: "Betfair currently offers various betting options...",
        },
      ],
    },
    {
      sectionType: "ACCORDION",
      title: "What are some interesting Football betting stats?",
      items: [
        {
          __typename: "ContentSummaryTextItem",
          text: "Among competition outright markets...",
        },
      ],
    },
    {
      sectionType: "ACCORDION",
      title: "Popular Competitions and Outrights",
      items: [
        {
          __typename: "ContentSummaryGroupLinkItem",
          subtitle: "Popular Tennis Tournaments",
          items: [
            {
              text: "Tennis Specials betting",
              viewLink: {
                viewUrl: "tennis/tennis-specials/competition:10530955",
                viewUrn: "ppb:tbd:view:competition:10530955",
              },
            },
            {
              text: "ITF Dubai betting",
              viewLink: {
                viewUrl: "tennis/itf-dubai/competition:10530954",
                viewUrn: "ppb:tbd:view:competition:10530954",
              },
            },
          ],
        },
        {
          __typename: "ContentSummaryGroupLinkItem",
          subtitle: "Popular Horse Racing Tournaments",
          items: [
            {
              text: "Hurdle Novice betting",
              viewLink: {
                viewUrl: "horse-racing/hurdle-novice/rc-1.111111111",
                viewUrn: "ppb:tbd:view:market:1.111111111",
              },
            },
          ],
        },
        {
          __typename: "ContentSummaryGroupLinkItem",
          subtitle: "Popular Outrights Tournaments",
          items: [
            {
              text: "English Premier League Winner 2020/21 betting",
              viewLink: {},
            },
            {
              text: "English Premier League Top 2 Finish 2020/21 betting",
              viewLink: {},
            },
            {
              text: "English Premier League Top 3 Finish 2020/21 betting",
              viewLink: {},
            },
          ],
        },
        {
          __typename: "ContentSummaryGroupLinkItem",
          subtitle: "Popular Events from All Sports",
          items: [
            {
              text: "Montpellier v Castres betting",
              viewLink: {},
            },
            {
              text: "Stade Francais v Bordeaux Begles betting",
              viewLink: {},
            },
            {
              text: "Bayonne v Toulon betting",
              viewLink: {},
            },
            {
              text: "Clermont Auvergne v Lyon OU betting",
              viewLink: {},
            },
            {
              text: "La Rochelle v Racing 92 betting",
              viewLink: {},
            },
          ],
        },
      ],
    },
  ],
};
const CARDS_MOCK = {
  cards: [
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:topEventsByCompetitionLink:2079376",
      cardGroupTitle: "Costa Rican Primera Division",
      full: {
        edges: [
          {
            node: {
              __typename: "EventViewLinkCard",
              urn: "ppb:tbd:card:eventViewLink:29753837",
              viewLink: {},
              sportevent: {
                urn: "ppb:event:29753837",
                name: "Guadalupe F.C v Limon",
                eventId: 29753837,
                openDate: "2020-03-18T22:00:00.000Z",
                sport: { urn: "ppb:eventType:1", name: "Football" },
                competition: {
                  urn: "ppb:competition:2079376",
                  name: "Costa Rican Primera Division",
                },
              },
              fixture: {
                urn: "ppb:fixture:29753837",
                scheduledAt: "2020-03-18T22:00:00Z",
                startedAt: null,
                duration: {
                  period: "REGULAR",
                  status: "PRE_MATCH",
                  clock: null,
                  stoppageMinutes: null,
                },
                home: { name: "Guadalupe F.C" },
                away: { name: "Limon" },
              },
            },
          },
        ],
      },
      partials: {
        edges: [
          {
            node: {
              __typename: "EventViewLinkCard",
              urn: "ppb:tbd:card:eventViewLink:29753837",
            },
          },
        ],
      },
    },
    { ...CONTENT_SUMMARY_CARD },
  ],
};

describe("Content Summary Card", () => {
  describe("When the user opens the sport page without content summary card (empty sections)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getCardResults(CARDS_MOCK_EMPTY));
      await browser.url(`${routes.getSportViewUrl(EVENT_TYPE_ID)}`);
      await browser.waitUntilDisplayed(sportPagePO.element);
      await browser.waitUntilDisplayed(sportPagePO.primaryEventCards[0]);
      await sportPagePO.cardGroups[1].scrollIntoView();
      await browser.waitUntilDisplayed(sportPagePO.cardGroups[1]);
    });

    it("[PRPI-7575] the content summary card is not displayed on the sport page", async () => {
      expect(await sportPagePO.contentSummaryCards.length).toBe(0);
    });
  });

  describe("When the user opens the sport page with content summary card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getCardResults(CARDS_MOCK));
      await browser.url(`${routes.getSportViewUrl(EVENT_TYPE_ID)}`);
      await browser.waitUntilDisplayed(await sportPagePO.element);
      await browser.waitUntilDisplayed(await sportPagePO.primaryEventCards[0]);
      await sportPagePO.cardGroups[1].scrollIntoView();
      await contentSummaryFirstSection.element.scrollIntoView({
        block: "start",
      });
      await browser.waitUntilDisplayed(contentSummaryFirstSection.element);
    });

    it("[PRPI-7576] the content summary card has 4 collapses collapsed", async () => {
      expect(await sportPagePO.contentSummaryCards.length).toBe(4);
    });

    it("[PRPI-7577] and first collapse should have the title: Where can I find great Football betting odds?", async () => {
      expect(await contentSummaryFirstCard.title.getText()).toBe("Where can I find great Football betting odds?");
    });

    describe("When the user expands the first collapse", () => {
      beforeAll(async () => {
        await contentSummaryFirstCard.header.waitForClickable();
        await contentSummaryFirstCard.header.click();
        await browser.waitUntilEquals(contentSummaryFirstCard.content, "Bet on Football, your way...");
      });

      it("[PRPI-7578] First collapse should expand text", async () => {
        expect(await contentSummaryFirstCard.content.getText()).toBe("Bet on Football, your way...");
      });
    });

    describe("When the user expands the fourth collapse", () => {
      beforeAll(async () => {
        await contentSummaryFourthCard.header.waitForClickable();
        await contentSummaryFourthCard.header.click();
        await contentSummaryFourthCard.element.scrollIntoView({
          block: "start",
        });
        await browser.waitUntilEquals(contentSummaryFirstSectionTitle, "Popular Tennis Tournaments");
      });

      it("[PRPI-7579] Fourth collapse should have 4 sections", async () => {
        expect(await contentSummarySectionsTitle.length).toBe(4);
      });

      it("[PRPI-7580] and the first section should have title and 2 links displayed", async () => {
        expect(await contentSummaryFirstSectionTitle.getText()).toBe("Popular Tennis Tournaments");
        expect(await contentSummaryFirstSectionFirstLinkTitle.getText()).toBe("Tennis Specials betting");
        expect(await contentSummaryFirstSectionSecondLinkTitle.getText()).toBe("ITF Dubai betting");
      });
    });
  });
});
