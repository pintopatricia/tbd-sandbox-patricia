import normalizeObbCardsStackedLayoutFragmentIntoObbCardsStackedLayout from "./obb-card-stacked-layout-normalizer";

const BFF_RESPONSE = {
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
          filterTags: [
            {
              label: {
                __typename: "DisplayNameTitle",
                name: "Shots On Target",
              },
              type: "TAG",
              __typename: "FilterTag",
            },
          ],
        },
      },
    ],
  },
};

describe("OBB card stacked layout normalizer", () => {
  describe("normalizeObbCardsStackedLayoutFragmentIntoObbCardsStackedLayout", () => {
    describe("when receiving valid props", () => {
      it("should correctly transform and return the data object", () => {
        const data = normalizeObbCardsStackedLayoutFragmentIntoObbCardsStackedLayout(BFF_RESPONSE);

        expect(data).toEqual({
          urn: "ppb:obb:cardslayout:stacked:xpto/obb_cards_layout$b65dbf9d",
          title: "Build Ups - choose your match",
          maxCardsToDisplay: undefined,
          isSelected: false,
          typename: "ObbCardsStackedLayout",
          items: [
            {
              urn: "ppb:tbd:obb:card:pvp:1",
              typename: "ObbPvpCard",
              filterTags: [{ type: "TAG", label: "Shots On Target" }],
            },
          ],
        });
      });
    });

    describe("when index is provided", () => {
      it("should set the first layout as selected", () => {
        const data = normalizeObbCardsStackedLayoutFragmentIntoObbCardsStackedLayout(BFF_RESPONSE, 0);

        expect(data.isSelected).toBe(true);
      });
    });

    describe("when maxCardsToDisplay is provided", () => {
      it("should set the maxCardsToDisplay property", () => {
        const data = normalizeObbCardsStackedLayoutFragmentIntoObbCardsStackedLayout({
          ...BFF_RESPONSE,
          maxCardsToDisplay: 3,
        });

        expect(data.maxCardsToDisplay).toBe(3);
      });
    });
  });
});
