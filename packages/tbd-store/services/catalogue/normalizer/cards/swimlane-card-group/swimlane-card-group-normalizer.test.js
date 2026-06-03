import normalizeSwimlaneCardGroupFragmentIntoSwimlaneCardGroup from "./swimlane-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "SwimlaneCardGroup",
  urn: "ppb:tbd:cardgroup:swimlane:4abeeba8/s/1",
  cardGroupTitle: "In-Play",
  displayName: "translation",
  viewAll: {
    label: "View more",
    icon: "Slots",
    viewLink: {
      viewUrl: "url",
      viewUrn: "urn",
    },
  },
  full: {
    edges: [
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
        },
      },
    ],
  },
};

describe("Card group normalizer", () => {
  describe("normalizeSwimlaneCardGroupFragmentIntoSwimlaneCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeSwimlaneCardGroupFragmentIntoSwimlaneCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        displayMode: "SNAP",
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
          },
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
          },
        ],
        title: "In-Play",
        displayName: "translation",
        typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:4abeeba8/s/1",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
      });
    });

    it("should correctly transform and return the data object when items are false", () => {
      BFF_RESPONSE.partials.edges[0] = null;

      const { data } = normalizeSwimlaneCardGroupFragmentIntoSwimlaneCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        displayMode: "SNAP",
        items: [{ urn: "ppb:tbd:card:eventPrimaryMarket:29970406", typename: "EventMarketCard" }],
        title: "In-Play",
        displayName: "translation",
        typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:4abeeba8/s/1",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
      });
    });

    it("should correctly transform and return the data object when no edges are defined", () => {
      const BFF_RESPONSE_NO_EDGES = {
        ...BFF_RESPONSE,
        partials: { edges: [] },
      };
      const { data } = normalizeSwimlaneCardGroupFragmentIntoSwimlaneCardGroup(BFF_RESPONSE_NO_EDGES);

      expect(data).toEqual({
        displayMode: "SCROLLABLE",
        items: [],
        title: "In-Play",
        displayName: "translation",
        typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:4abeeba8/s/1",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
      });
    });

    it("should correctly transform and return the data object when the title is null", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        cardGroupTitle: null,
      };

      const { data } = normalizeSwimlaneCardGroupFragmentIntoSwimlaneCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        displayMode: "SNAP",
        items: [{ urn: "ppb:tbd:card:eventPrimaryMarket:29970406", typename: "EventMarketCard" }],
        title: undefined,
        displayName: "translation",
        typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:4abeeba8/s/1",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
      });
    });

    it("should correctly transform and return the data object when the displayName is null", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        displayName: null,
      };

      const { data } = normalizeSwimlaneCardGroupFragmentIntoSwimlaneCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        displayMode: "SNAP",
        items: [{ urn: "ppb:tbd:card:eventPrimaryMarket:29970406", typename: "EventMarketCard" }],
        title: "In-Play",
        displayName: undefined,
        typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:4abeeba8/s/1",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
      });
    });
  });
});
