import normalizeGamingJackpotCardFragmentIntoGamingJackpotCard from "./gaming-jackpot-card-normalizer";

describe("normalizeGamingJackpotCardFragmentIntoGamingJackpotCard", () => {
  const fragmentMock = {
    __typename: "GamingJackpotCard",
    urn: "fakeUrn",
    name: "name",
    logo: "logoUrl",
    jackpots: [{ urn: "jackpot1" }, { urn: "jackpot2" }, { urn: "jackpot3" }],
  };

  it("should correctly normalize the card", () => {
    expect(normalizeGamingJackpotCardFragmentIntoGamingJackpotCard(fragmentMock)).toEqual({
      data: {
        typename: "GamingJackpotCard",
        urn: "fakeUrn",
        name: "name",
        logo: "logoUrl",
        jackpots: ["jackpot1", "jackpot2", "jackpot3"],
      },
    });
  });
});
