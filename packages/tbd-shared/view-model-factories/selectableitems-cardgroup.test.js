import { createSelectableItems } from "./selectableitems-cardgroup";

jest.mock("../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  SupportingContentIconName: {
    OPTA_STATS: "OPTA_STATS",
    MATCH_STATS: "MATCH_STATS",
    HEAD_TO_HEAD: "HEAD_TO_HEAD",
    TEAM_FORM: "TEAM_FORM",
    MATCH_TIMELINE: "MATCH_TIMELINE",
    TEAM_LINEUP: "TEAM_LINEUP",
  },
}));

const selectableItemsRaceEdges = [
  {
    startTime: "2020-11-12T17:00:00.000Z",
    venue: "Cheltenham",
    typename: "RaceMarketCard",
    urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
  },
  {
    startTime: "2020-11-12T17:00:00.000Z",
    venue: "Ruby",
    typename: "RaceMarketCard",
    urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
    marketPromo: {
      signposting: "EXTRA_PLACES",
    },
  },
];

const selectableItemsVirtualEdges = [
  {
    startTime: "2020-11-12T17:00:00.000Z",
    typename: "VirtualCardGroup",
    urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
    isDisabled: false,
    isClosed: false,
  },
  {
    startTime: "2020-11-12T17:00:00.000Z",
    typename: "VirtualCardGroup",
    urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
    isDisabled: false,
    isClosed: false,
  },
];

const selectableItemsStatisticEdges = [
  {
    typename: "EventStatsCard",
    urn: "ppb:tbd:card:eventstats:1",
  },
  {
    typename: "HeadToHeadCard",
    urn: "ppb:tbd:card:headtohead:1",
  },
  {
    typename: "MatchStatsCard",
    urn: "ppb:tbd:card:matchstats:1",
  },
  {
    typename: "MatchTimelineCard",
    urn: "ppb:tbd:card:matchtimeline:1",
  },
  {
    typename: "TeamFormCard",
    urn: "ppb:tbd:card:teamform:1",
  },
  {
    typename: "TeamLineupCard",
    urn: "ppb:tbd:card:teamlineup:1",
  },
  {
    typename: "NotSupportedCard",
    urn: "ppb:tbd:card:teamlineup:1",
  },
];

const USER_DETAILS = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

jest.mock("../helpers/dates", () => ({
  formatTime: jest.fn(() => "MOCKED_DATE"),
}));

describe("selectableitems cardgroup view model factory", () => {
  describe("when the items are VirtualCardGroupItemEdge", () => {
    it("should return the correct view model", () => {
      expect(createSelectableItems()(selectableItemsVirtualEdges, USER_DETAILS)).toEqual([
        {
          raceTime: "MOCKED_DATE",
          isDisabled: false,
          isRaceClosed: false,
        },
        {
          raceTime: "MOCKED_DATE",
          isDisabled: false,
          isRaceClosed: false,
        },
      ]);
    });
  });

  describe("when the items are RaceTimeItemEdges", () => {
    it("should return the correct view model", () => {
      expect(createSelectableItems()(selectableItemsRaceEdges, USER_DETAILS)).toEqual([
        {
          raceTime: "MOCKED_DATE",
          meetingName: "Cheltenham",
        },
        {
          raceTime: "MOCKED_DATE",
          meetingName: "Ruby",
          marketPromo: {
            signposting: "EXTRA_PLACES",
          },
        },
      ]);
    });

    it("should return the correct view model when a meeting venue doesn't exist", () => {
      const updatedItemsEdges = [
        ...selectableItemsRaceEdges,
        {
          startTime: "2020-11-12T17:00:00.000Z",
          venue: null,
          typename: "RaceMarketCard",
          urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
        },
      ];

      expect(createSelectableItems()(updatedItemsEdges, USER_DETAILS)).toEqual([
        {
          raceTime: "MOCKED_DATE",
          meetingName: "Cheltenham",
        },
        {
          raceTime: "MOCKED_DATE",
          meetingName: "Ruby",
          marketPromo: {
            signposting: "EXTRA_PLACES",
          },
        },
        {
          raceTime: "MOCKED_DATE",
          meetingName: "",
        },
      ]);
    });
  });

  describe("when the items are StatisticsItemEdges", () => {
    it("should return the correct view model", () => {
      expect(createSelectableItems()(selectableItemsStatisticEdges, USER_DETAILS)).toEqual([
        {
          title: "I18N.EVENT_STATS.TITLE",
          icon: "OPTA_STATS",
        },
        {
          title: "I18N.HEAD_TO_HEAD.TITLE",
          icon: "HEAD_TO_HEAD",
        },
        {
          title: "I18N.MATCH_STATS.TITLE",
          icon: "MATCH_STATS",
        },
        {
          title: "I18N.MATCH_TIMELINE.TITLE",
          icon: "MATCH_TIMELINE",
        },
        {
          title: "I18N.RECENT_FORM.TITLE",
          icon: "TEAM_FORM",
        },
        {
          title: "I18N.TEAM_LINEUPS.TITLE",
          icon: "TEAM_LINEUP",
        },
      ]);
    });
  });
});
