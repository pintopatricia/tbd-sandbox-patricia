import normalizeGamingLinkCardFragmentIntoGamingLinkCard from "./gaming-link-card-normalizer";

jest.mock("../../../gql-entities-mapper", () => ({
  getCardIcon: jest.fn(() => "BINGO"),
}));

describe("normalizeGamingLinkCardFragmentIntoGamingLinkCard", () => {
  const fragmentMock = {
    __typename: "GamingLinkCard",
    urn: "gamingLink:slots",
    games: [
      {
        releaseDate: null,
        uid: "uid",
      },
    ],
    link: {
      label: "label",
      icon: "Bingo",
      viewLink: {
        viewUrl: "url",
        viewUrn: "urn",
      },
    },
  };

  it("should correctly normalize the card", () => {
    expect(normalizeGamingLinkCardFragmentIntoGamingLinkCard(fragmentMock)).toEqual({
      data: {
        typename: "GamingLinkCard",
        urn: "gamingLink:slots",
        games: [
          {
            releaseDate: null,
            uid: "uid",
          },
        ],
        link: {
          label: "label",
          icon: "BINGO",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
      },
    });
  });
});
