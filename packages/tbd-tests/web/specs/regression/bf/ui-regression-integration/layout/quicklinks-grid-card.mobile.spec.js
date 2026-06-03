const { QuicklinksGridPO, CardGroupPO } = require("../../../../../page-objects");
const { getGenericLayout, getQueryCardResponseByOperation } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const quicklinksGridPO = new QuicklinksGridPO();
const cardGroupPO = new CardGroupPO();

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

const VIEW_PARTIAL_EDGES = [
  {
    node: {
      __typename: "BlurbCard",
      urn: "ppb:tbd:card:blurb:Z-1uQRAAAB8AZ8lB/s/1",
    },
  },
  {
    node: {
      __typename: "QuicklinksGridCardGroup",
      urn: "ppb:tbd:cardgroup:quicklinksGrid:YJlMQREAAHJJY7xU/s/1",
    },
  },
];

const SPORT_VIEW_LINK_CARD_1 = {
  __typename: "SportViewLinkCard",
  urn: "ppb:tbd:card:sportViewLink:1",
  viewLink: {
    viewUrl: "football/sport:1",
    viewUrn: "ppb:tbd:view:sport:1",
  },
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:1",
    name: "I turned myself into a pickle, Morty!",
    sportId: 1,
    shortName: "Football",
  },
};

const SPORT_VIEW_LINK_CARD_2 = {
  __typename: "SportViewLinkCard",
  urn: "ppb:tbd:card:sportViewLink:5",
  viewLink: {
    viewUrl: "football/sport:5",
    viewUrn: "ppb:tbd:view:sport:5",
  },
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:5",
    name: "This is Rugby Union, a sport that has a very big name!",
    sportId: 5,
    shortName: "Rugby Union",
  },
};

const EVENT_VIEW_LINK_CARD_1 = {
  __typename: "EventViewLinkCard",
  urn: "ppb:tbd:card:eventViewLink:33333",
  viewLink: {
    viewUrn: "ppb:tbd:view:event:33333",
    viewUrl: "sport-name/competition-name/event-name/e-33333",
  },
  sportevent: {
    __typename: "SportsEvent",
    urn: "ppb:event:33333",
    eventId: 33333,
    name: "This is an event that happens to be a golf event",
    openDate: "2021-04-14T19:00:00.000Z",
    competition: {
      __typename: "Competition",
      urn: "ppb:competition:333",
      name: "Competition Name",
      competitionId: 333,
      sport: {
        __typename: "Sport",
        urn: "ppb:eventType:3",
        name: "Golf",
        sportId: 3,
      },
    },
  },
};

const EVENT_VIEW_LINK_CARD_2 = {
  __typename: "EventViewLinkCard",
  urn: "ppb:tbd:card:eventViewLink:77777",
  viewLink: {
    viewUrn: "ppb:tbd:view:event:77777",
    viewUrl: "sport-name/competition-name/event-name/e-77777",
  },
  sportevent: {
    __typename: "SportsEvent",
    urn: "ppb:event:77777",
    eventId: 77777,
    name: "This is an event that happens to be a golf event and it has a very big name with a lot of characters",
    openDate: "2021-04-14T19:00:00.000Z",
    competition: {
      __typename: "Competition",
      urn: "ppb:competition:777",
      name: "Competition Name",
      competitionId: 777,
      sport: {
        __typename: "Sport",
        urn: "ppb:eventType:7",
        name: "Baseball",
        sportId: 7,
      },
    },
  },
};

const COMPETITION_VIEW_LINK_CARD_1 = {
  __typename: "CompetitionViewLinkCard",
  urn: "ppb:tbd:card:competitionViewLink:444",
  viewLink: {
    viewUrn: "ppb:tbd:view:competition:444",
    viewUrl: "sport-name/competition-name/c-444",
  },
  competition: {
    __typename: "Competition",
    urn: "ppb:competition:444",
    name: "This is a Cricket competition",
    competitionId: 444,
    logo: null,
    sport: {
      __typename: "Sport",
      urn: "ppb:eventType:4",
      name: "Cricket",
      sportId: 4,
    },
  },
};

const MEETING_VIEW_LINK_CARD_1 = {
  __typename: "RaceViewLinkCard",
  urn: "ppb:tbd:card:raceViewLink:7|111111.2222",
  viewLink: {
    viewUrn: "ppb:tbd:view:race:7|111111.2222",
    viewUrl: "sport-name-7/meeting-name/r-7%7C111111.2222",
  },
  race: {
    __typename: "Race",
    name: "Race Name",
    raceId: "111111.2222",
    startTime: "2021-04-15T12:50:00.000Z",
    urn: "ppb:race:111111.2222",
    meeting: {
      __typename: "Meeting",
      country: "GB",
      countryFlag: null,
      date: "2021-04-15T12:15:00.000Z",
      meetingId: "111111",
      name: "Meeting Name",
      sport: {
        __typename: "Sport",
        name: "Sport Name 7",
        sportId: 7,
        urn: "ppb:eventType:7",
      },
      urn: "ppb:meeting:111111",
      venue: "Newmarket",
    },
  },
};

const GENERIC_VIEW_LINK_CARD = {
  __typename: "GenericViewLinkCard",
  urn: "ppb:tbd:card:genericViewLink:generic:coupon",
  viewLink: {
    viewUrn: "ppb:tbd:view:generic:coupon:some-coupon",
    viewUrl: "view/cp-some-coupon",
    viewDisplayMode: null,
  },
  genericViewLinkTitle: {
    __typename: "DisplayNameTitle",
    name: "This Coupon Title Is So Damn Big It Makes Other Titles Feel Uncomfortable",
  },
  badge: null,
  sportIcon: null,
};

const GENERIC_EXTERNAL_VIEW_LINK_CARD = {
  __typename: "GenericViewLinkCard",
  urn: "ppb:tbd:card:genericViewLink:external:aHR0cHM6Ly93d3cuYmVhdHRoZWRyb3AuYmV0ZmFpci5jb20v",
  viewLink: {
    viewUrn: "ppb:tbd:view:external:external",
    viewUrl: "https://www.beatthedrop.betfair.com/",
    viewDisplayMode: "BLANK_INAPP",
  },
  genericViewLinkTitle: {
    __typename: "DisplayNameTitle",
    name: "External Link Title",
  },
  badge: null,
  sportIcon: null,
};

const QUICKLINKS_GRID_CARD_GROUP_MOCK = {
  __typename: "QuicklinksGridCardGroup",
  urn: "ppb:tbd:cardgroup:quicklinksGrid:YJlMQREAAHJJY7xU/s/1",
  quicklinksGridTitle: "Popular",
  hideArrows: false,
  hideIcons: false,
  items: {
    __typename: "QuicklinksGridCardGroupItemsConnection",
    edges: [
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: true,
        style: "HIGHLIGHTED",
        label: null,
        icon: null,
        node: SPORT_VIEW_LINK_CARD_1,
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: false,
        style: "HIGHLIGHTED",
        label: null,
        icon: null,
        node: EVENT_VIEW_LINK_CARD_1,
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: false,
        style: "NONE",
        label: null,
        icon: null,
        node: COMPETITION_VIEW_LINK_CARD_1,
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: false,
        style: "NONE",
        label: null,
        icon: null,
        node: MEETING_VIEW_LINK_CARD_1,
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: true,
        style: "PROMOTED",
        label: null,
        icon: null,
        node: EVENT_VIEW_LINK_CARD_2,
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: false,
        style: "NONE",
        label: null,
        icon: null,
        node: SPORT_VIEW_LINK_CARD_2,
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: false,
        style: "HIGHLIGHTED_INVERSE",
        label: null,
        icon: null,
        node: GENERIC_VIEW_LINK_CARD,
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: true,
        label: "External View Link Card Label",
        style: "NONE",
        icon: null,
        node: GENERIC_EXTERNAL_VIEW_LINK_CARD,
      },
    ],
  },
  partials: {
    __typename: "QuicklinksGridCardGroupItemsConnection",
    edges: [
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: true,
        style: "HIGHLIGHTED",
        label: null,
        icon: null,
        node: {
          __typename: "SportViewLinkCard",
          urn: SPORT_VIEW_LINK_CARD_1.urn,
        },
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: false,
        style: "HIGHLIGHTED",
        label: null,
        icon: null,
        node: {
          __typename: "EventViewLinkCard",
          urn: EVENT_VIEW_LINK_CARD_1.urn,
        },
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: false,
        style: "NONE",
        label: null,
        icon: null,
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: COMPETITION_VIEW_LINK_CARD_1.urn,
        },
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: false,
        style: "NONE",
        label: null,
        icon: null,
        node: {
          __typename: "RaceViewLinkCard",
          urn: MEETING_VIEW_LINK_CARD_1.urn,
        },
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: true,
        style: "PROMOTED",
        label: null,
        icon: null,
        node: {
          __typename: "EventViewLinkCard",
          urn: EVENT_VIEW_LINK_CARD_2.urn,
        },
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: false,
        style: "NONE",
        label: null,
        icon: null,
        node: {
          __typename: "SportViewLinkCard",
          urn: SPORT_VIEW_LINK_CARD_2.urn,
        },
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: false,
        style: "HIGHLIGHTED_INVERSE",
        label: null,
        icon: null,
        node: {
          __typename: "GenericViewLinkCard",
          urn: GENERIC_VIEW_LINK_CARD.urn,
        },
      },
      {
        __typename: "QuicklinkGridCardGroupItemEdge",
        isExpanded: true,
        label: "External View Link Card Label",
        style: "NONE",
        icon: null,
        node: {
          __typename: "GenericViewLinkCard",
          urn: GENERIC_EXTERNAL_VIEW_LINK_CARD.urn,
        },
      },
    ],
  },
};

const GENERIC_VIEW_WITH_QUICKLINKS_GRID = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: BOTTOM_BAR_PROPERTY,
  edges: [
    {
      node: QUICKLINKS_GRID_CARD_GROUP_MOCK,
    },
  ],

  partialEdges: VIEW_PARTIAL_EDGES,
};

const BFF_MOCK_COUPON_VIEW = {
  urn: "ppb:tbd:view:generic:coupon:some-coupon",
  url: "view/cp-some-coupon",
  title: null,
  pageInfo: null,
};

describe("QuicklinksGridCardGroup", () => {
  describe("When loading a view with a QuicklinksGridCardGroup", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(GENERIC_VIEW_WITH_QUICKLINKS_GRID.urn));
      await mockService.mockHttpRequest(getGenericLayout(GENERIC_VIEW_WITH_QUICKLINKS_GRID));
      await mockService.mockHttpRequest(
        getQueryCardResponseByOperation("QuicklinksGridCardGroup", QUICKLINKS_GRID_CARD_GROUP_MOCK),
      );
      await browser.url(routes.getGenericViewUrl("home"));
      await browser.waitUntilDisplayed(quicklinksGridPO.element);
      await browser.waitUntilDisplayed(quicklinksGridPO.quicklinks[0]);
    });

    it("[PRPI-9362] should have the expected title", async () => {
      expect(await cardGroupPO.title.getText()).toBe("Popular");
    });

    it("[PRPI-9363] should have the first quicklink be a sport link", async () => {
      expect(await quicklinksGridPO.quicklinks[0].getAttribute("href")).toContain("football/sport:1");
    });

    it("[PRPI-9364] should have the second quicklink be an event link", async () => {
      expect(await quicklinksGridPO.quicklinks[1].getAttribute("href")).toContain(
        "sport-name/competition-name/event-name/e-33333",
      );
    });

    it("[PRPI-9365] should have the third quicklink be a competition link", async () => {
      expect(await quicklinksGridPO.quicklinks[2].getAttribute("href")).toContain("sport-name/competition-name/c-444");
    });

    it("[PRPI-9366] should have the fourth quicklink be a race link", async () => {
      expect(await quicklinksGridPO.quicklinks[3].getAttribute("href")).toContain(
        "sport-name-7/meeting-name/r-7%7C111111.2222",
      );
    });

    it("[PRPI-9367] should have the fifth quicklink be an event link", async () => {
      expect(await quicklinksGridPO.quicklinks[4].getAttribute("href")).toContain(
        "sport-name/competition-name/event-name/e-77777",
      );
    });

    it("[PRPI-9368] should have the sixth quicklink be a sport link", async () => {
      expect(await quicklinksGridPO.quicklinks[5].getAttribute("href")).toContain("football/sport:5");
    });

    it("[PRPI-9369] should have the seventh quicklink be a coupon link", async () => {
      expect(await quicklinksGridPO.quicklinks[6].getAttribute("href")).toContain("view/cp-some-coupon");
    });

    it("[PRPI-9370] should have the eighth quicklink have a label and a generic external link", async () => {
      await browser.waitUntilEquals(quicklinksGridPO.labels[7], "External View Link Card Label");

      expect(await quicklinksGridPO.quicklinks[7].getAttribute("href")).toBe("https://www.beatthedrop.betfair.com/");
    });

    describe("When a quicklink is clicked", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_COUPON_VIEW));

        await quicklinksGridPO.quicklinks[6].waitForClickable();
        await quicklinksGridPO.quicklinks[6].click();

        await browser.waitUntilBrowserUrlContains(BFF_MOCK_COUPON_VIEW.url);
      });

      it("[PRPI-9371] should navigate as expected", async () => {
        const url = await browser.getUrl();

        expect(url).toContain(BFF_MOCK_COUPON_VIEW.url);
      });
    });
  });
});
