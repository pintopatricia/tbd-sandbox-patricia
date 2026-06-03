import normalizeRugbyUnionFixtureFragmentIntoRugbyUnionFixture from "./rugby-union-fixture-normalizer";

const BFF_RESPONSE = {
  __typename: "RugbyUnionFixture",
  urn: "ppb:fixture:31132023",
  score: {
    scoreHome: 33,
    scoreAway: 15,
  },
  halfTimeScore: {
    halfTimeScoreHome: 14,
    halfTimeScoreAway: 20,
  },
};

describe("normalizeRugbyUnionFixtureFragmentIntoRugbyUnionFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("when RugbyUnion data is not provided", () => {
    it("should return correct default values", () => {
      const { data } = normalizeRugbyUnionFixtureFragmentIntoRugbyUnionFixture({
        ...BFF_RESPONSE,
        score: undefined,
        halfTimeScore: undefined,
      });

      expect(data).toEqual({
        typename: "RugbyUnionFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        halfTimeScore: undefined,
      });
    });
  });

  describe("when RugbyUnion score is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeRugbyUnionFixtureFragmentIntoRugbyUnionFixture({
        ...BFF_RESPONSE,
        halfTimeScore: undefined,
      });

      expect(data).toEqual({
        typename: "RugbyUnionFixture",
        urn: "ppb:fixture:31132023",
        score: {
          home: 33,
          away: 15,
        },
        halfTimeScore: undefined,
      });
    });
  });

  describe("when RugbyUnion half time score is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeRugbyUnionFixtureFragmentIntoRugbyUnionFixture({
        ...BFF_RESPONSE,
        score: undefined,
      });

      expect(data).toEqual({
        typename: "RugbyUnionFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        halfTimeScore: {
          home: 14,
          away: 20,
        },
      });
    });
  });

  describe("when RugbyUnion isAmericanFormat is provided", () => {
    it("should return correct isAmericanFormat", () => {
      const { data } = normalizeRugbyUnionFixtureFragmentIntoRugbyUnionFixture({
        ...BFF_RESPONSE,
        isAmericanFormat: true,
        score: null,
        halfTimeScore: null,
      });

      expect(data).toEqual(expect.objectContaining({ isAmericanFormat: true }));
    });
  });

  describe("when RugbyUnion runnerNames is provided", () => {
    it("should return correct runnerNames", () => {
      const { data } = normalizeRugbyUnionFixtureFragmentIntoRugbyUnionFixture({
        ...BFF_RESPONSE,
        runnerNames: {
          home: "home",
          away: "away",
        },
        score: null,
        halfTimeScore: null,
      });

      expect(data).toEqual(
        expect.objectContaining({
          runnerNames: {
            home: "home",
            away: "away",
          },
        }),
      );
    });
  });
});
