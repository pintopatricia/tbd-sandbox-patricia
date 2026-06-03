import highlightedSelectionNormalizer from "./highlighted-selection-normalizer";

const BFF_RESPONSE = {
  __typename: "HighlightedSelectionCard",
  displayPreviousOdd: true,
  market: {
    __typename: "SportsbookMarket",
    urn: "marketURN",
  },
  runner: {
    runnerURN: "runnerURN",
  },
  title: "Highlighted Selection Card Name",
  urn: "ppb:tbd:card:highlightedSelection:924.235275395/35124862",
};

describe("HighlightedSelectionCard normalizer", () => {
  describe("normalizeHighlightedSelectionCardFragmentIntoHighlightedSelectionCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = highlightedSelectionNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        displayPreviousOdd: true,
        market: "marketURN",
        runner: "runnerURN",
        title: "Highlighted Selection Card Name",
        urn: "ppb:tbd:card:highlightedSelection:924.235275395/35124862",
        typename: "HighlightedSelectionCard",
      });
    });
  });
});
