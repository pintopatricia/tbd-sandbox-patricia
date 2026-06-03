import { getFAQDataByContentSummaryCard, dataBuildersByCardType } from "./seo-structured-data-builders";

jest.mock("../../state/layout-snapshot", () => ({
  getLayoutSnapshot: jest.fn(),
}));

const mockState = {
  layouts: {
    views: {
      event: {
        "ppb:tbd:view:event:12345": {
          typename: "EventView",
          sportevent: "ppb:event:12345",
        },
      },
    },
    cards: {
      contentsummary: {
        "ppb:tbd:card:contentsummary:12345": {
          typename: "ContentSummaryCard",
          sections: [
            {
              includeToFaq: true,
              title: "test",
              items: [{ text: "test" }],
            },
          ],
        },
      },
      racemarkets: {
        "ppb:tbd:card:racemarket:12345": {
          typename: "RaceMarketCard",
          race: "ppb:race:12345",
          raceViewLink: {
            viewUrl: "https://example.com/event/123",
          },
        },
      },
      eventmarkets: {
        "ppb:tbd:card:eventmarket:12345": {
          typename: "EventMarketCard",
          eventViewLink: {
            viewUrl: "https://example.com/event/123",
          },
          sportevent: "ppb:event:12345",
        },
      },
      raceviewlinks: {
        "ppb:tbd:card:raceviewlinks:12345": {
          typename: "RaceViewLinksCard",
          race: "ppb:race:12345",
          raceViewLinks: [
            {
              race: "ppb:race:12345",
              viewLink: {
                viewUrl: "https://example.com/event/123",
              },
            },
          ],
        },
      },
    },
  },
  entities: {
    competitions: {
      "ppb:competition:123": {
        typename: "Competition",
        name: "Competition Name",
        sport: "ppb:sport:1",
      },
    },
    sportevents: {
      "ppb:event:12345": {
        typename: "SportEvent",
        sportId: 12345,
        competition: "ppb:competition:123",
        openDate: "2021-01-01",
      },
    },
    sports: {
      "ppb:sport:1": {
        typename: "Sport",
        sportId: 1,
      },
    },
    races: {
      "ppb:race:12345": {
        typename: "Race",
        name: "Race Name",
        meeting: "ppb:meeting:12345",
        startTime: "2021-01-01T03:00:00.000Z",
      },
    },
    meetings: {
      "ppb:meeting:12345": {
        typename: "Meeting",
        name: "Meeting Name",
        sportUrn: "ppb:sport:1",
        venue: "Meeting Venue",
      },
    },
  },
  router: {
    currentUrn: "ppb:tbd:view:event:12345",
    currentUrl: "https://example.com/event/123",
  },
};

describe("Seo Structured Data Builders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getFAQDataByContentSummaryCard", () => {
    it("should return undefined when no ContentSummaryCard is found", () => {
      const result = getFAQDataByContentSummaryCard("urn:random", mockState);

      expect(result).toBeUndefined();
    });

    it("should return the data when ContentSummaryCard is found", () => {
      const result = getFAQDataByContentSummaryCard("ppb:tbd:card:contentsummary:12345", mockState);

      expect(result).toEqual([{ name: "test", text: "test" }]);
    });
  });

  describe("getDataByEventMarketCard", () => {
    it("should return undefined when no EventMarketCard is found", () => {
      const result = dataBuildersByCardType.EventMarketCard("urn:random", mockState);

      expect(result).toBeUndefined();
    });

    it("should return the data when EventMarketCard is found", () => {
      const result = dataBuildersByCardType.EventMarketCard("ppb:tbd:card:eventmarket:12345", mockState);

      expect(result).toEqual({
        competitionName: "Competition Name",
        endDate: "2021-01-01T03:00:00.000Z",
        eventURL: "https://example.com/event/123",
        name: undefined,
        startDate: "2021-01-01",
      });
    });
  });

  describe("getDataByEventSwitcherCard", () => {
    it("should return undefined when no EventView is found", () => {
      const result = dataBuildersByCardType.GenericSwitcherCard("urn:random", {
        ...mockState,
        router: {
          currentUrn: undefined,
          currentUrl: undefined,
        },
      });

      expect(result).toBeUndefined();
    });

    it("should return the data when EventView is found", () => {
      const result = dataBuildersByCardType.GenericSwitcherCard("ppb:tbd:card:genericswitcher:12345", mockState);

      expect(result).toEqual({
        competitionName: "Competition Name",
        endDate: "2021-01-01T03:00:00.000Z",
        eventURL: "https://example.com/event/123",
        name: undefined,
        startDate: "2021-01-01",
      });
    });
  });

  describe("getDataByRaceViewLinksCard", () => {
    it("should return undefined when no RaceViewLinksCard is found", () => {
      const result = dataBuildersByCardType.RaceViewLinksCard("urn:random", mockState);

      expect(result).toBeUndefined();
    });

    it("should return the data when RaceViewLinksCard is found", () => {
      const result = dataBuildersByCardType.RaceViewLinksCard("ppb:tbd:card:raceviewlinks:12345", mockState);

      expect(result).toEqual({
        competitionName: "Meeting Venue",
        endDate: "2021-01-01T06:00:00.000Z",
        eventURL: "https://example.com/event/123",
        name: "Meeting Venue Race Name",
        startDate: "2021-01-01T03:00:00.000Z",
      });
    });
  });

  describe("getDataByRaceMarketCard", () => {
    it("should return undefined when no RaceMarketCard is found", () => {
      const result = dataBuildersByCardType.RaceMarketCard("urn:random", mockState);

      expect(result).toBeUndefined();
    });

    it("should return the data when RaceViewLinksCard is found", () => {
      const result = dataBuildersByCardType.RaceMarketCard("ppb:tbd:card:racemarket:12345", mockState);

      expect(result).toEqual({
        competitionName: "Meeting Venue",
        endDate: "2021-01-01T06:00:00.000Z",
        eventURL: "https://example.com/event/123",
        name: "Meeting Venue Race Name",
        startDate: "2021-01-01T03:00:00.000Z",
      });
    });
  });
});
