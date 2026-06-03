import sportEventNormalizer from "./sport-event-normalizer";

const BFF_RESPONSE = {
  __typename: "SportEvent",
  urn: "ppb:event:1",
  eventId: 1,
  name: "Event Name",
  openDate: "2020-07-08T10:20:00.000Z",
  competition: {
    __typename: "Competition",
    urn: "ppb:competition:1",
    name: "Premier League",
  },
};

describe("SportEvent normalizer", () => {
  describe("normalizeSportEventFragmentIntoSportEvent", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = sportEventNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "SportEvent",
        urn: "ppb:event:1",
        eventId: 1,
        name: "Event Name",
        competition: "ppb:competition:1",
        openDate: "2020-07-08T10:20:00.000Z",
      });
    });
  });
});
