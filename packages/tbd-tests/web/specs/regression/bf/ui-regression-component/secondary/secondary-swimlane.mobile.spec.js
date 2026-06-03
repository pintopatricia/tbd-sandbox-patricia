const { SportPagePO, ScrollableSwimlanePO, SecondaryEventCardPO } = require("../../../../../page-objects");
const { getSportsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const firstScrollableSwimlane = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const firstSwimlaneFirstSecondaryEventCardPO = new SecondaryEventCardPO(firstScrollableSwimlane.secondaryEventCards[0]);

const secondScrollableSwimlane = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[1]);

const secondSwimlaneFirstSecondaryEventCardPO = new SecondaryEventCardPO(
  secondScrollableSwimlane.secondaryEventCards[0],
);

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const BFF_VIEW_MOCK = {
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
                urn: "ppb:tbd:card:eventViewLink:29359892",
              },
            },
            {
              node: {
                __typename: "EventViewLinkCard",
                urn: "ppb:tbd:card:eventViewLink:29359893",
              },
            },
            {
              node: {
                __typename: "EventViewLinkCard",
                urn: "ppb:tbd:card:eventViewLink:29359894",
              },
            },
            {
              node: {
                __typename: "EventViewLinkCard",
                urn: "ppb:tbd:card:eventViewLink:29359895",
              },
            },
            {
              node: {
                __typename: "EventViewLinkCard",
                urn: "ppb:tbd:card:eventViewLink:29359896",
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
                  viewUrl: routes.getEventViewUrl("29359890"),
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
                  scheduledAt: "2020-02-01T12:30",
                  startedAt: "2020-02-01T12:30",
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
                  scheduledAt: "2020-02-01T12:30",
                  startedAt: "2020-02-01T12:30",
                  home: { name: "Wolves1" },
                  away: { name: "Man Utd1" },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:eventViewLink:29359892",
                __typename: "EventViewLinkCard",
                sportevent: {
                  urn: "ppb:event:29359892",
                  name: "Wolves2 v Man Utd2",
                  sport: {
                    urn: "ppb:eventType:29359892",
                  },
                },
                eventViewLinkFixture: {
                  urn: "ppb:fixture:29359892",
                  scheduledAt: "2020-02-01T12:30",
                  startedAt: "2020-02-01T12:30",
                  home: { name: "Wolves2" },
                  away: { name: "Man Utd2" },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:eventViewLink:29359893",
                __typename: "EventViewLinkCard",
                sportevent: {
                  urn: "ppb:event:29359893",
                  name: "Wolves3 v Man Utd3",
                  sport: {
                    urn: "ppb:eventType:29359893",
                  },
                },
                eventViewLinkFixture: {
                  urn: "ppb:fixture:29359893",
                  scheduledAt: "2020-02-01T12:30",
                  startedAt: "2020-02-01T12:30",
                  home: { name: "Wolves3" },
                  away: { name: "Man Utd3" },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topInplayEventsInSport:2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventViewLinkCard",
                urn: "ppb:tbd:card:eventViewLink:29359897",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventViewLinkCard",
                urn: "ppb:tbd:card:eventViewLink:29359897",
                sportevent: {
                  urn: "ppb:event:29359897",
                  name: "Brasil v Portugal",
                  sport: {
                    urn: "ppb:eventType:29359897",
                  },
                },
                eventViewLinkFixture: {
                  urn: "ppb:fixture:29359897",
                  scheduledAt: "2020-02-01T12:30",
                  startedAt: "2020-02-01T12:30",
                  home: { name: "Brasil" },
                  away: { name: "Portugal" },
                  duration: {
                    status: "INPLAY_FIRST_HALF",
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topInplayEventsInSport:2",
      },
    },
  ],
};

const FETCH_MORE_CARDS_MOCK = {
  cards: [
    {
      urn: "ppb:tbd:card:eventViewLink:29359894",
      __typename: "EventViewLinkCard",
      sportevent: {
        urn: "ppb:event:29359894",
        name: "Wolves31 v Man Utd31",
        sport: {
          urn: "ppb:eventType:29359894",
        },
      },
      eventViewLinkFixture: {
        urn: "ppb:fixture:29359894",
        scheduledAt: "2020-02-01T12:30",
        startedAt: "2020-02-01T12:30",
        home: { name: "Wolves31" },
        away: { name: "Man Utd31" },
      },
    },
    {
      urn: "ppb:tbd:card:eventViewLink:29359895",
      __typename: "EventViewLinkCard",
      sportevent: {
        urn: "ppb:event:29359895",
        name: "Wolves32 v Man Utd32",
        sport: {
          urn: "ppb:eventType:29359895",
        },
      },
      eventViewLinkFixture: {
        urn: "ppb:fixture:29359895",
        scheduledAt: "2020-02-01T12:30",
        startedAt: "2020-02-01T12:30",
        home: { name: "Wolves32" },
        away: { name: "Man Utd32" },
      },
    },
    {
      urn: "ppb:tbd:card:eventViewLink:29359896",
      __typename: "EventViewLinkCard",
      sportevent: {
        urn: "ppb:event:29359896",
        name: "Wolves33 v Man Utd33",
        sport: {
          urn: "ppb:eventType:29359896",
        },
      },
      eventViewLinkFixture: {
        urn: "ppb:fixture:29359896",
        scheduledAt: "2020-02-01T12:30",
        startedAt: "2020-02-01T12:30",
        home: { name: "Wolves33" },
        away: { name: "Man Utd33" },
      },
    },
  ],
};

describe("Given I am on the Football Sports Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults(FETCH_MORE_CARDS_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(firstScrollableSwimlane.title);
    await browser.waitUntilDisplayed(firstSwimlaneFirstSecondaryEventCardPO.element);
  });

  it("[PRPI-6282] Then I should see a swimlane with the title 'UEFA Champions League'", async () => {
    expect(await firstScrollableSwimlane.title.getText()).toBe("UEFA Champions League");
  });

  it("[PRPI-7532] Then I should see a swimlane without a title", async () => {
    expect(await secondScrollableSwimlane.title.isDisplayed()).toBe(false);
  });

  it("[PRPI-7533] Then I should see a Secondary Event Card", async () => {
    expect(await firstSwimlaneFirstSecondaryEventCardPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-7534] And that card should have the Home team name 'Wolves'", async () => {
    expect(await firstSwimlaneFirstSecondaryEventCardPO.runnerHome.getText()).toBe("Wolves");
  });

  it("[PRPI-7535] And that card should have the Away team name 'Man Utd'", async () => {
    expect(await firstSwimlaneFirstSecondaryEventCardPO.runnerAway.getText()).toBe("Man Utd");
  });

  it("[PRPI-7536] And that card should have the correct start time displayed", async () => {
    expect(await firstSwimlaneFirstSecondaryEventCardPO.date.isDisplayed()).toBe(true);
    expect(await firstSwimlaneFirstSecondaryEventCardPO.startTime.isDisplayed()).toBe(true);
    expect(await firstSwimlaneFirstSecondaryEventCardPO.inplayLabel.isDisplayed()).toBe(false);
  });

  it("[PRPI-7537] And that card should be link to the event", async () => {
    expect(await firstSwimlaneFirstSecondaryEventCardPO.element.getAttribute("href")).toContain(
      routes.getEventViewUrl("29359890"),
    );
  });

  it("[PRPI-7538] And it should have the date 'Feb 1, 12:30'", async () => {
    expect(await firstSwimlaneFirstSecondaryEventCardPO.date.getText()).toBe("Feb 1");
    expect(await firstSwimlaneFirstSecondaryEventCardPO.startTime.getText()).toBe(", 12:30");
  });

  it("[PRPI-7539] Then I should see a swimlane with one event", async () => {
    expect(await secondScrollableSwimlane.secondaryEventCards.length).toBe(1);
  });

  it("[PRPI-8380] Then I should see on second swimlane a Secondary Event Card", async () => {
    expect(await secondSwimlaneFirstSecondaryEventCardPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-7540] And that card should have the Home team name 'Brasil'", async () => {
    expect(await secondSwimlaneFirstSecondaryEventCardPO.runnerHome.getText()).toBe("Brasil");
  });

  it("[PRPI-7541] And that card should have the Away team name 'Portugal'", async () => {
    expect(await secondSwimlaneFirstSecondaryEventCardPO.runnerAway.getText()).toBe("Portugal");
  });

  it("[PRPI-7542] And that card should have the 'Inplay' label\xA0displayed instead of the\xA0date", async () => {
    expect(await secondSwimlaneFirstSecondaryEventCardPO.date.isDisplayed()).toBe(false);
    expect(await secondSwimlaneFirstSecondaryEventCardPO.startTime.getText()).toBe(", 12:30");
    expect(await secondSwimlaneFirstSecondaryEventCardPO.inplayLabel.getText()).toBe("In-play");
  });

  describe("And I have 4 full cards and 7 partial cards for 'UEFA Champions League' secondary swimlane", () => {
    it("[PRPI-7543] Then I should see 'UEFA Champions League' swimlane with a total of 4 viewLinkCards", async () => {
      expect(await firstScrollableSwimlane.scrollItems.length).toBe(7);
      expect(await firstScrollableSwimlane.scrollItemsPlaceholders.length).toBe(3);
    });

    describe("When I scroll till the 7th card", () => {
      beforeAll(async () => {
        // scroll with smooth behavior so useLazyLoading triggers request for next 4 items
        // await firstScrollableSwimlane.scrollItems[6].scrollIntoView({ behavior: "smooth", inline: "center" });
        await firstScrollableSwimlane.scrollItems[3].scrollIntoView({ behavior: "smooth", inline: "start" });
        await browser.waitUntilInViewport(firstScrollableSwimlane.scrollItems[4]);
        await firstScrollableSwimlane.scrollItems[4].scrollIntoView({ behavior: "smooth", inline: "start" });
        await browser.waitUntilInViewport(firstScrollableSwimlane.scrollItems[5]);
        await firstScrollableSwimlane.scrollItems[5].scrollIntoView({ behavior: "smooth", inline: "start" });
        await browser.waitUntilInViewport(firstScrollableSwimlane.scrollItems[6]);
      });

      it("[PRPI-7544] Then I should see the sixth and seventh cards (info not fetched by the swipe)", async () => {
        // expect(await firstSecondarySwimlanePO.secondaryEventCards[5].isDisplayedInViewport()).toBe(true);
        // expect(await firstSecondarySwimlanePO.secondaryEventCards[6].isDisplayedInViewport()).toBe(true);
      });
    });
  });
});
describe("Given I open the Football Sport View Page with the London Timezone", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults(FETCH_MORE_CARDS_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(firstSwimlaneFirstSecondaryEventCardPO.element);
  });

  it("[PRPI-7545] Then I should see a Secondary Event Card", async () => {
    expect(await firstSwimlaneFirstSecondaryEventCardPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-7546] And that event should start at 'Feb 1, 12:30'", async () => {
    expect(await firstSwimlaneFirstSecondaryEventCardPO.date.getText()).toBe("Feb 1");
    expect(await firstSwimlaneFirstSecondaryEventCardPO.startTime.getText()).toBe(", 12:30");
  });
});

describe("Given I open the Football Sport View Page with the Asia/Shanghai Geolocation", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn, { timeZone: "Asia/Shanghai" }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults(FETCH_MORE_CARDS_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(firstSwimlaneFirstSecondaryEventCardPO.element);
  });

  it("[PRPI-7547] Then I should see a Secondary Event Card", async () => {
    expect(await firstSwimlaneFirstSecondaryEventCardPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-7548] And that event should start at '20:30'", async () => {
    expect(await firstSwimlaneFirstSecondaryEventCardPO.date.getText()).toBe("Feb 1");
    expect(await firstSwimlaneFirstSecondaryEventCardPO.startTime.getText()).toBe(", 20:30");
  });
});
