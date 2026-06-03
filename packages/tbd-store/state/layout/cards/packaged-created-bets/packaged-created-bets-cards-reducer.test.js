import packagedCreatedBetsCardReducer from "./packaged-created-bets-cards-reducer-slice";

// Define mock data
const urnMock = "ppb:tbd:card:pcbcard";

const pcbCard = {
  urn: urnMock,
  hasNextPage: false,
  endCursor: "AB==",
  items: [{ urn: "ppb:tbd:opportunity-2" }],
};

const stateMock = {
  [urnMock]: pcbCard,
};

const existingStateMock = {
  "ppb:tbd:card:pcbcard": {
    urn: "ppb:tbd:card:pcbcard",
    endCursor: "za",
    hasNextPage: true,
    items: [{ urn: "ppb:tbd:opportunity" }],
  },
};

describe("packagedcreatedbets reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = packagedCreatedBetsCardReducer.reducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe("when don't have any action type", () => {
    it("must return the same state", () => {
      const state = packagedCreatedBetsCardReducer.reducer({ state: stateMock }, {});
      expect(state).toEqual({ state: stateMock });
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    describe("when the urn is new", () => {
      it('should return the new state with "packagedcreatedbets"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              PackagedCreatedBetsCard: [pcbCard],
            },
          },
        };
        const state = packagedCreatedBetsCardReducer.reducer(undefined, action);
        expect(state).toEqual(stateMock);
      });
    });

    describe("when the card already exists", () => {
      it("should update endCursor for that card", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              PackagedCreatedBetsCard: [pcbCard],
            },
          },
        };
        const state = packagedCreatedBetsCardReducer.reducer(existingStateMock, action);

        expect(state["ppb:tbd:card:pcbcard"].endCursor).toEqual("AB==");
      });

      it("should update hasNextPage for that card", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              PackagedCreatedBetsCard: [pcbCard],
            },
          },
        };
        const state = packagedCreatedBetsCardReducer.reducer(existingStateMock, action);

        expect(state["ppb:tbd:card:pcbcard"].hasNextPage).toEqual(false);
      });

      it("should concat items for that card", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              PackagedCreatedBetsCard: [pcbCard],
            },
          },
        };
        const state = packagedCreatedBetsCardReducer.reducer(existingStateMock, action);

        expect(state["ppb:tbd:card:pcbcard"].items).toEqual([
          { urn: "ppb:tbd:opportunity" },
          { urn: "ppb:tbd:opportunity-2" },
        ]);
      });
    });

    describe("when the card already exists but the action payload flag forceRefreshComponent is true", () => {
      it("should replace items for that card", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              PackagedCreatedBetsCard: [pcbCard],
            },
            forceRefreshComponent: true,
          },
        };
        const state = packagedCreatedBetsCardReducer.reducer(existingStateMock, action);

        expect(state["ppb:tbd:card:pcbcard"].items).toEqual([{ urn: "ppb:tbd:opportunity-2" }]);
      });
    });
  });

  describe('when action type is "DELETE_LAYOUT"', () => {
    describe("when the card already exists", () => {
      it("should remove it", () => {
        const action = {
          type: "DELETE_LAYOUT",
        };
        const state = packagedCreatedBetsCardReducer.reducer(existingStateMock, action);

        expect(state).toEqual({});
      });
    });
  });
});
