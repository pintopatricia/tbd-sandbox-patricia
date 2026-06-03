import victim from "./team-form-card-normalizer";

const BFF_RESPONSE = {
  __typename: "TeamFormCard",
  urn: "ppb:recentFormCard:29625161",
  footballFixture: {
    urn: "ppb:fixture:29625161",
  },
};

describe("TeamFormCard normalizer", () => {
  describe("normalizeTeamFormCardFragmentIntoTeamFormCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = victim(BFF_RESPONSE);

      expect(data).toEqual({
        fixture: "ppb:fixture:29625161",
        typename: "TeamFormCard",
        urn: "ppb:recentFormCard:29625161",
      });
    });
  });
});
