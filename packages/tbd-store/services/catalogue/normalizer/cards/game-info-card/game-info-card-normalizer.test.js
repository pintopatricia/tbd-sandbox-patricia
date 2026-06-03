import normalizeGameInfoCardFragmentIntoGameInfoCard from "./game-info-card-normalizer";

jest.mock("../../entities/game/game-normalizer", () => jest.fn(() => "game-normalized"));

describe("normalizeGameInfoCardFragmentIntoGameInfoCard", () => {
  const fragmentMock = {
    __typename: "GameInfoCard",
    urn: "urn",
    game: {
      urn: "game:slots",
    },
  };

  it("should correctly normalize the card", () => {
    const { data } = normalizeGameInfoCardFragmentIntoGameInfoCard(fragmentMock);

    expect(data).toEqual({
      typename: "GameInfoCard",
      urn: "urn",
      game: "game:slots",
    });
  });
});
