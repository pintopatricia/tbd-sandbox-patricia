import meetingNormalizer from "./meeting-normalizer";

const BFF_RESPONSE = {
  __typename: "Meeting",
  urn: "ppb:meeting:29893526",
  name: "Marseille-Borely. 8th Jul",
  meetingId: "29893526",
  country: "FR",
  venue: "Marseille-Borely",
  sport: {
    urn: "ppb:eventType:7",
  },
  countryFlag: {
    small: "smallUrl",
  },
  date: "2020-07-08T10:20:00.000Z",
};

const BFF_RESPONSE_INCOMPLETE = {
  __typename: "Meeting",
  urn: "ppb:meeting:29893526",
  name: "Marseille-Borely. 8th Jul",
  meetingId: "29893526",
  country: "FR",
  venue: "Marseille-Borely",
  sport: {
    urn: "ppb:eventType:7",
  },
  countryFlag: null,
  date: null,
};

describe("Meeting normalizer", () => {
  describe("normalizeMeetingFragmentIntoMeeting", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = meetingNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "Meeting",
        urn: "ppb:meeting:29893526",
        venue: "Marseille-Borely",
        sportUrn: "ppb:eventType:7",
        country: "FR",
        countryFlag: {
          small: "smallUrl",
        },
        entityName: "Marseille-Borely. 8th Jul",
        meetingId: "29893526",
        date: "2020-07-08T10:20:00.000Z",
      });
    });

    it("should correctly transform the object when it has undefined properties", () => {
      const { data } = meetingNormalizer(BFF_RESPONSE_INCOMPLETE);

      expect(data).toEqual({
        typename: "Meeting",
        urn: "ppb:meeting:29893526",
        venue: "Marseille-Borely",
        sportUrn: "ppb:eventType:7",
        country: "FR",
        entityName: "Marseille-Borely. 8th Jul",
        meetingId: "29893526",
        countryFlag: undefined,
        date: undefined,
      });
    });
  });
});
