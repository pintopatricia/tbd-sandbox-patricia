import normalizeGenericViewLinkCardFragmentIntoGenericViewLinkCard from "./generic-view-link-card-normalizer";

const fragmentMock = {
  __typename: "GenericViewLinkCard",
  urn: "ppb:tbd:card:genericViewLink:generic:cHBiOnRiZDp2aWV3OmdlbmVyaWM6aW5wbGF5",
  genericViewLinkTitle: {
    __typename: "DisplayNameTitle",
    name: "inplay",
  },
  viewLink: {
    viewUrn: "ppb:tbd:view:generic:inplay",
    viewUrl: "view/generic:inplay",
  },
  badge: "INPLAY",
  sportIcon: {
    sport: { sportId: "3" },
  },
};

describe("normalizeGenericViewLinkCardFragmentIntoGenericViewLinkCard", () => {
  it("should return a data property with the generic view link card", () => {
    const { data } = normalizeGenericViewLinkCardFragmentIntoGenericViewLinkCard(fragmentMock);

    expect(data).toEqual({
      typename: "GenericViewLinkCard",
      urn: "ppb:tbd:card:genericViewLink:generic:cHBiOnRiZDp2aWV3OmdlbmVyaWM6aW5wbGF5",
      title: "inplay",
      viewLink: {
        viewUrl: "view/generic:inplay",
        viewUrn: "ppb:tbd:view:generic:inplay",
      },
      badge: "INPLAY",
      sportId: "3",
    });
  });
});
