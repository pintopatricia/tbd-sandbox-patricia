const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getGenericLayout, getQueryCardResponseByOperation } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const MODULE_NAME = "quicklinks-grid";

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

describe("Quicklinks Grid", () => {
  describe("When loading a view with a Quicklinks Grid", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(GENERIC_VIEW_WITH_QUICKLINKS_GRID.urn));
      await mockService.mockHttpRequest(getGenericLayout(GENERIC_VIEW_WITH_QUICKLINKS_GRID));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(
        getQueryCardResponseByOperation("QuicklinksGridCardGroup", QUICKLINKS_GRID_CARD_GROUP_MOCK),
      );
      await browser.url(routes.getGenericViewUrl("home"));
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-9361]_the_quicklinks_grid_with_8_elements_should_be_displayed_with_correct_quicklinks`,
      );
    });

    it("[PRPI-9361]_the_quicklinks_grid_with_8_elements_should_be_displayed_with_correct_quicklinks", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-9361]_the_quicklinks_grid_with_8_elements_should_be_displayed_with_correct_quicklinks`,
        ),
      ).toBe(0);
    });
  });
});
