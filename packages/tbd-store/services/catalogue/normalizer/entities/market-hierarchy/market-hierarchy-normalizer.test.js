import marketHierarchyNormalizer from "./market-hierarchy-normalizer";

const BFF_EVENT_COMPETITION_HIERARCHY = {
  __typename: "EventCompetitionHierarchy",
  competition: {
    __typename: "Competition",
    urn: "ppb:competition:59",
    name: "German Bundesliga",
    competitionId: 59,
    sport: {
      urn: "ppb:eventType:1",
      name: "Soccer",
    },
  },
  sportevent: {
    urn: "ppb:event:1234",
    eventId: 1234,
    name: "Event Name",
    openDate: "2020-07-08T10:20:00.000Z",
  },
};

const BFF_EVENT_HIERARCHY = {
  __typename: "EventHierarchy",
  sportevent: {
    urn: "ppb:event:1234",
    eventId: 1234,
    name: "Event Name",
    openDate: "2020-07-08T10:20:00.000Z",
  },
};

const BFF_RACE_METTING_HIERARCHY = {
  __typename: "RaceHierarchy",
  race: {
    urn: "ppb:race:29893526.1020",
    startTime: "2020-07-08T10:20:00.000Z",
    name: "1m4f Hcap",
    raceId: "29893526.1020",
    meeting: {
      urn: "ppb:meeting:29893526",
      venue: "Washington",
      country: "ES",
      countryFlag: {
        small: "url",
      },
    },
  },
  meeting: {
    urn: "ppb:meeting:29893526",
    venue: "Washington",
    country: "ES",
    countryFlag: {
      small: "url",
    },
  },
};

describe("Market Hierarchy Normalizer", () => {
  describe("normalizeMarketHierarchyFragmentIntoMarketHierarchy", () => {
    describe("for event competition hierarchy", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = marketHierarchyNormalizer(BFF_EVENT_COMPETITION_HIERARCHY);

        expect(data).toEqual({
          competition: "ppb:competition:59",
          sportevent: "ppb:event:1234",
        });
      });
    });

    describe("for racing hierarchy", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = marketHierarchyNormalizer(BFF_RACE_METTING_HIERARCHY);

        expect(data).toEqual({
          meeting: "ppb:meeting:29893526",
          race: "ppb:race:29893526.1020",
        });
      });
    });

    describe("for event hierarchy", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = marketHierarchyNormalizer(BFF_EVENT_HIERARCHY);

        expect(data).toEqual({
          sportevent: "ppb:event:1234",
        });
      });
    });
  });
});
