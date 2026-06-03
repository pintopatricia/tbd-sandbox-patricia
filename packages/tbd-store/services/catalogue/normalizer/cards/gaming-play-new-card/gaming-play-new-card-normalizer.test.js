import normalizeGamingPlayNewCardFragmentIntoGamingPlayNewCard from "./gaming-play-new-card-normalizer";

describe("normalizeGamingPlayNewCardFragmentIntoGamingPlayNewCard", () => {
  const fragmentMock = {
    __typename: "GamingPlayNewCard",
    urn: "urn",
    title: "title",
    subtitle: "subtitle",
    endDate: "12.12.2022",
    optInState: "COMPLETED",
    tags: ["styw"],
    backgroundImage: [],
    logoImage: [],
    termsAndConditions: {
      url: "url",
    },
  };

  it("should correctly normalize the card", () => {
    expect(normalizeGamingPlayNewCardFragmentIntoGamingPlayNewCard(fragmentMock)).toEqual({
      data: {
        typename: "GamingPlayNewCard",
        urn: "urn",
        backgroundImage: [],
        logoImage: [],
        termsAndConditions: {
          url: "url",
        },
        title: "title",
        subtitle: "subtitle",
        endDate: "12.12.2022",
        optInState: "COMPLETED",
        tags: ["styw"],
      },
    });
  });
});
