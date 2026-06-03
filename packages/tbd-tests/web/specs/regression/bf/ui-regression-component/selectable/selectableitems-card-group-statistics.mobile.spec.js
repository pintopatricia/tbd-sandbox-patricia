const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const SelectableItemsCardGroupPO = require("@ppb/tbd-shared/components/SelectableItemsCardGroup/SelectableItemsCardGroup.web.po");
const EventStatsCardPO = require("@ppb/tbd-shared/components/EventStatsCard/EventStatsCard.web.po");
const { SelectableItemsPO, IconButtonPO, MatchStatsPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { getHtmlFilePuppeteer } = require("../../../../../mock-essentials/controllers/html/html-controller");

const mockService = new MockService();

const selectableItemsPO = new SelectableItemsPO();
const matchStatsPO = new MatchStatsPO();

const selectableitemsCardGroupMock = {
  __typename: "SelectableItemsCardGroup",
  urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/s/7",
  cardGroupTitle: "Title",
  full: {
    edges: [
      {
        node: {
          __typename: "EventStatsCard",
          urn: "ppb:tbd:card:eventStats:29465861",
          matchStatsUrl: "https://dummy.com.betfair/dataviz",
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "EventStatsCard",
          urn: "ppb:tbd:card:eventStats:29465861",
        },
      },
      {
        node: {
          __typename: "MatchTimelineCard",
          urn: "ppb:tbd:card:matchTimeline:29465861",
        },
      },
      {
        node: {
          __typename: "HeadToHeadCard",
          urn: "ppb:tbd:card:headToHead:29465861",
        },
      },
      {
        node: {
          __typename: "MatchStatsCard",
          urn: "ppb:tbd:card:matchstats:29465861",
        },
      },
      {
        node: {
          __typename: "TeamFormCard",
          urn: "ppb:tbd:card:teamForm:29465861",
        },
      },
      {
        node: {
          __typename: "TeamLineupCard",
          urn: "ppb:tbd:card:teamLineup:29465861",
        },
      },
    ],
  },
};

const BFF_FETCH_CARDS_MOCK = {
  cards: [
    {
      __typename: "MatchStatsCard",
      home: "Wolves",
      away: "Real Madrid",
      sportevent: {
        eventName: "Wolves v Real Madrid",
        openDate: "2010-10-14T18:45Z",
        urn: "ppb:event:29465861",
        __typename: "SportsEvent",
      },
      urn: "ppb:tbd:card:matchstats:29465861",
      contentTitle: "Match Stats",
      footballFixture: {
        urn: "ppb:fixture:29465861",
        home: {
          name: "Wolves",
          color: "FDB913",
        },
        away: {
          name: "Real Madrid",
          color: "FFFFFF",
        },
        scheduledAt: "2010-10-14T18:45Z",
        stats: [
          {
            periodStatus: "FULL",
            home: {},
            away: {},
          },
        ],
      },
    },
  ],
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        ...selectableitemsCardGroupMock,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SelectableItemsCardGroup",
        urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/s/7",
      },
    },
  ],
};

const selectableItemsCardGroupPO = new SelectableItemsCardGroupPO();
const eventStatsCardPO = new EventStatsCardPO();
const firstItem = new IconButtonPO(selectableItemsPO.statistics[0]);
const secondItem = new IconButtonPO(selectableItemsPO.statistics[1]);
const thirdItem = new IconButtonPO(selectableItemsPO.statistics[2]);
const fourthItem = new IconButtonPO(selectableItemsPO.statistics[3]);
const fifthItem = new IconButtonPO(selectableItemsPO.statistics[4]);
const sixthItem = new IconButtonPO(selectableItemsPO.statistics[5]);

const DATA_VIZ_MOCK = `
  <div style="display: flex; align-items:center; justify-content: center; width: 100%; height: 100%; background: cyan" id="dataviz">
    <span style="font-size: 30px">DATA VIZ</span>
  </div>
`;

describe("Layout Entity - SelectableItemsCardGroup (Statistics)", () => {
  describe("When the user is on a given page and a SelectableItemsCardGroup is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getHtmlFilePuppeteer({ path: ".*dataviz.*", content: DATA_VIZ_MOCK }));
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await browser.url(routes.getGenericViewUrl("home"));
      await browser.waitUntilDisplayed(selectableItemsCardGroupPO.element);
      await browser.waitUntilDisplayed(selectableItemsPO.element);
    });

    it("[PRPI-7549] The CardGroup with the first 4 cards should be displayed (Event Stats, Match Timeline, H2H, Match Stats)", async () => {
      expect(await selectableItemsPO.element.isDisplayed()).toBe(true);
      expect(await firstItem.text.getText()).toEqual("EVENT STATS");
      expect(await secondItem.text.getText()).toEqual("TIMELINE");
      expect(await thirdItem.text.getText()).toEqual("H2H");
      expect(await fourthItem.text.getText()).toEqual("STATS");
    });

    it("[PRPI-7550] The Event Stats tab should be selected and highlighted", async () => {
      expect(await selectableItemsPO.activeStatisticContent.getText()).toEqual("EVENT STATS");
    });

    it("[PRPI-7551] The Event Stats content should be visible", async () => {
      expect(await eventStatsCardPO.element.isDisplayed()).toBe(true);
    });

    describe("When the user taps on Match Stats tab", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
        await fourthItem.iconContainer.click();
        await browser.waitUntilDisplayed(selectableItemsPO.activeStatisticContent, "STATS");
        await browser.waitUntilDisplayed(matchStatsPO.element, "Match Stats content is not displayed");
      });

      it("[PRPI-7552] The CardGroup with the first 4 cards should be displayed (Event Stats, Match Timeline, H2H, Match Stats)", async () => {
        expect(await selectableItemsPO.element.isDisplayed()).toBe(true);
        expect(await firstItem.text.getText()).toEqual("EVENT STATS");
        expect(await secondItem.text.getText()).toEqual("TIMELINE");
        expect(await thirdItem.text.getText()).toEqual("H2H");
        expect(await fourthItem.text.getText()).toEqual("STATS");
      });

      it("[PRPI-7553] The Match Stats tab should be selected and highlighted", async () => {
        expect(await selectableItemsPO.activeStatisticContent.getText()).toEqual("STATS");
      });

      it("[PRPI-7554] The Match Stats content should be visible", async () => {
        expect(await matchStatsPO.element.isDisplayed()).toBe(true);
      });
    });

    describe("When the users scrolls right till Team Lineup tab", () => {
      beforeAll(async () => {
        await sixthItem.element.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(sixthItem.element);
      });

      it("[PRPI-7555] The CardGroup with the last 4 cards should be displayed (H2H, Match Stats, Team Form, Team Lineups)", async () => {
        expect(await selectableItemsPO.element.isDisplayed()).toBe(true);
        expect(await thirdItem.text.getText()).toEqual("H2H");
        expect(await fourthItem.text.getText()).toEqual("STATS");
        expect(await fifthItem.text.getText()).toEqual("FORM");
        expect(await sixthItem.text.getText()).toEqual("LINE-UPS");
      });

      it("[PRPI-7556] The Match Stats tab should be selected and highlighted", async () => {
        expect(await selectableItemsPO.activeStatisticContent.getText()).toEqual("STATS");
      });

      it("[PRPI-7557] The Match Stats content should be visible", async () => {
        expect(await matchStatsPO.element.isDisplayed()).toBe(true);
      });
    });
  });
});
