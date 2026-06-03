import matchStatSelectionNormalizer from "./match-stat-selection-normalizer";

const BFF_RESPONSE = {
  __typename: "MatchStatSelectionCard",
  displayPreviousOdd: true,
  market: {
    __typename: "SportsbookMarket",
    urn: "marketURN",
  },
  runner: {
    runnerURN: "runnerURN",
  },
  matchStatTitle: {
    playerNames: ["Player 1", "Player 2"],
    combiner: "AND",
  },
  matchStatSubtitle: "Subtitle",
  incidentType: "shots",
  statsDescription: true,
  urn: "ppb:tbd:card:matctStatSelection:924.235275395/35124862",
};

describe("MatchStatSelectionCard normalizer", () => {
  describe("normalizeMatchStatSelectionCardFragmentIntoMatchStatSelectionCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = matchStatSelectionNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        market: "marketURN",
        runner: "runnerURN",
        matchStatTitle: {
          playerNames: ["Player 1", "Player 2"],
          combiner: "AND",
        },
        matchStatSubtitle: "Subtitle",
        incidentType: "shots",
        statsDescription: true,
        urn: "ppb:tbd:card:matctStatSelection:924.235275395/35124862",
        typename: "MatchStatSelectionCard",
      });
    });
  });
});
