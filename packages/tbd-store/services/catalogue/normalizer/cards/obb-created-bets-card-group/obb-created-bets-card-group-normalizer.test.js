import normalizeObbCreatedBetsCardGroupFragmentIntoObbCreatedBetsCardGroup from "./obb-created-bets-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "ObbCreatedBetsCardGroup",
  urn: "obb:createdbets:cardgroup:urn:1",
  obbCreatedBetsCardGroupTitle: {
    name: "Created Bets",
    __typename: "DisplayNameTitle",
  },
  headerBadgeLabel: {
    name: "NEW",
    __typename: "DisplayNameTitle",
  },
  headerViewLink: {
    viewUrl: "/created-bets",
    viewUrn: "view:urn:created-bets",
  },
  cards: {
    edges: [
      {
        node: {
          __typename: "ObbCreatedBetsCard",
          urn: "obb:createdbets:card:urn:1",
          bettingOpportunities: ["bo1", "bo2"],
        },
      },
    ],
  },
};

describe("OBB created bets card group normalizer", () => {
  describe("normalizeObbCreatedBetsCardGroupFragmentIntoObbCreatedBetsCardGroup", () => {
    it("should correctly transform and return the data object when receiving valid props", () => {
      const { data } = normalizeObbCreatedBetsCardGroupFragmentIntoObbCreatedBetsCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        urn: "obb:createdbets:cardgroup:urn:1",
        title: "Created Bets",
        typename: "ObbCreatedBetsCardGroup",
        headerBadgeLabel: "NEW",
        headerViewLink: {
          viewUrl: "/created-bets",
          viewUrn: "view:urn:created-bets",
        },
        items: [
          {
            urn: "obb:createdbets:card:urn:1",
            typename: "ObbCreatedBetsCard",
          },
        ],
      });
    });

    it("should fallback the headerBadgeLabel to undefined when missing", () => {
      const responseWithMissingHeaderBadgeLabel = {
        ...BFF_RESPONSE,
        headerBadgeLabel: null,
      };

      const { data } = normalizeObbCreatedBetsCardGroupFragmentIntoObbCreatedBetsCardGroup(
        responseWithMissingHeaderBadgeLabel,
      );

      expect(data.headerBadgeLabel).toBeUndefined();
    });

    it("should fallback the headerViewLink to undefined when missing", () => {
      const responseWithMissingHeaderViewLink = {
        ...BFF_RESPONSE,
        headerViewLink: null,
      };

      const { data } = normalizeObbCreatedBetsCardGroupFragmentIntoObbCreatedBetsCardGroup(
        responseWithMissingHeaderViewLink,
      );

      expect(data.headerViewLink).toBeUndefined();
    });

    it("should discard cards without betting opportunities", () => {
      const responseWithCardWithoutBO = {
        ...BFF_RESPONSE,
        cards: {
          edges: [
            {
              node: {
                __typename: "ObbCreatedBetsCard",
                urn: "obb:createdbets:card:urn:1",
                bettingOpportunities: [],
              },
            },
            {
              node: {
                __typename: "ObbCreatedBetsCard",
                urn: "obb:createdbets:card:urn:2",
                bettingOpportunities: ["bo1"],
              },
            },
          ],
        },
      };

      const { data } = normalizeObbCreatedBetsCardGroupFragmentIntoObbCreatedBetsCardGroup(responseWithCardWithoutBO);

      expect(data.items).toEqual([
        {
          urn: "obb:createdbets:card:urn:2",
          typename: "ObbCreatedBetsCard",
        },
      ]);
    });
  });
});
