import normalizeSwimlaneIndexedCardGroupFragmentIntoCardGroup from "./swimlane-indexed-card-group-normalizer";
import normalizeSwimlaneCardGroupFragmentIntoSwimlaneCardGroup from "../swimlane-card-group/swimlane-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "SwimlaneIndexedCardGroup",
  urn: "ppb:tbd:cardgroup:swimlaneindexed:4abeeba8/s/1",
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
  hint: 2,
  swimlaneItems: {
    edges: [
      {
        node: {
          __typename: "RaceTimeRangeCard",
          urn: "ppb:tbd:card:racetimerange:29970405",
        },
      },
    ],
  },
};

describe("Card group normalizer", () => {
  describe("normalizeSwimlaneIndexedCardGroupFragmentIntoCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeSwimlaneIndexedCardGroupFragmentIntoCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        urn: "ppb:tbd:cardgroup:swimlaneindexed:4abeeba8/s/1",
        displayMode: "SCROLLABLE",
        hint: 2,
        items: [
          {
            typename: "RaceTimeRangeCard",
            urn: "ppb:tbd:card:racetimerange:29970405",
          },
        ],
        title: "In-Play",
        displayName: "translation",
        typename: "SwimlaneIndexedCardGroup",
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
        typename: "SwimlaneIndexedCardGroup",
        urn: "ppb:tbd:cardgroup:swimlaneindexed:4abeeba8/s/1",
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

      const { data } = normalizeSwimlaneIndexedCardGroupFragmentIntoCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        displayMode: "SCROLLABLE",
        hint: 2,
        items: [{ urn: "ppb:tbd:card:racetimerange:29970405", typename: "RaceTimeRangeCard" }],
        title: undefined,
        displayName: "translation",
        typename: "SwimlaneIndexedCardGroup",
        urn: "ppb:tbd:cardgroup:swimlaneindexed:4abeeba8/s/1",
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

      const { data } = normalizeSwimlaneIndexedCardGroupFragmentIntoCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        displayMode: "SCROLLABLE",
        hint: 2,
        items: [{ urn: "ppb:tbd:card:racetimerange:29970405", typename: "RaceTimeRangeCard" }],
        title: "In-Play",
        displayName: undefined,
        typename: "SwimlaneIndexedCardGroup",
        urn: "ppb:tbd:cardgroup:swimlaneindexed:4abeeba8/s/1",
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
