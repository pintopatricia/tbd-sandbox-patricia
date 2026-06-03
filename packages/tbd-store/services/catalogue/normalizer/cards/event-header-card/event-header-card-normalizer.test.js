import normalizeEventHeaderCardFragmentIntoEventHeaderCard from "./event-header-card-normalizer";

const BFF_RESPONSE = {
  __typename: "EventHeaderCard",
  urn: "ppb:tbd:card:eventHeader:someId/0",
  title: "title",
  subtitle: "subtitle",
  tertiaryTitle: "tertiaryTitle",
  sportId: "sportId",
  date: "date",
};

describe("EventHeaderCard normalizer", () => {
  describe("normalizeEventHeaderCardFragmentIntoEventHeaderCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeEventHeaderCardFragmentIntoEventHeaderCard(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "EventHeaderCard",
        urn: "ppb:tbd:card:eventHeader:someId/0",
        title: "title",
        subtitle: "subtitle",
        tertiaryTitle: "tertiaryTitle",
        sportId: "sportId",
        date: "date",
      });
    });
  });
});
