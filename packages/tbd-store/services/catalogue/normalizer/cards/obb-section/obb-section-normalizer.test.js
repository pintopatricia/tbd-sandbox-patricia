import normalizeObbSectionFragmentIntoObbSection from "./obb-section-normalizer";

const BFF_RESPONSE = {
  __typename: "ObbSection",
  urn: "ppb:obb:section:xpto/e/b65dbf9d",
  obbSectionTitle: {
    name: "Shots",
    __typename: "DisplayNameTitle",
  },
  icon: null,
  isExpanded: true,
  layouts: {
    __typename: "ObbCardsLayoutConnection",
    edges: [
      {
        node: {
          __typename: "ObbCardsStackedLayout",
          urn: "ppb:obb:cardslayout:stacked:xpto/stacked1",
          title: {
            name: "Stacked Layout",
            __typename: "DisplayNameTitle",
          },
          cards: {
            edges: [
              {
                node: {
                  __typename: "ObbPvpCard",
                  urn: "ppb:tbd:obb:card:pvp:1",
                },
              },
            ],
          },
        },
      },
      {
        node: {
          __typename: "ObbCardsSwimlaneLayout",
          urn: "ppb:obb:cardslayout:swimlane:xpto/swimlane1",
          title: {
            name: "Swimlane Layout",
            __typename: "DisplayNameTitle",
          },
          cards: {
            edges: [
              {
                node: {
                  __typename: "ObbPvpCard",
                  urn: "ppb:tbd:obb:card:pvp:2",
                },
              },
            ],
          },
        },
      },
    ],
  },
};

describe("OBB section normalizer", () => {
  describe("normalizeObbSectionFragmentIntoObbSection", () => {
    describe("when receiving valid props", () => {
      it("should correctly transform and return the data object", () => {
        const data = normalizeObbSectionFragmentIntoObbSection(BFF_RESPONSE);

        expect(data).toStrictEqual({
          typename: "ObbSection",
          urn: "ppb:obb:section:xpto/e/b65dbf9d",
          title: "Shots",
          icon: null,
          isExpanded: true,
          layouts: [
            {
              typename: "ObbCardsStackedLayout",
              urn: "ppb:obb:cardslayout:stacked:xpto/stacked1",
              title: "Stacked Layout",
              maxCardsToDisplay: undefined,
              isSelected: true,
              badge: undefined,
              items: [{ urn: "ppb:tbd:obb:card:pvp:1", typename: "ObbPvpCard", filterTags: undefined }],
            },
            {
              typename: "ObbCardsSwimlaneLayout",
              urn: "ppb:obb:cardslayout:swimlane:xpto/swimlane1",
              title: "Swimlane Layout",
              isSelected: false,
              badge: undefined,
              items: [{ urn: "ppb:tbd:obb:card:pvp:2", typename: "ObbPvpCard", filterTags: undefined }],
            },
          ],
        });
      });
    });

    describe("when receiving null items in layouts edges", () => {
      it("should filter out null items", () => {
        const BFF_RESPONSE_WITH_NULL = {
          ...BFF_RESPONSE,
          layouts: {
            __typename: "ObbCardsLayoutConnection",
            edges: [
              null,
              {
                node: {
                  __typename: "ObbCardsStackedLayout",
                  urn: "ppb:obb:cardslayout:stacked:xpto/obb_cards_layout$b65dbf9d",
                  title: {
                    name: "Build Ups - choose your match",
                    __typename: "DisplayNameTitle",
                  },
                  cards: {
                    edges: [
                      {
                        node: {
                          __typename: "ObbPvpCard",
                          urn: "ppb:tbd:obb:card:pvp:1",
                        },
                      },
                    ],
                  },
                },
              },
              null,
            ],
          },
        };

        const data = normalizeObbSectionFragmentIntoObbSection(BFF_RESPONSE_WITH_NULL);

        expect(data.layouts).toHaveLength(1);
      });
    });
  });
});
