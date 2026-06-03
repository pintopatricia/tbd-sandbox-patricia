const EventStatsCardSO = require("@ppb/tbd-shared/components/EventStatsCard/EventStatsCard.native.so");
const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { swipeLeftElement } = require("../../../../helpers/gestures");

const {
  MatchStatsSO,
  SelectableItemsCardGroupSO,
  IconButtonSO,
  SelectableItemsSO,
  BarStatSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const selectableItemsCardGroupSO = new SelectableItemsCardGroupSO();
const selectableItemsSO = new SelectableItemsSO();
const matchStatsSO = new MatchStatsSO();
const eventStatsCardSO = new EventStatsCardSO();
const firstBarStatContainerSO = new BarStatSO(matchStatsSO.barsWrapper[0]);

const firstItem = new IconButtonSO(selectableItemsSO.statistics[0]);
const secondItem = new IconButtonSO(selectableItemsSO.statistics[1]);
let thirdItem = new IconButtonSO(selectableItemsSO.statistics[2]);
let fourthItem = new IconButtonSO(selectableItemsSO.statistics[3]);
let fifthItem = new IconButtonSO(selectableItemsSO.statistics[4]);
let sixthItem = new IconButtonSO(selectableItemsSO.statistics[5]);

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

describe("Layout Entity - SelectableItemsCardGroup (Statistics)", () => {
  describe("When the user is on a given screen and a SelectableItemsCardGroup is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await startApp("home");
      await browser.waitUntilDisplayed(selectableItemsCardGroupSO.element);
      await browser.waitUntilDisplayed(selectableItemsSO.element);
    });

    it("[PRPI-3817] The CardGroup with the first 4 cards should be displayed (Event Stats, Match Timeline, H2H, Match Stats)", async () => {
      expect(await selectableItemsSO.element.isDisplayed()).toBe(true);
      expect(await firstItem.selectedText.getText()).toEqual("EVENT STATS");
      expect(await secondItem.text.getText()).toEqual("TIMELINE");
      expect(await thirdItem.text.getText()).toEqual("H2H");
      expect(await fourthItem.text.getText()).toEqual("STATS");
    });

    it("[PRPI-3818] The Event Stats tab should be selected and highlighted", async () => {
      expect(await selectableItemsSO.activeStatisticContent.getText()).toEqual("EVENT STATS");
    });

    it("[PRPI-3819] The Event Stats content should be visible", async () => {
      expect(await eventStatsCardSO.element.isExisting()).toBe(true);
    });

    describe("When the user taps on Match Stats tab", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
        await fourthItem.iconWrapper.click();
        await browser.waitUntilEquals(firstBarStatContainerSO.label, "Possession %");
      });

      it("[PRPI-3820] The CardGroup with the first 4 cards should be displayed (Event Stats, Match Timeline, H2H, Match Stats)", async () => {
        expect(await selectableItemsSO.element.isDisplayed()).toBe(true);
        expect(await firstItem.text.getText()).toEqual("EVENT STATS");
        expect(await secondItem.text.getText()).toEqual("TIMELINE");
        expect(await thirdItem.text.getText()).toEqual("H2H");
        expect(await fourthItem.selectedText.getText()).toEqual("STATS");
      });

      it("[PRPI-3821] The Match Stats tab should be selected and highlighted", async () => {
        expect(await selectableItemsSO.activeStatisticContent.getText()).toEqual("STATS");
      });

      it("[PRPI-3822] The Match Stats content should be visible", async () => {
        expect(await matchStatsSO.element.isDisplayed()).toBe(true);
      });
    });

    // the fix with conditionally re-set the item instances causes the test to pass locally but not in the pipeline job
    xdescribe("When the users scrolls right till Team Lineup tab", () => {
      beforeAll(async () => {
        await swipeLeftElement(secondItem.text);
        /* Android: although there are 6 statistics items,
         in android only the items visible in the viewport are selectable (5 items),
         so the last item has array index 4 */
        if (driver.isAndroid) {
          thirdItem = new IconButtonSO(selectableItemsSO.statistics[1]);
          fourthItem = new IconButtonSO(selectableItemsSO.statistics[2]);
          fifthItem = new IconButtonSO(selectableItemsSO.statistics[3]);
          sixthItem = new IconButtonSO(selectableItemsSO.statistics[4]);
        }
        await browser.waitUntilEquals(sixthItem.text, "LINE-UPS");
      });

      it("[PRPI-3823] The CardGroup with the last 4 cards should be displayed (H2H, Match Stats, Team Form, Team Lineups)", async () => {
        expect(await selectableItemsSO.element.isDisplayed()).toBe(true);
        expect(await thirdItem.text.getText()).toEqual("H2H");
        expect(await fourthItem.selectedText.getText()).toEqual("STATS");
        expect(await fifthItem.text.getText()).toEqual("FORM");
        expect(await sixthItem.text.getText()).toEqual("LINE-UPS");
      });

      it("[PRPI-3824] The Match Stats tab should be selected and highlighted", async () => {
        expect(await selectableItemsSO.activeStatisticContent.getText()).toEqual("STATS");
      });

      it("[PRPI-3825] The Match Stats content should be visible", async () => {
        expect(await matchStatsSO.element.isDisplayed()).toBe(true);
      });
    });
  });
});
