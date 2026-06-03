import normalizeObbCardsSwimlaneLayoutFragmentIntoObbCardsSwimlaneLayout from "./obb-card-swimlane-layout-normalizer";

const BFF_RESPONSE = {
  __typename: "ObbCardsSwimlaneLayout",
  urn: "ppb:obb:cardslayout:swimlane:xpto/obb_cards_layout$b65dbf9d",
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

describe("OBB card swimlane layout normalizer", () => {
  describe("normalizeObbCardsSwimlaneLayoutFragmentIntoObbCardsSwimlaneLayout", () => {
    describe("when receiving valid props", () => {
      it("should correctly transform and return the data object", () => {
        const data = normalizeObbCardsSwimlaneLayoutFragmentIntoObbCardsSwimlaneLayout(BFF_RESPONSE);

        expect(data).toEqual({
          urn: "ppb:obb:cardslayout:swimlane:xpto/obb_cards_layout$b65dbf9d",
          title: "Build Ups - choose your match",
          typename: "ObbCardsSwimlaneLayout",
          isSelected: false,
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
        const data = normalizeObbCardsSwimlaneLayoutFragmentIntoObbCardsSwimlaneLayout(BFF_RESPONSE, 0);

        expect(data.isSelected).toBe(true);
      });
    });
  });
});
