import { createHighlightedSelectionCardsByURNsSelector } from "./highlighted-selection-card-selectors";

describe("createHighlightedSelectionCardsByURNsSelector", () => {
  const stateMock = {
    "ppb:tbd:card:highlightedSelection:924.123456789/123": {
      badge: "ODDSBOOST",
      displayPreviousOdd: true,
      market: "ppb:sbkMarket:924.123456789",
      runner: {
        handicap: 0,
        runnerURN: "ppb:sbkRunner:924.123456789/123",
        selectionId: 123,
      },
      title: "An Oddsboost with Highlighted Selection card",
      urn: "ppb:tbd:card:highlightedSelection:924.123456789/123",
      type: "HIGHLIGHTED_SELECTION_CARD",
    },
  };

  it("should return an empty array when no URNs match any HighlightedSelectionCards", () => {
    const highlightedSelectionCardsURNs = createHighlightedSelectionCardsByURNsSelector()(stateMock, ["URN"]);
    expect(highlightedSelectionCardsURNs).toEqual([]);
  });

  it("should return an array with URNs that are HighlightedSelectionCard", () => {
    const highlightedSelectionCardsURNs = createHighlightedSelectionCardsByURNsSelector()(stateMock, [
      "ppb:tbd:card:highlightedSelection:924.123456789/123",
    ]);
    expect(highlightedSelectionCardsURNs).toEqual(["ppb:tbd:card:highlightedSelection:924.123456789/123"]);
  });
});
