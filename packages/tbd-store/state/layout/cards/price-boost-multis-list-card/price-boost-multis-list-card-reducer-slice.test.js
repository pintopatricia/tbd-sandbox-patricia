import priceBoostMultisListCardReducer from "./price-boost-multis-list-card-reducer-slice";

// Define mock data
const urnMock = "ppb:tbd:card:pbmlcard";

const pbmlCard = {
  urn: urnMock,
  hasNextPage: false,
  endCursor: "AB==",
  items: [{ urn: "ppb:tbd:opportunity-2" }],
};

const stateMock = {
  [urnMock]: pbmlCard,
};

const existingStateMock = {
  "ppb:tbd:card:pbmlcard": {
    urn: "ppb:tbd:card:pbmlcard",
    endCursor: "za",
    hasNextPage: true,
    items: [{ urn: "ppb:tbd:opportunity" }],
  },
};

describe("priceboostmultislistcard reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = priceBoostMultisListCardReducer.reducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe("when don't have any action type", () => {
    it("must return the same state", () => {
      const state = priceBoostMultisListCardReducer.reducer({ state: stateMock }, {});
      expect(state).toEqual({ state: stateMock });
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    describe("when the urn is new", () => {
      it('should return the new state with "priceboostmultislist"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              PriceBoostMultisListCard: [pbmlCard],
            },
          },
        };
        const state = priceBoostMultisListCardReducer.reducer(undefined, action);
        expect(state).toEqual(stateMock);
      });
    });

    describe("when the card already exists", () => {
      it("should update endCursor for that card", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              PriceBoostMultisListCard: [pbmlCard],
            },
          },
        };
        const state = priceBoostMultisListCardReducer.reducer(existingStateMock, action);

        expect(state["ppb:tbd:card:pbmlcard"].endCursor).toEqual("AB==");
      });

      it("should update hasNextPage for that card", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              PriceBoostMultisListCard: [pbmlCard],
            },
          },
        };
        const state = priceBoostMultisListCardReducer.reducer(existingStateMock, action);

        expect(state["ppb:tbd:card:pbmlcard"].hasNextPage).toEqual(false);
      });

      it("should concat items for that card", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              PriceBoostMultisListCard: [pbmlCard],
            },
          },
        };
        const state = priceBoostMultisListCardReducer.reducer(existingStateMock, action);

        expect(state["ppb:tbd:card:pbmlcard"].items).toEqual([
          { urn: "ppb:tbd:opportunity" },
          { urn: "ppb:tbd:opportunity-2" },
        ]);
      });
    });
  });

  describe('when action type is "DELETE_LAYOUT"', () => {
    describe("when the card already exists", () => {
      it("should remove it", () => {
        const action = {
          type: "DELETE_LAYOUT",
        };
        const state = priceBoostMultisListCardReducer.reducer(existingStateMock, action);

        expect(state).toEqual({});
      });
    });
  });
});
