import normalizeGamingJackpotFragmentIntoGamingJackpot from "./gaming-jackpot-normalizer";

describe("normalizeGamingJackpotFragmentIntoGamingJackpot", () => {
  const fragmentMock = {
    __typename: "GamingJackpot",
    urn: "fakeUrn",
    name: "Jackpot",
    value: 3008,
    state: "COLD",
    progress: 60,
    dropValue: 5000,
    dropTime: undefined,
    dropText: "Must drop by",
  };

  it("should correctly normalize the card", () => {
    expect(normalizeGamingJackpotFragmentIntoGamingJackpot(fragmentMock)).toEqual({
      data: {
        typename: "GamingJackpot",
        urn: "fakeUrn",
        name: "Jackpot",
        value: 3008,
        state: "COLD",
        progress: 60,
        dropValue: 5000,
        dropTime: undefined,
        dropText: "Must drop by",
      },
    });
  });
});
