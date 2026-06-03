import sportRibbonCardGroupNormalizer from "./sport-ribbon-card-group-normalizer";

const BFF_RESPONSE_MOCK = {
  urn: "ppb:tbd:cardgroup:sportRibbon:123",
  __typename: "SportRibbonCardGroup",
  full: {
    edges: [
      {
        node: {
          __typename: "SportViewLinkCard",
          urn: "ppb:tbd:card:sportViewLink:1",
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            sportId: 1,
            shortName: "Football",
          },
          viewLink: {
            viewUrl: "/soccer/s-1",
            viewUrn: "ppb:tbd:view:sport:1",
          },
        },
      },
      {
        label: null,
        node: {
          __typename: "GenericViewLinkCard",
          urn: "ppb:tbd:card:genericViewLink:2",
          genericViewLinkTitle: {
            __typename: "DisplayNameTitle",
            name: "Inplay",
          },
          viewLink: {
            viewUrl: "/inplay/d-inplay",
            viewUrn: "ppb:tbd:view:generic:inplay",
          },
          badge: "Inplay",
        },
      },
      {
        label: "NEW",
        node: {
          __typename: "GenericViewLinkCard",
          urn: "ppb:tbd:card:genericViewLink:external",
          genericViewLinkTitle: {
            __typename: "DisplayNameTitle",
            name: "SuperSpins",
          },
          viewLink: {
            viewUrl: "https://www.google.com",
            viewUrn: "ppb:tbd:view:external:external",
          },
          badge: null,
          icon: {
            id: "icon-id",
            category: "icon-category",
          },
        },
      },
    ],
  },
};

const EXPECTED_NORMALIZED_DATA = {
  typename: "SportRibbonCardGroup",
  urn: "ppb:tbd:cardgroup:sportRibbon:123",
  items: [
    {
      urn: "ppb:tbd:card:sportViewLink:1",
      typename: "SportViewLinkCard",
      sportId: 1,
      title: "Football",
      viewLink: {
        viewUrl: "/soccer/s-1",
        viewUrn: "ppb:tbd:view:sport:1",
      },
    },
    {
      urn: "ppb:tbd:card:genericViewLink:2",
      typename: "GenericViewLinkCard",
      label: null,
      badge: "Inplay",
      title: "Inplay",
      viewLink: {
        viewUrl: "/inplay/d-inplay",
        viewUrn: "ppb:tbd:view:generic:inplay",
      },
    },
    {
      urn: "ppb:tbd:card:genericViewLink:external",
      typename: "GenericViewLinkCard",
      label: "NEW",
      badge: null,
      title: "SuperSpins",
      viewLink: {
        viewUrl: "https://www.google.com",
        viewUrn: "ppb:tbd:view:external:external",
      },
      icon: {
        category: "icon-category",
        id: "icon-id",
      },
    },
  ],
};

describe("SportRibbonCardGroup normalizer", () => {
  describe("when title is defined", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = sportRibbonCardGroupNormalizer(BFF_RESPONSE_MOCK);

      expect(data).toEqual(EXPECTED_NORMALIZED_DATA);
    });
  });
});
