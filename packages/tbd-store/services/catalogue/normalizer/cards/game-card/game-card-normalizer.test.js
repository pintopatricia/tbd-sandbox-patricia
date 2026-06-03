import normalizeGameCardFragmentIntoGameCard from "./game-card-normalizer";

jest.mock("../../entities/game/game-normalizer", () => jest.fn(() => "game-normalized"));

describe("normalizeGameCardFragmentIntoGameCard", () => {
  const fragmentMock = {
    __typename: "GameCard",
    urn: "urn",
    game: {
      urn: "game:slots",
    },
  };

  it("should correctly normalize the card", () => {
    const { data } = normalizeGameCardFragmentIntoGameCard(fragmentMock);

    expect(data).toEqual({
      game: "game:slots",
      typename: "GameCard",
      urn: "urn",
    });
  });
});
