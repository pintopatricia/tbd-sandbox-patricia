import normalizeGameViewFragmentIntoGameView from "./game-view-normalizer";

const BFF_RESPONSE = {
  __typename: "GameView",
  urn: "ppb:tbd:view:game:1",
  url: "games/game:1",
  items: {
    edges: [
      {
        node: {
          __typename: "GameCard",
          urn: "ppb:tbd:card:game:1",
        },
      },
    ],
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
  navigationItem: {
    __typename: "NavigationItem",
    title: "Back Navigation Item",
  },
};

describe("Game view normalizer", () => {
  describe("normalizeGameViewFragmentIntoGameView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeGameViewFragmentIntoGameView(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "GameCard",
            urn: "ppb:tbd:card:game:1",
          },
        ],
        typename: "GameView",
        urn: "ppb:tbd:view:game:1",
        url: "games/game:1",
        navigationItem: {
          __typename: "NavigationItem",
          title: "Back Navigation Item",
        },
      });
    });
  });
});
