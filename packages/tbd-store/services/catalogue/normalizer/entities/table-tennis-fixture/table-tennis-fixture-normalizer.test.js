import normalizeTableTennisFixtureFragmentIntoTableTennisFixture from "./table-tennis-fixture-normalizer";

const BFF_RESPONSE = {
  __typename: "TableTennisFixture",
  urn: "ppb:fixture:123456789",
  currentSet: {
    number: 2,
    currentServer: "HOME",
    score: {
      home: 3,
      away: 4,
    },
  },
  setsWon: {
    home: 2,
    away: 1,
  },
  previousSets: [
    {
      number: 1,
      currentServer: null,
      score: {
        home: 1,
        away: 2,
      },
    },
  ],
};

describe("Table Tennis fixture normalizer", () => {
  describe("normalizeTableTennisFixtureFragmentIntoTableTennisFixture", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeTableTennisFixtureFragmentIntoTableTennisFixture(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "TableTennisFixture",
        urn: "ppb:fixture:123456789",
        currentSet: {
          number: 2,
          currentServer: "HOME",
          score: {
            home: 3,
            away: 4,
          },
        },
        setsWon: {
          home: 2,
          away: 1,
        },
        previousSets: [
          {
            number: 1,
            currentServer: undefined,
            score: {
              home: 1,
              away: 2,
            },
          },
        ],
      });
    });

    it("should have defaults for undefined values", () => {
      const { data } = normalizeTableTennisFixtureFragmentIntoTableTennisFixture({
        ...BFF_RESPONSE,
        currentSet: undefined,
        setsWon: undefined,
        previousSets: undefined,
      });

      expect(data).toEqual({
        typename: "TableTennisFixture",
        urn: "ppb:fixture:123456789",
        currentSet: undefined,
        setsWon: undefined,
        previousSets: undefined,
      });
    });

    describe("when providing isAmericanFormat", () => {
      it("should return correct isAmericanFormat", () => {
        const { data } = normalizeTableTennisFixtureFragmentIntoTableTennisFixture({
          ...BFF_RESPONSE,
          isAmericanFormat: true,
        });

        expect(data).toEqual(expect.objectContaining({ isAmericanFormat: true }));
      });
    });

    describe("when providing runnerNames", () => {
      it("should return correct runnerNames", () => {
        const { data } = normalizeTableTennisFixtureFragmentIntoTableTennisFixture({
          ...BFF_RESPONSE,
          runnerNames: {
            home: "home",
            away: "away",
          },
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
});
