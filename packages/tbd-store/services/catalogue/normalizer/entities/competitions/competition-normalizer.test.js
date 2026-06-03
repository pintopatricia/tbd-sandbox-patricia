import competitionNormalizer from "./competition-normalizer";

const BFF_RESPONSE = {
  __typename: "Competition",
  urn: "ppb:competition:59",
  name: "German Bundesliga",
  competitionId: 59,
  sport: {
    urn: "ppb:eventType:1",
    name: "Soccer",
  },
  logo: "logo",
  country: {
    urn: "ppb:competition:59",
    code: "code",
    flag: { vector: "flag" },
  },
};

const BFF_RESPONSE_BASIC = {
  __typename: "Competition",
  urn: "ppb:competition:59",
  name: "German Bundesliga",
  competitionId: 59,
  sport: {
    urn: "ppb:eventType:1",
    name: "Soccer",
  },
};

describe("Competition normalizer", () => {
  describe("normalizeCompetitionFragmentIntoCompetition", () => {
    describe("when competition has all the data", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = competitionNormalizer(BFF_RESPONSE);

        expect(data).toEqual({
          typename: "Competition",
          competitionId: 59,
          name: "German Bundesliga",
          sport: "ppb:eventType:1",
          urn: "ppb:competition:59",
          logo: "logo",
          country: {
            urn: "ppb:competition:59",
            code: "code",
            flag: "flag",
          },
        });
      });
    });

    describe("when competition only has competition basic data", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = competitionNormalizer(BFF_RESPONSE_BASIC);

        expect(data).toEqual({
          typename: "Competition",
          competitionId: 59,
          name: "German Bundesliga",
          sport: "ppb:eventType:1",
          urn: "ppb:competition:59",
        });
      });
    });
  });
});
