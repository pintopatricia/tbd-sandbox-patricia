import sportNormalizer from "./sport-normalizer";

const BFF_RESPONSE = {
  __typename: "Sport",
  urn: "ppb:eventType:1",
  name: "Soccer",
  shortName: "Socr",
  sportId: 1,
};

describe("Sport normalizer", () => {
  describe("normalizeSportFragmentIntoSport", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = sportNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "Sport",
        name: "Soccer",
        shortName: "Socr",
        urn: "ppb:eventType:1",
        sportId: 1,
      });
    });

    describe("when the shortName from the fragment does not exist", () => {
      it("should return the data object with shortName as undefined", () => {
        const { data } = sportNormalizer({ ...BFF_RESPONSE, shortName: undefined });

        expect(data).toEqual({
          typename: "Sport",
          name: "Soccer",
          shortName: undefined,
          urn: "ppb:eventType:1",
          sportId: 1,
        });
      });
    });

    describe("when the shortName from the fragment is null", () => {
      it("should return the data object with shortName as undefined", () => {
        const { data } = sportNormalizer({ ...BFF_RESPONSE, shortName: null });

        expect(data).toEqual({
          typename: "Sport",
          name: "Soccer",
          shortName: undefined,
          urn: "ppb:eventType:1",
          sportId: 1,
        });
      });
    });
  });
});
